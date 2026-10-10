var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var TelegramService_1;
import { Injectable, Logger } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { UsersService } from '../users/users.service.js';
import { AiGatewayService } from '../ai/ai-gateway/ai-gateway.service.js';
import { ModelRegistryService } from '../ai/model-registry/model-registry.service.js';
let TelegramService = TelegramService_1 = class TelegramService {
    usersService;
    aiGatewayService;
    modelRegistryService;
    logger = new Logger(TelegramService_1.name);
    bot;
    sessions = new Map();
    constructor(usersService, aiGatewayService, modelRegistryService) {
        this.usersService = usersService;
        this.aiGatewayService = aiGatewayService;
        this.modelRegistryService = modelRegistryService;
        const token = process.env.TELEGRAM_BOT_TOKEN;
        if (!token) {
            this.logger.warn('TELEGRAM_BOT_TOKEN is not set. Bot will not start.');
            return;
        }
        this.bot = new Telegraf(token);
        this.registerHandlers();
    }
    async onModuleInit() {
        if (!this.bot)
            return;
        const webhookUrl = process.env.TELEGRAM_WEBHOOK_URL;
        if (webhookUrl) {
            this.logger.log(`Starting Telegram Bot via Webhook at ${webhookUrl}`);
            await this.bot.telegram.setWebhook(webhookUrl);
        }
        else {
            this.logger.log('Starting Telegram Bot via Long Polling');
            await this.bot.telegram.deleteWebhook();
            this.bot.launch();
        }
    }
    onModuleDestroy() {
        if (this.bot && !process.env.TELEGRAM_WEBHOOK_URL) {
            this.bot.stop('SIGINT');
        }
    }
    registerHandlers() {
        this.bot.start((ctx) => {
            this.logger.log(`Received /start from ${ctx.from.id}`);
            const payload = ctx.message && 'text' in ctx.message ? ctx.message.text.split(' ')[1] : null;
            if (payload) {
                ctx.reply(`Welcome to AYU! We're processing your link code: ${payload}`);
            }
            else {
                ctx.reply('Welcome to AYU! I am your personal health assistant. To link your account, please log in to the AYU patient portal and click "Connect to Telegram".\n\nTry /hospitals to see available mock clinics.');
            }
        });
        this.bot.help((ctx) => {
            ctx.reply('AYU Bot Help:\n- /start: Register or link account\n- /reminders: View upcoming meds\n- /hospitals: List available hospitals\n- /book <hospital_name>: Book an OPD token');
        });
        this.bot.command('reminders', (ctx) => {
            ctx.reply('You have no pending reminders today. Stay healthy!');
        });
        this.bot.command('hospitals', async (ctx) => {
            try {
                const { PrismaClient } = await import('@prisma/client');
                const prisma = new PrismaClient();
                const hospitals = await prisma.organization.findMany({ where: { type: 'CLINIC' } });
                if (hospitals.length === 0) {
                    return ctx.reply('No hospitals found. Did you run the seed script?');
                }
                let msg = '🏥 *Available Hospitals for OPD*\n\n';
                hospitals.forEach(h => {
                    msg += `• *${h.name}*\n`;
                });
                msg += '\nTo book a token, reply with: `/book Hospital Name`';
                await ctx.replyWithMarkdown(msg);
            }
            catch (err) {
                ctx.reply('Error fetching hospitals.');
            }
        });
        this.bot.command('book', async (ctx) => {
            const hospitalName = ctx.message.text.replace('/book ', '').trim();
            if (!hospitalName || hospitalName === '/book') {
                return ctx.reply('Please specify a hospital name. Example: `/book Citycare General Hospital`', { parse_mode: 'Markdown' });
            }
            try {
                const { PrismaClient } = await import('@prisma/client');
                const prisma = new PrismaClient();
                const hospital = await prisma.organization.findFirst({
                    where: { name: { contains: hospitalName } }
                });
                if (!hospital) {
                    return ctx.reply(`Sorry, I couldn't find a hospital matching "${hospitalName}". Try /hospitals to see the list.`);
                }
                const doctors = await prisma.doctor.findMany({
                    where: { clinicId: hospital.id },
                    include: { user: true }
                });
                if (doctors.length === 0) {
                    return ctx.reply(`Found ${hospital.name}, but there are no doctors available for booking right now.`);
                }
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                tomorrow.setHours(10, 0, 0, 0);
                const patient = await prisma.patient.findFirst();
                if (!patient) {
                    return ctx.reply('Your account is not linked to any patient record. Please link your account first.');
                }
                const doctor = doctors[0];
                const appointment = await prisma.appointment.create({
                    data: {
                        patientId: patient.id,
                        doctorId: doctor.id,
                        organizationId: hospital.id,
                        startsAt: tomorrow,
                        endsAt: new Date(tomorrow.getTime() + 30 * 60000),
                        reason: 'Telegram Booking',
                        status: 'SCHEDULED'
                    }
                });
                const confirmMsg = `✅ *OPD Token Confirmed*\n\n` +
                    `🏥 *Hospital:* ${hospital.name}\n` +
                    `👨‍⚕️ *Doctor ID:* ${doctor.registrationNumber} (${doctor.specialty})\n` +
                    `📅 *Date:* ${tomorrow.toDateString()}\n` +
                    `⏰ *Time:* 10:00 AM\n` +
                    `🔖 *Booking ID:* ${appointment.id.split('-')[0]}\n\n` +
                    `Please arrive 15 minutes early.`;
                await ctx.replyWithMarkdown(confirmMsg);
            }
            catch (err) {
                this.logger.error(`Booking error: ${err.message}`);
                ctx.reply('There was an error processing your booking request.');
            }
        });
        this.bot.on('photo', async (ctx) => {
            try {
                await ctx.sendChatAction('typing');
                await new Promise(resolve => setTimeout(resolve, 1500));
                const caption = ctx.message.caption || '';
                this.logger.log(`Received photo with caption: ${caption}`);
                const mockAnalysisMsg = `I've received your clinical report and analyzed the results.\n\n` +
                    `📄 *Document:* Kidney Function Test (KFT)\n` +
                    `👨‍⚕️ *Referred By:* Dr. Sachin Patil\n\n` +
                    `*Preliminary AI Analysis:*\n` +
                    `✅ BUN, Urea, Creatinine, Calcium, Potassium, and Sodium are all within normal reference ranges.\n` +
                    `⚠️ *eGFR* is slightly low at *87.08* (Normal is > 90).\n` +
                    `⚠️ *Uric Acid* is at *7.1* (Normal is 3.5 - 7.2), which is on the higher end.\n\n` +
                    `I have securely saved these structured results to your AYU health record. Would you like me to book a follow-up appointment with Dr. Sachin Patil?`;
                const userId = ctx.from.id;
                if (!this.sessions.has(userId))
                    this.sessions.set(userId, []);
                const history = this.sessions.get(userId);
                history.push({ role: 'user', content: `[Uploaded a Lab Report Image: ${caption}]` });
                history.push({ role: 'assistant', content: mockAnalysisMsg });
                if (history.length > 10)
                    history.splice(0, history.length - 10);
                await ctx.replyWithMarkdown(mockAnalysisMsg);
            }
            catch (error) {
                this.logger.error(`Error processing photo: ${error.message}`);
                await ctx.reply("I'm sorry, I encountered an error while processing your report.");
            }
        });
        this.bot.on('text', async (ctx) => {
            if (!ctx.message || !('text' in ctx.message))
                return;
            try {
                await ctx.sendChatAction('typing');
                const userId = ctx.from.id;
                if (!this.sessions.has(userId))
                    this.sessions.set(userId, []);
                const history = this.sessions.get(userId);
                const contextStr = history.map(msg => `${msg.role.toUpperCase()}: ${msg.content}`).join('\n\n');
                const userPrompt = contextStr.length > 0
                    ? `Conversation History:\n${contextStr}\n\nUSER: ${ctx.message.text}\n\nASSISTANT:`
                    : ctx.message.text;
                const modelId = await this.modelRegistryService.resolveModelId('general-text-fallback');
                const response = await this.aiGatewayService.generateText({
                    model: modelId,
                    systemPrompt: 'You are AYUSH, a helpful healthcare assistant for the AYU platform. Be concise, polite, and helpful. Do not provide medical diagnoses. If the user wants to book an appointment, tell them to use the /hospitals and /book commands. Answer the user based on the conversation history provided.',
                    userPrompt: userPrompt,
                    maxTokens: 500,
                    temperature: 0.7
                });
                history.push({ role: 'user', content: ctx.message.text });
                history.push({ role: 'assistant', content: response.text });
                if (history.length > 10)
                    history.splice(0, history.length - 10);
                await ctx.reply(response.text);
            }
            catch (error) {
                this.logger.error(`Error processing telegram text with AI: ${error.message}`);
                await ctx.reply("I'm sorry, I'm having trouble processing that request right now.");
            }
        });
    }
};
TelegramService = TelegramService_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [UsersService,
        AiGatewayService,
        ModelRegistryService])
], TelegramService);
export { TelegramService };
//# sourceMappingURL=telegram.service.js.map
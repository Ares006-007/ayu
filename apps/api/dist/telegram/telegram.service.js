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
                const caption = ctx.message.caption || 'What is in this medical report?';
                this.logger.log(`Received photo with caption: ${caption}`);
                const photo = ctx.message.photo[ctx.message.photo.length - 1];
                const fileLink = await ctx.telegram.getFileLink(photo.file_id);
                const userId = ctx.from.id;
                if (!this.sessions.has(userId)) {
                    this.sessions.set(userId, []);
                }
                const history = this.sessions.get(userId);
                const modelId = await this.modelRegistryService.resolveModelId('DOCUMENT_VISION_PRIMARY');
                const systemPrompt = `You are AYU Vision, an expert medical document extraction agent. 
Analyze the provided medical report image.
Extract the key findings, out-of-range values, and the doctor's name if present.
Summarize it cleanly in Markdown.
If it is not a medical document, politely inform the user.
WARNING: State clearly that this is an AI extraction and not a medical diagnosis.`;
                const userPrompt = [
                    { type: 'text', text: caption },
                    { type: 'image_url', image_url: { url: fileLink.href } }
                ];
                const response = await this.aiGatewayService.generateText({
                    model: modelId,
                    systemPrompt: systemPrompt,
                    userPrompt: userPrompt,
                    maxTokens: 500,
                    temperature: 0.2
                });
                const aiText = response.text;
                history.push({ role: 'user', content: `[Uploaded a Lab Report Image: ${caption}]` });
                history.push({ role: 'assistant', content: aiText });
                if (history.length > 10)
                    history.splice(0, history.length - 10);
                await ctx.replyWithMarkdown(aiText);
            }
            catch (error) {
                this.logger.error(`Error processing photo: ${error.message}`);
                await ctx.reply("I'm sorry, I encountered an error while processing your report image.");
            }
        });
        this.bot.on('text', async (ctx) => {
            if (!ctx.message || !('text' in ctx.message))
                return;
            try {
                await ctx.sendChatAction('typing');
                const userId = ctx.from.id;
                const { PrismaClient } = await import('@prisma/client');
                const prisma = new PrismaClient();
                const linkedAccount = await prisma.telegramAccountLink.findUnique({
                    where: { telegramUserId: userId.toString() },
                    include: {
                        user: {
                            include: {
                                patientRecord: {
                                    include: {
                                        appointments: {
                                            where: { startsAt: { gte: new Date() } },
                                            orderBy: { startsAt: 'asc' },
                                            take: 1
                                        },
                                        prescriptions: {
                                            where: { status: 'VERIFIED' },
                                            orderBy: { createdAt: 'desc' },
                                            take: 1,
                                            include: { items: true, doctor: true }
                                        }
                                    }
                                }
                            }
                        }
                    }
                });
                let systemContextStr = "SYSTEM CONTEXT [READ-FIRST RESOLVER]:\n";
                if (!linkedAccount || !linkedAccount.user?.patientRecord) {
                    systemContextStr += "- Patient Status: UNLINKED / UNKNOWN (Proceed safely without medical history)\n";
                }
                else {
                    const patient = linkedAccount.user.patientRecord;
                    systemContextStr += `- Patient Status: LINKED (Name: ${linkedAccount.user.name})\n`;
                    if (patient.appointments.length > 0) {
                        const nextApt = patient.appointments[0];
                        systemContextStr += `- Next Appointment: ${nextApt.startsAt.toISOString()} (Status: ${nextApt.status})\n`;
                    }
                    else {
                        systemContextStr += `- Next Appointment: NONE\n`;
                    }
                    if (patient.prescriptions.length > 0) {
                        const prx = patient.prescriptions[0];
                        systemContextStr += `- Active Verified Prescription: ${prx.items.length} medicines prescribed by Dr. ${prx.doctor?.registrationNumber}\n`;
                    }
                    else {
                        systemContextStr += `- Active Verified Prescription: NONE\n`;
                    }
                }
                if (!this.sessions.has(userId)) {
                    this.sessions.set(userId, []);
                }
                const history = this.sessions.get(userId);
                const contextStr = history.map(msg => `${msg.role.toUpperCase()}: ${msg.content}`).join('\n\n');
                const userPrompt = contextStr.length > 0
                    ? `Conversation History:\n${contextStr}\n\nUSER: ${ctx.message.text}\n\nASSISTANT:`
                    : `USER: ${ctx.message.text}\n\nASSISTANT:`;
                const modelId = await this.modelRegistryService.resolveModelId('CONVERSATION_PRIMARY');
                const systemPrompt = `You are AYUSH, a stateful, guided healthcare workflow assistant.
Your goal is to triage symptoms safely and contextually, not act as a command bot.

${systemContextStr}

RULES:
- READ the SYSTEM CONTEXT above before responding. Ground your answers in this verified context.
- DO NOT tell the user to use /book or /hospitals immediately upon hearing a symptom.
- DO NOT pretend to diagnose, prescribe, or change dosages.
- Ask short, one-step follow-up questions to gather context.
- Use a calm, specific, and progressive tone.
- Avoid generic apologies and robotic disclaimers.

EMERGENCY LOGIC:
If the user reports danger signs (e.g., chest pain, breathing difficulty, severe weakness, confusion, fainting, seizure, uncontrolled bleeding, severe allergic swelling, persistent high fever, self-harm intent):
- Stop the normal flow.
- Output EXACTLY this tag anywhere in your response: [ACTION: ESCALATE_EMERGENCY]
- Provide urgent escalation guidance advising them to seek immediate emergency care.

BOOKING LOGIC:
If sufficient context is gathered and the next safe step is to book a doctor, output EXACTLY this tag: [ACTION: BOOK_APPOINTMENT]

Remember: Keep questions short. Offer quick reply options implicitly if helpful.`;
                const response = await this.aiGatewayService.generateText({
                    model: modelId,
                    systemPrompt: systemPrompt,
                    userPrompt: userPrompt,
                    maxTokens: 300,
                    temperature: 0.5
                });
                let aiText = response.text;
                if (aiText.includes('[ACTION: ESCALATE_EMERGENCY]')) {
                    aiText = aiText.replace('[ACTION: ESCALATE_EMERGENCY]', '').trim();
                    aiText = `🚨 **URGENT**\n\n${aiText}`;
                    this.sessions.set(userId, []);
                }
                else if (aiText.includes('[ACTION: BOOK_APPOINTMENT]')) {
                    aiText = aiText.replace('[ACTION: BOOK_APPOINTMENT]', '').trim();
                    try {
                        const { PrismaClient } = await import('@prisma/client');
                        const prisma = new PrismaClient();
                        const patient = await prisma.patient.findFirst();
                        const doctor = await prisma.doctor.findFirst({ include: { clinic: true } });
                        if (patient && doctor && doctor.clinic) {
                            const tomorrow = new Date();
                            tomorrow.setDate(tomorrow.getDate() + 1);
                            tomorrow.setHours(10, 0, 0, 0);
                            await prisma.appointment.create({
                                data: {
                                    patientId: patient.id,
                                    doctorId: doctor.id,
                                    organizationId: doctor.clinicId,
                                    startsAt: tomorrow,
                                    endsAt: new Date(tomorrow.getTime() + 30 * 60000),
                                    reason: 'AI Triaged Appointment',
                                    status: 'SCHEDULED'
                                }
                            });
                            aiText += `\n\n*(System: I have safely booked a priority token for you with ${doctor.clinic.name} for tomorrow at 10:00 AM based on your symptoms.)*`;
                        }
                    }
                    catch (e) {
                        this.logger.error('Failed to auto-book', e);
                    }
                }
                history.push({ role: 'user', content: ctx.message.text });
                history.push({ role: 'assistant', content: aiText });
                if (history.length > 10)
                    history.splice(0, history.length - 10);
                await ctx.replyWithMarkdown(aiText);
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
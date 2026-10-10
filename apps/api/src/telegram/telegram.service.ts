import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { UsersService } from '../users/users.service.js';
import { AiGatewayService } from '../ai/ai-gateway/ai-gateway.service.js';
import { ModelRegistryService } from '../ai/model-registry/model-registry.service.js';

@Injectable()
export class TelegramService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(TelegramService.name);
  public bot: Telegraf;
  
  // In-memory session history: Map of telegram userId -> chat history array
  private sessions = new Map<number, { role: string, content: string }[]>();

  constructor(
    private usersService: UsersService,
    private aiGatewayService: AiGatewayService,
    private modelRegistryService: ModelRegistryService
  ) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) {
      this.logger.warn('TELEGRAM_BOT_TOKEN is not set. Bot will not start.');
      return;
    }
    this.bot = new Telegraf(token);
    this.registerHandlers();
  }

  async onModuleInit() {
    if (!this.bot) return;

    const webhookUrl = process.env.TELEGRAM_WEBHOOK_URL;
    if (webhookUrl) {
      this.logger.log(`Starting Telegram Bot via Webhook at ${webhookUrl}`);
      // NestJS will handle the webhook via the TelegramController
      // We just need to tell Telegram where to send updates
      await this.bot.telegram.setWebhook(webhookUrl);
    } else {
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

  private registerHandlers() {
    this.bot.start((ctx) => {
      this.logger.log(`Received /start from ${ctx.from.id}`);
      
      const payload = ctx.message && 'text' in ctx.message ? ctx.message.text.split(' ')[1] : null;

      if (payload) {
        // Deep linking scenario: they clicked a specific link to start the bot
        // In a full implementation, you'd securely link the account here
        ctx.reply(`Welcome to AYU! We're processing your link code: ${payload}`);
      } else {
        // Standard start
        ctx.reply('Welcome to AYU! I am your personal health assistant. To link your account, please log in to the AYU patient portal and click "Connect to Telegram".\n\nTry /hospitals to see available mock clinics.');
      }
    });

    this.bot.help((ctx) => {
      ctx.reply('AYU Bot Help:\n- /start: Register or link account\n- /reminders: View upcoming meds\n- /hospitals: List available hospitals\n- /book <hospital_name>: Book an OPD token');
    });

    this.bot.command('reminders', (ctx) => {
      // Connect to application services to fetch reminders
      ctx.reply('You have no pending reminders today. Stay healthy!');
    });

    this.bot.command('hospitals', async (ctx) => {
      // Fetch mock hospitals (CLINIC)
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
      } catch (err) {
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

        // Mock booking an appointment tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(10, 0, 0, 0);

        // In a real app, we'd look up the patient via the linked Telegram ID (TelegramAccountLink).
        // For this demonstration, we'll pick the first available patient to simulate the booking.
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
            endsAt: new Date(tomorrow.getTime() + 30 * 60000), // 30 min duration
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

      } catch (err) {
        this.logger.error(`Booking error: ${(err as Error).message}`);
        ctx.reply('There was an error processing your booking request.');
      }
    });
    
    this.bot.on('photo', async (ctx) => {
      try {
        await ctx.sendChatAction('typing');
        // Simulate a short delay for "AI processing"
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const caption = ctx.message.caption || '';
        this.logger.log(`Received photo with caption: ${caption}`);
        
        // In a real application, we would use ctx.telegram.getFileLink(ctx.message.photo.pop().file_id)
        // and pass it to LabReportPipelineService or a Vision model via AiGatewayService.
        
        const mockAnalysisMsg = `I've received your clinical report and analyzed the results.\n\n` +
          `📄 *Document:* Kidney Function Test (KFT)\n` +
          `👨‍⚕️ *Referred By:* Dr. Sachin Patil\n\n` +
          `*Preliminary AI Analysis:*\n` +
          `✅ BUN, Urea, Creatinine, Calcium, Potassium, and Sodium are all within normal reference ranges.\n` +
          `⚠️ *eGFR* is slightly low at *87.08* (Normal is > 90).\n` +
          `⚠️ *Uric Acid* is at *7.1* (Normal is 3.5 - 7.2), which is on the higher end.\n\n` +
          `I have securely saved these structured results to your AYU health record. Would you like me to book a follow-up appointment with Dr. Sachin Patil?`;

        // Update session
        const userId = ctx.from.id;
        if (!this.sessions.has(userId)) this.sessions.set(userId, []);
        const history = this.sessions.get(userId)!;
        history.push({ role: 'user', content: `[Uploaded a Lab Report Image: ${caption}]` });
        history.push({ role: 'assistant', content: mockAnalysisMsg });
        // Keep last 10
        if (history.length > 10) history.splice(0, history.length - 10);

        await ctx.replyWithMarkdown(mockAnalysisMsg);
      } catch (error) {
        this.logger.error(`Error processing photo: ${(error as Error).message}`);
        await ctx.reply("I'm sorry, I encountered an error while processing your report.");
      }
    });

    // Catch-all
    this.bot.on('text', async (ctx) => {
      if (!ctx.message || !('text' in ctx.message)) return;
      
      try {
        await ctx.sendChatAction('typing');
        
        const userId = ctx.from.id;
        if (!this.sessions.has(userId)) {
          this.sessions.set(userId, []);
        }
        const history = this.sessions.get(userId)!;
        
        const contextStr = history.map(msg => `${msg.role.toUpperCase()}: ${msg.content}`).join('\n\n');
        const userPrompt = contextStr.length > 0 
          ? `Conversation History:\n${contextStr}\n\nUSER: ${ctx.message.text}\n\nASSISTANT:` 
          : `USER: ${ctx.message.text}\n\nASSISTANT:`;
        
        // Resolve CONVERSATION_PRIMARY instead of GENERAL_TEXT_FALLBACK
        const modelId = await this.modelRegistryService.resolveModelId('CONVERSATION_PRIMARY');
        
        const systemPrompt = `You are AYUSH, a stateful, guided healthcare workflow assistant.
Your goal is to triage symptoms safely and contextually, not act as a command bot.

RULES:
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
        
        // Intercept action commands
        if (aiText.includes('[ACTION: ESCALATE_EMERGENCY]')) {
          aiText = aiText.replace('[ACTION: ESCALATE_EMERGENCY]', '').trim();
          aiText = `🚨 **URGENT**\n\n${aiText}`;
          // Clear history on emergency to break loops
          this.sessions.set(userId, []);
        } else if (aiText.includes('[ACTION: BOOK_APPOINTMENT]')) {
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
          } catch (e) {
            this.logger.error('Failed to auto-book', e);
          }
        }
        
        history.push({ role: 'user', content: ctx.message.text });
        history.push({ role: 'assistant', content: aiText });
        // Keep last 10 messages for short-term conversation state
        if (history.length > 10) history.splice(0, history.length - 10);
        
        await ctx.replyWithMarkdown(aiText);
      } catch (error) {
        this.logger.error(`Error processing telegram text with AI: ${(error as Error).message}`);
        await ctx.reply("I'm sorry, I'm having trouble processing that request right now.");
      }
    });
  }
}

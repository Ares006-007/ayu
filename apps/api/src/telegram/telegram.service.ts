import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { UsersService } from '../users/users.service.js';
import { AiGatewayService } from '../ai/ai-gateway/ai-gateway.service.js';
import { ModelRegistryService } from '../ai/model-registry/model-registry.service.js';

@Injectable()
export class TelegramService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(TelegramService.name);
  public bot: Telegraf;

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
    
    // Catch-all
    this.bot.on('text', async (ctx) => {
      if (!ctx.message || !('text' in ctx.message)) return;
      
      try {
        await ctx.sendChatAction('typing');
        
        const modelId = await this.modelRegistryService.resolveModelId('general-text-fallback');
        
        const response = await this.aiGatewayService.generateText({
          model: modelId,
          systemPrompt: 'You are AYUSH, a helpful healthcare assistant for the AYU platform. Be concise, polite, and helpful. Do not provide medical diagnoses. If the user wants to book an appointment, tell them to use the /hospitals and /book commands.',
          userPrompt: ctx.message.text,
          maxTokens: 500,
          temperature: 0.7
        });
        
        await ctx.reply(response.text);
      } catch (error) {
        this.logger.error(`Error processing telegram text with AI: ${(error as Error).message}`);
        await ctx.reply("I'm sorry, I'm having trouble processing that request right now.");
      }
    });
  }
}

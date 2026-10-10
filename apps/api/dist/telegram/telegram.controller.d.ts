import { TelegramService } from './telegram.service.js';
import type { Request, Response } from 'express';
export declare class TelegramController {
    private readonly telegramService;
    constructor(telegramService: TelegramService);
    handleWebhook(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}

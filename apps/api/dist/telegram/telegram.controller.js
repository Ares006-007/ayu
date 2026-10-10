var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Controller, Post, Req, Res, HttpStatus } from '@nestjs/common';
import { TelegramService } from './telegram.service.js';
let TelegramController = class TelegramController {
    telegramService;
    constructor(telegramService) {
        this.telegramService = telegramService;
    }
    async handleWebhook(req, res) {
        if (!this.telegramService.bot) {
            return res.status(HttpStatus.SERVICE_UNAVAILABLE).send('Bot not configured');
        }
        try {
            await this.telegramService.bot.handleUpdate(req.body);
            return res.status(HttpStatus.OK).send('OK');
        }
        catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Error processing update');
        }
    }
};
__decorate([
    Post(),
    __param(0, Req()),
    __param(1, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TelegramController.prototype, "handleWebhook", null);
TelegramController = __decorate([
    Controller('webhooks/telegram'),
    __metadata("design:paramtypes", [TelegramService])
], TelegramController);
export { TelegramController };
//# sourceMappingURL=telegram.controller.js.map
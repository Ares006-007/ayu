import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export declare class AiConfigService implements OnModuleInit {
    private readonly configService;
    private readonly logger;
    constructor(configService: ConfigService);
    onModuleInit(): void;
    private validateConfig;
    get gatewayBaseUrl(): string;
    get gatewayApiKey(): string;
    get isGatewayEnabled(): boolean;
    getModelAlias(alias: string): string | undefined;
}

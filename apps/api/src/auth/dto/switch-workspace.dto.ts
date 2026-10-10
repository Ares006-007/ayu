import { IsIn, IsOptional, IsString } from 'class-validator';
import type { WorkspaceType } from '../types.js';

const WORKSPACE_TYPES = [
  'patient',
  'doctor',
  'pharmacy',
  'clinic_admin',
  'platform_admin',
] as const;

export class SwitchWorkspaceDto {
  @IsIn(WORKSPACE_TYPES)
  workspace: WorkspaceType;

  @IsOptional()
  @IsString()
  organizationId?: string;
}

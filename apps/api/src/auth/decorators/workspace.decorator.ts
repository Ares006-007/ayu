import { SetMetadata } from '@nestjs/common';
import type { WorkspaceType } from '../types.js';

export const WORKSPACE_KEY = 'workspaces';
export const Workspace = (...workspaces: WorkspaceType[]) =>
  SetMetadata(WORKSPACE_KEY, workspaces);

import type { WorkspaceType } from '../types.js';
export declare const WORKSPACE_KEY = "workspaces";
export declare const Workspace: (...workspaces: WorkspaceType[]) => import("@nestjs/common").CustomDecorator<string>;

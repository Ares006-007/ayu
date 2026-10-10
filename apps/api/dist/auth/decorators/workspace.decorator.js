import { SetMetadata } from '@nestjs/common';
export const WORKSPACE_KEY = 'workspaces';
export const Workspace = (...workspaces) => SetMetadata(WORKSPACE_KEY, workspaces);
//# sourceMappingURL=workspace.decorator.js.map
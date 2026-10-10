export type WorkspaceType =
  | 'patient'
  | 'doctor'
  | 'pharmacy'
  | 'clinic_admin'
  | 'platform_admin';

export interface WorkspaceDescriptor {
  type: WorkspaceType;
  organizationId?: string;
  organizationName?: string;
  label: string;
}

export interface MembershipView {
  organizationId: string;
  organizationName: string;
  organizationType: string;
  role: string;
  permissions: string[];
  status: string;
}

export interface CurrentUserResponse {
  user: {
    id: string;
    name: string | null;
    email: string;
    emailVerified: boolean;
  };
  memberships: MembershipView[];
  availableWorkspaces: WorkspaceDescriptor[];
  defaultWorkspace: WorkspaceType | null;
  activeWorkspace: WorkspaceType | null;
  activeOrganizationId: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export function workspacePath(workspace: WorkspaceType): string {
  const map: Record<WorkspaceType, string> = {
    patient: '/app/patient',
    doctor: '/app/doctor',
    pharmacy: '/app/pharmacy',
    clinic_admin: '/app/admin',
    platform_admin: '/app/admin',
  };
  return map[workspace];
}

export function workspaceFromPath(pathname: string): WorkspaceType | null {
  if (pathname.startsWith('/app/patient')) return 'patient';
  if (pathname.startsWith('/app/doctor')) return 'doctor';
  if (pathname.startsWith('/app/pharmacy')) return 'pharmacy';
  if (pathname.startsWith('/app/admin')) return 'clinic_admin';
  return null;
}

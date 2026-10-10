export type WorkspaceType = 'patient' | 'doctor' | 'pharmacy' | 'clinic_admin' | 'platform_admin';
export type MembershipRole = 'ADMIN' | 'DOCTOR' | 'PHARMACIST' | 'STAFF' | 'PLATFORM_ADMIN';
export type OrganizationType = 'CLINIC' | 'PHARMACY' | 'PLATFORM';
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
export interface AuthenticatedUser {
    userId: string;
    email: string;
    sessionId?: string;
    memberships: MembershipView[];
    workspaces: WorkspaceDescriptor[];
    activeWorkspace: WorkspaceType | null;
    activeOrganizationId: string | null;
    permissions: string[];
    roles: string[];
    patientId?: string;
    doctorId?: string;
}

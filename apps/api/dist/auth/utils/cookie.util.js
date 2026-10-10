const ACCESS_MAX_AGE = 15 * 60 * 1000;
const REFRESH_MAX_AGE = 7 * 24 * 60 * 60 * 1000;
const WORKSPACE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;
function cookieOptions(maxAge, path = '/') {
    return {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge,
        path,
    };
}
export function setAuthCookies(response, accessToken, refreshToken) {
    response.cookie('access_token', accessToken, cookieOptions(ACCESS_MAX_AGE));
    response.cookie('refresh_token', refreshToken, cookieOptions(REFRESH_MAX_AGE, '/api/v1/auth/refresh'));
}
export function clearAuthCookies(response) {
    response.clearCookie('access_token');
    response.clearCookie('refresh_token', { path: '/api/v1/auth/refresh' });
    response.clearCookie('ayu_workspace');
}
export function setWorkspaceCookie(response, workspace, organizationId) {
    const value = organizationId ? `${workspace}:${organizationId}` : workspace;
    response.cookie('ayu_workspace', value, cookieOptions(WORKSPACE_MAX_AGE));
}
export function parseWorkspaceCookie(raw) {
    if (!raw)
        return null;
    const [workspace, organizationId] = raw.split(':');
    if (!workspace)
        return null;
    return {
        workspace: workspace,
        organizationId: organizationId || null,
    };
}
//# sourceMappingURL=cookie.util.js.map
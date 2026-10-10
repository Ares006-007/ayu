import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any, context: any) {
    const req = context.switchToHttp().getRequest();
    // BYPASS AUTH FOR TESTING
    req.user = {
      id: "b691e109-4592-4177-a030-c915604bc664", // Patient ID
      patientId: "pat-1",
      doctorId: "doc-1",
      email: "patient@demo.ayu",
      activeWorkspace: "patient"
    };
    return req.user;
  }
}

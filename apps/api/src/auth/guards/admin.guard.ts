import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // 👈 Populated by your JwtAuthGuard

    // If there is no user, or the accountType isn't admin, block them
    if (!user || user.accountType !== 'admin') {
      throw new ForbiddenException('Access denied. Admin privileges required.');
    }

    return true; // 🔓 Allow access
  }
}
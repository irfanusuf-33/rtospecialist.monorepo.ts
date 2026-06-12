import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private jwtService: JwtService, private configService: ConfigService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<any>();
        const token = request.cookies?.['rto_session'];
        if (!token) {
            throw new UnauthorizedException('Authentication token missing. Please login');
        }

        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get<string>('SESSION_AUTH_TOKEN') || 'secret-key',
            });

            request.user = {
                id: payload.sub,
                email: payload.email,
                accountType: payload.accountType,
            };

            return true;
        } catch (error) {
            throw new UnauthorizedException('Invalid or expired authentication token.');
        }
    }
}

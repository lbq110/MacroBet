import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService, UserProfile } from './auth.service';

interface TwitterLoginDto {
    code: string;
    redirectUri: string;
    codeVerifier: string;
}

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('twitter/callback')
    async twitterCallback(@Body() dto: TwitterLoginDto): Promise<UserProfile> {
        try {
            // Exchange authorization code for access token
            const tokenResponse = await this.authService.exchangeCodeForToken(
                dto.code,
                dto.redirectUri,
                dto.codeVerifier,
            );

            // Get user profile with access token
            const userProfile = await this.authService.getUserProfile(tokenResponse.access_token);

            return userProfile;
        } catch (error) {
            console.error('Twitter auth error:', error);
            throw new HttpException(
                error.message || 'Authentication failed',
                HttpStatus.BAD_REQUEST,
            );
        }
    }
}

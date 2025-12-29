import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface TwitterTokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
    scope: string;
    refresh_token?: string;
}

interface TwitterUserResponse {
    data: {
        id: string;
        name: string;
        username: string;
        profile_image_url?: string;
    };
}

export interface UserProfile {
    id: string;
    username: string;
    name: string;
    profileImageUrl: string;
}

@Injectable()
export class AuthService {
    private readonly clientId: string;
    private readonly clientSecret: string;

    constructor(private configService: ConfigService) {
        this.clientId = this.configService.get<string>('TWITTER_CLIENT_ID') || 'c1RoN2dKUXRVRkl3QVZXRS1ERTM6MTpjaQ';
        this.clientSecret = this.configService.get<string>('TWITTER_CLIENT_SECRET') || 'LIXgm37OrR30PsrXP7MyrTGAJAd29bn-ZlTfJMk8CHLuAX6SR5';
    }

    async exchangeCodeForToken(code: string, redirectUri: string, codeVerifier: string): Promise<TwitterTokenResponse> {
        const credentials = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');

        const response = await fetch('https://api.twitter.com/2/oauth2/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${credentials}`,
            },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code,
                redirect_uri: redirectUri,
                code_verifier: codeVerifier,
            }),
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Token exchange failed: ${error}`);
        }

        return response.json();
    }

    async getUserProfile(accessToken: string): Promise<UserProfile> {
        const response = await fetch('https://api.twitter.com/2/users/me?user.fields=profile_image_url', {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Failed to get user profile: ${error}`);
        }

        const data: TwitterUserResponse = await response.json();

        return {
            id: data.data.id,
            username: data.data.username,
            name: data.data.name,
            profileImageUrl: data.data.profile_image_url || 'https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png',
        };
    }
}

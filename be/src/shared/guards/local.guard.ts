import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Validate username and password then pass resolved user
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}

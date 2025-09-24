import { Body, Controller, Post } from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { AuthService } from './auth.service';

const loginSchema = z.object({ email: z.string().email(), password: z.string().min(6) });
const registerSchema = z.object({ email: z.string().email(), password: z.string().min(6) });

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body(new ZodValidationPipe(loginSchema)) body: z.infer<typeof loginSchema>) {
    return this.authService.login(body.email, body.password);
  }

  @Post('register')
  async register(
    @Body(new ZodValidationPipe(registerSchema)) body: z.infer<typeof registerSchema>
  ) {
    return this.authService.register(body.email, body.password);
  }
}



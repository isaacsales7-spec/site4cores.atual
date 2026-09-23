import { Controller, Post, Body, Inject } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(
    @Inject(AuthService)
    private readonly authService: AuthService,
  ) {}

  @Post('auth/register')
  async register(@Body() body: any) {
    return this.authService.register(body);
  }

  @Post('auth/login')
  async login(@Body() body: any) {
    return this.authService.login(body);
  }

  @Post('admin/employees')
  async createEmployee(@Body() body: any) {
    return this.authService.registerEmployee(body);
  }
}
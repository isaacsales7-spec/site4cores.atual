import { Controller, Get, Delete, Param, Inject, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('admin/employees')
export class UsersController {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  @Get()
  async getEmployees() {
    return this.usersService.findAllEmployees();
  }

  @Delete(':id')
  async deleteEmployee(@Param('id') id: string) {
    return this.usersService.deleteEmployee(id);
  }
}
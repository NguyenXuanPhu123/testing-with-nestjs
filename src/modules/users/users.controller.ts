import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAccessTokenGuard } from '../auth/guards/jwt-access-token.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('users')
@ApiBearerAuth('token')
export class UsersController {
  constructor(private readonly users_service: UsersService) {}

  @Post()
  @ApiOperation({
    summary: 'Admin create new user',
  })
  create(@Body() create_user_dto: CreateUserDto) {
    return this.users_service.create(create_user_dto);
  }

  @Get()
  @UseGuards(JwtAccessTokenGuard)
  findAll(
    @Query('offset', ParseIntPipe) offset: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    return this.users_service.findAll({}, { offset, limit });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.users_service.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() update_user_dto: UpdateUserDto,
  ) {
    return await this.users_service.update(id, update_user_dto);
  }

  @Delete(':id')
  @UseGuards(JwtAccessTokenGuard)
  remove(@Param('id') id: string) {
    return this.users_service.remove(id);
  }
}

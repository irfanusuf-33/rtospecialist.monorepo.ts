import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AffiliateUsersService } from './affiliate-user.service';
import { CreateAffiliateUserDto } from './dto/create-affiliate-user.dto';
import { UpdateAffiliateUserDto } from './dto/update-affiliate-user.dto';

@Controller('affiliate-users')
export class AffiliateUsersController {
  constructor(private readonly affiliateUsersService: AffiliateUsersService) {}

  @Post()
  create(@Body() createDto: CreateAffiliateUserDto) {
    return this.affiliateUsersService.create(createDto);
  }

  @Get()
  findAll() {
    return this.affiliateUsersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.affiliateUsersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateAffiliateUserDto) {
    return this.affiliateUsersService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.affiliateUsersService.remove(id);
  }
}
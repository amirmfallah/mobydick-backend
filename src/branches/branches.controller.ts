import { Request } from 'express';
import { Roles } from 'src/shared/roles.decorator';
import { Role } from 'src/shared/roles.enum';
import { JwtAuthGuard } from './../auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Controller, UseGuards, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BranchesService } from './branches.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';

@Controller('api/v1/branches')
export class BranchesController {
  constructor(private readonly branchesService: BranchesService) {}

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  create(@Body() createBranchDto: CreateBranchDto, @Request() req: any) {
    createBranchDto.ownerId = req.user?.userId;
    return this.branchesService.create(createBranchDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.branchesService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.branchesService.findOne(id);
  }

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBranchDto: UpdateBranchDto) {
    return this.branchesService.update(id, updateBranchDto);
  }

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.branchesService.remove(id);
  }
}

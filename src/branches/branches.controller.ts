import { Roles } from 'src/shared/roles.decorator';
import { Role } from 'src/shared/roles.enum';
import { JwtAuthGuard } from './../auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import {
  Controller,
  UseGuards,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  Query,
} from '@nestjs/common';
import { BranchesService } from './branches.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { SuperUpdateBranchDto, UpdateBranchDto } from './dto/update-branch.dto';
import * as _ from 'lodash';
import { Pagination } from 'src/shared/dto/shared.dto';
@Controller('api/v1/branches')
export class BranchesController {
  constructor(private readonly branchesService: BranchesService) {}

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async create(@Body() createBranchDto: CreateBranchDto, @Request() req: any) {
    createBranchDto.ownerId = req.user?.userId;
    return await this.branchesService.create(createBranchDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findAll(
    @Request() req,
    @Query() pagination: Pagination,
    @Query('search') search: string,
  ) {
    const roles = req.user.roles || [];
    if (roles.includes(Role.Super))
      return await this.branchesService.findAll(pagination, search);
    return await this.branchesService.findAllVerified(pagination, search);
  }

  @Get('owner')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findBranchByOwner(@Request() req) {
    const ownerId = req.user?.userId;
    return await this.branchesService.findByOwner(ownerId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.branchesService.findOne(id);
  }

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateBranchDto: UpdateBranchDto,
  ) {
    // TODO: Set branch pending to false after update
    // to wait for the approval of the super admin
    return await this.branchesService.update(id, updateBranchDto);
  }

  @Roles(Role.Super)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('super/:id')
  async superUpdate(
    @Param('id') id: string,
    @Body() superUpdateBranchDto: SuperUpdateBranchDto,
  ) {
    return await this.branchesService.update(id, superUpdateBranchDto);
  }

  @Roles(Role.Super)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.branchesService.remove(id);
  }
}

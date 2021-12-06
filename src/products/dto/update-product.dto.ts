import { CreateCategoryDto } from './../../categories/dto/create-category.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateProductDto extends PartialType(CreateCategoryDto) {}

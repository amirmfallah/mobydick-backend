import { Allow, IsNotEmpty } from 'class-validator';
export class UpdateUserDto {
  @Allow()
  firstname?: string;

  @Allow()
  email?: string;

  @Allow()
  password?: string;

  @Allow()
  lastPassword?: string;
}

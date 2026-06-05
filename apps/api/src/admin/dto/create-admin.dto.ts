import { IsString, IsEmail, IsNotEmpty, MaxLength, IsArray, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAdminDto {
    @ApiProperty({ example: 'admin@example.com' })
    @IsEmail()
    @IsNotEmpty()
    @MaxLength(100)
    email: string = '';

    @ApiProperty({ example: 'securePass123!' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(70)
    password: string = '';

    @ApiProperty({ example: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', required: false })
    @IsString()
    @IsOptional()
    createdById?: string;

    @ApiProperty({ example: ['SUPER_ADMIN', 'MANAGE_PRODUCTS'] })
    @IsArray()
    @IsString({ each: true })
    @IsNotEmpty()
    permissionGroup: string[] = [];

    @ApiProperty({ example: false, required: false })
    @IsBoolean()
    @IsOptional()
    isDisabled?: boolean;
}
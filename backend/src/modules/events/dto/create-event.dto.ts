import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsDateString, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { EventType } from '../event.entity';
import { ShockwaveSubMode } from '../bet-option.entity';

export class CreateEventDto {
    @ApiProperty({ description: 'Indicator name, e.g., CPI' })
    @IsString()
    @IsNotEmpty()
    indicatorName: string;

    @ApiProperty({ description: 'Release time (T0)' })
    @IsDateString()
    releaseTime: string;

    @ApiProperty({ description: 'Market expected value' })
    @IsNumber()
    expectedValue: number;

    @ApiProperty({ enum: EventType, default: EventType.REGULAR })
    @IsOptional()
    @IsEnum(EventType)
    eventType?: EventType;

    @ApiProperty({ description: 'Betting options' })
    @IsOptional()
    options?: CreateBetOptionDto[];
}

export class CreateBetOptionDto {
    @ApiProperty()
    @IsString()
    rangeLabel: string;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    rangeMin?: number;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    rangeMax?: number;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    odds?: number;

    @ApiProperty({ enum: ShockwaveSubMode, nullable: true })
    @IsOptional()
    @IsEnum(ShockwaveSubMode)
    subMode?: ShockwaveSubMode;
}

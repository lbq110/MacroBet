import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNumber, Min } from 'class-validator';

export class CreateBetDto {
    @ApiProperty({ description: 'The ID of the user placing the bet' })
    @IsUUID()
    userId: string;

    @ApiProperty({ description: 'The ID of the specific range option' })
    @IsUUID()
    optionId: string;

    @ApiProperty({ description: 'Bet amount' })
    @IsNumber()
    @Min(1)
    amount: number;
}

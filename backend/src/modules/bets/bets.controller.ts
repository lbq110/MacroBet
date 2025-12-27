import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { BetsService } from './bets.service';
import { CreateBetDto } from './dto/create-bet.dto';

@ApiTags('Bets')
@Controller('bets')
export class BetsController {
    constructor(private readonly betsService: BetsService) { }

    @Post()
    @ApiOperation({ summary: 'Place a new bet' })
    create(@Body() createBetDto: CreateBetDto) {
        return this.betsService.placeBet(createBetDto);
    }

    @Get('user/:userId')
    @ApiOperation({ summary: 'Get all bets for a user' })
    findByUser(@Param('userId') userId: string) {
        return this.betsService.findByUser(userId);
    }
}

import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';

@ApiTags('Events')
@Controller('events')
export class EventsController {
    constructor(private readonly eventsService: EventsService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new macro event' })
    create(@Body() createEventDto: CreateEventDto) {
        return this.eventsService.create(createEventDto);
    }

    @Get('upcoming')
    @ApiOperation({ summary: 'Get all upcoming events' })
    findAllUpcoming() {
        return this.eventsService.findAllActive();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get event details' })
    findOne(@Param('id') id: string) {
        return this.eventsService.findOne(id);
    }
}

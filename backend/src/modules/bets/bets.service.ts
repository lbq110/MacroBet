import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Bet, BetStatus } from './bet.entity';
import { BetOption } from '../events/bet-option.entity';
import { User } from '../users/user.entity';
import { MacroEvent, EventStatus } from '../events/event.entity';
import { CreateBetDto } from './dto/create-bet.dto';

@Injectable()
export class BetsService {
    constructor(
        @InjectRepository(Bet) private readonly betRepository: Repository<Bet>,
        @InjectRepository(BetOption) private readonly optionRepository: Repository<BetOption>,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        private readonly dataSource: DataSource,
    ) { }

    async placeBet(createBetDto: CreateBetDto): Promise<Bet> {
        const { userId, optionId, amount } = createBetDto;

        return await this.dataSource.transaction(async (manager) => {
            // 1. Check User Balance
            const user = await manager.findOne(User, { where: { id: userId }, lock: { mode: 'pessimistic_write' } });
            if (!user) throw new NotFoundException('User not found');
            if (user.balance < amount) throw new BadRequestException('Insufficient balance');

            // 2. Check Option & Event Validity
            const option = await manager.findOne(BetOption, {
                where: { id: optionId },
                relations: ['event'],
                lock: { mode: 'pessimistic_write' }
            });
            if (!option) throw new NotFoundException('Option not found');

            const event = option.event;
            if (event.status !== EventStatus.UPCOMING) {
                throw new BadRequestException('Event is not open for betting');
            }

            // Check Cutoff (e.g., 5 mins before release)
            const cutoffTime = new Date(event.releaseTime.getTime() - 5 * 60000);
            if (new Date() > cutoffTime) {
                throw new BadRequestException('Betting window closed');
            }

            // 3. Risk Management: Exposure Limit (Simplified)
            const MAX_EXPOSURE_PER_OPTION = 100000; // Static limit for MVP
            if (Number(option.totalExposure) + amount > MAX_EXPOSURE_PER_OPTION) {
                throw new BadRequestException('Exposure limit reached for this range');
            }

            // 4. Atomic Updates
            user.balance -= amount;
            await manager.save(user);

            option.totalExposure = Number(option.totalExposure) + amount;
            await manager.save(option);

            const bet = manager.create(Bet, {
                user,
                option,
                amount,
                payoutOdds: option.odds,
                status: BetStatus.PENDING,
            });

            return await manager.save(bet);
        });
    }

    async findByUser(userId: string): Promise<Bet[]> {
        return this.betRepository.find({
            where: { user: { id: userId } },
            relations: ['option', 'option.event'],
            order: { createdAt: 'DESC' },
        });
    }
}

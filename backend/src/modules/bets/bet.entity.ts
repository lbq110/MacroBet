import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';
import { BetOption } from '../events/bet-option.entity';

export enum BetStatus {
    PENDING = 'PENDING',
    WON = 'WON',
    LOST = 'LOST',
    REFUNDED = 'REFUNDED',
}

@Entity('bets')
export class Bet {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User)
    user: User;

    @ManyToOne(() => BetOption)
    option: BetOption;

    @Column({ type: 'decimal', precision: 18, scale: 8 })
    amount: number;

    @Column({ type: 'decimal', precision: 5, scale: 2 })
    payoutOdds: number;

    @Column({
        type: 'enum',
        enum: BetStatus,
        default: BetStatus.PENDING,
    })
    status: BetStatus;

    @CreateDateColumn()
    createdAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    settledAt: Date;
}

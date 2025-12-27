import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { BetOption } from './bet-option.entity';

export enum EventStatus {
    UPCOMING = 'UPCOMING',    // 还没到投注时间
    BETTING = 'BETTING',      // 开放投注，允许撤单
    LOCKED = 'LOCKED',        // 锁定投注，禁止撤单 (Shockwave 专用)
    LIVE = 'LIVE',            // 已数据发布，等待波动结束 (Shockwave 专用)
    SETTLING = 'SETTLING',    // 正在结算中
    SETTLED = 'SETTLED',
    CANCELLED = 'CANCELLED',
}

export enum EventType {
    REGULAR = 'REGULAR',
    SHOCKWAVE = 'SHOCKWAVE',
}

@Entity('events')
export class MacroEvent {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    indicatorName: string; // CPI, NFP, etc.

    @Column({ nullable: true })
    indicatorId: string;

    @Column({ type: 'timestamp' })
    releaseTime: Date;

    @Column({ type: 'decimal', precision: 10, scale: 4, nullable: true })
    expectedValue: number;

    @Column({ type: 'decimal', precision: 10, scale: 4, nullable: true })
    actualValue: number;

    @Column({
        type: 'enum',
        enum: EventType,
        default: EventType.REGULAR,
    })
    eventType: EventType;

    @Column({
        type: 'enum',
        enum: EventStatus,
        default: EventStatus.UPCOMING,
    })
    status: EventStatus;

    @Column({ type: 'decimal', precision: 18, scale: 8, nullable: true })
    basePrice: number; // T0 时刻的 TWAP 基准价

    @Column({ type: 'decimal', precision: 18, scale: 8, nullable: true })
    settlePrice: number; // T+5m 时刻的 TWAP 结算价

    @OneToMany(() => BetOption, (option) => option.event, { cascade: true })
    options: BetOption[];

    @CreateDateColumn()
    createdAt: Date;
}

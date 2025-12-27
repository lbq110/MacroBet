import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { MacroEvent } from './event.entity';

export enum ShockwaveSubMode {
    DATA_SNIPER = 'DATA_SNIPER',
    VOLATILITY_HUNTER = 'VOLATILITY_HUNTER',
    JACKPOT = 'JACKPOT',
}

@Entity('bet_options')
export class BetOption {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    rangeLabel: string; // e.g., "> 0.5%"

    @Column({ type: 'decimal', precision: 10, scale: 4, nullable: true })
    rangeMin: number;

    @Column({ type: 'decimal', precision: 10, scale: 4, nullable: true })
    rangeMax: number;

    @Column({
        type: 'enum',
        enum: ShockwaveSubMode,
        nullable: true,
    })
    subMode: ShockwaveSubMode;

    @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
    odds: number; // 固定赔率或初始赔率

    @Column({ type: 'decimal', precision: 18, scale: 8, default: 0 })
    totalExposure: number;

    @Column({ default: false })
    isWinner: boolean;

    @ManyToOne(() => MacroEvent, (event) => event.options)
    event: MacroEvent;
}

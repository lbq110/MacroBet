import { Entity, Column, PrimaryColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { MacroIndicator } from './macro-indicator.entity';

export enum ResultType {
    ABOVE = 'ABOVE',
    INLINE = 'INLINE',
    BELOW = 'BELOW',
}

@Entity('price_reaction_stats')
export class PriceReactionStat {
    @PrimaryColumn()
    assetId: string; // e.g., 'BTC', 'GOLD'

    @PrimaryColumn()
    indicatorId: string;

    @PrimaryColumn()
    resultType: ResultType;

    @PrimaryColumn()
    window: string; // e.g., '1h', '4h', '24h'

    @ManyToOne(() => MacroIndicator)
    @JoinColumn({ name: 'indicatorId' })
    indicator: MacroIndicator;

    @Column({ type: 'decimal', precision: 18, scale: 8, nullable: true })
    avgReturn: number;

    @Column({ type: 'decimal', precision: 18, scale: 8, nullable: true })
    medianReturn: number;

    @Column({ type: 'integer', default: 0 })
    upCount: number;

    @Column({ type: 'integer', default: 0 })
    downCount: number;

    @Column({ type: 'decimal', precision: 10, scale: 4, nullable: true })
    winRate: number; // This is the Up Probability

    @Column({ type: 'decimal', precision: 18, scale: 8, nullable: true })
    avgVolatility: number; // Absolute price difference or % difference

    @Column({ type: 'integer', default: 0 })
    sampleSize: number;

    @Column({
        type: 'varchar',
        length: 20,
        default: 'LOW',
    })
    confidenceLevel: string; // 'LOW', 'MEDIUM', 'HIGH'


    @UpdateDateColumn()
    lastUpdated: Date;
}

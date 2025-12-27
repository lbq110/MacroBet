import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('macro_indicators')
export class MacroIndicator {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    code: string; // e.g., 'US_CPI_YOY'

    @Column()
    name: string; // e.g., 'US CPI Year-over-Year'

    @Column({ nullable: true })
    category: string; // e.g., 'Inflation'

    @Column({ type: 'decimal', precision: 10, scale: 4, default: 0.001 })
    inlineThreshold: number;

    @CreateDateColumn()
    createdAt: Date;
}

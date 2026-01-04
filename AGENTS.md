# AGENTS.md - Coding Agent Guidelines

MacroBet is a macroeconomic event prediction platform with a NestJS backend and React/Vite frontend.

## Project Structure

```
MacroBet/
├── backend/          # NestJS API (Node.js >= 20)
│   └── src/modules/  # auth, bets, events, settlement, statistics, users
├── frontend/         # React 19 + Vite 7 SPA
│   └── src/
│       ├── components/   # Reusable UI
│       ├── pages/        # Page components
│       ├── i18n/         # Internationalization (en, zh)
│       └── types/        # TypeScript definitions
```

## Build, Lint, and Test Commands

### Backend (from `backend/`)

```bash
npm run start:dev      # Dev server with hot reload
npm run build          # Production build
npm run lint           # Lint + auto-fix
npm run format         # Prettier format
npm run test           # All unit tests
npm run test:e2e       # E2E tests

# Single test file
npx jest src/modules/bets/bets.service.spec.ts
npx jest --testPathPattern="bets"

# Single test by name
npx jest -t "should place bet successfully"
```

### Frontend (from `frontend/`)

```bash
npm run dev       # Vite dev server
npm run build     # Type-check + build
npm run lint      # Lint codebase
```

## Code Style

### Formatting (Prettier - backend only)
- Single quotes: `'string'`
- Trailing commas: always

### Import Order
1. Framework imports (NestJS, React)
2. External libraries
3. Internal modules (relative paths)
4. Type imports
5. CSS imports

```typescript
// Backend
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Bet } from './bet.entity';

// Frontend
import React, { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import type { BetOption } from '../../types';
import './Component.css';
```

### Naming Conventions

| Element          | Convention      | Example                    |
|------------------|-----------------|----------------------------|
| Files (backend)  | kebab-case      | `bets.service.ts`          |
| Files (frontend) | PascalCase      | `BettingPanel.tsx`         |
| Classes          | PascalCase      | `BetsService`              |
| Functions        | camelCase       | `placeBet`                 |
| Constants        | SCREAMING_SNAKE | `MAX_EXPOSURE`             |
| Enums            | PascalCase      | `EventStatus`              |
| Enum values      | SCREAMING_SNAKE | `UPCOMING`                 |
| CSS classes      | kebab-case      | `betting-panel`            |

### Error Handling (Backend)

```typescript
if (!user) throw new NotFoundException('User not found');
if (user.balance < amount) throw new BadRequestException('Insufficient balance');

// Use transactions for atomic operations
return await this.dataSource.transaction(async (manager) => {
    // atomic operations
});
```

### Backend Patterns

```typescript
// Entity
@Entity('table_name')
export class EntityName {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'decimal', precision: 10, scale: 4, nullable: true })
    value: number;
}

// Service
@Injectable()
export class ExampleService {
    constructor(@InjectRepository(Entity) private readonly repo: Repository<Entity>) {}

    async findOne(id: string): Promise<Entity> {
        const entity = await this.repo.findOne({ where: { id } });
        if (!entity) throw new NotFoundException('Entity not found');
        return entity;
    }
}

// Controller
@ApiTags('Resource')
@Controller('resource')
export class ResourceController {
    @Post()
    @ApiOperation({ summary: 'Create resource' })
    create(@Body() dto: CreateDto) {
        return this.service.create(dto);
    }
}

// DTO
export class CreateDto {
    @ApiProperty({ description: 'Field description' })
    @IsUUID()
    fieldId: string;
}
```

### Frontend Patterns

```typescript
interface Props {
    data: DataType[];
}

export const Component: React.FC<Props> = ({ data }) => {
    const [state, setState] = useState<string | null>(null);
    const { t } = useI18n();  // Always use i18n for user-facing text

    return <div className="component">{t.section.key}</div>;
};
```

## Key Technologies

**Backend:** NestJS 11, TypeORM, PostgreSQL, Bull/BullMQ, class-validator, Swagger
**Frontend:** React 19, Vite 7, Recharts, lucide-react

## Testing

- Unit tests: `*.spec.ts` alongside source files
- E2E tests: `test/*.e2e-spec.ts`
- Mock external dependencies in unit tests

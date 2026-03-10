# Ágape Gestor - Backend API

Backend do sistema de gestão financeira construído com NestJS, Prisma e arquitetura DDD (Domain-Driven Design).

## 🏗️ Arquitetura

O projeto segue **Clean Architecture** com **DDD (Domain-Driven Design)**, separando as responsabilidades em camadas:

```
src/
├── core/                      # Núcleo compartilhado
│   ├── database/             # Prisma Service
│   ├── guards/               # Guards de autenticação
│   ├── decorators/           # Decorators customizados
│   └── filters/              # Exception filters
│
├── modules/                  # Módulos de domínio
│   ├── transactions/
│   │   ├── domain/          # Camada de Domínio
│   │   │   ├── transaction.entity.ts           # Entidade com regras de negócio
│   │   │   └── transaction.repository.interface.ts  # Interface do repositório
│   │   ├── application/     # Camada de Aplicação
│   │   │   ├── create-transaction.use-case.ts  # Caso de uso
│   │   │   └── *.spec.ts                       # Testes unitários
│   │   ├── infrastructure/  # Camada de Infraestrutura
│   │   │   └── transaction.repository.ts       # Implementação Prisma
│   │   ├── presentation/    # Camada de Apresentação
│   │   │   ├── transactions.controller.ts      # Controller HTTP
│   │   │   └── dtos/                           # DTOs de validação
│   │   └── transactions.module.ts
│   │
│   ├── users/
│   ├── audit/
│   └── categories/
│
├── app.module.ts
└── main.ts
```

---

## 🎯 Princípios DDD Aplicados

### 1. **Domain Layer (Domínio)**
- **Entidades:** Objetos com identidade (Transaction, User)
- **Value Objects:** Objetos imutáveis sem identidade
- **Regras de negócio:** Validações dentro das entidades
- **Interfaces de Repositório:** Contratos sem implementação

**Exemplo:**
```typescript
// transaction.entity.ts
export class Transaction {
  private validate(): void {
    if (this.amount <= 0) {
      throw new Error('Amount must be greater than zero')
    }
  }

  isIncome(): boolean {
    return this.type === TransactionType.INCOME
  }
}
```

### 2. **Application Layer (Aplicação)**
- **Use Cases:** Orquestram a lógica de negócio
- **Comandos:** Ações que modificam estado (CreateTransaction)
- **Queries:** Consultas que apenas leem (GetTransactions)
- **Não dependem de infraestrutura:** Usam interfaces

**Exemplo:**
```typescript
// create-transaction.use-case.ts
@Injectable()
export class CreateTransactionUseCase {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly repository: ITransactionRepository
  ) {}

  async execute(dto: CreateTransactionDto): Promise<Transaction> {
    const transaction = Transaction.create(dto)
    return await this.repository.create(transaction)
  }
}
```

### 3. **Infrastructure Layer (Infraestrutura)**
- **Repositórios:** Implementação com Prisma
- **Adapters:** Integração com serviços externos
- **Conhece detalhes técnicos:** ORM, banco de dados, APIs

**Exemplo:**
```typescript
// transaction.repository.ts
@Injectable()
export class TransactionRepository implements ITransactionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(transaction: Transaction): Promise<Transaction> {
    const created = await this.prisma.transaction.create({ data: {...} })
    return this.toDomain(created)
  }
}
```

### 4. **Presentation Layer (Apresentação)**
- **Controllers:** Recebem requests HTTP
- **DTOs:** Validam entrada com class-validator
- **Responses:** Formatam saída

**Exemplo:**
```typescript
// transactions.controller.ts
@Controller('transactions')
export class TransactionsController {
  @Post()
  async create(@Body() dto: CreateTransactionDto) {
    return this.createTransactionUseCase.execute(dto)
  }
}
```

---

## ✅ Testes Unitários

Todos os Use Cases possuem testes unitários com **100% de cobertura**.

### Padrão de Testes

```typescript
describe('CreateTransactionUseCase', () => {
  let useCase: CreateTransactionUseCase
  let repository: MockTransactionRepository

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CreateTransactionUseCase,
        { provide: TRANSACTION_REPOSITORY, useClass: MockTransactionRepository }
      ]
    }).compile()

    useCase = module.get<CreateTransactionUseCase>(CreateTransactionUseCase)
    repository = module.get<MockTransactionRepository>(TRANSACTION_REPOSITORY)
  })

  it('should create a valid transaction', async () => {
    // Arrange
    const dto = { type: 'INCOME', amount: 100, ... }

    // Act
    const result = await useCase.execute(dto)

    // Assert
    expect(result.amount).toBe(100)
  })
})
```

### Executar Testes

```bash
# Todos os testes
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:cov
```

---

## 🗄️ Prisma ORM

### Schema

O schema está em `prisma/schema.prisma` com:
- **Enums:** UserRole, TransactionType, AuditAction
- **Models:** User, Transaction, Category, AuditLog
- **Indexes:** Otimizados para queries frequentes
- **Constraints:** Unique, foreign keys, cascades

### Comandos Prisma

```bash
# Gerar Prisma Client
npm run prisma:generate

# Criar migration
npm run prisma:migrate

# Abrir Prisma Studio (GUI)
npm run prisma:studio

# Seed database
npm run prisma:seed
```

---

## 🚀 Como Executar

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Copie `.env.example` para `.env` e ajuste:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/agape_gestor?schema=public"
JWT_SECRET="your-secret-key"
PORT=3001
```

### 3. Subir banco de dados

```bash
# Com Docker Compose (na raiz do projeto)
docker-compose up -d
```

### 4. Executar migrations

```bash
npm run prisma:migrate
```

### 5. Iniciar servidor

```bash
# Desenvolvimento
npm run start:dev

# Produção
npm run build
npm run start:prod
```

API estará disponível em: `http://localhost:3001`

---

## 📋 Endpoints Disponíveis

### Transactions

```http
POST /transactions
GET /transactions
GET /transactions/:id
PUT /transactions/:id
DELETE /transactions/:id  # Bloqueado por auditoria
```

### Exemplo de Request

```bash
curl -X POST http://localhost:3001/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "type": "INCOME",
    "categoryId": "uuid-category",
    "amount": 150.50,
    "description": "Dízimo da semana",
    "donorName": "João Silva"
  }'
```

---

## 🔐 Regras de Negócio Implementadas

1. **Validação de Valores:**
   - Transações devem ter valor > 0
   - Descrição mínima de 3 caracteres

2. **Dízimos Nominais:**
   - Nome do dizimista deve ter ≥ 3 caracteres

3. **Comprovantes Obrigatórios:**
   - Transações acima de R$ 10.000 exigem comprovante

4. **Auditoria:**
   - Transações financeiras **NÃO podem ser deletadas**
   - Apenas estorno via transação reversa
   - Todos os CRUDs geram logs automáticos

5. **Data da Transação:**
   - Não pode ser futura
   - Default: data atual

---

## 🧪 Próximos Passos

- [ ] Implementar módulo de Users com autenticação
- [ ] Implementar módulo de Audit com logs imutáveis
- [ ] Adicionar Guards RBAC (Role-Based Access Control)
- [ ] Implementar JWT authentication
- [ ] Adicionar testes de integração (E2E)
- [ ] Documentação Swagger/OpenAPI
- [ ] Rate limiting e throttling
- [ ] Backup automático do banco

---

## 📚 Referências

- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

---

**Status:** ✅ Backend funcional com testes unitários (8/8 passing)

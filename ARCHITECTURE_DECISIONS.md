# Decisões Arquiteturais - Ágape Gestor

## 📋 Resumo Executivo

Este documento registra as principais decisões arquiteturais tomadas no projeto Ágape Gestor.

---

## 1️⃣ Next.js 15 como Framework Frontend

### ✅ Decisão
Adotamos **Next.js 15 com App Router** ao invés de React.js puro (inicialmente planejado).

### 💡 Justificativa

**Vantagens para o projeto:**
- **Performance superior:** SSR/RSC reduz tempo de carregamento inicial do dashboard
- **Code splitting automático:** Cada rota carrega apenas o necessário
- **File-based routing:** Organização intuitiva (`/app/dashboard`, `/app/login`)
- **Otimizações built-in:** Image optimization, font loading, bundle size
- **Melhor DX:** HMR, TypeScript, ESLint configurados automaticamente
- **Preparado para crescimento:** Landing page pública futura já tem SEO nativo

**Por que funciona para Ágape Gestor:**
- Sistema interno autenticado se beneficia de streaming e suspense
- Relatórios podem ser gerados no servidor (futuro)
- Menor complexidade de configuração vs React + Vite + React Router
- Projeto está começando do zero - melhor momento para decidir

### 🚀 Implementação
```
frontend/
├── src/app/              # App Router
│   ├── dashboard/        # Dashboard principal
│   ├── login/            # Autenticação
│   ├── transactions/     # Gestão de transações
│   ├── reports/          # Relatórios
│   ├── layout.tsx        # Layout raiz
│   └── page.tsx          # Home
```

---

## 2️⃣ Prisma ORM (Recomendado para Backend)

### ✅ Decisão
Recomendamos **Prisma ORM** para o backend NestJS + PostgreSQL.

### 💡 Justificativa

**Vantagens específicas para gestão financeira:**
- ✅ **Type-safety completa:** Erros de tipo detectados em tempo de compilação
- ✅ **Migrations declarativas:** Schema versionado junto com código
- ✅ **Auditoria facilitada:** Middleware do Prisma para logs automáticos
- ✅ **Performance:** Connection pooling e query optimization nativos
- ✅ **Prisma Studio:** Interface visual para debug de dados sensíveis
- ✅ **Excellent com NestJS:** Integração oficial bem documentada

**Exemplo de schema para auditoria:**
```prisma
model AuditLog {
  id        String   @id @default(uuid())
  action    String   // CREATE, UPDATE, DELETE
  entity    String   // Transaction, User
  entityId  String
  oldValue  Json?
  newValue  Json?
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  timestamp DateTime @default(now())

  @@index([entity, entityId])
  @@index([timestamp])
}
```

**Auditoria automática via middleware:**
```typescript
prisma.$use(async (params, next) => {
  const before = await prisma[params.model].findUnique({ where: params.args.where })
  const result = await next(params)

  await prisma.auditLog.create({
    data: {
      action: params.action,
      entity: params.model,
      entityId: params.args.where.id,
      oldValue: before,
      newValue: result,
      userId: currentUser.id
    }
  })

  return result
})
```

---

## 3️⃣ Supabase - NÃO Recomendado (com ressalva)

### ❌ Decisão
**Não** usar Supabase como banco de dados principal.

### 💡 Justificativa

**Contra argumentos:**
- ❌ README já planeja **Docker + PostgreSQL local** (autocontenção)
- ❌ Dados financeiros sensíveis (dízimos nominais) devem ser **on-premise**
- ❌ Vendor lock-in com serviço externo
- ❌ Custo recorrente (igrejas maiores = mais dados = mais caro)
- ❌ Supabase Auth duplicaria lógica de autenticação do NestJS
- ❌ Conformidade com LGPD mais simples com dados locais

**Exceção - Casos de uso válidos:**
- ✅ **SaaS multi-tenant:** Se o plano for hospedar várias igrejas num só sistema
- ✅ **Storage apenas:** Usar Supabase Storage para upload de comprovantes/recibos PDF
- ✅ **Prototipagem rápida:** Validar MVP antes de produtizar

### 🎯 Alternativa Recomendada
```
Stack On-Premise:
├── PostgreSQL (Docker)         # Banco principal
├── MinIO (Docker)              # Storage S3-compatible para PDFs
├── NestJS + Prisma             # Backend
└── Next.js                     # Frontend
```

**Benefícios:**
- Controle total dos dados
- Sem custos recorrentes de cloud
- Backup e restore simplificados
- Auditoria mais fácil para assembleia

---

## 4️⃣ Stack Final Aprovada

```
┌─────────────────────────────────────────┐
│           FRONTEND (Next.js 15)         │
│  - App Router + Server Components       │
│  - TypeScript + Tailwind CSS            │
│  - React Hook Form + Zod                │
│  - Axios (HTTP client)                  │
└─────────────┬───────────────────────────┘
              │ REST API
              ↓
┌─────────────────────────────────────────┐
│        BACKEND (NestJS + Prisma)        │
│  - Clean Architecture (Modular)         │
│  - JWT Authentication                   │
│  - RBAC (Role-Based Access Control)     │
│  - Audit Logs (Prisma Middleware)       │
└─────────────┬───────────────────────────┘
              │ SQL
              ↓
┌─────────────────────────────────────────┐
│        DATABASE (PostgreSQL 15)         │
│  - ACID Transactions                    │
│  - Immutable Audit Logs                 │
│  - Point-in-time Recovery               │
└─────────────────────────────────────────┘
```

---

## 5️⃣ Princípios de Design

### 🔐 Segurança
- JWT com refresh tokens
- RBAC granular (Admin, Treasurer, Council, Pastor, Viewer)
- Audit logs imutáveis (append-only)
- Validação de entrada (Zod) em frontend e backend

### 📊 Auditoria
- Toda transação financeira gera log automático
- Logs incluem: quem, quando, o que, antes/depois
- Impossível deletar logs (constraint de DB)
- Relatórios de auditoria exportáveis

### 🎯 Performance
- Server-side rendering para dashboards
- Code splitting por rota
- Lazy loading de componentes pesados (gráficos)
- Connection pooling no Prisma

### 🧩 Manutenibilidade
- Clean Architecture (separação de concerns)
- TypeScript em todo stack
- Testes unitários (futuro: Jest + React Testing Library)
- Documentação inline e READMEs

---

## 📅 Histórico de Decisões

| Data       | Decisão                    | Status    |
|------------|----------------------------|-----------|
| 2026-03-10 | Migração para Next.js 15   | ✅ Aprovado |
| 2026-03-10 | Adoção do Prisma ORM       | ✅ Recomendado |
| 2026-03-10 | Rejeição do Supabase (DB)  | ✅ Aprovado |

---

## 🔄 Próximas Decisões Necessárias

1. **Biblioteca de gráficos:** Recharts vs Chart.js vs Victory?
2. **Exportação de relatórios:** Biblioteca para PDF (jsPDF vs Puppeteer)?
3. **Internacionalização:** Suporte para múltiplos idiomas (i18next)?
4. **CI/CD:** GitHub Actions vs GitLab CI?
5. **Hosting:** Self-hosted (Docker Compose) vs Cloud (Railway/Render)?

---

**Última atualização:** 2026-03-10
**Responsável pelas decisões:** Equipe de arquitetura
**Status do documento:** Em evolução

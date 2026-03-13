# ⚡ Quick Start - Ágape Gestor

Guia rápido para colocar o sistema funcionando em **5 minutos**.

---

## 📋 Pré-requisitos

- ✅ Node.js 18+ instalado
- ✅ Conta no [NeonDB](https://neon.tech) (gratuita) com um projeto criado
- ✅ Git (para clonar o repositório)

> Docker é **opcional** — o banco de dados roda na nuvem via NeonDB.

---

## 🚀 Passo a Passo

### 1️⃣ Configurar o NeonDB

1. Acesse [neon.tech](https://neon.tech) e crie um projeto chamado `agape-gestor`
2. No painel do projeto, copie as duas connection strings:
   - **Pooled connection** (hostname com `-pooler`) → será o `DATABASE_URL`
   - **Direct connection** (hostname sem `-pooler`) → será o `DATABASE_URL_UNPOOLED`

---

### 2️⃣ Configurar o Backend

```bash
cd backend

# Instalar dependências
npm install

# Criar arquivo de ambiente
cp .env.example .env
```

Edite o arquivo `backend/.env` com suas strings do NeonDB:

```env
DATABASE_URL="postgresql://user:pass@host-pooler.neon.tech/dbname?sslmode=require"
DATABASE_URL_UNPOOLED="postgresql://user:pass@host.neon.tech/dbname?sslmode=require"
JWT_SECRET="sua-chave-secreta-aqui"
PORT=3001
```

---

### 3️⃣ Aplicar Schema e Seed

```bash
# Gerar Prisma Client
npm run prisma:generate

# Aplicar schema ao banco (cria as tabelas)
npm run prisma:migrate

# Povoar banco com dados iniciais
npm run prisma:seed
```

Você deve ver:

```
🌱 Starting database seed...
✅ Admin created: admin@agapegestor.com
✅ Treasurer created: tesoureiro@agapegestor.com
✅ Created 3 income categories
✅ Created 4 expense categories
✅ Created 5 sample transactions

📊 Database seeded successfully!
─────────────────────────────────────
👥 Users: 2
📁 Categories: 7
💰 Transactions: 5
💵 Total Income: R$ 1000.00
💸 Total Expense: R$ 650.00
💰 Balance: R$ 350.00
─────────────────────────────────────

🔐 Login credentials:
   Admin:     admin@agapegestor.com / admin123
   Treasurer: tesoureiro@agapegestor.com / tesoureiro123
```

---

### 4️⃣ Iniciar o Backend

Ainda no diretório `backend`:

```bash
npm run start:dev
```

Você deve ver:

```
✅ Database connected
🚀 Ágape Gestor API running on: http://localhost:3001
```

Deixe rodando e abra outro terminal.

---

### 5️⃣ Iniciar o Frontend

Em outro terminal, na raiz do projeto:

```bash
cd frontend

# Instalar dependências (se ainda não fez)
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

Você deve ver:

```
▲ Next.js 15
- Local:    http://localhost:3000
✓ Ready in 2.5s
```

---

### 6️⃣ Acessar o Sistema

Abra o navegador em: **http://localhost:3000**

**Login de teste:**
- Email: `admin@agapegestor.com`
- Senha: `admin123`

Ou:
- Email: `tesoureiro@agapegestor.com`
- Senha: `tesoureiro123`

---

## 🔍 Verificar se Está Funcionando

### Backend API

```bash
# Testar endpoint health
curl http://localhost:3001

# Listar transações
curl http://localhost:3001/transactions
```

### Banco de Dados (NeonDB)

Acesse o painel do NeonDB em [console.neon.tech](https://console.neon.tech) para visualizar os dados diretamente.

### Prisma Studio (Interface Visual Local)

```bash
cd backend
npm run prisma:studio
```

Abre em: **http://localhost:5555**

---

## 🛑 Parar Tudo

```bash
# Parar frontend: Ctrl+C no terminal

# Parar backend: Ctrl+C no terminal

# O banco NeonDB fica na nuvem — não precisa parar nada
```

---

## 🔄 Reiniciar do Zero

Se algo der errado:

```bash
cd backend

# Reset completo do banco (apaga e recria todas as tabelas)
npm run prisma:migrate reset

# Isso vai:
# - Dropar todas as tabelas
# - Recriar o schema
# - Executar o seed automaticamente

# Iniciar backend
npm run start:dev

# Em outro terminal, iniciar frontend
cd ../frontend
npm run dev
```

---

## 📊 Testar Criação de Transação

Com o backend rodando, teste criar uma transação:

```bash
curl -X POST http://localhost:3001/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "type": "INCOME",
    "categoryId": "UUID-DA-CATEGORIA",
    "amount": 100.50,
    "description": "Teste de dízimo"
  }'
```

(Substitua `UUID-DA-CATEGORIA` por um ID real que você pega no Prisma Studio)

---

## 🐛 Problemas Comuns

### Backend não conecta ao banco

1. Verifique se as duas variáveis estão no `backend/.env`:
   ```env
   DATABASE_URL="postgresql://...pooler..."
   DATABASE_URL_UNPOOLED="postgresql://...direto..."
   ```
2. Certifique-se de que o projeto NeonDB está ativo no painel

### Erro "SSL required"

Confirme que as URLs terminam com `?sslmode=require`

### Migrations não aplicam

```bash
cd backend

# Reset completo do banco
npm run prisma:migrate reset
```

### Frontend não carrega

1. Certifique-se de que está na porta correta: `http://localhost:3000`
2. Verifique se o Next.js compilou sem erros
3. Limpe o cache: `rm -rf .next && npm run dev`

---

## ✅ Verificação Final

Se tudo estiver funcionando, você deve ter:

- ✅ NeonDB: banco rodando na nuvem (sem Docker necessário)
- ✅ Backend: API em `http://localhost:3001`
- ✅ Frontend: Next.js em `http://localhost:3000`
- ✅ Banco: 2 usuários, 7 categorias, 5 transações

---

## 🎯 Próximos Passos

Agora que está funcionando:

1. Explorar o código da arquitetura DDD em `backend/src/modules/transactions`
2. Ver os testes unitários: `cd backend && npm test`
3. Implementar autenticação JWT
4. Criar novos módulos (Users, Audit, Reports)
5. Conectar frontend ao backend via API

---

**Dúvidas?** Consulte:
- `README.md` - Visão geral do projeto
- `backend/README.md` - Documentação técnica do backend
- `ARCHITECTURE_DECISIONS.md` - Decisões arquiteturais

**Tempo estimado:** 5-10 minutos ⚡

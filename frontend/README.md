# Ágape Gestor - Frontend

Frontend do sistema de gestão financeira construído com Next.js 15.

## 🚀 Tecnologias

- **Next.js 15** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização utility-first
- **Axios** - Cliente HTTP para API
- **React Hook Form + Zod** - Validação de formulários
- **Lucide React** - Ícones
- **date-fns** - Manipulação de datas

## 📁 Estrutura de Pastas

```
src/
├── app/                    # App Router do Next.js
│   ├── dashboard/         # Página de dashboard
│   ├── login/             # Página de login
│   ├── transactions/      # Gestão de transações
│   ├── reports/           # Relatórios
│   ├── layout.tsx         # Layout raiz
│   └── page.tsx           # Página inicial
├── components/
│   ├── ui/                # Componentes UI reutilizáveis (Button, Card, etc)
│   ├── layout/            # Componentes de layout (Header, Sidebar)
│   ├── forms/             # Formulários específicos
│   └── charts/            # Componentes de gráficos
├── services/
│   └── api.ts             # Configuração do Axios
├── types/
│   └── index.ts           # Types TypeScript globais
├── utils/
│   └── formatCurrency.ts  # Funções utilitárias
├── hooks/                 # Custom React hooks
└── lib/
    └── utils.ts           # Utilitários (cn, etc)
```

## 🛠️ Configuração

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Copie o arquivo `.env.local.example` para `.env.local`:

```bash
cp .env.local.example .env.local
```

Edite as variáveis conforme necessário:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 3. Executar em desenvolvimento

```bash
npm run dev
```

O frontend estará disponível em `http://localhost:3000`

## 📋 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run start` - Inicia servidor de produção
- `npm run lint` - Executa ESLint
- `npm run type-check` - Verifica tipos TypeScript

## 🎨 Componentes UI

Os componentes UI base estão em `src/components/ui/` e seguem o padrão:
- Tailwind CSS para estilização
- Variantes com `class-variance-authority`
- Totalmente tipados com TypeScript

Exemplo de uso:

```tsx
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export default function MyPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Título</CardTitle>
      </CardHeader>
      <CardContent>
        <Button>Clique aqui</Button>
      </CardContent>
    </Card>
  )
}
```

## 🔐 Autenticação

O sistema usa JWT armazenado no localStorage. O interceptor do Axios adiciona automaticamente o token em todas as requisições.

Fluxo:
1. Login em `/login` envia credenciais para API
2. API retorna JWT token
3. Token é armazenado no localStorage
4. Axios adiciona `Authorization: Bearer <token>` em todas as requests
5. Logout remove o token

## 🌐 Integração com Backend

Configure a URL da API em `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Todas as chamadas de API usam o cliente configurado em `src/services/api.ts`.

## 📦 Build e Deploy

### Build local

```bash
npm run build
npm run start
```

### Deploy (Vercel)

O projeto está otimizado para deploy na Vercel:

1. Conecte o repositório na Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

### Deploy (Docker)

```bash
# Build da imagem
docker build -t agape-gestor-frontend .

# Executar container
docker run -p 3000:3000 agape-gestor-frontend
```

## 🎯 Próximos Passos

- [ ] Implementar páginas de transações
- [ ] Adicionar relatórios exportáveis (PDF/Excel)
- [ ] Criar componentes de gráficos (Chart.js ou Recharts)
- [ ] Implementar sistema de notificações
- [ ] Adicionar testes (Jest + React Testing Library)
- [ ] Implementar internacionalização (i18n)

## 📄 Licença

Projeto privado - Uso interno.

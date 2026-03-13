# ⛪ Ágape Gestor

> Transparência, segurança e governança para a gestão financeira da sua Igreja.

O **Ágape Gestor** é um sistema de gestão financeira (ERP de nicho) projetado especificamente para instituições religiosas. Ele foca no controle rigoroso e auditável de entradas (dízimos e ofertas) e saídas (despesas operacionais e pastorais), garantindo a conformidade e a prestação de contas transparente para a comunidade.

---

## 🎯 Por que o Ágape Gestor existe?

A gestão de tesourarias voluntárias muitas vezes sofre com planilhas frágeis e recibos de papel perdidos. Ninguém baixa um app apenas porque ele é bonito, mas porque ele resolve uma dor. 

* **Utilidade Real:** Centralizar a arrecadação e os gastos, eliminando a desorganização.
* **Ganho de Eficiência:** Automatizar o fechamento mensal e gerar balancetes instantâneos para assembleias.
* **Segurança Institucional:** Proteger a liderança através de logs de auditoria imutáveis, provando a integridade de cada centavo movimentado.

---

## 🏗️ Arquitetura e Tecnologias

O sistema foi desenhado utilizando a abordagem de **Monolito Modular** com **Clean Architecture**, priorizando a consistência de dados e facilitando manutenções futuras.

* **Frontend:** Next.js 15 (App Router) + TypeScript + Tailwind CSS
* **Backend:** NestJS + TypeScript + Prisma ORM 5 (Clean Architecture / DDD)
* **Banco de Dados:** NeonDB — PostgreSQL serverless (sem Docker necessário)
* **ORM:** Prisma 5 com suporte nativo ao NeonDB



---

## ✨ Funcionalidades Principais

1. **Gestão de Transações:** Registro de Entradas (Dízimos nominais, Ofertas anônimas) e Saídas categorizadas (Zeladoria, Prebenda, Manutenção).
2. **Controle de Acesso (RBAC):** * *Administrador/Tesoureiro:* Permissão de escrita e edição (auditável).
   * *Conselho/Pastor:* Permissão estrita de leitura e relatórios.
3. **Trilha de Auditoria (Immutable Logs):** Registro automático no banco de dados de `quem`, `quando` e `o que` foi alterado em qualquer lançamento financeiro.
4. **Relatórios e Dashboards:** Exportação de balancetes mensais e anuais (PDF/Excel) e gráficos de saúde financeira.

---

## 📂 Estrutura do Projeto

O repositório é dividido em duas partes principais:

```text
agape-gestor/
├── backend/              # API RESTful em NestJS + Prisma (DDD / Clean Architecture)
├── frontend/             # Next.js 15 com App Router (Interface do usuário)
└── docker-compose.yml    # Opcional — uso offline apenas
```

> O banco de dados roda no **NeonDB** (cloud). Não é necessário Docker para o banco.

---

## 🚀 Como Começar

Consulte o [QUICK_START.md](QUICK_START.md) para um guia passo a passo.

**Pré-requisitos:**
- Node.js 18+
- Conta gratuita no [NeonDB](https://neon.tech)

---

## 📚 Documentação

| Arquivo | Descrição |
|---------|-----------|
| [QUICK_START.md](QUICK_START.md) | Guia de setup em 5 minutos |
| [backend/README.md](backend/README.md) | Documentação técnica do backend |
| [ARCHITECTURE_DECISIONS.md](ARCHITECTURE_DECISIONS.md) | Decisões arquiteturais |
| [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) | Resumo do que foi implementado |

---

**Status do Projeto:** 🟢 Funcional e Testado
**Última Atualização:** 2026-03-12
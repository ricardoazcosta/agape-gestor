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

* **Frontend:** React.js + TypeScript + Tailwind CSS
* **Backend:** Node.js com NestJS + TypeScript
* **Banco de Dados:** PostgreSQL (Relacional, propriedades ACID estritas)
* **Infraestrutura Local:** Docker & Docker Compose



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
├── backend/        # API RESTful em NestJS (Regras de negócio e segurança)
├── frontend/       # SPA em React.js (Interface do usuário)
└── docker-compose  # Configuração do banco de dados local
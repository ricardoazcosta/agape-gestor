import { PrismaClient, UserRole, TransactionType } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // 1. Criar usuário administrador
  console.log('👤 Creating admin user...')
  const adminPassword = await bcrypt.hash('admin123', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@agapegestor.com' },
    update: {},
    create: {
      name: 'Administrador',
      email: 'admin@agapegestor.com',
      password: adminPassword,
      role: UserRole.ADMIN,
    },
  })
  console.log(`✅ Admin created: ${admin.email}`)

  // 2. Criar usuário tesoureiro
  console.log('👤 Creating treasurer user...')
  const treasurerPassword = await bcrypt.hash('tesoureiro123', 10)

  const treasurer = await prisma.user.upsert({
    where: { email: 'tesoureiro@agapegestor.com' },
    update: {},
    create: {
      name: 'João Tesoureiro',
      email: 'tesoureiro@agapegestor.com',
      password: treasurerPassword,
      role: UserRole.TREASURER,
    },
  })
  console.log(`✅ Treasurer created: ${treasurer.email}`)

  // 3. Criar categorias de ENTRADA
  console.log('📁 Creating income categories...')
  const incomeCategories = await Promise.all([
    prisma.category.upsert({
      where: { name_type: { name: 'Dízimo', type: TransactionType.INCOME } },
      update: {},
      create: {
        name: 'Dízimo',
        description: 'Dízimos dos membros',
        type: TransactionType.INCOME,
        createdById: admin.id,
      },
    }),
    prisma.category.upsert({
      where: { name_type: { name: 'Oferta', type: TransactionType.INCOME } },
      update: {},
      create: {
        name: 'Oferta',
        description: 'Ofertas voluntárias',
        type: TransactionType.INCOME,
        createdById: admin.id,
      },
    }),
    prisma.category.upsert({
      where: { name_type: { name: 'Doação', type: TransactionType.INCOME } },
      update: {},
      create: {
        name: 'Doação',
        description: 'Doações especiais',
        type: TransactionType.INCOME,
        createdById: admin.id,
      },
    }),
  ])
  console.log(`✅ Created ${incomeCategories.length} income categories`)

  // 4. Criar categorias de SAÍDA
  console.log('📁 Creating expense categories...')
  const expenseCategories = await Promise.all([
    prisma.category.upsert({
      where: { name_type: { name: 'Manutenção', type: TransactionType.EXPENSE } },
      update: {},
      create: {
        name: 'Manutenção',
        description: 'Manutenção predial',
        type: TransactionType.EXPENSE,
        createdById: admin.id,
      },
    }),
    prisma.category.upsert({
      where: { name_type: { name: 'Utilidades', type: TransactionType.EXPENSE } },
      update: {},
      create: {
        name: 'Utilidades',
        description: 'Água, luz, internet',
        type: TransactionType.EXPENSE,
        createdById: admin.id,
      },
    }),
    prisma.category.upsert({
      where: { name_type: { name: 'Prebenda', type: TransactionType.EXPENSE } },
      update: {},
      create: {
        name: 'Prebenda',
        description: 'Prebenda pastoral',
        type: TransactionType.EXPENSE,
        createdById: admin.id,
      },
    }),
    prisma.category.upsert({
      where: { name_type: { name: 'Missões', type: TransactionType.EXPENSE } },
      update: {},
      create: {
        name: 'Missões',
        description: 'Apoio missionário',
        type: TransactionType.EXPENSE,
        createdById: admin.id,
      },
    }),
  ])
  console.log(`✅ Created ${expenseCategories.length} expense categories`)

  // 5. Criar transações de exemplo
  console.log('💰 Creating sample transactions...')

  const dizimoCategory = incomeCategories[0]
  const ofertaCategory = incomeCategories[1]
  const manutencaoCategory = expenseCategories[0]
  const utilidadesCategory = expenseCategories[1]

  const transactions = await Promise.all([
    // Dízimos
    prisma.transaction.create({
      data: {
        type: TransactionType.INCOME,
        categoryId: dizimoCategory.id,
        amount: 500.00,
        description: 'Dízimo - Janeiro 2024',
        date: new Date('2024-01-15'),
        donorName: 'Maria Silva',
        createdById: treasurer.id,
      },
    }),
    prisma.transaction.create({
      data: {
        type: TransactionType.INCOME,
        categoryId: dizimoCategory.id,
        amount: 350.00,
        description: 'Dízimo - Janeiro 2024',
        date: new Date('2024-01-20'),
        donorName: 'José Santos',
        createdById: treasurer.id,
      },
    }),
    // Ofertas
    prisma.transaction.create({
      data: {
        type: TransactionType.INCOME,
        categoryId: ofertaCategory.id,
        amount: 150.00,
        description: 'Oferta do culto de domingo',
        date: new Date('2024-01-21'),
        createdById: treasurer.id,
      },
    }),
    // Despesas
    prisma.transaction.create({
      data: {
        type: TransactionType.EXPENSE,
        categoryId: manutencaoCategory.id,
        amount: 200.00,
        description: 'Reparo no telhado',
        date: new Date('2024-01-10'),
        createdById: treasurer.id,
      },
    }),
    prisma.transaction.create({
      data: {
        type: TransactionType.EXPENSE,
        categoryId: utilidadesCategory.id,
        amount: 450.00,
        description: 'Conta de luz - Janeiro',
        date: new Date('2024-01-25'),
        createdById: treasurer.id,
      },
    }),
  ])
  console.log(`✅ Created ${transactions.length} sample transactions`)

  // 6. Criar logs de auditoria
  console.log('📋 Creating audit logs...')
  await prisma.auditLog.create({
    data: {
      action: 'LOGIN',
      entity: 'User',
      entityId: admin.id,
      userId: admin.id,
      ipAddress: '127.0.0.1',
      userAgent: 'Seed Script',
    },
  })
  console.log('✅ Audit log created')

  // 7. Estatísticas finais
  const stats = {
    users: await prisma.user.count(),
    categories: await prisma.category.count(),
    transactions: await prisma.transaction.count(),
    totalIncome: await prisma.transaction.aggregate({
      where: { type: TransactionType.INCOME },
      _sum: { amount: true },
    }),
    totalExpense: await prisma.transaction.aggregate({
      where: { type: TransactionType.EXPENSE },
      _sum: { amount: true },
    }),
  }

  console.log('\n📊 Database seeded successfully!')
  console.log('─────────────────────────────────────')
  console.log(`👥 Users: ${stats.users}`)
  console.log(`📁 Categories: ${stats.categories}`)
  console.log(`💰 Transactions: ${stats.transactions}`)
  console.log(`💵 Total Income: R$ ${Number(stats.totalIncome._sum.amount).toFixed(2)}`)
  console.log(`💸 Total Expense: R$ ${Number(stats.totalExpense._sum.amount).toFixed(2)}`)
  console.log(`💰 Balance: R$ ${(Number(stats.totalIncome._sum.amount) - Number(stats.totalExpense._sum.amount)).toFixed(2)}`)
  console.log('─────────────────────────────────────')
  console.log('\n🔐 Login credentials:')
  console.log('   Admin:     admin@agapegestor.com / admin123')
  console.log('   Treasurer: tesoureiro@agapegestor.com / tesoureiro123')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

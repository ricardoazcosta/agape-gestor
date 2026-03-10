export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-4">⛪ Ágape Gestor</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Transparência, segurança e governança para a gestão financeira da sua Igreja.
        </p>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-12">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-semibold mb-2">Gestão de Transações</h3>
            <p className="text-sm text-muted-foreground">
              Registro de entradas e saídas categorizadas
            </p>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-semibold mb-2">Controle de Acesso (RBAC)</h3>
            <p className="text-sm text-muted-foreground">
              Permissões por função de usuário
            </p>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-semibold mb-2">Trilha de Auditoria</h3>
            <p className="text-sm text-muted-foreground">
              Logs imutáveis de todas as operações
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

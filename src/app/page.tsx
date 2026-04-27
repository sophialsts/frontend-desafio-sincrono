export default function Home() {
  return (
    <div className="flex flex-col gap-6">

      {/* HEADER */}
      <div className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">
          Painel de Implementação - Sistema Acadêmico
        </h1>
        <p className="text-slate-700">
          Utilize esta página como guia para implementar as funcionalidades do sistema.
          <strong> Reaproveite os padrões já existentes</strong>.
        </p>
      </div>

      {/* GRID DE TAREFAS */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">

        <div className="rounded-2xl bg-white p-4 shadow-sm border">
          <h3 className="font-semibold text-green-600">
            Listagem de Produções (Fácil)
          </h3>
          <ul className="text-sm text-slate-700 list-disc ml-4 mt-2">
            <li>GET /producoes</li>
            <li>Exibir cards (título, ano, pesquisador)</li>
            <li>Carregar automaticamente ao abrir página</li>
          </ul>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-sm border">
          <h3 className="font-semibold text-green-600">
             Quantidade Total (Fácil)
          </h3>
          <ul className="text-sm text-slate-700 list-disc ml-4 mt-2">
            <li>Usar tamanho do array</li>
            <li>Exibir contagem na tela</li>
            <li>Atualizar após mudanças</li>
          </ul>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-sm border">
          <h3 className="font-semibold text-amber-600">
             Adição de Pesquisador (Médio)
          </h3>
          <ul className="text-sm text-slate-700 list-disc ml-4 mt-2">
            <li>Botão &quot;Adicionar Pesquisador&quot;</li>
            <li>Gerar UUID automaticamente</li>
            <li>POST /pesquisadores</li>
            <li>Atualizar lista após sucesso</li>
          </ul>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-sm border">
          <h3 className="font-semibold text-red-600">
             Edição de Produção (Difícil)
          </h3>
          <ul className="text-sm text-slate-700 list-disc ml-4 mt-2">
            <li>Tarefa de frontend e backend</li>
            <li>Botão &quot;Editar&quot; em cada card</li>
            <li>Formulário pré-preenchido</li>
            <li>PUT /producoes/{`{id}`}</li>
            <li>ID não editável</li>
          </ul>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-sm border">
          <h3 className="font-semibold text-amber-600">
             Remoção de Pesquisador (Médio)
          </h3>
          <ul className="text-sm text-slate-700 list-disc ml-4 mt-2">
            <li>Tarefa de frontend e backend</li>
            <li>Botão &quot;Remover&quot; em cada card</li>
            <li>Confirmar exclusão antes de enviar</li>
            <li>DELETE /pesquisadores/{`{lattes_id}`}</li>
            <li>Atualizar a lista após sucesso</li>
            <li>Tratar erro se houver vínculo com produções</li>
          </ul>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-sm border">
          <h3 className="font-semibold text-red-600">
             Tratamento de Erros (Difícil)
          </h3>
          <ul className="text-sm text-slate-700 list-disc ml-4 mt-2">
            <li>Tarefa de frontend e backend</li>
            <li>Aplicar apenas na edição de produção</li>
            <li>Tratar 400, 404 e 500</li>
            <li>Exibir feedback ao usuário</li>
            <li>Manter formulário aberto em erro</li>
            <li>Tratar erro de rede</li>
          </ul>
        </div>

      </div>

      {/* DICA FINAL */}
      <div className="rounded-3xl border border-yellow-200 bg-yellow-50 p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">
          💡 Dica importante
        </h2>
        <p className="text-slate-700 mt-2">
          Use como base as implementações já existentes no projeto (services, formulários e padrões de requisição).
        </p>
      </div>

    </div>
  );
}

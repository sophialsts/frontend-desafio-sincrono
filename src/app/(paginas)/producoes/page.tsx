"use client";

import { FormEvent, useState } from 'react';
import { criarProducao } from "@/services/producoes";
import AdicionarBotao from "@/components/AdicionarBotao";

export default function ProducoesPage() {
    const [aberto, setAberto] = useState(false);
    const [nomeartigo, setNomeartigo] = useState('');
    const [issn, setIssn] = useState('');
    const [anoartigo, setAnoartigo] = useState<string>('');
    const [pesquisadoresId, setPesquisadoresId] = useState('');
    const [erro, setErro] = useState('');
    const [erroIssn, setErroIssn] = useState('');
    const [carregando, setCarregando] = useState(false);

    const handleFecharFormulario = () => {
        setAberto(false);
        setNomeartigo('');
        setIssn('');
        setAnoartigo('');
        setPesquisadoresId('');
        setErro('');
        setErroIssn('');
    };

    const handleAdicionar = async () => {
        setAberto((valor) => !valor);
        setErro('');
        if (aberto) {
            handleFecharFormulario();
        }
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErro('');
        setErroIssn('');

        if (issn.length !== 8) {
            setErroIssn('O ISSN deve conter exatamente 8 dígitos numéricos.');
            return;
        }

        setCarregando(true);

        try {
            await criarProducao({
                nomeartigo,
                issn,
                anoartigo: Number(anoartigo),
                pesquisadores_id: pesquisadoresId,
            });

            // ESCREVA AQUI a sincronização da UI após o POST.
            // Ex.: chamar uma função de recarga ou atualizar o estado local da listagem.

            setNomeartigo('');
            setIssn('');
            setAnoartigo('');
            setPesquisadoresId('');
            setAberto(false);
        } catch (e) {
            setErro((e as Error).message || 'Falha ao salvar produção.');

            /*
              TRATAMENTO DE ERROS DO BACKEND PARA EDIÇÃO DE PRODUÇÃO:

              Quando o fluxo de edição (PUT /producoes/{id}) for implementado, estes cenários
              precisam ser tratados de forma explícita com base no retorno da API:

              1. Erro 400:
                 Usar para dados inválidos, como ISSN fora do formato esperado, campos obrigatórios
                 ausentes ou ano inválido. Nesse caso, o ideal é mapear o erro para o campo correto
                 usando estados específicos, por exemplo `setErroIssn(...)`.

              2. Erro 404:
                 Usar quando a produção não existir mais ou quando o pesquisador informado não for encontrado.
                 Aqui vale exibir uma mensagem clara para a pessoa entender que o vínculo ou o registro não existe.

              3. Erro 500:
                 Usar para falhas internas do servidor. Nesse caso, mostre uma mensagem genérica e amigável,
                 sem depender de detalhes técnicos da API.

              4. Erro de rede / indisponibilidade:
                 Tratar quando a requisição nem chega ao backend, como timeout ou servidor offline.
                 O ideal é informar que não foi possível concluir a edição e sugerir nova tentativa.

              5. Regra importante de UX:
                 Em qualquer erro durante a edição, mantenha o formulário aberto e preserve os dados digitados
                 para a pessoa corrigir o problema sem preencher tudo novamente.
            */
        } finally {
            setCarregando(false);
        }
    };

    return (
        <div className="space-y-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-2xl font-semibold text-slate-900">Produções</h2>
                    <p className="text-sm text-slate-600">Registre novas produções para acompanhar dados atualizados rapidamente.</p>
                </div>
                <AdicionarBotao label="Adicionar produção" aberto={aberto} onClick={handleAdicionar} />
            </div>

            {/* ESCREVA AQUI o card de total de producoes.
                Ex.: usar `lista.length` para exibir a quantidade retornada pela busca. */}

            {erro ? (
                <div className="flex items-start justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    <p>{erro}</p>
                    <button
                        type="button"
                        aria-label="Fechar aviso"
                        onClick={() => {
                            setErro('');
                        }}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-full text-lg font-semibold leading-none text-red-600 transition hover:bg-red-100"
                    >
                        ×
                    </button>
                </div>
            ) : null}

            {aberto && (
                <form onSubmit={handleSubmit} className="space-y-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900">Adicionar produção</h3>
                            <p className="text-sm text-slate-500">
                                Preencha os campos e use o fechar para retornar ao estado anterior.
                            </p>
                        </div>
                        <button
                            type="button"
                            aria-label="Fechar formulário"
                            onClick={handleFecharFormulario}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-red-200 bg-red-50 text-xl font-semibold leading-none text-red-600 transition hover:bg-red-100"
                        >
                            ×
                        </button>
                    </div>
                    <div className="grid gap-3 md:grid-cols-2">
                        <label className="flex flex-col text-sm text-slate-700">
                            Nome do artigo
                            <input
                                value={nomeartigo}
                                onChange={(event) => setNomeartigo(event.target.value)}
                                className="mt-2 rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-slate-900 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
                                placeholder="Título da produção"
                            />
                        </label>
                        <label className="flex flex-col text-sm text-slate-700">
                            ISSN
                            <input
                                value={issn}
                                onChange={(event) => {
                                    setIssn(event.target.value.replace(/\D/g, '').slice(0, 8));
                                    if (erroIssn) {
                                        setErroIssn('');
                                    }
                                }}
                                className={`mt-2 rounded-xl bg-slate-50 px-3 py-2 text-slate-900 outline-none focus:ring-2 ${
                                    erroIssn
                                        ? 'border border-red-300 focus:border-red-400 focus:ring-red-200'
                                        : 'border border-slate-300 focus:border-sky-400 focus:ring-sky-200'
                                }`}
                                placeholder="12345678"
                                inputMode="numeric"
                                maxLength={8}
                            />
                            {erroIssn ? (
                                <span className="mt-2 text-sm text-red-600">{erroIssn}</span>
                            ) : null}
                        </label>
                    </div>
                    <div className="grid gap-3 md:grid-cols-2">
                        <label className="flex flex-col text-sm text-slate-700">
                            Ano
                            <input
                                value={anoartigo}
                                onChange={(event) => setAnoartigo(event.target.value)}
                                className="mt-2 rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-slate-900 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
                                placeholder="2025"
                                type="number"
                            />
                        </label>
                        <label className="flex flex-col text-sm text-slate-700">
                            ID do pesquisador
                            <input
                                value={pesquisadoresId}
                                onChange={(event) => setPesquisadoresId(event.target.value)}
                                className="mt-2 rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-slate-900 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
                                placeholder="UUID do pesquisador"
                            />
                            {/* TRATAMENTO FUTURO PARA EDIÇÃO:
                                Quando a edição de produção for implementada, este campo pode receber
                                um erro vindo do backend se o pesquisador informado não existir.
                                A sugestão é criar um estado específico, como `erroPesquisadorId`,
                                destacar o input em vermelho e mostrar uma mensagem abaixo do campo. */}
                        </label>
                    </div>
                    <button
                        type="submit"
                        disabled={carregando}
                        className="inline-flex items-center justify-center rounded-full bg-sky-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                    >
                        {carregando ? 'Adicionando...' : 'Adicionar produção'}
                    </button>
                </form>
            )}

            <section className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">
                <h3 className="text-base font-semibold text-slate-800">Listagem temporariamente removida do frontend</h3>
                <p className="mt-2">
                    Esta tela ficou preparada para focar no cadastro enquanto a experiência de listagem é reconstruída.
                </p>
                {/* ESCREVA AQUI a busca inicial com useEffect.
                    Ex.: chamar listarProducoes ao montar a tela e salvar retorno em estado. */}
                {/* ESCREVA AQUI a renderização da lista e do estado vazio.
                    Ex.: usar condicionais para loading, erro, vazio e cards dos itens. */}
                {/* ESCREVA AQUI os fluxos de editar e remover.
                    Ex.: abrir formulário com dados do item e remover via ação por card. */}
                {/* TRATAMENTO DE ERROS NECESSÁRIO NA EDIÇÃO DE PRODUÇÃO:
                    Ao implementar o fluxo de editar, trate pelo menos estes retornos do backend:
                    - 400: dados inválidos, como ISSN incorreto ou campos obrigatórios ausentes.
                    - 404: produção não encontrada ou pesquisador informado inexistente.
                    - 500: erro interno no servidor.
                    - erro de rede: falha de comunicação com a API.

                    Como implementar:
                    - Envolver o PUT em `try/catch`.
                    - Ler a resposta da API e separar erros gerais de erros por campo.
                    - Exibir mensagens próximas ao campo quando o erro for específico.
                    - Exibir um aviso geral quando o problema for global.
                    - Manter o formulário aberto se a edição falhar. */}
            </section>
        </div>
    );
}

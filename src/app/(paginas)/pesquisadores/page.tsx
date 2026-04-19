"use client";

import { FormEvent, useState, useEffect } from 'react';
import Pesquisador from "@/core/pesquisadores/Pesquisador";
import { criarPesquisador, atualizarPesquisador, removerPesquisador } from "@/services/pesquisadores";
import getPesquisadores from "@/services/pesquisadores";
import AdicionarBotao from "@/components/AdicionarBotao";

export default function Pesquisadores() {
    const [lista, setLista] = useState<Pesquisador[]>([]);
    const [aberto, setAberto] = useState(false);
    const [editandoId, setEditandoId] = useState<string | null>(null);
    const [nome, setNome] = useState('');
    const [lattesId, setLattesId] = useState('');
    const [erro, setErro] = useState('');
    const [carregando, setCarregando] = useState(false);

    // Carregar dados iniciais
    useEffect(() => {
        const carregarPesquisadores = async () => {
            setCarregando(true);
            setErro('');

            try {
                const pesquisadores = await getPesquisadores();
                setLista(pesquisadores);
            } catch (e) {
                setErro((e as Error).message || 'Falha ao carregar pesquisadores.');
            } finally {
                setCarregando(false);
            }
        };

        carregarPesquisadores();
    }, []);

    const handleFecharFormulario = () => {
        setAberto(false);
        setEditandoId(null);
        setNome('');
        setLattesId('');
        setErro('');
    };

    const handleAdicionar = async () => {
        setAberto((valor) => !valor);
        setErro('');
        if (aberto) {
            handleFecharFormulario();
        }
    };

    const handleEditar = (pesquisador: Pesquisador) => {
        setEditandoId(pesquisador.lattes_id);
        setNome(pesquisador.nome);
        setLattesId(pesquisador.lattes_id);
        setAberto(true);
        setErro('');
    };

    const handleRemover = async (lattes_id: string) => {
        if (!confirm('Tem certeza que deseja remover este pesquisador?')) return;
        
        setErro('');
        setCarregando(true);
        try {
            await removerPesquisador(lattes_id);
            setLista((atual) => atual.filter((p) => p.lattes_id !== lattes_id));
        } catch (e) {
            setErro((e as Error).message || 'Falha ao remover pesquisador.');
        } finally {
            setCarregando(false);
        }
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErro('');
        setCarregando(true);

        try {
            if (editandoId) {
                const pesquisadorAtualizado = await atualizarPesquisador(editandoId, { nome, lattes_id: lattesId });
                setLista((atual) =>
                    atual.map((p) => (p.lattes_id === editandoId ? pesquisadorAtualizado : p))
                );
            } else {
                const novoPesquisador = await criarPesquisador({ nome, lattes_id: lattesId });
                setLista((atual) => [novoPesquisador, ...atual]);
            }
            setNome('');
            setLattesId('');
            setAberto(false);
            setEditandoId(null);
        } catch (e) {
            setErro((e as Error).message || 'Falha ao salvar pesquisador.');
        } finally {
            setCarregando(false);
        }
    };

    return (
        <div className="space-y-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-2xl font-semibold text-slate-900">Pesquisadores</h2>
                    <p className="text-sm text-slate-600">Adicione novos pesquisadores e veja os resultados atualizados imediatamente.</p>
                </div>
                <AdicionarBotao label="Adicionar pesquisador" aberto={aberto} onClick={handleAdicionar} />
            </div>

            <div className="rounded-3xl border border-sky-100 bg-gradient-to-br from-sky-50 to-cyan-50 p-5 shadow-sm">
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-sky-700">Resumo</p>
                <div className="mt-3 flex items-end justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900">Total de pesquisadores</h3>
                        <p className="text-sm text-slate-600">Quantidade atual cadastrada na plataforma.</p>
                    </div>
                    <span className="text-4xl font-semibold leading-none text-sky-700">{lista.length}</span>
                </div>
            </div>

            {erro ? (
                <div className="flex items-start justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    <p>{erro}</p>
                    <button
                        type="button"
                        aria-label="Fechar aviso"
                        onClick={() => setErro('')}
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
                            <h3 className="text-lg font-semibold text-slate-900">
                                {editandoId ? 'Editar pesquisador' : 'Adicionar pesquisador'}
                            </h3>
                            <p className="text-sm text-slate-500">
                                Preencha os dados e feche esta aba quando quiser voltar para a lista.
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
                            Nome
                            <input
                                value={nome}
                                onChange={(event) => setNome(event.target.value)}
                                className="mt-2 rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-slate-900 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
                                placeholder="Nome do pesquisador"
                            />
                        </label>
                        <label className="flex flex-col text-sm text-slate-700">
                            ID Lattes
                            <input
                                value={lattesId}
                                onChange={(event) => setLattesId(event.target.value)}
                                className="mt-2 rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-slate-900 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
                                placeholder="0000-0000"
                            />
                        </label>
                    </div>
                    <button
                        type="submit"
                        disabled={carregando}
                        className="inline-flex items-center justify-center rounded-full bg-sky-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                    >
                        {carregando ? (editandoId ? 'Atualizando...' : 'Adicionando...') : (editandoId ? 'Atualizar pesquisador' : 'Adicionar pesquisador')}
                    </button>
                </form>
            )}

            <div className="grid gap-4">
                {!carregando && !erro && lista.length === 0 ? (
                    <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">
                        Nenhum pesquisador cadastrado até o momento.
                    </div>
                ) : null}

                {lista.map((pesquisador) => (
                    <div key={pesquisador.pesquisadores_id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                                <h3 className="text-xl font-semibold text-slate-900">{pesquisador.nome}</h3>
                                <p className="mt-1 text-sm text-slate-500">ID: {pesquisador.pesquisadores_id}</p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEditar(pesquisador)}
                                    className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 transition hover:bg-amber-200"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleRemover(pesquisador.lattes_id)}
                                    disabled={carregando}
                                    className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700 transition hover:bg-red-200 disabled:opacity-50"
                                >
                                    Remover
                                </button>
                            </div>
                        </div>
                        <div className="mt-4 grid gap-3 sm:grid-cols-2 text-sm text-slate-600">
                            <div>
                                <span className="font-medium text-slate-800">Lattes:</span> {pesquisador.lattes_id}
                            </div>
                            <div>
                                <span className="font-medium text-slate-800">Artigos:</span> {pesquisador.articles}</div>
                        </div>
                        {pesquisador.abstract ? (
                            <p className="mt-4 text-sm leading-6 text-slate-700">
                                {pesquisador.abstract}
                            </p>
                        ) : null}
                    </div>
                ))}
            </div>
        </div>
    );
}

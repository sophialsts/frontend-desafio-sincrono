"use client";

import { FormEvent, useState, useEffect } from 'react';
import Producoes from "@/core/producoes/Producoes";
import { criarProducao, atualizarProducao, removerProducao } from "@/services/producoes";
import getProducoes from "@/services/producoes";
import AdicionarBotao from "@/components/AdicionarBotao";

export default function ProducoesPage() {
    const [lista, setLista] = useState<Producoes[]>([]);
    const [aberto, setAberto] = useState(false);
    const [editandoId, setEditandoId] = useState<string | null>(null);
    const [nomeartigo, setNomeartigo] = useState('');
    const [issn, setIssn] = useState('');
    const [anoartigo, setAnoartigo] = useState<string>('');
    const [pesquisadoresId, setPesquisadoresId] = useState('');
    const [erro, setErro] = useState('');
    const [erroIssn, setErroIssn] = useState('');
    const [erroPesquisadorId, setErroPesquisadorId] = useState('');
    const [carregando, setCarregando] = useState(false);

    // Carregar dados iniciais
    useEffect(() => {
        const carregarProducoes = async () => {
            setCarregando(true);
            setErro('');

            try {
                const producoes = await getProducoes();
                setLista(producoes);
            } catch (e) {
                setErro((e as Error).message || 'Falha ao carregar produções.');
            } finally {
                setCarregando(false);
            }
        };

        carregarProducoes();
    }, []);

    const handleFecharFormulario = () => {
        setAberto(false);
        setEditandoId(null);
        setNomeartigo('');
        setIssn('');
        setAnoartigo('');
        setPesquisadoresId('');
        setErro('');
        setErroIssn('');
        setErroPesquisadorId('');
    };

    const handleAdicionar = async () => {
        setAberto((valor) => !valor);
        setErro('');
        if (aberto) {
            handleFecharFormulario();
        }
    };

    const handleEditar = (producao: Producoes) => {
        setEditandoId(producao.producoes_id || null);
        setNomeartigo(producao.nomeartigo);
        setIssn(producao.issn);
        setAnoartigo(producao.anoartigo.toString());
        setPesquisadoresId(producao.pesquisadores_id);
        setAberto(true);
        setErro('');
        setErroIssn('');
        setErroPesquisadorId('');
    };

    const handleRemover = async (id: string) => {
        if (!confirm('Tem certeza que deseja remover esta produção?')) return;
        
        setErro('');
        setCarregando(true);
        try {
            await removerProducao(id);
            setLista((atual) => atual.filter((p) => p.producoes_id !== id));
        } catch (e) {
            setErro((e as Error).message || 'Falha ao remover produção.');
        } finally {
            setCarregando(false);
        }
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErro('');
        setErroIssn('');
        setErroPesquisadorId('');

        if (issn.length !== 8) {
            setErroIssn('O ISSN deve conter exatamente 8 dígitos numéricos.');
            return;
        }

        setCarregando(true);

        try {
            if (editandoId) {
                const producaoAtualizada = await atualizarProducao(editandoId, {
                    nomeartigo,
                    issn,
                    anoartigo: Number(anoartigo),
                    pesquisadores_id: pesquisadoresId,
                });
                setLista((atual) =>
                    atual.map((p) => (p.producoes_id === editandoId ? producaoAtualizada : p))
                );
            } else {
                const novaProducao = await criarProducao({
                    nomeartigo,
                    issn,
                    anoartigo: Number(anoartigo),
                    pesquisadores_id: pesquisadoresId,
                });
                setLista((atual) => [novaProducao, ...atual]);
            }
            setNomeartigo('');
            setIssn('');
            setAnoartigo('');
            setPesquisadoresId('');
            setAberto(false);
            setEditandoId(null);
        } catch (e) {
            const mensagemErro = (e as Error).message || 'Falha ao salvar produção.';

            if (mensagemErro.toLowerCase().includes('pesquisador não encontrado')) {
                setErroPesquisadorId('Nenhum pesquisador foi encontrado com esse ID.');
            }

            if (mensagemErro.toLowerCase().includes('issn')) {
                setErroIssn('O ISSN deve conter exatamente 8 dígitos numéricos.');
            }

            setErro(mensagemErro);
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

            <div className="rounded-3xl border border-sky-100 bg-gradient-to-br from-sky-50 to-cyan-50 p-5 shadow-sm">
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-sky-700">Resumo</p>
                <div className="mt-3 flex items-end justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900">Total de produções</h3>
                        <p className="text-sm text-slate-600">Quantidade atual registrada na plataforma.</p>
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
                        onClick={() => {
                            setErro('');
                            setErroPesquisadorId('');
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
                            <h3 className="text-lg font-semibold text-slate-900">
                                {editandoId ? 'Editar produção' : 'Adicionar produção'}
                            </h3>
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
                                onChange={(event) => {
                                    setPesquisadoresId(event.target.value);
                                    if (erroPesquisadorId) {
                                        setErroPesquisadorId('');
                                    }
                                }}
                                className={`mt-2 rounded-xl bg-slate-50 px-3 py-2 text-slate-900 outline-none focus:ring-2 ${
                                    erroPesquisadorId
                                        ? 'border border-red-300 focus:border-red-400 focus:ring-red-200'
                                        : 'border border-slate-300 focus:border-sky-400 focus:ring-sky-200'
                                }`}
                                placeholder="UUID do pesquisador"
                            />
                            {erroPesquisadorId ? (
                                <span className="mt-2 text-sm text-red-600">{erroPesquisadorId}</span>
                            ) : null}
                        </label>
                    </div>
                    <button
                        type="submit"
                        disabled={carregando}
                        className="inline-flex items-center justify-center rounded-full bg-sky-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                    >
                        {carregando ? (editandoId ? 'Atualizando...' : 'Adicionando...') : (editandoId ? 'Atualizar produção' : 'Adicionar produção')}
                    </button>
                </form>
            )}

            <div className="grid gap-4">
                {!carregando && !erro && lista.length === 0 ? (
                    <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">
                        Nenhuma produção cadastrada até o momento.
                    </div>
                ) : null}

                {lista.map((producao) => (
                    <div key={producao.producoes_id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                                <h3 className="text-xl font-semibold text-slate-900">{producao.nomeartigo}</h3>
                                <p className="mt-1 text-sm text-slate-500">Produção ID: {producao.producoes_id}</p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEditar(producao)}
                                    className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 transition hover:bg-amber-200"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleRemover(producao.producoes_id || '')}
                                    disabled={carregando}
                                    className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700 transition hover:bg-red-200 disabled:opacity-50"
                                >
                                    Remover
                                </button>
                            </div>
                        </div>
                        <div className="mt-4 grid gap-3 sm:grid-cols-2 text-sm text-slate-600">
                            <div>
                                <span className="font-medium text-slate-800">Pesquisador ID:</span> {producao.pesquisadores_id}
                            </div>
                            <div>
                                <span className="font-medium text-slate-800">ISSN:</span> {producao.issn}
                            </div>
                            <div>
                                <span className="font-medium text-slate-800">Ano:</span> {producao.anoartigo}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

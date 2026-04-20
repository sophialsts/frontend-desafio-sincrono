const url: string = "http://localhost:8000/producoes";

const mensagemErroPadrao = {
  listar: "Não foi possível buscar as produções.",
  criar: "Não foi possível cadastrar a produção.",
  atualizar: "Não foi possível atualizar a produção.",
  remover: "Não foi possível remover a produção.",
};

type OperacaoProducao = keyof typeof mensagemErroPadrao;

type ErroValidacao = {
  loc?: Array<string | number>;
  msg?: string;
};

const formatarErro422 = (detail: unknown) => {
  if (!Array.isArray(detail)) {
    return "Há dados inválidos na requisição.";
  }

  const erros = detail
    .map((item) => {
      const erro = item as ErroValidacao;
      const campo = erro.loc?.slice(1).join(".");

      if (campo === "pesquisadores_id") {
        return "O ID do pesquisador deve ser um UUID válido.";
      }

      if (campo === "producoes_id") {
        return "O ID da produção deve ser um UUID válido.";
      }

      if (campo === "issn") {
        return "O ISSN deve conter exatamente 8 dígitos numéricos.";
      }

      return erro.msg;
    })
    .filter(Boolean);

  return erros.length > 0 ? erros.join(" ") : "Há dados inválidos na requisição.";
};

const obterMensagemPorStatus = (status: number, operacao: OperacaoProducao) => {
  if (status === 400) {
    return mensagemErroPadrao[operacao];
  }

  if (status === 422) {
    return "Há dados inválidos na requisição.";
  }

  if (status === 404) {
    return "Produção não encontrada.";
  }

  if (status === 409) {
    return "Já existe uma produção com esse identificador.";
  }

  return mensagemErroPadrao[operacao];
};

const tratarRespostaComErro = async (resposta: Response, operacao: OperacaoProducao) => {
  if (resposta.ok) {
    return;
  }

  const erro = await resposta.json().catch(() => null);
  if (resposta.status === 422) {
    throw new Error(formatarErro422(erro?.detail));
  }

  throw new Error(erro?.detail ?? obterMensagemPorStatus(resposta.status, operacao));
};

const executarRequisicao = async (input: RequestInfo | URL, init: RequestInit, operacao: OperacaoProducao) => {
  try {
    const resposta = await fetch(input, init);
    await tratarRespostaComErro(resposta, operacao);
    return resposta;
  } catch (erro) {
    if (erro instanceof TypeError) {
      throw new Error("Não foi possível se comunicar com o servidor de produções.");
    }

    if (erro instanceof Error) {
      throw erro;
    }

    throw new Error("Não foi possível se comunicar com o servidor de produções.");
  }
};

export interface CriarProducaoDTO {
  nomeartigo: string;
  issn: string;
  anoartigo: number;
  pesquisadores_id: string;
}

export type AtualizarProducaoDTO = CriarProducaoDTO;

// ESCREVA AQUI A FUNCAO DE REQUISICAO listarProducoes.
// Dica: reutilize `executarRequisicao(url, init, "listar")` para preservar
// o tratamento de erros ja existente quando o GET /producoes voltar.

export const criarProducao = async (dados: CriarProducaoDTO) => {
  const resposta = await executarRequisicao(url, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dados),
  }, "criar");

  return resposta.json();
};

export const atualizarProducao = async (id: string, dados: AtualizarProducaoDTO) => {
  const resposta = await executarRequisicao(`${url}/${id}`, {
    method: "PUT",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dados),
  }, "atualizar");

  return resposta.json();
};

export const removerProducao = async (id: string) => {
  const resposta = await executarRequisicao(`${url}/${id}`, {
    method: "DELETE",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
  }, "remover");
  if (resposta.status === 204) {
    return {};
  }

  return resposta.json();
};

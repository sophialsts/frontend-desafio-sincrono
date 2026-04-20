const url: string =
  "http://localhost:8000/pesquisadores";

const mensagemErroPadrao = {
  listar: "Não foi possível buscar os pesquisadores.",
  criar: "Não foi possível cadastrar o pesquisador.",
  atualizar: "Não foi possível atualizar o pesquisador.",
  remover: "Não foi possível remover o pesquisador.",
};

type OperacaoPesquisador = keyof typeof mensagemErroPadrao;

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

      if (campo === "lattes_id") {
        return "O ID Lattes deve ter 16 caracteres.";
      }

      if (campo === "nome") {
        return "O nome informado é inválido.";
      }

      return erro.msg;
    })
    .filter(Boolean);

  return erros.length > 0 ? erros.join(" ") : "Há dados inválidos na requisição.";
};

const obterMensagemPorStatus = (status: number, operacao: OperacaoPesquisador) => {
  if (status === 400) {
    return mensagemErroPadrao[operacao];
  }

  if (status === 422) {
    return "Há dados inválidos na requisição.";
  }

  if (status === 404) {
    return "Pesquisador não encontrado.";
  }

  if (status === 409) {
    return "Já existe um pesquisador com esse ID Lattes.";
  }

  return mensagemErroPadrao[operacao];
};

const tratarRespostaComErro = async (resposta: Response, operacao: OperacaoPesquisador) => {
  if (resposta.ok) {
    return;
  }

  const erro = await resposta.json().catch(() => null);
  if (resposta.status === 422) {
    throw new Error(formatarErro422(erro?.detail));
  }

  throw new Error(erro?.detail ?? obterMensagemPorStatus(resposta.status, operacao));
};

const executarRequisicao = async (input: RequestInfo | URL, init: RequestInit, operacao: OperacaoPesquisador) => {
  try {
    const resposta = await fetch(input, init);
    await tratarRespostaComErro(resposta, operacao);
    return resposta;
  } catch (erro) {
    if (erro instanceof TypeError) {
      throw new Error("Não foi possível se comunicar com o servidor de pesquisadores.");
    }

    if (erro instanceof Error) {
      throw erro;
    }

    throw new Error("Não foi possível se comunicar com o servidor de pesquisadores.");
  }
};

const getPesquisadores = async () => {
  const resposta = await executarRequisicao(url, {
    method: "GET",
    cache: "no-store",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
  }, "listar");

  return resposta.json();
};

export interface CriarPesquisadorDTO {
  nome: string;
  lattes_id: string;
}

export type AtualizarPesquisadorDTO = CriarPesquisadorDTO;

export const criarPesquisador = async (dados: CriarPesquisadorDTO) => {
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

export const atualizarPesquisador = async (lattes_id: string, dados: AtualizarPesquisadorDTO) => {
  const resposta = await executarRequisicao(`${url}/${lattes_id}`, {
    method: "PUT",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dados),
  }, "atualizar");

  return resposta.json();
};

// ESCREVA AQUI a funcao de requisicao removerPesquisador.
// Ex.: usar executarRequisicao(`${url}/${lattes_id}`, init, "remover") e tratar 204.

export default getPesquisadores;

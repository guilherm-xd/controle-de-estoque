const formularioProduto = document.getElementById("formularioProduto");
const campoNome = document.getElementById("campoNome");
const campoCategoria = document.getElementById("campoCategoria");
const campoQuantidade = document.getElementById("campoQuantidade");
const campoPreco = document.getElementById("campoPreco");
const botaoAdicionar = document.getElementById("botaoAdicionar");

const listaProdutos = document.getElementById("listaProdutos");
const estadoVazio = document.getElementById("estadoVazio");
const painelLista = document.querySelector(".painelLista");
const botoesVisao = document.querySelectorAll(".botaoVisao");

const filtroQtdMin = document.getElementById("filtroQtdMin");
const filtroQtdMax = document.getElementById("filtroQtdMax");
const botaoFiltrar = document.getElementById("botaoFiltrar");
const botaoLimparFiltro = document.getElementById("botaoLimparFiltro");

const buscaProduto = document.getElementById("buscaProduto");

const estatisticaTotalProdutos = document.getElementById(
  "estatisticaTotalProdutos",
);
const estatisticaTotalItens = document.getElementById("estatisticaTotalItens");
const estatisticaEstoqueBaixo = document.getElementById(
  "estatisticaEstoqueBaixo",
);

const modalEditarFundo = document.getElementById("modalEditarFundo");
const formularioEditarProduto = document.getElementById(
  "formularioEditarProduto",
);
const editarId = document.getElementById("editarId");
const editarNome = document.getElementById("editarNome");
const editarCategoria = document.getElementById("editarCategoria");
const editarQuantidade = document.getElementById("editarQuantidade");
const editarPreco = document.getElementById("editarPreco");
const botaoCancelarEdicao = document.getElementById("botaoCancelarEdicao");
const botaoSalvarEdicao = document.getElementById("botaoSalvarEdicao");

const tituloPagina = document.getElementById("tituloPagina");
const botaoEditarTitulo = document.getElementById("botaoEditarTitulo");

const estatisticaValorTotal = document.getElementById("estatisticaValorTotal");
const painelGrafico = document.getElementById("painelGrafico");
const graficoCategorias = document.getElementById("graficoCategorias");
const modalTransferirFundo = document.getElementById("modalTransferirFundo");
const transferirDestino = document.getElementById("transferirDestino");
const arquivoImportar = document.getElementById("arquivoImportar");
const areaImpressao = document.getElementById("areaImpressao");

const abas = document.getElementById("abas");
const botaoExcluirEstoque = document.getElementById("botaoExcluirEstoque");
const app = document.querySelector(".app");
const redimensionador = document.getElementById("redimensionador");

const botaoEstoqueBaixo = document.getElementById("botaoEstoqueBaixo");
const cartaoEstoqueBaixo = document.getElementById("cartaoEstoqueBaixo");

const botaoDesconto = document.getElementById("botaoDesconto");
const seletorCategoriaDesconto = document.getElementById(
  "seletorCategoriaDesconto",
);
const campoAlvoCategoria = document.getElementById("campoAlvoCategoria");
const botaoDesfazerDescontos = document.getElementById(
  "botaoDesfazerDescontos",
);
const barraDesconto = document.getElementById("barraDesconto");
const campoDesconto = document.getElementById("campoDesconto");
const resumoDesconto = document.getElementById("resumoDesconto");
const botaoMarcarTodos = document.getElementById("botaoMarcarTodos");
const botaoAplicarDesconto = document.getElementById("botaoAplicarDesconto");
const botaoCancelarDesconto = document.getElementById("botaoCancelarDesconto");
const opcoesAlvoDesconto = document.querySelectorAll(
  'input[name="alvoDesconto"]',
);

const boasVindas = document.getElementById("boasVindas");
const botaoExemplo = document.getElementById("botaoExemplo");

const ESTOQUE_BAIXO = 5;

let produtos = [];
let proximoId = 1;
let idParaRemover = null;
let timerRemover;

let estoques = [{ id: 1, nome: "Estoque geral", produtos: [], proximoId: 1 }];
let estoqueAtivoId = 1;
let proximoIdEstoque = 2;
let excluindoEstoque = false;
let timerExcluir;

let ordem = { campo: null, dir: 1 };
let idTransferindo = null;
const idsMarcados = new Set();

let termoBusca = "";
let filtroAtual = { min: null, max: null };

const toast = document.createElement("div");
toast.className = "toast";
toast.setAttribute("role", "status");
toast.setAttribute("aria-live", "polite");
document.body.appendChild(toast);
let timerToast;

function registrarHistorico(texto) {
  const estoque = estoqueAtivo();
  estoque.historico = estoque.historico || [];
  estoque.historico.unshift({ texto, quando: Date.now() });
  estoque.historico.length = Math.min(estoque.historico.length, 100);
  salvarDados();
}

function mostrarToast(mensagem, guardar = true) {
  if (guardar) registrarHistorico(mensagem);
  toast.textContent = mensagem;
  toast.classList.add("visivel");
  clearTimeout(timerToast);
  timerToast = setTimeout(() => toast.classList.remove("visivel"), 2600);
}

function reduzirMovimento() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function animarNumero(elemento, alvo, formatar = (n) => Math.round(n)) {
  const de = Number(elemento.dataset.valor || 0);
  elemento.dataset.valor = alvo;
  cancelAnimationFrame(elemento.quadro);

  if (de === alvo || reduzirMovimento()) {
    elemento.textContent = formatar(alvo);
    return;
  }

  const inicio = performance.now();
  const duracao = 450;
  const passo = (agora) => {
    const t = Math.min(1, (agora - inicio) / duracao);
    const suave = 1 - Math.pow(1 - t, 3);
    elemento.textContent = formatar(t < 1 ? de + (alvo - de) * suave : alvo);
    if (t < 1) elemento.quadro = requestAnimationFrame(passo);
  };
  elemento.quadro = requestAnimationFrame(passo);
}

function formatarPreco(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function lerNumero(input) {
  return input.value === "" ? null : Number(input.value);
}

function estoqueBaixo(produto) {
  return produto.quantidade < ESTOQUE_BAIXO;
}

function estoqueAtivo() {
  return estoques.find((e) => e.id === estoqueAtivoId);
}

function salvarDados() {
  const atual = estoqueAtivo();
  atual.produtos = produtos;
  atual.proximoId = proximoId;

  localStorage.setItem(
    "estoques",
    JSON.stringify({ estoques, estoqueAtivoId, proximoIdEstoque }),
  );
}

function carregarDados() {
  try {
    const salvo = JSON.parse(localStorage.getItem("estoques"));
    if (!salvo || !Array.isArray(salvo.estoques) || salvo.estoques.length === 0)
      return;

    estoques = salvo.estoques;
    proximoIdEstoque = salvo.proximoIdEstoque;
    estoqueAtivoId = estoques.some((e) => e.id === salvo.estoqueAtivoId)
      ? salvo.estoqueAtivoId
      : estoques[0].id;
  } catch (erro) {
    localStorage.removeItem("estoques");
  }
}

function atualizarTela() {
  renderizarLista();
  atualizarIndicadores();
  renderizarGrafico();
  salvarDados();
}

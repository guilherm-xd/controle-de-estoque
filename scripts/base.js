const botaoAdicionar = document.getElementById("botaoAdicionar");

const listaProdutos = document.getElementById("listaProdutos");

const filtroQtdMin = document.getElementById("filtroQtdMin");
const filtroQtdMax = document.getElementById("filtroQtdMax");

const buscaProduto = document.getElementById("buscaProduto");
const filtroCategoria = document.getElementById("filtroCategoria");

const botaoSalvarEdicao = document.getElementById("botaoSalvarEdicao");

const app = document.querySelector(".app");

const botaoDesfazerDescontos = document.getElementById(
  "botaoDesfazerDescontos",
);
const barraDesconto = document.getElementById("barraDesconto");

const limiteEstoqueBaixo = 5;

let produtos = [];
let proximoId = 1;
let idParaRemover = null;
let timerRemover;

let estoques = [{ id: 1, nome: "Estoque geral", produtos: [], proximoId: 1 }];
let estoqueAtivoId = 1;
let proximoIdEstoque = 2;
let excluindoEstoque = false;
let timerExcluir;

let estiloGrafico = "barras";
let ordem = { campo: null, dir: 1 };
let idTransferindo = null;
const idsMarcados = new Set();

let termoBusca = "";
let categoriaFiltro = "";
let filtroAtual = { min: null, max: null };

const toast = document.createElement("div");
toast.className = "toast";
toast.setAttribute("role", "status");
toast.setAttribute("aria-live", "polite");
document.body.appendChild(toast);

let timerToast;

let ultimoEstado = null;
let pilhaDesfazer = [];
let pilhaRefazer = [];
let restaurando = false;

function formatarPreco(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function estoqueBaixo(produto) {
  return produto.quantidade < limiteEstoqueBaixo;
}

function lerNumero(input) {
  if (input.value === "") {
    return null;
  }
  return Number(input.value);
}

function mostrarToast(mensagem, guardar = true) {
  if (guardar) {
    registrarHistorico(mensagem);
  }

  toast.textContent = mensagem;
  toast.classList.add("visivel");

  clearTimeout(timerToast);

  timerToast = setTimeout(() => {
    toast.classList.remove("visivel");
  }, 2600);
}

function estoqueAtivo() {
  return estoques.find((e) => e.id === estoqueAtivoId);
}

function registrarHistorico(texto) {
  const estoque = estoqueAtivo();
  if (!estoque.historico) {
    estoque.historico = [];
  }
  estoque.historico.unshift({ texto: texto, data: Date.now() });
  if (estoque.historico.length > 100) {
    estoque.historico.pop();
  }
}

function salvarDados() {
  const estoque = estoqueAtivo();
  estoque.produtos = produtos;
  estoque.proximoId = proximoId;
  registrarEstado();
  try {
    localStorage.setItem(
      "estoques",
      JSON.stringify({
        estoques: estoques,
        estoqueAtivoId: estoqueAtivoId,
        proximoIdEstoque: proximoIdEstoque,
      }),
    );
  } catch (erro) {
    console.error("Não foi possível salvar:", erro);
  }
}

function carregarDados() {
  try {
    const textoSalvo = localStorage.getItem("estoques");

    if (textoSalvo === null) {
      return;
    }

    const dados = JSON.parse(textoSalvo);

    if (dados && Array.isArray(dados.estoques) && dados.estoques.length > 0) {
      estoques = dados.estoques;
      estoqueAtivoId = estoques.some((e) => e.id === dados.estoqueAtivoId)
        ? dados.estoqueAtivoId
        : estoques[0].id;
      proximoIdEstoque = dados.proximoIdEstoque;

      produtos = estoqueAtivo().produtos;
      proximoId = estoqueAtivo().proximoId;
    }
  } catch (erro) {
    console.error("Não foi possível carregar:", erro);
    localStorage.removeItem("estoques");
  }
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

function reduzirMovimento() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function registrarEstado() {
  const foto = JSON.stringify({ estoques, proximoIdEstoque });

  if (ultimoEstado && restaurando === false && foto !== ultimoEstado.foto) {
    pilhaDesfazer.push(ultimoEstado);

    if (pilhaDesfazer.length > 50) {
      pilhaDesfazer.shift();
    }
    pilhaRefazer = [];
  }
  ultimoEstado = { foto: foto, ativo: estoqueAtivoId };
}
function atualizarTela() {
  renderizarLista();
  atualizarIndicadores();
  renderizarGrafico();
  salvarDados();
}

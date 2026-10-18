const barraLateral = document.querySelector(".barraLateral");
const redimensionador = document.getElementById("redimensionador");

const tituloPagina = document.getElementById("tituloPagina");
const botaoEditarTitulo = document.getElementById("botaoEditarTitulo");

const abas = document.getElementById("abas");
const botaoExcluirEstoque = document.getElementById("botaoExcluirEstoque");

function salvarTitulo() {
  tituloPagina.contentEditable = "false";
  const nome = tituloPagina.textContent.trim();

  if (nome === "") {
    tituloPagina.textContent = estoqueAtivo().nome;
    return;
  }

  estoqueAtivo().nome = nome;
  renderizarAbas();
  salvarDados();
}

botaoEditarTitulo.addEventListener("click", () => {
  tituloPagina.contentEditable = "true";
  tituloPagina.focus();

  const faixa = document.createRange();
  faixa.selectNodeContents(tituloPagina);
  const selecao = window.getSelection();
  selecao.removeAllRanges();
  selecao.addRange(faixa);
});

tituloPagina.addEventListener("blur", salvarTitulo);

tituloPagina.addEventListener("keydown", evento => {
  if (evento.key === "Enter") {
    evento.preventDefault();
    tituloPagina.blur();
  }
});

function renderizarAbas() {
  abas.innerHTML = "";

  estoques.forEach(estoque => {
    const aba = document.createElement("button");
    aba.type = "button";
    aba.className = "aba" + (estoque.id === estoqueAtivoId ? " ativa" : "");
    aba.textContent = estoque.nome;
    aba.dataset.id = estoque.id;
    abas.appendChild(aba);
  });

  const nova = document.createElement("button");
  nova.type = "button";
  nova.className = "aba abaNova";
  nova.id = "botaoNovoEstoque";
  nova.textContent = "+";
  nova.title = "Novo estoque";
  nova.setAttribute("aria-label", "Novo estoque");
  abas.appendChild(nova);

  botaoExcluirEstoque.hidden = estoques.length === 1;
}

function desarmarExclusao() {
  clearTimeout(timerExcluir);
  excluindoEstoque = false;
  botaoExcluirEstoque.classList.remove("armado");
  botaoExcluirEstoque.dataset.dica = "Excluir este estoque (clique duas vezes)";
}

function carregarEstoqueAtivo() {
  const estoque = estoqueAtivo();
  produtos = estoque.produtos;
  proximoId = estoque.proximoId;

  idParaRemover = null;
  termoBusca = "";
  categoriaFiltro = "";
  filtroAtual = { min: null, max: null };
  buscaProduto.value = "";
  filtroQtdMin.value = "";
  filtroQtdMax.value = "";
  tituloPagina.textContent = estoque.nome;

  reiniciarDesconto();
  atualizarBotaoEstoqueBaixo();
  desarmarExclusao();
  renderizarAbas();
  atualizarTela();
  animarEntrada();
}

function trocarEstoque(id) {
  const atual = estoqueAtivo();
  atual.produtos = produtos;
  atual.proximoId = proximoId;

  estoqueAtivoId = id;
  carregarEstoqueAtivo();
}

function proximoNomeLivre() {
  let numero = 2;
  while (estoques.some(e => e.nome === `Estoque ${numero}`)) numero++;
  return `Estoque ${numero}`;
}

function novoEstoque() {
  const id = proximoIdEstoque++;
  const nome = proximoNomeLivre();
  estoques.push({ id, nome, produtos: [], proximoId: 1 });
  trocarEstoque(id);
  mostrarToast(`"${nome}" criado`);
}

const botaoFiltrar = document.getElementById("botaoFiltrar");
const botaoLimparFiltro = document.getElementById("botaoLimparFiltro");

const botaoEstoqueBaixo = document.getElementById("botaoEstoqueBaixo");
const cartaoEstoqueBaixo = document.getElementById("cartaoEstoqueBaixo");

const painelLista = document.querySelector(".painelLista");
const botoesVisao = document.querySelectorAll(".botaoVisao");

const alternadorGrafico = document.getElementById("alternadorGrafico");

function filtroEhEstoqueBaixo() {
  return (
    (filtroAtual.min === null || filtroAtual.min === 0) &&
    filtroAtual.max === limiteEstoqueBaixo - 1
  );
}

function atualizarBotaoEstoqueBaixo() {
  const resultadoFiltroEhEstoqueBaixo = filtroEhEstoqueBaixo();
  botaoEstoqueBaixo.setAttribute("aria-pressed", resultadoFiltroEhEstoqueBaixo);
  cartaoEstoqueBaixo.classList.toggle("ativa", resultadoFiltroEhEstoqueBaixo);
}

function aplicarFiltro() {
  filtroAtual = { min: lerNumero(filtroQtdMin), max: lerNumero(filtroQtdMax) };
  atualizarBotaoEstoqueBaixo();
  renderizarLista();
}

function alternarEstoqueBaixo() {
  if (filtroEhEstoqueBaixo()) {
    filtroQtdMin.value = "";
    filtroQtdMax.value = "";
  } else {
    filtroQtdMin.value = "";
    filtroQtdMax.value = limiteEstoqueBaixo - 1;
  }
  aplicarFiltro();
}

botaoFiltrar.addEventListener("click", aplicarFiltro);
botaoEstoqueBaixo.addEventListener("click", alternarEstoqueBaixo);
cartaoEstoqueBaixo.addEventListener("click", alternarEstoqueBaixo);
cartaoEstoqueBaixo.addEventListener("keydown", (evento) => {
  if (evento.key === "Enter" || evento.key === " ") {
    evento.preventDefault();
    alternarEstoqueBaixo();
  }
});

botaoLimparFiltro.addEventListener("click", () => {
  filtroQtdMin.value = "";
  filtroQtdMax.value = "";
  aplicarFiltro();
});

buscaProduto.addEventListener("input", () => {
  termoBusca = buscaProduto.value;
  renderizarLista();
});

filtroCategoria.addEventListener("change", (nada) => {
  categoriaFiltro = filtroCategoria.value;
  renderizarLista();
});

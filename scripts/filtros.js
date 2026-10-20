const botaoFiltrar = document.getElementById("botaoFiltrar");
const botaoLimparFiltro = document.getElementById("botaoLimparFiltro");

const botaoEstoqueBaixo = document.getElementById("botaoEstoqueBaixo");
const cartaoEstoqueBaixo = document.getElementById("cartaoEstoqueBaixo");

const painelLista = document.querySelector(".painelLista");
const botoesVisao = document.querySelectorAll(".botaoVisao");

const alternadorGrafico = document.getElementById("alternadorGrafico");

function aplicarFiltro() {
  filtroAtual = { min: lerNumero(filtroQtdMin), max: lerNumero(filtroQtdMax) };
  renderizarLista();
}

function alternarEstoqueBaixo() {
  if (filtroEhEstoqueBaixo()) {
    filtroQtdMin.value = '';
    filtroQtdMax.value = '';
  } else {
    filtroQtdMin.value = '';
    filtroQtdMax.value = estoqueBaixo - 1;
  }
  aplicarFiltro();
}

botaoFiltrar.addEventListener('click', aplicarFiltro);
botaoEstoqueBaixo.addEventListener('click', alternarEstoqueBaixo);
cartaoEstoqueBaixo.addEventListener('click', alternarEstoqueBaixo);
cartaoEstoqueBaixo.addEventListener('keydown', evento => {
  if (evento.key === 'Enter' || evento.key === ' ') {
    evento.preventDefault();
    alternarEstoqueBaixo();
  }
});

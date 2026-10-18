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

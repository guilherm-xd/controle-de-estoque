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

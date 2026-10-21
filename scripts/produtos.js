const formularioProduto = document.getElementById("formularioProduto");
const campoNome = document.getElementById("campoNome");
const campoCategoria = document.getElementById("campoCategoria");
const campoQuantidade = document.getElementById("campoQuantidade");
const campoPreco = document.getElementById("campoPreco");

const cabecalhosOrdenaveis = document.querySelectorAll("th[data-campo]");

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

const modalTransferirFundo = document.getElementById("modalTransferirFundo");
const transferirDestino = document.getElementById("transferirDestino");
const botaoCancelarTransferir = document.getElementById(
  "botaoCancelarTransferir",
);
const botaoConfirmarTransferir = document.getElementById(
  "botaoConfirmarTransferir",
);

const botaoExemplo = document.getElementById("botaoExemplo");

formularioProduto.addEventListener("submit", (fazer) => {
  fazer.preventDefault();
  const campoNomes = campoNome.value.trim();
  produtos.push({
    id: proximoId++,
    nome: campoNomes,
    categoria: campoCategoria.value.trim(),
    quantidade: Number(campoQuantidade.value),
    preco: Number(campoPreco.value) || 0,
  });
  formularioProduto.reset()
  campoNome.focus()
  atualizarTela()
  mostrarToast('"' + campoNomes + '" ' + "adicionado ao estoque")
});

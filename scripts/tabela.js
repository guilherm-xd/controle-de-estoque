const estadoVazio = document.getElementById("estadoVazio");
const boasVindas = document.getElementById("boasVindas");

const estatisticaTotalProdutos = document.getElementById(
  "estatisticaTotalProdutos",
);
const estatisticaTotalItens = document.getElementById("estatisticaTotalItens");
const estatisticaEstoqueBaixo = document.getElementById(
  "estatisticaEstoqueBaixo",
);
const estatisticaValorTotal = document.getElementById("estatisticaValorTotal");

const painelGrafico = document.getElementById("painelGrafico");
const graficoCategorias = document.getElementById("graficoCategorias");
const botoesEstiloGrafico = document.querySelectorAll(".botaoEstiloGrafico");

function criarCelula(texto) {
  const criarTD = document.createElement("td");
  criarTD.textContent = texto;
  return criarTD;
}

function criarLinha(produto) {
  const criarTR = document.createElement("tr");
  criarTR.appendChild(criarCelula(produto.nome));
  criarTR.appendChild(criarCelula(produto.categoria));
  criarTR.appendChild(criarCelula(produto.quantidade));
  criarTR.appendChild(criarCelula(formatarPreco(produto.preco)));
  return criarTR;
}

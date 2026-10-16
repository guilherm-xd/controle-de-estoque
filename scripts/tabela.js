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
  criarTR.appendChild(criarCelula(produto.categoria || "-"));
  criarTR.appendChild(criarCelula(produto.quantidade));
  criarTR.appendChild(criarCelula(formatarPreco(produto.preco)));
  const tdStatus = document.createElement("td");
  const selo = document.createElement("span");
  if (produto.quantidade === 0) {
    selo.className = "selo seloZero";
    selo.textContent = "Sem estoque";
  } else if (estoqueBaixo(produto)) {
    selo.className = "selo seloBaixo";
    selo.textContent = "Estoque baixo";
  } else {
    selo.className = "selo seloOk";
    selo.textContent = "Em estoque";
  }
  tdStatus.appendChild(selo);
  criarTR.appendChild(tdStatus);
  criarTR.appendChild(
    criarCelula(formatarPreco(produto.preco * produto.quantidade)),
  );
  return criarTR;
}

function renderizarLista() {
  listaProdutos.innerHTML = "";
  produtos.forEach((produto) => {
    listaProdutos.appendChild(criarLinha(produto));
  });
}

function atualizarIndicadores() {
  animarNumero(estatisticaTotalProdutos, produtos.length);
  animarNumero(
    estatisticaTotalItens,
    produtos.reduce((total, produto) => total + produto.quantidade, 0),
  );
  animarNumero(estatisticaEstoqueBaixo, produtos.filter(estoqueBaixo).length);
  animarNumero(
    estatisticaValorTotal,
    produtos.reduce(
      (total, produto) => total + produto.quantidade * produto.preco,
      0,
    ),
    formatarPreco,
  );
}

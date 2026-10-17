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

const iconeLapis =
  '<svg viewBox="0 0 20 20" width="15" height="15" fill="none" aria-hidden="true"><path d="M13.3 2.7l4 4L6.4 17.6H2.4v-4L13.3 2.7z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"/></svg>';

const iconeDelete =
  '<svg viewBox="0 0 20 20" width="15" height="15" fill="none" aria-hidden="true"><path d="M3 5h14M8 5V3h4v2M5 5l1 12h8l1-12M8.5 8.5v5M11.5 8.5v5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

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
  const tdAcoes = document.createElement("td");
  tdAcoes.appendChild(criarBotaoEditar(produto.id));
  tdAcoes.appendChild(criarBotaoDeletar(produto.id))
  criarTR.appendChild(tdAcoes)
  return criarTR;
}

function renderizarLista() {
  listaProdutos.innerHTML = "";
  produtos.forEach((produto) => {
    listaProdutos.appendChild(criarLinha(produto));
  });
  boasVindas.hidden = produtos.length > 0;
  estadoVazio.hidden =
    listaProdutos.children.length > 0 || produtos.length === 0;
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

function criarBotaoEditar(id) {
  const botaoLapis = document.createElement("button");
  botaoLapis.className = "botaoIcone botaoEditar";
  botaoLapis.innerHTML = iconeLapis;
  botaoLapis.dataset.dica = "Editar";
  botaoLapis.setAttribute("aria-label", "Editar");
  botaoLapis.dataset.acao = "editar";
  botaoLapis.dataset.id = id;
  return botaoLapis;
}

function criarBotaoDeletar(id) {
  const botaoDeletar = document.createElement("button");
  botaoDeletar.className = "botaoIcone botaoRemover";
  botaoDeletar.innerHTML = iconeDelete;
  botaoDeletar.dataset.dica = "Remover";
  botaoDeletar.setAttribute("aria-label", "Remover");
  botaoDeletar.dataset.acao = "remover";
  botaoDeletar.dataset.id = id;
  return botaoDeletar;
}

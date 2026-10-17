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

const categoriaImpossivel = "Tung Tung do Mal";

const iconeLapis =
  '<svg viewBox="0 0 20 20" width="15" height="15" fill="none" aria-hidden="true"><path d="M13.3 2.7l4 4L6.4 17.6H2.4v-4L13.3 2.7z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"/></svg>';

const iconeDelete =
  '<svg viewBox="0 0 20 20" width="15" height="15" fill="none" aria-hidden="true"><path d="M3 5h14M8 5V3h4v2M5 5l1 12h8l1-12M8.5 8.5v5M11.5 8.5v5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

const iconeTrasferir =
  '<svg viewBox="0 0 20 20" width="15" height="15" fill="none" aria-hidden="true"><path d="M3 7h13M12.5 3.5L16 7l-3.5 3.5M17 13H4M7.5 9.5L4 13l3.5 3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

const iconeDesfazer =
  '<svg viewBox="0 0 20 20" width="15" height="15" fill="none" aria-hidden="true"><path d="M5 8h7a3.5 3.5 0 010 7H8M5 8l3-3M5 8l3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

function criarCelula(texto) {
  const criarTD = document.createElement("td");
  criarTD.textContent = texto;
  return criarTD;
}

function formatarPercentual(valor) {
  return String(valor).replace(".", ",");
}

function criarCelulaPreco(produto) {
  const criarDesconto = document.createElement("td");
  if (!produto.desconto) {
    criarDesconto.textContent = formatarPreco(produto.preco);
    return criarDesconto;
  }
  const riscado = document.createElement("s");
  const span1 = document.createElement("span");
  const span2 = document.createElement("span");

  riscado.className = "precoAntigo";
  span1.className = "precoNovo";
  span2.className = "etiquetaDesconto";

  riscado.textContent = formatarPreco(produto.precoOriginal);
  span1.textContent = formatarPreco(produto.preco);
  span2.textContent = "-" + formatarPercentual(produto.desconto) + "%";

  criarDesconto.appendChild(riscado);
  criarDesconto.appendChild(span1);
  criarDesconto.appendChild(span2);

  return criarDesconto;
}

function criarCelulaQuantidade(produto) {
  const celula = document.createElement("td");
  const botaoMenos = document.createElement("button");
  const botaoMais = document.createElement("button");
  const valor = document.createElement("span");

  botaoMenos.className = "botaoQuantidade";
  botaoMenos.textContent = "−";
  botaoMenos.dataset.acao = "menos";
  botaoMenos.dataset.id = produto.id;
  botaoMenos.disabled = produto.quantidade === 0;
  botaoMenos.setAttribute("aria-label", "Diminuir quantidade");

  botaoMais.className = "botaoQuantidade";
  botaoMais.textContent = "+";
  botaoMais.dataset.acao = "mais";
  botaoMais.dataset.id = produto.id;
  botaoMais.setAttribute("aria-label", "Aumentar quantidade");

  valor.className = "valorQuantidade";
  valor.textContent = produto.quantidade;

  celula.appendChild(botaoMenos);
  celula.appendChild(valor);
  celula.appendChild(botaoMais);
  return celula;
}

function criarLinha(produto) {
  const criarTR = document.createElement("tr");
  criarTR.appendChild(criarCelula(produto.nome));
  criarTR.appendChild(criarCelula(produto.categoria || "-"));
  criarTR.appendChild(criarCelulaQuantidade(produto));
  criarTR.appendChild(criarCelulaPreco(produto));
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
  if (produto.desconto) {
    tdAcoes.appendChild(criarBotaoTirarDesconto(produto.id));
  }
  if (estoques.length > 1) {
    tdAcoes.appendChild(criarBotaoTransferir(produto.id));
  }
  tdAcoes.appendChild(criarBotaoDeletar(produto.id));
  criarTR.appendChild(tdAcoes);
  return criarTR;
}

function preencherFiltroCategoria() {
  let arrayNada = [];
  produtos.forEach((produto) => {
    const categoriaProduto = produto.categoria || categoriaImpossivel;
    if (!arrayNada.includes(categoriaProduto)) {
      arrayNada.push(categoriaProduto);
    }
  });
  if (categoriaFiltro && !arrayNada.includes(categoriaFiltro)) {
    categoriaFiltro = "";
  }
  filtroCategoria.innerHTML = "";
  filtroCategoria.appendChild(new Option("Todas as categorias", ""));
  arrayNada.forEach((categoria) => {
    filtroCategoria.appendChild(
      new Option(
        categoria === categoriaImpossivel ? "Sem categoria" : categoria,
        categoria,
      ),
    );
  });
  filtroCategoria.value = categoriaFiltro;
}

function valorDoCampo(produto, campo) {
  if (campo === "total") {
    return produto.quantidade * produto.preco;
  } else {
    return produto[campo];
  }
}

function filtrarProdutos() {
  const textoBusca = termoBusca.trim().toLowerCase();
  let resultadoProduto = produtos.filter((produto) => {
    return (
      produto.nome.toLowerCase().includes(textoBusca) ||
      (produto.categoria || "").toLowerCase().includes(textoBusca)
    );
  });
  resultadoProduto = resultadoProduto.filter((produto) => {
    return (
      !categoriaFiltro ||
      (produto.categoria || categoriaImpossivel) === categoriaFiltro
    );
  });
  resultadoProduto = resultadoProduto.filter((produto) => {
    return filtroAtual.min === null || produto.quantidade >= filtroAtual.min;
  });

  resultadoProduto = resultadoProduto.filter((produto) => {
    return filtroAtual.max === null || produto.quantidade <= filtroAtual.max;
  });
  if (!ordem.campo) {
    return resultadoProduto;
  }
  return resultadoProduto.sort((pro1, pro2) => {
    const valor1 = valorDoCampo(pro1, ordem.campo);
    const valor2 = valorDoCampo(pro2, ordem.campo);
    if (typeof valor1 === "string") {
      return valor1.localeCompare(valor2, "pt-BR") * ordem.dir;
    } else {
      return (valor1 - valor2) * ordem.dir;
    }
  });
}

function renderizarLista() {
  preencherFiltroCategoria();
  const resultadoFiltro = filtrarProdutos();
  listaProdutos.innerHTML = "";
  resultadoFiltro.forEach((produto) => {
    listaProdutos.appendChild(criarLinha(produto));
  });
  boasVindas.hidden = produtos.length > 0;
  estadoVazio.hidden =
    listaProdutos.children.length > 0 || produtos.length === 0;
}

function atualizarIndicadores() {
  estatisticaTotalProdutos.textContent = produtos.length;
  estatisticaTotalItens.textContent = produtos.reduce(
    (total, produto) => total + produto.quantidade,
    0,
  );
  estatisticaEstoqueBaixo.textContent = produtos.filter(estoqueBaixo).length;
  estatisticaValorTotal.textContent = formatarPreco(
    produtos.reduce(
      (total, produto) => total + produto.quantidade * produto.preco,
      0,
    ),
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

function criarBotaoTransferir(id) {
  const botaoTransferir = document.createElement("button");
  botaoTransferir.className = "botaoIcone";
  botaoTransferir.innerHTML = iconeTransferir;
  botaoTransferir.dataset.dica = "Mover para outro estoque";
  botaoTransferir.setAttribute("aria-label", "Mover para outro estoque");
  botaoTransferir.dataset.acao = "transferir";
  botaoTransferir.dataset.id = id;
  return botaoTransferir;
}

function criarBotaoTirarDesconto(id) {
  const botaoDesfazer = document.createElement("button");
  botaoDesfazer.className = "botaoIcone";
  botaoDesfazer.innerHTML = iconeDesfazer;
  botaoDesfazer.dataset.dica = "Remover desconto";
  botaoDesfazer.setAttribute("aria-label", "Remover desconto");
  botaoDesfazer.dataset.acao = "tirarDesconto";
  botaoDesfazer.dataset.id = id;
  return botaoDesfazer;
}

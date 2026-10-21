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
  const tdNome = criarCelula(produto.nome);
  if (modoSelecao()) {
    tdNome.prepend(criarCaixaMarcar(produto.id));
  }
  criarTR.appendChild(tdNome);
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
  if (!barraDesconto.hidden) {
    atualizarBarraDesconto();
  }
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
  botaoDesfazerDescontos.hidden = !produtos.some((p) => p.desconto);
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
  const armado = id === idParaRemover;
  botaoDeletar.className = "botaoIcone botaoRemover" + (armado ? " armado" : "");
  botaoDeletar.innerHTML = iconeDelete;
  botaoDeletar.dataset.dica = armado ? "Tem certeza? Clique de novo" : "Remover";
  botaoDeletar.setAttribute("aria-label", botaoDeletar.dataset.dica);
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

const coresGrafico = [
  "var(--corPrimaria)",
  "#e8a33d",
  "#d9534f",
  "#2fb37a",
  "#9b59b6",
  "#17a2b8",
  "#e67e22",
  "#ec6fa8",
  "#8d6e63",
  "#7f8c8d",
];

const svgNs = "http://www.w3.org/2000/svg";

function corDaFatia(indice) {
  return coresGrafico[indice % coresGrafico.length];
}

function desenharBarras(entradas, maior) {
  entradas.forEach(([categoria, quantidade]) => {
    const linha = document.createElement("div");
    const nome = document.createElement("span");
    const trilho = document.createElement("div");
    const barra = document.createElement("div");
    const valor = document.createElement("span");

    linha.className = "linhaBarra";
    nome.className = "nomeBarra";
    nome.textContent = categoria;
    trilho.className = "trilhoBarra";
    barra.className = "barra";
    barra.style.width = (quantidade / maior) * 100 + "%";
    valor.className = "valorBarra";
    valor.textContent = quantidade;

    trilho.appendChild(barra);
    linha.appendChild(nome);
    linha.appendChild(trilho);
    linha.appendChild(valor);
    graficoCategorias.appendChild(linha);
  });
}

function desenharColunas(entradas, maior) {
  const area = document.createElement("div");
  area.className = "colunasGrafico";

  entradas.forEach(([categoria, quantidade]) => {
    const coluna = document.createElement("div");
    const valor = document.createElement("span");
    const barra = document.createElement("div");
    const nome = document.createElement("span");

    coluna.className = "colunaGrafico";
    valor.className = "valorColuna";
    valor.textContent = quantidade;
    barra.className = "barraColuna";
    barra.style.height =
      Math.max(4, Math.round((quantidade / maior) * 150)) + "px";
    nome.className = "nomeColuna";
    nome.textContent = categoria;
    nome.title = categoria;

    coluna.appendChild(valor);
    coluna.appendChild(barra);
    coluna.appendChild(nome);
    area.appendChild(coluna);
  });
  graficoCategorias.appendChild(area);
}

function desenharPizza(entradas, rosca) {
  const fatias = entradas.filter((entrada) => entrada[1] > 0);
  const total = fatias.reduce((soma, entrada) => soma + entrada[1], 0);

  if (total === 0) {
    graficoCategorias.textContent = "Nenhum item em estoque para exibir.";
    return;
  }

  let raio;
  let espessura;
  if (rosca) {
    raio = 38;
    espessura = 22;
  } else {
    raio = 25;
    espessura = 50;
  }
  const volta = 2 * Math.PI * raio;
  const svg = document.createElementNS(svgNs, "svg");
  const legenda = document.createElement("ul");
  const envolucro = document.createElement("div");
  let acumulado = 0;

  svg.setAttribute("viewBox", "0 0 100 100");
  svg.setAttribute("class", "svgPizza");
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", "Itens por categoria");
  legenda.className = "legendaGrafico";
  envolucro.className = "pizzaGrafico";

  fatias.forEach(([categoria, quantidade], indice) => {
    const comprimento = (quantidade / total) * volta;
    const percentual = String(
      Math.round((quantidade / total) * 1000) / 10,
    ).replace(".", ",");
    const circulo = document.createElementNS(svgNs, "circle");
    const dica = document.createElementNS(svgNs, "title");
    const item = document.createElement("li");
    const ponto = document.createElement("span");
    const nome = document.createElement("span");
    const valor = document.createElement("span");

    circulo.setAttribute("cx", 50);
    circulo.setAttribute("cy", 50);
    circulo.setAttribute("r", raio);
    circulo.setAttribute("fill", "none");
    circulo.setAttribute("transform", "rotate(-90 50 50)");
    circulo.style.stroke = corDaFatia(indice);
    circulo.style.strokeWidth = espessura;
    circulo.style.strokeDasharray = comprimento + " " + (volta - comprimento);
    circulo.style.strokeDashoffset = -acumulado;
    dica.textContent = categoria + ": " + quantidade + " (" + percentual + "%)";
    circulo.appendChild(dica);
    svg.appendChild(circulo);
    acumulado += comprimento;

    ponto.className = "pontoLegenda";
    ponto.style.background = corDaFatia(indice);
    nome.className = "nomeLegenda";
    nome.textContent = categoria;
    valor.className = "valorLegenda";
    valor.textContent = quantidade + " (" + percentual + "%)";
    item.appendChild(ponto);
    item.appendChild(nome);
    item.appendChild(valor);
    legenda.appendChild(item);
  });

  if (rosca) {
    const texto = document.createElementNS(svgNs, "text");
    texto.setAttribute("x", 50);
    texto.setAttribute("y", 50);
    texto.setAttribute("text-anchor", "middle");
    texto.setAttribute("dominant-baseline", "central");
    texto.setAttribute("class", "textoRosca");
    texto.textContent = total;
    svg.appendChild(texto);
  }

  envolucro.appendChild(svg);
  envolucro.appendChild(legenda);
  graficoCategorias.appendChild(envolucro);
}

function renderizarGrafico() {
  const totais = produtos.reduce((acc, produto) => {
    const categoria = produto.categoria || "Sem categoria";
    acc[categoria] = (acc[categoria] || 0) + produto.quantidade;
    return acc;
  }, {});
  const entradas = Object.entries(totais).sort((a, b) => b[1] - a[1]);
  const maior = Math.max(1, ...entradas.map((entrada) => entrada[1]));

  painelGrafico.hidden = entradas.length === 0;
  graficoCategorias.innerHTML = "";
  botoesEstiloGrafico.forEach((botao) => {
    botao.setAttribute("aria-pressed", botao.dataset.grafico === estiloGrafico);
  });

  if (estiloGrafico === "colunas") {
    desenharColunas(entradas, maior);
  } else if (estiloGrafico === "pizza") {
    desenharPizza(entradas, false);
  } else if (estiloGrafico === "rosca") {
    desenharPizza(entradas, true);
  } else {
    desenharBarras(entradas, maior);
  }
}

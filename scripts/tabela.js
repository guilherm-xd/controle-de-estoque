function valorDoCampo(produto, campo) {
  return campo === 'total' ? produto.quantidade * produto.preco : produto[campo];
}

function filtrarProdutos() {
  const termo = termoBusca.trim().toLowerCase();

  const lista = produtos
    .filter(p => p.nome.toLowerCase().includes(termo))
    .filter(p => filtroAtual.min === null || p.quantidade >= filtroAtual.min)
    .filter(p => filtroAtual.max === null || p.quantidade <= filtroAtual.max);

  if (!ordem.campo) return lista;

  return lista.sort((a, b) => {
    const x = valorDoCampo(a, ordem.campo);
    const y = valorDoCampo(b, ordem.campo);
    const resultado = typeof x === 'string' ? x.localeCompare(y, 'pt-BR') : x - y;
    return resultado * ordem.dir;
  });
}

function criarCelula(texto) {
  const td = document.createElement('td');
  td.textContent = texto;
  return td;
}

const ICONE_LIXEIRA = '<svg viewBox="0 0 20 20" width="15" height="15" fill="none" aria-hidden="true"><path d="M3 5h14M8 5V3h4v2M5 5l1 12h8l1-12M8.5 8.5v5M11.5 8.5v5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

const ICONE_LAPIS = '<svg viewBox="0 0 20 20" width="15" height="15" fill="none" aria-hidden="true"><path d="M13.3 2.7l4 4L6.4 17.6H2.4v-4L13.3 2.7z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"/></svg>';

function criarBotaoEditar(id) {
  const botao = document.createElement('button');
  botao.className = 'botaoIcone botaoEditar';
  botao.innerHTML = ICONE_LAPIS;
  botao.dataset.dica = 'Editar';
  botao.setAttribute('aria-label', 'Editar');
  botao.dataset.acao = 'editar';
  botao.dataset.id = id;
  return botao;
}

function criarBotaoRemover(id) {
  const botao = document.createElement('button');
  botao.className = 'botaoIcone botaoRemover' + (id === idParaRemover ? ' armado' : '');
  botao.innerHTML = ICONE_LIXEIRA;
  botao.dataset.dica = id === idParaRemover ? 'Tem certeza? Clique de novo' : 'Remover';
  botao.setAttribute('aria-label', botao.dataset.dica);
  botao.dataset.acao = 'remover';
  botao.dataset.id = id;
  return botao;
}

const ICONE_TRANSFERIR = '<svg viewBox="0 0 20 20" width="15" height="15" fill="none" aria-hidden="true"><path d="M3 7h13M12.5 3.5L16 7l-3.5 3.5M17 13H4M7.5 9.5L4 13l3.5 3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

function criarBotaoTransferir(id) {
  const botao = document.createElement('button');
  botao.className = 'botaoIcone';
  botao.innerHTML = ICONE_TRANSFERIR;
  botao.dataset.dica = 'Mover para outro estoque';
  botao.setAttribute('aria-label', 'Mover para outro estoque');
  botao.dataset.acao = 'transferir';
  botao.dataset.id = id;
  return botao;
}

const ICONE_DESFAZER = '<svg viewBox="0 0 20 20" width="15" height="15" fill="none" aria-hidden="true"><path d="M5 8h7a3.5 3.5 0 010 7H8M5 8l3-3M5 8l3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

function criarBotaoTirarDesconto(id) {
  const botao = document.createElement('button');
  botao.className = 'botaoIcone';
  botao.innerHTML = ICONE_DESFAZER;
  botao.dataset.dica = 'Remover desconto';
  botao.setAttribute('aria-label', 'Remover desconto');
  botao.dataset.acao = 'tirarDesconto';
  botao.dataset.id = id;
  return botao;
}

function formatarPercentual(valor) {
  return String(valor).replace('.', ',');
}

function criarCelulaPreco(produto) {
  const td = document.createElement('td');

  if (!produto.desconto) {
    td.textContent = formatarPreco(produto.preco);
    return td;
  }

  const antigo = document.createElement('s');
  const novo = document.createElement('span');
  const etiqueta = document.createElement('span');

  antigo.className = 'precoAntigo';
  antigo.textContent = formatarPreco(produto.precoOriginal);
  novo.className = 'precoNovo';
  novo.textContent = formatarPreco(produto.preco);
  etiqueta.className = 'etiquetaDesconto';
  etiqueta.textContent = `-${formatarPercentual(produto.desconto)}%`;

  td.append(antigo, novo, etiqueta);
  return td;
}

function criarCelulaQuantidade(produto) {
  const td = document.createElement('td');
  const menos = document.createElement('button');
  const mais = document.createElement('button');
  const valor = document.createElement('span');

  menos.className = 'botaoQuantidade';
  menos.textContent = '−';
  menos.dataset.acao = 'menos';
  menos.dataset.id = produto.id;
  menos.disabled = produto.quantidade === 0;
  menos.setAttribute('aria-label', 'Diminuir quantidade');

  mais.className = 'botaoQuantidade';
  mais.textContent = '+';
  mais.dataset.acao = 'mais';
  mais.dataset.id = produto.id;
  mais.setAttribute('aria-label', 'Aumentar quantidade');

  valor.className = 'valorQuantidade';
  valor.textContent = produto.quantidade;

  td.append(menos, valor, mais);
  return td;
}

function criarLinha(produto) {
  const tr = document.createElement('tr');
  tr.dataset.id = produto.id;

  const tdNome = criarCelula(produto.nome);
  if (modoSelecao()) tdNome.prepend(criarCaixaMarcar(produto.id));
  tr.appendChild(tdNome);
  tr.appendChild(criarCelula(produto.categoria || '-'));
  tr.appendChild(criarCelulaQuantidade(produto));
  tr.appendChild(criarCelulaPreco(produto));

  const tdStatus = document.createElement('td');
  const selo = document.createElement('span');
  if (produto.quantidade === 0) {
    selo.className = 'selo seloZero';
    selo.textContent = 'Sem estoque';
  } else if (estoqueBaixo(produto)) {
    selo.className = 'selo seloBaixo';
    selo.textContent = 'Estoque baixo';
  } else {
    selo.className = 'selo seloOk';
    selo.textContent = 'Em estoque';
  }
  tdStatus.appendChild(selo);
  tr.appendChild(tdStatus);

  const tdTotal = criarCelula(formatarPreco(produto.quantidade * produto.preco));
  tdTotal.className = 'celulaTotal';
  tr.appendChild(tdTotal);

  const tdAcoes = document.createElement('td');
  tdAcoes.appendChild(criarBotaoEditar(produto.id));
  if (produto.desconto) tdAcoes.appendChild(criarBotaoTirarDesconto(produto.id));
  if (estoques.length > 1) tdAcoes.appendChild(criarBotaoTransferir(produto.id));
  tdAcoes.appendChild(criarBotaoRemover(produto.id));
  tr.appendChild(tdAcoes);

  return tr;
}

function renderizarLista() {
  const visiveis = filtrarProdutos();

  listaProdutos.innerHTML = '';
  visiveis.forEach(produto => listaProdutos.appendChild(criarLinha(produto)));

  if (!barraDesconto.hidden) atualizarBarraDesconto();

  boasVindas.hidden = produtos.length > 0;
  estadoVazio.hidden = visiveis.length > 0 || produtos.length === 0;
}

function animarEntrada() {
  listaProdutos.classList.remove('entrada');
  [...listaProdutos.children].forEach((tr, i) => {
    tr.style.animationDelay = Math.min(i, 12) * 30 + 'ms';
  });
  void listaProdutos.offsetWidth;
  listaProdutos.classList.add('entrada');
  setTimeout(() => listaProdutos.classList.remove('entrada'), 900);
}

function atualizarIndicadores() {
  animarNumero(estatisticaTotalProdutos, produtos.length);
  animarNumero(estatisticaTotalItens, produtos.reduce((soma, p) => soma + p.quantidade, 0));
  animarNumero(estatisticaEstoqueBaixo, produtos.filter(estoqueBaixo).length);
  animarNumero(estatisticaValorTotal, produtos.reduce((soma, p) => soma + p.quantidade * p.preco, 0), formatarPreco);
  botaoDesfazerDescontos.hidden = !produtos.some(p => p.desconto);
}

const CORES_GRAFICO = ['var(--corPrimaria)', '#e8a33d', '#d9534f', '#2fb37a', '#9b59b6', '#17a2b8', '#e67e22', '#ec6fa8', '#8d6e63', '#7f8c8d'];
const SVG_NS = 'http://www.w3.org/2000/svg';

function corDaFatia(indice) {
  return CORES_GRAFICO[indice % CORES_GRAFICO.length];
}

function desenharBarras(entradas, maior) {
  entradas.forEach(([categoria, quantidade]) => {
    const linha = document.createElement('div');
    const nome = document.createElement('span');
    const trilho = document.createElement('div');
    const barra = document.createElement('div');
    const valor = document.createElement('span');

    linha.className = 'linhaBarra';
    nome.className = 'nomeBarra';
    nome.textContent = categoria;
    trilho.className = 'trilhoBarra';
    barra.className = 'barra';
    barra.style.width = (quantidade / maior) * 100 + '%';
    valor.className = 'valorBarra';
    valor.textContent = quantidade;

    trilho.appendChild(barra);
    linha.append(nome, trilho, valor);
    graficoCategorias.appendChild(linha);
  });
}

function desenharColunas(entradas, maior) {
  const area = document.createElement('div');
  area.className = 'colunasGrafico';

  entradas.forEach(([categoria, quantidade]) => {
    const coluna = document.createElement('div');
    const valor = document.createElement('span');
    const barra = document.createElement('div');
    const nome = document.createElement('span');

    coluna.className = 'colunaGrafico';
    valor.className = 'valorColuna';
    valor.textContent = quantidade;
    barra.className = 'barraColuna';
    barra.style.height = Math.max(4, Math.round((quantidade / maior) * 150)) + 'px';
    nome.className = 'nomeColuna';
    nome.textContent = categoria;
    nome.title = categoria;

    coluna.append(valor, barra, nome);
    area.appendChild(coluna);
  });
  graficoCategorias.appendChild(area);
}

function desenharPizza(entradas, rosca) {
  const fatias = entradas.filter(e => e[1] > 0);
  const total = fatias.reduce((soma, e) => soma + e[1], 0);

  if (total === 0) {
    graficoCategorias.textContent = 'Nenhum item em estoque para exibir.';
    return;
  }

  const raio = rosca ? 38 : 25;
  const espessura = rosca ? 22 : 50;
  const circunferencia = 2 * Math.PI * raio;
  const svg = document.createElementNS(SVG_NS, 'svg');
  const legenda = document.createElement('ul');
  const envolucro = document.createElement('div');
  let acumulado = 0;

  svg.setAttribute('viewBox', '0 0 100 100');
  svg.setAttribute('class', 'svgPizza');
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', 'Itens por categoria');
  legenda.className = 'legendaGrafico';
  envolucro.className = 'pizzaGrafico';

  fatias.forEach(([categoria, quantidade], i) => {
    const comprimento = (quantidade / total) * circunferencia;
    const percentual = String(Math.round((quantidade / total) * 1000) / 10).replace('.', ',');
    const circulo = document.createElementNS(SVG_NS, 'circle');
    const dica = document.createElementNS(SVG_NS, 'title');
    const item = document.createElement('li');
    const ponto = document.createElement('span');
    const nome = document.createElement('span');
    const valor = document.createElement('span');

    circulo.setAttribute('cx', 50);
    circulo.setAttribute('cy', 50);
    circulo.setAttribute('r', raio);
    circulo.setAttribute('fill', 'none');
    circulo.setAttribute('transform', 'rotate(-90 50 50)');
    circulo.style.stroke = corDaFatia(i);
    circulo.style.strokeWidth = espessura;
    circulo.style.strokeDasharray = `${comprimento} ${circunferencia - comprimento}`;
    circulo.style.strokeDashoffset = -acumulado;
    dica.textContent = `${categoria}: ${quantidade} (${percentual}%)`;
    circulo.appendChild(dica);
    svg.appendChild(circulo);
    acumulado += comprimento;

    ponto.className = 'pontoLegenda';
    ponto.style.background = corDaFatia(i);
    nome.className = 'nomeLegenda';
    nome.textContent = categoria;
    valor.className = 'valorLegenda';
    valor.textContent = `${quantidade} (${percentual}%)`;
    item.append(ponto, nome, valor);
    legenda.appendChild(item);
  });

  if (rosca) {
    const texto = document.createElementNS(SVG_NS, 'text');
    texto.setAttribute('x', 50);
    texto.setAttribute('y', 50);
    texto.setAttribute('text-anchor', 'middle');
    texto.setAttribute('dominant-baseline', 'central');
    texto.setAttribute('class', 'textoRosca');
    texto.textContent = total;
    svg.appendChild(texto);
  }

  envolucro.append(svg, legenda);
  graficoCategorias.appendChild(envolucro);
}

function renderizarGrafico() {
  const totais = produtos.reduce((acc, p) => {
    const categoria = p.categoria || 'Sem categoria';
    acc[categoria] = (acc[categoria] || 0) + p.quantidade;
    return acc;
  }, {});
  const entradas = Object.entries(totais).sort((a, b) => b[1] - a[1]);
  const maior = Math.max(1, ...entradas.map(e => e[1]));

  painelGrafico.hidden = entradas.length === 0;
  graficoCategorias.innerHTML = '';
  document.querySelectorAll('.botaoEstiloGrafico').forEach(botao => {
    botao.setAttribute('aria-pressed', botao.dataset.grafico === estiloGrafico);
  });

  if (estiloGrafico === 'colunas') desenharColunas(entradas, maior);
  else if (estiloGrafico === 'pizza') desenharPizza(entradas, false);
  else if (estiloGrafico === 'rosca') desenharPizza(entradas, true);
  else desenharBarras(entradas, maior);
}

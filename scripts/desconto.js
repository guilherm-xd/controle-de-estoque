function alvoDesconto() {
  return document.querySelector('input[name="alvoDesconto"]:checked').value;
}

function modoSelecao() {
  return !barraDesconto.hidden && alvoDesconto() === 'selecionados';
}

function criarCaixaMarcar(id) {
  const caixa = document.createElement('input');
  caixa.type = 'checkbox';
  caixa.className = 'caixaMarcar';
  caixa.dataset.id = id;
  caixa.checked = idsMarcados.has(id);
  caixa.setAttribute('aria-label', 'Selecionar para o desconto');
  return caixa;
}

function entraNoDesconto(produto) {
  const alvo = alvoDesconto();
  if (alvo === 'selecionados') return idsMarcados.has(produto.id);
  if (alvo === 'categoria') return produto.categoria === seletorCategoriaDesconto.value;
  return true;
}

function preencherCategoriasDesconto() {
  const anterior = seletorCategoriaDesconto.value;
  const categorias = [...new Set(produtos.map(p => p.categoria))]
    .sort((a, b) => a.localeCompare(b, 'pt-BR'));

  seletorCategoriaDesconto.innerHTML = '';
  categorias.forEach(c => seletorCategoriaDesconto.appendChild(new Option(c || 'Sem categoria', c)));

  if (categorias.includes(anterior)) seletorCategoriaDesconto.value = anterior;
}

function atualizarBarraDesconto() {
  const alvo = alvoDesconto();
  const especificos = alvo === 'selecionados';
  const quantos = produtos.filter(entraNoDesconto).length;

  preencherCategoriasDesconto();
  campoAlvoCategoria.hidden = alvo !== 'categoria';
  botaoMarcarTodos.hidden = !especificos;
  const visiveis = filtrarProdutos();
  const todosMarcados = visiveis.length > 0 && visiveis.every(p => idsMarcados.has(p.id));
  botaoMarcarTodos.textContent = todosMarcados ? 'Desmarcar todos' : 'Marcar todos';
  resumoDesconto.textContent = quantos === 1 ? '1 item será alterado' : `${quantos} itens serão alterados`;
}

function reiniciarDesconto() {
  barraDesconto.hidden = true;
  botaoDesconto.setAttribute('aria-pressed', 'false');
  idsMarcados.clear();
  campoDesconto.value = '';
  opcoesAlvoDesconto[0].checked = true;
}

function abrirBarraDesconto() {
  barraDesconto.hidden = false;
  botaoDesconto.setAttribute('aria-pressed', 'true');
  atualizarBarraDesconto();
  renderizarLista();
  campoDesconto.focus();
}

function fecharBarraDesconto() {
  reiniciarDesconto();
  renderizarLista();
}

function aplicarDesconto() {
  const percentual = Number(campoDesconto.value);
  const alvo = alvoDesconto();

  if (!(percentual > 0 && percentual <= 100)) {
    resumoDesconto.textContent = 'Informe um desconto entre 0,01% e 100%';
    campoDesconto.focus();
    return;
  }
  if (!produtos.some(entraNoDesconto)) {
    resumoDesconto.textContent = alvo === 'categoria'
      ? 'Nenhum produto nessa categoria'
      : 'Marque pelo menos um item';
    return;
  }

  const afetados = produtos.filter(entraNoDesconto).length;
  produtos = produtos.map(p => {
    if (!entraNoDesconto(p)) return p;
    const base = p.precoOriginal ?? p.preco;
    return {
      ...p,
      precoOriginal: base,
      desconto: percentual,
      preco: Math.round(base * (1 - percentual / 100) * 100) / 100
    };
  });

  reiniciarDesconto();
  atualizarTela();
  mostrarToast(`Desconto de ${formatarPercentual(percentual)}% aplicado em ${afetados} ${afetados === 1 ? 'item' : 'itens'}`);
}

botaoDesconto.addEventListener('click', () => {
  if (barraDesconto.hidden) abrirBarraDesconto();
  else fecharBarraDesconto();
});

function tirarDesconto(produto) {
  if (!produto.desconto) return produto;
  const { precoOriginal, desconto, ...resto } = produto;
  return { ...resto, preco: precoOriginal };
}

botaoDesfazerDescontos.addEventListener('click', () => {
  produtos = produtos.map(tirarDesconto);
  atualizarTela();
  mostrarToast('Todos os descontos foram removidos');
});

botaoCancelarDesconto.addEventListener('click', fecharBarraDesconto);
botaoAplicarDesconto.addEventListener('click', aplicarDesconto);

opcoesAlvoDesconto.forEach(opcao => {
  opcao.addEventListener('change', () => {
    atualizarBarraDesconto();
    renderizarLista();
  });
});

seletorCategoriaDesconto.addEventListener('change', atualizarBarraDesconto);

botaoMarcarTodos.addEventListener('click', () => {
  const visiveis = filtrarProdutos();
  const todosMarcados = visiveis.every(p => idsMarcados.has(p.id));
  visiveis.forEach(p => todosMarcados ? idsMarcados.delete(p.id) : idsMarcados.add(p.id));
  atualizarBarraDesconto();
  renderizarLista();
});

listaProdutos.addEventListener('change', evento => {
  const caixa = evento.target.closest('input.caixaMarcar');
  if (!caixa) return;

  const id = Number(caixa.dataset.id);
  if (caixa.checked) idsMarcados.add(id);
  else idsMarcados.delete(id);
  atualizarBarraDesconto();
});

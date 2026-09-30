function filtroEhEstoqueBaixo() {
  return (filtroAtual.min === null || filtroAtual.min === 0)
    && filtroAtual.max === ESTOQUE_BAIXO - 1;
}

function atualizarBotaoEstoqueBaixo() {
  const ativo = filtroEhEstoqueBaixo();
  botaoEstoqueBaixo.setAttribute('aria-pressed', ativo);
  cartaoEstoqueBaixo.classList.toggle('ativa', ativo);
}

function aplicarFiltro() {
  filtroAtual = { min: lerNumero(filtroQtdMin), max: lerNumero(filtroQtdMax) };
  atualizarBotaoEstoqueBaixo();
  renderizarLista();
}

function alternarEstoqueBaixo() {
  if (filtroEhEstoqueBaixo()) {
    filtroQtdMin.value = '';
    filtroQtdMax.value = '';
  } else {
    filtroQtdMin.value = '';
    filtroQtdMax.value = ESTOQUE_BAIXO - 1;
  }
  aplicarFiltro();
}

botaoFiltrar.addEventListener('click', aplicarFiltro);
botaoEstoqueBaixo.addEventListener('click', alternarEstoqueBaixo);
cartaoEstoqueBaixo.addEventListener('click', alternarEstoqueBaixo);
cartaoEstoqueBaixo.addEventListener('keydown', evento => {
  if (evento.key === 'Enter' || evento.key === ' ') {
    evento.preventDefault();
    alternarEstoqueBaixo();
  }
});

botaoLimparFiltro.addEventListener('click', () => {
  filtroQtdMin.value = '';
  filtroQtdMax.value = '';
  aplicarFiltro();
});

buscaProduto.addEventListener('input', () => {
  termoBusca = buscaProduto.value;
  renderizarLista();
});

botoesVisao.forEach(botao => {
  botao.addEventListener('click', () => {
    painelLista.setAttribute('data-visao', botao.dataset.visao);
    botoesVisao.forEach(b => b.setAttribute('aria-pressed', b === botao));
  });
});

document.getElementById('alternadorGrafico').addEventListener('click', evento => {
  const botao = evento.target.closest('[data-grafico]');
  if (!botao) return;
  estiloGrafico = botao.dataset.grafico;
  guardar('estilo-grafico', estiloGrafico);
  renderizarGrafico();
});

function salvarTitulo() {
  tituloPagina.contentEditable = 'false';
  const nome = tituloPagina.textContent.trim();

  if (nome === '') {
    tituloPagina.textContent = estoqueAtivo().nome;
    return;
  }

  estoqueAtivo().nome = nome;
  renderizarAbas();
  salvarDados();
}

botaoEditarTitulo.addEventListener('click', () => {
  tituloPagina.contentEditable = 'true';
  tituloPagina.focus();

  const faixa = document.createRange();
  faixa.selectNodeContents(tituloPagina);
  const selecao = window.getSelection();
  selecao.removeAllRanges();
  selecao.addRange(faixa);
});

tituloPagina.addEventListener('blur', salvarTitulo);

tituloPagina.addEventListener('keydown', evento => {
  if (evento.key === 'Enter') {
    evento.preventDefault();
    tituloPagina.blur();
  }
});

function renderizarAbas() {
  abas.innerHTML = '';

  estoques.forEach(estoque => {
    const aba = document.createElement('button');
    aba.type = 'button';
    aba.className = 'aba' + (estoque.id === estoqueAtivoId ? ' ativa' : '');
    aba.textContent = estoque.nome;
    aba.dataset.id = estoque.id;
    abas.appendChild(aba);
  });

  const nova = document.createElement('button');
  nova.type = 'button';
  nova.className = 'aba abaNova';
  nova.id = 'botaoNovoEstoque';
  nova.textContent = '+';
  nova.title = 'Novo estoque';
  nova.setAttribute('aria-label', 'Novo estoque');
  abas.appendChild(nova);

  botaoExcluirEstoque.hidden = estoques.length === 1;
}

function desarmarExclusao() {
  clearTimeout(timerExcluir);
  excluindoEstoque = false;
  botaoExcluirEstoque.classList.remove('armado');
  botaoExcluirEstoque.dataset.dica = 'Excluir este estoque (clique duas vezes)';
}

function carregarEstoqueAtivo() {
  const estoque = estoqueAtivo();
  produtos = estoque.produtos;
  proximoId = estoque.proximoId;

  idParaRemover = null;
  termoBusca = '';
  filtroAtual = { min: null, max: null };
  buscaProduto.value = '';
  filtroQtdMin.value = '';
  filtroQtdMax.value = '';
  tituloPagina.textContent = estoque.nome;

  reiniciarDesconto();
  atualizarBotaoEstoqueBaixo();
  desarmarExclusao();
  renderizarAbas();
  atualizarTela();
  animarEntrada();
}

function trocarEstoque(id) {
  const atual = estoqueAtivo();
  atual.produtos = produtos;
  atual.proximoId = proximoId;

  estoqueAtivoId = id;
  carregarEstoqueAtivo();
}

function proximoNomeLivre() {
  let numero = 2;
  while (estoques.some(e => e.nome === `Estoque ${numero}`)) numero++;
  return `Estoque ${numero}`;
}

function novoEstoque() {
  const id = proximoIdEstoque++;
  const nome = proximoNomeLivre();
  estoques.push({ id, nome, produtos: [], proximoId: 1 });
  trocarEstoque(id);
  mostrarToast(`"${nome}" criado`);
}

function excluirEstoque() {
  if (estoques.length === 1) return;

  if (!excluindoEstoque) {
    excluindoEstoque = true;
    botaoExcluirEstoque.classList.add('armado');
    botaoExcluirEstoque.dataset.dica = 'Clique de novo para excluir este estoque';
    timerExcluir = setTimeout(desarmarExclusao, 3000);
    return;
  }

  const indice = estoques.findIndex(e => e.id === estoqueAtivoId);
  estoques = estoques.filter(e => e.id !== estoqueAtivoId);
  estoqueAtivoId = estoques[Math.max(0, indice - 1)].id;
  carregarEstoqueAtivo();
  mostrarToast('Estoque excluído', false);
}

abas.addEventListener('click', evento => {
  const botao = evento.target.closest('button');
  if (!botao) return;

  if (botao.id === 'botaoNovoEstoque') {
    novoEstoque();
  } else if (Number(botao.dataset.id) !== estoqueAtivoId) {
    trocarEstoque(Number(botao.dataset.id));
  }
});

botaoExcluirEstoque.addEventListener('click', excluirEstoque);

const LARGURA_MIN = 260;

function definirLargura(px) {
  const maxima = Math.min(600, window.innerWidth * 0.5);
  app.style.setProperty('--larguraBarraLateral', Math.max(LARGURA_MIN, Math.min(px, maxima)) + 'px');
}

redimensionador.addEventListener('pointerdown', evento => {
  redimensionador.setPointerCapture(evento.pointerId);
  redimensionador.classList.add('arrastando');
  document.body.style.userSelect = 'none';
});

redimensionador.addEventListener('pointermove', evento => {
  if (!redimensionador.hasPointerCapture(evento.pointerId)) return;
  const naDireita = app.dataset.posicao === 'direita';
  definirLargura(naDireita ? window.innerWidth - evento.clientX : evento.clientX);
});

redimensionador.addEventListener('pointerup', evento => {
  redimensionador.releasePointerCapture(evento.pointerId);
  redimensionador.classList.remove('arrastando');
  document.body.style.userSelect = '';
});

redimensionador.addEventListener('keydown', evento => {
  const atual = document.querySelector('.barraLateral').offsetWidth;
  const sentido = app.dataset.posicao === 'direita' ? -1 : 1;
  if (evento.key === 'ArrowRight') definirLargura(atual + 20 * sentido);
  if (evento.key === 'ArrowLeft') definirLargura(atual - 20 * sentido);
});

carregarDados();
carregarEstoqueAtivo();

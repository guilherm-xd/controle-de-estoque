const formProduto = document.getElementById('form-produto');
const inputNome = document.getElementById('input-nome');
const inputCategoria = document.getElementById('input-categoria');
const inputQuantidade = document.getElementById('input-quantidade');
const inputPreco = document.getElementById('input-preco');
const btnAdicionar = document.getElementById('btn-adicionar');

const listaProdutos = document.getElementById('lista-produtos');
const emptyState = document.getElementById('empty-state');
const painelLista = document.querySelector('.list-panel');
const botoesVisao = document.querySelectorAll('.view-btn');

const filtroQtdMin = document.getElementById('filtro-qtd-min');
const filtroQtdMax = document.getElementById('filtro-qtd-max');
const btnFiltrar = document.getElementById('btn-filtrar');
const btnLimparFiltro = document.getElementById('btn-limpar-filtro');
const btnSoBaixo = document.getElementById('btn-so-baixo');

const buscaProduto = document.getElementById('busca-produto');

const statTotalProdutos = document.getElementById('stat-total-produtos');
const statTotalItens = document.getElementById('stat-total-itens');
const statEstoqueBaixo = document.getElementById('stat-estoque-baixo');

const modalEditarOverlay = document.getElementById('modal-editar-overlay');
const formEditarProduto = document.getElementById('form-editar-produto');
const editarId = document.getElementById('editar-id');
const editarNome = document.getElementById('editar-nome');
const editarCategoria = document.getElementById('editar-categoria');
const editarQuantidade = document.getElementById('editar-quantidade');
const editarPreco = document.getElementById('editar-preco');
const btnCancelarEdicao = document.getElementById('btn-cancelar-edicao');
const btnSalvarEdicao = document.getElementById('btn-salvar-edicao');

const tituloPagina = document.getElementById('titulo-pagina');
const btnEditarTitulo = document.getElementById('btn-editar-titulo');

const btnPersonalizarTema = document.getElementById('btn-personalizar-tema');
const modalTemaOverlay = document.getElementById('modal-tema-overlay');
const corPrimaria = document.getElementById('cor-primaria');
const corFundo = document.getElementById('cor-fundo');
const corAlerta = document.getElementById('cor-alerta');
const btnResetarTema = document.getElementById('btn-resetar-tema');
const btnAplicarTema = document.getElementById('btn-aplicar-tema');

const temaLink = document.getElementById('tema-link');
const seletorTema = document.getElementById('seletor-tema');

const abas = document.getElementById('abas');
const btnExcluirEstoque = document.getElementById('btn-excluir-estoque');
const app = document.querySelector('.app');
const resizer = document.getElementById('resizer');

const ESTOQUE_BAIXO = 5;

let produtos = [];
let proximoId = 1;
let idParaRemover = null;
let timerRemover;

let estoques = [{ id: 1, nome: 'Estoque geral', produtos: [], proximoId: 1 }];
let estoqueAtivoId = 1;
let proximoIdEstoque = 2;
let excluindoEstoque = false;
let timerExcluir;

let termoBusca = '';
let filtroAtual = { min: null, max: null };


function formatarPreco(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function lerNumero(input) {
  return input.value === '' ? null : Number(input.value);
}

function estoqueBaixo(produto) {
  return produto.quantidade < ESTOQUE_BAIXO;
}


function filtrarProdutos() {
  const termo = termoBusca.trim().toLowerCase();

  return produtos
    .filter(p => p.nome.toLowerCase().includes(termo))
    .filter(p => filtroAtual.min === null || p.quantidade >= filtroAtual.min)
    .filter(p => filtroAtual.max === null || p.quantidade <= filtroAtual.max);
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
  botao.className = 'btn-icon btn-editar';
  botao.innerHTML = ICONE_LAPIS;
  botao.dataset.tip = 'Editar';
  botao.setAttribute('aria-label', 'Editar');
  botao.dataset.action = 'editar';
  botao.dataset.id = id;
  return botao;
}

function criarBotaoRemover(id) {
  const botao = document.createElement('button');
  botao.className = 'btn-icon btn-remover' + (id === idParaRemover ? ' armado' : '');
  botao.innerHTML = ICONE_LIXEIRA;
  botao.dataset.tip = id === idParaRemover ? 'Tem certeza? Clique novamente' : 'Remover';
  botao.setAttribute('aria-label', botao.dataset.tip);
  botao.dataset.action = 'remover';
  botao.dataset.id = id;
  return botao;
}

function criarLinha(produto) {
  const tr = document.createElement('tr');
  tr.dataset.id = produto.id;

  tr.appendChild(criarCelula(produto.nome));
  tr.appendChild(criarCelula(produto.categoria || '—'));
  tr.appendChild(criarCelula(produto.quantidade));
  tr.appendChild(criarCelula(formatarPreco(produto.preco)));

  const tdStatus = document.createElement('td');
  const badge = document.createElement('span');
  if (produto.quantidade === 0) {
    badge.className = 'badge badge-zero';
    badge.textContent = 'Sem estoque';
  } else if (estoqueBaixo(produto)) {
    badge.className = 'badge badge-baixo';
    badge.textContent = 'Estoque baixo';
  } else {
    badge.className = 'badge badge-ok';
    badge.textContent = 'Em estoque';
  }
  tdStatus.appendChild(badge);
  tr.appendChild(tdStatus);

  const tdAcoes = document.createElement('td');
  tdAcoes.appendChild(criarBotaoEditar(produto.id));
  tdAcoes.appendChild(criarBotaoRemover(produto.id));
  tr.appendChild(tdAcoes);

  return tr;
}

function renderizarLista() {
  const visiveis = filtrarProdutos();

  listaProdutos.innerHTML = '';
  visiveis.forEach(produto => listaProdutos.appendChild(criarLinha(produto)));

  emptyState.hidden = visiveis.length > 0;
  emptyState.textContent = produtos.length === 0
    ? 'Nenhum produto cadastrado ainda. Adicione o primeiro produto acima.'
    : 'Nenhum produto encontrado com esses filtros.';
}

function atualizarIndicadores() {
  statTotalProdutos.textContent = produtos.length;
  statTotalItens.textContent = produtos.reduce((soma, p) => soma + p.quantidade, 0);
  statEstoqueBaixo.textContent = produtos.filter(estoqueBaixo).length;
}

function atualizarTela() {
  renderizarLista();
  atualizarIndicadores();
}


formProduto.addEventListener('submit', evento => {
  evento.preventDefault();

  produtos.push({
    id: proximoId++,
    nome: inputNome.value.trim(),
    categoria: inputCategoria.value.trim(),
    quantidade: Number(inputQuantidade.value),
    preco: Number(inputPreco.value) || 0
  });

  formProduto.reset();
  inputNome.focus();
  atualizarTela();
});

function removerProduto(id) {
  clearTimeout(timerRemover);

  if (idParaRemover !== id) {
    idParaRemover = id;
    timerRemover = setTimeout(() => {
      idParaRemover = null;
      renderizarLista();
    }, 3000);
    renderizarLista();
    return;
  }

  idParaRemover = null;
  produtos = produtos.filter(p => p.id !== id);
  atualizarTela();
}

function abrirEdicao(id) {
  const produto = produtos.find(p => p.id === id);

  editarId.value = produto.id;
  editarNome.value = produto.nome;
  editarCategoria.value = produto.categoria;
  editarQuantidade.value = produto.quantidade;
  editarPreco.value = produto.preco;

  modalEditarOverlay.hidden = false;
  editarNome.focus();
}

function fecharEdicao() {
  modalEditarOverlay.hidden = true;
}

formEditarProduto.addEventListener('submit', evento => {
  evento.preventDefault();
  const id = Number(editarId.value);

  produtos = produtos.map(p => p.id === id
    ? {
        ...p,
        nome: editarNome.value.trim(),
        categoria: editarCategoria.value.trim(),
        quantidade: Number(editarQuantidade.value),
        preco: Number(editarPreco.value)
      }
    : p
  );

  fecharEdicao();
  atualizarTela();
});

btnCancelarEdicao.addEventListener('click', fecharEdicao);

listaProdutos.addEventListener('click', evento => {
  const botao = evento.target.closest('button[data-action]');
  if (!botao) return;

  const id = Number(botao.dataset.id);
  if (botao.dataset.action === 'editar') abrirEdicao(id);
  if (botao.dataset.action === 'remover') removerProduto(id);
});


function aplicarFiltro() {
  filtroAtual = { min: lerNumero(filtroQtdMin), max: lerNumero(filtroQtdMax) };
  renderizarLista();
}

btnFiltrar.addEventListener('click', aplicarFiltro);

btnLimparFiltro.addEventListener('click', () => {
  filtroQtdMin.value = '';
  filtroQtdMax.value = '';
  aplicarFiltro();
});

btnSoBaixo.addEventListener('click', () => {
  filtroQtdMin.value = '';
  filtroQtdMax.value = ESTOQUE_BAIXO - 1;
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


function salvarTitulo() {
  tituloPagina.contentEditable = 'false';
  const nome = tituloPagina.textContent.trim();

  if (nome === '') {
    tituloPagina.textContent = estoqueAtivo().nome;
    return;
  }

  estoqueAtivo().nome = nome;
  renderizarAbas();
}

btnEditarTitulo.addEventListener('click', () => {
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


const raiz = document.documentElement;

function lerCorDoTema(variavel) {
  return getComputedStyle(raiz).getPropertyValue(variavel).trim().toLowerCase();
}

btnPersonalizarTema.addEventListener('click', () => {
  corPrimaria.value = lerCorDoTema('--color-primary');
  corFundo.value = lerCorDoTema('--color-bg');
  corAlerta.value = lerCorDoTema('--color-warn');
  modalTemaOverlay.hidden = false;
});

btnAplicarTema.addEventListener('click', () => {
  raiz.style.setProperty('--color-primary', corPrimaria.value);
  raiz.style.setProperty('--color-bg', corFundo.value);
  raiz.style.setProperty('--color-warn', corAlerta.value);
  modalTemaOverlay.hidden = true;
});

function resetarCores() {
  raiz.style.removeProperty('--color-primary');
  raiz.style.removeProperty('--color-bg');
  raiz.style.removeProperty('--color-warn');
}

btnResetarTema.addEventListener('click', () => {
  resetarCores();
  corPrimaria.value = lerCorDoTema('--color-primary');
  corFundo.value = lerCorDoTema('--color-bg');
  corAlerta.value = lerCorDoTema('--color-warn');
});


function aplicarTema(nome) {
  temaLink.href = `tema-${nome}.css`;
  resetarCores();
  localStorage.setItem('tema-escolhido', nome);
}

seletorTema.addEventListener('change', () => aplicarTema(seletorTema.value));

const temaSalvo = localStorage.getItem('tema-escolhido');
if (temaSalvo) {
  seletorTema.value = temaSalvo;
  aplicarTema(temaSalvo);
}


[modalEditarOverlay, modalTemaOverlay].forEach(overlay => {
  overlay.addEventListener('click', evento => {
    if (evento.target === overlay) overlay.hidden = true;
  });
});

document.addEventListener('keydown', evento => {
  if (evento.key === 'Escape') {
    modalEditarOverlay.hidden = true;
    modalTemaOverlay.hidden = true;
  }
});


function estoqueAtivo() {
  return estoques.find(e => e.id === estoqueAtivoId);
}

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
  nova.className = 'aba aba-nova';
  nova.id = 'btn-novo-estoque';
  nova.textContent = '+';
  nova.title = 'Novo estoque';
  nova.setAttribute('aria-label', 'Novo estoque');
  abas.appendChild(nova);

  btnExcluirEstoque.hidden = estoques.length === 1;
}

function desarmarExclusao() {
  clearTimeout(timerExcluir);
  excluindoEstoque = false;
  btnExcluirEstoque.classList.remove('armado');
  btnExcluirEstoque.title = 'Excluir este estoque (clique duas vezes)';
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

  desarmarExclusao();
  renderizarAbas();
  atualizarTela();
}

function trocarEstoque(id) {
  const atual = estoqueAtivo();
  atual.produtos = produtos;
  atual.proximoId = proximoId;

  estoqueAtivoId = id;
  carregarEstoqueAtivo();
}

function novoEstoque() {
  const id = proximoIdEstoque++;
  estoques.push({ id, nome: `Estoque ${id}`, produtos: [], proximoId: 1 });
  trocarEstoque(id);
}

function excluirEstoque() {
  if (estoques.length === 1) return;

  if (!excluindoEstoque) {
    excluindoEstoque = true;
    btnExcluirEstoque.classList.add('armado');
    btnExcluirEstoque.title = 'Clique de novo para excluir este estoque';
    timerExcluir = setTimeout(desarmarExclusao, 3000);
    return;
  }

  const indice = estoques.findIndex(e => e.id === estoqueAtivoId);
  estoques = estoques.filter(e => e.id !== estoqueAtivoId);
  estoqueAtivoId = estoques[Math.max(0, indice - 1)].id;
  carregarEstoqueAtivo();
}

abas.addEventListener('click', evento => {
  const botao = evento.target.closest('button');
  if (!botao) return;

  if (botao.id === 'btn-novo-estoque') {
    novoEstoque();
  } else if (Number(botao.dataset.id) !== estoqueAtivoId) {
    trocarEstoque(Number(botao.dataset.id));
  }
});

btnExcluirEstoque.addEventListener('click', excluirEstoque);


const LARGURA_MIN = 260;

function definirLargura(px) {
  const maxima = Math.min(600, window.innerWidth * 0.5);
  app.style.setProperty('--sidebar-w', Math.max(LARGURA_MIN, Math.min(px, maxima)) + 'px');
}

resizer.addEventListener('pointerdown', evento => {
  resizer.setPointerCapture(evento.pointerId);
  resizer.classList.add('arrastando');
  document.body.style.userSelect = 'none';
});

resizer.addEventListener('pointermove', evento => {
  if (resizer.hasPointerCapture(evento.pointerId)) definirLargura(evento.clientX);
});

resizer.addEventListener('pointerup', evento => {
  resizer.releasePointerCapture(evento.pointerId);
  resizer.classList.remove('arrastando');
  document.body.style.userSelect = '';
});

resizer.addEventListener('keydown', evento => {
  const atual = document.querySelector('.sidebar').offsetWidth;
  if (evento.key === 'ArrowRight') definirLargura(atual + 20);
  if (evento.key === 'ArrowLeft') definirLargura(atual - 20);
});


renderizarAbas();
atualizarTela();

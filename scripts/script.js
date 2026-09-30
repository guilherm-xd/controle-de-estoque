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

const VISOES = ['detalhes', 'grade', 'compacta'];
const COR_HEX = /^#[0-9a-f]{6}$/i;
let preferencias = { visao: 'detalhes', largura: null, cores: null };


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
  botao.dataset.tip = id === idParaRemover ? 'Tem certeza? Clique de novo' : 'Remover';
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

function lerStorage(chave) {
  try {
    return localStorage.getItem(chave);
  } catch (erro) {
    return null;
  }
}

function gravarStorage(chave, valor) {
  try {
    localStorage.setItem(chave, valor);
  } catch (erro) {}
}

function removerStorage(chave) {
  try {
    localStorage.removeItem(chave);
  } catch (erro) {}
}

function normalizarProduto(produto) {
  if (!produto || typeof produto.nome !== 'string') return null;

  return {
    nome: produto.nome,
    categoria: typeof produto.categoria === 'string' ? produto.categoria : '',
    quantidade: Math.max(0, Number(produto.quantidade) || 0),
    preco: Math.max(0, Number(produto.preco) || 0)
  };
}

function normalizarDados(dados) {
  if (!dados || !Array.isArray(dados.estoques)) return null;

  const validos = dados.estoques.filter(e => e && typeof e.nome === 'string' && Array.isArray(e.produtos));
  if (validos.length === 0) return null;

  const lista = validos.map((e, i) => {
    const itens = e.produtos
      .map(normalizarProduto)
      .filter(Boolean)
      .map((p, j) => ({ id: j + 1, ...p }));

    return {
      id: i + 1,
      nome: e.nome.trim() || `Estoque ${i + 1}`,
      produtos: itens,
      proximoId: itens.length + 1
    };
  });

  const indiceAtivo = validos.findIndex(e => e.id === dados.estoqueAtivoId);

  return {
    estoques: lista,
    estoqueAtivoId: indiceAtivo === -1 ? 1 : indiceAtivo + 1,
    proximoIdEstoque: lista.length + 1
  };
}

function salvarDados() {
  const atual = estoqueAtivo();
  if (!atual) return;

  atual.produtos = produtos;
  atual.proximoId = proximoId;

  gravarStorage('estoques', JSON.stringify({ estoques, estoqueAtivoId, proximoIdEstoque }));
}

function carregarDados() {
  const bruto = lerStorage('estoques');
  if (!bruto) return;

  let dados = null;
  try {
    dados = normalizarDados(JSON.parse(bruto));
  } catch (erro) {
    dados = null;
  }

  if (!dados) {
    removerStorage('estoques');
    return;
  }

  estoques = dados.estoques;
  estoqueAtivoId = dados.estoqueAtivoId;
  proximoIdEstoque = dados.proximoIdEstoque;
}

function salvarPreferencias() {
  gravarStorage('preferencias', JSON.stringify(preferencias));
}

function carregarPreferencias() {
  try {
    const salvo = JSON.parse(lerStorage('preferencias'));
    if (!salvo || typeof salvo !== 'object') return;

    if (VISOES.includes(salvo.visao)) preferencias.visao = salvo.visao;
    if (Number.isFinite(salvo.largura)) preferencias.largura = salvo.largura;
    if (salvo.cores && Object.keys(VARIAVEIS_COR).every(chave => COR_HEX.test(salvo.cores[chave]))) {
      preferencias.cores = salvo.cores;
    }
  } catch (erro) {
    removerStorage('preferencias');
  }
}

function restaurarPreferencias() {
  definirVisao(preferencias.visao);
  if (preferencias.largura !== null) definirLargura(preferencias.largura);
  if (preferencias.cores) aplicarCores(preferencias.cores);
}

function atualizarTela() {
  renderizarLista();
  atualizarIndicadores();
  salvarDados();
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
  const indice = produtos.findIndex(p => p.id === id);
  ultimoRemovido = { produto: produtos[indice], indice, estoqueId: estoqueAtivoId };
  produtos = produtos.filter(p => p.id !== id);
  atualizarTela();
  mostrarAvisoDesfazer();
}

let ultimoRemovido = null;
let timerAviso;

const aviso = document.createElement('div');
aviso.className = 'aviso-desfazer';
aviso.hidden = true;
aviso.innerHTML = '<span></span><button type="button">Desfazer</button>';
document.body.appendChild(aviso);

function esconderAviso() {
  clearTimeout(timerAviso);
  aviso.hidden = true;
}

function mostrarAvisoDesfazer() {
  aviso.querySelector('span').textContent = `"${ultimoRemovido.produto.nome}" removido`;
  aviso.hidden = false;
  clearTimeout(timerAviso);
  timerAviso = setTimeout(esconderAviso, 6000);
}

aviso.querySelector('button').addEventListener('click', () => {
  if (!ultimoRemovido) return;
  const { produto, indice, estoqueId } = ultimoRemovido;
  ultimoRemovido = null;
  esconderAviso();
  if (!estoques.some(e => e.id === estoqueId)) return;
  if (estoqueId !== estoqueAtivoId) trocarEstoque(estoqueId);
  produtos.splice(indice, 0, produto);
  atualizarTela();
});

function escaparCsv(valor) {
  const texto = String(valor);
  return /[";\n]/.test(texto) ? `"${texto.replace(/"/g, '""')}"` : texto;
}

function exportarCsv() {
  const cabecalho = ['Produto', 'Categoria', 'Quantidade', 'Preço (R$)', 'Status'];
  const linhas = produtos.map(p => [
    p.nome,
    p.categoria,
    p.quantidade,
    p.preco.toFixed(2).replace('.', ','),
    p.quantidade === 0 ? 'Sem estoque' : estoqueBaixo(p) ? 'Estoque baixo' : 'Em estoque'
  ]);
  const csv = [cabecalho, ...linhas].map(l => l.map(escaparCsv).join(';')).join('\r\n');
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${estoqueAtivo().nome}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
}

document.getElementById('btn-exportar').addEventListener('click', exportarCsv);

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

buscaProduto.addEventListener('input', () => {
  termoBusca = buscaProduto.value;
  renderizarLista();
});

function definirVisao(visao) {
  painelLista.setAttribute('data-visao', visao);
  botoesVisao.forEach(b => b.setAttribute('aria-pressed', b.dataset.visao === visao));
}

botoesVisao.forEach(botao => {
  botao.addEventListener('click', () => {
    definirVisao(botao.dataset.visao);
    preferencias.visao = botao.dataset.visao;
    salvarPreferencias();
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
  salvarDados();
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

const VARIAVEIS_COR = {
  primaria: '--color-primary',
  fundo: '--color-bg',
  sidebar: '--color-sidebar',
  alerta: '--color-warn'
};

function aplicarCores(cores) {
  Object.entries(VARIAVEIS_COR).forEach(([chave, variavel]) => {
    raiz.style.setProperty(variavel, cores[chave]);
  });
}

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
  preferencias.cores = {
    primaria: corPrimaria.value,
    fundo: corFundo.value,
    sidebar: corSidebar.value,
    alerta: corAlerta.value
  };
  aplicarCores(preferencias.cores);
  salvarPreferencias();
  modalTemaOverlay.hidden = true;
});

function resetarCores() {
  Object.values(VARIAVEIS_COR).forEach(variavel => raiz.style.removeProperty(variavel));
}

btnResetarTema.addEventListener('click', () => {
  resetarCores();
  preferencias.cores = null;
  salvarPreferencias();
  corPrimaria.value = lerCorDoTema('--color-primary');
  corFundo.value = lerCorDoTema('--color-bg');
  corAlerta.value = lerCorDoTema('--color-warn');
});


function aplicarTema(nome) {
  temaLink.href = `tema-${nome}.css`;
  resetarCores();
  gravarStorage('tema-escolhido', nome);
}

seletorTema.addEventListener('change', () => {
  aplicarTema(seletorTema.value);
  preferencias.cores = null;
  salvarPreferencias();
});

const temaSalvo = lerStorage('tema-escolhido');
if (temaSalvo && [...seletorTema.options].some(o => o.value === temaSalvo)) {
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
  const largura = Math.max(LARGURA_MIN, Math.min(px, maxima));
  app.style.setProperty('--sidebar-w', largura + 'px');
  preferencias.largura = largura;
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
  salvarPreferencias();
});

resizer.addEventListener('keydown', evento => {
  if (evento.key !== 'ArrowRight' && evento.key !== 'ArrowLeft') return;

  const atual = document.querySelector('.sidebar').offsetWidth;
  definirLargura(atual + (evento.key === 'ArrowRight' ? 20 : -20));
  salvarPreferencias();
});


carregarDados();
carregarPreferencias();
restaurarPreferencias();
carregarEstoqueAtivo();
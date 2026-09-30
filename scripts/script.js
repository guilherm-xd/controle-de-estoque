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

const statValorTotal = document.getElementById('stat-valor-total');
const painelGrafico = document.getElementById('painel-grafico');
const graficoCategorias = document.getElementById('grafico-categorias');
const modalTransferirOverlay = document.getElementById('modal-transferir-overlay');
const transferirDestino = document.getElementById('transferir-destino');
const arquivoImportar = document.getElementById('arquivo-importar');
const areaImpressao = document.getElementById('area-impressao');

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

let ordem = { campo: null, dir: 1 };
let idTransferindo = null;

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

  const lista = produtos
    .filter(p => p.nome.toLowerCase().includes(termo))
    .filter(p => filtroAtual.min === null || p.quantidade >= filtroAtual.min)
    .filter(p => filtroAtual.max === null || p.quantidade <= filtroAtual.max);

  if (!ordem.campo) return lista;

  return lista.sort((a, b) => {
    const x = a[ordem.campo];
    const y = b[ordem.campo];
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

const ICONE_TRANSFERIR = '<svg viewBox="0 0 20 20" width="15" height="15" fill="none" aria-hidden="true"><path d="M3 7h13M12.5 3.5L16 7l-3.5 3.5M17 13H4M7.5 9.5L4 13l3.5 3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

function criarBotaoTransferir(id) {
  const botao = document.createElement('button');
  botao.className = 'btn-icon';
  botao.innerHTML = ICONE_TRANSFERIR;
  botao.dataset.tip = 'Mover para outro estoque';
  botao.setAttribute('aria-label', 'Mover para outro estoque');
  botao.dataset.action = 'transferir';
  botao.dataset.id = id;
  return botao;
}

function criarCelulaQuantidade(produto) {
  const td = document.createElement('td');
  const menos = document.createElement('button');
  const mais = document.createElement('button');
  const valor = document.createElement('span');

  menos.className = 'qtd-btn';
  menos.textContent = '−';
  menos.dataset.action = 'menos';
  menos.dataset.id = produto.id;
  menos.disabled = produto.quantidade === 0;
  menos.setAttribute('aria-label', 'Diminuir quantidade');

  mais.className = 'qtd-btn';
  mais.textContent = '+';
  mais.dataset.action = 'mais';
  mais.dataset.id = produto.id;
  mais.setAttribute('aria-label', 'Aumentar quantidade');

  valor.className = 'qtd-valor';
  valor.textContent = produto.quantidade;

  td.append(menos, valor, mais);
  return td;
}

function criarLinha(produto) {
  const tr = document.createElement('tr');
  tr.dataset.id = produto.id;

  tr.appendChild(criarCelula(produto.nome));
  tr.appendChild(criarCelula(produto.categoria || '—'));
  tr.appendChild(criarCelulaQuantidade(produto));
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
  if (estoques.length > 1) tdAcoes.appendChild(criarBotaoTransferir(produto.id));
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
  statValorTotal.textContent = formatarPreco(produtos.reduce((soma, p) => soma + p.quantidade * p.preco, 0));
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

  entradas.forEach(([categoria, quantidade]) => {
    const linha = document.createElement('div');
    const nome = document.createElement('span');
    const trilho = document.createElement('div');
    const barra = document.createElement('div');
    const valor = document.createElement('span');

    linha.className = 'barra-linha';
    nome.className = 'barra-nome';
    nome.textContent = categoria;
    trilho.className = 'barra-trilho';
    barra.className = 'barra';
    barra.style.width = (quantidade / maior) * 100 + '%';
    valor.className = 'barra-valor';
    valor.textContent = quantidade;

    trilho.appendChild(barra);
    linha.append(nome, trilho, valor);
    graficoCategorias.appendChild(linha);
  });
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
  renderizarGrafico();
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
  if (botao.dataset.action === 'transferir') abrirTransferencia(id);
  if (botao.dataset.action === 'mais' || botao.dataset.action === 'menos') {
    const produto = produtos.find(p => p.id === id);
    produto.quantidade = Math.max(0, produto.quantidade + (botao.dataset.action === 'mais' ? 1 : -1));
    atualizarTela();
  }
});

document.querySelectorAll('th[data-campo]').forEach(th => {
  th.addEventListener('click', () => {
    const campo = th.dataset.campo;
    ordem = { campo, dir: ordem.campo === campo ? -ordem.dir : 1 };
    document.querySelectorAll('th[data-campo]').forEach(outro => delete outro.dataset.dir);
    th.dataset.dir = ordem.dir;
    renderizarLista();
  });
});

function abrirTransferencia(id) {
  idTransferindo = id;
  transferirDestino.innerHTML = '';
  estoques
    .filter(e => e.id !== estoqueAtivoId)
    .forEach(e => transferirDestino.appendChild(new Option(e.nome, e.id)));
  modalTransferirOverlay.hidden = false;
}

document.getElementById('btn-cancelar-transferir').addEventListener('click', () => {
  modalTransferirOverlay.hidden = true;
});

document.getElementById('btn-confirmar-transferir').addEventListener('click', () => {
  const destino = estoques.find(e => e.id === Number(transferirDestino.value));
  const produto = produtos.find(p => p.id === idTransferindo);
  if (!destino || !produto) return;

  destino.produtos.push({ ...produto, id: destino.proximoId++ });
  produtos = produtos.filter(p => p.id !== idTransferindo);
  modalTransferirOverlay.hidden = true;
  atualizarTela();
});

function lerCsv(texto) {
  const limpo = texto.replace(/^\ufeff/, '');
  const separador = limpo.split('\n')[0].includes(';') ? ';' : ',';
  const linhas = [];
  let linha = [];
  let campo = '';
  let aspas = false;

  for (let i = 0; i < limpo.length; i++) {
    const c = limpo[i];
    if (aspas) {
      if (c === '"' && limpo[i + 1] === '"') { campo += '"'; i++; }
      else if (c === '"') aspas = false;
      else campo += c;
    } else if (c === '"') aspas = true;
    else if (c === separador) { linha.push(campo); campo = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && limpo[i + 1] === '\n') i++;
      linha.push(campo);
      linhas.push(linha);
      linha = [];
      campo = '';
    } else campo += c;
  }
  if (campo !== '' || linha.length) { linha.push(campo); linhas.push(linha); }
  return linhas;
}

function agruparProdutos(linhas, nomePadrao) {
  const cabecalho = linhas[0].map(c => String(c).trim().toLowerCase());
  const col = texto => cabecalho.findIndex(c => c.startsWith(texto));
  const i = { estoque: col('estoque'), nome: col('produto'), categoria: col('categoria'), quantidade: col('quantidade'), preco: col('preço') };
  const grupos = {};

  if (i.nome < 0 || i.quantidade < 0) return grupos;

  linhas.slice(1)
    .filter(l => String(l[i.nome] ?? '').trim() !== '')
    .forEach(l => {
      const nomeEstoque = i.estoque >= 0 ? String(l[i.estoque]).trim() || nomePadrao : nomePadrao;
      if (!grupos[nomeEstoque]) grupos[nomeEstoque] = [];
      grupos[nomeEstoque].push({
        nome: String(l[i.nome]).trim(),
        categoria: i.categoria >= 0 ? String(l[i.categoria] ?? '').trim() : '',
        quantidade: Math.max(0, parseInt(l[i.quantidade]) || 0),
        preco: parseFloat(String(l[i.preco] ?? 0).replace(',', '.')) || 0
      });
    });

  return grupos;
}

async function importarArquivo(arquivo) {
  const nomeBase = arquivo.name.replace(/\.[^.]+$/, '');
  const grupos = {};

  if (/\.xlsx?$/i.test(arquivo.name)) {
    const livro = XLSX.read(await arquivo.arrayBuffer());
    livro.SheetNames.forEach(nome => {
      const linhas = XLSX.utils.sheet_to_json(livro.Sheets[nome], { header: 1 });
      if (linhas.length) Object.assign(grupos, agruparProdutos(linhas, nome));
    });
  } else {
    const linhas = lerCsv(await arquivo.text());
    if (linhas.length) Object.assign(grupos, agruparProdutos(linhas, nomeBase));
  }

  const nomes = Object.keys(grupos);
  if (nomes.length === 0) {
    alert('Não encontrei as colunas Produto e Quantidade no arquivo.');
    return;
  }

  estoqueAtivo().produtos = produtos;
  estoqueAtivo().proximoId = proximoId;

  let ultimoId;
  nomes.forEach(nome => {
    ultimoId = proximoIdEstoque++;
    estoques.push({
      id: ultimoId,
      nome,
      produtos: grupos[nome].map((p, indice) => ({ ...p, id: indice + 1 })),
      proximoId: grupos[nome].length + 1
    });
  });

  estoqueAtivoId = ultimoId;
  carregarEstoqueAtivo();
}

document.getElementById('btn-importar').addEventListener('click', () => arquivoImportar.click());

arquivoImportar.addEventListener('change', () => {
  if (arquivoImportar.files[0]) importarArquivo(arquivoImportar.files[0]);
  arquivoImportar.value = '';
});

document.getElementById('btn-reposicao').addEventListener('click', () => {
  const faltando = produtos.filter(estoqueBaixo).sort((a, b) => a.quantidade - b.quantidade);
  const linhas = faltando.map(p => `<tr><td>${p.nome.replace(/</g, '&lt;')}</td><td>${(p.categoria || '—').replace(/</g, '&lt;')}</td><td>${p.quantidade}</td><td></td></tr>`).join('');

  areaImpressao.innerHTML = `
    <h1>Lista de reposição</h1>
    <p>${estoqueAtivo().nome.replace(/</g, '&lt;')} — ${new Date().toLocaleDateString('pt-BR')}</p>
    ${faltando.length === 0
      ? '<p>Nenhum item com estoque baixo.</p>'
      : `<table><thead><tr><th>Produto</th><th>Categoria</th><th>Em estoque</th><th>Quantidade a pedir</th></tr></thead><tbody>${linhas}</tbody></table>`}`;
  window.print();
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
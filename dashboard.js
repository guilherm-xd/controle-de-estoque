// Formulário de cadastro
const formProduto = document.getElementById('form-produto');
const inputNome = document.getElementById('input-nome');
const inputCategoria = document.getElementById('input-categoria');
const inputQuantidade = document.getElementById('input-quantidade');
const inputPreco = document.getElementById('input-preco');
const btnAdicionar = document.getElementById('btn-adicionar');

// Lista de produtos
const listaProdutos = document.getElementById('lista-produtos');
const emptyState = document.getElementById('empty-state');

// Filtro por quantidade
const filtroQtdMin = document.getElementById('filtro-qtd-min');
const filtroQtdMax = document.getElementById('filtro-qtd-max');
const btnFiltrar = document.getElementById('btn-filtrar');
const btnLimparFiltro = document.getElementById('btn-limpar-filtro');

// Busca por nome
const buscaProduto = document.getElementById('busca-produto');

// Indicadores no topo
const statTotalProdutos = document.getElementById('stat-total-produtos');
const statTotalItens = document.getElementById('stat-total-itens');
const statEstoqueBaixo = document.getElementById('stat-estoque-baixo');

// Modal de editar produto
const modalEditarOverlay = document.getElementById('modal-editar-overlay');
const formEditarProduto = document.getElementById('form-editar-produto');
const editarId = document.getElementById('editar-id');
const editarNome = document.getElementById('editar-nome');
const editarCategoria = document.getElementById('editar-categoria');
const editarQuantidade = document.getElementById('editar-quantidade');
const editarPreco = document.getElementById('editar-preco');
const btnCancelarEdicao = document.getElementById('btn-cancelar-edicao');
const btnSalvarEdicao = document.getElementById('btn-salvar-edicao');

// Título editável
const tituloPagina = document.getElementById('titulo-pagina');
const btnEditarTitulo = document.getElementById('btn-editar-titulo');

// Personalizar cores
const btnPersonalizarTema = document.getElementById('btn-personalizar-tema');
const modalTemaOverlay = document.getElementById('modal-tema-overlay');
const corPrimaria = document.getElementById('cor-primaria');
const corFundo = document.getElementById('cor-fundo');
const corAlerta = document.getElementById('cor-alerta');
const btnResetarTema = document.getElementById('btn-resetar-tema');
const btnAplicarTema = document.getElementById('btn-aplicar-tema');
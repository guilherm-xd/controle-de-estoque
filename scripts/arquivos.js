function escaparCsv(valor) {
  const texto = String(valor);
  return /[";\n]/.test(texto) ? `"${texto.replace(/"/g, '""')}"` : texto;
}

const modalExportarFundo = document.getElementById('modalExportarFundo');
const exportarFormato = document.getElementById('exportarFormato');
const exportarEscopo = document.getElementById('exportarEscopo');
const CABECALHO = ['Produto', 'Categoria', 'Quantidade', 'Preço (R$)', 'Status'];

function statusDoProduto(p) {
  return p.quantidade === 0 ? 'Sem estoque' : estoqueBaixo(p) ? 'Estoque baixo' : 'Em estoque';
}

function linhasDe(lista, comoTexto) {
  return lista.map(p => [
    p.nome,
    p.categoria,
    p.quantidade,
    comoTexto ? p.preco.toFixed(2).replace('.', ',') : p.preco,
    statusDoProduto(p)
  ]);
}

function nomeDeAba(nome, usados) {
  const base = nome.replace(/[\[\]:*?\/\\]/g, ' ').trim().slice(0, 28) || 'Estoque';
  let final = base;
  let i = 2;
  while (usados.includes(final)) final = `${base} ${i++}`;
  usados.push(final);
  return final;
}

function baixarArquivo(blob, nome) {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = nome;
  link.click();
  URL.revokeObjectURL(link.href);
}

function exportar() {
  estoqueAtivo().produtos = produtos;
  const todos = exportarEscopo.value === 'todos';
  const lista = todos ? estoques : [estoqueAtivo()];
  const nomeArquivo = todos ? 'Todos os estoques' : estoqueAtivo().nome;

  if (exportarFormato.value === 'xlsx') {
    const livro = XLSX.utils.book_new();
    const usados = [];
    lista.forEach(e => {
      const planilha = XLSX.utils.aoa_to_sheet([CABECALHO, ...linhasDe(e.produtos, false)]);
      XLSX.utils.book_append_sheet(livro, planilha, nomeDeAba(e.nome, usados));
    });
    XLSX.writeFile(livro, `${nomeArquivo}.xlsx`);
  } else {
    const linhas = todos
      ? lista.flatMap(e => linhasDe(e.produtos, true).map(l => [e.nome, ...l]))
      : linhasDe(lista[0].produtos, true);
    const cabecalho = todos ? ['Estoque', ...CABECALHO] : CABECALHO;
    const csv = [cabecalho, ...linhas].map(l => l.map(escaparCsv).join(';')).join('\r\n');
    baixarArquivo(new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' }), `${nomeArquivo}.csv`);
  }
  modalExportarFundo.hidden = true;
}

document.getElementById('botaoExportar').addEventListener('click', () => {
  modalExportarFundo.hidden = false;
});
document.getElementById('botaoCancelarExportar').addEventListener('click', () => {
  modalExportarFundo.hidden = true;
});
document.getElementById('botaoConfirmarExportar').addEventListener('click', exportar);

document.getElementById('botaoReposicao').addEventListener('click', () => {
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

document.getElementById('botaoImportar').addEventListener('click', () => arquivoImportar.click());

arquivoImportar.addEventListener('change', () => {
  if (arquivoImportar.files[0]) importarArquivo(arquivoImportar.files[0]);
  arquivoImportar.value = '';
});

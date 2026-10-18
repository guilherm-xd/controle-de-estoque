const botaoExportar = document.getElementById("botaoExportar");
const modalExportarFundo = document.getElementById("modalExportarFundo");
const exportarFormato = document.getElementById("exportarFormato");
const exportarEscopo = document.getElementById("exportarEscopo");
const botaoCancelarExportar = document.getElementById("botaoCancelarExportar");
const botaoConfirmarExportar = document.getElementById("botaoConfirmarExportar");

const botaoImportar = document.getElementById("botaoImportar");
const arquivoImportar = document.getElementById("arquivoImportar");

const botaoReposicao = document.getElementById("botaoReposicao");
const areaImpressao = document.getElementById("areaImpressao");
function escaparCsv(valor) {
  const texto = String(valor);
  return /[";\n]/.test(texto) ? `"${texto.replace(/"/g, '""')}"` : texto;
}
const CABECALHO = ["Produto", "Categoria", "Quantidade", "Preço (R$)", "Status"];

function statusDoProduto(p) {
  return p.quantidade === 0 ? "Sem estoque" : estoqueBaixo(p) ? "Estoque baixo" : "Em estoque";
}

function linhasDe(lista, comoTexto) {
  return lista.map(p => [
    p.nome,
    p.categoria,
    p.quantidade,
    comoTexto ? p.preco.toFixed(2).replace(".", ",") : p.preco,
    statusDoProduto(p)
  ]);
}

function nomeDeAba(nome, usados) {
  const base = nome.replace(/[\[\]:*?\/\\]/g, " ").trim().slice(0, 28) || "Estoque";
  let final = base;
  let i = 2;
  while (usados.includes(final)) final = `${base} ${i++}`;
  usados.push(final);
  return final;
}

function baixarArquivo(blob, nome) {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = nome;
  link.click();
  URL.revokeObjectURL(link.href);
}

function exportar() {
  estoqueAtivo().produtos = produtos;
  const todos = exportarEscopo.value === "todos";
  const lista = todos ? estoques : [estoqueAtivo()];
  const nomeArquivo = todos ? "Todos os estoques" : estoqueAtivo().nome;

  if (exportarFormato.value === "xlsx") {
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
    const cabecalho = todos ? ["Estoque", ...CABECALHO] : CABECALHO;
    const csv = [cabecalho, ...linhas].map(l => l.map(escaparCsv).join(";")).join("\r\n");
    baixarArquivo(new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" }), `${nomeArquivo}.csv`);
  }
  modalExportarFundo.hidden = true;
  mostrarToast("Arquivo exportado", false);
}

document.getElementById("botaoExportar").addEventListener("click", () => {
  modalExportarFundo.hidden = false;
});
document.getElementById("botaoCancelarExportar").addEventListener("click", () => {
  modalExportarFundo.hidden = true;
});
document.getElementById("botaoConfirmarExportar").addEventListener("click", exportar);

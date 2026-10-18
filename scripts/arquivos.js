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

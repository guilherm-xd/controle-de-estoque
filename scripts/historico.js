const botaoHistorico = document.getElementById("botaoHistorico");
const modalHistoricoFundo = document.getElementById("modalHistoricoFundo");
const listaHistorico = document.getElementById("listaHistorico");
const botaoFecharHistorico = document.getElementById("botaoFecharHistorico");

function fecharHistorico() {
  modalHistoricoFundo.hidden = true;
}

function abrirHistorico() {
  modalHistoricoFundo.hidden = false;
}

botaoHistorico.addEventListener("click", abrirHistorico);
botaoFecharHistorico.addEventListener("click", fecharHistorico);

document.addEventListener("keydown", function (evento) {
  if (evento.key === "Escape") {
    fecharHistorico();
  }
});

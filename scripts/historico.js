const botaoHistorico = document.getElementById("botaoHistorico");
const modalHistoricoFundo = document.getElementById("modalHistoricoFundo");
const listaHistorico = document.getElementById("listaHistorico");
const botaoFecharHistorico = document.getElementById("botaoFecharHistorico");

function fecharHistorico() {
  modalHistoricoFundo.hidden = true;
}

function abrirHistorico() {
  const itens = estoqueAtivo().historico || [];
  listaHistorico.innerHTML = "";

  if (itens.length === 0) {
    const vazio = document.createElement("li");
    vazio.className = "historicoVazio";
    vazio.textContent = "Nenhuma movimentação registrada ainda.";
    listaHistorico.appendChild(vazio);
  }

  itens.forEach((item) => {
    const li = document.createElement("li");
    const hora = document.createElement("time");
    const texto = document.createElement("span");
    hora.textContent = new Date(item.data).toLocaleString("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    });
    texto.textContent = item.texto;
    li.append(hora, texto);
    listaHistorico.appendChild(li);
  });

  modalHistoricoFundo.hidden = false;
}

botaoHistorico.addEventListener("click", abrirHistorico);
botaoFecharHistorico.addEventListener("click", fecharHistorico);

modalHistoricoFundo.addEventListener("click", function (evento) {
  if (evento.target === modalHistoricoFundo) {
    fecharHistorico();
  }
});

document.addEventListener("keydown", function (evento) {
  if (evento.key === "Escape") {
    fecharHistorico();
  }
});

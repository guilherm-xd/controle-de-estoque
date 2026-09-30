const modalHistoricoFundo = document.getElementById('modalHistoricoFundo');
const listaHistorico = document.getElementById('listaHistorico');

function abrirHistorico() {
  const itens = estoqueAtivo().historico || [];
  listaHistorico.innerHTML = '';

  if (itens.length === 0) {
    const vazio = document.createElement('li');
    vazio.className = 'historicoVazio';
    vazio.textContent = 'Nenhuma movimentação registrada ainda.';
    listaHistorico.appendChild(vazio);
  }

  itens.forEach(item => {
    const li = document.createElement('li');
    const hora = document.createElement('time');
    const texto = document.createElement('span');
    hora.textContent = new Date(item.quando).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
    texto.textContent = item.texto;
    li.append(hora, texto);
    listaHistorico.appendChild(li);
  });

  modalHistoricoFundo.hidden = false;
}

function fecharHistorico() {
  modalHistoricoFundo.hidden = true;
}

document.getElementById('botaoHistorico').addEventListener('click', abrirHistorico);
document.getElementById('botaoFecharHistorico').addEventListener('click', fecharHistorico);
modalHistoricoFundo.addEventListener('click', evento => {
  if (evento.target === modalHistoricoFundo) fecharHistorico();
});
document.addEventListener('keydown', evento => {
  if (evento.key === 'Escape') fecharHistorico();
});

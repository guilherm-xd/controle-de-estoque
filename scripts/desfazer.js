function restaurarEstado(estado) {
  const dados = JSON.parse(estado.foto);
  const historicos = {};
  estoques.forEach(e => { historicos[e.id] = e.historico; });

  restaurando = true;
  estoques = dados.estoques.map(e => ({ ...e, historico: historicos[e.id] || [] }));
  proximoIdEstoque = dados.proximoIdEstoque;
  estoqueAtivoId = estoques.some(e => e.id === estado.ativo) ? estado.ativo : estoques[0].id;
  carregarEstoqueAtivo();
  restaurando = false;
}

function desfazer() {
  if (pilhaDesfazer.length === 0) {
    mostrarToast('Nada para desfazer', false);
    return;
  }
  pilhaRefazer.push(ultimoEstado);
  restaurarEstado(pilhaDesfazer.pop());
  mostrarToast('Ação desfeita (Ctrl+Y para refazer)', false);
}

function refazer() {
  if (pilhaRefazer.length === 0) {
    mostrarToast('Nada para refazer', false);
    return;
  }
  pilhaDesfazer.push(ultimoEstado);
  restaurarEstado(pilhaRefazer.pop());
  mostrarToast('Ação refeita', false);
}

document.addEventListener('keydown', evento => {
  if (!(evento.ctrlKey || evento.metaKey)) return;
  if (evento.target.closest('input, textarea, select, [contenteditable="true"]')) return;

  const tecla = evento.key.toLowerCase();
  if (tecla === 'z' && !evento.shiftKey) {
    evento.preventDefault();
    desfazer();
  } else if (tecla === 'y' || (tecla === 'z' && evento.shiftKey)) {
    evento.preventDefault();
    refazer();
  }
});

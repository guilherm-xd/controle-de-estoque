formularioProduto.addEventListener('submit', evento => {
  evento.preventDefault();

  const nomeNovo = campoNome.value.trim();
  produtos.push({
    id: proximoId++,
    nome: nomeNovo,
    categoria: campoCategoria.value.trim(),
    quantidade: Number(campoQuantidade.value),
    preco: Number(campoPreco.value) || 0
  });

  formularioProduto.reset();
  campoNome.focus();
  atualizarTela();
  mostrarToast(`"${nomeNovo}" adicionado ao estoque`);
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
  registrarHistorico(`"${ultimoRemovido.produto.nome}" removido`);
  mostrarAvisoDesfazer();
}

let ultimoRemovido = null;
let timerAviso;

const aviso = document.createElement('div');
aviso.className = 'avisoDesfazer';
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
  registrarHistorico(`"${produto.nome}" restaurado`);
});

function abrirEdicao(id) {
  const produto = produtos.find(p => p.id === id);

  editarId.value = produto.id;
  editarNome.value = produto.nome;
  editarCategoria.value = produto.categoria;
  editarQuantidade.value = produto.quantidade;
  editarPreco.value = produto.preco;

  modalEditarFundo.hidden = false;
  editarNome.focus();
}

function fecharEdicao() {
  modalEditarFundo.hidden = true;
}

formularioEditarProduto.addEventListener('submit', evento => {
  evento.preventDefault();
  const id = Number(editarId.value);

  produtos = produtos.map(p => {
    if (p.id !== id) return p;

    const novoPreco = Number(editarPreco.value);
    const atualizado = {
      ...p,
      nome: editarNome.value.trim(),
      categoria: editarCategoria.value.trim(),
      quantidade: Number(editarQuantidade.value),
      preco: novoPreco
    };

    if (novoPreco !== p.preco) {
      delete atualizado.precoOriginal;
      delete atualizado.desconto;
    }
    return atualizado;
  });

  fecharEdicao();
  atualizarTela();
  mostrarToast('Produto atualizado');
});

botaoCancelarEdicao.addEventListener('click', fecharEdicao);

modalEditarFundo.addEventListener('click', evento => {
  if (evento.target === modalEditarFundo) modalEditarFundo.hidden = true;
});

document.addEventListener('keydown', evento => {
  if (evento.key === 'Escape') {
    modalEditarFundo.hidden = true;
  }
});

listaProdutos.addEventListener('click', evento => {
  const botao = evento.target.closest('button[data-acao]');
  if (!botao) return;

  const id = Number(botao.dataset.id);
  if (botao.dataset.acao === 'editar') abrirEdicao(id);
  if (botao.dataset.acao === 'remover') removerProduto(id);
  if (botao.dataset.acao === 'transferir') abrirTransferencia(id);
  if (botao.dataset.acao === 'tirarDesconto') {
    produtos = produtos.map(p => p.id === id ? tirarDesconto(p) : p);
    atualizarTela();
    mostrarToast('Desconto removido');
  }
  if (botao.dataset.acao === 'mais' || botao.dataset.acao === 'menos') {
    const produto = produtos.find(p => p.id === id);
    const antes = produto.quantidade;
    produto.quantidade = Math.max(0, produto.quantidade + (botao.dataset.acao === 'mais' ? 1 : -1));
    atualizarTela();
    registrarHistorico(`${produto.nome}: quantidade ${antes} → ${produto.quantidade}`);
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
  modalTransferirFundo.hidden = false;
}

document.getElementById('botaoCancelarTransferir').addEventListener('click', () => {
  modalTransferirFundo.hidden = true;
});

document.getElementById('botaoConfirmarTransferir').addEventListener('click', () => {
  const destino = estoques.find(e => e.id === Number(transferirDestino.value));
  const produto = produtos.find(p => p.id === idTransferindo);
  if (!destino || !produto) return;

  destino.produtos.push({ ...produto, id: destino.proximoId++ });
  produtos = produtos.filter(p => p.id !== idTransferindo);
  modalTransferirFundo.hidden = true;
  atualizarTela();
  mostrarToast(`"${produto.nome}" movido para ${destino.nome}`);
});

const EXEMPLOS = [
  ['Caixa de parafusos', 'Ferragens', 42, 24.9],
  ['Martelo 500g', 'Ferramentas', 3, 39.9],
  ['Furadeira de impacto', 'Ferramentas', 8, 289],
  ['Fita isolante', 'Elétrica', 2, 6.5],
  ['Lâmpada LED 9W', 'Elétrica', 60, 12.9],
  ['Tinta branca 3,6L', 'Pintura', 14, 118],
  ['Rolo de pintura', 'Pintura', 0, 15.9],
  ['Luva de proteção', 'Segurança', 25, 9.9],
  ['Capacete', 'Segurança', 4, 34.5],
  ['Trena 5m', 'Ferramentas', 19, 22]
];

botaoExemplo.addEventListener('click', () => {
  EXEMPLOS.forEach(([nome, categoria, quantidade, preco]) => {
    produtos.push({ id: proximoId++, nome, categoria, quantidade, preco });
  });
  atualizarTela();
  animarEntrada();
  mostrarToast(`${EXEMPLOS.length} produtos de exemplo carregados`);
});

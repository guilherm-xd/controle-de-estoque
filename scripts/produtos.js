const formularioProduto = document.getElementById("formularioProduto");
const campoNome = document.getElementById("campoNome");
const campoCategoria = document.getElementById("campoCategoria");
const campoQuantidade = document.getElementById("campoQuantidade");
const campoPreco = document.getElementById("campoPreco");

const cabecalhosOrdenaveis = document.querySelectorAll("th[data-campo]");

const modalEditarFundo = document.getElementById("modalEditarFundo");
const formularioEditarProduto = document.getElementById(
  "formularioEditarProduto",
);
const editarId = document.getElementById("editarId");
const editarNome = document.getElementById("editarNome");
const editarCategoria = document.getElementById("editarCategoria");
const editarQuantidade = document.getElementById("editarQuantidade");
const editarPreco = document.getElementById("editarPreco");
const botaoCancelarEdicao = document.getElementById("botaoCancelarEdicao");

const modalTransferirFundo = document.getElementById("modalTransferirFundo");
const transferirDestino = document.getElementById("transferirDestino");
const botaoCancelarTransferir = document.getElementById(
  "botaoCancelarTransferir",
);
const botaoConfirmarTransferir = document.getElementById(
  "botaoConfirmarTransferir",
);

const botaoExemplo = document.getElementById("botaoExemplo");

let ultimoRemovido = null;
let timerAviso;

const aviso = document.createElement("div");
aviso.className = "avisoDesfazer";
aviso.hidden = true;
aviso.innerHTML = '<span></span><button type="button">Desfazer</button>';
document.body.appendChild(aviso);

const listaExemplos = [
  ["Caixa de parafusos", "Ferragens", 42, 24.9],
  ["Martelo 500g", "Ferramentas", 3, 39.9],
  ["Furadeira de impacto", "Ferramentas", 8, 289],
  ["Fita isolante", "Elétrica", 2, 6.5],
  ["Lâmpada LED 9W", "Elétrica", 60, 12.9],
  ["Tinta branca 3,6L", "Pintura", 14, 118],
  ["Rolo de pintura", "Pintura", 0, 15.9],
  ["Luva de proteção", "Segurança", 25, 9.9],
  ["Capacete", "Segurança", 4, 34.5],
  ["Trena 5m", "Ferramentas", 19, 22],
];

formularioProduto.addEventListener("submit", (fazer) => {
  fazer.preventDefault();
  const campoNomes = campoNome.value.trim();
  produtos.push({
    id: proximoId++,
    nome: campoNomes,
    categoria: campoCategoria.value.trim(),
    quantidade: Number(campoQuantidade.value),
    preco: Number(campoPreco.value) || 0,
  });
  formularioProduto.reset();
  campoNome.focus();
  atualizarTela();
  mostrarToast('"' + campoNomes + '" ' + "adicionado ao estoque");
});

function esconderAviso() {
  clearTimeout(timerAviso);
  aviso.hidden = true;
}

function mostrarAvisoDesfazer() {
  aviso.querySelector("span").textContent =
    '"' + ultimoRemovido.produto.nome + '" removido';
  aviso.hidden = false;
  clearTimeout(timerAviso);
  timerAviso = setTimeout(esconderAviso, 6000);
}

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
  const indice = produtos.findIndex((produto) => produto.id === id);
  ultimoRemovido = {
    produto: produtos[indice],
    indice: indice,
    estoqueId: estoqueAtivoId,
  };
  produtos = produtos.filter((produto) => produto.id !== id);
  registrarHistorico('"' + ultimoRemovido.produto.nome + '" removido');
  atualizarTela();
  mostrarAvisoDesfazer();
}

aviso.querySelector("button").addEventListener("click", () => {
  if (ultimoRemovido === null) {
    return;
  }
  const produto = ultimoRemovido.produto;
  const indice = ultimoRemovido.indice;
  const estoqueId = ultimoRemovido.estoqueId;
  ultimoRemovido = null;
  esconderAviso();

  if (!estoques.some((e) => e.id === estoqueId)) {
    return;
  }
  if (estoqueId !== estoqueAtivoId) {
    trocarEstoque(estoqueId);
  }
  produtos.splice(indice, 0, produto);
  registrarHistorico('"' + produto.nome + '" restaurado');
  atualizarTela();
});

function abrirEdicao(id) {
  const produtoEditado = produtos.find((produto) => produto.id === id);

  editarId.value = produtoEditado.id;
  editarNome.value = produtoEditado.nome;
  editarCategoria.value = produtoEditado.categoria;
  editarQuantidade.value = produtoEditado.quantidade;
  editarPreco.value = produtoEditado.preco;

  modalEditarFundo.hidden = false;
  editarNome.focus();
}

function fecharEdicao() {
  modalEditarFundo.hidden = true;
}

formularioEditarProduto.addEventListener("submit", (evento) => {
  evento.preventDefault();
  const id = Number(editarId.value);

  produtos = produtos.map((produto) => {
    if (produto.id !== id) {
      return produto;
    }
    const novoPreco = Number(editarPreco.value);
    const atualizado = {
      ...produto,
      nome: editarNome.value.trim(),
      categoria: editarCategoria.value.trim(),
      quantidade: Number(editarQuantidade.value),
      preco: novoPreco,
    };
    if (novoPreco !== produto.preco) {
      delete atualizado.precoOriginal;
      delete atualizado.desconto;
    }
    return atualizado;
  });

  fecharEdicao();
  atualizarTela();
  mostrarToast("Produto atualizado");
});

botaoCancelarEdicao.addEventListener("click", fecharEdicao);

modalEditarFundo.addEventListener("click", (evento) => {
  if (evento.target === modalEditarFundo) {
    fecharEdicao();
  }
});

document.addEventListener("keydown", (evento) => {
  if (evento.key === "Escape") {
    fecharEdicao();
    modalTransferirFundo.hidden = true;
  }
});

function abrirTransferencia(id) {
  idTransferindo = id;
  transferirDestino.innerHTML = "";
  estoques
    .filter((e) => e.id !== estoqueAtivoId)
    .forEach((e) => {
      transferirDestino.appendChild(new Option(e.nome, e.id));
    });
  modalTransferirFundo.hidden = false;
}

botaoCancelarTransferir.addEventListener("click", () => {
  modalTransferirFundo.hidden = true;
});

botaoConfirmarTransferir.addEventListener("click", () => {
  const destino = estoques.find(
    (e) => e.id === Number(transferirDestino.value),
  );
  const produtoMovido = produtos.find((produto) => produto.id === idTransferindo);
  if (!destino || !produtoMovido) {
    return;
  }

  destino.produtos.push({ ...produtoMovido, id: destino.proximoId++ });
  produtos = produtos.filter((produto) => produto.id !== idTransferindo);
  modalTransferirFundo.hidden = true;
  atualizarTela();
  mostrarToast('"' + produtoMovido.nome + '" movido para ' + destino.nome);
});

listaProdutos.addEventListener("click", (evento) => {
  const botaoClicado = evento.target.closest("button[data-acao]");
  if (!botaoClicado) {
    return;
  }
  const idBotaoClicado = Number(botaoClicado.dataset.id);

  if (botaoClicado.dataset.acao === "editar") {
    abrirEdicao(idBotaoClicado);
  }
  if (botaoClicado.dataset.acao === "remover") {
    removerProduto(idBotaoClicado);
  }
  if (botaoClicado.dataset.acao === "transferir") {
    abrirTransferencia(idBotaoClicado);
  }
  if (botaoClicado.dataset.acao === "tirarDesconto") {
    produtos = produtos.map((produto) => {
      if (produto.id === idBotaoClicado) {
        return tirarDesconto(produto);
      }
      return produto;
    });
    atualizarTela();
    mostrarToast("Desconto removido");
  }
  if (botaoClicado.dataset.acao === "mais") {
    const produtoClicado = produtos.find(
      (produto) => produto.id === idBotaoClicado,
    );
    const antes = produtoClicado.quantidade;
    produtoClicado.quantidade = produtoClicado.quantidade + 1;
    registrarHistorico(
      produtoClicado.nome +
        ": quantidade " +
        antes +
        " → " +
        produtoClicado.quantidade,
    );
    atualizarTela();
  }
  if (botaoClicado.dataset.acao === "menos") {
    const produtoClicado = produtos.find(
      (produto) => produto.id === idBotaoClicado,
    );
    const antes = produtoClicado.quantidade;
    produtoClicado.quantidade = Math.max(0, produtoClicado.quantidade - 1);
    registrarHistorico(
      produtoClicado.nome +
        ": quantidade " +
        antes +
        " → " +
        produtoClicado.quantidade,
    );
    atualizarTela();
  }
});

cabecalhosOrdenaveis.forEach((th) => {
  th.addEventListener("click", () => {
    const campo = th.dataset.campo;
    if (ordem.campo === campo) {
      ordem = { campo: campo, dir: -ordem.dir };
    } else {
      ordem = { campo: campo, dir: 1 };
    }
    cabecalhosOrdenaveis.forEach((outro) => {
      delete outro.dataset.dir;
    });
    th.dataset.dir = ordem.dir;
    renderizarLista();
  });
});

botaoExemplo.addEventListener("click", () => {
  listaExemplos.forEach((exemplo) => {
    produtos.push({
      id: proximoId++,
      nome: exemplo[0],
      categoria: exemplo[1],
      quantidade: exemplo[2],
      preco: exemplo[3],
    });
  });
  atualizarTela();
  mostrarToast(listaExemplos.length + " produtos de exemplo carregados");
});

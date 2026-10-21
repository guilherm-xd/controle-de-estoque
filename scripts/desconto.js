const botaoDesconto = document.getElementById("botaoDesconto");
const campoDesconto = document.getElementById("campoDesconto");
const resumoDesconto = document.getElementById("resumoDesconto");

const opcoesAlvoDesconto = document.querySelectorAll(
  'input[name="alvoDesconto"]',
);
const campoAlvoCategoria = document.getElementById("campoAlvoCategoria");
const seletorCategoriaDesconto = document.getElementById(
  "seletorCategoriaDesconto",
);

const botaoMarcarTodos = document.getElementById("botaoMarcarTodos");
const botaoAplicarDesconto = document.getElementById("botaoAplicarDesconto");
const botaoCancelarDesconto = document.getElementById("botaoCancelarDesconto");

function alvoDesconto() {
  return document.querySelector('input[name="alvoDesconto"]:checked').value;
}

function modoSelecao() {
  return !barraDesconto.hidden && alvoDesconto() === "selecionados";
}

function criarCaixaMarcar(id) {
  const caixa = document.createElement("input");
  caixa.type = "checkbox";
  caixa.className = "caixaMarcar";
  caixa.dataset.id = id;
  caixa.checked = idsMarcados.has(id);
  caixa.setAttribute("aria-label", "Selecionar para o desconto");
  return caixa;
}

function entraNoDesconto(produto) {
  const alvo = alvoDesconto();
  if (alvo === "selecionados") {
    return idsMarcados.has(produto.id);
  }
  if (alvo === "categoria") {
    return produto.categoria === seletorCategoriaDesconto.value;
  }
  return true;
}

function preencherCategoriasDesconto() {
  const anterior = seletorCategoriaDesconto.value;
  const categorias = [...new Set(produtos.map((produto) => produto.categoria))];
  categorias.sort((a, b) => a.localeCompare(b, "pt-BR"));

  seletorCategoriaDesconto.innerHTML = "";
  categorias.forEach((categoria) => {
    seletorCategoriaDesconto.appendChild(
      new Option(categoria || "Sem categoria", categoria),
    );
  });

  if (categorias.includes(anterior)) {
    seletorCategoriaDesconto.value = anterior;
  }
}

function atualizarBarraDesconto() {
  const alvo = alvoDesconto();
  const quantos = produtos.filter(entraNoDesconto).length;

  preencherCategoriasDesconto();
  campoAlvoCategoria.hidden = alvo !== "categoria";
  botaoMarcarTodos.hidden = alvo !== "selecionados";

  const visiveis = filtrarProdutos();
  const todosMarcados =
    visiveis.length > 0 && visiveis.every((p) => idsMarcados.has(p.id));
  if (todosMarcados) {
    botaoMarcarTodos.textContent = "Desmarcar todos";
  } else {
    botaoMarcarTodos.textContent = "Marcar todos";
  }

  if (quantos === 1) {
    resumoDesconto.textContent = "1 item será alterado";
  } else {
    resumoDesconto.textContent = quantos + " itens serão alterados";
  }
}

function reiniciarDesconto() {
  barraDesconto.hidden = true;
  botaoDesconto.setAttribute("aria-pressed", "false");
  idsMarcados.clear();
  campoDesconto.value = "";
  opcoesAlvoDesconto[0].checked = true;
}

function abrirBarraDesconto() {
  barraDesconto.hidden = false;
  botaoDesconto.setAttribute("aria-pressed", "true");
  atualizarBarraDesconto();
  renderizarLista();
  campoDesconto.focus();
}

function fecharBarraDesconto() {
  reiniciarDesconto();
  renderizarLista();
}

function aplicarDesconto() {
  const valorCampoDesconto = Number(campoDesconto.value);
  const alvo = alvoDesconto();

  if (!(valorCampoDesconto > 0 && valorCampoDesconto <= 100)) {
    resumoDesconto.textContent = "Informe um desconto entre 0,01% e 100%";
    campoDesconto.focus();
    return;
  }

  produtos = produtos.map((produto) => {
    const precoBase = produto.precoOriginal || produto.preco;
    return {
      ...produto,
      precoOriginal: precoBase,
      desconto: valorCampoDesconto,
      preco: Number((precoBase * (1 - valorCampoDesconto / 100)).toFixed(2)),
    };
  });

  barraDesconto.hidden = true;
  campoDesconto.value = "";
  atualizarTela();
  mostrarToast(
    "Desconto de " +
      formatarPercentual(valorCampoDesconto) +
      "% aplicado em " +
      produtos.length +
      " itens",
  );
}

botaoAplicarDesconto.addEventListener("click", aplicarDesconto);



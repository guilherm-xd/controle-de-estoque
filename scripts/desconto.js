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

botaoDesconto.addEventListener("click", () => {
  barraDesconto.hidden = false;
  campoDesconto.focus();
});

botaoCancelarDesconto.addEventListener("click", () => {
  barraDesconto.hidden = true;
});

function aplicarDesconto() {
  const valorCampoDesconto = Number(campoDesconto.value);

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



const linkTema = document.getElementById("linkTema");

let botaoTema = null;
let menuTema = null;
let nomeTema = null;
let amostraTema = null;
let listaTemas = null;
let grupoModo = null;
let botoesModo = null;
let grupoCores = null;
let botaoPersonalizada = null;
let amostraPersonalizada = null;
let campoCorPersonalizada = null;
let botaoFavoritar = null;

function ligarElementos() {
  botaoTema = document.getElementById("botaoTema");
  menuTema = document.getElementById("menuTema");
  nomeTema = document.getElementById("nomeTema");
  amostraTema = document.getElementById("amostraTema");
  listaTemas = document.getElementById("listaTemas");
  grupoModo = document.getElementById("grupoModo");
  botoesModo = document.querySelectorAll("[data-modo]");
  grupoCores = document.getElementById("grupoCores");
  botaoPersonalizada = document.getElementById("botaoPersonalizada");
  amostraPersonalizada = document.getElementById("amostraPersonalizada");
  campoCorPersonalizada = document.getElementById("campoCorPersonalizada");
  botaoFavoritar = document.getElementById("botaoFavoritar");
}

document.addEventListener("DOMContentLoaded", ligarElementos);
function aplicarTema(tema) {
  if (!temas[tema]) tema = "classico";
  limparPaleta();
  document.getElementById("linkTema").href = "styles/tema-" + tema + ".css";
  estadoTema = { tema: tema, paleta: null };
  guardar("tema-escolhido", tema);
  guardar("paleta-modo", null);
  guardar("paleta-cor", null);
  atualizarMenuTema();
}

function aplicarPaleta(modo, cor, hex) {
  if (!modosPaleta[modo] || !coresPaleta[cor]) return;
  let personalizada = cor === "personalizada";
  if (personalizada) {
    hex = hex || lerHexPersonalizado();
    ajustarPersonalizada(hex);
  }
  limparPaleta();
  definirVars(calcularPaleta(modo, cor));
  estadoTema.paleta = { modo: modo, cor: cor, hex: personalizada ? hex : undefined };
  guardar("paleta-modo", modo);
  guardar("paleta-cor", cor);
  guardar("paleta-hex", personalizada ? hex : null);
  atualizarMenuTema();
}

function lerFavoritos() {
  const lista = JSON.parse(localStorage.getItem("temas-favoritos"));
  if (!Array.isArray(lista)) {
    return [];
  }
  return lista.filter(function (f) {
    return (
      temas[f.tema] &&
      modosPaleta[f.modo] &&
      coresPaleta[f.cor] &&
      (f.cor !== "personalizada" || /^#[0-9a-f]{6}$/i.test(f.hex || ""))
    );
  });
}

function salvarFavoritos(lista) {
  guardar("temas-favoritos", JSON.stringify(lista));
}

function mesmoFavorito(a, b) {
  return a.tema === b.tema && a.modo === b.modo && a.cor === b.cor && a.hex === b.hex;
}

function favoritoAtual() {
  let paleta = estadoTema.paleta;
  return paleta
    ? { tema: estadoTema.tema, modo: paleta.modo, cor: paleta.cor, hex: paleta.hex }
    : null;
}

function nomeFavorito(f) {
  let nome = modosPaleta[f.modo].nome + " · " + coresPaleta[f.cor].nome + (f.hex ? " " + f.hex : "");
  return f.tema === "classico" ? nome : nome + " · " + temas[f.tema].nome;
}

function alternarFavorito() {
  let atual = favoritoAtual();
  if (!atual) return;
  let lista = lerFavoritos();
  let existe = lista.some(function (f) {
    return mesmoFavorito(f, atual);
  });
  salvarFavoritos(
    existe
      ? lista.filter(function (f) {
          return !mesmoFavorito(f, atual);
        })
      : lista.concat(atual),
  );
  atualizarMenuTema();
}

function aplicarFavorito(f) {
  aplicarTema(f.tema);
  aplicarPaleta(f.modo, f.cor, f.hex);
}

function criarLinhaTema(
  rotulo,
  corAmostra,
  atributo,
  valor,
  pressionado,
  indiceRemover,
) {
  let linha = document.createElement("div");
  let botao = document.createElement("button");
  let amostra = document.createElement("span");
  let texto = document.createElement("span");

  linha.className = "linhaTema";
  botao.type = "button";
  botao.className = "itemTema";
  botao.dataset[atributo] = valor;
  botao.setAttribute("aria-pressed", pressionado);
  amostra.className = "amostraTema";
  amostra.style.background = corAmostra;
  texto.textContent = rotulo;
  botao.append(amostra, texto);
  linha.appendChild(botao);

  if (indiceRemover !== undefined) {
    let remover = document.createElement("button");
    remover.type = "button";
    remover.className = "removerFavorito";
    remover.dataset.remover = indiceRemover;
    remover.textContent = "×";
    remover.title = "Remover dos favoritos";
    remover.setAttribute("aria-label", "Remover dos favoritos");
    linha.appendChild(remover);
  }
  return linha;
}

function atualizarMenuTema() {
  let nome = document.getElementById("nomeTema");
  if (!nome) return;
  let paleta = estadoTema.paleta;
  let atual = favoritoAtual();
  let favoritos = lerFavoritos();
  let lista = document.getElementById("listaTemas");
  let cor = paleta
    ? coresPaleta[paleta.cor].acento
    : temas[estadoTema.tema].cor;

  nome.textContent = atual ? nomeFavorito(atual) : temas[estadoTema.tema].nome;
  document.getElementById("amostraTema").style.background = cor;

  lista.innerHTML = "";
  Object.keys(temas).forEach(function (chave) {
    lista.appendChild(
      criarLinhaTema(
        temas[chave].nome,
        temas[chave].cor,
        "tema",
        chave,
        !paleta && chave === estadoTema.tema,
      ),
    );
  });
  favoritos.forEach(function (f, i) {
    lista.appendChild(
      criarLinhaTema(
        nomeFavorito(f),
        (f.hex || coresPaleta[f.cor].acento),
        "favorito",
        i,
        !!atual && mesmoFavorito(f, atual),
        i,
      ),
    );
  });

  document.querySelectorAll("[data-modo]").forEach(function (botao) {
    botao.setAttribute(
      "aria-pressed",
      !!paleta && botao.dataset.modo === paleta.modo,
    );
  });
  document.querySelectorAll("[data-cor]").forEach(function (botao) {
    botao.setAttribute(
      "aria-pressed",
      !!paleta && botao.dataset.cor === paleta.cor,
    );
  });

  let botaoPers = document.getElementById("botaoPersonalizada");
  let ehPers = !!paleta && paleta.cor === "personalizada";
  botaoPers.setAttribute("aria-pressed", ehPers);
  document.getElementById("amostraPersonalizada").style.background = ehPers
    ? coresPaleta.personalizada.acento
    : "conic-gradient(#e53935, #f0c94a, #32b85f, #18b9d2, #3344ff, #8833ff, #e53935)";

  let botaoFavoritar = document.getElementById("botaoFavoritar");
  let jaFavorito =
    !!atual &&
    favoritos.some(function (f) {
      return mesmoFavorito(f, atual);
    });
  botaoFavoritar.hidden = !paleta;
  botaoFavoritar.textContent = jaFavorito
    ? "★ Remover dos favoritos"
    : "☆ Favoritar este tema";
}

function montarMenuTema() {
  let botaoMenu = document.getElementById("botaoTema");
  let menu = document.getElementById("menuTema");
  let listaTemas = document.getElementById("listaTemas");
  let grupoModo = document.getElementById("grupoModo");
  let grupoCores = document.getElementById("grupoCores");
  let modoAtual = "escuro";

  ordemPaletas.forEach(function (cor) {
    let botao = document.createElement("button");
    botao.type = "button";
    botao.className = "opcaoCor";
    botao.dataset.cor = cor;
    botao.title = coresPaleta[cor].nome;
    botao.setAttribute("aria-label", coresPaleta[cor].nome);
    botao.style.background = coresPaleta[cor].acento;
    grupoCores.appendChild(botao);
  });

  function fechar() {
    menu.hidden = true;
    botaoMenu.setAttribute("aria-expanded", "false");
  }

  botaoMenu.addEventListener("click", function () {
    let abrir = menu.hidden;
    menu.hidden = !abrir;
    botaoMenu.setAttribute("aria-expanded", String(abrir));
  });

  listaTemas.addEventListener("click", function (evento) {
    let remover = evento.target.closest("[data-remover]");
    if (remover) {
      let favoritos = lerFavoritos();
      favoritos.splice(Number(remover.dataset.remover), 1);
      salvarFavoritos(favoritos);
      atualizarMenuTema();
      return;
    }
    let favorito = evento.target.closest("[data-favorito]");
    if (favorito) {
      aplicarFavorito(lerFavoritos()[Number(favorito.dataset.favorito)]);
      fechar();
      return;
    }
    let botao = evento.target.closest("[data-tema]");
    if (!botao) return;
    aplicarTema(botao.dataset.tema);
    fechar();
  });

  let campoCor = document.getElementById("campoCorPersonalizada");
  document
    .getElementById("botaoPersonalizada")
    .addEventListener("click", function () {
      let p = estadoTema.paleta;
      campoCor.value = p ? coresPaleta[p.cor].acento : lerHexPersonalizado();
      if (campoCor.showPicker) campoCor.showPicker();
      else campoCor.click();
    });
  campoCor.addEventListener("input", function () {
    let modo = estadoTema.paleta ? estadoTema.paleta.modo : modoAtual;
    aplicarPaleta(modo, "personalizada", campoCor.value);
  });

  document
    .getElementById("botaoFavoritar")
    .addEventListener("click", alternarFavorito);

  grupoModo.addEventListener("click", function (evento) {
    var botao = evento.target.closest("[data-modo]");
    if (!botao) return;
    modoAtual = botao.dataset.modo;
    var cor = estadoTema.paleta ? estadoTema.paleta.cor : "verde";
    aplicarPaleta(modoAtual, cor);
  });

  grupoCores.addEventListener("click", function (evento) {
    var botao = evento.target.closest("[data-cor]");
    if (!botao) return;
    var modo = estadoTema.paleta ? estadoTema.paleta.modo : modoAtual;
    aplicarPaleta(modo, botao.dataset.cor);
  });

  document.addEventListener("click", function (evento) {
    if (!evento.target.closest("#seletorTema")) fechar();
  });

  document.addEventListener("keydown", function (evento) {
    if (evento.key === "Escape") fechar();
  });

  atualizarMenuTema();
}

function carregarTema() {
  var tema = localStorage.getItem("tema-escolhido");
  var modo = localStorage.getItem("paleta-modo");
  var cor = localStorage.getItem("paleta-cor");

  if (!tema && !modo && !cor) {
    modo = "escuro";
    cor = "abismo";
  }

  if (TEMAS[tema]) {
    document.getElementById("linkTema").href = "styles/tema-" + tema + ".css";
    estadoTema.tema = tema;
  }
  if (MODOS_PALETA[modo] && PALETAS_CORES[cor]) {
    var hex;
    if (cor === "personalizada") {
      hex = lerHexPersonalizado();
      ajustarPersonalizada(hex);
    }
    definirVars(calcularPaleta(modo, cor));
    estadoTema.paleta = { modo: modo, cor: cor, hex: hex };
  }
}

carregarTema();
document.addEventListener("DOMContentLoaded", montarMenuTema);

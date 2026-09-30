function aplicarTema(tema) {
  if (!TEMAS[tema]) tema = "classico";
  limparPaleta();
  document.getElementById("linkTema").href = "styles/tema-" + tema + ".css";
  estadoTema = { tema: tema, paleta: null };
  guardar("tema-escolhido", tema);
  guardar("paleta-modo", null);
  guardar("paleta-cor", null);
  atualizarMenuTema();
}

function aplicarPaleta(modo, cor, hex) {
  if (!MODOS_PALETA[modo] || !PALETAS_CORES[cor]) return;
  var personalizada = cor === "personalizada";
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
  try {
    var lista = JSON.parse(localStorage.getItem("temas-favoritos"));
    if (!Array.isArray(lista)) return [];
    return lista.filter(function (f) {
      return (
        TEMAS[f.tema] &&
        MODOS_PALETA[f.modo] &&
        PALETAS_CORES[f.cor] &&
        (f.cor !== "personalizada" || /^#[0-9a-f]{6}$/i.test(f.hex || ""))
      );
    });
  } catch (erro) {
    return [];
  }
}

function salvarFavoritos(lista) {
  guardar("temas-favoritos", JSON.stringify(lista));
}

function mesmoFavorito(a, b) {
  return a.tema === b.tema && a.modo === b.modo && a.cor === b.cor && a.hex === b.hex;
}

function favoritoAtual() {
  var paleta = estadoTema.paleta;
  return paleta
    ? { tema: estadoTema.tema, modo: paleta.modo, cor: paleta.cor, hex: paleta.hex }
    : null;
}

function nomeFavorito(f) {
  var nome = MODOS_PALETA[f.modo].nome + " · " + PALETAS_CORES[f.cor].nome + (f.hex ? " " + f.hex : "");
  return f.tema === "classico" ? nome : nome + " · " + TEMAS[f.tema].nome;
}

function alternarFavorito() {
  var atual = favoritoAtual();
  if (!atual) return;
  var lista = lerFavoritos();
  var existe = lista.some(function (f) {
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
  var linha = document.createElement("div");
  var botao = document.createElement("button");
  var amostra = document.createElement("span");
  var texto = document.createElement("span");

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
    var remover = document.createElement("button");
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
  var nome = document.getElementById("nomeTema");
  if (!nome) return;
  var paleta = estadoTema.paleta;
  var atual = favoritoAtual();
  var favoritos = lerFavoritos();
  var lista = document.getElementById("listaTemas");
  var cor = paleta
    ? PALETAS_CORES[paleta.cor].acento
    : TEMAS[estadoTema.tema].cor;

  nome.textContent = atual ? nomeFavorito(atual) : TEMAS[estadoTema.tema].nome;
  document.getElementById("amostraTema").style.background = cor;

  lista.innerHTML = "";
  Object.keys(TEMAS).forEach(function (chave) {
    lista.appendChild(
      criarLinhaTema(
        TEMAS[chave].nome,
        TEMAS[chave].cor,
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
        (f.hex || PALETAS_CORES[f.cor].acento),
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

  var botaoPers = document.getElementById("botaoPersonalizada");
  var ehPers = !!paleta && paleta.cor === "personalizada";
  botaoPers.setAttribute("aria-pressed", ehPers);
  document.getElementById("amostraPersonalizada").style.background = ehPers
    ? PALETAS_CORES.personalizada.acento
    : "conic-gradient(#e53935, #f0c94a, #32b85f, #18b9d2, #3344ff, #8833ff, #e53935)";

  var botaoFavoritar = document.getElementById("botaoFavoritar");
  var jaFavorito =
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
  var botaoMenu = document.getElementById("botaoTema");
  var menu = document.getElementById("menuTema");
  var listaTemas = document.getElementById("listaTemas");
  var grupoModo = document.getElementById("grupoModo");
  var grupoCores = document.getElementById("grupoCores");
  var modoAtual = "escuro";

  ORDEM_CORES_PALETA.forEach(function (cor) {
    var botao = document.createElement("button");
    botao.type = "button";
    botao.className = "opcaoCor";
    botao.dataset.cor = cor;
    botao.title = PALETAS_CORES[cor].nome;
    botao.setAttribute("aria-label", PALETAS_CORES[cor].nome);
    botao.style.background = PALETAS_CORES[cor].acento;
    grupoCores.appendChild(botao);
  });

  function fechar() {
    menu.hidden = true;
    botaoMenu.setAttribute("aria-expanded", "false");
  }

  botaoMenu.addEventListener("click", function () {
    var abrir = menu.hidden;
    menu.hidden = !abrir;
    botaoMenu.setAttribute("aria-expanded", String(abrir));
  });

  listaTemas.addEventListener("click", function (evento) {
    var remover = evento.target.closest("[data-remover]");
    if (remover) {
      var favoritos = lerFavoritos();
      favoritos.splice(Number(remover.dataset.remover), 1);
      salvarFavoritos(favoritos);
      atualizarMenuTema();
      return;
    }
    var favorito = evento.target.closest("[data-favorito]");
    if (favorito) {
      aplicarFavorito(lerFavoritos()[Number(favorito.dataset.favorito)]);
      fechar();
      return;
    }
    var botao = evento.target.closest("[data-tema]");
    if (!botao) return;
    aplicarTema(botao.dataset.tema);
    fechar();
  });

  var campoCor = document.getElementById("campoCorPersonalizada");
  document
    .getElementById("botaoPersonalizada")
    .addEventListener("click", function () {
      var p = estadoTema.paleta;
      campoCor.value = p ? PALETAS_CORES[p.cor].acento : lerHexPersonalizado();
      if (campoCor.showPicker) campoCor.showPicker();
      else campoCor.click();
    });
  campoCor.addEventListener("input", function () {
    var modo = estadoTema.paleta ? estadoTema.paleta.modo : modoAtual;
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

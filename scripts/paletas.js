var TEMAS = {
  classico: { nome: "Clássico verde", cor: "#1f5c4f" },
  escuro: { nome: "Escuro", cor: "#2a8570" },
  vibrante: { nome: "Vibrante", cor: "#4f46e5" },
};

var MODOS_PALETA = {
  claro: { nome: "Claro", texto: "#1f2523", suave: "#5b6660" },
  escuro: { nome: "Escuro", texto: "#e6edf3", suave: "#8b949e" },
};

var PALETAS_CORES = {
  azul: { nome: "Azul", acento: "#33aaff", acentoTexto: "#cceaff", presente: "#d4a229", cursor: "#85ccff" },
  abismo: { nome: "Abismo", acento: "#3377ff", acentoTexto: "#ccddff", presente: "#d29922", cursor: "#85adff" },
  verde: { nome: "Verde", acento: "#32b85f", acentoTexto: "#d5f7df", presente: "#d9a52e", cursor: "#62d985" },
  ferrugem: { nome: "Ferrugem", acento: "#d36b2d", acentoTexto: "#ffe0c8", presente: "#c99a3e", cursor: "#ff9a5c" },
  vermelho: { nome: "Vermelho", acento: "#e53935", acentoTexto: "#ffe3e1", presente: "#e5a62a", cursor: "#ff6b66" },
  laranja: { nome: "Laranja", acento: "#f27622", acentoTexto: "#ffe2cc", presente: "#d4a52d", cursor: "#ff9b57" },
  cobalto: { nome: "Indigo", acento: "#3344ff", acentoTexto: "#ccd0ff", presente: "#d6a43a", cursor: "#858fff" },
  violeta: { nome: "Violeta", acento: "#8833ff", acentoTexto: "#e1ccff", presente: "#d7a33b", cursor: "#b885ff" },
  cinza: { nome: "Cinza", acento: "#a8b0bb", acentoTexto: "#f0f3f6", presente: "#d6a23c", cursor: "#c4ccd6" },
  rosa: { nome: "Rosa", acento: "#ff6fae", acentoTexto: "#ffe3f0", presente: "#d8a33c", cursor: "#ff96c5" },
  agua: { nome: "Ciano", acento: "#18b9d2", acentoTexto: "#d7faff", presente: "#d8a23c", cursor: "#55d7eb" },
  verdeagua: { nome: "Verde agua", acento: "#24d6ad", acentoTexto: "#d8fff5", presente: "#d7a63a", cursor: "#61edce" },
  amarelo: { nome: "Amarelo", acento: "#f0c94a", acentoTexto: "#fff2bd", presente: "#d99424", cursor: "#ffe07a" },
};

var ORDEM_CORES_PALETA = [
  "vermelho",
  "laranja",
  "amarelo",
  "verde",
  "verdeagua",
  "agua",
  "azul",
  "abismo",
  "cobalto",
  "violeta",
  "rosa",
  "cinza",
];

var PALETAS_FUNDOS = {
  escuro: {
    azul: ["#071021", "#0d1830", "#213d73", "#12213f"],
    abismo: ["#0d1117", "#161b22", "#30363d", "#21262d"],
    verde: ["#07180d", "#0d2515", "#1f512f", "#12321e"],
    ferrugem: ["#15110f", "#1c1612", "#43372f", "#241d19"],
    vermelho: ["#1b0808", "#270e0d", "#5a2421", "#321312"],
    laranja: ["#1c0d04", "#2a1408", "#5c2c13", "#371b0c"],
    cobalto: ["#0b0d24", "#11143a", "#303687", "#181d4f"],
    violeta: ["#130f1d", "#1b1528", "#302448", "#1d172b"],
    cinza: ["#101214", "#1a1d20", "#424851", "#24282d"],
    rosa: ["#1a0d14", "#25131d", "#4a2638", "#2a1722"],
    agua: ["#06171b", "#0b242a", "#1b5561", "#102f37"],
    verdeagua: ["#061814", "#0b251f", "#1b5b4c", "#10362d"],
    amarelo: ["#171308", "#211b0e", "#4a3d1d", "#292211"],
  },
};

var estadoTema = { tema: "classico", paleta: null };
var varsDaPaleta = [];

function hexParaRgb(hex) {
  var n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function misturar(a, b, t) {
  var x = hexParaRgb(a);
  var y = hexParaRgb(b);
  return (
    "#" +
    x
      .map(function (v, i) {
        return Math.round(v + (y[i] - v) * t)
          .toString(16)
          .padStart(2, "0");
      })
      .join("")
  );
}

function dessaturar(hex, t) {
  var c = hexParaRgb(hex);
  var cinza = Math.round(0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]);
  var h = cinza.toString(16).padStart(2, "0");
  return misturar(hex, "#" + h + h + h, t);
}

function luminancia(hex) {
  var c = hexParaRgb(hex).map(function (v) {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}

function textoSobre(hex) {
  return luminancia(hex) > 0.4 ? "#14181c" : "#ffffff";
}

function guardar(chave, valor) {
  try {
    if (valor === null) localStorage.removeItem(chave);
    else localStorage.setItem(chave, valor);
  } catch (erro) {}
}

function definirVars(vars) {
  var raiz = document.documentElement;
  varsDaPaleta = Object.keys(vars);
  varsDaPaleta.forEach(function (prop) {
    raiz.style.setProperty(prop, vars[prop]);
  });
}

function limparPaleta() {
  var raiz = document.documentElement;
  varsDaPaleta.forEach(function (prop) {
    raiz.style.removeProperty(prop);
  });
  raiz.style.removeProperty("color-scheme");
  varsDaPaleta = [];
}

function calcularPaleta(modo, cor) {
  var c = PALETAS_CORES[cor];
  var escuro = modo === "escuro";
  var acento = c.acento;
  var m = MODOS_PALETA[modo];
  var fundo, superficie, borda, campo, hover;

  if (escuro) {
    var f = PALETAS_FUNDOS.escuro[cor];
    fundo = f[0];
    superficie = f[1];
    borda = f[2];
    campo = f[0];
    hover = f[3];
  } else {
    fundo = misturar(acento, "#f6f6f4", 0.93);
    superficie = "#ffffff";
    borda = misturar(acento, "#d9dbd8", 0.86);
    campo = misturar(acento, "#ffffff", 0.98);
    hover = misturar(acento, "#ffffff", 0.95);
  }

  var lateral = misturar(dessaturar(acento, 0.3), "#000000", escuro ? 0.66 : 0.58);
  var perigo = escuro ? "#c93a32" : "#b3261e";
  var ok = "#39b36f";

  return {
    "--color-bg": fundo,
    "--color-surface": superficie,
    "--color-border": borda,
    "--color-field": campo,
    "--color-row-hover": hover,
    "--color-ink": m.texto,
    "--color-ink-soft": m.suave,
    "--color-primary": acento,
    "--color-on-primary": textoSobre(acento),
    "--color-primary-dark": lateral,
    "--color-primary-hover": misturar(acento, escuro ? "#ffffff" : "#000000", 0.15),
    "--color-primary-soft": misturar(acento, superficie, escuro ? 0.78 : 0.86),
    "--color-primary-text": escuro ? c.acentoTexto : misturar(acento, "#000000", 0.55),
    "--color-ok-bg": misturar(ok, superficie, escuro ? 0.8 : 0.85),
    "--color-ok-text": escuro ? "#7ee2a4" : "#1e6b3c",
    "--color-warn": escuro ? c.presente : misturar(c.presente, "#000000", 0.5),
    "--color-warn-bg": misturar(c.presente, superficie, 0.84),
    "--color-warn-border": misturar(c.presente, superficie, 0.5),
    "--color-danger": perigo,
    "--color-danger-text": escuro ? "#ff8f88" : "#b3261e",
    "--color-danger-bg": misturar(perigo, superficie, 0.86),
    "--color-danger-border": misturar(perigo, superficie, 0.55),
    "--sidebar-top": misturar(lateral, "#ffffff", 0.1),
    "--sb-text": "#f2f5f4",
    "--sb-head": "#f2f5f4",
    "--sb-legend": "#f2f5f4",
    "--sb-muted": misturar(lateral, "#ffffff", 0.78),
    "--sb-line": misturar(lateral, "#ffffff", 0.16),
    "--sb-field": misturar(lateral, "#000000", 0.28),
    "--sb-btn-border": misturar(lateral, "#ffffff", 0.3),
    "--sb-placeholder": misturar(lateral, "#ffffff", 0.65),
    "--sb-focus": c.cursor,
    "--shadow-card": escuro
      ? "0 0 0 1px rgba(0, 0, 0, 0.25)"
      : "0 1px 2px rgba(0, 0, 0, 0.06), 0 1px 1px rgba(0, 0, 0, 0.04)",
    "color-scheme": escuro ? "dark" : "light",
  };
}

function aplicarTema(tema) {
  if (!TEMAS[tema]) tema = "classico";
  limparPaleta();
  document.getElementById("tema-link").href = "tema-" + tema + ".css";
  estadoTema = { tema: tema, paleta: null };
  guardar("tema-escolhido", tema);
  guardar("paleta-modo", null);
  guardar("paleta-cor", null);
  atualizarMenuTema();
}

function aplicarPaleta(modo, cor) {
  if (!MODOS_PALETA[modo] || !PALETAS_CORES[cor]) return;
  limparPaleta();
  definirVars(calcularPaleta(modo, cor));
  estadoTema.paleta = { modo: modo, cor: cor };
  guardar("paleta-modo", modo);
  guardar("paleta-cor", cor);
  atualizarMenuTema();
}

function lerFavoritos() {
  try {
    var lista = JSON.parse(localStorage.getItem("temas-favoritos"));
    if (!Array.isArray(lista)) return [];
    return lista.filter(function (f) {
      return TEMAS[f.tema] && MODOS_PALETA[f.modo] && PALETAS_CORES[f.cor];
    });
  } catch (erro) {
    return [];
  }
}

function salvarFavoritos(lista) {
  guardar("temas-favoritos", JSON.stringify(lista));
}

function mesmoFavorito(a, b) {
  return a.tema === b.tema && a.modo === b.modo && a.cor === b.cor;
}

function favoritoAtual() {
  var paleta = estadoTema.paleta;
  return paleta ? { tema: estadoTema.tema, modo: paleta.modo, cor: paleta.cor } : null;
}

function nomeFavorito(f) {
  var nome = MODOS_PALETA[f.modo].nome + " · " + PALETAS_CORES[f.cor].nome;
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
      : lista.concat(atual)
  );
  atualizarMenuTema();
}

function aplicarFavorito(f) {
  aplicarTema(f.tema);
  aplicarPaleta(f.modo, f.cor);
}

function criarLinhaTema(rotulo, corAmostra, atributo, valor, pressionado, indiceRemover) {
  var linha = document.createElement("div");
  var botao = document.createElement("button");
  var amostra = document.createElement("span");
  var texto = document.createElement("span");

  linha.className = "linha-tema";
  botao.type = "button";
  botao.className = "item-tema";
  botao.dataset[atributo] = valor;
  botao.setAttribute("aria-pressed", pressionado);
  amostra.className = "amostra-tema";
  amostra.style.background = corAmostra;
  texto.textContent = rotulo;
  botao.append(amostra, texto);
  linha.appendChild(botao);

  if (indiceRemover !== undefined) {
    var remover = document.createElement("button");
    remover.type = "button";
    remover.className = "remover-favorito";
    remover.dataset.remover = indiceRemover;
    remover.textContent = "×";
    remover.title = "Remover dos favoritos";
    remover.setAttribute("aria-label", "Remover dos favoritos");
    linha.appendChild(remover);
  }
  return linha;
}

function atualizarMenuTema() {
  var nome = document.getElementById("nome-tema");
  if (!nome) return;
  var paleta = estadoTema.paleta;
  var atual = favoritoAtual();
  var favoritos = lerFavoritos();
  var lista = document.getElementById("lista-temas");
  var cor = paleta ? PALETAS_CORES[paleta.cor].acento : TEMAS[estadoTema.tema].cor;

  nome.textContent = atual ? nomeFavorito(atual) : TEMAS[estadoTema.tema].nome;
  document.getElementById("amostra-tema").style.background = cor;

  lista.innerHTML = "";
  Object.keys(TEMAS).forEach(function (chave) {
    lista.appendChild(
      criarLinhaTema(TEMAS[chave].nome, TEMAS[chave].cor, "tema", chave, !paleta && chave === estadoTema.tema)
    );
  });
  favoritos.forEach(function (f, i) {
    lista.appendChild(
      criarLinhaTema(nomeFavorito(f), PALETAS_CORES[f.cor].acento, "favorito", i, !!atual && mesmoFavorito(f, atual), i)
    );
  });

  document.querySelectorAll("[data-modo]").forEach(function (botao) {
    botao.setAttribute("aria-pressed", !!paleta && botao.dataset.modo === paleta.modo);
  });
  document.querySelectorAll("[data-cor]").forEach(function (botao) {
    botao.setAttribute("aria-pressed", !!paleta && botao.dataset.cor === paleta.cor);
  });

  var botaoFavoritar = document.getElementById("btn-favoritar");
  var jaFavorito =
    !!atual &&
    favoritos.some(function (f) {
      return mesmoFavorito(f, atual);
    });
  botaoFavoritar.hidden = !paleta;
  botaoFavoritar.textContent = jaFavorito ? "★ Remover dos favoritos" : "☆ Favoritar este tema";
}

function montarMenuTema() {
  var botaoMenu = document.getElementById("btn-tema");
  var menu = document.getElementById("menu-tema");
  var listaTemas = document.getElementById("lista-temas");
  var grupoModo = document.getElementById("grupo-modo");
  var grupoCores = document.getElementById("grupo-cores");
  var modoAtual = "claro";

  ORDEM_CORES_PALETA.forEach(function (cor) {
    var botao = document.createElement("button");
    botao.type = "button";
    botao.className = "opcao-cor";
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

  document.getElementById("btn-favoritar").addEventListener("click", alternarFavorito);

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
    if (!evento.target.closest("#seletor-tema")) fechar();
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

  if (TEMAS[tema]) {
    document.getElementById("tema-link").href = "tema-" + tema + ".css";
    estadoTema.tema = tema;
  }
  if (MODOS_PALETA[modo] && PALETAS_CORES[cor]) {
    definirVars(calcularPaleta(modo, cor));
    estadoTema.paleta = { modo: modo, cor: cor };
  }
}

carregarTema();
document.addEventListener("DOMContentLoaded", montarMenuTema);

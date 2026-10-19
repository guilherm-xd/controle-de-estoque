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

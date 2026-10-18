const raiz = document.documentElement;
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

function ajustarPersonalizada(hex) {
  var c = PALETAS_CORES.personalizada;
  c.acento = hex;
  c.acentoTexto = misturar(hex, "#ffffff", 0.8);
  c.cursor = misturar(hex, "#ffffff", 0.45);
  PALETAS_FUNDOS.escuro.personalizada = [
    misturar("#000000", hex, 0.08),
    misturar("#000000", hex, 0.13),
    misturar("#000000", hex, 0.3),
    misturar("#000000", hex, 0.18),
  ];
}

function lerHexPersonalizado() {
  try {
    var hex = localStorage.getItem("paleta-hex");
    if (/^#[0-9a-f]{6}$/i.test(hex || "")) return hex;
  } catch (erro) {}
  return "#8833ff";
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

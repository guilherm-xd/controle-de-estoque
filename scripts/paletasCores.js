const raiz = document.documentElement;
function hexParaRgb(hex) {
  let n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function misturar(a, b, t) {
  let x = hexParaRgb(a);
  let y = hexParaRgb(b);
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
  let c = hexParaRgb(hex);
  let cinza = Math.round(0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]);
  let h = cinza.toString(16).padStart(2, "0");
  return misturar(hex, "#" + h + h + h, t);
}

function luminancia(hex) {
  let c = hexParaRgb(hex).map(function (v) {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}

function textoSobre(hex) {
  return luminancia(hex) > 0.4 ? "#14181c" : "#ffffff";
}

function ajustarPersonalizada(hex) {
  let c = coresPaleta.personalizada;
  c.acento = hex;
  c.acentoTexto = misturar(hex, "#ffffff", 0.8);
  c.cursor = misturar(hex, "#ffffff", 0.45);
  fundosPaleta.escuro.personalizada = [
    misturar("#000000", hex, 0.08),
    misturar("#000000", hex, 0.13),
    misturar("#000000", hex, 0.3),
    misturar("#000000", hex, 0.18),
  ];
}

function lerHexPersonalizado() {
  const hex = localStorage.getItem("paleta-hex");
  if (/^#[0-9a-f]{6}$/i.test(hex || "")) {
    return hex;
  }
  return "#8833ff";
}

function guardar(chave, valor) {
  if (valor === null) {
    localStorage.removeItem(chave);
  } else {
    localStorage.setItem(chave, valor);
  }
}

function definirVars(vars) {
  varPaleta = Object.keys(vars);
  varPaleta.forEach(function (prop) {
    raiz.style.setProperty(prop, vars[prop]);
  });
}

function limparPaleta() {
  varPaleta.forEach(function (prop) {
    raiz.style.removeProperty(prop);
  });
  raiz.style.removeProperty("color-scheme");
  varPaleta = [];
}

function calcularPaleta(modo, cor) {
  let c = coresPaleta[cor];
  let escuro = modo === "escuro";
  let acento = c.acento;
  let m = modosPaleta[modo];
  let fundo, superficie, borda, campo, hover;

  if (escuro) {
    let f = fundosPaleta.escuro[cor];
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
    "--corFundo": fundo,
    "--corSuperficie": superficie,
    "--corBorda": borda,
    "--corCampo": campo,
    "--corLinhaHover": hover,
    "--corTexto": m.texto,
    "--corTextoSuave": m.suave,
    "--corPrimaria": acento,
    "--corSobrePrimaria": textoSobre(acento),
    "--corPrimariaEscura": lateral,
    "--corPrimariaHover": misturar(acento, escuro ? "#ffffff" : "#000000", 0.15),
    "--corPrimariaSuave": misturar(acento, superficie, escuro ? 0.78 : 0.86),
    "--corPrimariaTexto": escuro ? c.acentoTexto : misturar(acento, "#000000", 0.55),
    "--corOkFundo": misturar(ok, superficie, escuro ? 0.8 : 0.85),
    "--corOkTexto": escuro ? "#7ee2a4" : "#1e6b3c",
    "--corAlerta": escuro ? c.presente : misturar(c.presente, "#000000", 0.5),
    "--corAlertaFundo": misturar(c.presente, superficie, 0.84),
    "--corAlertaBorda": misturar(c.presente, superficie, 0.5),
    "--corPerigo": perigo,
    "--corPerigoTexto": escuro ? "#ff8f88" : "#b3261e",
    "--corPerigoFundo": misturar(perigo, superficie, 0.86),
    "--corPerigoBorda": misturar(perigo, superficie, 0.55),
    "--topoBarraLateral": misturar(lateral, "#ffffff", 0.1),
    "--barraTexto": "#f2f5f4",
    "--barraTitulo": "#f2f5f4",
    "--barraLegenda": "#f2f5f4",
    "--barraApagado": misturar(lateral, "#ffffff", 0.78),
    "--barraLinha": misturar(lateral, "#ffffff", 0.16),
    "--barraCampo": misturar(lateral, "#000000", 0.28),
    "--barraBordaBotao": misturar(lateral, "#ffffff", 0.3),
    "--barraMarcador": misturar(lateral, "#ffffff", 0.65),
    "--barraFoco": c.cursor,
    "--sombraCartao": escuro
      ? "0 0 0 1px rgba(0, 0, 0, 0.25)"
      : "0 1px 2px rgba(0, 0, 0, 0.06), 0 1px 1px rgba(0, 0, 0, 0.04)",
    "color-scheme": escuro ? "dark" : "light",
  };
}

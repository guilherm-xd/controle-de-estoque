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

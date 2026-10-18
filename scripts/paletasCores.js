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

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

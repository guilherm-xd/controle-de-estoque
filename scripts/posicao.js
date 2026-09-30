const POSICOES_BARRA = ['esquerda', 'direita', 'topo', 'base'];
const botaoPosicao = document.getElementById('botaoPosicao');
const menuPosicao = document.getElementById('menuPosicao');
const painelDoFiltro = document.querySelector('.painelFiltro');
const botaoFiltroCompacto = document.getElementById('botaoFiltroCompacto');

function fecharMenuPosicao() {
  menuPosicao.hidden = true;
  botaoPosicao.setAttribute('aria-expanded', 'false');
}

function fecharFiltroCompacto() {
  painelDoFiltro.classList.remove('aberto');
  botaoFiltroCompacto.setAttribute('aria-expanded', 'false');
}

function aplicarPosicao(posicao) {
  if (!POSICOES_BARRA.includes(posicao)) posicao = 'topo';
  app.dataset.posicao = posicao;
  menuPosicao.querySelectorAll('[data-posicao]').forEach(botao => {
    botao.setAttribute('aria-pressed', botao.dataset.posicao === posicao);
  });
  fecharFiltroCompacto();
  guardar('posicao-barra', posicao);
}

botaoPosicao.addEventListener('click', () => {
  const abrir = menuPosicao.hidden;
  menuPosicao.hidden = !abrir;
  botaoPosicao.setAttribute('aria-expanded', String(abrir));
});

menuPosicao.addEventListener('click', evento => {
  const opcao = evento.target.closest('[data-posicao]');
  if (!opcao) return;
  aplicarPosicao(opcao.dataset.posicao);
  fecharMenuPosicao();
});

botaoFiltroCompacto.addEventListener('click', () => {
  const abrir = !painelDoFiltro.classList.contains('aberto');
  painelDoFiltro.classList.toggle('aberto', abrir);
  botaoFiltroCompacto.setAttribute('aria-expanded', String(abrir));
});

document.addEventListener('click', evento => {
  if (!evento.target.closest('#seletorPosicao')) fecharMenuPosicao();
  if (!evento.target.closest('#botaoFiltroCompacto, .gruposFiltro')) fecharFiltroCompacto();
});

document.addEventListener('keydown', evento => {
  if (evento.key === 'Escape') {
    fecharMenuPosicao();
    fecharFiltroCompacto();
  }
});

let posicaoSalva = null;
try { posicaoSalva = localStorage.getItem('posicao-barra'); } catch (erro) {}
aplicarPosicao(posicaoSalva);

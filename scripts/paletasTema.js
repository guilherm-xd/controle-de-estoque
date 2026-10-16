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
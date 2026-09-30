# Controle de Estoque - Gerencie seus produtos de forma simples e visual.

**Controle de Estoque** é um painel web para cadastrar, acompanhar e organizar produtos em um ou mais estoques. Tudo roda direto no navegador, sem servidor e sem cadastro: os dados ficam salvos no seu próprio dispositivo.

Feito para quem precisa de uma ferramenta rápida para controlar quantidades, preços e reposição, com direito a temas personalizáveis, descontos em lote e importação/exportação de planilhas.

![Uploading Design sem nome(1).gif…]()

---

## Sobre o Projeto

Este projeto nasceu da vontade de criar um sistema de estoque simples, bonito e realmente útil no dia a dia, sem depender de frameworks ou de back-end.

A proposta foi desenvolver uma aplicação completa apenas com HTML, CSS e JavaScript puro, praticando manipulação do DOM, organização de código em módulos, persistência de dados no navegador e construção de uma interface responsiva com um sistema de temas flexível.

O objetivo principal foi praticar lógica de programação e desenvolvimento front-end em um projeto com regras de negócio reais: múltiplos estoques, filtros, descontos, transferência de itens, importação e exportação de arquivos.

---

## Funcionalidades

- **Cadastro de produtos** - nome, categoria, quantidade e preço.
- **Edição e remoção** - a remoção pede confirmação com um segundo clique e oferece a opção de **desfazer**.
- **Ajuste rápido de quantidade** - botões de `+` e `−` direto na tabela.
- **Múltiplos estoques** - crie, renomeie, alterne e exclua estoques usando abas.
- **Mover produtos entre estoques** - transfira um item de um estoque para outro.
- **Indicadores em tempo real** - total de produtos, total de itens, itens com estoque baixo e valor total em estoque.
- **Alerta de estoque baixo** - produtos com menos de 5 unidades recebem destaque e podem ser filtrados com um clique.
- **Busca e filtros** - busca por nome e filtro por faixa de quantidade (mínimo e máximo).
- **Ordenação** - clique nos cabeçalhos da tabela para ordenar por qualquer coluna.
- **Duas visões da lista** - alterne entre tabela e cartões.
- **Gráfico por categoria** - barras mostrando a quantidade de itens em cada categoria.
- **Descontos em lote** - aplique um percentual em todos os itens, em itens específicos ou em uma categoria inteira, com preço original preservado e opção de remover o desconto individualmente ou de uma vez.
- **Importação de arquivos** - suporte a `.csv`, `.xlsx` e `.xls`, inclusive planilhas com várias abas (cada aba vira um estoque).
- **Exportação de arquivos** - exporte o estoque atual ou todos os estoques em `.xlsx` ou `.csv`.
- **Lista de reposição para impressão** - gera uma folha com os itens de estoque baixo e um campo para a quantidade a pedir.
- **Barra lateral redimensionável** - arraste (ou use as setas do teclado) para ajustar a largura.
- **Dados salvos localmente** - tudo é guardado no `localStorage`, então nada se perde ao fechar a página.

---

## Tecnologias Utilizadas

- HTML
- CSS
- JavaScript
---

## Temas e Paletas de Cores

O sistema de aparência tem duas camadas que podem ser usadas juntas:

**Temas prontos**, cada um com suas próprias fontes, cantos e sombras:

- **Clássico verde** - visual sóbrio, com fonte serifada nos títulos.
- **Escuro** - interface escura com contraste confortável.
- **Vibrante** - cantos arredondados, gradiente na barra lateral e cores intensas.

**Paletas personalizadas**, geradas dinamicamente por código:

- **13 cores de destaque** (vermelho, laranja, amarelo, verde, verde água, ciano, azul, abismo, índigo, violeta, rosa, cinza e ferrugem).
- Modos **Claro** e **Escuro** combináveis com qualquer cor.
- Todas as variantes (fundo, bordas, hover, alertas e barra lateral) são calculadas automaticamente a partir da cor escolhida.
- **Favoritos** - salve suas combinações preferidas e volte a elas com um clique.

A escolha fica salva no navegador e é aplicada assim que a página abre.

---

## Como Usar

1. Abra o link do projeto no navegador
2. Preencha o formulário **Adicionar produto** e confirme.
3. Use a busca, os filtros e a ordenação para encontrar o que precisa.
4. Crie novos estoques pelo botão `+` nas abas.
5. Para aplicar promoções, abra a barra de **Desconto**, escolha o alvo e informe o percentual.
6. Use **Importar** e **Exportar** para trabalhar com planilhas.
7. Personalize o visual pelo seletor de **Tema da página**.

### Formato para importação

O arquivo precisa ter, no mínimo, as colunas **Produto** e **Quantidade**. As colunas **Categoria**, **Preço** e **Estoque** são opcionais. Se houver a coluna **Estoque**, os produtos são separados em estoques diferentes automaticamente.

| Produto | Categoria | Quantidade | Preço (R$) |
|---|---|---|---|
| Caixa de parafusos | Ferragens | 12 | 24,90 |

---

## Projeto Online

Acesse o projeto diretamente pelo navegador:  
https://guilherm-xd.github.io/controle-de-estoque/

---

## Preview

### Tela inicial
<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/6b6ccaf3-b971-4225-afbe-460a7122654c" />

### Descontos em lote
<img width="1566" height="292" alt="image" src="https://github.com/user-attachments/assets/c4f63f51-5074-4686-97dc-c5bcc51e758a" />

### Gráfico por categoria
<img width="1560" height="213" alt="image" src="https://github.com/user-attachments/assets/2662959d-29ce-4149-ba41-2d00dce5f4be" />

### Temas e paletas
<img width="255" height="642" alt="image" src="https://github.com/user-attachments/assets/ea0f305b-e19f-4008-a3b6-d4afa25bcff6" />

---

## Aprendizados

Durante o desenvolvimento deste projeto foi possível aprender:

- Manipulação avançada do DOM com JavaScript puro
- Organização do código em vários arquivos por responsabilidade
- Persistência de dados com `localStorage`
- Leitura e geração de arquivos CSV e Excel no navegador
- Construção de um sistema de temas com variáveis CSS
- Geração dinâmica de paletas de cores por código
- Acessibilidade básica com `aria-label`, `aria-pressed` e navegação por teclado
- Padrões de interface como confirmação em dois cliques e desfazer

---

## Equipe de Desenvolvimento

- [Alexandre Henrique Pereira de Araujo](https://github.com/henriqtw)
- [Guilherme Miranda Murillo](https://github.com/guilherm-xd)
- [Gustavo Oliveira Almeida](https://github.com/Gustavo-0093)
- [Nicolas da Silva Mira](https://github.com/devMiraPy)

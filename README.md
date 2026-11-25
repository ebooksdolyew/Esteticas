# Esteticas — template de site para estética facial

Página única (`index.html`) em HTML, CSS e JS puros, sem dependências nem build.

Tratamentos: limpeza de pele, peeling, microagulhamento, cicatrizes de acne e melasma.

## Estrutura

```
index.html            conteúdo e seções
assets/css/style.css  estilos (tokens no topo)
assets/js/main.js     menu móvel, acordeão, animações, formulário → WhatsApp
assets/img/           imagens do site
```

## Como customizar

- **Cores, fontes e espaçamentos**: altere as variáveis em `:root`, no topo de `style.css`.
  O acento (`--c-accent`) é o único tom de destaque e controla botões, números e o bloco de agendamento.
- **Nome da clínica**: procure por `Atelier Derme` no `index.html`.
- **WhatsApp**: troque `5500000000000` (DDI + DDD + número) nos links `wa.me` e no atributo `data-whatsapp` do formulário.
- **Foto da seção Sobre**: coloque um `<img>` dentro de `<figure class="media">`.
- **Novo tratamento**: copie um bloco `<article class="index-item">` e ajuste os ids (`t-06`, `p-06`).
- **Linhas da grade de fundo**: remova a `<div class="grid-lines">` para escondê-las.

Para visualizar, basta abrir o `index.html` no navegador.

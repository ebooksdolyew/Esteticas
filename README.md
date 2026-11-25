# Esteticas — template de site para estética facial

Página única (`index.html`) em HTML, CSS e JS puros, sem dependências nem build.

Tratamentos: limpeza de pele, peeling, microagulhamento, cicatrizes de acne e melasma.

## Estrutura

```
index.html            conteúdo e seções
assets/css/style.css  arquivo único de estilos (tokens no topo, seções numeradas)
assets/js/main.js     arquivo único de interações (menu, acordeão, scrollspy, animações, formulário → WhatsApp)
UI-UX.md              guia de UI/UX: princípios, tokens, componentes e acessibilidade
assets/img/           imagens ilustrativas em WebP
assets/fonts/         fonte Instrument Serif e sua licença
```

## Como customizar

- Personalize as cores, fontes e espaçamentos nas variáveis em `:root`, no topo de `style.css`.
- Substitua o nome `Atelier Derme` e os dados de contato de exemplo no `index.html`.
- Troque `5500000000000` (DDI + DDD + número) nos links `wa.me` e no atributo `data-whatsapp` do formulário.
- Substitua as imagens ilustrativas nas seções de abertura, Sobre e Agendamento. Atualize as descrições e dimensões e, no retrato da abertura, os caminhos em `srcset`.
- Troque também o número `wa.me` da barra fixa do celular (`.mobile-cta`), no fim do `index.html`.
- Para adicionar um tratamento, copie um bloco `<article class="index-item">` e ajuste os IDs, o atributo `aria-controls` e o `data-treatment` do link de agendamento. Adicione o atalho na abertura e a opção no formulário.

Para visualizar, basta abrir o `index.html` no navegador.

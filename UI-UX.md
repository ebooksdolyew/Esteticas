# Atelier Derme — Guia de UI/UX

Documento único com as decisões de interface e experiência do site. Os estilos ficam em
`assets/css/style.css` e as interações em `assets/js/main.js`, um arquivo para cada.

## Princípios

1. **Calma antes de estímulo.** Paleta natural (creme, sálvia, argila), muito respiro e movimento lento e suave. Nada pisca nem chama atenção sem motivo.
2. **Um caminho principal.** Toda seção leva ao agendamento: botão no cabeçalho, no hero, em cada tratamento e, no celular, uma barra fixa.
3. **Informação sob demanda.** Tratamentos e dúvidas ficam em acordeões, para a página ser fácil de percorrer sem esconder nada de quem quer ler.
4. **Acessível por padrão.** Contraste AA, foco visível, navegação por teclado, respeito a `prefers-reduced-motion` e alto contraste.

## Identidade visual

| Token | Uso |
|---|---|
| `--c-bg` `#f8f4eb` | Fundo geral (creme) |
| `--c-surface` `#fffdf7` | Cartões, formulário, seção Sobre |
| `--c-tint` `#e8ecdf` | Seções Método e Agendamento |
| `--c-accent` `#435d47` | Ação principal, destaques, foco |
| `--c-deep` `#2f4434` | Hover da ação principal |
| `--c-ink` / `--c-ink-2` / `--c-ink-3` | Texto principal, secundário e de apoio |
| `--c-error` / `--c-ok` | Validação do formulário |

- **Tipografia:** *Instrument Serif* nos títulos (com itálico em verde para a palavra de ênfase) e Helvetica Neue no texto. Títulos usam `text-wrap: balance` e parágrafos, `pretty`.
- **Formas:** cantos orgânicos assimétricos nas imagens e seções; uma folha (`--leaf`) se repete como marca, marcador do eyebrow e das etapas do Método.
- **Sombras:** tingidas de verde (`--sh-1`, `--sh-2`, `--sh-btn`), nunca cinza puro.

## Componentes e comportamento

| Componente | Comportamento |
|---|---|
| Cabeçalho | Fica fixo; ao rolar ganha borda, sombra e uma **barra de progresso** de leitura. O link da seção visível recebe `aria-current` e um ponto verde. |
| Menu móvel | Fecha com Esc, clique fora ou ao escolher um link; trava a rolagem da página e mantém o foco dentro do menu. |
| Hero | Entrada escalonada (texto → imagem → atalhos). Os atalhos abrem o tratamento correspondente. |
| Tratamentos | Acordeão numerado (01–05), um aberto por vez. Setas ↑/↓, Home e End navegam entre itens. Links como `#t-03` abrem o item direto. Cada painel tem **"Agendar avaliação para…"**, que já preenche o tratamento no formulário. |
| Dúvidas | Mesmo acordeão; no desktop o título fica fixo ao lado das perguntas. |
| Formulário | Máscara de telefone `(00) 00000-0000`; validação ao sair do campo e correção em tempo real; mensagens por campo ligadas via `aria-describedby`; envia para o WhatsApp. |
| Barra fixa (celular) | Aparece depois do hero e some ao chegar no Agendamento ou abrir o menu. Botão de agendar e atalho para o WhatsApp. |
| Revelação | Elementos `.reveal` entram ao rolar, em sequência entre irmãos. |

## Movimento

- Curvas: `--ease` para interface e `--ease-out` para entradas.
- Durações: `--dur-fast` (.22s) para estados, `--dur` (.45s) para painéis e .8–1.2s para entradas.
- Com `prefers-reduced-motion: reduce`, animações e transições são desligadas e o conteúdo aparece direto.

## Acessibilidade

- Link "Pular para o conteúdo", landmarks e `aria-label` nas navegações.
- Acordeões com `aria-expanded`/`aria-controls`; mensagens de erro com `aria-live`.
- Alvos de toque com no mínimo 44px; hover só em dispositivos com ponteiro.
- Modo de alto contraste (`forced-colors`) e folha de impressão, que imprime os tratamentos abertos e oculta o formulário.

## Como estender

- **Nova cor ou espaçamento:** crie o token em `:root` (seção 02 do CSS) e use a variável.
- **Novo tratamento:** copie um `<article class="index-item">`, ajuste os IDs e o `data-treatment` do link de agendamento, e adicione a opção no `<select>`. A numeração é automática.
- **Animar um bloco novo:** adicione a classe `reveal`.

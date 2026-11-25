# BUILD TO BUSINESS — Landing Page

Recriação da landing page da imersão **"Em 7 dias, você pronto para o mercado"** (dark + neon green), conforme a imagem de referência.

## Rodando

Site 100% estático — abra `index.html` no navegador ou sirva a pasta:

```bash
python3 -m http.server 8080
# http://localhost:8080
```

## Estrutura

```
index.html
assets/
├── css/styles.css       # design system + efeitos
├── js/script.js         # interações
└── img/                 # avatar (gerado) + mockups (fotos de internet)
```

## Requisitos atendidos

- **Marquee entre a 1ª e 2ª dobra** — faixa dupla com as frases da ementa (`7 DIAS CONSECUTIVOS · APRENDIZADO AO VIVO · PROJETOS PRÁTICOS · ...`) rolando **da esquerda para a direita** (CSS keyframes, pausa no hover, loop infinito via clone em JS).
- **Prova social com carrossel de páginas (2ª dobra)** — 6 projetos fictícios (AutoBacana, Vitalícia Odonto, Sushi Kai, Alpes Imóveis, FitCore, Café Alma) em browser-frames, trocando **automaticamente a cada 10s**, com barra de progresso, dots, setas, contador e pausa no hover.
- **Avatar fictício + assinatura** — retrato gerado por IA (`assets/img/avatar.jpg`) e assinatura "Junior Lima" (fonte Caveat + flourish SVG que se desenha ao entrar na tela), com o tagline "DESIGN QUE GERA RESULTADOS".
- **Mockups de projetos com imagens da internet** — fotos reais baixadas (picsum.photos) compostas em mini-sites CSS por projeto.
- **Outras páginas/seções** — O que é (com editor de código Vibe Coding animado + métricas R$4.289 / R$249 MRR), Como funciona (timeline Dia 01–07), Investimento (pricing card), FAQ (accordion), CTA final e footer.
- **Botões flutuantes** — WhatsApp FAB com anel pulsante e tooltip, botão "voltar ao topo", toast do mentor com avatar.
- **Efeitos visuais de transição** — reveal on scroll (IntersectionObserver com staggers), botões magnéticos, tilt 3D do avatar, contadores animados, header com blur ao rolar, glow ambiente animado, scroll suave, `prefers-reduced-motion` respeitado.

## Personalizar

- WhatsApp: troque `5511900000000` em `index.html` (CTAs + FAB).
- Preço/vagas: seção `#investimento` no `index.html`.
- Intervalo do carrossel: constante `INTERVAL` em `assets/js/script.js`.

*Conteúdo demonstrativo — persona, valores e CNPJ são fictícios.*

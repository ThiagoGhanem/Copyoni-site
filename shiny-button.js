(function () {
  if (!document.getElementById('shiny-button-style')) {
    const style = document.createElement('style');
    style.id = 'shiny-button-style';
    style.textContent = `
      @import url("https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,500&display=swap");

      @property --gradient-angle {
        syntax: "<angle>"; initial-value: 0deg; inherits: false;
      }
      @property --gradient-angle-offset {
        syntax: "<angle>"; initial-value: 0deg; inherits: false;
      }
      @property --gradient-percent {
        syntax: "<percentage>"; initial-value: 5%; inherits: false;
      }
      @property --gradient-shine {
        syntax: "<color>"; initial-value: #ffffff; inherits: false;
      }

      .shiny-cta {
        --shiny-cta-bg: #021a0a;
        --shiny-cta-bg-subtle: #003d10;
        --shiny-cta-fg: #ffffff;
        --shiny-cta-highlight: #007820;
        --shiny-cta-highlight-subtle: #00a828;
        --animation: gradient-angle linear infinite;
        --duration: 3s;
        --transition: 600ms cubic-bezier(0.25, 1, 0.5, 1);
        isolation: isolate; position: relative; overflow: hidden;
        cursor: pointer; outline-offset: 4px;
        padding: 1.1rem 2.4rem;
        font-family: "Inter", sans-serif; font-size: 1rem;
        line-height: 1.2; font-weight: 600;
        border: 1px solid transparent; border-radius: 360px;
        color: var(--shiny-cta-fg);
        background:
          linear-gradient(var(--shiny-cta-bg), var(--shiny-cta-bg)) padding-box,
          conic-gradient(
            from calc(var(--gradient-angle) - var(--gradient-angle-offset)),
            transparent,
            #007820 var(--gradient-percent),
            #00a828 calc(var(--gradient-percent) * 2),
            #007820 calc(var(--gradient-percent) * 3),
            transparent calc(var(--gradient-percent) * 4)
          ) border-box;
        box-shadow: inset 0 0 0 1px var(--shiny-cta-bg-subtle);
        text-decoration: none;
        display: inline-flex; align-items: center;
        justify-content: center; gap: 8px;
        transition: box-shadow var(--transition), filter var(--transition);
        /* Animação giratória na borda */
        animation:
          var(--animation) var(--duration),
          var(--animation) calc(var(--duration) / 0.4) reverse paused;
        animation-composition: add;
      }
      .shiny-cta span { z-index: 1; position: relative; }
      .shiny-cta:active { translate: 0 1px; }
      .shiny-cta:is(:hover,:focus-visible) {
        --gradient-percent: 20%;
        --gradient-angle-offset: 95deg;
        --gradient-shine: #00a828;
        background:
          linear-gradient(var(--shiny-cta-bg), var(--shiny-cta-bg)) padding-box,
          conic-gradient(
            from calc(var(--gradient-angle) - var(--gradient-angle-offset)),
            transparent,
            #007820 var(--gradient-percent),
            #00a828 calc(var(--gradient-percent) * 2),
            #007820 calc(var(--gradient-percent) * 3),
            transparent calc(var(--gradient-percent) * 4)
          ) border-box;
        box-shadow:
          0 0 24px rgba(0,120,32,0.5),
          0 0 48px rgba(0,120,32,0.2),
          inset 0 0 0 1px rgba(0,168,40,0.3);
        filter: brightness(1.15);
        animation-play-state: running;
      }
      @keyframes gradient-angle { to { --gradient-angle: 360deg; } }
    `;
    document.head.appendChild(style);
  }

  function applyShiny() {
    const selectors = [
      'button:not(.pc-ctrl-btn):not(.pc-dot):not(.orb-node-btn):not(.carousel-btn):not(.hamburger):not([data-glow-inner]):not(.fa-btn)',
      'a.btn', 'a.button', 'a.cta',
      '[class*="btn-"]:not(.pc-ctrl-btn):not(.carousel-btn):not(.fa-btn)',
      '[class*="-btn"]:not(.pc-ctrl-btn):not(.orb-node-btn):not(.carousel-btn):not(.fa-btn)',
      'input[type="submit"]'
    ];

    selectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        if (el.classList.contains('shiny-cta')) return;
        if (el.closest('nav') && el.tagName === 'A'
            && !el.className.match(/btn|button|cta/i)) return;
        if (el.closest('#orbital-timeline')) return;
        if (el.closest('#process-carousel-section')) return;
        if (el.closest('[data-glow-card]') && el.tagName === 'BUTTON') return;

        const children = Array.from(el.childNodes).filter(
          n => n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim())
        );
        const alreadyWrapped = children.length === 1
          && children[0].tagName === 'SPAN';

        if (!alreadyWrapped) {
          const originalHTML = el.innerHTML;
          el.innerHTML = `<span>${originalHTML}</span>`;
        }

        el.classList.add('shiny-cta');
        el.style.removeProperty('background');
        el.style.removeProperty('background-color');
        el.style.removeProperty('border');
        el.style.removeProperty('border-radius');
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyShiny);
  } else {
    applyShiny();
  }
})();

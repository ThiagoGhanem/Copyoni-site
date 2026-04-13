(function () {
  if (!document.getElementById('spotlight-style')) {
    const style = document.createElement('style');
    style.id = 'spotlight-style';
    style.textContent = `
      [data-glow-card] {
        --x: 0; --y: 0; --xp: 0; --yp: 0;
        --base: 270; --spread: 260; --radius: 16; --border: 2;
        --size: 280; --outer: 1;
        --backdrop: rgba(10,4,32,0.72);
        --backup-border: rgba(123,47,190,0.25);
        --border-size: calc(var(--border,2) * 1px);
        --spotlight-size: calc(var(--size,200) * 1px);
        --hue: calc(var(--base) + (var(--xp,0) * var(--spread,0)));
        position: relative;
        background-image: radial-gradient(
          var(--spotlight-size) var(--spotlight-size) at
          calc(var(--x,0) * 1px) calc(var(--y,0) * 1px),
          hsl(var(--hue) 100% 72% / 0.10), transparent
        );
        background-color: var(--backdrop);
        background-size: calc(100% + (2 * var(--border-size))) calc(100% + (2 * var(--border-size)));
        background-position: 50% 50%;
        background-attachment: fixed;
        border: var(--border-size) solid var(--backup-border);
        border-radius: calc(var(--radius) * 1px);
        touch-action: none;
        transition: border-color 0.3s ease, box-shadow 0.3s ease;
      }
      [data-glow-card]:hover {
        border-color: rgba(123,47,190,0.55);
        box-shadow: 0 0 32px rgba(123,47,190,0.18), 0 8px 40px rgba(0,0,0,0.45);
      }
      [data-glow-card]::before,
      [data-glow-card]::after {
        pointer-events: none; content: "";
        position: absolute; inset: calc(var(--border-size) * -1);
        border: var(--border-size) solid transparent;
        border-radius: calc(var(--radius) * 1px);
        background-attachment: fixed;
        background-size: calc(100% + (2 * var(--border-size))) calc(100% + (2 * var(--border-size)));
        background-repeat: no-repeat; background-position: 50% 50%;
        mask: linear-gradient(transparent,transparent), linear-gradient(white,white);
        mask-clip: padding-box, border-box; mask-composite: intersect;
        -webkit-mask: linear-gradient(transparent,transparent), linear-gradient(white,white);
        -webkit-mask-clip: padding-box, border-box;
        -webkit-mask-composite: destination-in;
      }
      [data-glow-card]::before {
        background-image: radial-gradient(
          calc(var(--spotlight-size) * 0.75) calc(var(--spotlight-size) * 0.75) at
          calc(var(--x,0) * 1px) calc(var(--y,0) * 1px),
          hsl(var(--hue) 100% 55% / 1), transparent 100%
        );
        filter: brightness(2);
      }
      [data-glow-card]::after {
        background-image: radial-gradient(
          calc(var(--spotlight-size) * 0.5) calc(var(--spotlight-size) * 0.5) at
          calc(var(--x,0) * 1px) calc(var(--y,0) * 1px),
          hsl(0 100% 100% / 0.85), transparent 100%
        );
      }
      [data-glow-card] [data-glow-inner] {
        position:absolute; inset:0;
        border-radius: calc(var(--radius) * 1px);
        will-change:filter; opacity:var(--outer,1);
        border:none; background:none; pointer-events:none;
      }
      [data-glow-card] > * {
        position: relative;
        z-index: 1;
      }
    `;
    document.head.appendChild(style);
  }

  function syncPointer(e) {
    const x = e.clientX.toFixed(2);
    const y = e.clientY.toFixed(2);
    const xp = (e.clientX / window.innerWidth).toFixed(2);
    const yp = (e.clientY / window.innerHeight).toFixed(2);
    document.querySelectorAll('[data-glow-card]').forEach(card => {
      card.style.setProperty('--x', x);
      card.style.setProperty('--xp', xp);
      card.style.setProperty('--y', y);
      card.style.setProperty('--yp', yp);
    });
  }
  document.addEventListener('pointermove', syncPointer);

  function initCards() {
    document.querySelectorAll('[data-glow-card]').forEach(card => {
      if (!card.querySelector('[data-glow-inner]')) {
        const inner = document.createElement('div');
        inner.setAttribute('data-glow-inner', '');
        card.insertBefore(inner, card.firstChild);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCards);
  } else {
    initCards();
  }
})();

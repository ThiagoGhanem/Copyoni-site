(function () {

  function setup() {

    const hero =
      document.querySelector('#hero') ||
      document.querySelector('.hero') ||
      document.querySelector('section:first-of-type') ||
      document.querySelector('header');

    if (!hero) return;

    const wrapper = document.createElement('div');
    wrapper.id = 'flow-field-wrapper';
    wrapper.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 0;
      overflow: hidden;
    `;

    const canvas = document.createElement('canvas');
    canvas.id = 'flow-field-canvas';
    canvas.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: block;
      pointer-events: none;
    `;
    wrapper.appendChild(canvas);
    document.body.style.position = 'relative';
    document.body.appendChild(wrapper);

    const ctx = canvas.getContext('2d');

    // ── PARÂMETROS ──────────────────────────────────
    const COLOR          = '#7B2FBE';
    const TRAIL_OPACITY  = 0.10;
    const PARTICLE_COUNT = window.innerWidth < 768 ? 60 : 600;
    const SPEED          = 0.6;
    // ────────────────────────────────────────────────

    let width, height, particles, animId;
    let heroHeight = 0;
    let mouse = { x: -1000, y: -1000 };

    class Particle {
      constructor() { this.reset(true); }

      reset(_random) {
        this.x = Math.random() * width;
        this.y = heroHeight + Math.random() * (height - heroHeight);
        this.vx = 0;
        this.vy = 0;
        this.age = 0;
        this.life = Math.random() * 200 + 100;
      }

      update() {
        // Campo de fluxo orgânico — comportamento original
        const angle = (
          Math.cos(this.x * 0.005) +
          Math.sin(this.y * 0.005)
        ) * Math.PI;

        this.vx += Math.cos(angle) * 0.2 * SPEED;
        this.vy += Math.sin(angle) * 0.2 * SPEED;

        // Repulsão pelo mouse com coordenadas corretas
        const mdx = mouse.x - this.x;
        const mdy = mouse.y - this.y;
        const dist = Math.sqrt(mdx * mdx + mdy * mdy);
        const interactionRadius = 200;

        if (dist < interactionRadius && dist > 0) {
          const force = (interactionRadius - dist) / interactionRadius;
          this.vx -= (mdx / dist) * force * 2.0;
          this.vy -= (mdy / dist) * force * 2.0;
        }

        this.x += this.vx;
        this.y += this.vy;

        // Atrito original — movimento fluido
        this.vx *= 0.95;
        this.vy *= 0.95;

        this.age++;
        if (this.age > this.life) this.reset(false);

        // Wrap horizontal
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;

        // Barreira da hero — partícula não entra
        if (this.y < heroHeight) {
          this.y = heroHeight + 2;
          this.vy = Math.abs(this.vy) * 0.3;
        }

        // Wrap vertical inferior
        if (this.y > height) this.reset(false);
      }

      draw() {
        if (this.y < heroHeight) return;
        const alpha = (1 - Math.abs(
          (this.age / this.life) - 0.5
        ) * 2) * 0.55;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = COLOR;
        ctx.fillRect(this.x, this.y, 1.2, 1.2);
      }
    }

    function getHeroHeight() {
      return hero.offsetTop + hero.offsetHeight;
    }

    function init() {
      const dpr   = window.devicePixelRatio || 1;
      width       = document.documentElement.scrollWidth;
      height      = document.documentElement.scrollHeight;
      heroHeight  = getHeroHeight();

      canvas.width  = width  * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width  = width  + 'px';
      canvas.style.height = height + 'px';
      wrapper.style.width  = width  + 'px';
      wrapper.style.height = height + 'px';

      particles = Array.from(
        { length: PARTICLE_COUNT },
        () => new Particle()
      );
    }

    function animate() {
      // Limpa apenas abaixo da hero
      ctx.fillStyle = `rgba(6, 2, 15, ${TRAIL_OPACITY})`;
      ctx.fillRect(0, heroHeight, width, height - heroHeight);

      ctx.globalAlpha = 1;
      particles.forEach(p => { p.update(); p.draw(); });
      animId = requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
      cancelAnimationFrame(animId);
      heroHeight = getHeroHeight();
      init();
      animate();
    });

    window.addEventListener('mousemove', e => {
      // O canvas é absolute no body então precisamos
      // somar o scroll para pegar a posição correta
      mouse.x = e.clientX;
      mouse.y = e.clientY + (window.scrollY || window.pageYOffset || 0);
    });

    window.addEventListener('scroll', () => {
      // Mantém o mouse atualizado durante o scroll
      // para não travar a posição do efeito
      mouse.scrollY = window.scrollY || window.pageYOffset || 0;
    });

    window.addEventListener('mouseleave', () => {
      mouse.x = -9999;
      mouse.y = -9999;
    });

    init();
    animate();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }

})();

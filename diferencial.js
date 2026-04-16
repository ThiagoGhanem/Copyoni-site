(function () {
  const section = document.getElementById('diferencial');
  if (!section) return;

  /* ─── Radar math ─────────────────────────────────────────── */
  const cx = 200, cy = 200, R = 148, N = 6;
  const ao = -Math.PI / 2;

  function pt(axis, val) {
    const a = ao + axis * (2 * Math.PI / N);
    return { x: cx + val * R * Math.cos(a), y: cy + val * R * Math.sin(a) };
  }
  function poly(vals) {
    return vals.map((v, i) => { const p = pt(i, v); return `${p.x.toFixed(1)},${p.y.toFixed(1)}`; }).join(' ');
  }
  function gridHex(lvl) { return poly(Array(N).fill(lvl)); }

  /* ─── Data ───────────────────────────────────────────────── */
  const LABELS   = ['Tráfego Pago', 'CRM', 'Gestão de Projetos', 'Treinamento Comercial', 'Marketing de Performance', 'Processos'];
  const ANCHORS  = ['middle', 'start', 'start', 'middle', 'end', 'end'];
  const LABEL_R  = 1.24;

  const agVals = [0.28, 0.14, 0.22, 0.10, 0.33, 0.18];
  const coVals = [0.92, 0.88, 0.85, 0.90, 0.90, 0.87];

  /* perimeter for dashoffset animation */
  let perim = 0;
  const coPts = coVals.map((v, i) => pt(i, v));
  for (let i = 0; i < coPts.length; i++) {
    const a = coPts[i], b = coPts[(i + 1) % coPts.length];
    perim += Math.hypot(b.x - a.x, b.y - a.y);
  }
  perim = Math.ceil(perim) + 10;

  /* ─── CSS ────────────────────────────────────────────────── */
  if (!document.getElementById('dif-style')) {
    const s = document.createElement('style');
    s.id = 'dif-style';
    s.textContent = `
      #diferencial {
        background: #0B0B0F;
        min-height: 100vh;
        padding: 100px 0 88px;
        position: relative;
        overflow: hidden;
      }
      .dif-inner {
        max-width: 1400px;
        margin: 0 auto;
        padding: 0 40px;
      }
      .dif-title {
        text-align: center;
        font-family: 'Playfair Display', Georgia, serif;
        font-size: clamp(1.9rem, 3vw, 2.9rem);
        font-weight: 800;
        color: #fff;
        line-height: 1.15;
        margin: 0 0 72px;
      }

      /* ── Three-column layout ── */
      .dif-grid {
        display: grid;
        grid-template-columns: 1fr 420px 1fr;
        gap: 40px;
        align-items: center;
        margin-bottom: 64px;
      }
      @media (max-width: 1100px) {
        .dif-grid { grid-template-columns: 1fr 360px 1fr; gap: 24px; }
      }
      @media (max-width: 860px) {
        .dif-grid {
          grid-template-columns: 1fr;
          justify-items: center;
        }
      }

      /* ── Cards ── */
      .dif-card {
        width: 100%;
        background: rgba(255,255,255,0.04);
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 16px;
        padding: 40px 36px;
        backdrop-filter: blur(8px);
        opacity: 0;
        transform: translateY(28px) scale(0.97);
        transition: opacity 0.65s ease, transform 0.65s ease, box-shadow 0.3s ease;
      }
      .dif-card.dif-vis {
        opacity: 1;
        transform: none;
      }
      .dif-card--common {
        border-color: rgba(255,60,60,0.18);
        transition-delay: 0.05s;
      }
      .dif-card--copyoni {
        border-color: rgba(139,0,0,0.45);
        box-shadow: 0 0 28px rgba(139,0,0,0.10);
        transition-delay: 0.3s;
      }
      .dif-card--copyoni:hover {
        box-shadow: 0 0 48px rgba(139,0,0,0.22);
      }
      .dif-card h3 {
        font-family: 'Playfair Display', Georgia, serif;
        font-size: 1.25rem;
        font-weight: 700;
        color: #fff;
        margin: 0 0 28px;
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .dif-card ul {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .dif-card li {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        font-size: 0.97rem;
        color: rgba(255,255,255,0.76);
        line-height: 1.55;
      }
      .dif-ix { color: #cc3333; font-size: 1.05rem; flex-shrink: 0; margin-top: 2px; }
      .dif-ic { color: #8B0000; font-size: 1.05rem; flex-shrink: 0; margin-top: 2px; }

      /* ── Radar wrapper ── */
      .dif-radar-wrap {
        width: 420px;
        height: 420px;
        flex-shrink: 0;
        opacity: 0;
        transform: scale(0.88);
        transition: opacity 0.85s ease 0.15s, transform 0.85s ease 0.15s;
        position: relative;
      }
      .dif-radar-wrap.dif-vis {
        opacity: 1;
        transform: scale(1);
      }
      @media (max-width: 1100px) {
        .dif-radar-wrap { width: 360px; height: 360px; }
      }
      @media (max-width: 860px) {
        .dif-radar-wrap { width: 320px; height: 320px; }
      }
      .dif-radar-svg {
        width: 100%;
        height: 100%;
        overflow: visible;
      }

      /* Copyoni polygon draw animation */
      .dif-co-poly {
        stroke-dasharray: ${perim};
        stroke-dashoffset: ${perim};
        transition: none;
      }
      .dif-co-poly.dif-draw {
        stroke-dashoffset: 0;
        transition: stroke-dashoffset 2s cubic-bezier(0.4, 0, 0.2, 1) 0.6s;
      }

      /* Vertex pulse */
      @keyframes dif-vertex-pulse {
        0%, 100% { r: 4px; opacity: 0.95; }
        50%       { r: 7px;  opacity: 0.45; }
      }
      .dif-vertex { animation: dif-vertex-pulse 2.6s ease-in-out infinite; }
      .dif-vertex:nth-child(2) { animation-delay: 0.43s; }
      .dif-vertex:nth-child(3) { animation-delay: 0.86s; }
      .dif-vertex:nth-child(4) { animation-delay: 1.29s; }
      .dif-vertex:nth-child(5) { animation-delay: 1.72s; }
      .dif-vertex:nth-child(6) { animation-delay: 2.15s; }

      /* ── CTA ── */
      .dif-cta-wrap {
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 14px;
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.65s ease 0.4s, transform 0.65s ease 0.4s;
      }
      .dif-cta-wrap.dif-vis {
        opacity: 1;
        transform: none;
      }
      .dif-btn {
        display: inline-block !important;
        padding: 17px 44px !important;
        background: linear-gradient(135deg, #8B0000 0%, #5a0000 100%) !important;
        background-image: linear-gradient(135deg, #8B0000 0%, #5a0000 100%) !important;
        color: #fff !important;
        font-size: 1rem !important;
        font-weight: 700 !important;
        border: none !important;
        border-radius: 50px !important;
        cursor: pointer !important;
        letter-spacing: 0.02em !important;
        box-shadow: 0 4px 24px rgba(139,0,0,0.45) !important;
        text-decoration: none !important;
        transition: box-shadow 0.3s, transform 0.2s;
      }
      .dif-btn:hover {
        box-shadow: 0 8px 36px rgba(139,0,0,0.65) !important;
        transform: translateY(-2px);
      }
      .dif-btn-sub {
        display: block !important;
        font-size: 0.85rem;
        color: rgba(255,255,255,0.48);
        margin: 0;
        background: none !important;
        box-shadow: none !important;
        border: none !important;
        padding: 0 !important;
      }
      .dif-closing {
        text-align: center;
        font-size: 0.97rem;
        color: rgba(255,255,255,0.72);
        font-style: italic;
        margin: 28px auto 0;
        max-width: 660px;
        line-height: 1.65;
        opacity: 0;
        transition: opacity 0.65s ease 0.6s;
      }
      .dif-closing.dif-vis { opacity: 1; }

      /* ── Background particles ── */
      .dif-particles {
        position: absolute;
        inset: 0;
        pointer-events: none;
        overflow: hidden;
        z-index: 0;
      }
      .dif-inner { position: relative; z-index: 1; }
      .dif-p {
        position: absolute;
        border-radius: 50%;
        background: rgba(139,0,0,0.35);
        animation: dif-float linear infinite;
      }
      @keyframes dif-float {
        from { transform: translateY(0); opacity: 0; }
        10%   { opacity: 1; }
        90%   { opacity: 0.25; }
        to    { transform: translateY(-110vh); opacity: 0; }
      }
    `;
    document.head.appendChild(s);
  }

  /* ─── Build SVG ──────────────────────────────────────────── */
  const defs = `
    <defs>
      <radialGradient id="dif-rg" cx="50%" cy="50%" r="50%">
        <stop offset="0%"   stop-color="rgba(139,0,0,0.14)"/>
        <stop offset="100%" stop-color="rgba(0,0,0,0)"/>
      </radialGradient>
      <filter id="dif-glow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="3" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="dif-glow2" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="5" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    <circle cx="${cx}" cy="${cy}" r="${R * 1.05}" fill="url(#dif-rg)"/>
  `;

  const grid = [0.25, 0.5, 0.75, 1.0].map(l =>
    `<polygon points="${gridHex(l)}" fill="none" stroke="rgba(139,0,0,0.14)" stroke-width="${l === 1.0 ? 1.2 : 0.8}"/>`
  ).join('');

  const axes = Array.from({ length: N }, (_, i) => {
    const p = pt(i, 1.0);
    return `<line x1="${cx}" y1="${cy}" x2="${p.x.toFixed(1)}" y2="${p.y.toFixed(1)}" stroke="rgba(139,0,0,0.18)" stroke-width="1"/>`;
  }).join('');

  const labels = LABELS.map((lbl, i) => {
    const p = pt(i, LABEL_R);
    const dy = i === 0 ? '-8' : i === 3 ? '18' : '4';
    return `<text x="${p.x.toFixed(1)}" y="${p.y.toFixed(1)}" dy="${dy}" text-anchor="${ANCHORS[i]}" fill="rgba(255,255,255,0.52)" font-size="10.5" font-family="'Inter',sans-serif" letter-spacing="0.06em">${lbl}</text>`;
  }).join('');

  const agPoly = `<polygon points="${poly(agVals)}" fill="rgba(180,30,30,0.07)" stroke="rgba(160,50,50,0.45)" stroke-width="1.5" stroke-dasharray="5 4"/>`;

  const coPoly = `<polygon class="dif-co-poly" points="${poly(coVals)}" fill="rgba(139,0,0,0.18)" stroke="#8B0000" stroke-width="2.5" filter="url(#dif-glow)"/>`;

  const vertices = coPts.map(p =>
    `<circle class="dif-vertex" cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="4" fill="#8B0000" filter="url(#dif-glow2)"/>`
  ).join('');

  const SVG = `
    <svg class="dif-radar-svg" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
      ${defs}${grid}${axes}${labels}${agPoly}${coPoly}${vertices}
    </svg>`;

  /* ─── Particles ──────────────────────────────────────────── */
  const ptcls = Array.from({ length: window.innerWidth < 768 ? 6 : 22 }, () => {
    const left = (Math.random() * 100).toFixed(1);
    const sz   = (1 + Math.random() * 2.5).toFixed(1);
    const dur  = (9 + Math.random() * 12).toFixed(1);
    const del  = (Math.random() * 14).toFixed(1);
    return `<div class="dif-p" style="left:${left}%;bottom:-4px;width:${sz}px;height:${sz}px;animation-duration:${dur}s;animation-delay:-${del}s;"></div>`;
  }).join('');

  /* ─── HTML ───────────────────────────────────────────────── */
  section.innerHTML = `
    <div class="dif-particles">${ptcls}</div>
    <div class="dif-inner">

      <h2 class="dif-title">Por que a Copyoni <span style="color:#A52020">não é uma assessoria comum?</span></h2>

      <div class="dif-grid">

        <!-- Card esquerdo: Agência Comum -->
        <div class="dif-card dif-card--common" id="dif-left">
          <h3><span class="dif-ix" style="font-size:1.3rem;">&#10007;</span> Agência Comum</h3>
          <ul>
            <li><span class="dif-ix">&#10007;</span> Entrega leads, mas não converte</li>
            <li><span class="dif-ix">&#10007;</span> Cuida só do tráfego</li>
            <li><span class="dif-ix">&#10007;</span> Sem acompanhamento comercial</li>
            <li><span class="dif-ix">&#10007;</span> Resultado imprevisível</li>
          </ul>
        </div>

        <!-- Radar central -->
        <div class="dif-radar-wrap" id="dif-radar">${SVG}</div>

        <!-- Card direito: Copyoni -->
        <div class="dif-card dif-card--copyoni" id="dif-right">
          <h3><span class="dif-ic" style="font-size:1.3rem;">&#10003;</span> Copyoni</h3>
          <ul>
            <li><span class="dif-ic">&#10003;</span> Gera + converte + estrutura</li>
            <li><span class="dif-ic">&#10003;</span> Sistema completo implementado</li>
            <li><span class="dif-ic">&#10003;</span> Acompanhamento da secretária ao fechamento</li>
            <li><span class="dif-ic">&#10003;</span> Faturamento previsível e escalável</li>
          </ul>
        </div>

      </div>

      <!-- CTA -->
      <div class="dif-cta-wrap" id="dif-cta">
        <a href="#contato" class="dif-btn">Quero um sistema previsível na minha clínica</a>
        <p class="dif-btn-sub">Diagnóstico gratuito e personalizado</p>
      </div>

      <p class="dif-closing" id="dif-closing">
        Sem CRM, você perde leads. Sem processo, você perde controle. Sem sistema, você perde dinheiro.
      </p>

    </div>
  `;

  /* ─── Intersection Observer ──────────────────────────────── */
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add('dif-vis');
      if (el.id === 'dif-radar') {
        const poly = el.querySelector('.dif-co-poly');
        if (poly) requestAnimationFrame(() => requestAnimationFrame(() => poly.classList.add('dif-draw')));
      }
      io.unobserve(el);
    });
  }, { threshold: 0.18 });

  ['dif-left', 'dif-radar', 'dif-right', 'dif-cta', 'dif-closing'].forEach(id => {
    const el = document.getElementById(id);
    if (el) io.observe(el);
  });

})();

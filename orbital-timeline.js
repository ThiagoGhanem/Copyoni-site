(function () {
  const container = document.getElementById('orbital-timeline');
  if (!container) return;

  // Garante hierarquia: container acima da grade de fundo
  container.style.position = 'relative';
  container.style.zIndex   = '10';

  const data = [
    {
      id: 1, title: 'Diagnóstico', subtitle: 'Fase 1',
      content: 'Análise profunda da clínica: público-alvo, diferenciais, histórico de campanhas e posicionamento competitivo no mercado estético.',
      icon: '🔍', relatedIds: [2, 6], energy: 100, status: 'completed'
    },
    {
      id: 2, title: 'Tráfego Pago', subtitle: 'Fase 2',
      content: 'Campanhas cirúrgicas no Meta e Google Ads para atrair pacientes ideais com custo por lead previsível e escalável.',
      icon: '📡', relatedIds: [1, 3], energy: 90, status: 'completed'
    },
    {
      id: 3, title: 'Copy & Criativos', subtitle: 'Fase 3',
      content: 'Anúncios com copy persuasiva que comunicam o valor da clínica, geram desejo e fazem o paciente certo pedir pelo agendamento.',
      icon: '✍️', relatedIds: [2, 4], energy: 85, status: 'completed'
    },
    {
      id: 4, title: 'Follow-up', subtitle: 'Fase 4',
      content: 'Sequência automatizada de nutrição que converte leads em agendamentos sem depender da recepção manual.',
      icon: '🔄', relatedIds: [3, 5], energy: 75, status: 'in-progress'
    },
    {
      id: 5, title: 'Agenda Cheia', subtitle: 'Fase 5',
      content: 'Pacientes qualificados chegam prontos para fechar. Agenda previsível, recorrente e com crescimento mês a mês.',
      icon: '📅', relatedIds: [4, 6], energy: 95, status: 'in-progress'
    },
    {
      id: 6, title: 'Otimização', subtitle: 'Fase 6',
      content: 'Análise contínua de métricas, testes A/B nos criativos e refinamento do sistema para escalar os resultados.',
      icon: '📈', relatedIds: [5, 1], energy: 80, status: 'pending'
    }
  ];

  const RADIUS = 260;
  let rotationAngle = 0;
  let autoRotate = true;
  let activeId = null;
  let isRotating = false;
  let nodeProgress = 0;
  let particleEls = [];

  if (!document.getElementById('orbital-style')) {
    const style = document.createElement('style');
    style.id = 'orbital-style';
    style.textContent = `
      #orbital-timeline {
        position:relative; width:100%; height:700px;
        display:flex; align-items:center; justify-content:center;
        overflow:visible;
      }

      /* ── Anéis de ping (centro) ── */
      @keyframes orb-ping {
        75%, 100% { transform:translate(-50%,-50%) scale(1.6); opacity:0; }
      }

      /* ── Pulso bordô (centro) ── */
      @keyframes orb-pulse {
        0%,100% { box-shadow:0 0 8px rgba(61,0,20,0.3); }
        50%     { box-shadow:0 0 18px rgba(61,0,20,0.55); }
      }

      /* ── Entrada dramática do card ── */
      @keyframes cardEntrance {
        from { opacity:0; transform:translateX(-50%) scale(0.8); }
        to   { opacity:1; transform:translateX(-50%) scale(1);   }
      }

      /* ── Partícula irradiando ── */
      @keyframes orb-particle {
        0%   { transform:translateX(0)    scale(0); opacity:1;   }
        60%  {                                      opacity:0.7; }
        100% { transform:translateX(34px) scale(1); opacity:0;   }
      }

      /* ── Border pulsando nos nós relacionados ── */
      @keyframes orb-border-pulse {
        0%,100% { border-color:rgba(139,0,0,0.45); box-shadow:0 0 8px  rgba(139,0,0,0.25); }
        50%     { border-color:rgba(139,0,0,1);    box-shadow:0 0 18px rgba(139,0,0,0.65); }
      }

      .orb-node-btn { transition:all 0.3s ease; }
      .orb-node-btn:hover { transform:translate(-50%,-50%) scale(1.2) !important; }

      .orb-related-btn {
        animation:orb-border-pulse 1.2s ease-in-out infinite !important;
      }

      .orb-card {
        display:none; position:absolute; top:60px; left:50%;
        transform:translateX(-50%); width:290px;
        background:rgba(10,4,32,0.96);
        border:1px solid rgba(123,47,190,0.45);
        border-radius:14px; padding:22px; z-index:30;
        backdrop-filter:blur(20px);
        box-shadow:0 8px 40px rgba(123,47,190,0.25);
        overflow:hidden;
      }
      .orb-card.active {
        display:block;
        animation:cardEntrance 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards;
      }

      .orb-progress-wrap {
        position:absolute; bottom:0; left:0; right:0; height:2px;
        background:rgba(255,255,255,0.07);
      }
      .orb-progress-fill {
        height:100%; width:0%;
        background:linear-gradient(90deg,#CC0000,#8B0000);
        transition:width 0.05s linear;
      }

      .orb-energy-bar {
        height:3px; border-radius:2px;
        background:rgba(255,255,255,0.08); margin-top:4px; overflow:hidden;
      }
      .orb-energy-fill {
        height:100%;
        background:linear-gradient(90deg,#7B2FBE,#4F46E5);
        border-radius:2px;
      }
    `;
    document.head.appendChild(style);
  }

  // ── 4. FUNDO DE GRADE ─────────────────────────────────────────────────────
  const gridBg = document.createElement('div');
  gridBg.style.cssText = `
    position:absolute; inset:-80px; z-index:0; border-radius:50%;
    background:#020617;
    background-image:
      linear-gradient(to right,  rgba(71,85,105,1) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(71,85,105,1) 1px, transparent 1px),
      radial-gradient(circle at 50% 50%, rgba(61,0,20,0.22) 0%, transparent 65%);
    background-size:32px 32px, 32px 32px, 100% 100%;
    -webkit-mask-image:radial-gradient(circle at 50% 50%, black 55%, transparent 85%);
    mask-image:radial-gradient(circle at 50% 50%, black 55%, transparent 85%);
    pointer-events:none;
  `;
  container.appendChild(gridBg);

  // ── 1. ANEL ORBITAL COM GLOW ──────────────────────────────────────────────
  // Anel principal (bordô glow)
  const ring = document.createElement('div');
  ring.style.cssText = `
    position:absolute; width:${RADIUS * 2}px; height:${RADIUS * 2}px;
    border-radius:50%; border:1.5px solid rgba(139,0,0,0.8);
    top:50%; left:50%; transform:translate(-50%,-50%);
    box-shadow:0 0 12px 2px rgba(139,0,0,0.4);
    opacity:1; pointer-events:none; z-index:11;
  `;
  container.appendChild(ring);

  // Anel externo sutil
  const ring2 = document.createElement('div');
  ring2.style.cssText = `
    position:absolute; width:${RADIUS * 2 + 80}px; height:${RADIUS * 2 + 80}px;
    border-radius:50%; border:1px dashed rgba(139,0,0,0.22);
    top:50%; left:50%; transform:translate(-50%,-50%);
    box-shadow:0 0 8px 1px rgba(139,0,0,0.12);
    pointer-events:none; z-index:11;
  `;
  container.appendChild(ring2);

  // ── 2. CENTRO COM PULSO MAIS INTENSO ─────────────────────────────────────
  const centerWrap = document.createElement('div');
  centerWrap.style.cssText = `
    position:absolute; top:50%; left:50%;
    transform:translate(-50%,-50%); z-index:20; pointer-events:none;
  `;
  centerWrap.innerHTML = `
    <div style="position:relative;width:110px;height:110px;
                display:flex;align-items:center;justify-content:center;">
      <div style="position:absolute;width:110px;height:110px;border-radius:50%;
        background:radial-gradient(circle, #3d0014, #1a000a, #000000);
        animation:orb-pulse 2.5s infinite;
        display:flex;align-items:center;justify-content:center;
        box-shadow:0 0 10px 3px rgba(61,0,20,0.4);">
        <div style="position:absolute;width:130px;height:130px;border-radius:50%;
          border:1px solid rgba(139,0,0,0.25);top:50%;left:50%;
          animation:orb-ping 1.8s infinite;"></div>
        <div style="position:absolute;width:150px;height:150px;border-radius:50%;
          border:1px solid rgba(139,0,0,0.18);top:50%;left:50%;
          animation:orb-ping 1.8s 0.6s infinite;"></div>
        <div style="position:absolute;width:170px;height:170px;border-radius:50%;
          border:1px solid rgba(139,0,0,0.1);top:50%;left:50%;
          animation:orb-ping 1.8s 1s infinite;"></div>
        <div style="text-align:center;line-height:1.25;">
          <div style="font-size:13px;font-weight:800;color:#fff;letter-spacing:0.12em;">COPYONI</div>
          <div style="font-size:10px;font-weight:500;color:rgba(255,255,255,0.65);
                      letter-spacing:0.18em;margin-top:2px;">SISTEMA</div>
        </div>
      </div>
    </div>
  `;
  container.appendChild(centerWrap);

  // ── Nós orbitais ──────────────────────────────────────────────────────────
  const nodeEls = {};
  const cardEls = {};

  data.forEach((item) => {
    const wrapper = document.createElement('div');
    wrapper.style.cssText = `
      position:absolute; top:50%; left:50%;
      cursor:pointer; transition:opacity 0.4s ease;
      will-change:transform,opacity; z-index:15;
    `;

    const glowSize = item.energy * 0.35 + 28;
    const glow = document.createElement('div');
    glow.style.cssText = `
      position:absolute; width:${glowSize}px; height:${glowSize}px;
      border-radius:50%;
      background:radial-gradient(circle,rgba(123,47,190,0.28) 0%,transparent 70%);
      top:50%; left:50%; transform:translate(-50%,-50%); pointer-events:none;
    `;
    wrapper.appendChild(glow);

    const btn = document.createElement('div');
    btn.className = 'orb-node-btn';
    btn.style.cssText = `
      width:54px; height:54px; border-radius:50%;
      background:#080318; border:2px solid rgba(139,47,220,0.85);
      display:flex; align-items:center; justify-content:center;
      font-size:22px; box-shadow:0 0 14px rgba(123,47,190,0.5);
      position:relative; z-index:2; transform:translate(-50%,-50%);
      overflow:visible;
    `;
    btn.textContent = item.icon;
    wrapper.appendChild(btn);

    const label = document.createElement('div');
    label.style.cssText = `
      position:absolute; top:38px; left:50%; transform:translateX(-50%);
      white-space:nowrap; font-size:13px; font-weight:700;
      color:rgba(255,255,255,1); letter-spacing:0.06em;
      text-align:center; pointer-events:none;
      text-shadow:0 0 12px rgba(0,0,0,0.9), 0 1px 3px rgba(0,0,0,1);
    `;
    label.textContent = item.title;
    wrapper.appendChild(label);

    const statusMap = {
      completed:     { label:'ATIVO',        bg:'rgba(123,47,190,0.25)',  color:'#C084FC', border:'rgba(123,47,190,0.5)' },
      'in-progress': { label:'EM EXECUÇÃO',  bg:'rgba(79,70,229,0.25)',   color:'#A5B4FC', border:'rgba(79,70,229,0.5)'  },
      pending:       { label:'PRÓXIMA FASE', bg:'rgba(255,255,255,0.07)', color:'rgba(255,255,255,0.45)', border:'rgba(255,255,255,0.18)' }
    };
    const st = statusMap[item.status];

    const card = document.createElement('div');
    card.className = 'orb-card';
    card.innerHTML = `
      <div class="orb-progress-wrap"><div class="orb-progress-fill"></div></div>
      <div style="width:1px;height:12px;background:rgba(123,47,190,0.5);margin:0 auto 12px;"></div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
        <span style="font-size:11px;font-weight:700;letter-spacing:0.1em;padding:3px 8px;
          border-radius:20px;background:${st.bg};color:${st.color};
          border:1px solid ${st.border};">${st.label}</span>
        <span style="font-size:12px;font-family:monospace;color:rgba(255,255,255,0.38);">${item.subtitle}</span>
      </div>
      <h4 style="font-size:17px;font-weight:800;color:#fff;margin:0 0 8px;line-height:1.3;">${item.title}</h4>
      <p style="font-size:14px;color:#FB7185;line-height:1.7;margin:0 0 4px;">${item.content}</p>
    `;
    wrapper.appendChild(card);

    nodeEls[item.id] = { wrapper, btn, label };
    cardEls[item.id] = card;
    wrapper.addEventListener('click', e => { e.stopPropagation(); toggleNode(item.id); });
    container.appendChild(wrapper);
  });

  window.__orbToggle = function(id) { toggleNode(id); };

  // ── Partículas ───────────────────────────────────────────────────────────
  function addParticles(id) {
    removeParticles();
    const { btn } = nodeEls[id];
    const count = 8;
    for (let i = 0; i < count; i++) {
      const angle = (360 / count) * i;
      const outer = document.createElement('div');
      outer.style.cssText = `
        position:absolute; top:50%; left:50%;
        transform:translate(-50%,-50%) rotate(${angle}deg);
        width:0; height:0; pointer-events:none; z-index:5;
      `;
      const inner = document.createElement('div');
      inner.style.cssText = `
        width:5px; height:5px; border-radius:50%;
        background:${i % 2 === 0 ? '#8B0000' : 'rgba(255,255,255,0.75)'};
        animation:orb-particle 1.4s ease-out ${i * 175}ms infinite;
        position:absolute; top:-2.5px; left:0;
      `;
      outer.appendChild(inner);
      btn.appendChild(outer);
      particleEls.push(outer);
    }
  }

  function removeParticles() {
    particleEls.forEach(el => el.remove());
    particleEls = [];
  }

  // ── Barra de progresso ───────────────────────────────────────────────────
  function updateProgressBar() {
    if (!activeId) return;
    const fill = cardEls[activeId].querySelector('.orb-progress-fill');
    if (fill) fill.style.width = nodeProgress + '%';
  }

  // ── Toggle node ──────────────────────────────────────────────────────────
  function toggleNode(id) {
    if (activeId === id) { closeAll(); return; }
    closeAll();
    activeId = id;
    autoRotate = false;

    const index = data.findIndex(d => d.id === id);
    const total = data.length;
    const currentNodeAngle = ((index / total) * 360 + rotationAngle) % 360;
    let delta = (270 - currentNodeAngle + 360) % 360;
    if (delta > 180) delta -= 360;

    const startAngle  = rotationAngle;
    const targetAngle = rotationAngle + delta;
    const duration    = 700;
    const startTime   = Date.now();

    function animateRotation() {
      const elapsed  = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      rotationAngle = startAngle + (targetAngle - startAngle) * ease;

      if (progress < 1) {
        requestAnimationFrame(animateRotation);
      } else {
        rotationAngle = targetAngle % 360;
        isRotating = false;

        // Card com entrada dramática
        cardEls[id].classList.add('active');

        // Ícone ativo: glow bordô + borda branca
        nodeEls[id].btn.style.background  = 'linear-gradient(135deg,#7B2FBE,#4F46E5)';
        nodeEls[id].btn.style.borderColor = '#ffffff';
        nodeEls[id].btn.style.boxShadow   = '0 0 20px 6px rgba(139,0,0,0.6)';
        nodeEls[id].btn.style.transform   = 'translate(-50%,-50%) scale(1.45)';
        nodeEls[id].label.style.color     = '#fff';
        nodeEls[id].wrapper.style.zIndex  = 35;
        nodeEls[id].wrapper.style.opacity = 1;

        // Nós relacionados: border pulsando em bordô
        const item = data.find(d => d.id === id);
        item.relatedIds.forEach(rid => {
          if (nodeEls[rid]) nodeEls[rid].btn.classList.add('orb-related-btn');
        });

        // Partículas irradiando
        addParticles(id);
      }
    }

    isRotating = true;
    requestAnimationFrame(animateRotation);
  }

  // ── Close all ────────────────────────────────────────────────────────────
  function closeAll() {
    removeParticles();
    activeId = null;
    autoRotate = true;
    nodeProgress = 0;

    Object.values(cardEls).forEach(c => {
      c.classList.remove('active');
      const fill = c.querySelector('.orb-progress-fill');
      if (fill) fill.style.width = '0%';
    });
    Object.values(nodeEls).forEach(({ btn, label }) => {
      btn.style.background  = '#0A0420';
      btn.style.borderColor = 'rgba(123,47,190,0.55)';
      btn.style.boxShadow   = '0 0 12px rgba(123,47,190,0.3)';
      btn.style.transform   = 'translate(-50%,-50%)';
      btn.classList.remove('orb-related-btn');
      label.style.color = 'rgba(255,255,255,0.72)';
    });
  }

  container.addEventListener('click', e => {
    if (e.target === container || e.target === ring || e.target === ring2) closeAll();
  });

  // ── Loop de animação ─────────────────────────────────────────────────────
  function animate() {
    if (autoRotate) rotationAngle = (rotationAngle + 0.25) % 360;

    data.forEach((item, index) => {
      if (!isRotating && activeId === item.id) return;

      const angle  = ((index / data.length) * 360 + rotationAngle) % 360;
      const radian = (angle * Math.PI) / 180;
      const x = RADIUS * Math.cos(radian);
      const y = RADIUS * Math.sin(radian);

      let opacity;
      if (activeId !== null) {
        opacity = 0.75;
      } else {
        opacity = Math.max(0.75, Math.min(1, 0.75 + 0.25 * ((1 + Math.sin(radian)) / 2)));
      }

      const zIndex = Math.round(15 + 5 * Math.cos(radian));
      nodeEls[item.id].wrapper.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
      nodeEls[item.id].wrapper.style.opacity   = opacity;
      nodeEls[item.id].wrapper.style.zIndex    = zIndex;
    });

    requestAnimationFrame(animate);
  }

  // ── Lazy init: só começa quando o container entra na tela ─────────────────
  const isMobile = window.innerWidth < 768;
  let animStarted = false;

  function startTimeline() {
    if (animStarted) return;
    animStarted = true;
    animate();

    // ── Auto-avanço com barra de progresso (cada ~4s) ─────────────────────────
    setInterval(function () {
      if (isRotating) return;

      nodeProgress = Math.min(100, nodeProgress + 100 / 80);
      if (activeId) updateProgressBar();

      if (nodeProgress >= 100) {
        nodeProgress = 0;
        const currentIdx = activeId !== null ? data.findIndex(d => d.id === activeId) : -1;
        const nextIdx    = (currentIdx + 1) % data.length;
        toggleNode(data[nextIdx].id);
      }
    }, isMobile ? 100 : 50);
  }

  const obsTimeline = new IntersectionObserver(function(entries) {
    if (entries[0].isIntersecting) startTimeline();
  }, { threshold: 0.1 });
  obsTimeline.observe(container);

})();

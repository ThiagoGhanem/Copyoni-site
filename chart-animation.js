(function () {

  function setup() {
    var col = document.getElementById('problema-chart-col');
    if (!col) return;

    // Remove canvas anterior se existir
    var old = document.getElementById('chart-bg-canvas');
    if (old) old.remove();

    // Canvas cobre 100% da coluna direita
    var canvas = document.createElement('canvas');
    canvas.id = 'chart-bg-canvas';
    canvas.style.cssText = [
      'position:absolute', 'inset:0',
      'width:100%', 'height:100%',
      'z-index:0', 'pointer-events:none', 'display:block'
    ].join(';');
    col.appendChild(canvas);

    var ctx = canvas.getContext('2d');
    var dpr = window.devicePixelRatio || 1;

    // ── Pontos principais: x fixo, y oscila continuamente ───────────────────
    // byBase = posição vertical de repouso (0=topo, 1=fundo)
    // speed  = velocidade individual da oscilação
    // phase  = fase inicial (garante dessincronismo entre pontos)
    // amp    = amplitude da oscilação em px
    var MAIN = [
      { bx: 0.04, byBase: 0.82, val: '+R$3.000',  speed: 0.70, phase: 0.00, amp: 20 },
      { bx: 0.20, byBase: 0.65, val: '+R$8.000',  speed: 0.90, phase: 1.30, amp: 20 },
      { bx: 0.36, byBase: 0.74, val: '-R$5.000',  speed: 0.65, phase: 2.50, amp: 20 },
      { bx: 0.52, byBase: 0.52, val: '+R$10.000', speed: 1.05, phase: 0.80, amp: 20 },
      { bx: 0.68, byBase: 0.34, val: '+R$23.000', speed: 0.80, phase: 3.60, amp: 20 },
      { bx: 0.82, byBase: 0.46, val: '-R$14.000', speed: 0.95, phase: 1.80, amp: 20 },
      { bx: 0.95, byBase: 0.10, val: '+R$85.000', speed: 0.75, phase: 2.80, amp: 16 }
    ];

    // ── Pontos de vale: também oscilam, amplitude menor ──────────────────────
    var VALLEYS = [
      { bx: 0.12, byBase: 0.76, speed: 0.60, phase: 4.00, amp: 10 },
      { bx: 0.28, byBase: 0.70, speed: 0.82, phase: 0.50, amp: 10 },
      { bx: 0.44, byBase: 0.63, speed: 0.68, phase: 2.00, amp: 10 },
      { bx: 0.60, byBase: 0.43, speed: 0.88, phase: 3.20, amp: 10 },
      { bx: 0.75, byBase: 0.40, speed: 0.72, phase: 1.50, amp: 10 },
      { bx: 0.89, byBase: 0.28, speed: 0.78, phase: 4.50, amp: 10 }
    ];

    var W, H, animId;
    var t = 0;

    function resize() {
      W = col.clientWidth  || 600;
      H = col.clientHeight || 520;
      canvas.width  = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    // Calcula posição animada de um ponto principal
    function getPos(mp) {
      var x = mp.bx * W;
      var y = mp.byBase * H + Math.sin(t * mp.speed + mp.phase) * mp.amp;
      y = Math.max(60, Math.min(H - 40, y)); // mantém dentro dos limites
      return { x: x, y: y };
    }

    // Calcula posição animada de um vale
    function getValleyPos(v) {
      var x = v.bx * W;
      var y = v.byBase * H + Math.sin(t * v.speed + v.phase) * v.amp;
      y = Math.max(20, Math.min(H - 20, y));
      return { x: x, y: y };
    }

    function drawLine() {
      ctx.save();
      ctx.lineWidth   = 3.0;
      ctx.strokeStyle = 'rgba(192,132,252,0.92)';
      ctx.shadowBlur  = 18;
      ctx.shadowColor = '#C084FC';
      ctx.lineJoin    = 'round';
      ctx.beginPath();
      var p0 = getPos(MAIN[0]);
      ctx.moveTo(p0.x, p0.y);
      for (var i = 1; i < MAIN.length; i++) {
        var p = getPos(MAIN[i]);
        ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();
      ctx.restore();
    }

    function drawValleys() {
      ctx.save();
      ctx.globalAlpha = 0.45;
      ctx.fillStyle   = '#C084FC';
      VALLEYS.forEach(function (v) {
        var p = getValleyPos(v);
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();
    }

    function drawMainPoints() {
      MAIN.forEach(function (mp, i) {
        var p = getPos(mp);

        // Halo pulsante em torno do ponto (raio 25–45px)
        var glowR = 35 + 10 * Math.sin(t * 1.5 + i);

        ctx.save();

        // Halo radial suave
        var grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowR);
        grad.addColorStop(0,    'rgba(192,132,252,0.72)');
        grad.addColorStop(0.45, 'rgba(192,132,252,0.28)');
        grad.addColorStop(1,    'rgba(192,132,252,0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, glowR, 0, Math.PI * 2);
        ctx.fill();

        // Dot principal
        ctx.shadowBlur  = 55;
        ctx.shadowColor = '#C084FC';
        ctx.fillStyle   = '#C084FC';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 12, 0, Math.PI * 2);
        ctx.fill();

        // Core branco
        ctx.shadowBlur = 0;
        ctx.fillStyle  = '#ffffff';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();

        // Valor em R$ acima do ponto
        ctx.save();
        ctx.globalAlpha = 0.80;
        ctx.font        = '13px monospace';
        ctx.textAlign   = 'center';
        ctx.fillStyle   = '#ffffff';
        ctx.fillText(mp.val, p.x, p.y - 22);
        ctx.restore();
      });
    }

    function frame() {
      ctx.clearRect(0, 0, W, H);
      t += 0.016;

      drawLine();
      drawValleys();
      drawMainPoints();

      animId = requestAnimationFrame(frame);
    }

    var started = false;
    var section = document.getElementById('section-problema');
    var obs = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting && !started) {
        started = true;
        resize();
        frame();
      }
    }, { threshold: 0.05 });
    obs.observe(section || col);

    window.addEventListener('resize', function () {
      if (!started) return;
      cancelAnimationFrame(animId);
      resize();
      frame();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }

})();

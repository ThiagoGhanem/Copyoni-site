(function () {

  const section = document.getElementById('process-carousel-section');
  if (!section) return;

  const steps = [
    {
      id: 'diagnostico',
      number: '01',
      title: 'Analisamos',
      description: 'Mapeamos toda a operação da sua clínica: tráfego, atendimento, conversão e faturamento.',
      image: 'Diretrizes de Marca/website imagens/análisamos.png'
    },
    {
      id: 'estruturacao',
      number: '02',
      title: 'Estruturamos',
      description: 'Montamos o funil completo: anúncios, copy, scripts de WhatsApp e processos comerciais.',
      image: 'Diretrizes de Marca/website imagens/estruturamos.png'
    },
    {
      id: 'implementacao',
      number: '03',
      title: 'Implementamos',
      description: 'Colocamos tudo no ar e acompanhamos de perto os primeiros resultados para otimizar rápido.',
      image: 'Diretrizes de Marca/website imagens/implementamos.png'
    },
    {
      id: 'escala',
      number: '04',
      title: 'Escalamos',
      description: 'Com o que funciona validado, escalamos o investimento e o faturamento de forma previsível e controlada.',
      image: 'Diretrizes de Marca/website imagens/escala.png'
    }
  ];

  if (!document.getElementById('process-carousel-style')) {
    const style = document.createElement('style');
    style.id = 'process-carousel-style';
    style.textContent = `
      #process-carousel-section {
        padding: 80px 0;
        background: transparent;
        overflow: hidden;
      }

      @media (max-width: 768px) {
        #process-carousel-section { padding: 72px 0; }
      }

      .pc-header {
        max-width: 1400px;
        margin: 0 auto 48px;
        padding: 0 32px;
        text-align: center;
      }

      .pc-header-text {
        max-width: 100%;
      }

      .pc-label {
        display: inline-block;
        font-size: 0.72rem;
        font-weight: 700;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        color: #C9A96E;
        margin-bottom: 14px;
      }

      .pc-title {
        font-size: clamp(1.8rem, 3vw, 2.6rem);
        font-family: 'Playfair Display', Georgia, serif;
        font-weight: 800;
        color: #fff;
        line-height: 1.15;
        margin: 0 0 12px;
      }

      .pc-subtitle {
        font-size: clamp(0.95rem, 1.5vw, 1.1rem);
        color: rgba(255,255,255,0.55);
        line-height: 1.6;
        margin: 0;
      }

      .pc-track-outer {
        overflow: visible;
        width: 100%;
        cursor: default;
        pointer-events: none;
      }

      .pc-track {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 24px;
        padding: 0 32px;
        transform: none !important;
        transition: none;
        max-width: 1400px;
        margin: 0 auto;
        pointer-events: all;
      }

      @media (max-width: 900px) {
        .pc-track { grid-template-columns: repeat(2, 1fr); }
      }

      @media (max-width: 560px) {
        .pc-track { grid-template-columns: 1fr; }
      }

      .pc-card {
        width: 100%;
        border-radius: 16px;
        overflow: hidden;
        background: #0A0420;
        border: 1px solid rgba(123,47,190,0.25);
        transition: border-color 0.3s ease, box-shadow 0.3s ease;
        display: flex;
        flex-direction: column;
        cursor: pointer;
      }

      .pc-card:hover {
        border-color: rgba(123,47,190,0.6);
        box-shadow: 0 8px 40px rgba(123,47,190,0.2);
      }

      .pc-card-image-area {
        width: 100%;
        height: 300px;
        background: #0a0a0a;
        flex-shrink: 0;
        overflow: hidden;
      }

      .pc-card-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center center;
        display: block;
        opacity: 0.88;
        transition: opacity 0.4s ease;
      }

      .pc-card:hover .pc-card-img {
        opacity: 1;
      }

      .pc-card-content {
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding: 28px 32px 36px;
        flex: 1;
      }

      .pc-card-number {
        font-size: 2.8rem;
        font-weight: 900;
        color: rgba(123,47,190,0.35);
        line-height: 1;
        letter-spacing: -0.02em;
        display: block;
        margin-bottom: 4px;
      }

      .pc-card-divider {
        width: 32px;
        height: 2px;
        background: linear-gradient(90deg, #7B2FBE, transparent);
        border-radius: 2px;
      }

      .pc-card-title {
        font-size: 1.4rem;
        font-weight: 800;
        color: #A52020;
        margin: 0;
        line-height: 1.2;
      }

      .pc-card-desc {
        font-size: 0.92rem;
        color: rgba(255,255,255,0.72);
        line-height: 1.65;
        margin: 0;
        display: block;
        overflow: visible;
      }
    `;
    document.head.appendChild(style);
  }

  section.innerHTML = `
    <div class="pc-header">
      <div class="pc-header-text">
        <span class="pc-label">&#10022; Metodologia</span>
        <h2 class="pc-title">Na prática, é assim que <span style="color:#A52020">trabalhamos</span></h2>
        <p class="pc-subtitle">
          Cada etapa foi desenhada para gerar resultado previsível —
          da primeira campanha até a agenda cheia.
        </p>
      </div>
    </div>

    <div class="pc-track-outer">
      <div class="pc-track">
        ${steps.map(step => `
          <div class="pc-card" data-glow-card>
            <div class="pc-card-image-area">
              <img class="pc-card-img"
                   src="${step.image}"
                   alt="${step.title}"
                   loading="lazy"
                   onerror="this.parentElement.style.background='#111'"/>
            </div>
            <div class="pc-card-content">
              <span class="pc-card-number">${step.number}</span>
              <div class="pc-card-divider"></div>
              <h3 class="pc-card-title">${step.title}</h3>
              <p class="pc-card-desc">${step.description}</p>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

})();

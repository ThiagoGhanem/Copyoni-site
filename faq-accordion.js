(function () {

  const container = document.getElementById('faq-list');
  if (!container) return;

  const faqs = [
    {
      q: 'Em quanto tempo vejo resultados?',
      a: 'As primeiras métricas aparecem nas 2 primeiras semanas. Resultados consistentes — agenda previsível e leads qualificados — entre 30 e 60 dias, dependendo do investimento em tráfego e do histórico da clínica.'
    },
    {
      q: 'Preciso investir em tráfego pago?',
      a: 'Sim. O sistema da Copyoni é construído sobre tráfego pago no Meta e Google Ads. Sem investimento em mídia, não há volume de pacientes suficiente para o sistema funcionar.'
    },
    {
      q: 'Funciona para qualquer clínica estética?',
      a: 'Trabalhamos com clínicas que faturam acima de R$30k/mês e têm estrutura para atender a demanda gerada. Se sua clínica está abaixo disso, o diagnóstico gratuito vai indicar o melhor caminho.'
    },
    {
      q: 'Como funciona o acompanhamento?',
      a: 'Você tem acesso direto ao estrategista via WhatsApp, reuniões quinzenais de performance e relatórios semanais com métricas de tráfego, leads e conversões.'
    },
    {
      q: 'Qual é o investimento na assessoria?',
      a: 'O modelo é setup + mensalidade. O valor exato depende do escopo definido no diagnóstico gratuito. Trabalhamos com contratos de 3 meses para garantir resultado real.'
    },
    {
      q: 'O que diferencia a Copyoni de uma agência comum?',
      a: 'Agências entregam serviços. A Copyoni entrega um sistema completo: tráfego, copy, follow-up automatizado e processo comercial. Você não compra anúncios — você compra um fluxo previsível de pacientes.'
    }
  ];

  if (!document.getElementById('faq-accordion-style')) {
    const style = document.createElement('style');
    style.id = 'faq-accordion-style';
    style.textContent = `
      #faq-list {
        max-width: 720px;
        margin: 48px auto 0;
        border: 1px solid rgba(123,47,190,0.25);
        border-radius: 14px;
        overflow: hidden;
        transition: border-color 0.3s ease;
      }

      .fa-item {
        background: rgba(10,4,32,0.6);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        border-bottom: 1px dashed rgba(123,47,190,0.2);
        transition: background 0.3s ease;
        position: relative;
      }

      .fa-item:last-child {
        border-bottom: none;
      }

      .fa-item:hover {
        background: rgba(123,47,190,0.07);
      }

      .fa-item.fa-open {
        background: rgba(123,47,190,0.05);
      }

      .fa-btn {
        width: 100%;
        background: none;
        border: none;
        padding: 22px 28px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        text-align: left;
      }

      .fa-question-text {
        font-size: 1rem;
        font-weight: 600;
        color: #fff;
        line-height: 1.4;
        flex: 1;
      }

      .fa-chevron {
        flex-shrink: 0;
        width: 22px;
        height: 22px;
        color: #A52020;
        transition: transform 0.35s ease;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .fa-chevron svg {
        width: 20px;
        height: 20px;
        stroke: currentColor;
        fill: none;
        stroke-width: 2.5;
        stroke-linecap: round;
        stroke-linejoin: round;
      }

      .fa-item.fa-open .fa-chevron {
        transform: rotate(180deg);
      }

      .fa-body {
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.35s ease;
      }

      .fa-item.fa-open .fa-body {
        max-height: 300px;
      }

      .fa-answer {
        padding: 0 28px 22px;
        font-size: 0.95rem;
        color: rgba(255,255,255,0.7);
        line-height: 1.7;
      }
    `;
    document.head.appendChild(style);
  }

  const chevronSVG = `<svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>`;

  faqs.forEach(function (faq) {
    const item = document.createElement('div');
    item.className = 'fa-item';

    const btn = document.createElement('button');
    btn.className = 'fa-btn';
    btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML =
      '<span class="fa-question-text">' + faq.q + '</span>' +
      '<span class="fa-chevron">' + chevronSVG + '</span>';

    const body = document.createElement('div');
    body.className = 'fa-body';

    const answer = document.createElement('div');
    answer.className = 'fa-answer';
    answer.textContent = faq.a;
    body.appendChild(answer);

    btn.addEventListener('click', function () {
      const isOpen = item.classList.contains('fa-open');
      container.querySelectorAll('.fa-item.fa-open').forEach(function (el) {
        el.classList.remove('fa-open');
        el.querySelector('.fa-btn').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('fa-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });

    item.appendChild(btn);
    item.appendChild(body);
    container.appendChild(item);
  });

})();

// Header scroll effect
const header = document.getElementById('header');
if (header && !document.body.classList.contains('sub-page')) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  });
}

// Mobile menu toggle
const mobileToggle = document.querySelector('.mobile-toggle');
const gnb = document.querySelector('.gnb');
if (mobileToggle && gnb) {
  mobileToggle.addEventListener('click', () => {
    gnb.classList.toggle('open');
    document.body.style.overflow = gnb.classList.contains('open') ? 'hidden' : '';
  });
}

// Scroll reveal
function initReveal() {
  const revealEls = document.querySelectorAll(
    '.feature-card, .ambassador-card, .review-card, .store-info, .manager-card, .section-header'
  );
  revealEls.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(el => observer.observe(el));
}
initReveal();

// === My WOKIO 3-Step Logic ===
const selections = { step1: null, step2: null, step3: null };
let currentStep = 1;

const resultMap = {
  casual: {
    name: '워키오 캐주얼 워커',
    desc: '일상에서 가볍게 신기 좋은 캐주얼 디자인에 5단 아치 서포트를 더했습니다. 편안함과 스타일을 동시에 잡아보세요.',
    tags: ['5단 아치 서포트', '경량 설계', '천연 가죽']
  },
  formal: {
    name: '워키오 트라이솔 클래식',
    desc: '격식과 편안함의 완벽한 조화. 트라이솔 기술이 적용된 프리미엄 수제 구두로 하루 종일 단정함을 유지합니다.',
    tags: ['트라이솔 시스템', '프리미엄 가죽', '의료기기 인증 인솔']
  },
  boots: {
    name: '워키오 앵클부츠 프로',
    desc: '발목까지 안정적으로 감싸주는 앵클부츠. 아치 서포트와 충격 흡수 시스템이 긴 보행에도 피로를 줄여줍니다.',
    tags: ['앵클 서포트', '충격 흡수', '방수 소재']
  },
  dial: {
    name: '워키오 다이얼 핏',
    desc: '다이얼 하나로 최적의 핏을 조절할 수 있는 혁신적 설계. 빠르게 착용하고 정밀하게 조절할 수 있습니다.',
    tags: ['다이얼 시스템', '맞춤 핏', '경량 소재']
  },
  sneakers: {
    name: '워키오 액티브 스니커즈',
    desc: '활동적인 하루를 위한 운동화 타입. 기능성 인솔과 쿠셔닝이 발을 과학적으로 보호합니다.',
    tags: ['쿠셔닝 시스템', '기능성 인솔', '통기성 소재']
  },
  default: {
    name: '워키오 5단창 컴포트',
    desc: '워키오의 핵심 기술 5단 아치 서포트가 집약된 시그니처 모델. 모든 발 고민을 위한 최적의 선택입니다.',
    tags: ['5단 아치 서포트', '의료기기 인증', '프리미엄 수제']
  }
};

document.querySelectorAll('.step-option').forEach(btn => {
  btn.addEventListener('click', function() {
    const panel = this.closest('.step-panel');
    panel.querySelectorAll('.step-option').forEach(b => b.classList.remove('selected'));
    this.classList.add('selected');

    const stepNum = parseInt(panel.dataset.step);
    selections[`step${stepNum}`] = this.dataset.value;

    setTimeout(() => goToNextStep(stepNum), 300);
  });
});

function goToNextStep(fromStep) {
  const dots = document.querySelectorAll('.step-dot');
  dots[fromStep - 1].classList.remove('active');
  dots[fromStep - 1].classList.add('completed');

  if (fromStep < 3) {
    const nextStep = fromStep + 1;
    currentStep = nextStep;
    dots[nextStep - 1].classList.add('active');

    document.querySelectorAll('.step-panel').forEach(p => p.classList.remove('active'));
    document.querySelector(`.step-panel[data-step="${nextStep}"]`).classList.add('active');
  } else {
    showResult();
  }
}

function showResult() {
  document.querySelectorAll('.step-panel').forEach(p => p.classList.remove('active'));
  document.querySelector('.step-progress').style.display = 'none';

  const styleChoice = selections.step3 || 'default';
  const result = resultMap[styleChoice] || resultMap.default;

  const resultEl = document.querySelector('.step-result');
  resultEl.querySelector('.result-name').textContent = result.name;
  resultEl.querySelector('.result-desc').textContent = result.desc;

  const tagsContainer = resultEl.querySelector('.result-features');
  tagsContainer.innerHTML = result.tags.map(t => `<span class="result-tag">${t}</span>`).join('');

  resultEl.style.display = 'block';
}

function resetMyWokio() {
  selections.step1 = null;
  selections.step2 = null;
  selections.step3 = null;
  currentStep = 1;

  document.querySelectorAll('.step-option').forEach(b => b.classList.remove('selected'));
  document.querySelectorAll('.step-dot').forEach((d, i) => {
    d.classList.remove('active', 'completed');
    if (i === 0) d.classList.add('active');
  });

  document.querySelector('.step-progress').style.display = 'flex';
  document.querySelector('.step-result').style.display = 'none';
  document.querySelectorAll('.step-panel').forEach(p => p.classList.remove('active'));
  document.querySelector('.step-panel[data-step="1"]').classList.add('active');
}

// Ambassador slider
let ambSlideIndex = 0;
function slideAmbassador(dir) {
  const track = document.querySelector('.ambassador-track');
  const cards = document.querySelectorAll('.ambassador-card');
  if (!track || !cards.length) return;
  const cardWidth = cards[0].offsetWidth + 24;
  const maxIndex = Math.max(0, cards.length - Math.floor(track.parentElement.offsetWidth / cardWidth));

  ambSlideIndex = Math.max(0, Math.min(maxIndex, ambSlideIndex + dir));
  track.style.transform = `translateX(-${ambSlideIndex * cardWidth}px)`;
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (gnb && gnb.classList.contains('open')) {
        gnb.classList.remove('open');
        document.body.style.overflow = '';
      }
    }
  });
});

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
    '.section-header, .func-block, .mw-banner-inner, .store-brief-layout, .news-carousel'
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

// === Hero Slider (Crockett & Jones style) ===
let heroIndex = 0;
const heroSlides = document.querySelectorAll('.hero-slide');
function changeSlide(dir) {
  if (!heroSlides.length) return;
  heroSlides[heroIndex].classList.remove('active');
  heroIndex = (heroIndex + dir + heroSlides.length) % heroSlides.length;
  heroSlides[heroIndex].classList.add('active');
}
if (heroSlides.length > 1) {
  setInterval(() => changeSlide(1), 6000);
}

// === Ambassador Slider (Le Mouton style) ===
let ambIdx = 0;
const ambSlides = document.querySelectorAll('.amb-hero-slide');
function changeAmbSlide(dir) {
  if (!ambSlides.length) return;
  ambSlides[ambIdx].classList.remove('active');
  ambIdx = (ambIdx + dir + ambSlides.length) % ambSlides.length;
  ambSlides[ambIdx].classList.add('active');
}

// === Review horizontal scroll ===
function scrollReviews(dir) {
  const slider = document.querySelector('.review-slider');
  if (!slider) return;
  const scrollAmount = 300;
  slider.scrollBy({ left: dir * scrollAmount, behavior: 'smooth' });
}

// === My WOKIO 3-Step Logic (for subpage) ===
const selections = { step1: null, step2: null, step3: null };
let currentStep = 1;

// 6가지 추천 라인 (분류형)
const lines = {
  comfortClassic: { name: '워키오 5단창 컴포트 클래식 라인', desc: '5단 아치 서포트가 집약된 시그니처 라인. 평발·요족·장시간 보행에 최적화.', tags: ['5단 아치 서포트', '의료기기 인증 인솔', '프리미엄 수제'] },
  comfortSlipon: { name: '워키오 5단창 모던 슬립온 라인', desc: '편안함 + 깔끔한 디자인. 캐주얼하게 매일 신기 좋은 일상화.', tags: ['5단 아치 서포트', '슬립온 디자인', '경량 설계'] },
  trisol: { name: '워키오 트라이솔 클래식 라인', desc: '격식과 편안함의 조화. 비즈니스·정장에 어울리는 프리미엄 라인.', tags: ['트라이솔 시스템', '프리미엄 가죽', '단정한 실루엣'] },
  ankleBoots: { name: '워키오 모노 앵클부츠 라인', desc: '발목까지 안정적으로 감싸는 앵클부츠. 충격 흡수와 아치 서포트 동시 제공.', tags: ['앵클 서포트', '충격 흡수', '사계절 활용'] },
  active: { name: '워키오 모노 캐주얼 워커 라인', desc: '운동·여행에도 가뿐한 활동형 라인. 운동화와 다이얼 핏 모델 포함.', tags: ['쿠셔닝 시스템', '경량 소재', '다이얼 핏'] },
  medical: { name: '워키오 맞춤 인솔 (의료기기 라인)', desc: '식약처 인증 의료기기. 풋스캐너 측정 후 개인 맞춤 제작이 필요한 분께 추천.', tags: ['식약처 인증', '맞춤 제작', '풋스캐너 필수'] }
};

// 분류 매칭 (step3 + 보조로 step2)
function pickLine(s) {
  if (s.step3 === 'formal') return lines.trisol;
  if (s.step3 === 'boots') return lines.ankleBoots;
  if (s.step3 === 'active') return lines.active;
  // casual 일 때 step2 고민으로 분기
  if (s.step3 === 'casual') {
    if (s.step2 === 'arch' || s.step2 === 'joint') return lines.comfortClassic;
    if (s.step2 === 'pain') return lines.medical;
    return lines.comfortSlipon;
  }
  return lines.comfortClassic;
}

document.querySelectorAll('.step-option').forEach(btn => {
  btn.addEventListener('click', function() {
    const panel = this.closest('.step-panel');
    if (!panel) return;
    panel.querySelectorAll('.step-option').forEach(b => b.classList.remove('selected'));
    this.classList.add('selected');
    const stepNum = parseInt(panel.dataset.step);
    selections[`step${stepNum}`] = this.dataset.value;
    setTimeout(() => goToNextStep(stepNum), 300);
  });
});

function goToNextStep(fromStep) {
  const dots = document.querySelectorAll('.step-dot');
  if (!dots.length) return;
  dots[fromStep - 1].classList.remove('active');
  dots[fromStep - 1].classList.add('completed');
  if (fromStep < 3) {
    const nextStep = fromStep + 1;
    currentStep = nextStep;
    dots[nextStep - 1].classList.add('active');
    document.querySelectorAll('.step-panel').forEach(p => p.classList.remove('active'));
    const next = document.querySelector(`.step-panel[data-step="${nextStep}"]`);
    if (next) next.classList.add('active');
  } else {
    showResult();
  }
}

function showResult() {
  document.querySelectorAll('.step-panel').forEach(p => p.classList.remove('active'));
  const progress = document.querySelector('.step-progress');
  if (progress) progress.style.display = 'none';
  const result = pickLine(selections);
  const resultEl = document.querySelector('.step-result');
  if (!resultEl) return;
  resultEl.querySelector('.result-name').textContent = result.name;
  resultEl.querySelector('.result-desc').textContent = result.desc;
  const tagsContainer = resultEl.querySelector('.result-features');
  tagsContainer.innerHTML = result.tags.map(t => `<span class="result-tag">${t}</span>`).join('');
  resultEl.style.display = 'block';
}

function resetMyWokio() {
  selections.step1 = null; selections.step2 = null; selections.step3 = null;
  currentStep = 1;
  document.querySelectorAll('.step-option').forEach(b => b.classList.remove('selected'));
  document.querySelectorAll('.step-dot').forEach((d, i) => {
    d.classList.remove('active', 'completed');
    if (i === 0) d.classList.add('active');
  });
  const progress = document.querySelector('.step-progress');
  if (progress) progress.style.display = 'flex';
  const resultEl = document.querySelector('.step-result');
  if (resultEl) resultEl.style.display = 'none';
  document.querySelectorAll('.step-panel').forEach(p => p.classList.remove('active'));
  const first = document.querySelector('.step-panel[data-step="1"]');
  if (first) first.classList.add('active');
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
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

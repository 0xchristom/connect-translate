// Thai dla Polaków - Main App Logic

let currentGender = localStorage.getItem('thaiGender') || 'male';
let currentView = 'home';
let currentCategory = null;
let currentTemplate = null;
let history = [];

// Particles
const particles = {
  male: { thai: 'ครับ', pron: 'kráp' },
  female: { thai: 'ค่ะ', pron: 'khâ' }
};

function getParticle() {
  return particles[currentGender];
}

function init() {
  // Set gender from storage
  const radios = document.querySelectorAll('input[name="gender"]');
  radios.forEach(r => {
    if (r.value === currentGender) r.checked = true;
    r.addEventListener('change', (e) => {
      currentGender = e.target.value;
      localStorage.setItem('thaiGender', currentGender);
      // Re-render if in detail to update particle
      if (currentView === 'detail') render();
    });
  });

  render();
}

function setView(view, data = {}) {
  history.push({ view: currentView, category: currentCategory, template: currentTemplate });
  currentView = view;
  if (data.category !== undefined) currentCategory = data.category;
  if (data.template !== undefined) currentTemplate = data.template;
  render();
  window.scrollTo(0, 0);
}

function goBack() {
  if (history.length > 0) {
    const prev = history.pop();
    currentView = prev.view;
    currentCategory = prev.category;
    currentTemplate = prev.template;
    render();
    window.scrollTo(0, 0);
  } else {
    currentView = 'home';
    currentCategory = null;
    currentTemplate = null;
    render();
  }
}

function render() {
  const content = document.getElementById('content');
  content.innerHTML = '';

  if (currentView === 'home') {
    renderHome(content);
  } else if (currentView === 'category') {
    renderCategory(content);
  } else if (currentView === 'options') {
    renderOptions(content);
  } else if (currentView === 'detail') {
    renderDetail(content);
  }
}

function renderHome(container) {
  const grid = document.createElement('div');
  grid.className = 'categories';

  appData.categories.forEach(cat => {
    const card = document.createElement('div');
    card.className = 'category-card';
    card.innerHTML = `
      <div class="icon">${cat.icon}</div>
      <div class="name">${cat.name}</div>
      <div class="desc">${cat.description || ''}</div>
    `;
    card.addEventListener('click', () => setView('category', { category: cat }));
    grid.appendChild(card);
  });

  container.appendChild(grid);
}

function renderCategory(container) {
  const nav = document.createElement('div');
  nav.className = 'nav-bar';
  nav.innerHTML = `
    <button class="back-btn" onclick="goBack()">← Wstecz</button>
    <div class="category-title">${currentCategory.icon} ${currentCategory.name}</div>
  `;
  container.appendChild(nav);

  const list = document.createElement('div');
  list.className = 'phrase-list';

  currentCategory.items.forEach(item => {
    const btn = document.createElement('button');
    btn.className = 'phrase-btn';

    if (item.type === 'phrase') {
      btn.innerHTML = `
        <div class="polish">${item.polish}</div>
        <div class="preview">${item.thai} · ${item.pron}</div>
      `;
      btn.addEventListener('click', () => showPhrase(item));
    } else if (item.type === 'template') {
      btn.innerHTML = `
        <div class="polish">${item.polish}</div>
        <div class="preview">Wybierz opcję →</div>
      `;
      btn.addEventListener('click', () => setView('options', { template: item }));
    }

    list.appendChild(btn);
  });

  container.appendChild(list);
}

function renderOptions(container) {
  const nav = document.createElement('div');
  nav.className = 'nav-bar';
  nav.innerHTML = `
    <button class="back-btn" onclick="goBack()">← Wstecz</button>
    <div class="category-title">${currentTemplate.polish}</div>
  `;
  container.appendChild(nav);

  const title = document.createElement('div');
  title.className = 'options-title';
  title.textContent = 'Wybierz:';
  container.appendChild(title);

  const list = document.createElement('div');
  list.className = 'phrase-list';

  currentTemplate.options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerHTML = `
      <div class="polish">${opt.polish}</div>
      <div class="preview">${opt.thai} · ${opt.pron}</div>
    `;
    btn.addEventListener('click', () => showComposed(opt));
    list.appendChild(btn);
  });

  container.appendChild(list);
}

function showPhrase(item) {
  // For phrases, apply gender if they have / in thai or note about gender
  let thai = item.thai;
  let pron = item.pron;

  // Simple replacement for phrases that include both
  if (thai.includes('ครับ/ค่ะ') || thai.includes('ครับ/คะ')) {
    const p = getParticle();
    thai = thai.replace(/ครับ\/ค่ะ|ครับ\/คะ/g, p.thai);
    pron = pron.replace(/kráp \/ khâ|kráp \/ khá/g, p.pron);
  }

  window.currentDetail = {
    polish: item.polish,
    thai: thai,
    pron: pron,
    note: item.note || ''
  };

  setView('detail', {});
}

function showComposed(option) {
  const t = currentTemplate;
  const p = getParticle();

  let thai = '';
  let pron = '';

  if (t.baseThai) {
    thai = t.baseThai + ' ' + option.thai;
    pron = t.basePron + ' ' + option.pron;
  } else if (t.suffixThai) {
    // For "where is"
    thai = option.thai + ' ' + t.suffixThai;
    pron = option.pron + ' ' + t.suffixPron;
  }

  if (t.addParticle) {
    thai += ' ' + p.thai;
    pron += ' ' + p.pron;
  }

  window.currentDetail = {
    polish: t.polish.replace(/\[jedzenie\]|\[miejsce\]/g, option.polish),
    thai: thai.trim(),
    pron: pron.trim(),
    note: option.note || 'Powiedz to wyraźnie i z uśmiechem!'
  };

  setView('detail', {});
}

function renderDetail(container) {
  const d = window.currentDetail;
  if (!d) {
    goBack();
    return;
  }

  const nav = document.createElement('div');
  nav.className = 'nav-bar';
  nav.innerHTML = `<button class="back-btn" onclick="goBack()">← Wstecz</button>`;
  container.appendChild(nav);

  const detail = document.createElement('div');
  detail.className = 'detail';

  const meaning = document.createElement('div');
  meaning.className = 'polish-meaning';
  meaning.textContent = d.polish;
  detail.appendChild(meaning);

  const thai = document.createElement('div');
  thai.className = 'thai-script';
  thai.textContent = d.thai;
  detail.appendChild(thai);

  const pron = document.createElement('div');
  pron.className = 'pronunciation';
  pron.textContent = d.pron;
  detail.appendChild(pron);

  if (d.note) {
    const note = document.createElement('div');
    note.className = 'note';
    note.textContent = d.note;
    detail.appendChild(note);
  }

  const speakBtn = document.createElement('button');
  speakBtn.className = 'speak-btn';
  speakBtn.textContent = '🔊 Posłuchaj';
  speakBtn.addEventListener('click', () => speakThai(d.thai));
  detail.appendChild(speakBtn);

  const tip = document.createElement('p');
  tip.style.marginTop = '20px';
  tip.style.fontSize = '0.8rem';
  tip.style.color = '#888';
  tip.textContent = 'Wskazówka: kliknij przycisk, aby usłyszeć wymowę (wymaga wsparcia przeglądarki dla języka tajskiego).';
  detail.appendChild(tip);

  container.appendChild(detail);
}

function speakThai(text) {
  if ('speechSynthesis' in window) {
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'th-TH';
    utter.rate = 0.85;
    speechSynthesis.cancel();
    speechSynthesis.speak(utter);
  } else {
    alert('Twoja przeglądarka nie wspiera syntezy mowy.');
  }
}

// Make functions global for onclick
window.goBack = goBack;
window.speakThai = speakThai;

// Init on load
document.addEventListener('DOMContentLoaded', init);

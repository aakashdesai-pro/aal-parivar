/**
 * Application Controller for Temple Donation Poster Maker
 */

// Global State
const state = {
  deityNames: [
    '॥ જય લીંબોજ માં ॥',
    '॥ જય મોમાઈ માં ॥',
    '॥ જય મેલડી માં ॥',
    '॥ જય ગોગા મહારાજ ॥'
  ],
  templeName: '',
  tagline: '“શ્રદ્ધા, સેવા અને સંગઠન”',
  purposeLine: '',
  villageLine: 'ગામ : ભેચડા',
  eventName: 'જન્મદિવસ નિમિત્તે',
  donorName: '',
  donorPhotoUrl: null,
  donorZoom: 1.0,
  donorPanX: 0,
  donorPanY: 0,
  donationAmount: '501',
  donationDate: '02-10-2026',
  footerLine1: 'આલ પરિવાર મઢ - ભેચડા',
  footerLine2: 'મઢના વિકાસ અર્થે આપનું મૂલ્ય યોગદાન આપવા બદલ',
  footerLine3: 'ખુબ ખુબ આભાર....',
  matajiUrl: DEFAULT_ASSETS.mataji,
  templeUrl: DEFAULT_ASSETS.temple,
  shivaUrl: DEFAULT_ASSETS.shiva
};

let renderer;
let renderTimer = null;

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', async () => {
  const canvas = document.getElementById('posterCanvas');
  renderer = new PosterRenderer(canvas);

  await loadTempleConfig();
  initFormBindings();
  initDragAndDrop();
  initEventButtons();
  initRouting();

  // Initial Render
  triggerRender();
});

/**
 * Multi-Tool Hub Navigation & Routing
 */
function initRouting() {
  window.addEventListener('hashchange', handleRoute);
  handleRoute();
}

function handleRoute() {
  const hash = window.location.hash;
  if (hash === '#poster-maker' || hash === '#poster') {
    showView('poster-maker');
  } else {
    showView('dashboard');
  }
}

function navigateView(viewName) {
  if (viewName === 'poster-maker') {
    window.location.hash = '#poster-maker';
  } else {
    window.location.hash = '';
  }
}

function showView(viewName) {
  const dashboardView = document.getElementById('dashboardView');
  const posterToolView = document.getElementById('posterToolView');
  const backBtn = document.getElementById('backToDashboardBtn');
  const mobileBar = document.getElementById('mobileBar');

  if (viewName === 'poster-maker') {
    if (dashboardView) dashboardView.style.display = 'none';
    if (posterToolView) posterToolView.style.display = 'grid';
    if (backBtn) backBtn.style.display = 'inline-flex';
    if (mobileBar && window.innerWidth <= 768) mobileBar.style.display = 'flex';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      triggerRender();
    }, 60);
  } else {
    if (dashboardView) dashboardView.style.display = 'block';
    if (posterToolView) posterToolView.style.display = 'none';
    if (backBtn) backBtn.style.display = 'none';
    if (mobileBar) mobileBar.style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

window.navigateView = navigateView;

/**
 * Trigger debounce render for smooth 60fps responsiveness
 */
function triggerRender() {
  if (renderTimer) clearTimeout(renderTimer);
  renderTimer = setTimeout(() => {
    renderer.render(state);
  }, 30);
}

/**
 * Bind form inputs to state
 */
function initFormBindings() {
  // Donor Name
  const donorNameInput = document.getElementById('donorName');
  donorNameInput.addEventListener('input', (e) => {
    state.donorName = e.target.value;
    triggerRender();
  });

  // Custom Event Input
  const customEventInput = document.getElementById('customEventInput');
  customEventInput.addEventListener('input', (e) => {
    state.eventName = e.target.value.trim() || 'પ્રસંગ નિમિત્તે';
    triggerRender();
  });

  // Donation Amount
  const amountInput = document.getElementById('donationAmount');
  amountInput.addEventListener('input', (e) => {
    state.donationAmount = e.target.value.trim() || '0';
    // Highlight matching button if any
    document.querySelectorAll('.amount-btn').forEach(btn => {
      btn.classList.toggle('active', btn.textContent.replace(/[₹,]/g, '').trim() === state.donationAmount);
    });
    triggerRender();
  });

  // Donation Date
  const dateInput = document.getElementById('donationDate');
  dateInput.addEventListener('input', (e) => {
    state.donationDate = e.target.value.trim();
    triggerRender();
  });

  // Photo Adjustment Sliders
  const zoomSlider = document.getElementById('zoomSlider');
  const zoomVal = document.getElementById('zoomVal');
  zoomSlider.addEventListener('input', (e) => {
    state.donorZoom = parseFloat(e.target.value);
    zoomVal.textContent = state.donorZoom.toFixed(2) + 'x';
    triggerRender();
  });

  const panXSlider = document.getElementById('panXSlider');
  const panXVal = document.getElementById('panXVal');
  panXSlider.addEventListener('input', (e) => {
    state.donorPanX = parseInt(e.target.value, 10);
    panXVal.textContent = state.donorPanX + '%';
    triggerRender();
  });

  const panYSlider = document.getElementById('panYSlider');
  const panYVal = document.getElementById('panYVal');
  panYSlider.addEventListener('input', (e) => {
    state.donorPanY = parseInt(e.target.value, 10);
    panYVal.textContent = state.donorPanY + '%';
    triggerRender();
  });

  // Photo File Input
  const photoInput = document.getElementById('donorPhotoInput');
  photoInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      handlePhotoFile(e.target.files[0]);
    }
  });
}

/**
 * Handle Photo Upload File
 */
function handlePhotoFile(file) {
  if (!file.type.startsWith('image/')) {
    showToast('કૃપા કરી માત્ર ઈમેજ ફાઈલ (JPG/PNG) પસંદ કરો');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    state.donorPhotoUrl = e.target.result;
    const removeBtn = document.getElementById('removePhotoBtn');
    if (removeBtn) removeBtn.style.display = 'inline-block';
    resetPhotoControls();
    triggerRender();
    showToast('ફોટો સફળતાપૂર્વક અપલોડ થયો! 📷');
  };
  reader.readAsDataURL(file);
}

/**
 * Remove uploaded donor photo
 */
function removeDonorPhoto() {
  state.donorPhotoUrl = null;
  const input = document.getElementById('donorPhotoInput');
  if (input) input.value = '';
  const removeBtn = document.getElementById('removePhotoBtn');
  if (removeBtn) removeBtn.style.display = 'none';
  resetPhotoControls();
  triggerRender();
  showToast('દાતાનો ફોટો હટાવી દીધો 🗑️');
}

/**
 * Drag and Drop initialization for photo uploader
 */
function initDragAndDrop() {
  const dropZone = document.getElementById('dropZone');
  if (!dropZone) return;

  ['dragenter', 'dragover'].forEach(name => {
    dropZone.addEventListener(name, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropZone.classList.add('dragover');
    });
  });

  ['dragleave', 'drop'].forEach(name => {
    dropZone.addEventListener(name, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropZone.classList.remove('dragover');
    });
  });

  dropZone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    if (dt && dt.files && dt.files[0]) {
      handlePhotoFile(dt.files[0]);
    }
  });
}

/**
 * Reset photo zoom and pan sliders
 */
function resetPhotoControls() {
  state.donorZoom = 1.0;
  state.donorPanX = 0;
  state.donorPanY = 0;

  document.getElementById('zoomSlider').value = 1.0;
  document.getElementById('zoomVal').textContent = '1.0x';
  document.getElementById('panXSlider').value = 0;
  document.getElementById('panXVal').textContent = '0%';
  document.getElementById('panYSlider').value = 0;
  document.getElementById('panYVal').textContent = '0%';

  triggerRender();
}

/**
 * Event grid button listeners
 */
function initEventButtons() {
  const buttons = document.querySelectorAll('.event-card-btn');
  const customInput = document.getElementById('customEventInput');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const eventType = btn.getAttribute('data-event');
      if (eventType === 'custom') {
        customInput.focus();
        customInput.select();
      } else {
        customInput.value = eventType;
        state.eventName = eventType;
        triggerRender();
      }
    });
  });
}

/**
 * Quick Honorific insertion for donor name
 */
function appendNamePrefix(text) {
  const input = document.getElementById('donorName');
  if (text.startsWith('+') || text.endsWith(' ')) {
    // Prefix
    if (!input.value.startsWith(text.trim())) {
      input.value = text + input.value.trim();
    }
  } else if (text.startsWith(' ')) {
    // Suffix with space
    input.value = input.value.trim() + text;
  } else {
    // Suffix
    input.value = input.value.trim() + ' ' + text;
  }
  state.donorName = input.value;
  triggerRender();
  input.focus();
}

/**
 * Quick donation amount setting
 */
function setAmount(amt) {
  state.donationAmount = amt;
  document.getElementById('donationAmount').value = amt;

  document.querySelectorAll('.amount-grid .amount-btn').forEach(btn => {
    btn.classList.toggle('active', btn.textContent.replace(/[₹,]/g, '').trim() === amt);
  });

  triggerRender();
}

/**
 * Set today's date formatted DD-MM-YYYY
 */
function setTodayDate() {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yyyy = today.getFullYear();
  const dateStr = `${dd}-${mm}-${yyyy}`;

  document.getElementById('donationDate').value = dateStr;
  state.donationDate = dateStr;
  triggerRender();
  showToast(`આજની તારીખ સેટ થઈ: ${dateStr} 📅`);
}

/**
 * Accordion toggle for settings
 */
function toggleAccordion(id) {
  const content = document.getElementById(id);
  const arrow = document.getElementById('settingsArrow');
  if (!content) return;

  const isOpen = content.classList.contains('open');
  if (isOpen) {
    content.classList.remove('open');
    if (arrow) arrow.textContent = '▼';
  } else {
    content.classList.add('open');
    if (arrow) arrow.textContent = '▲';
  }
}

/**
 * Load temple static configuration from config.js or config.json
 */
async function loadTempleConfig() {
  // 1. Load from config.js (runs natively on file:/// protocol)
  if (typeof window !== 'undefined' && window.TEMPLE_CONFIG) {
    applyTempleConfig(window.TEMPLE_CONFIG);
  }

  // 2. If running on a web server (http / https), attempt to fetch config.json
  try {
    if (window.location.protocol.startsWith('http')) {
      const res = await fetch('config.json');
      if (res.ok) {
        const json = await res.json();
        applyTempleConfig(json);
      }
    }
  } catch (e) {
    // Expected on local file:/// protocol
  }
}

/**
 * Apply configuration to state & update header
 */
function applyTempleConfig(cfg) {
  if (!cfg || typeof cfg !== 'object') return;

  if (cfg.deityNames) state.deityNames = cfg.deityNames;
  if (cfg.templeName !== undefined) state.templeName = cfg.templeName;
  if (cfg.tagline !== undefined) state.tagline = cfg.tagline;
  if (cfg.purposeLine !== undefined) state.purposeLine = cfg.purposeLine;
  if (cfg.villageLine !== undefined) state.villageLine = cfg.villageLine;
  if (cfg.footerLine1 !== undefined) state.footerLine1 = cfg.footerLine1;
  if (cfg.footerLine2 !== undefined) state.footerLine2 = cfg.footerLine2;
  if (cfg.footerLine3 !== undefined) state.footerLine3 = cfg.footerLine3;

  triggerRender();
}

/**
 * Reset entire form for a new donor
 */
function resetForm() {
  document.getElementById('donorName').value = '';
  state.donorName = '';
  state.donorPhotoUrl = null;
  const input = document.getElementById('donorPhotoInput');
  if (input) input.value = '';
  const removeBtn = document.getElementById('removePhotoBtn');
  if (removeBtn) removeBtn.style.display = 'none';
  document.getElementById('donationAmount').value = '501';
  state.donationAmount = '501';
  setTodayDate();
  resetPhotoControls();
  triggerRender();
  showToast('નવા દાતા માટે ફોર્મ રીસેટ થઈ ગયું! ✍️');
}

/**
 * Download Poster as High-Resolution PNG
 */
async function downloadPoster() {
  showToast('પોસ્ટર તૈયાર થઈ રહ્યું છે... ⏳');
  
  // High quality re-render
  await renderer.render(state);

  const canvas = document.getElementById('posterCanvas');
  const filename = `આલ-પરિવાર-મઢ-દાન-${(state.donorName || 'દાતા').replace(/\s+/g, '_')}.png`;

  if (canvas.toBlob) {
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      fireConfetti();
      showToast('પોસ્ટર સફળતાપૂર્વક ડાઉનલોડ થઈ ગયું! 🎉');
    }, 'image/png', 1.0);
  } else {
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename;
    a.click();
    fireConfetti();
    showToast('પોસ્ટર ડાઉનલોડ થઈ ગયું! 🎉');
  }
}

/**
 * Share directly to WhatsApp with text + file if supported
 */
async function shareToWhatsApp() {
  const canvas = document.getElementById('posterCanvas');
  const deitiesHeader = (state.deityNames && state.deityNames.length) ? state.deityNames.join(' | ') : 'આલ પરિવાર મઢ';
  const messageText = `🛕 *${state.footerLine1 || 'આલ પરિવાર મઢ - ભેચડા'}*\n${deitiesHeader}\n${state.villageLine}\n\n🎉 *${state.eventName}*\n👤 *દાતા:* ${state.donorName || 'દાતા'}\n💰 *દાન રકમ:* ₹${state.donationAmount}/-\n📅 *તારીખ:* ${state.donationDate}\n\n🙏 *${state.footerLine2}*\n${state.footerLine3}`;

  // Check if Web Share API with files is supported (Modern Android / iOS / Chrome)
  if (navigator.canShare && canvas.toBlob) {
    try {
      const blob = await renderer.toBlob('image/png', 1.0);
      const file = new File([blob], 'aal_parivar_madh_poster.png', { type: 'image/png' });

      if (navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'આલ પરિવાર મઢ - દાન પોસ્ટર',
          text: messageText
        });
        showToast('વોટ્સએપ / સોશિયલ મીડિયા પર શેર થયું! 📲');
        return;
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.warn('Web Share API error:', err);
      }
    }
  }

  // Fallback: Open WhatsApp with message text
  const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(messageText)}`;
  window.open(waUrl, '_blank');
  showToast('વોટ્સએપ ખુલી રહ્યું છે... (સાથે પોસ્ટર ડાઉનલોડ કરી અટેચ કરો) 📲');
}

/**
 * Copy image to Clipboard
 */
async function copyImageToClipboard() {
  if (!navigator.clipboard || !window.ClipboardItem) {
    showToast('આ બ્રાઉઝરમાં ક્લિપબોર્ડ કોપી સપોર્ટેડ નથી, કૃપા કરી ડાઉનલોડ કરો');
    return;
  }

  try {
    const blob = await renderer.toBlob('image/png');
    await navigator.clipboard.write([
      new ClipboardItem({ 'image/png': blob })
    ]);
    showToast('પોસ્ટર ક્લિપબોર્ડ પર કોપી થયું! હવે WhatsApp પર Ctrl+V થી પેસ્ટ કરો 📋');
  } catch (err) {
    console.error('Clipboard copy failed:', err);
    showToast('ક્લિપબોર્ડ કોપીમાં સમસ્યા આવી, ડાઉનલોડ બટનનો ઉપયોગ કરો');
  }
}

/**
 * Toast Notification System
 */
function showToast(message) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>🔔</span> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

/**
 * Confetti celebration animation on download
 */
function fireConfetti() {
  const canvas = document.getElementById('confettiCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const colors = ['#f59e0b', '#fde047', '#10b981', '#06b6d4', '#ec4899', '#8b5cf6'];

  for (let i = 0; i < 90; i++) {
    particles.push({
      x: window.innerWidth / 2,
      y: window.innerHeight * 0.45,
      r: Math.random() * 6 + 4,
      d: Math.random() * 90,
      color: colors[Math.floor(Math.random() * colors.length)],
      tilt: Math.floor(Math.random() * 10) - 10,
      tiltAngleInc: Math.random() * 0.07 + 0.05,
      tiltAngle: 0,
      vx: (Math.random() - 0.5) * 16,
      vy: (Math.random() - 0.7) * 16
    });
  }

  let animationFrame;
  let opacity = 1.0;

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = opacity;

    particles.forEach(p => {
      p.tiltAngle += p.tiltAngleInc;
      p.y += p.vy;
      p.x += p.vx;
      p.vy += 0.35; // gravity

      ctx.beginPath();
      ctx.lineWidth = p.r / 2;
      ctx.strokeStyle = p.color;
      ctx.moveTo(p.x + p.tilt + p.r, p.y);
      ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r);
      ctx.stroke();
    });

    opacity -= 0.012;
    if (opacity > 0) {
      animationFrame = requestAnimationFrame(draw);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      cancelAnimationFrame(animationFrame);
    }
  }

  draw();
}

/**
 * Smooth scroll to poster preview (for mobile users)
 */
function scrollToPreview() {
  const preview = document.querySelector('.preview-column');
  if (preview) {
    preview.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}


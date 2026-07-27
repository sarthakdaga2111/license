/* ============================================================
   FRIENDSHIP LICENSE DATABASE — SCRIPT
   Sections:
   1. Loading Screen Sequence
   2. Last Verification Date
   3. Scroll Reveal (fade-up + timeline)
   4. Count-Up Numbers + Progress Bars
   5. Renew License Modal + Ripple
   6. Confetti
============================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================
     1. LOADING SCREEN SEQUENCE
  ============================================================= */
  const loadingScreen = document.getElementById('loading-screen');
  const loadingStatus = document.getElementById('loading-status');
  const progressFill = document.getElementById('loading-progress-fill');
  const progressPercent = document.getElementById('loading-percent');
  const site = document.getElementById('site');

  const loadingMessages = [
    'Initializing Database...',
    'Authenticating Holder...',
    'Connecting To Friendship Records...',
    'Checking License...',
    'Verifying...',
    'License Verified ✓'
  ];

  const totalDuration = 3000; // ~3 seconds
  const stepDuration = totalDuration / loadingMessages.length;
  let messageIndex = 0;

  function updateLoadingMessage() {
    if (messageIndex < loadingMessages.length) {
      loadingStatus.textContent = loadingMessages[messageIndex];
      messageIndex++;
      setTimeout(updateLoadingMessage, stepDuration);
    }
  }
  updateLoadingMessage();

  // Animate progress bar smoothly from 0 to 100
  let progress = 0;
  const progressInterval = setInterval(() => {
    progress += 100 / (totalDuration / 30);
    if (progress >= 100) {
      progress = 100;
      clearInterval(progressInterval);
    }
    progressFill.style.width = progress + '%';
    progressPercent.textContent = Math.round(progress) + '%';
  }, 30);

  // Fade to site after loading completes
  setTimeout(() => {
    loadingScreen.classList.add('loading-hidden');
    site.classList.add('site-visible');
    document.body.style.overflow = 'auto';

    // Kick off stat bar animation once site is visible
    setTimeout(animateStats, 400);
  }, totalDuration + 300);


  /* ============================================================
     2. LAST VERIFICATION DATE
  ============================================================= */
  const dateEl = document.getElementById('last-verification-date');
  if (dateEl) {
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    dateEl.textContent = today.toLocaleDateString('en-US', options);
  }


  /* ============================================================
     3. SCROLL REVEAL (fade-up elements + timeline)
  ============================================================= */
  const fadeUpEls = document.querySelectorAll('.fade-up');
  const timelineItems = document.querySelectorAll('.timeline-item');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-up-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  fadeUpEls.forEach((el) => revealObserver.observe(el));

  const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = Array.from(timelineItems).indexOf(el) % 6 * 80;
        setTimeout(() => el.classList.add('timeline-visible'), delay);
        timelineObserver.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  timelineItems.forEach((el) => timelineObserver.observe(el));


  /* ============================================================
     4. COUNT-UP NUMBERS + PROGRESS BARS
  ============================================================= */
  let statsAnimated = false;

  function animateStats() {
    if (statsAnimated) return;
    statsAnimated = true;

    const fills = document.querySelectorAll('.stat-fill[data-value]');
    const numbers = document.querySelectorAll('.stat-number[data-count-to]');

    // Animate width of bars
    fills.forEach((fill) => {
      const value = fill.getAttribute('data-value');
      requestAnimationFrame(() => {
        fill.style.width = value + '%';
      });
    });

    // Animate count-up numbers
    numbers.forEach((numEl) => {
      const target = parseInt(numEl.getAttribute('data-count-to'), 10);
      const duration = 1400;
      const startTime = performance.now();

      function tick(now) {
        const elapsed = now - startTime;
        const progressRatio = Math.min(elapsed / duration, 1);
        // ease-out cubic
        const eased = 1 - Math.pow(1 - progressRatio, 3);
        const current = Math.round(eased * target);
        numEl.textContent = current + '%';
        if (progressRatio < 1) {
          requestAnimationFrame(tick);
        } else {
          numEl.textContent = target + '%';
        }
      }
      requestAnimationFrame(tick);
    });
  }

  // Fallback: also trigger stats if analysis section is scrolled into view
  const analysisSection = document.querySelector('.analysis-section');
  if (analysisSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateStats();
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    statsObserver.observe(analysisSection);
  }


  /* ============================================================
     5. RENEW LICENSE MODAL + BUTTON RIPPLE
  ============================================================= */
  const renewTrigger = document.getElementById('renew-trigger');
  const modalOverlay = document.getElementById('modal-overlay');
  const modalProcessing = document.getElementById('modal-processing');
  const modalSuccess = document.getElementById('modal-success');
  const modalClose = document.getElementById('modal-close');

  function createRipple(e, button) {
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    const rect = button.getBoundingClientRect();

    circle.style.width = circle.style.height = diameter + 'px';
    circle.style.left = (e.clientX - rect.left - radius) + 'px';
    circle.style.top = (e.clientY - rect.top - radius) + 'px';
    circle.classList.add('ripple');

    const existingRipple = button.querySelector('.ripple');
    if (existingRipple) existingRipple.remove();

    button.appendChild(circle);
    setTimeout(() => circle.remove(), 600);
  }

  if (renewTrigger) {
    renewTrigger.addEventListener('click', (e) => {
      createRipple(e, renewTrigger);
      openRenewModal();
    });
  }

  function openRenewModal() {
    modalOverlay.hidden = false;
    modalProcessing.classList.remove('modal-state-hidden');
    modalSuccess.classList.add('modal-state-hidden');
    document.body.style.overflow = 'hidden';

    setTimeout(() => {
      modalProcessing.classList.add('modal-state-hidden');
      modalSuccess.classList.remove('modal-state-hidden');
      launchConfetti();
    }, 2000);
  }

  function closeRenewModal() {
    modalOverlay.hidden = true;
    document.body.style.overflow = 'auto';
  }

  if (modalClose) {
    modalClose.addEventListener('click', closeRenewModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeRenewModal();
    });
  }


  /* ============================================================
     6. CONFETTI (vanilla canvas)
  ============================================================= */
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');
  let confettiPieces = [];
  let confettiAnimationId = null;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const confettiColors = ['#EC6A96', '#F8BBD0', '#FFD4E2', '#28A745', '#FFFFFF'];

  function createConfettiPiece() {
    return {
      x: Math.random() * canvas.width,
      y: -20,
      size: Math.random() * 8 + 4,
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      speedY: Math.random() * 3 + 2,
      speedX: Math.random() * 2 - 1,
      rotation: Math.random() * 360,
      rotationSpeed: Math.random() * 8 - 4,
      opacity: 1
    };
  }

  function launchConfetti() {
    confettiPieces = [];
    for (let i = 0; i < 120; i++) {
      confettiPieces.push(createConfettiPiece());
    }
    if (!confettiAnimationId) {
      animateConfetti();
    }

    // Stop spawning effect after a few seconds by letting pieces fall off screen
    setTimeout(() => {
      confettiPieces = confettiPieces.filter((p) => p.y < canvas.height + 40);
    }, 3500);
  }

  function animateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    confettiPieces.forEach((p) => {
      p.y += p.speedY;
      p.x += p.speedX;
      p.rotation += p.rotationSpeed;
      if (p.y > canvas.height - 100) {
        p.opacity -= 0.02;
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = Math.max(p.opacity, 0);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.4);
      ctx.restore();
    });

    confettiPieces = confettiPieces.filter((p) => p.opacity > 0 && p.y < canvas.height + 40);

    if (confettiPieces.length > 0) {
      confettiAnimationId = requestAnimationFrame(animateConfetti);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      confettiAnimationId = null;
    }
  }

});

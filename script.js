/* ===========================
   FLOATING HEARTS ENGINE
=========================== */
const HEART_EMOJIS = ['❤️', '🩷', '💗', '💓', '💕', '💖', '🌸', '💝', '💞'];

function createHeart(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const heart = document.createElement('div');
  heart.classList.add('floating-heart');
  heart.textContent = HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)];

  // Random horizontal position
  heart.style.left = Math.random() * 100 + 'vw';

  // Random size
  const size = 0.9 + Math.random() * 1.4;
  heart.style.fontSize = size + 'rem';

  // Random duration (8–18s)
  const duration = 8 + Math.random() * 10;
  heart.style.animationDuration = duration + 's';

  // Random delay (0–5s)
  heart.style.animationDelay = Math.random() * 5 + 's';

  container.appendChild(heart);

  // Remove after animation completes
  setTimeout(() => heart.remove(), (duration + 5) * 1000);
}

function startHearts(containerId, interval = 700) {
  createHeart(containerId);
  return setInterval(() => createHeart(containerId), interval);
}

// Start hearts on page 1
let heartInterval1 = startHearts('heartsContainer1', 650);
let heartInterval2 = null;

/* ===========================
   PAGE NAVIGATION
=========================== */
function goToPage2() {
  const page1 = document.getElementById('page1');
  const page2 = document.getElementById('page2');

  page1.classList.add('fade-out');

  setTimeout(() => {
    page1.classList.remove('active');
    page1.classList.remove('fade-out');
    page1.style.display = 'none';

    page2.style.display = 'block';
    page2.classList.add('active');

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Start hearts on page 2
    if (!heartInterval2) {
      heartInterval2 = startHearts('heartsContainer2', 800);
    }

    // Trigger animations after page is shown
    setTimeout(() => {
      animateCardsIn();
      startTypingAnimation();
    }, 200);

  }, 400);
}

function goToPage1() {
  const page1 = document.getElementById('page1');
  const page2 = document.getElementById('page2');

  page2.classList.add('fade-out');

  setTimeout(() => {
    page2.classList.remove('active');
    page2.classList.remove('fade-out');
    page2.style.display = 'none';

    page1.style.display = '';
    page1.classList.add('active');

    window.scrollTo({ top: 0, behavior: 'instant' });

    // Reset page 2 animations for re-entry
    resetPage2();

  }, 400);
}

/* ===========================
   CARD INTERSECTION OBSERVER
=========================== */
function animateCardsIn() {
  const cards = document.querySelectorAll('.card');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');

        // Animate child list items
        const listItems = entry.target.querySelectorAll('.list-item, .promise-item');
        listItems.forEach((item, i) => {
          const delay = parseInt(item.dataset.delay || 0) + 200;
          setTimeout(() => item.classList.add('visible'), delay);
        });

        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  cards.forEach((card, i) => {
    card.style.transitionDelay = (i * 0.12) + 's';
    observer.observe(card);
  });
}

/* ===========================
   TYPING ANIMATION
=========================== */
const APOLOGY_TEXT =
  'मला माहित आहे मी तुला hurt केलं. ' +
  'माझ्याकडून चूक झाली. ' +
  'पण तुला दुखवणं कधीच माझा हेतू नव्हता. ' +
  'तू माझ्यासाठी खूप important आहेस — ' +
  'आणि मी तुझ्याशिवाय अपूर्ण आहे.';

let typingTimer = null;
let typingDone = false;

function startTypingAnimation() {
  if (typingDone) return;

  const target = document.getElementById('apologyTyping');
  const cursor = document.getElementById('typingCursor');
  if (!target || !cursor) return;

  target.textContent = '';
  cursor.classList.remove('hidden');

  let i = 0;
  const speed = 38; // ms per character

  function type() {
    if (i < APOLOGY_TEXT.length) {
      target.textContent += APOLOGY_TEXT[i];
      i++;
      typingTimer = setTimeout(type, speed);
    } else {
      // Typing done — blink cursor a few more times then hide
      setTimeout(() => {
        cursor.classList.add('hidden');
      }, 2000);
      typingDone = true;
    }
  }

  // Small delay before starting
  setTimeout(type, 600);
}

function resetPage2() {
  // Reset typing
  clearTimeout(typingTimer);
  typingDone = false;
  const target = document.getElementById('apologyTyping');
  const cursor = document.getElementById('typingCursor');
  if (target) target.textContent = '';
  if (cursor) cursor.classList.remove('hidden');

  // Reset card visibility
  document.querySelectorAll('.card').forEach(c => {
    c.classList.remove('visible');
    c.style.transitionDelay = '';
  });
  document.querySelectorAll('.list-item, .promise-item').forEach(el => {
    el.classList.remove('visible');
  });
}

/* ===========================
   FORGIVE POPUP
=========================== */
function showForgivePopup() {
  const overlay = document.getElementById('popupOverlay');
  overlay.classList.add('show');

  // Burst hearts inside popup
  const popupHearts = document.getElementById('popupHearts');
  burstHeartsInPopup(popupHearts);

  // Trigger confetti-like floating hearts briefly
  for (let i = 0; i < 5; i++) {
    setTimeout(() => createHeart('heartsContainer2'), i * 120);
  }
}

function closePopup() {
  const overlay = document.getElementById('popupOverlay');
  overlay.style.animation = 'fadeOutOverlay 0.3s ease forwards';
  setTimeout(() => {
    overlay.classList.remove('show');
    overlay.style.animation = '';
  }, 300);
}

// Add fade-out keyframe dynamically
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeOutOverlay {
    from { opacity: 1; }
    to   { opacity: 0; }
  }
`;
document.head.appendChild(style);

function burstHeartsInPopup(container) {
  if (!container) return;
  const miniHearts = ['❤️', '💗', '💕', '💖', '🩷', '🌸'];

  for (let i = 0; i < 12; i++) {
    const h = document.createElement('div');
    h.style.cssText = `
      position: absolute;
      font-size: ${0.8 + Math.random()}rem;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      opacity: 0;
      animation: popupHeart ${1.5 + Math.random()}s ease forwards;
      animation-delay: ${Math.random() * 0.8}s;
      pointer-events: none;
    `;
    h.textContent = miniHearts[Math.floor(Math.random() * miniHearts.length)];
    container.appendChild(h);
    setTimeout(() => h.remove(), 3000);
  }
}

// Add popup heart animation
const popupStyle = document.createElement('style');
popupStyle.textContent = `
  @keyframes popupHeart {
    0%   { opacity: 0; transform: scale(0) translateY(0); }
    30%  { opacity: 1; }
    100% { opacity: 0; transform: scale(1.5) translateY(-60px); }
  }
`;
document.head.appendChild(popupStyle);

/* ===========================
   CLOSE POPUP ON OVERLAY CLICK
=========================== */
document.getElementById('popupOverlay').addEventListener('click', function(e) {
  if (e.target === this) closePopup();
});

/* ===========================
   KEYBOARD: ESC closes popup
=========================== */
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closePopup();
});

/* ===========================
   INITIAL EXTRA HEARTS BURST
=========================== */
// Burst a few hearts on load for delight
setTimeout(() => {
  for (let i = 0; i < 6; i++) {
    setTimeout(() => createHeart('heartsContainer1'), i * 200);
  }
}, 500);

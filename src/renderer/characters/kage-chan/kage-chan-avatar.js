/**
 * KAGE-CHAN Avatar — High Definition Layered SVG Vector Character
 * Renders Kage's anime companion with dynamic expressions and layered hair physics.
 */

function createKageChanSVG() {
  return `
    <div class="kage-chan-container" id="kage-chan-avatar">
      <!-- Glow Aura -->
      <div class="kc-aura"></div>

      <!-- Sparkles / Floating Petals -->
      <div class="kc-particle p1"></div>
      <div class="kc-particle p2"></div>
      <div class="kc-particle p3"></div>

      <!-- Emote Bubble -->
      <div class="kc-emote" id="kc-emote"></div>

      <svg class="kc-svg" viewBox="0 0 220 250" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <!-- Skin Gradient -->
          <linearGradient id="skinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#fff5f2" />
            <stop offset="100%" stop-color="#ffe6e0" />
          </linearGradient>

          <!-- Hair Dark with Crimson Gradient -->
          <linearGradient id="hairGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#141419" />
            <stop offset="65%" stop-color="#24141e" />
            <stop offset="100%" stop-color="#99001a" />
          </linearGradient>

          <linearGradient id="hairHighlightGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ff1a2b" />
            <stop offset="100%" stop-color="#7a0010" />
          </linearGradient>

          <!-- Crimson Anime Eye Gradient -->
          <radialGradient id="kcEyeGrad" cx="50%" cy="40%" r="55%">
            <stop offset="0%" stop-color="#ff6677" />
            <stop offset="45%" stop-color="#e60026" />
            <stop offset="85%" stop-color="#730010" />
            <stop offset="100%" stop-color="#2e0006" />
          </radialGradient>

          <!-- Dress Black & Red -->
          <linearGradient id="dressGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#1e1e26" />
            <stop offset="100%" stop-color="#0c0c10" />
          </linearGradient>

          <filter id="kcEyeGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <!-- Back Hair (Behind Body) -->
        <g class="kc-hair-back" id="kc-hair-back">
          <!-- Left flowing locks -->
          <path d="M 68 80 C 40 100 25 150 45 200 C 52 185 58 150 68 130 Z" fill="url(#hairGrad)" />
          <path d="M 52 140 C 42 165 44 195 56 215 C 60 190 64 165 72 145 Z" fill="url(#hairHighlightGrad)" opacity="0.85" />

          <!-- Right flowing locks -->
          <path d="M 152 80 C 180 100 195 150 175 200 C 168 185 162 150 152 130 Z" fill="url(#hairGrad)" />
          <path d="M 168 140 C 178 165 176 195 164 215 C 160 190 156 165 148 145 Z" fill="url(#hairHighlightGrad)" opacity="0.85" />

          <!-- Lower back mantle -->
          <path d="M 65 90 C 70 170 150 170 155 90 C 160 185 60 185 65 90 Z" fill="#101015" />
        </g>

        <!-- Cute Chibi Body / Dress -->
        <g class="kc-body-group" id="kc-body-group">
          <!-- Legs / Shoes -->
          <g class="kc-legs" id="kc-legs">
            <rect x="96" y="195" width="8" height="22" rx="4" fill="#14141a" />
            <rect x="116" y="195" width="8" height="22" rx="4" fill="#14141a" />
            <!-- Crimson Mary Jane Shoes -->
            <ellipse cx="100" cy="216" rx="6" ry="4" fill="#ff1a2b" />
            <ellipse cx="120" cy="216" rx="6" ry="4" fill="#ff1a2b" />
          </g>

          <!-- Gothic Chibi Dress -->
          <path d="M 85 140 L 72 195 C 90 202 130 202 148 195 L 135 140 Z" fill="url(#dressGrad)" stroke="#1a1a22" stroke-width="1.5" />
          <!-- Crimson Hem & Trim -->
          <path d="M 72 195 Q 110 206 148 195" stroke="#ff1a2b" stroke-width="2.5" fill="none" />
          <!-- Apron / Corset detail -->
          <path d="M 96 148 L 102 175 L 118 175 L 124 148 Z" fill="#14141c" stroke="#ff1a2b" stroke-width="1" />
          <line x1="102" y1="155" x2="118" y2="155" stroke="#ff1a2b" stroke-width="1.2" />
          <line x1="104" y1="165" x2="116" y2="165" stroke="#ff1a2b" stroke-width="1.2" />

          <!-- Collar & VOIDKAGE Ribbon -->
          <polygon points="100,136 110,146 120,136 110,138" fill="#fff5f2" />
          <ellipse cx="110" cy="144" rx="4" ry="4" fill="#ff1a2b" filter="url(#kcEyeGlow)" />
          <!-- Small ribbon tails -->
          <path d="M 108 146 L 104 156 L 108 154 Z" fill="#ff1a2b" />
          <path d="M 112 146 L 116 156 L 112 154 Z" fill="#ff1a2b" />

          <!-- Arms / Sleeves -->
          <g class="kc-arms" id="kc-arms">
            <!-- Left Arm -->
            <path id="arm-left" d="M 86 142 Q 74 160 84 172" stroke="#1e1e26" stroke-width="7" stroke-linecap="round" fill="none" />
            <circle id="hand-left" cx="84" cy="172" r="4.5" fill="#fff5f2" />

            <!-- Right Arm -->
            <path id="arm-right" d="M 134 142 Q 146 160 136 172" stroke="#1e1e26" stroke-width="7" stroke-linecap="round" fill="none" />
            <circle id="hand-right" cx="136" cy="172" r="4.5" fill="#fff5f2" />
          </g>
        </g>

        <!-- Chibi Head Base -->
        <g class="kc-head-group" id="kc-head-group">
          <!-- Head Shape -->
          <path d="M 66 90 C 66 50 154 50 154 90 C 154 125 140 142 110 142 C 80 142 66 125 66 90 Z" fill="url(#skinGrad)" />

          <!-- Soft Blush Cheeks -->
          <g class="kc-blush" id="kc-blush">
            <ellipse cx="80" cy="115" rx="9" ry="5" fill="#ff4d66" opacity="0.5" filter="url(#kcEyeGlow)" />
            <ellipse cx="140" cy="115" rx="9" ry="5" fill="#ff4d66" opacity="0.5" filter="url(#kcEyeGlow)" />
          </g>

          <!-- Eyes Group -->
          <g class="kc-eyes" id="kc-eyes">
            <!-- Left Eye -->
            <g class="kc-eye-group eye-l" id="kc-eye-left">
              <!-- Sclera -->
              <ellipse cx="88" cy="98" rx="13" ry="17" fill="#ffffff" />
              <!-- Crimson Iris -->
              <ellipse id="kc-eye-l-iris" cx="89" cy="98" rx="10" ry="14" fill="url(#kcEyeGrad)" filter="url(#kcEyeGlow)" />
              <!-- Pupil -->
              <ellipse id="kc-eye-l-pupil" cx="89" cy="99" rx="4" ry="7" fill="#290005" />
              <!-- Highlights -->
              <circle cx="86" cy="92" r="4" fill="#ffffff" />
              <circle cx="93" cy="103" r="2" fill="#ffffff" opacity="0.8" />
              <!-- Upper Eyelash / Eyelid -->
              <path d="M 74 94 Q 89 83 103 94" stroke="#141419" stroke-width="3" fill="none" stroke-linecap="round" />
              <path d="M 73 93 L 70 89" stroke="#141419" stroke-width="2" stroke-linecap="round" />
              <!-- Closed Happy/Sleeping Line -->
              <path id="kc-eye-l-closed" d="M 76 98 Q 89 110 102 98" stroke="#141419" stroke-width="3" fill="none" stroke-linecap="round" style="display:none;" />
            </g>

            <!-- Right Eye -->
            <g class="kc-eye-group eye-r" id="kc-eye-right">
              <ellipse cx="132" cy="98" rx="13" ry="17" fill="#ffffff" />
              <ellipse id="kc-eye-r-iris" cx="131" cy="98" rx="10" ry="14" fill="url(#kcEyeGrad)" filter="url(#kcEyeGlow)" />
              <ellipse id="kc-eye-r-pupil" cx="131" cy="99" rx="4" ry="7" fill="#290005" />
              <circle cx="128" cy="92" r="4" fill="#ffffff" />
              <circle cx="135" cy="103" r="2" fill="#ffffff" opacity="0.8" />
              <path d="M 117 94 Q 131 83 146 94" stroke="#141419" stroke-width="3" fill="none" stroke-linecap="round" />
              <path d="M 147 93 L 150 89" stroke="#141419" stroke-width="2" stroke-linecap="round" />
              <path id="kc-eye-r-closed" d="M 118 98 Q 131 110 144 98" stroke="#141419" stroke-width="3" fill="none" stroke-linecap="round" style="display:none;" />
            </g>

            <!-- Eyebrows -->
            <path id="brow-l" d="M 77 82 Q 88 77 99 82" stroke="#24141e" stroke-width="2.2" fill="none" stroke-linecap="round" />
            <path id="brow-r" d="M 121 82 Q 132 77 143 82" stroke="#24141e" stroke-width="2.2" fill="none" stroke-linecap="round" />
          </g>

          <!-- Nose dot -->
          <circle cx="110" cy="111" r="1.2" fill="#e6b0a8" />

          <!-- Expressive Mouth -->
          <g class="kc-mouth" id="kc-mouth">
            <path id="kc-mouth-path" d="M 105 120 Q 110 124 115 120" stroke="#e04050" stroke-width="2" fill="none" stroke-linecap="round" />
            <path id="kc-mouth-open" d="M 104 118 Q 110 130 116 118 Z" fill="#99001a" stroke="#e04050" stroke-width="1.5" style="display:none;" />
          </g>
        </g>

        <!-- Front Hair & Accessories -->
        <g class="kc-hair-front" id="kc-hair-front">
          <!-- Chibi Bangs -->
          <path d="M 68 76 C 75 98 84 100 88 88 C 94 103 105 104 110 88 C 115 104 126 103 132 88 C 136 100 145 98 152 76 C 150 50 70 50 68 76 Z" fill="url(#hairGrad)" />

          <!-- Crimson Front Streak Highlighting -->
          <path d="M 88 86 C 92 98 98 100 102 90" stroke="#ff1a2b" stroke-width="2.2" fill="none" stroke-linecap="round" />
          <path d="M 122 88 C 126 99 132 99 135 90" stroke="#ff1a2b" stroke-width="2.2" fill="none" stroke-linecap="round" />

          <!-- Left Side Bang Lock -->
          <path d="M 66 78 C 60 105 60 135 68 152 C 72 135 72 105 76 85 Z" fill="url(#hairGrad)" />
          <path d="M 63 115 C 62 135 66 150 68 152" stroke="#ff1a2b" stroke-width="2.5" fill="none" stroke-linecap="round" />

          <!-- Right Side Bang Lock -->
          <path d="M 154 78 C 160 105 160 135 152 152 C 148 135 148 105 144 85 Z" fill="url(#hairGrad)" />
          <path d="M 157 115 C 158 135 154 150 152 152" stroke="#ff1a2b" stroke-width="2.5" fill="none" stroke-linecap="round" />

          <!-- Hair Ribbon Clips (Gothic Bats / Bows) -->
          <!-- Left Clip -->
          <g class="kc-clip-l" transform="translate(62, 56) rotate(-15)">
            <ellipse cx="0" cy="0" rx="8" ry="4" fill="#ff1a2b" />
            <circle cx="0" cy="0" r="3" fill="#111115" />
          </g>
          <!-- Right Clip -->
          <g class="kc-clip-r" transform="translate(158, 56) rotate(15)">
            <ellipse cx="0" cy="0" rx="8" ry="4" fill="#ff1a2b" />
            <circle cx="0" cy="0" r="3" fill="#111115" />
          </g>
        </g>
      </svg>
    </div>
  `;
}

function setKageChanState(state, container) {
  const avatar = container.querySelector('#kage-chan-avatar');
  if (!avatar) return;

  const states = [
    'idle', 'happy', 'sad', 'curious', 'angry', 'sleepy',
    'surprised', 'excited', 'walking', 'sitting', 'sleeping', 'talking', 'teasing'
  ];
  states.forEach(s => avatar.classList.remove(`state-${s}`));
  avatar.classList.add(`state-${state}`);

  const eyeL = avatar.querySelector('#kc-eye-left');
  const eyeR = avatar.querySelector('#kc-eye-right');
  const eyeLIris = avatar.querySelector('#kc-eye-l-iris');
  const eyeRIris = avatar.querySelector('#kc-eye-r-iris');
  const eyeLClosed = avatar.querySelector('#kc-eye-l-closed');
  const eyeRClosed = avatar.querySelector('#kc-eye-r-closed');
  const mouthPath = avatar.querySelector('#kc-mouth-path');
  const mouthOpen = avatar.querySelector('#kc-mouth-open');
  const blush = avatar.querySelector('#kc-blush');
  const emote = avatar.querySelector('#kc-emote');
  const browL = avatar.querySelector('#brow-l');
  const browR = avatar.querySelector('#brow-r');
  const armL = avatar.querySelector('#arm-left');
  const armR = avatar.querySelector('#arm-right');
  const handL = avatar.querySelector('#hand-left');
  const handR = avatar.querySelector('#hand-right');

  // Reset defaults
  eyeLIris.style.display = 'block';
  eyeRIris.style.display = 'block';
  eyeLClosed.style.display = 'none';
  eyeRClosed.style.display = 'none';
  mouthPath.style.display = 'block';
  mouthOpen.style.display = 'none';
  blush.style.opacity = '0.5';
  emote.textContent = '';
  emote.className = 'kc-emote';

  browL.setAttribute('d', 'M 77 82 Q 88 77 99 82');
  browR.setAttribute('d', 'M 121 82 Q 132 77 143 82');

  armL.setAttribute('d', 'M 86 142 Q 74 160 84 172');
  handL.setAttribute('cx', '84');
  handL.setAttribute('cy', '172');

  armR.setAttribute('d', 'M 134 142 Q 146 160 136 172');
  handR.setAttribute('cx', '136');
  handR.setAttribute('cy', '172');

  switch (state) {
    case 'happy':
      eyeLIris.style.display = 'none';
      eyeRIris.style.display = 'none';
      eyeLClosed.style.display = 'block';
      eyeRClosed.style.display = 'block';
      eyeLClosed.setAttribute('d', 'M 76 102 Q 89 86 102 102'); // Happy upward arch ^
      eyeRClosed.setAttribute('d', 'M 118 102 Q 131 86 144 102');
      mouthPath.style.display = 'none';
      mouthOpen.style.display = 'block';
      blush.style.opacity = '0.9';
      emote.textContent = '♥';
      emote.classList.add('show-heart');
      break;

    case 'sad':
      browL.setAttribute('d', 'M 77 80 Q 88 84 99 82');
      browR.setAttribute('d', 'M 121 82 Q 132 84 143 80');
      mouthPath.setAttribute('d', 'M 106 124 Q 110 119 114 124');
      emote.textContent = '💧';
      emote.classList.add('show-tear');
      break;

    case 'curious':
      browL.setAttribute('d', 'M 77 78 Q 88 74 99 78');
      mouthPath.setAttribute('d', 'M 107 120 A 3 3 0 1 0 113 120'); // small 'o'
      // Finger on chin pose
      armR.setAttribute('d', 'M 134 142 Q 138 128 116 124');
      handR.setAttribute('cx', '116');
      handR.setAttribute('cy', '124');
      emote.textContent = '?';
      emote.classList.add('show-question');
      break;

    case 'angry':
      // Tsundere pout
      browL.setAttribute('d', 'M 77 84 Q 88 80 99 76'); // sharp angled brows \ /
      browR.setAttribute('d', 'M 121 76 Q 132 80 143 84');
      mouthPath.setAttribute('d', 'M 105 123 L 115 123'); // straight pout line
      blush.style.opacity = '0.85';
      // Crossed arms
      armL.setAttribute('d', 'M 86 142 Q 100 156 120 152');
      handL.setAttribute('cx', '120');
      handL.setAttribute('cy', '152');
      armR.setAttribute('d', 'M 134 142 Q 120 156 100 152');
      handR.setAttribute('cx', '100');
      handR.setAttribute('cy', '152');
      emote.textContent = '💢';
      emote.classList.add('show-angry');
      break;

    case 'sleepy':
      // Eye rubbing
      armR.setAttribute('d', 'M 134 142 Q 142 115 132 100');
      handR.setAttribute('cx', '132');
      handR.setAttribute('cy', '100');
      mouthPath.setAttribute('d', 'M 106 121 Q 110 126 114 121');
      emote.textContent = 'zZ';
      emote.classList.add('show-zzz');
      break;

    case 'sleeping':
      eyeLIris.style.display = 'none';
      eyeRIris.style.display = 'none';
      eyeLClosed.style.display = 'block';
      eyeRClosed.style.display = 'block';
      eyeLClosed.setAttribute('d', 'M 77 98 L 101 98');
      eyeRClosed.setAttribute('d', 'M 119 98 L 143 98');
      mouthPath.setAttribute('d', 'M 108 121 Q 110 122 112 121');
      emote.textContent = 'Zzz...';
      emote.classList.add('show-zzz');
      break;

    case 'surprised':
      mouthPath.style.display = 'none';
      mouthOpen.style.display = 'block';
      mouthOpen.setAttribute('d', 'M 106 116 A 5 7 0 1 0 114 116');
      emote.textContent = '!';
      emote.classList.add('show-exclamation');
      break;

    case 'excited':
      eyeLIris.style.display = 'none';
      eyeRIris.style.display = 'none';
      eyeLClosed.style.display = 'block';
      eyeRClosed.style.display = 'block';
      eyeLClosed.setAttribute('d', 'M 76 102 Q 89 84 102 102');
      eyeRClosed.setAttribute('d', 'M 118 102 Q 131 84 144 102');
      mouthPath.style.display = 'none';
      mouthOpen.style.display = 'block';
      blush.style.opacity = '1';
      // Hands cheering upward
      armL.setAttribute('d', 'M 86 142 Q 68 120 74 105');
      handL.setAttribute('cx', '74');
      handL.setAttribute('cy', '105');
      armR.setAttribute('d', 'M 134 142 Q 152 120 146 105');
      handR.setAttribute('cx', '146');
      handR.setAttribute('cy', '105');
      emote.textContent = '★';
      emote.classList.add('show-star');
      break;

    case 'talking':
      mouthPath.style.display = 'none';
      mouthOpen.style.display = 'block';
      break;

    case 'teasing':
      // Wink left eye
      eyeLIris.style.display = 'none';
      eyeLClosed.style.display = 'block';
      eyeLClosed.setAttribute('d', 'M 76 102 Q 89 86 102 102');
      // Cat smile :3
      mouthPath.setAttribute('d', 'M 103 120 Q 106 124 110 121 Q 114 124 117 120');
      emote.textContent = '✧';
      break;

    case 'sitting':
      mouthPath.setAttribute('d', 'M 106 120 Q 110 123 114 120');
      break;

    case 'idle':
    default:
      mouthPath.setAttribute('d', 'M 105 120 Q 110 124 115 120');
      break;
  }
}

window.createKageChanSVG = createKageChanSVG;
window.setKageChanState = setKageChanState;

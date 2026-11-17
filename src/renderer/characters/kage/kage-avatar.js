/**
 * KAGE Avatar — High Definition Layered SVG Vector Character
 * Renders the Shadow Pet with dynamic expressions and animations.
 */

function createKageSVG() {
  return `
    <div class="kage-container" id="kage-avatar">
      <!-- Shadow Aura Glow -->
      <div class="kage-aura"></div>

      <!-- Shadow Tendril Particles -->
      <div class="kage-particle p1"></div>
      <div class="kage-particle p2"></div>
      <div class="kage-particle p3"></div>

      <!-- Emote Indicator (Exclamation, Question, Heart, Zzz) -->
      <div class="kage-emote" id="kage-emote"></div>

      <svg class="kage-svg" viewBox="0 0 200 220" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <!-- Gradients -->
          <radialGradient id="shadowBodyGrad" cx="50%" cy="40%" r="55%">
            <stop offset="0%" stop-color="#1c1c24" />
            <stop offset="65%" stop-color="#0a0a0e" />
            <stop offset="100%" stop-color="#020204" />
          </radialGradient>

          <linearGradient id="eyeRedGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#ff4d5a" />
            <stop offset="60%" stop-color="#ff1a2b" />
            <stop offset="100%" stop-color="#990011" />
          </linearGradient>

          <linearGradient id="hornHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ff1a2b" />
            <stop offset="100%" stop-color="#141419" />
          </linearGradient>

          <!-- Red Eye Glow Filter -->
          <filter id="eyeGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <!-- Dark Aura Filter -->
          <filter id="shadowMist" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="6" />
            <feColorMatrix type="matrix" values="
              0 0 0 0 0.8
              0 0 0 0 0.05
              0 0 0 0 0.1
              0 0 0 0.45 0" />
            <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
          </filter>
        </defs>

        <!-- Tail (behind body) -->
        <g class="kage-tail" id="kage-tail">
          <path d="M 130 160 Q 170 180 160 145 Q 155 125 175 120 Q 165 140 140 170 Z" fill="#09090d" stroke="#ff1a2b" stroke-width="1.2" />
        </g>

        <!-- Horns / Shadow Spikes -->
        <g class="kage-horns" id="kage-horns">
          <!-- Left Horn -->
          <path id="horn-left" class="horn horn-l" d="M 68 85 C 45 65 40 35 60 25 C 68 40 76 65 80 82 Z" fill="#0c0c12" stroke="#ff1a2b" stroke-width="1.5" />
          <!-- Right Horn -->
          <path id="horn-right" class="horn horn-r" d="M 132 85 C 155 65 160 35 140 25 C 132 40 124 65 120 82 Z" fill="#0c0c12" stroke="#ff1a2b" stroke-width="1.5" />
        </g>

        <!-- Main Shadow Body -->
        <g class="kage-body-group" id="kage-body-group">
          <!-- Wispy base skirt -->
          <path class="kage-wisp" d="M 60 170 Q 75 195 90 175 Q 100 198 115 175 Q 130 195 142 170 C 160 175 155 130 155 120 C 155 75 45 75 45 120 C 45 140 45 165 60 170 Z" 
                fill="url(#shadowBodyGrad)" stroke="#1a1a24" stroke-width="2" filter="url(#shadowMist)" />

          <!-- Blood-red tribal / Void markings -->
          <path class="kage-markings" d="M 52 115 Q 60 135 68 120" stroke="#ff1a2b" stroke-width="2" fill="none" opacity="0.6" stroke-linecap="round" />
          <path class="kage-markings" d="M 148 115 Q 140 135 132 120" stroke="#ff1a2b" stroke-width="2" fill="none" opacity="0.6" stroke-linecap="round" />
        </g>

        <!-- Cute Shadow Paws / Arms -->
        <g class="kage-arms" id="kage-arms">
          <ellipse class="paw paw-l" cx="68" cy="145" rx="10" ry="8" fill="#0e0e14" stroke="#ff1a2b" stroke-width="1" />
          <ellipse class="paw paw-r" cx="132" cy="145" rx="10" ry="8" fill="#0e0e14" stroke="#ff1a2b" stroke-width="1" />
        </g>

        <!-- Facial Features -->
        <g class="kage-face" id="kage-face">
          <!-- Left Eye Group -->
          <g class="eye-group eye-left" id="eye-left-group">
            <!-- Sclera / Glowing Iris -->
            <ellipse class="eye-iris" id="eye-left-iris" cx="74" cy="110" rx="14" ry="18" fill="url(#eyeRedGrad)" filter="url(#eyeGlow)" />
            <!-- Slit Pupil -->
            <ellipse class="eye-pupil" id="eye-left-pupil" cx="74" cy="110" rx="4.5" ry="12" fill="#300005" />
            <!-- Catchlight / Highlight -->
            <circle class="eye-shine" id="eye-left-shine1" cx="70" cy="104" r="4.5" fill="#ffffff" />
            <circle class="eye-shine-small" cx="78" cy="116" r="2" fill="#ffffff" opacity="0.8" />
            <!-- Closed Eye Curve (for sleeping / happy) -->
            <path class="eye-closed" id="eye-left-closed" d="M 60 110 Q 74 125 88 110" stroke="#ff1a2b" stroke-width="3.5" fill="none" stroke-linecap="round" style="display:none;" />
          </g>

          <!-- Right Eye Group -->
          <g class="eye-group eye-right" id="eye-right-group">
            <ellipse class="eye-iris" id="eye-right-iris" cx="126" cy="110" rx="14" ry="18" fill="url(#eyeRedGrad)" filter="url(#eyeGlow)" />
            <ellipse class="eye-pupil" id="eye-right-pupil" cx="126" cy="110" rx="4.5" ry="12" fill="#300005" />
            <circle class="eye-shine" id="eye-right-shine1" cx="122" cy="104" r="4.5" fill="#ffffff" />
            <circle class="eye-shine-small" cx="130" cy="116" r="2" fill="#ffffff" opacity="0.8" />
            <path class="eye-closed" id="eye-right-closed" d="M 112 110 Q 126 125 140 110" stroke="#ff1a2b" stroke-width="3.5" fill="none" stroke-linecap="round" style="display:none;" />
          </g>

          <!-- Cute Shadow Mouth -->
          <g class="kage-mouth" id="kage-mouth">
            <!-- Default cute cat-mouth :3 -->
            <path id="mouth-path" d="M 92 128 Q 96 134 100 130 Q 104 134 108 128" stroke="#ff1a2b" stroke-width="2.2" fill="none" stroke-linecap="round" />
            <!-- Open happy / talking mouth -->
            <path id="mouth-open" d="M 92 126 Q 100 144 108 126 Z" fill="#6e000e" stroke="#ff1a2b" stroke-width="1.8" style="display:none;" />
            <!-- Fang -->
            <polygon id="mouth-fang" points="98,126 102,126 100,131" fill="#ffffff" />
          </g>

          <!-- Blush Marks -->
          <g class="kage-blush" id="kage-blush" style="opacity: 0;">
            <ellipse cx="60" cy="126" rx="8" ry="4" fill="#ff1a2b" opacity="0.6" filter="url(#eyeGlow)" />
            <ellipse cx="140" cy="126" rx="8" ry="4" fill="#ff1a2b" opacity="0.6" filter="url(#eyeGlow)" />
          </g>
        </g>
      </svg>
    </div>
  `;
}

function setKageState(state, container) {
  const avatar = container.querySelector('#kage-avatar');
  if (!avatar) return;

  // Clear previous state classes
  const states = [
    'idle', 'happy', 'sad', 'curious', 'angry', 'sleepy',
    'surprised', 'excited', 'walking', 'sitting', 'sleeping', 'talking', 'teasing'
  ];
  states.forEach(s => avatar.classList.remove(`state-${s}`));
  avatar.classList.add(`state-${state}`);

  // Fetch facial elements
  const eyeLIris = avatar.querySelector('#eye-left-iris');
  const eyeLPupil = avatar.querySelector('#eye-left-pupil');
  const eyeLClosed = avatar.querySelector('#eye-left-closed');
  const eyeRIris = avatar.querySelector('#eye-right-iris');
  const eyeRPupil = avatar.querySelector('#eye-right-pupil');
  const eyeRClosed = avatar.querySelector('#eye-right-closed');
  const mouthPath = avatar.querySelector('#mouth-path');
  const mouthOpen = avatar.querySelector('#mouth-open');
  const blush = avatar.querySelector('#kage-blush');
  const emote = avatar.querySelector('#kage-emote');

  // Reset defaults
  eyeLIris.style.display = 'block';
  eyeLPupil.style.display = 'block';
  eyeLClosed.style.display = 'none';
  eyeRIris.style.display = 'block';
  eyeRPupil.style.display = 'block';
  eyeRClosed.style.display = 'none';
  mouthPath.style.display = 'block';
  mouthOpen.style.display = 'none';
  blush.style.opacity = '0';
  emote.textContent = '';
  emote.className = 'kage-emote';

  switch (state) {
    case 'happy':
      eyeLIris.style.display = 'none';
      eyeLPupil.style.display = 'none';
      eyeLClosed.style.display = 'block';
      eyeLClosed.setAttribute('d', 'M 60 115 Q 74 100 88 115'); // inverted happy arc ^
      eyeRIris.style.display = 'none';
      eyeRPupil.style.display = 'none';
      eyeRClosed.style.display = 'block';
      eyeRClosed.setAttribute('d', 'M 112 115 Q 126 100 140 115'); // ^
      mouthPath.style.display = 'none';
      mouthOpen.style.display = 'block';
      blush.style.opacity = '0.9';
      emote.textContent = '♥';
      emote.classList.add('show-heart');
      break;

    case 'sad':
      eyeLClosed.style.display = 'none';
      eyeRClosed.style.display = 'none';
      mouthPath.setAttribute('d', 'M 94 135 Q 100 126 106 135'); // downturned frown
      emote.textContent = '💧';
      emote.classList.add('show-tear');
      break;

    case 'curious':
      eyeLPupil.setAttribute('rx', '7'); // wide dilated pupils
      eyeRPupil.setAttribute('rx', '7');
      mouthPath.setAttribute('d', 'M 96 130 A 4 4 0 1 0 104 130'); // tiny 'o'
      emote.textContent = '?';
      emote.classList.add('show-question');
      break;

    case 'angry':
      eyeLClosed.style.display = 'none';
      eyeRClosed.style.display = 'none';
      mouthPath.setAttribute('d', 'M 93 134 L 100 130 L 107 134'); // sharp teeth / grimace
      emote.textContent = '💢';
      emote.classList.add('show-angry');
      break;

    case 'sleepy':
      eyeLPupil.setAttribute('ry', '3'); // heavy lidded
      eyeRPupil.setAttribute('ry', '3');
      mouthPath.setAttribute('d', 'M 95 130 Q 100 138 105 130');
      emote.textContent = 'zZ';
      emote.classList.add('show-zzz');
      break;

    case 'sleeping':
      eyeLIris.style.display = 'none';
      eyeLPupil.style.display = 'none';
      eyeLClosed.style.display = 'block';
      eyeLClosed.setAttribute('d', 'M 62 110 L 86 110'); // flat resting line
      eyeRIris.style.display = 'none';
      eyeRPupil.style.display = 'none';
      eyeRClosed.style.display = 'block';
      eyeRClosed.setAttribute('d', 'M 114 110 L 138 110');
      mouthPath.setAttribute('d', 'M 97 130 Q 100 132 103 130');
      emote.textContent = 'Zzz...';
      emote.classList.add('show-zzz');
      break;

    case 'surprised':
      eyeLPupil.setAttribute('rx', '2.5');
      eyeRPupil.setAttribute('rx', '2.5');
      mouthPath.style.display = 'none';
      mouthOpen.style.display = 'block';
      mouthOpen.setAttribute('d', 'M 95 125 A 6 8 0 1 0 105 125'); // shocked oval
      emote.textContent = '!';
      emote.classList.add('show-exclamation');
      break;

    case 'excited':
      eyeLIris.style.display = 'none';
      eyeLPupil.style.display = 'none';
      eyeLClosed.style.display = 'block';
      eyeLClosed.setAttribute('d', 'M 60 115 Q 74 96 88 115');
      eyeRIris.style.display = 'none';
      eyeRPupil.style.display = 'none';
      eyeRClosed.style.display = 'block';
      eyeRClosed.setAttribute('d', 'M 112 115 Q 126 96 140 115');
      mouthPath.style.display = 'none';
      mouthOpen.style.display = 'block';
      blush.style.opacity = '1';
      emote.textContent = '★';
      emote.classList.add('show-star');
      break;

    case 'talking':
      mouthPath.style.display = 'none';
      mouthOpen.style.display = 'block';
      break;

    case 'teasing':
      // One winking eye, one glowing eye
      eyeLIris.style.display = 'none';
      eyeLPupil.style.display = 'none';
      eyeLClosed.style.display = 'block';
      eyeLClosed.setAttribute('d', 'M 60 115 Q 74 100 88 115'); // wink
      mouthPath.setAttribute('d', 'M 92 128 Q 100 138 108 128');
      emote.textContent = '✧';
      break;

    case 'sitting':
      mouthPath.setAttribute('d', 'M 94 130 Q 100 134 106 130');
      break;

    case 'idle':
    default:
      // Standard cute resting face
      mouthPath.setAttribute('d', 'M 92 128 Q 96 134 100 130 Q 104 134 108 128');
      break;
  }
}

window.createKageSVG = createKageSVG;
window.setKageState = setKageState;

/**
 * KAGE Avatar — Authentic VOIDKAGE Shadow Pet Character Sprite & State Renderer
 * Integrates official character artwork with dynamic desktop animations.
 */

function createKageSVG() {
  return `
    <div class="kage-container state-idle" id="kage-avatar">
      <!-- Shadow Aura Glow -->
      <div class="kage-aura"></div>

      <!-- Shadow Tendril Particles -->
      <div class="kage-particle p1"></div>
      <div class="kage-particle p2"></div>
      <div class="kage-particle p3"></div>

      <!-- Emote Indicator (Exclamation, Question, Heart, Zzz) -->
      <div class="kage-emote" id="kage-emote"></div>

      <!-- Authentic Character Sprite Layer -->
      <div class="kage-sprite-wrapper" id="kage-sprite-wrapper">
        <img class="kage-sprite sprite-main" id="kage-sprite-main" src="assets/kage-main.png" alt="KAGE" />
        <img class="kage-sprite sprite-sitting" id="kage-sprite-sitting" src="assets/kage-sitting.png" alt="Sitting" style="display:none;" />
        <img class="kage-sprite sprite-floating" id="kage-sprite-floating" src="assets/kage-floating.png" alt="Floating" style="display:none;" />
        <img class="kage-sprite sprite-sleeping" id="kage-sprite-sleeping" src="assets/kage-sleeping.png" alt="Sleeping" style="display:none;" />
      </div>
    </div>
  `;
}

function setKageState(state, container) {
  const avatar = container.querySelector('#kage-avatar');
  if (!avatar) return;

  const states = [
    'idle', 'happy', 'sad', 'curious', 'angry', 'sleepy',
    'surprised', 'excited', 'walking', 'sitting', 'sleeping', 'talking', 'teasing'
  ];
  states.forEach(s => avatar.classList.remove(`state-${s}`));
  avatar.classList.add(`state-${state}`);

  const sprites = avatar.querySelectorAll('.kage-sprite');
  sprites.forEach(s => s.style.display = 'none');

  const spriteMain = avatar.querySelector('#kage-sprite-main');
  const spriteSitting = avatar.querySelector('#kage-sprite-sitting');
  const spriteFloating = avatar.querySelector('#kage-sprite-floating');
  const spriteSleeping = avatar.querySelector('#kage-sprite-sleeping');
  const emote = avatar.querySelector('#kage-emote');

  emote.textContent = '';
  emote.className = 'kage-emote';

  switch (state) {
    case 'happy':
      if (spriteFloating) spriteFloating.style.display = 'block';
      else if (spriteMain) spriteMain.style.display = 'block';
      emote.textContent = '♥';
      emote.classList.add('show-heart');
      break;

    case 'sad':
      if (spriteSitting) spriteSitting.style.display = 'block';
      else if (spriteMain) spriteMain.style.display = 'block';
      emote.textContent = '💧';
      emote.classList.add('show-tear');
      break;

    case 'curious':
      if (spriteMain) spriteMain.style.display = 'block';
      emote.textContent = '?';
      emote.classList.add('show-question');
      break;

    case 'angry':
      if (spriteMain) spriteMain.style.display = 'block';
      emote.textContent = '💢';
      emote.classList.add('show-angry');
      break;

    case 'sleepy':
      if (spriteSitting) spriteSitting.style.display = 'block';
      else if (spriteMain) spriteMain.style.display = 'block';
      emote.textContent = 'zZ';
      emote.classList.add('show-zzz');
      break;

    case 'sleeping':
      if (spriteSleeping) spriteSleeping.style.display = 'block';
      else if (spriteSitting) spriteSitting.style.display = 'block';
      emote.textContent = 'Zzz...';
      emote.classList.add('show-zzz');
      break;

    case 'surprised':
      if (spriteMain) spriteMain.style.display = 'block';
      emote.textContent = '!';
      emote.classList.add('show-exclamation');
      break;

    case 'excited':
      if (spriteFloating) spriteFloating.style.display = 'block';
      else if (spriteMain) spriteMain.style.display = 'block';
      emote.textContent = '★';
      emote.classList.add('show-star');
      break;

    case 'walking':
      if (spriteFloating) spriteFloating.style.display = 'block';
      else if (spriteMain) spriteMain.style.display = 'block';
      break;

    case 'sitting':
      if (spriteSitting) spriteSitting.style.display = 'block';
      else if (spriteMain) spriteMain.style.display = 'block';
      break;

    case 'teasing':
      if (spriteMain) spriteMain.style.display = 'block';
      emote.textContent = '✧';
      break;

    case 'talking':
      if (spriteMain) spriteMain.style.display = 'block';
      break;

    case 'idle':
    default:
      if (spriteMain) spriteMain.style.display = 'block';
      break;
  }
}

window.createKageSVG = createKageSVG;
window.setKageState = setKageState;

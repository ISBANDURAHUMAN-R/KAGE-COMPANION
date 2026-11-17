/**
 * KAGE-CHAN Avatar — Authentic VOIDKAGE Character Sprite & State Renderer
 * Integrates official character artwork with dynamic chibi animations.
 */

function createKageChanSVG() {
  return `
    <div class="kage-chan-container state-idle" id="kage-chan-avatar">
      <!-- Crimson Aura Glow -->
      <div class="kc-aura"></div>

      <!-- Floating Sparkles / Particles -->
      <div class="kc-particle p1"></div>
      <div class="kc-particle p2"></div>
      <div class="kc-particle p3"></div>

      <!-- Emote Bubble (Heart, Tear, Anger, Zzz, Star, Exclamation) -->
      <div class="kc-emote" id="kc-emote"></div>

      <!-- Authentic Character Sprite Layer -->
      <div class="kc-sprite-wrapper" id="kc-sprite-wrapper">
        <img class="kc-sprite sprite-main" id="kc-sprite-main" src="assets/kage-chan-main.png" alt="KAGE-CHAN" />
        <img class="kc-sprite sprite-happy" id="kc-sprite-happy" src="assets/state-happy.png" alt="Happy" style="display:none;" />
        <img class="kc-sprite sprite-blushing" id="kc-sprite-blushing" src="assets/state-blushing.png" alt="Blushing" style="display:none;" />
        <img class="kc-sprite sprite-angry" id="kc-sprite-angry" src="assets/state-angry.png" alt="Angry" style="display:none;" />
        <img class="kc-sprite sprite-angry-mode" id="kc-sprite-angry-mode" src="assets/state-angry-mode.png" alt="Angry Mode" style="display:none;" />
        <img class="kc-sprite sprite-sleepy" id="kc-sprite-sleepy" src="assets/state-sleepy.png" alt="Sleepy" style="display:none;" />
        <img class="kc-sprite sprite-sleeping" id="kc-sprite-sleeping" src="assets/state-sleeping.png" alt="Sleeping" style="display:none;" />
        <img class="kc-sprite sprite-surprised" id="kc-sprite-surprised" src="assets/state-surprised.png" alt="Surprised" style="display:none;" />
        <img class="kc-sprite sprite-teasing" id="kc-sprite-teasing" src="assets/state-teasing.png" alt="Teasing" style="display:none;" />
        <img class="kc-sprite sprite-walking" id="kc-sprite-walking" src="assets/state-walking.png" alt="Walking" style="display:none;" />
        <img class="kc-sprite sprite-sitting" id="kc-sprite-sitting" src="assets/state-sitting.png" alt="Sitting" style="display:none;" />
        <img class="kc-sprite sprite-excited" id="kc-sprite-excited" src="assets/state-excited.png" alt="Excited" style="display:none;" />
      </div>
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

  const sprites = avatar.querySelectorAll('.kc-sprite');
  sprites.forEach(s => s.style.display = 'none');

  const spriteMain = avatar.querySelector('#kc-sprite-main');
  const spriteHappy = avatar.querySelector('#kc-sprite-happy');
  const spriteBlushing = avatar.querySelector('#kc-sprite-blushing');
  const spriteAngry = avatar.querySelector('#kc-sprite-angry');
  const spriteAngryMode = avatar.querySelector('#kc-sprite-angry-mode');
  const spriteSleepy = avatar.querySelector('#kc-sprite-sleepy');
  const spriteSleeping = avatar.querySelector('#kc-sprite-sleeping');
  const spriteSurprised = avatar.querySelector('#kc-sprite-surprised');
  const spriteTeasing = avatar.querySelector('#kc-sprite-teasing');
  const spriteWalking = avatar.querySelector('#kc-sprite-walking');
  const spriteSitting = avatar.querySelector('#kc-sprite-sitting');
  const spriteExcited = avatar.querySelector('#kc-sprite-excited');
  const emote = avatar.querySelector('#kc-emote');

  emote.textContent = '';
  emote.className = 'kc-emote';

  switch (state) {
    case 'happy':
      if (spriteHappy) spriteHappy.style.display = 'block';
      emote.textContent = '♥';
      emote.classList.add('show-heart');
      break;

    case 'sad':
      if (spriteBlushing) spriteBlushing.style.display = 'block';
      emote.textContent = '💧';
      emote.classList.add('show-tear');
      break;

    case 'curious':
      if (spriteTeasing) spriteTeasing.style.display = 'block';
      emote.textContent = '?';
      emote.classList.add('show-question');
      break;

    case 'angry':
      if (spriteAngryMode) spriteAngryMode.style.display = 'block';
      else if (spriteAngry) spriteAngry.style.display = 'block';
      emote.textContent = '💢';
      emote.classList.add('show-angry');
      break;

    case 'sleepy':
      if (spriteSleepy) spriteSleepy.style.display = 'block';
      emote.textContent = 'zZ';
      emote.classList.add('show-zzz');
      break;

    case 'sleeping':
      if (spriteSleeping) spriteSleeping.style.display = 'block';
      emote.textContent = 'Zzz...';
      emote.classList.add('show-zzz');
      break;

    case 'surprised':
      if (spriteSurprised) spriteSurprised.style.display = 'block';
      emote.textContent = '!?';
      emote.classList.add('show-exclamation');
      break;

    case 'excited':
      if (spriteExcited) spriteExcited.style.display = 'block';
      emote.textContent = '★';
      emote.classList.add('show-star');
      break;

    case 'walking':
      if (spriteWalking) spriteWalking.style.display = 'block';
      break;

    case 'sitting':
      if (spriteSitting) spriteSitting.style.display = 'block';
      break;

    case 'teasing':
      if (spriteTeasing) spriteTeasing.style.display = 'block';
      emote.textContent = '✧';
      break;

    case 'talking':
      if (spriteHappy) spriteHappy.style.display = 'block';
      break;

    case 'idle':
    default:
      if (spriteMain) spriteMain.style.display = 'block';
      break;
  }
}

window.createKageChanSVG = createKageChanSVG;
window.setKageChanState = setKageChanState;

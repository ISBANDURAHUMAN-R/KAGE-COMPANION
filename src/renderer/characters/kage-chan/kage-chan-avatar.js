/**
 * KAGE-CHAN Avatar — Authentic Character Sprite & State Renderer
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

      <!-- Emote Bubble -->
      <div class="kc-emote" id="kc-emote"></div>

      <!-- Authentic Character Sprite Layer -->
      <div class="kc-sprite-wrapper" id="kc-sprite-wrapper">
        <img class="kc-sprite sprite-main" id="kc-sprite-main" src="assets/kage-chan-main.png" alt="KAGE-CHAN" draggable="false" />
        <img class="kc-sprite sprite-happy" id="kc-sprite-happy" src="assets/state-happy.png" alt="Happy" draggable="false" style="display:none;" />
        <img class="kc-sprite sprite-blushing" id="kc-sprite-blushing" src="assets/state-blushing.png" alt="Blushing" draggable="false" style="display:none;" />
        <img class="kc-sprite sprite-angry" id="kc-sprite-angry" src="assets/state-angry.png" alt="Angry" draggable="false" style="display:none;" />
        <img class="kc-sprite sprite-angry-mode" id="kc-sprite-angry-mode" src="assets/state-angry-mode.png" alt="Rage" draggable="false" style="display:none;" />
        <img class="kc-sprite sprite-surprised" id="kc-sprite-surprised" src="assets/state-surprised.png" alt="Surprised" draggable="false" style="display:none;" />
        <img class="kc-sprite sprite-shocked" id="kc-sprite-shocked" src="assets/state-shocked.png" alt="Shocked" draggable="false" style="display:none;" />
        <img class="kc-sprite sprite-curious" id="kc-sprite-curious" src="assets/state-curious.png" alt="Curious" draggable="false" style="display:none;" />
        <img class="kc-sprite sprite-sad" id="kc-sprite-sad" src="assets/state-sad.png" alt="Sad" draggable="false" style="display:none;" />
        <img class="kc-sprite sprite-sleepy" id="kc-sprite-sleepy" src="assets/state-sleepy.png" alt="Sleepy" draggable="false" style="display:none;" />
        <img class="kc-sprite sprite-sleeping" id="kc-sprite-sleeping" src="assets/state-sleeping.png" alt="Sleeping" draggable="false" style="display:none;" />
        <img class="kc-sprite sprite-excited" id="kc-sprite-excited" src="assets/state-excited.png" alt="Excited" draggable="false" style="display:none;" />
        <img class="kc-sprite sprite-teasing" id="kc-sprite-teasing" src="assets/state-teasing.png" alt="Teasing" draggable="false" style="display:none;" />
        <img class="kc-sprite sprite-walking" id="kc-sprite-walking" src="assets/state-walking.png" alt="Walking" draggable="false" style="display:none;" />
        <img class="kc-sprite sprite-coding" id="kc-sprite-coding" src="assets/state-coding.png" alt="Coding" draggable="false" style="display:none;" />
        <img class="kc-sprite sprite-gaming" id="kc-sprite-gaming" src="assets/state-gaming.png" alt="Gaming" draggable="false" style="display:none;" />
        <img class="kc-sprite sprite-coffee" id="kc-sprite-coffee" src="assets/state-coffee.png" alt="Coffee" draggable="false" style="display:none;" />
        <img class="kc-sprite sprite-love" id="kc-sprite-love" src="assets/state-love.png" alt="Love" draggable="false" style="display:none;" />
        <img class="kc-sprite sprite-sunglasses" id="kc-sprite-sunglasses" src="assets/state-sunglasses.png" alt="Cool" draggable="false" style="display:none;" />
      </div>
    </div>
  `;
}

function setKageChanState(state, container = null) {
  const root = container || document;
  const avatar = (root.id === 'kage-chan-avatar') ? root : (root.querySelector ? (root.querySelector('#kage-chan-avatar') || root) : document.getElementById('kage-chan-avatar'));
  if (!avatar) return;

  const states = [
    'idle', 'happy', 'sad', 'curious', 'angry', 'sleepy',
    'surprised', 'excited', 'walking', 'sitting', 'sleeping', 'talking', 'teasing',
    'coding', 'gaming', 'coffee', 'love', 'rage', 'demon', 'shocked', 'sunglasses', 'cool'
  ];
  states.forEach(s => avatar.classList.remove(`state-${s}`));
  avatar.classList.add(`state-${state}`);

  const sprites = avatar.querySelectorAll('.kc-sprite');
  sprites.forEach(s => s.style.display = 'none');

  const spriteMain = avatar.querySelector('#kc-sprite-main');
  const spriteMap = {
    happy: avatar.querySelector('#kc-sprite-happy'),
    excited: avatar.querySelector('#kc-sprite-excited'),
    blushing: avatar.querySelector('#kc-sprite-blushing'),
    angry: avatar.querySelector('#kc-sprite-angry'),
    rage: avatar.querySelector('#kc-sprite-angry-mode'),
    demon: avatar.querySelector('#kc-sprite-angry-mode'),
    surprised: avatar.querySelector('#kc-sprite-surprised'),
    shocked: avatar.querySelector('#kc-sprite-shocked'),
    curious: avatar.querySelector('#kc-sprite-curious'),
    sad: avatar.querySelector('#kc-sprite-sad'),
    crying: avatar.querySelector('#kc-sprite-sad'),
    sleepy: avatar.querySelector('#kc-sprite-sleepy'),
    sleeping: avatar.querySelector('#kc-sprite-sleeping'),
    teasing: avatar.querySelector('#kc-sprite-teasing'),
    talking: avatar.querySelector('#kc-sprite-teasing'),
    walking: avatar.querySelector('#kc-sprite-walking'),
    coding: avatar.querySelector('#kc-sprite-coding'),
    gaming: avatar.querySelector('#kc-sprite-gaming'),
    coffee: avatar.querySelector('#kc-sprite-coffee'),
    love: avatar.querySelector('#kc-sprite-love'),
    sunglasses: avatar.querySelector('#kc-sprite-sunglasses'),
    cool: avatar.querySelector('#kc-sprite-sunglasses'),
    sitting: spriteMain,
    idle: spriteMain
  };

  const targetSprite = spriteMap[state] || spriteMain;
  if (targetSprite) targetSprite.style.display = 'block';

  const emote = avatar.querySelector('#kc-emote');
  if (emote) {
    emote.textContent = '';
    emote.className = 'kc-emote';
  }
}

window.createKageChanSVG = createKageChanSVG;
window.setKageChanState = setKageChanState;

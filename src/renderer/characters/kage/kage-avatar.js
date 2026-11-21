/**
 * KAGE Avatar — Authentic Shadow Pet Character Sprite & State Renderer
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

      <!-- Emote Indicator (Exclamation, Question, Heart, Zzz, Star, etc.) -->
      <div class="kage-emote" id="kage-emote"></div>

      <!-- Authentic Character Sprite Layer -->
      <div class="kage-sprite-wrapper" id="kage-sprite-wrapper">
        <img class="kage-sprite sprite-main" id="kage-sprite-main" src="assets/kage-main.png" alt="KAGE" draggable="false" />
        <img class="kage-sprite sprite-happy" id="kage-sprite-happy" src="assets/state-happy.png" alt="Happy" draggable="false" style="display:none;" />
        <img class="kage-sprite sprite-excited" id="kage-sprite-excited" src="assets/state-excited.png" alt="Excited" draggable="false" style="display:none;" />
        <img class="kage-sprite sprite-blushing" id="kage-sprite-blushing" src="assets/state-blushing.png" alt="Blushing" draggable="false" style="display:none;" />
        <img class="kage-sprite sprite-surprised" id="kage-sprite-surprised" src="assets/state-surprised.png" alt="Surprised" draggable="false" style="display:none;" />
        <img class="kage-sprite sprite-curious" id="kage-sprite-curious" src="assets/state-curious.png" alt="Curious" draggable="false" style="display:none;" />
        <img class="kage-sprite sprite-angry" id="kage-sprite-angry" src="assets/state-angry.png" alt="Angry" draggable="false" style="display:none;" />
        <img class="kage-sprite sprite-sad" id="kage-sprite-sad" src="assets/state-sad.png" alt="Sad" draggable="false" style="display:none;" />
        <img class="kage-sprite sprite-crying" id="kage-sprite-crying" src="assets/state-crying.png" alt="Crying" draggable="false" style="display:none;" />
        <img class="kage-sprite sprite-sleepy" id="kage-sprite-sleepy" src="assets/state-sleepy.png" alt="Sleepy" draggable="false" style="display:none;" />
        <img class="kage-sprite sprite-sleeping" id="kage-sprite-sleeping" src="assets/state-sleeping.png" alt="Sleeping" draggable="false" style="display:none;" />
        <img class="kage-sprite sprite-teasing" id="kage-sprite-teasing" src="assets/state-teasing.png" alt="Teasing" draggable="false" style="display:none;" />
        <img class="kage-sprite sprite-walking" id="kage-sprite-walking" src="assets/state-walking.png" alt="Walking" draggable="false" style="display:none;" />
        <img class="kage-sprite sprite-coding" id="kage-sprite-coding" src="assets/state-coding.png" alt="Coding" draggable="false" style="display:none;" />
        <img class="kage-sprite sprite-gaming" id="kage-sprite-gaming" src="assets/state-gaming.png" alt="Gaming" draggable="false" style="display:none;" />
        <img class="kage-sprite sprite-coffee" id="kage-sprite-coffee" src="assets/state-coffee.png" alt="Coffee" draggable="false" style="display:none;" />
        <img class="kage-sprite sprite-love" id="kage-sprite-love" src="assets/state-love.png" alt="Love" draggable="false" style="display:none;" />
        <img class="kage-sprite sprite-demon" id="kage-sprite-demon" src="assets/state-demon.png" alt="Demon" draggable="false" style="display:none;" />
        <img class="kage-sprite sprite-sunglasses" id="kage-sprite-sunglasses" src="assets/state-sunglasses.png" alt="Cool" draggable="false" style="display:none;" />
        <img class="kage-sprite sprite-music" id="kage-sprite-music" src="assets/state-music.png" alt="Music" draggable="false" style="display:none;" />
      </div>
    </div>
  `;
}

function setKageState(state, container = null) {
  const root = container || document;
  const avatar = (root.id === 'kage-avatar') ? root : (root.querySelector ? (root.querySelector('#kage-avatar') || root) : document.getElementById('kage-avatar'));
  if (!avatar) return;

  const states = [
    'idle', 'happy', 'sad', 'curious', 'angry', 'sleepy',
    'surprised', 'excited', 'walking', 'sitting', 'sleeping', 'talking', 'teasing',
    'coding', 'gaming', 'coffee', 'love', 'demon', 'rage', 'sunglasses', 'cool', 'music'
  ];
  states.forEach(s => avatar.classList.remove(`state-${s}`));
  avatar.classList.add(`state-${state}`);

  const sprites = avatar.querySelectorAll('.kage-sprite');
  sprites.forEach(s => s.style.display = 'none');

  const spriteMain = avatar.querySelector('#kage-sprite-main');
  const spriteMap = {
    happy: avatar.querySelector('#kage-sprite-happy'),
    excited: avatar.querySelector('#kage-sprite-excited'),
    blushing: avatar.querySelector('#kage-sprite-blushing'),
    surprised: avatar.querySelector('#kage-sprite-surprised'),
    curious: avatar.querySelector('#kage-sprite-curious'),
    angry: avatar.querySelector('#kage-sprite-angry'),
    sad: avatar.querySelector('#kage-sprite-sad'),
    crying: avatar.querySelector('#kage-sprite-crying'),
    sleepy: avatar.querySelector('#kage-sprite-sleepy'),
    sleeping: avatar.querySelector('#kage-sprite-sleeping'),
    teasing: avatar.querySelector('#kage-sprite-teasing'),
    walking: avatar.querySelector('#kage-sprite-walking'),
    coding: avatar.querySelector('#kage-sprite-coding'),
    gaming: avatar.querySelector('#kage-sprite-gaming'),
    coffee: avatar.querySelector('#kage-sprite-coffee'),
    love: avatar.querySelector('#kage-sprite-love'),
    demon: avatar.querySelector('#kage-sprite-demon'),
    rage: avatar.querySelector('#kage-sprite-demon'),
    sunglasses: avatar.querySelector('#kage-sprite-sunglasses'),
    cool: avatar.querySelector('#kage-sprite-sunglasses'),
    music: avatar.querySelector('#kage-sprite-music'),
    talking: avatar.querySelector('#kage-sprite-happy'),
    sitting: spriteMain,
    idle: spriteMain
  };

  const targetSprite = spriteMap[state] || spriteMain;
  if (targetSprite) targetSprite.style.display = 'block';

  const emote = avatar.querySelector('#kage-emote');
  if (emote) {
    emote.textContent = '';
    emote.className = 'kage-emote';
  }
}

window.createKageSVG = createKageSVG;
window.setKageState = setKageState;

/**
 * VOIDKAGE Dialogue Database
 * Rich, context-aware, original lines for KAGE and KAGE-CHAN.
 */

const KAGE_DIALOGUES = {
  idle: [
    { key: 'k_idle_build', text: "What are you building over there?", mood: 'curious', anim: 'curious' },
    { key: 'k_idle_ignore', text: "Oi! Don't ignore me, mortal.", mood: 'teasing', anim: 'teasing' },
    { key: 'k_idle_bored', text: "I'm bored... can we cause some chaos?", mood: 'idle', anim: 'idle' },
    { key: 'k_idle_shadow', text: "The shadows in your room feel cozy today.", mood: 'idle', anim: 'sitting' },
    { key: 'k_idle_snack', text: "Did someone say dark chocolate? No? ...Lame.", mood: 'idle', anim: 'idle' },
    { key: 'k_idle_nap', text: "Wake me up if the void starts expanding.", mood: 'sleepy', anim: 'sleepy' },
    { key: 'k_idle_fly', text: "Hovering takes serious core strength, you know.", mood: 'excited', anim: 'excited' },
    { key: 'k_idle_watch', text: "I am quietly judging your mouse accuracy.", mood: 'teasing', anim: 'teasing' },
    { key: 'k_idle_click', text: "Click something interesting already!", mood: 'curious', anim: 'curious' }
  ],
  late_night: [
    { key: 'k_night_awake', text: "Master, you're still awake? The void approves.", mood: 'curious', anim: 'curious' },
    { key: 'k_night_sleep', text: "Even shadow creatures sleep at 3 AM... go to bed!", mood: 'sleepy', anim: 'sleepy' },
    { key: 'k_night_glow', text: "My eyes glow best in the pitch dark.", mood: 'happy', anim: 'happy' }
  ],
  morning: [
    { key: 'k_morn_sun', text: "Ugh, morning light... hiss! Turn on dark mode!", mood: 'angry', anim: 'angry' },
    { key: 'k_morn_coffee', text: "Feed me shadows and caffeine.", mood: 'sleepy', anim: 'sleepy' }
  ],
  happy: [
    { key: 'k_hap_purr', text: "*vibrates with dark energy happily*", mood: 'happy', anim: 'happy' },
    { key: 'k_hap_best', text: "You're my favorite human today!", mood: 'happy', anim: 'excited' },
    { key: 'k_hap_float', text: "Look at me do a 360 flip in the air!", mood: 'excited', anim: 'excited' }
  ],
  sad: [
    { key: 'k_sad_alone', text: "Did you forget about your favorite shadow?", mood: 'sad', anim: 'sad' },
    { key: 'k_sad_cold', text: "It's cold out here outside your monitor...", mood: 'sad', anim: 'sad' }
  ],
  angry: [
    { key: 'k_ang_rawr', text: "Fear my wrath! ...Wait, why are you smiling?!", mood: 'angry', anim: 'angry' },
    { key: 'k_ang_poke', text: "Stop poking my horns, they're aerodynamic!", mood: 'angry', anim: 'angry' }
  ],
  sleepy: [
    { key: 'k_slp_yawn', text: "*big shadow yawn* Nap time approaching...", mood: 'sleepy', anim: 'sleepy' },
    { key: 'k_slp_drowsy', text: "Zzz... the void awaits... 5 more minutes...", mood: 'sleepy', anim: 'sleeping' }
  ],
  curious: [
    { key: 'k_cur_what', text: "What is that icon? Can I bite it?", mood: 'curious', anim: 'curious' },
    { key: 'k_cur_inspect', text: "Inspecting your desktop... looks messy as usual.", mood: 'teasing', anim: 'curious' }
  ],
  interactions: {
    pet: [
      { key: 'k_pet_1', text: "Purrrrr... Okay, that's actually nice.", mood: 'happy', anim: 'happy' },
      { key: 'k_pet_2', text: "Mmm... scratch right behind the shadow ears.", mood: 'happy', anim: 'happy' },
      { key: 'k_pet_3', text: "I am a creature of terror! Not a kitten! ...Okay, keep going.", mood: 'teasing', anim: 'happy' }
    ],
    talk: [
      { key: 'k_tlk_1', text: "Tell me a secret. I won't leak it to Kage-chan.", mood: 'curious', anim: 'talking' },
      { key: 'k_tlk_2', text: "Need advice? The solution is usually more explosions.", mood: 'teasing', anim: 'talking' },
      { key: 'k_tlk_3', text: "Let's cause some harmless desktop mischief!", mood: 'excited', anim: 'talking' }
    ],
    play: [
      { key: 'k_ply_1', text: "Tag! You're it! Catch me if you can!", mood: 'excited', anim: 'excited' },
      { key: 'k_ply_2', text: "Shadow dash! *zoom*", mood: 'excited', anim: 'walking' },
      { key: 'k_ply_3', text: "Peek-a-boo from behind your taskbar!", mood: 'happy', anim: 'happy' }
    ],
    question: [
      { key: 'k_q_1', text: "Will you feed me dark cookies later?", mood: 'curious', anim: 'curious' },
      { key: 'k_q_2', text: "Do you think shadows dream of digital sheep?", mood: 'curious', anim: 'curious' },
      { key: 'k_q_3', text: "Who do you like more, me or Kage-chan? Answer carefully!", mood: 'teasing', anim: 'teasing' }
    ],
    sleep: [
      { key: 'k_slp_cmd', text: "Fine... entering dormant shadow mode. Zzz...", mood: 'sleeping', anim: 'sleeping' }
    ],
    dismiss: [
      { key: 'k_dsm_cmd', text: "See ya! Don't let the light blind you.", mood: 'idle', anim: 'idle' }
    ]
  }
};

const KAGE_CHAN_DIALOGUES = {
  idle: [
    { key: 'kc_idle_master', text: "Hey! Master~ ♡", mood: 'happy', anim: 'happy' },
    { key: 'kc_idle_doing', text: "What are you doing? Let me watch!", mood: 'curious', anim: 'curious' },
    { key: 'kc_idle_game', text: "Let's play a game?", mood: 'excited', anim: 'excited' },
    { key: 'kc_idle_hard', text: "You really work hard... take a break, okay?", mood: 'happy', anim: 'sitting' },
    { key: 'kc_idle_ignore_me', text: "Don't ignore me! >.<", mood: 'angry', anim: 'angry' },
    { key: 'kc_idle_always', text: "I'm always here for you ♡", mood: 'happy', anim: 'happy' },
    { key: 'kc_idle_motto', text: "A little chaos, with a lot of love. ♡", mood: 'teasing', anim: 'teasing' },
    { key: 'kc_idle_wb', text: "Welcome back! I was waiting for you~", mood: 'happy', anim: 'happy' },
    { key: 'kc_idle_work', text: "What are you working on today?", mood: 'curious', anim: 'curious' },
    { key: 'kc_idle_company', text: "Need some company while you work? I'm right here.", mood: 'idle', anim: 'idle' },
    { key: 'kc_idle_break', text: "Take a little break, okay? Hydrate yourself!", mood: 'happy', anim: 'talking' },
    { key: 'kc_idle_forgot', text: "Hmph! You forgot about me, didn't you?", mood: 'angry', anim: 'teasing' },
    { key: 'kc_idle_focus', text: "You look so focused right now... it's cute.", mood: 'happy', anim: 'sitting' },
    { key: 'kc_idle_stretch', text: "Stretch your shoulders! Don't get slouchy posture!", mood: 'happy', anim: 'talking' },
    { key: 'kc_idle_kage', text: "Kage is behaving today... which makes me suspicious.", mood: 'curious', anim: 'curious' },
    { key: 'kc_idle_sing', text: "La la la~ ♪ Cyber shadows dancing on your screen~", mood: 'happy', anim: 'excited' }
  ],
  late_night: [
    { key: 'kc_night_rest', text: "It's so late... Please get some sleep soon!", mood: 'sad', anim: 'sad' },
    { key: 'kc_night_tea', text: "If I could, I'd make you some chamomile tea right now.", mood: 'happy', anim: 'happy' },
    { key: 'kc_night_eyes', text: "Rest your eyes for a minute. Staring at screens is tiring.", mood: 'curious', anim: 'talking' }
  ],
  morning: [
    { key: 'kc_morn_greet', text: "Good morning! Ready to conquer the day together?", mood: 'excited', anim: 'excited' },
    { key: 'kc_morn_cheer', text: "Let's do our best today! I'm cheering for you!", mood: 'happy', anim: 'happy' }
  ],
  happy: [
    { key: 'kc_hap_smile', text: "Hehe! Spending time with you always makes my day brighter!", mood: 'happy', anim: 'happy' },
    { key: 'kc_hap_twirl', text: "*spins happily* My ribbons look good today, right?", mood: 'happy', anim: 'excited' }
  ],
  sad: [
    { key: 'kc_sad_lonely', text: "Did I do something wrong...? Don't leave me alone.", mood: 'sad', anim: 'sad' },
    { key: 'kc_sad_sigh', text: "*sigh* I wish I could give you a high five...", mood: 'sad', anim: 'sad' }
  ],
  angry: [
    { key: 'kc_ang_pout', text: "B-Baka! It's not like I wanted you to click on me or anything!", mood: 'angry', anim: 'angry' },
    { key: 'kc_ang_scold', text: "Stop playing around and finish your tasks first!", mood: 'angry', anim: 'teasing' }
  ],
  sleepy: [
    { key: 'kc_slp_nod', text: "*head nods gently* So sleepy... but I want to stay with you...", mood: 'sleepy', anim: 'sleepy' },
    { key: 'kc_slp_pillow', text: "Where is my shadow plushie? Time to tuck in...", mood: 'sleepy', anim: 'sleeping' }
  ],
  curious: [
    { key: 'kc_cur_open', text: "Ooh, what window is that? Show me, show me!", mood: 'curious', anim: 'curious' },
    { key: 'kc_cur_music', text: "What playlist are you listening to right now?", mood: 'curious', anim: 'curious' }
  ],
  interactions: {
    pet: [
      { key: 'kc_pet_1', text: "Kyaa! *blushes* Warn a girl before patting her head!", mood: 'happy', anim: 'surprised' },
      { key: 'kc_pet_2', text: "Hehe... that feels really warm and cozy. Thank you.", mood: 'happy', anim: 'happy' },
      { key: 'kc_pet_3', text: "Don't mess up my ribbons too much, okay?", mood: 'teasing', anim: 'happy' }
    ],
    talk: [
      { key: 'kc_tlk_1', text: "I'm always happy to chat with you! What's on your mind?", mood: 'happy', anim: 'talking' },
      { key: 'kc_tlk_2', text: "Remember to drink some water today, promise me!", mood: 'curious', anim: 'talking' },
      { key: 'kc_tlk_3', text: "If you ever feel stressed, just look over at me!", mood: 'happy', anim: 'happy' }
    ],
    play: [
      { key: 'kc_ply_1', text: "Let's play rock-paper-scissors! Ready? Rock!", mood: 'excited', anim: 'excited' },
      { key: 'kc_ply_2', text: "Yay! Dancing break time! *spins around*", mood: 'excited', anim: 'happy' },
      { key: 'kc_ply_3', text: "Watch this neat shadow magic trick!", mood: 'happy', anim: 'excited' }
    ],
    question: [
      { key: 'kc_q_1', text: "Have you taken a break in the last two hours?", mood: 'curious', anim: 'curious' },
      { key: 'kc_q_2', text: "Am I doing a good job keeping you company?", mood: 'happy', anim: 'happy' },
      { key: 'kc_q_3', text: "What's your biggest goal for today? You can do it!", mood: 'excited', anim: 'talking' }
    ],
    sleep: [
      { key: 'kc_slp_cmd', text: "Goodnight... sweet dreams of starry shadows. Zzz...", mood: 'sleeping', anim: 'sleeping' }
    ],
    dismiss: [
      { key: 'kc_dsm_cmd', text: "I'll be resting right here whenever you need me!", mood: 'idle', anim: 'idle' }
    ]
  }
};

// Cross-character dialogues (conversations between Kage and Kage-Chan)
const CROSS_DIALOGUES = [
  {
    initiator: 'kage',
    recipient: 'kage-chan',
    first: { text: "Hey Kage-chan, check out this shadow trick!", anim: 'teasing', mood: 'teasing' },
    reply: { text: "Kage! Don't knock over the taskbar icons again!", anim: 'angry', mood: 'angry' },
    delay: 2400
  },
  {
    initiator: 'kage-chan',
    recipient: 'kage',
    first: { text: "Kage, did you eat the user's desktop shortcuts?!", anim: 'curious', mood: 'curious' },
    reply: { text: "They were delicious. Full of crunchy pixels.", anim: 'happy', mood: 'happy' },
    delay: 2400
  },
  {
    initiator: 'kage',
    recipient: 'kage-chan',
    first: { text: "Kage-chan, are you falling asleep over there?", anim: 'curious', mood: 'curious' },
    reply: { text: "N-No! I'm just intensely admiring the wallpaper!", anim: 'surprised', mood: 'teasing' },
    delay: 2400
  },
  {
    initiator: 'kage-chan',
    recipient: 'kage',
    first: { text: "Look how hard our user is working today!", anim: 'happy', mood: 'happy' },
    reply: { text: "Indeed! Let's be extra good and give them support.", anim: 'excited', mood: 'happy' },
    delay: 2400
  },
  {
    initiator: 'kage',
    recipient: 'kage-chan',
    first: { text: "Race you to the top corner of the screen!", anim: 'excited', mood: 'excited' },
    reply: { text: "Hey, no using teleportation portals, cheater!", anim: 'excited', mood: 'excited' },
    delay: 2400
  }
];

module.exports = {
  KAGE_DIALOGUES,
  KAGE_CHAN_DIALOGUES,
  CROSS_DIALOGUES
};

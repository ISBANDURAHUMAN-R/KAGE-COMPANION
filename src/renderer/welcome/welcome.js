/**
 * KAGE COMPANION Welcome Screen Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  const pickKage = document.getElementById('pick-kage');
  const pickChan = document.getElementById('pick-chan');
  const optStartup = document.getElementById('opt-startup');
  const optAudio = document.getElementById('opt-audio');
  const btnEnter = document.getElementById('btn-enter');

  btnEnter.addEventListener('click', async () => {
    if (window.soundSynth) {
      window.soundSynth.play('notify');
    }

    try {
      if (window.settingsAPI) {
        // Save companion enabled states
        await window.settingsAPI.updateCharacter('kage', { enabled: pickKage.checked ? 1 : 0 });
        await window.settingsAPI.updateCharacter('kage-chan', { enabled: pickChan.checked ? 1 : 0 });

        // Save startup option
        await window.settingsAPI.setAutoLaunch(optStartup.checked);
        await window.settingsAPI.saveSetting('auto_launch', optStartup.checked ? 'true' : 'false');

        // Save audio option
        await window.settingsAPI.saveSetting('sound_enabled', optAudio.checked ? 'true' : 'false');

        // Mark first launch as done
        await window.settingsAPI.saveSetting('first_launch_done', 'true');
      }
    } catch (err) {
      console.error('Error saving welcome settings:', err);
    }

    // Close window
    window.close();
  });
});

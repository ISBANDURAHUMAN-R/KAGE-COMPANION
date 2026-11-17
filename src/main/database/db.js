const fs = require('fs');
const path = require('path');
const initSqlJs = require('sql.js');

class DatabaseManager {
  constructor() {
    this.db = null;
    this.dbPath = null;
    this.saveTimeout = null;
    this.initialized = false;
  }

  async init(userDataPath) {
    if (this.initialized) return;
    
    // Ensure data directory exists
    if (!fs.existsSync(userDataPath)) {
      fs.mkdirSync(userDataPath, { recursive: true });
    }
    this.dbPath = path.join(userDataPath, 'voidkage.sqlite');

    // Locate sql-wasm.wasm
    const wasmPath = path.join(__dirname, '../../../node_modules/sql.js/dist/sql-wasm.wasm');
    const SQL = await initSqlJs({
      locateFile: file => {
        if (fs.existsSync(wasmPath)) {
          return wasmPath;
        }
        return path.join(__dirname, '../../renderer/assets/sql-wasm.wasm');
      }
    });

    if (fs.existsSync(this.dbPath)) {
      try {
        const fileBuffer = fs.readFileSync(this.dbPath);
        this.db = new SQL.Database(fileBuffer);
      } catch (err) {
        console.error('Failed to load existing SQLite database, creating new:', err);
        this.db = new SQL.Database();
      }
    } else {
      this.db = new SQL.Database();
    }

    this.initTables();
    this.initialized = true;
    this.saveImmediately();
  }

  initTables() {
    this.db.run(`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT
      );

      CREATE TABLE IF NOT EXISTS characters (
        id TEXT PRIMARY KEY,
        enabled INTEGER DEFAULT 1,
        x INTEGER DEFAULT -1,
        y INTEGER DEFAULT -1,
        scale REAL DEFAULT 1.0,
        opacity REAL DEFAULT 1.0,
        mood TEXT DEFAULT 'idle',
        affection INTEGER DEFAULT 50,
        energy INTEGER DEFAULT 100,
        mischief INTEGER DEFAULT 50,
        last_interaction INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS interactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        character_id TEXT,
        interaction_type TEXT,
        mood_before TEXT,
        mood_after TEXT,
        dialogue TEXT,
        timestamp INTEGER
      );

      CREATE TABLE IF NOT EXISTS dialogue_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        character_id TEXT,
        dialogue_key TEXT,
        timestamp INTEGER
      );
    `);

    // Ensure default settings exist
    const defaultSettings = {
      'desktop_mode': 'normal', // quiet, focus, normal, active
      'sound_enabled': 'true',
      'sound_volume': '0.7',
      'voice_pitch': '1.0',
      'theme_glow': 'true',
      'glow_intensity': '0.8',
      'bubble_style': 'voidkage',
      'auto_launch': 'true',
      'start_minimized': 'false',
      'interaction_interval': '30', // seconds between autonomous checks
      'first_launch_done': 'false'
    };

    for (const [key, val] of Object.entries(defaultSettings)) {
      const stmt = this.db.prepare('SELECT value FROM settings WHERE key = ?');
      stmt.bind([key]);
      if (!stmt.step()) {
        this.db.run('INSERT INTO settings (key, value) VALUES (?, ?)', [key, val]);
      }
      stmt.free();
    }

    // Default character entries
    const defaultCharacters = [
      { id: 'kage', enabled: 1, scale: 1.0, mood: 'idle', affection: 50, energy: 100, mischief: 80 },
      { id: 'kage-chan', enabled: 1, scale: 1.0, mood: 'idle', affection: 65, energy: 90, mischief: 40 }
    ];

    for (const char of defaultCharacters) {
      const stmt = this.db.prepare('SELECT id FROM characters WHERE id = ?');
      stmt.bind([char.id]);
      if (!stmt.step()) {
        this.db.run(
          `INSERT INTO characters (id, enabled, scale, mood, affection, energy, mischief) 
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [char.id, char.enabled, char.scale, char.mood, char.affection, char.energy, char.mischief]
        );
      }
      stmt.free();
    }
  }

  getSetting(key, defaultValue = null) {
    if (!this.initialized) return defaultValue;
    const stmt = this.db.prepare('SELECT value FROM settings WHERE key = ?');
    stmt.bind([key]);
    let result = defaultValue;
    if (stmt.step()) {
      result = stmt.getAsObject().value;
    }
    stmt.free();
    return result;
  }

  setSetting(key, value) {
    if (!this.initialized) return;
    this.db.run('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)', [key, String(value)]);
    this.scheduleSave();
  }

  getAllSettings() {
    if (!this.initialized) return {};
    const res = this.db.exec('SELECT key, value FROM settings');
    const settings = {};
    if (res.length > 0) {
      for (const row of res[0].values) {
        settings[row[0]] = row[1];
      }
    }
    return settings;
  }

  getCharacter(id) {
    if (!this.initialized) return null;
    const stmt = this.db.prepare('SELECT * FROM characters WHERE id = ?');
    stmt.bind([id]);
    let result = null;
    if (stmt.step()) {
      result = stmt.getAsObject();
    }
    stmt.free();
    return result;
  }

  getAllCharacters() {
    if (!this.initialized) return [];
    const res = this.db.exec('SELECT * FROM characters');
    const list = [];
    if (res.length > 0) {
      const cols = res[0].columns;
      for (const row of res[0].values) {
        const obj = {};
        cols.forEach((col, idx) => {
          obj[col] = row[idx];
        });
        list.push(obj);
      }
    }
    return list;
  }

  updateCharacter(id, fields) {
    if (!this.initialized) return;
    const keys = Object.keys(fields);
    if (keys.length === 0) return;
    const setClause = keys.map(k => `${k} = ?`).join(', ');
    const values = keys.map(k => fields[k]);
    values.push(id);
    this.db.run(`UPDATE characters SET ${setClause} WHERE id = ?`, values);
    this.scheduleSave();
  }

  logInteraction(characterId, type, moodBefore, moodAfter, dialogue) {
    if (!this.initialized) return;
    this.db.run(
      `INSERT INTO interactions (character_id, interaction_type, mood_before, mood_after, dialogue, timestamp)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [characterId, type, moodBefore, moodAfter, dialogue, Date.now()]
    );
    this.scheduleSave();
  }

  getInteractionCount(characterId = null) {
    if (!this.initialized) return 0;
    let query = 'SELECT COUNT(*) as cnt FROM interactions';
    let params = [];
    if (characterId) {
      query += ' WHERE character_id = ?';
      params.push(characterId);
    }
    const stmt = this.db.prepare(query);
    stmt.bind(params);
    let count = 0;
    if (stmt.step()) {
      count = stmt.getAsObject().cnt;
    }
    stmt.free();
    return count;
  }

  getRecentInteractions(limit = 10) {
    if (!this.initialized) return [];
    const stmt = this.db.prepare(`
      SELECT * FROM interactions 
      ORDER BY timestamp DESC 
      LIMIT ?
    `);
    stmt.bind([limit]);
    const results = [];
    while (stmt.step()) {
      results.push(stmt.getAsObject());
    }
    stmt.free();
    return results;
  }

  recordDialogue(characterId, dialogueKey) {
    if (!this.initialized) return;
    this.db.run(
      'INSERT INTO dialogue_history (character_id, dialogue_key, timestamp) VALUES (?, ?, ?)',
      [characterId, dialogueKey, Date.now()]
    );
    this.scheduleSave();
  }

  isDialogueOnCooldown(characterId, dialogueKey, cooldownMs = 120000) {
    if (!this.initialized) return false;
    const stmt = this.db.prepare(
      'SELECT timestamp FROM dialogue_history WHERE character_id = ? AND dialogue_key = ? ORDER BY timestamp DESC LIMIT 1'
    );
    stmt.bind([characterId, dialogueKey]);
    let onCooldown = false;
    if (stmt.step()) {
      const ts = stmt.getAsObject().timestamp;
      if (Date.now() - ts < cooldownMs) {
        onCooldown = true;
      }
    }
    stmt.free();
    return onCooldown;
  }

  clearHistory() {
    if (!this.initialized) return;
    this.db.run('DELETE FROM interactions');
    this.db.run('DELETE FROM dialogue_history');
    this.saveImmediately();
  }

  scheduleSave() {
    if (this.saveTimeout) return;
    this.saveTimeout = setTimeout(() => {
      this.saveImmediately();
      this.saveTimeout = null;
    }, 1500);
  }

  saveImmediately() {
    if (!this.db || !this.dbPath) return;
    try {
      const data = this.db.export();
      const buffer = Buffer.from(data);
      fs.writeFileSync(this.dbPath, buffer);
    } catch (err) {
      console.error('Error saving SQLite database to disk:', err);
    }
  }

  close() {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
      this.saveTimeout = null;
    }
    this.saveImmediately();
    if (this.db) {
      this.db.close();
      this.db = null;
    }
    this.initialized = false;
  }
}

module.exports = new DatabaseManager();

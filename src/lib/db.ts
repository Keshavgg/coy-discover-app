import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { SEED_PROFILES, ProfileSeed } from './seeds';

export interface PublicProfile {
  id: string;
  name: string;
  age: number;
  photo: string;
  bio: string;
  location: string;
  interests: string[];
}

export interface MatchRecord extends PublicProfile {
  matched_at: string;
}

let dbInstance: Database.Database | null = null;

export function getDb(): Database.Database {
  if (dbInstance) return dbInstance;

  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const dbPath = path.join(dataDir, 'coy.db');
  dbInstance = new Database(dbPath);

  // Initialize Schema
  dbInstance.exec(`
    CREATE TABLE IF NOT EXISTS profiles (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      age INTEGER NOT NULL,
      photo TEXT NOT NULL,
      bio TEXT NOT NULL,
      location TEXT NOT NULL,
      interests TEXT NOT NULL,
      has_liked_user INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS swipes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      profile_id TEXT NOT NULL UNIQUE,
      action TEXT NOT NULL CHECK(action IN ('like', 'pass')),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(profile_id) REFERENCES profiles(id)
    );

    CREATE TABLE IF NOT EXISTS matches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      profile_id TEXT NOT NULL UNIQUE,
      matched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(profile_id) REFERENCES profiles(id)
    );
  `);

  // Seed profiles if table is empty
  const countRow = dbInstance.prepare('SELECT COUNT(*) as count FROM profiles').get() as { count: number };
  if (countRow.count === 0) {
    const insertStmt = dbInstance.prepare(`
      INSERT INTO profiles (id, name, age, photo, bio, location, interests, has_liked_user)
      VALUES (@id, @name, @age, @photo, @bio, @location, @interests, @has_liked_user)
    `);

    const insertMany = dbInstance.transaction((seeds: ProfileSeed[]) => {
      for (const p of seeds) {
        insertStmt.run({
          id: p.id,
          name: p.name,
          age: p.age,
          photo: p.photo,
          bio: p.bio,
          location: p.location,
          interests: JSON.stringify(p.interests),
          has_liked_user: p.has_liked_user ? 1 : 0,
        });
      }
    });

    insertMany(SEED_PROFILES);
  }

  return dbInstance;
}

/**
 * Returns cards the current user has NOT yet swiped on.
 * Strictly adheres to Coy privacy guarantee:
 * Never reveal who liked the user (has_liked_user is NEVER sent in response).
 */
export function getFeedProfiles(): PublicProfile[] {
  const db = getDb();
  const rows = db.prepare(`
    SELECT id, name, age, photo, bio, location, interests
    FROM profiles
    WHERE id NOT IN (SELECT profile_id FROM swipes)
    ORDER BY id ASC
  `).all() as any[];

  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    age: r.age,
    photo: r.photo,
    bio: r.bio,
    location: r.location,
    interests: JSON.parse(r.interests),
  }));
}

/**
 * Records a swipe (like or pass).
 * If user likes a profile that has already liked them, a mutual match is created!
 */
export function recordSwipe(profileId: string, action: 'like' | 'pass') {
  const db = getDb();

  const profile = db.prepare('SELECT * FROM profiles WHERE id = ?').get(profileId) as any;
  if (!profile) {
    throw new Error('Profile not found');
  }

  // Insert or ignore swipe
  db.prepare(`
    INSERT OR REPLACE INTO swipes (profile_id, action, created_at)
    VALUES (?, ?, CURRENT_TIMESTAMP)
  `).run(profileId, action);

  // Check mutual match condition
  let isMatch = false;
  let matchedProfile: PublicProfile | null = null;

  if (action === 'like' && profile.has_liked_user === 1) {
    isMatch = true;
    db.prepare(`
      INSERT OR IGNORE INTO matches (profile_id, matched_at)
      VALUES (?, CURRENT_TIMESTAMP)
    `).run(profileId);

    matchedProfile = {
      id: profile.id,
      name: profile.name,
      age: profile.age,
      photo: profile.photo,
      bio: profile.bio,
      location: profile.location,
      interests: JSON.parse(profile.interests),
    };
  }

  return {
    success: true,
    matched: isMatch,
    profile: matchedProfile,
  };
}

/**
 * Returns all mutual matches.
 */
export function getMatches(): MatchRecord[] {
  const db = getDb();
  const rows = db.prepare(`
    SELECT p.id, p.name, p.age, p.photo, p.bio, p.location, p.interests, m.matched_at
    FROM matches m
    JOIN profiles p ON m.profile_id = p.id
    ORDER BY m.matched_at DESC
  `).all() as any[];

  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    age: r.age,
    photo: r.photo,
    bio: r.bio,
    location: r.location,
    interests: JSON.parse(r.interests),
    matched_at: r.matched_at,
  }));
}

/**
 * Undoes the most recent swipe (Rewind feature).
 */
export function undoLastSwipe(): PublicProfile | null {
  const db = getDb();
  const lastSwipe = db.prepare(`
    SELECT profile_id FROM swipes ORDER BY id DESC LIMIT 1
  `).get() as { profile_id: string } | undefined;

  if (!lastSwipe) return null;

  const profileId = lastSwipe.profile_id;
  db.prepare('DELETE FROM swipes WHERE profile_id = ?').run(profileId);
  db.prepare('DELETE FROM matches WHERE profile_id = ?').run(profileId);

  const profile = db.prepare('SELECT * FROM profiles WHERE id = ?').get(profileId) as any;
  if (!profile) return null;

  return {
    id: profile.id,
    name: profile.name,
    age: profile.age,
    photo: profile.photo,
    bio: profile.bio,
    location: profile.location,
    interests: JSON.parse(profile.interests),
  };
}

/**
 * Resets all swipes and matches for reviewer testing.
 */
export function resetDatabase() {
  const db = getDb();
  db.prepare('DELETE FROM swipes').run();
  db.prepare('DELETE FROM matches').run();
  return { success: true, message: 'All swipes and matches cleared for testing.' };
}

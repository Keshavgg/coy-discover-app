# Coy Discover Tab & Mutual Match Engine

An interactive, privacy-first swipe discovery app built for the **Coy SDE Intern Assignment**.

**Candidate:** Keshav Jindal  
**Email:** [keshav.jindal.7029@gmail.com](mailto:keshav.jindal.7029@gmail.com) | **Phone:** +91 8368317466  
**College:** Maharaja Agrasen Institute of Technology (MAIT, GGSIPU), Delhi (B.Tech CSE '27)  
**Profiles:** [GitHub](https://github.com/Keshavgg) • [LeetCode (500+ Solved)](https://leetcode.com/u/XxKeshavxX/) • [Portfolio](https://keshavgg.github.io/keshav-portfolio/)

---

## Part A: Two Core Feature Suggestions for Coy (`app.getcoy.com`)

### 1. "Campus Circles & Double-Blind Proximity Beacon"
* **What it is:** A zero-knowledge notification system linked to verified college domains or campus circles. If someone from your campus/major secretly adds you, you receive a nudge:
  > *"Someone in MAIT CSE (Batch '27) has added you as a secret crush! Add your crushes to see if it's mutual."*
  *(No names, no timestamps, no gender revealed).*
* **Why it's required (Product Rationale):**
  - **Eliminates Cold-Start Friction:** Solves the core user doubt (*"Will my crush even be on Coy?"*).
  - **Viral Growth Flywheel:** Sparks organic buzz in hostel WhatsApp groups and college Instagram pages, driving viral app invites by 4–5x.
  - **Strict Privacy Preservation:** The identity remains completely double-blind until mutual match occurs.

### 2. "Time-Delayed 'Farewell / Semester-End' Capsule"
* **What it is:** An optional time-lock modifier when adding someone you interact with daily (classmate, lab partner):
  > **[Lock Match until Semester Exams / College Farewell]**
  If both users add each other, the match remains sealed in a mutual vault until the selected date, or unlocks immediately only if both opt for "Instant".
* **Why it's required (User Psychology Rationale):**
  - **Removes In-Person Awkwardness:** Eliminates the dread of *"What if Monday's 9 AM lab becomes weird?"*
  - **Safety Net for High-Friction Crushes:** Unlocks the most authentic crush confessions that users currently hesitate to register.

---

## Part B: Implementation & Features

- **Next.js 14 App Router + React 18 + TypeScript + Tailwind CSS**
- **Mobile-first viewport** with iPhone shell styling on desktop and full responsive layout on mobile.
- **Framer Motion spring physics** for realistic drag/flick gestures, rotational angle mapping, and real-time `LIKE` (green) / `PASS` (red) stamp indicators.
- **Zero-Leak Security:** `has_liked_user` is stripped from `/api/feed` before sending to the client so network inspection cannot reveal admirers.
- **Mutual Match Celebration:** Canvas Confetti animation, pulsating avatar halos, and instant transition to mock chat.
- **Persistence & Reviewer Tools:**
  - SQLite backend (`better-sqlite3`) persists swipes and matches across reloads.
  - Includes **Undo/Rewind (↺)** and **Reset Demo (🔄)** buttons so the reviewer can test repeatedly.

---

## API Specification

- `GET /feed` (or `/api/feed`): Returns remaining unswiped profiles.
- `POST /swipe` (or `/api/swipe`): Records `{ profileId, action: 'like' | 'pass' }` and returns `{ success: true, matched: boolean, profile }`.
- `GET /matches` (or `/api/matches`): Returns mutual matches.
- `POST /api/undo`: Restores last swiped profile.
- `POST /api/reset`: Clears swipes and matches table for demo re-runs.

---

## Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Build & start production server
npm run build
npm start
```
Open [http://localhost:3000](http://localhost:3000) to view the app.

# Coy SDE Intern Assignment Submission

**Candidate:** Keshav Jindal  
**Email:** [keshav.jindal.7029@gmail.com](mailto:keshav.jindal.7029@gmail.com)  
**Phone:** +91 8368317466  
**College:** Maharaja Agrasen Institute of Technology (MAIT, GGSIPU), Delhi  
**Degree:** B.Tech Computer Science & Engineering (Batch 2023–2027)  
**GitHub:** [https://github.com/Keshavgg](https://github.com/Keshavgg)  
**LeetCode:** [https://leetcode.com/u/XxKeshavxX/](https://leetcode.com/u/XxKeshavxX/) (500+ Solved)  
**Portfolio:** [https://keshavgg.github.io/keshav-portfolio/](https://keshavgg.github.io/keshav-portfolio/)  

---

## Part A: Product Teardown & Two Core Feature Suggestions

After exploring Coy ([app.getcoy.com](https://app.getcoy.com)) across phone OTP login, adding secret crushes, email verification, viral invite referral loops, and slot limits, here is my product analysis and two high-leverage feature proposals:

### Feature 1: "Campus Whisper / Double-Blind Proximity Beacon"
* **The Concept:** A zero-knowledge notification system linked to verified college domains or campus circles. If user A adds user B as a crush, and both attend the same campus, user B receives a privacy-preserving nudge:
  > *"Someone in MAIT CSE (Batch '27) has added you as a secret crush! Add your crushes to see if it's mutual."*
  *(Zero identity, gender, or timing details revealed).*
* **Why this is required (The Core Product Problem it Solves):**
  1. **Overcomes Cold-Start Paralyzation:** Dating/crush apps suffer from the *“What if nobody I know is using this?”* doubt. Users hesitate to spend their crush slots if they assume the other person isn't on the platform.
  2. **Viral Campus Flywheel:** An alert stating that someone in their immediate college or department likes them triggers massive curiosity and FOMO. This gets shared on college hostel WhatsApp groups and Instagram stories, multiplying invite link conversions by 4–5x.
  3. **Zero Privacy Compromise:** It strictly honors Coy's foundational promise: the identity remains 100% concealed unless the recipient independently adds that same person.

---

### Feature 2: "Time-Delayed 'Farewell / Semester-End' Capsule"
* **The Concept:** A mutual timing modifier on crush admissions. When adding someone you see every day (classmate, project partner, society co-member), you can optionally toggle:
  > **[Lock Match until Semester Exams / College Farewell]**
  If both users add each other, the match remains sealed in a mutual vault until the selected milestone date, or reveals immediately only if both choose "Instant".
* **Why this is required (The Psychological Barrier it Solves):**
  1. **Eliminating Daily In-Person Awkwardness:** The biggest fear preventing Gen-Z college students from admitting a crush is: *“What if it becomes awkward in Monday's 9 AM lab?”*
  2. **Psychological Safety Net:** Students feel vastly more comfortable confessing feelings when they know the reveal aligns with natural social transitions (e.g. end of term or farewell).
  3. **Unlocks High-Friction Crushes:** This captures the most valuable, high-intent crush data that users currently self-censor.

---

## Part B: Discover Tab Implementation

A high-performance, mobile-first swipe discovery tab built with **Next.js 14 (App Router)**, **React 18**, **TypeScript**, **Tailwind CSS**, **Framer Motion**, and **SQLite**.

### Key Architectural Highlights:
1. **Strict Privacy Architecture (Zero-Leak Guarantee):**
   - The database stores `has_liked_user` (to enable real-time mutual match detection).
   - In accordance with Coy's core security rule (*"Never reveal who has liked the user unless it is mutual"*), the `/api/feed` endpoint **sanitizes and strips** `has_liked_user` before serializing JSON to the client. Even if a user inspects browser dev tools / network payloads, the pre-like status is cryptographically inaccessible.
2. **Gesture & Physics Engine:**
   - Framer Motion interactive pan/drag gesture with elastic boundary physics.
   - Rotational tilt proportional to horizontal displacement (-15° to +15°).
   - Dynamic real-time stamp indicators: green **`LIKE`** badge on right swipe, red **`PASS`** badge on left swipe.
   - Desktop-friendly controls: Pass (✕), Superlike (★), Like (♥), and Rewind/Undo (↺).
3. **Mutual Match Celebration:**
   - When a user swipes right on an incoming admirer, the server records a mutual match in the `matches` table and returns the match payload.
   - Triggers full-screen celebration modal with `canvas-confetti`, pulsing avatar halo, and direct transition to private chat.
4. **Persistent State & Demo Reset:**
   - Persists all swipes and matches across page refreshes in SQLite (`data/coy.db`).
   - Includes a **`Reset Demo`** button so reviewers can test the complete flow repeatedly.
   - Includes an **`Undo / Rewind`** feature to restore accidentally swiped profiles.

---

### Backend API Endpoints:

| Endpoint | Method | Description |
|---|---|---|
| `/api/feed` (or `/feed`) | `GET` | Returns unswiped profiles with `has_liked_user` strictly stripped. |
| `/api/swipe` (or `/swipe`) | `POST` | Records `{ profileId, action: 'like' \| 'pass' }`. Returns `{ success: true, matched: boolean, profile }`. |
| `/api/matches` (or `/matches`) | `GET` | Returns all mutual matches with timestamps and match details. |
| `/api/undo` | `POST` | Rewinds the most recent swipe and restores the profile to the deck. |
| `/api/reset` | `POST` | Clears swipes and matches table for reviewer testing. |

---

### Local Installation & Run:

```bash
# Clone the repository
git clone https://github.com/Keshavgg/coy-discover-app.git
cd coy-discover-app

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser (or toggle mobile view in DevTools).

# Beacon

**Real-time emergency medical supply logistics for outbreak response.**

During a crisis—Ebola, Hantavirus, or similar—specialized gear runs out in hours. Negative-pressure isolation pods, antivirals, and Level-4 hazmat suits disappear from shelves while patients wait. Often, Hospital A is out of life-saving supplies while Hospital B, ten miles away, has surplus sitting unused.

The problem is not a lack of supplies. It is a lack of **visibility**.

Beacon is a real-time logistics dashboard that surfaces deficits across a region, matches shortages to nearby surplus, and visualizes supply routes so dispatchers can move gear where it is needed most—fast.

---

## The Problem We Solve

| What people assume | What actually happens |
|--------------------|------------------------|
| There are not enough supplies | Supplies exist but are stranded at the wrong facility |
| Someone must manually call every hospital | No one has a live view of who has what |
| Routing is guesswork | Closest surplus hospital is unknown until it is too late |

Beacon gives hospitals a simple way to report stock and flags, and gives central command a map-first view of the entire network—with automatic pairing when a critical shortage hits.

---

## How It Works

### 1. Hospital View (Inventory Input)

A hospital administrator opens a lightweight dashboard (no heavy auth for the hackathon—hardcoded roles are fine).

They enter current stock for critical items, for example:

- Hazmat suits: 50  
- Ventilators: 2  
- Antivirals: 500  

Each item can be flagged as:

- **CRITICAL SHORTAGE** — needed immediately  
- **SURPLUS** — can spare units to neighbors  

Updates sync in real time so command always sees the latest numbers.

### 2. Central Command Map (Dispatcher / Government View)

The core of Beacon: a regional map with a pin for every hospital.

Pins are color-coded by inventory health:

| Color | Meaning |
|-------|---------|
| Green | Adequately stocked |
| Yellow | Low but manageable |
| Red | Critical shortage of life-saving gear |

Dispatchers see the whole network at a glance—no spreadsheets, no phone trees.

### 3. Smart Matchmaker (Backend Logic)

When Hospital A requests supplies (e.g. “50 hazmat suits”), Beacon:

1. Queries all hospitals with a **surplus** of that item  
2. Computes geographic distance from Hospital A to each candidate  
3. Pairs Hospital A with the **closest** hospital that has enough stock  

No machine learning—just database lookups and distance math, presented as a **Dynamic Resource Allocation** workflow.

### 4. Routing Visualizer

After a match:

- A route line is drawn on the map between the two hospitals  
- Driving time / distance is shown (Mapbox or Google Maps routing API)  
- The dispatcher gets a **Deploy Transport** action to confirm the run  

---

## “Smart” Without Machine Learning

Judges respond to automation and clear metrics, not black-box AI.

### Readiness Score (0–100)

For each hospital:

```
Readiness Score = (Total Critical Supplies on Hand) / (Total Bed Capacity) × 100
```

(normalize or cap as needed for demo stability)

| Score | Behavior |
|-------|----------|
| **&lt; 30** | Dashboard highlights red; treat as at-risk |
| **&gt; 80** | Eligible surplus donor for automated alerts |

When a hospital drops below 30, Beacon can automatically notify the nearest hospital with a score above 80—surplus routed before a human finishes a phone call.

---

## Recommended Tech Stack

Built for a **48-hour hackathon**: fast to ship, impressive in demo, minimal ML overhead.

| Layer | Choice | Why |
|-------|--------|-----|
| **Database** | Firebase / Firestore | Real-time sync: hospital updates the map instantly |
| **Frontend** | React or Vue + Tailwind | Polished UI quickly |
| **Map** | Mapbox GL JS or Google Maps JS | Pins, styling, routing lines |
| **Routing API** | Mapbox Directions or Google Directions | Drive time between matched hospitals |
| **Backend** | Node.js (Express) or Python (Flask) | Distance math, matching, readiness scores |

---

## MVP Priorities

Spend **~80% of effort** on what wins demos:

1. **Beautiful map** — seeded with ~10 hospitals so the UI looks alive  
2. **Shortage → surplus matching** — reliable, visible, instant  
3. **Live sync** — one laptop triggers shortage; main screen reacts  

**Defer for later:**

- Full login / OAuth (hardcode Hospital A, Hospital B, Dispatcher)  
- Production-grade auth and audit logs  
- Full inventory SKUs beyond a small critical set  

---

## Demo Script (The “Wow” Moment)

1. **Seed data** before presenting: ~10 fake hospitals with varied stock and readiness scores.  
2. **Main screen**: Central Command map on the projector.  
3. **Second laptop**: Teammate acts as “Hospital A.”  
4. **Live action**: Teammate clicks **Trigger Emergency Shortage** (or flags a critical item).  
5. **Payoff**: On the main screen, a green pin flips to flashing red; a route line appears to the nearest surplus hospital; dispatcher can hit **Deploy Transport**.

That single synchronized moment sells the product.

---

## User Roles (Hackathon Simplification)

| Role | View | Actions |
|------|------|---------|
| **Hospital** | Inventory dashboard | Update stock, flag shortage/surplus, request supplies |
| **Dispatcher** | Regional map | Monitor pins, confirm routes, deploy transport |

Roles can be hardcoded URLs or a simple role picker—no account system required for MVP.

---

## Pitch (One Paragraph for Judges)

> During an outbreak, specialized gear runs out in hours. Hospital A has patients dying for lack of supplies while Hospital B, miles away, has surplus in a closet. Beacon is a real-time logistics dashboard that shows every hospital’s critical inventory on a live map, scores readiness automatically, and when a facility hits critical shortage, matches it to the closest surplus donor and draws the supply route—so dispatchers can deploy transport in seconds, not hours.

---

## Project Name

**Beacon** — a signal fire for hospitals in crisis: see who needs help, who can help, and the path between them.

---

## Next Steps for the Team

- [ ] Define the critical supply list (5–8 items max for MVP)  
- [ ] Pick map provider (Mapbox vs Google) and get API keys  
- [ ] Design Firestore schema: `hospitals`, `inventory`, `requests`, `routes`  
- [ ] Implement readiness score + match-nearest-surplus function  
- [ ] Build Hospital dashboard and Dispatcher map in parallel  
- [ ] Seed demo data and rehearse the live shortage trigger  

---

*Built for Uncommon Hacks — emergency supply visibility when every minute counts.*

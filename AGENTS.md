# Marathon Tracker

## Purpose
Mobile-first web application for logging and reviewing marathon training data. Tracks runs, nutrition, and hydration with a Final Fantasy VI pixel-art theme.

## Tech Stack
- **Backend:** Node.js, Express 4
- **Database:** MongoDB via Mongoose 8
- **Frontend:** Vanilla HTML5, CSS3, JavaScript (no frameworks)
- **Styling:** Custom CSS with Final Fantasy VI pixel-art theme

## Key Files
- `server.js` — Express server entry point (port 3001)
- `routes/api.js` — All REST API endpoints
- `models/Run.js`, `models/Meal.js`, `models/Water.js` — Mongoose schemas
- `public/index.html` — SPA shell
- `public/app.js` — Client-side logic
- `public/style.css` — Layout and component styles
- `public/ff6.css` — Final Fantasy VI theme skin

## API Routes
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/runs | List runs |
| POST | /api/runs | Create a run |
| DELETE | /api/runs/:id | Delete a run |
| GET | /api/meals | List meals |
| POST | /api/meals | Create a meal |
| DELETE | /api/meals/:id | Delete a meal |
| GET | /api/water | List water entries |
| POST | /api/water | Create a water entry |
| DELETE | /api/water/:id | Delete a water entry |
| GET | /api/summary | Aggregated weekly stats |

## Conventions
- CORS enabled for development
- Date-range filtering via ?start=YYYY-MM-DD&end=YYYY-MM-DD
- Mobile-first, responsive design with safe-area insets
- Runs: distance in km, duration in minutes, pace auto-calculated
- Meal tracking: calories, protein, carbs, fat per entry
- Water tracking: volume in ml

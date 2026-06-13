# Marathon Tracker

Track runs, nutrition, and hydration during marathon training — mobile-first web app.

## Tech Stack

- **Backend:** Node.js, Express
- **Database:** MongoDB (Mongoose)
- **Frontend:** Vanilla HTML, CSS, JS

## Getting Started

```bash
npm install
cp .env.example .env  # Edit with your MongoDB URI
npm start
```

Runs on **http://localhost:3001**.

## Phone Access

On the same WiFi, visit `http://<your-ip>:3001` from your phone.

## Features

- **Runs** — log distance, duration, type (easy/tempo/interval/long run), RPE, notes
- **Nutrition** — track meals, calories, protein
- **Hydration** — quick-add water in ml
- **Weekly summary** — total km, runs, calories, and water at a glance
- **Mobile-first** — touch-friendly, swipeable modals

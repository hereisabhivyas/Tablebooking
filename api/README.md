# Table Feast API

Express + TypeScript API connecting to a MongoDB cluster. Provides endpoints for restaurants, tables, categories, and menu items.

## Quick Start

1. Create a `.env` file in `api` folder:

```
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>/<db>?retryWrites=true&w=majority
PORT=4000
CORS_ORIGIN=http://localhost:8080
```

2. Install dependencies and run dev server:

```bash
cd "d:\Table booking\api"
npm install
npm run dev
```

3. Test health endpoint:

```bash
curl http://localhost:4000/health
```

## Scripts
- `npm run dev` – starts dev server with TSX watcher
- `npm run build` – compiles to `dist`
- `npm start` – runs compiled server

## Endpoints
- `GET /health` – health check & DB status
- `GET/POST /restaurants` – list/create restaurants
- `GET/PUT/DELETE /restaurants/:id` – get/update/delete restaurant
- Similar endpoints for `/tables` and `/menu-items`


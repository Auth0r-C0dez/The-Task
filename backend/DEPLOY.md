# Hostinger Node deployment

1. Create a **Node.js** application in hPanel (Node 18+).
2. Connect this repo or upload the `backend/` folder.
3. **Build command:** `npm install && npm run build`
4. **Start command:** `npm start`
5. Set environment variables in the panel:

| Variable | Example |
|----------|---------|
| `PORT` | Provided by Hostinger |
| `FRONTEND_URL` | `https://your-app.vercel.app` |
| `OPENAI_API_KEY` | Optional — richer analysis |
| `DATA_DIR` | Persistent path, e.g. `./data` |
| `CORS_ALLOW_ALL` | `true` if Vercel preview URLs fail CORS |

6. After first deploy, SSH or use terminal:

```bash
npm run seed
```

This writes 25 analyzed people + 300 agent dates so your **demo link** works immediately.

7. Point Vercel `NEXT_PUBLIC_API_URL` to this API’s public URL (no trailing slash).

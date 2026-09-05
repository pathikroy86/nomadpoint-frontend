# NomadPoint Frontend

Next.js frontend for NomadPoint with Better Auth, profile management, country browsing, and the destination recommender.

## Local Setup

1. Copy `.env.example` to `.env.local`.
2. Add your MongoDB, Better Auth, backend, and ImgBB values.
3. Run `npm install`.
4. Run the development server:

```sh
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Vercel Deployment

Create a separate Vercel project from this `nomadpoint_frontend` folder.

Deploy the backend first, then set the frontend environment variables:

```env
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB=nomadpoint
BETTER_AUTH_SECRET=your_generated_secret
BETTER_AUTH_URL=https://your-frontend-domain.vercel.app
NEXT_PUBLIC_APP_URL=https://your-frontend-domain.vercel.app
NEXT_PUBLIC_BACKEND_URL=https://your-backend-domain.vercel.app
IMGBB_API_KEY=your_imgbb_api_key
```

Optional Google auth variables:

```env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

After the frontend deploy URL is final, add that URL to the backend Vercel project's `FRONTEND_URL` or `ALLOWED_ORIGINS`.

## Production Checks

```sh
npm run lint
npm run build
```

# Campus Placement Prep — Backend

## What this is
Backend API for a platform where students practice placement quizzes and
browse/apply to job vacancies, and an admin manages both.

## Setup steps

1. Install dependencies:
   ```
   npm install
   ```

2. Create a MongoDB Atlas account (free tier) at mongodb.com/atlas,
   create a cluster, and get your connection string.

3. Copy `.env.example` to `.env` and fill in your values:
   ```
   cp .env.example .env
   ```

4. Run the server in development mode:
   ```
   npm run dev
   ```

5. Server runs at http://localhost:5000
   Test it's working by visiting that URL — you should see
   "Campus Placement Prep API is running"

## API Routes overview

**Auth**
- POST /api/auth/signup
- POST /api/auth/login

**Vacancies**
- GET /api/vacancies (all logged-in users, supports ?role= filter)
- POST /api/vacancies (admin only)
- PUT /api/vacancies/:id (admin only)
- DELETE /api/vacancies/:id (admin only)

**Quizzes**
- GET /api/quizzes (list all)
- GET /api/quizzes/:id (get one with questions)
- POST /api/quizzes (admin only, create)
- POST /api/quizzes/:id/submit (student submits answers, auto-scored)
- GET /api/quizzes/history/me (student's own attempt history)

**Applications**
- POST /api/applications (student applies)
- GET /api/applications/me (student's own applications)
- GET /api/applications/vacancy/:vacancyId (admin views applicants)
- PUT /api/applications/:id (admin updates status)

## Next step
Build the React frontend that calls these routes. Start with the
signup/login pages, then the vacancy board, then the quiz module.

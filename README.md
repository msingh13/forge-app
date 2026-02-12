# Forge

Forge is a web platform that helps Montreal students turn ideas into real projects by connecting them with the right teammates.

## What Forge does
Students often have:
- An idea but no team
- Skills but no project
- Motivation but no structure

Forge fixes that by letting students:
- Create a profile with skills + school
- Post project/startup ideas
- Express interest in ideas
- Approve collaborators and unlock private chat
- Search/filter by skills, school, commitment, stage

## MVP (v1 scope)
- Auth (email/password)
- User profile (school, program, skills, looking_for)
- Idea posting (title, description, stage, roles_needed, commitment_level)
- Interest system (request to join + accept/reject)
- Messages (chat unlocked only after accepted)
- Search + filters (basic)

## Target users
University/college students in Montreal (Concordia, McGill, UQAM, ÉTS, UdeM, etc.).
We can expand later once Montreal is working.

## Tech stack (planned)
- Frontend: Next.js (web)
- Backend: Node.js + Express
- Database: PostgreSQL
- ORM: Prisma
- Auth: JWT

## Repo structure
forge/
frontend/
backend/
README.md

## Roadmap (short)
- v1: Montreal-only MVP
- v1.1: school email verification + badges
- v2: expand to other cities, teams, and public profiles/portfolios


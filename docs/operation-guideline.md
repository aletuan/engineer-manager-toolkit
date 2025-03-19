# Operation Guidelines

This document summarizes the commonly used commands in the development process of the Engineer Manager Toolkit project.

## Installation and Startup

### Installing Dependencies

```bash
# Install dependencies for the entire project (both frontend and backend)
pnpm install

# Install dependencies for backend
cd server
pnpm install
```

### Starting the Application

```bash
# Start backend server
cd server
pnpm run dev

# Start frontend (from root directory)
pnpm run dev
```

## Prisma Commands

### Schema and Database Management

```bash
# Generate Prisma Client after schema changes
cd server
pnpm prisma generate

# Create new migration when schema changes
cd server
pnpm prisma migrate dev --name <migration_name>

# Apply migrations to database
cd server
pnpm prisma migrate deploy

# Reset database and reapply all migrations
cd server
pnpm prisma migrate reset

# Push schema directly to database (without creating migration)
cd server
pnpm prisma db push

# Reset database and apply schema (force)
cd server
pnpm prisma db push --force-reset

# Seed database with sample data
cd server
pnpm prisma db seed
```

### Data Exploration and Management

```bash
# Open Prisma Studio to view and edit data
cd server
pnpm prisma studio
```

## Useful Scripts

### Checking Duty Schedules

```bash
# Check Standup Hosting schedule
cd server
pnpm ts-node scripts/check-standup-hosting.ts

# Check Incident Rotation schedule
cd server
pnpm ts-node scripts/check-incident-rotation.ts
```

## Git Management

```bash
# Check current status
git status

# Create new branch
git checkout -b feature/<feature_name>

# Commit changes
git add .
git commit -m "feat: change description"

# Push to remote repository
git push origin <branch_name>

# Pull latest code from remote
git pull origin <branch_name>
```

## Testing

```bash
# Run unit tests
cd server
pnpm test

# Run tests with coverage
cd server
pnpm test:coverage
```

## Swagger API Documentation

After starting the server, you can access the Swagger UI to view and test APIs at:

```
http://localhost:3001/api-docs
```

## Troubleshooting

### New Model Not Recognized by Prisma Client

If you encounter the error "Property 'modelName' does not exist on type 'PrismaClient'", perform:

```bash
cd server
pnpm prisma generate
```

### Database Not in Sync with Schema

```bash
cd server
pnpm prisma db push --force-reset
pnpm prisma db seed
```

### Port Already in Use

If you encounter the error "Port 3001 is already in use", find and kill the process using the port:

```bash
# Find process using port
lsof -i :3001

# Kill process
kill -9 <PID>
```

## Development Workflow

1. Pull latest code from main branch
2. Create new branch for feature/fix
3. Develop and test locally
4. Commit and push code
5. Create Pull Request
6. Review and merge after approval

## Notes

- Always run `pnpm prisma generate` after schema changes
- Use conventional commits for easier change tracking
- Ensure tests pass before creating Pull Request
- Update documentation when adding new features 
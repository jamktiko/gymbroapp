# GymBro App

## Description

GymBro is an application that combines fun gamified functionalities with gym training to help users stay motivated and achieve their fitness goals. By transforming regular workouts into an engaging experience—featuring workout sessions, XP progression, and unlockable achievements—the app provides an easy and rewarding way to track training sessions. Designed for fitness enthusiasts of all levels, GymBro encourages consistency and continuous progress through a unique blend of practical fitness tracking and game-like elements!

## Tech Stack

- **Frontend:** Ionic 8, Angular 20, Capacitor (Cross-platform mobile)
- **Backend:** Node.js 24, Express, Vitest + Supertest + mongodb-memory-server (Automated Testing)
- **Database** MongoDB Atlas
- **Infrastructure (AWS):** Elastic Beanstalk, S3, CloudFront
- **Identity & Security:** Google OAuth, AWS Secrets Manager
- **CI/CD:** GitHub Actions (Automated testing and Beanstalk deployment via OIDC pipeline)

## Getting Started

### Prerequisites

- Node.js (v24 recommended)
- Angular CLI & Ionic CLI

### Local Development

**Frontend:**

```bash
cd frontend
npm install
ionic serve           # Serves the Angular frontend on localhost:8100
```

## Authors

- **Tavi Netta** - Frontend Developer, Scrum Master
- **Joona Järvi** - Backend Developer, Product Owner
- **Matias Vairama** - AWS Integration & CI/CD Pipeline
- **Jarius Korpisaari** - Frontend Developer
- **Lauri Makkonen** - Full Stack Developer

## Version History

- **1.0.0.** - First stable version

## License

This project is licensed under the CC-BY-SA 4.0 license - see the [LICENSE.md](LICENSE.md) file for details.

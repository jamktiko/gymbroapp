# GymBro App

## Description

The application creates an easy way for the user to track the best-before dates of their own pantry groceries easily with a single app. The user can enter the best-before dates of their food items into the application, and the application will notify them of the approaching date. The purpose of the application is to reduce potential food waste and it is convenient with long-dated items, such as rice or canned goods. The application is intended for ordinary consumers who want to reduce food waste.

GymBro is an application that combines fun gamified functionalities

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

- **1.0.** - First version

## License

This project is licensed under the CC BY-SA 4.0 License - see the [license.md](license.md) file for details.

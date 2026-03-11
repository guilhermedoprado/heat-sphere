# HeatSphere

> **Convective Heat Transfer — Supported.**

HeatSphere is an interactive learning platform built to support the study of Heat Transfer through structured notes, interactive solvers, formularies, and worked calculations.

It was designed as a real study tool for engineering students — not just to read theory, but to write notes, test equations, and build intuition through practical problem-solving.

## 🚀 Current Features

- **Markdown Notes:** Create and organize study notes with LaTeX math rendering.
- **PDF Support:** Export notes and formularies to PDF, and work with imported content.
- **Formularies:** Browse organized heat transfer equations by topic.
- **Interactive Solvers:** Use built-in calculators for multiple convection and fin problems.
- **Command Palette:** Type `\` inside notes to embed live calculators inline, Notion-style.
- **Pomodoro Timer:** Stay focused while studying with an integrated timer.
- **Worked Calculations:** Structured engineering exercises with formulas, assumptions, and numerical results.

## 📚 Scope

HeatSphere currently focuses on **Convective Heat Transfer**, with supported content for notes, formularies, and solvers related to this area.

## 🛠 Tech Stack

### Frontend
- **React**
- **TypeScript**
- **Vite**
- **React Router**
- **CSS Modules**

### Backend
- **ASP.NET Core (C#)**
- **REST API**
- **Swagger / OpenAPI**
- **Entity Framework Core**
- **PostgreSQL**

### Services & Infrastructure
- **Go microservices**
- **Docker & Docker Compose**
- **Nginx**
- **Azure Container Apps**
- **OAuth 2.0**

## 🐳 Run with Docker

Start the full stack with:

```bash
docker compose up -d --build
```

Once the containers are running, access the services here:

Frontend: http://localhost:5173

API (Swagger): http://localhost:8080/swagger

## 🔮 Roadmap

Planned improvements include:

- Rename and delete tasks functionality.

- Fix LaTeX rendering inside Markdown solvers.

- Add step-by-step calculations.

- Expand formularies across more heat transfer topics.

- Add more interactive solvers.

- Add Conduction and Radiation modules.

- Improve mobile responsiveness and overall UI polish.

- Add comprehensive tests for calculation engines.

## 🤝 Contributing

Contributions are welcome.

If you have suggestions for engineering modules, solvers, or UI improvements:

- Fork the repository.

- Create a feature branch: git checkout -b feature/AmazingFeature

- Commit your changes: git commit -m "Add some AmazingFeature"

- Push to the branch: git push origin feature/AmazingFeature

- Open a Pull Request.
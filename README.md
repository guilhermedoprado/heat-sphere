# Heat Sphere

> **Master Heat Transfer, One Module at a Time.**

Heat Sphere is an interactive learning platform designed to help students and engineers visualize convective heat transfer concepts. Dive into theory, work through real calculations, and build engineering intuition—all in one place.

## 🚀 Available Features

*   **Study Notes:** Concise, review-ready summaries of key concepts.
*   **Formulary:** A comprehensive database of correlations and formulas organized by topic.
*   **Solvers:** Built-in tools to calculate parameters for various flow scenarios.
*   **Exercises Sheets:** Step-by-step worked examples to practice problem-solving.
*   **Case Studies:** Real-world engineering scenarios applied to theory.
*   **Data Visualization:** Interactive charts to explore how parameters affect heat transfer.

## 🛠 Tech Stack

**Frontend**
*   **React:** UI Library
*   **TypeScript:** Static typing for better code quality
*   **Vite:** Build tool and development server
*   **React Router:** Client-side routing
*   **CSS Modules:** Scoped styling for components

**Backend**
*   **API:** RESTful service with Swagger/OpenAPI documentation
*   **Framework:** ASP.NET Core (C#)

**DevOps**
*   **Docker & Docker Compose:** Containerization for easy deployment

## 🐳 Run with Docker

You can spin up the full stack (Frontend + API) with a single command.

```bash
docker compose up -d --build
```

Once the containers are running, access the services here:

Frontend: http://localhost:5173

API (Swagger): http://localhost:8080/swagger

## 🔮 Roadmap & Future Improvements

I am currently working on expanding the platform. Future updates will include:

 - Additional Modes: Modules for Conduction and Radiation heat transfer.

 - User Accounts: Authentication to save progress and "My Notebook" data.

 - Complex Solvers: Heat Exchanger (NTU-method) calculators.

 - UI Polish: Dark mode support and mobile responsiveness improvements.

 - Testing: comprehensive unit testing for calculation engines.

## 🤝 Contributing

Contributions are welcome! 

If you have suggestions for new engineering modules or UI improvements:

- Fork the repository.

- Create a new Feature Branch (git checkout -b feature/AmazingFeature).

- Commit your changes (git commit -m 'Add some AmazingFeature').

- Push to the branch (git push origin feature/AmazingFeature).

- Open a Pull Request.

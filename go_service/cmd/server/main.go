package main

import (
	"log"
	"net/http"
	"os"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"heatsphere/go_service/internal/handler"
	"heatsphere/go_service/internal/service"
)

func main() {
	fluidSvc := service.NewFluidInterpolationService()

	r := chi.NewRouter()
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

	r.Post("/api/heat-exchangers/shell-tube/rate", handler.RateShellAndTube)
	r.Post("/api/external-flow/cylinder/calculate", handler.CalculateCylinderFlow(fluidSvc))

	port := os.Getenv("PORT")
	if port == "" {
		port = "8000"
	}

	log.Printf("HeatSphere Math Service listening on :%s", port)
	if err := http.ListenAndServe(":"+port, r); err != nil {
		log.Fatal(err)
	}
}

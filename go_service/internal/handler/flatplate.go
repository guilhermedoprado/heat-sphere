package handler

import (
	"encoding/json"
	"net/http"

	"heatsphere/go_service/internal/domain"
	"heatsphere/go_service/internal/model"
	"heatsphere/go_service/internal/service"
)

// CalculateFlatPlate handles POST /api/external-flow/flat-plate/calculate
func CalculateFlatPlate(fluidSvc *service.FluidInterpolationService) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		var req model.CalculateFlatPlateRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			writeError(w, http.StatusBadRequest, "Invalid JSON: "+err.Error())
			return
		}

		cs := domain.NewFlatPlateCaseStudy(
			req.Name,
			req.Length,
			req.Velocity,
			req.FluidTemperature,
			req.SurfaceTemperature,
		)

		props, err := fluidSvc.GetPropertiesForTemperature(service.AirFluidID, cs.FilmTemperature)
		if err != nil {
			writeError(w, http.StatusBadRequest, err.Error())
			return
		}

		if err := cs.Calculate(props); err != nil {
			writeError(w, http.StatusBadRequest, err.Error())
			return
		}

		resp := model.CalculateFlatPlateResponse{
			ID:                      cs.ID,
			Name:                    cs.Name,
			Length:                  cs.Length,
			Velocity:                cs.Velocity,
			FluidTemperature:       cs.FluidTemperature,
			SurfaceTemperature:     cs.SurfaceTemperature,
			FilmTemperature:        cs.FilmTemperature,
			KinematicViscosity:     cs.KinematicViscosity,
			Prandtl:                cs.Prandtl,
			ThermalConductivity:    cs.ThermalConductivity,
			Reynolds:               cs.Reynolds,
			NusseltLocal:           cs.NusseltLocal,
			NusseltAvg:             cs.NusseltAvg,
			HeatTransferCoefficient: cs.HeatTransferCoefficient,
			HeatFlux:               cs.HeatFlux,
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(resp)
	}
}

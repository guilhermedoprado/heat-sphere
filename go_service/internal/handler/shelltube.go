package handler

import (
	"encoding/json"
	"net/http"

	"heatsphere/go_service/internal/domain"
	"heatsphere/go_service/internal/model"
)

// RateShellAndTube handles POST /api/heat-exchangers/shell-tube/rate
func RateShellAndTube(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req model.RateShellAndTubeInput
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "Invalid JSON: "+err.Error())
		return
	}

	result, err := domain.ShellAndTubeExecute(req.ThInC, req.ThOutC, req.TcInC, req.TcOutC)
	if err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(result)
}

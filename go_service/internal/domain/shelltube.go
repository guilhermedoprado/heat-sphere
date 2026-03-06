package domain

import (
	"fmt"
	"math"

	"heatsphere/go_service/internal/model"
)

// ShellAndTubeExecute computes LMTD and F correction for shell-and-tube heat exchangers.
func ShellAndTubeExecute(thInC, thOutC, tcInC, tcOutC float64) (*model.RateShellAndTubeOutput, error) {
	dt1 := thInC - tcOutC
	dt2 := thOutC - tcInC

	if dt1 <= 0 || dt2 <= 0 {
		return nil, fmt.Errorf("invalid terminal temperatures (ΔT must be > 0)")
	}

	var lmtd float64
	if math.Abs(dt1-dt2) < 1e-9 {
		lmtd = dt1
	} else {
		ratio := dt1 / dt2
		if ratio <= 0 {
			return nil, fmt.Errorf("invalid ΔT ratio for LMTD (must be > 0)")
		}
		lmtd = (dt1 - dt2) / math.Log(ratio)
	}

	denomP := thInC - tcInC
	denomR := tcOutC - tcInC

	if math.Abs(denomP) < 1e-9 || math.Abs(denomR) < 1e-9 {
		return nil, fmt.Errorf("invalid temperatures for P/R calculation (division by zero)")
	}

	p := (tcOutC - tcInC) / denomP
	r := (thInC - thOutC) / denomR

	if math.Abs(r-1.0) < 1e-6 {
		return nil, fmt.Errorf("invalid region for F correction (R ≈ 1)")
	}
	if math.Abs(1.0-p) < 1e-6 {
		return nil, fmt.Errorf("invalid region for F correction (P ≈ 1)")
	}

	s := math.Sqrt(r*r+1) / (r - 1)
	w := (1 - p*r) / (1 - p)

	if w <= 0 {
		return nil, fmt.Errorf("invalid region for F correction (W must be > 0)")
	}

	numArg := 1 + w - s + s*w
	denArg := 1 + w + s - s*w

	if numArg <= 0 || denArg <= 0 {
		return nil, fmt.Errorf("invalid region for F correction (log argument <= 0)")
	}

	f := (s * math.Log(w)) / math.Log(numArg/denArg)

	if math.IsNaN(f) || math.IsInf(f, 0) {
		return nil, fmt.Errorf("invalid region for F correction (NaN/Infinity)")
	}

	lmtdCorr := f * lmtd

	return &model.RateShellAndTubeOutput{
		Dt1:      dt1,
		Dt2:      dt2,
		Lmtd:     lmtd,
		P:        p,
		R:        r,
		F:        f,
		LmtdCorr: lmtdCorr,
	}, nil
}

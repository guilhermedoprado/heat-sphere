package model

// RateShellAndTubeInput request for LMTD + F correction calculation.
type RateShellAndTubeInput struct {
	ThInC  float64 `json:"th_in_c"`
	ThOutC float64 `json:"th_out_c"`
	TcInC  float64 `json:"tc_in_c"`
	TcOutC float64 `json:"tc_out_c"`
}

// RateShellAndTubeOutput response with LMTD and F correction.
type RateShellAndTubeOutput struct {
	Dt1      float64 `json:"dt1"`
	Dt2      float64 `json:"dt2"`
	Lmtd     float64 `json:"lmtd"`
	P        float64 `json:"p"`
	R        float64 `json:"r"`
	F        float64 `json:"f"`
	LmtdCorr float64 `json:"lmtd_corr"`
}

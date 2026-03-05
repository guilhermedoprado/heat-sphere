import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


# --- Shell and Tube ---
def test_shell_tube_valid():
    response = client.post("/api/heat-exchangers/shell-tube/rate", json={
        "th_in_c": 100.0, "th_out_c": 60.0,
        "tc_in_c": 20.0,  "tc_out_c": 50.0
    })
    assert response.status_code == 200
    data = response.json()
    assert "lmtd" in data
    assert "lmtd_corr" in data
    assert data["lmtd"] > 0

def test_shell_tube_invalid_temperatures():
    # dt1 ou dt2 <= 0 deve retornar 400
    response = client.post("/api/heat-exchangers/shell-tube/rate", json={
        "th_in_c": 20.0, "th_out_c": 60.0,
        "tc_in_c": 50.0,  "tc_out_c": 100.0
    })
    assert response.status_code == 400


# --- Cylinder External Flow ---
def test_cylinder_flow_valid():
    response = client.post("/api/external-flow/cylinder/calculate", json={
        "name": "Test Case",
        "diameter": 0.05,
        "velocity": 5.0,
        "fluid_temperature": 300.0,   # Kelvin
        "surface_temperature": 400.0  # Kelvin
    })
    assert response.status_code == 200
    data = response.json()
    assert data["reynolds"] > 0
    assert data["nusselt"] > 0
    assert data["heat_transfer_coefficient"] > 0

def test_cylinder_flow_out_of_range_temperature():
    # Temperatura abaixo de 100K deve retornar 400
    response = client.post("/api/external-flow/cylinder/calculate", json={
        "name": "Out of range",
        "diameter": 0.05,
        "velocity": 5.0,
        "fluid_temperature": 50.0,   # abaixo do range (100K mínimo)
        "surface_temperature": 80.0
    })
    assert response.status_code == 400

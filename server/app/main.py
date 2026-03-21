import os
from pathlib import Path
from typing import List, Tuple

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.models import AnalysisRequest, AnalysisResponse, BuildingInfo, CoordinateInput, FinancialMetrics, SustainabilityMetrics
from app.services.finance import annual_savings_try, roi_years
from app.services.geometry import polygon_area_m2
from app.services.overpass import fetch_nearest_building_polygon
from app.services.pvgis import fetch_irradiation_kwh_m2
from app.services.solar import annual_energy_kwh, co2_saving_kg, prevented_vehicle_km, tree_equivalent

app = FastAPI(title="SolarFootprint API", version="0.1.0")

_cors_raw = os.getenv("CORS_ALLOW_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000")
_cors_origins = [o.strip() for o in _cors_raw.split(",") if o.strip()]
_cors_allow_all = os.getenv("CORS_ALLOW_ALL", "").strip().lower() in ("1", "true", "yes")
if _cors_allow_all:
    _cors_origins = ["*"]
_cors_credentials = False if _cors_origins == ["*"] else True

app.add_middleware(
    CORSMiddleware,
    allow_origins=_cors_origins,
    allow_credentials=_cors_credentials,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}


@app.post("/analyze", response_model=AnalysisResponse)
def analyze(payload: AnalysisRequest) -> AnalysisResponse:
    clicked_lat = payload.clicked_point.lat
    clicked_lon = payload.clicked_point.lon

    coords: List[Tuple[float, float]] = []
    building_info = BuildingInfo(source="overpass", found=False, message="")

    try:
        coords = fetch_nearest_building_polygon(clicked_lat, clicked_lon, radius_m=10)
    except Exception:
        coords = []

    if coords:
        building_info = BuildingInfo(source="overpass", found=True, message="Nearest building snapped.")
    elif payload.polygon:
        coords = [(p.lat, p.lon) for p in payload.polygon]
        building_info = BuildingInfo(source="manual", found=False, message="Manual polygon used.")
    else:
        raise HTTPException(status_code=404, detail="Bina bulunamadi, lutfen alani manuel cizin")

    area_m2 = polygon_area_m2(coords)
    irradiation = fetch_irradiation_kwh_m2(coords)
    energy_kwh = annual_energy_kwh(area_m2=area_m2, irradiation_kwh_m2=irradiation)

    co2_kg = co2_saving_kg(energy_kwh)
    trees = tree_equivalent(co2_kg)
    vehicle_km = prevented_vehicle_km(co2_kg)

    annual_savings = annual_savings_try(
        annual_energy_kwh=energy_kwh,
        unit_price_try=payload.electricity_unit_price_try,
    )
    roi = roi_years(payload.investment_cost_try, annual_savings)

    return AnalysisResponse(
        area_m2=round(area_m2, 2),
        annual_energy_kwh=round(energy_kwh, 2),
        irradiation_kwh_m2=round(irradiation, 2),
        selected_polygon=[CoordinateInput(lat=coord[0], lon=coord[1]) for coord in coords],
        sustainability=SustainabilityMetrics(
            co2_kg_per_year=round(co2_kg, 2),
            tree_equivalent=round(trees, 2),
            prevented_vehicle_km=round(vehicle_km, 2),
        ),
        financial=FinancialMetrics(
            annual_savings_try=round(annual_savings, 2),
            investment_cost_try=payload.investment_cost_try,
            roi_years=round(roi, 2),
        ),
        building=building_info,
    )


def _mount_frontend_static() -> None:
    """Üretimde Next export çıktısını (out/) kökten sunar; API yolları önceliklidir."""
    static_root = os.getenv("STATIC_ROOT", "").strip()
    if not static_root:
        return
    path = Path(static_root)
    if not path.is_dir():
        return
    app.mount("/", StaticFiles(directory=str(path), html=True), name="spa")


_mount_frontend_static()

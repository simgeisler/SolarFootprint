from typing import List, Tuple

import requests


PVGIS_URL = "https://re.jrc.ec.europa.eu/api/v5_2/PVcalc"


def fetch_irradiation_kwh_m2(coords_lat_lon: List[Tuple[float, float]]) -> float:
    if not coords_lat_lon:
        return 1700.0

    lat = sum(c[0] for c in coords_lat_lon) / len(coords_lat_lon)
    lon = sum(c[1] for c in coords_lat_lon) / len(coords_lat_lon)

    params = {
        "lat": lat,
        "lon": lon,
        "peakpower": 1,
        "loss": 15,
        "angle": 35,
        "aspect": 0,
        "outputformat": "json",
    }

    response = requests.get(PVGIS_URL, params=params, timeout=20)
    response.raise_for_status()
    payload = response.json()

    outputs = payload.get("outputs", {})
    totals = outputs.get("totals", {})
    fixed = totals.get("fixed", {})
    e_year = fixed.get("E_y")
    if not e_year:
        return 1700.0

    return float(e_year)

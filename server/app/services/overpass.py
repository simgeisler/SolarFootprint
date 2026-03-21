from typing import Dict, List, Tuple

import requests


OVERPASS_URL = "https://overpass-api.de/api/interpreter"


def _overpass_query(lat: float, lon: float, radius_m: int = 10) -> str:
    return f"""
    [out:json];
    (
      way["building"](around:{radius_m},{lat},{lon});
      relation["building"](around:{radius_m},{lat},{lon});
    );
    out geom;
    """


def fetch_nearest_building_polygon(lat: float, lon: float, radius_m: int = 10) -> List[Tuple[float, float]]:
    def extract_coords(element: Dict) -> List[Tuple[float, float]]:
        geometry = element.get("geometry", [])
        if not geometry:
            return []
        return [(point["lat"], point["lon"]) for point in geometry]

    def center_distance_sq(coords: List[Tuple[float, float]]) -> float:
        if not coords:
            return float("inf")
        avg_lat = sum(c[0] for c in coords) / len(coords)
        avg_lon = sum(c[1] for c in coords) / len(coords)
        return (avg_lat - lat) ** 2 + (avg_lon - lon) ** 2

    for search_radius in (radius_m, 20):
        query = _overpass_query(lat=lat, lon=lon, radius_m=search_radius)
        response = requests.post(OVERPASS_URL, data={"data": query}, timeout=20)
        response.raise_for_status()
        payload = response.json()

        elements = payload.get("elements", [])
        if not elements:
            continue

        candidate_polygons = [extract_coords(element) for element in elements]
        candidate_polygons = [coords for coords in candidate_polygons if len(coords) >= 3]
        if not candidate_polygons:
            continue

        nearest = min(candidate_polygons, key=center_distance_sq)
        return nearest

    return []

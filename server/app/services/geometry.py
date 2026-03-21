from typing import List, Tuple

from pyproj import Transformer
from shapely.geometry import Polygon

from app.constants import TURKEY_METRIC_EPSG, WGS84_EPSG


def polygon_area_m2(coords_lat_lon: List[Tuple[float, float]]) -> float:
    """Convert WGS84 polygon to EPSG:5637 and return metric area."""
    if len(coords_lat_lon) < 3:
        raise ValueError("Polygon must contain at least 3 points.")

    transformer = Transformer.from_crs(
        f"EPSG:{WGS84_EPSG}",
        f"EPSG:{TURKEY_METRIC_EPSG}",
        always_xy=True,
    )

    projected = []
    for lat, lon in coords_lat_lon:
        x, y = transformer.transform(lon, lat)
        projected.append((x, y))

    polygon = Polygon(projected)
    if not polygon.is_valid:
        polygon = polygon.buffer(0)

    return abs(float(polygon.area))

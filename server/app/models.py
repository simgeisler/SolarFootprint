from typing import List, Optional

from pydantic import BaseModel, Field


class PointInput(BaseModel):
    lat: float
    lon: float


class CoordinateInput(BaseModel):
    lat: float
    lon: float


class AnalysisRequest(BaseModel):
    clicked_point: PointInput
    polygon: Optional[List[CoordinateInput]] = Field(
        default=None,
        description="Optional manual polygon when building not found.",
    )
    electricity_unit_price_try: float = Field(default=2.5, gt=0)
    investment_cost_try: float = Field(default=50000.0, gt=0)


class SustainabilityMetrics(BaseModel):
    co2_kg_per_year: float
    tree_equivalent: float
    prevented_vehicle_km: float


class FinancialMetrics(BaseModel):
    annual_savings_try: float
    investment_cost_try: float
    roi_years: float


class BuildingInfo(BaseModel):
    source: str
    found: bool
    message: str


class AnalysisResponse(BaseModel):
    area_m2: float
    annual_energy_kwh: float
    irradiation_kwh_m2: float
    selected_polygon: List[CoordinateInput]
    sustainability: SustainabilityMetrics
    financial: FinancialMetrics
    building: BuildingInfo

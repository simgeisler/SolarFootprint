from app.constants import CO2_KG_PER_KWH, PANEL_EFFICIENCY, SYSTEM_LOSS_FACTOR, TREE_KG_PER_YEAR


def annual_energy_kwh(area_m2: float, irradiation_kwh_m2: float) -> float:
    return area_m2 * PANEL_EFFICIENCY * irradiation_kwh_m2 * SYSTEM_LOSS_FACTOR


def co2_saving_kg(annual_kwh: float) -> float:
    return annual_kwh * CO2_KG_PER_KWH


def tree_equivalent(co2_kg: float) -> float:
    return co2_kg / TREE_KG_PER_YEAR


def prevented_vehicle_km(co2_kg: float) -> float:
    # Simple equivalence: average car emits ~0.192 kg CO2/km.
    return co2_kg / 0.192

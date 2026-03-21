def annual_savings_try(annual_energy_kwh: float, unit_price_try: float) -> float:
    return annual_energy_kwh * unit_price_try


def roi_years(investment_cost_try: float, annual_savings: float) -> float:
    if annual_savings <= 0:
        return 0.0
    return investment_cost_try / annual_savings

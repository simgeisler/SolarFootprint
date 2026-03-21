import axios from "axios";

export type Coord = { lat: number; lon: number };

export type AnalysisRequest = {
  clicked_point: Coord;
  polygon?: Coord[];
  electricity_unit_price_try?: number;
  investment_cost_try?: number;
};

export type AnalysisResponse = {
  area_m2: number;
  annual_energy_kwh: number;
  irradiation_kwh_m2: number;
  selected_polygon: Coord[];
  sustainability: {
    co2_kg_per_year: number;
    tree_equivalent: number;
    prevented_vehicle_km: number;
  };
  financial: {
    annual_savings_try: number;
    investment_cost_try: number;
    roi_years: number;
  };
  building: {
    source: string;
    found: boolean;
    message: string;
  };
};

const apiBase =
  typeof process.env.NEXT_PUBLIC_API_BASE_URL === "string"
    ? process.env.NEXT_PUBLIC_API_BASE_URL
    : "http://localhost:8000";

const client = axios.create({
  baseURL: apiBase,
  timeout: 20000,
});

export async function runAnalysis(payload: AnalysisRequest): Promise<AnalysisResponse> {
  const { data } = await client.post<AnalysisResponse>("/analyze", payload);
  return data;
}

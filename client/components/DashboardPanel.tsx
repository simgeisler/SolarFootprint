"use client";

import type { AnalysisResponse } from "@/lib/api";

type Props = {
  result: AnalysisResponse | null;
  loading: boolean;
  error: string | null;
};

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="card p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-forest">{value}</p>
    </div>
  );
}

export default function DashboardPanel({ result, loading, error }: Props) {
  if (loading) {
    return <div className="card p-6 text-forest">Hesaplaniyor...</div>;
  }

  if (error) {
    return <div className="card p-6 text-red-600">{error}</div>;
  }

  if (!result) {
    return <div className="card p-6 text-gray-600">Haritadan bir nokta secerek analizi baslatin.</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      <StatCard label="Alan (m2)" value={result.area_m2.toLocaleString("tr-TR")} />
      <StatCard label="Yillik Enerji (kWh)" value={result.annual_energy_kwh.toLocaleString("tr-TR")} />
      <StatCard label="CO2 Tasarrufu (kg/yil)" value={result.sustainability.co2_kg_per_year.toLocaleString("tr-TR")} />
      <StatCard label="Agac Esdegeri" value={result.sustainability.tree_equivalent.toLocaleString("tr-TR")} />
      <StatCard
        label="Engellenen Arac Mesafesi (km)"
        value={result.sustainability.prevented_vehicle_km.toLocaleString("tr-TR")}
      />
      <StatCard label="Yillik Tasarruf (TRY)" value={result.financial.annual_savings_try.toLocaleString("tr-TR")} />
      <StatCard label="ROI (yil)" value={result.financial.roi_years.toLocaleString("tr-TR")} />
    </div>
  );
}

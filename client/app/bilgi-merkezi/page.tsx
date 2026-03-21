import Link from "next/link";

export default function BilgiMerkeziPage() {
  return (
    <main className="min-h-screen bg-[#eef4ef]">
      <section className="mx-auto max-w-5xl px-6 py-10">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-bold text-[#1b3f2b]">Sürdürülebilirlik Bilgi Merkezi</h1>
          <p className="mt-3 text-gray-700">
            Bu merkez, SolarFootprint analizlerinde kullanılan bilimsel sabitleri, hesaplama yöntemlerini ve veri
            kaynaklarını sade bir dille açıklar.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <article className="rounded-xl border border-[#dbe5df] p-4">
              <h2 className="font-semibold text-[#2F5338]">Karbon Katsayısı</h2>
              <p className="mt-2 text-sm text-gray-700">
                Türkiye ortalaması olarak 0.50 kg CO2/kWh kullanılır. Üretilen enerji arttıkça engellenen karbon salımı
                da doğrusal olarak artar.
              </p>
            </article>
            <article className="rounded-xl border border-[#dbe5df] p-4">
              <h2 className="font-semibold text-[#2F5338]">Ağaç Eşdeğeri</h2>
              <p className="mt-2 text-sm text-gray-700">
                Bir yetişkin ağacın yıllık ortalama 20 kg karbon emdiği kabul edilerek çevresel etki anlaşılır bir
                eşdeğere dönüştürülür.
              </p>
            </article>
            <article className="rounded-xl border border-[#dbe5df] p-4">
              <h2 className="font-semibold text-[#2F5338]">Enerji Modeli</h2>
              <p className="mt-2 text-sm text-gray-700">
                Yıllık enerji hesabı: Alan x Panel Verimliliği (0.20) x Radyasyon x Sistem Kaybı (0.85).
              </p>
            </article>
            <article className="rounded-xl border border-[#dbe5df] p-4">
              <h2 className="font-semibold text-[#2F5338]">Veri Kaynakları</h2>
              <p className="mt-2 text-sm text-gray-700">
                Bina geometrisi için Overpass API, güneş verisi için PVGIS API kullanılır. Harita katmanı OpenStreetMap
                tabanlıdır.
              </p>
            </article>
          </div>

          <Link
            href="/"
            className="mt-6 inline-block rounded-full bg-[#F4D03F] px-5 py-2 text-sm font-semibold text-[#1f3f2a]"
          >
            Ana Sayfaya Dön
          </Link>
        </div>
      </section>
    </main>
  );
}

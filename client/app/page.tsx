"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Leaf } from "lucide-react";

import { runAnalysis, type AnalysisResponse, type Coord } from "@/lib/api";

const MapPanel = dynamic(() => import("@/components/MapPanel"), {
  ssr: false,
});

export default function HomePage() {
  const [clickedPoint, setClickedPoint] = useState<Coord | null>(null);
  const [polygon, setPolygon] = useState<Coord[]>([]);
  const [drawingMode, setDrawingMode] = useState<boolean>(false);
  const [drawingPoints, setDrawingPoints] = useState<Coord[]>([]);
  const [hoverPoint, setHoverPoint] = useState<Coord | null>(null);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [shakeDrawButton, setShakeDrawButton] = useState<boolean>(false);
  const closingInProgressRef = useRef<boolean>(false);

  const ensureClosedPolygon = (points: Coord[]): Coord[] => {
    if (points.length < 3) {
      return points;
    }
    const first = points[0];
    const last = points[points.length - 1];
    const alreadyClosed = first.lat === last.lat && first.lon === last.lon;
    return alreadyClosed ? points : [...points, first];
  };

  const handleAnalyze = async (point: Coord, manualPolygon?: Coord[]) => {
    setLoading(true);
    setError(null);
    try {
      const response = await runAnalysis({
        clicked_point: point,
        polygon: manualPolygon,
      });
      setResult(response);
      setPolygon(response.selected_polygon);
    } catch (err: unknown) {
      const message =
        typeof err === "object" && err && "response" in err
          ? "Bu konumda kayıtlı bir bina bulunamadı. Lütfen sınırları noktalar ekleyerek serbest çizim modu ile oluşturun."
          : "Analiz sırasında beklenmeyen bir hata oluştu.";
      setError(message);
      setShakeDrawButton(true);
      setTimeout(() => setShakeDrawButton(false), 1000);
      setResult(null);
      setPolygon([]);
    } finally {
      setLoading(false);
    }
  };

  const completeDrawingAndAnalyze = async () => {
    if (closingInProgressRef.current || loading) {
      return;
    }
    if (drawingPoints.length < 3) {
      setError("Manuel çizim için en az 3 nokta seçmelisiniz.");
      return;
    }
    closingInProgressRef.current = true;
    const closedPoints = ensureClosedPolygon(drawingPoints);
    setDrawingPoints(closedPoints);
    const anchorPoint = closedPoints[0];
    setClickedPoint(anchorPoint);
    await handleAnalyze(anchorPoint, closedPoints);
    setDrawingMode(false);
    setDrawingPoints([]);
    setHoverPoint(null);
    closingInProgressRef.current = false;
  };

  const onMapClick = (point: Coord, snappedToStart?: boolean) => {
    if (drawingMode) {
      if (drawingPoints.length === 0) {
        setPolygon([]);
        setResult(null);
      }
      if (snappedToStart && drawingPoints.length >= 3) {
        void completeDrawingAndAnalyze();
        return;
      }
      setDrawingPoints((prev) => [...prev, point]);
      return;
    }
    setClickedPoint(point);
    void handleAnalyze(point);
  };

  const onMapMouseMove = (point: Coord) => {
    setHoverPoint(point);
  };

  return (
    <main className="min-h-screen bg-[#e8efeb]">
      <section className="mx-auto max-w-[1280px] px-6 pt-6">
        <header className="mb-6 flex flex-wrap items-center justify-between rounded-2xl bg-white px-6 py-4 shadow-sm">
          <div className="flex items-center gap-3 text-2xl font-extrabold text-forest">
            <Leaf className="h-7 w-7 text-leaf" />
            <span>SolarFootprint</span>
          </div>
          <div className="ml-auto flex items-center gap-6">
            <nav className="hidden items-center gap-7 text-[15px] font-medium text-gray-700 md:flex">
              <a href="#hero" className="transition hover:text-forest">
                Ana Sayfa
              </a>
              <a href="#nasil-calisir" className="transition hover:text-forest">
                Nasıl Çalışır?
              </a>
              <a href="#bilgi-merkezi" className="transition hover:text-forest">
                Sürdürülebilirlik Bilgi Merkezi
              </a>
            </nav>
            <a
              href="#analiz"
              className="rounded-full bg-[#F4D03F] px-6 py-3 text-sm font-bold text-[#1f3f2a] shadow-md transition hover:brightness-95"
            >
              Analize Başla
            </a>
          </div>
        </header>

        <div id="hero" className="grid gap-5 rounded-2xl bg-[#f4f7f4] p-6 md:grid-cols-2">
          <div className="pt-6 md:pt-10">
            <h1 className="max-w-xl text-5xl font-black leading-tight text-[#0f2e1f]">Şehrini Yeşil Enerjiyle Dönüştür.</h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-gray-700">
              SolarFootprint; atıl durumdaki çatı ve arazilerin güneş enerjisi potansiyelini analiz ederek,
              karbon ayak izi değişimini bilimsel verilerle hesaplayan bir Karar Destek Sistemi&apos;dir.
              Hem çevresel hem de finansal bir yol haritası sunarak sürdürülebilir enerji dönüşümünüzü
              yönetmenizi sağlar.
            </p>
          </div>
          <div className="relative h-[320px] overflow-hidden rounded-2xl border border-[#dbe5df] bg-white">
            <Image src="/hero-solar-ai.png" alt="Solar sustainability visual" fill className="object-cover" priority />
          </div>
        </div>
      </section>

      <section id="nasil-calisir" className="mx-auto mt-6 max-w-[1280px] px-6">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-[#133825]">Nasıl Çalışır?</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-[#dbe5df] p-4">
              <p className="text-sm font-semibold text-[#2F5338]">📍 Adım 1: Konum Belirleme</p>
              <p className="mt-2 text-sm text-gray-700">
                Güneş enerjisi potansiyelini görmek istediğiniz binanın üzerine haritada tıklayın veya analiz etmek
                istediğiniz araziyi serbest çizim aracıyla oluşturun.
              </p>
              <p className="mt-2 text-xs text-gray-600">
                <span className="font-semibold">Teknik Not:</span> Sistem, Overpass API kullanarak tıkladığınız
                noktadaki bina poligonunu otomatik olarak tespit eder ve sınırlarını netleştirir.
              </p>
            </div>
            <div className="rounded-xl border border-[#dbe5df] p-4">
              <p className="text-sm font-semibold text-[#2F5338]">☀️ Adım 2: PVGIS Tabanlı Güneş Enerjisi Analizi</p>
              <p className="mt-2 text-sm text-gray-700">
                Seçtiğiniz alanın coğrafi koordinatları üzerinden PVGIS (Photovoltaic Geography Information System)
                verileri çekilir.
              </p>
              <p className="mt-2 text-xs text-gray-600">
                <span className="font-semibold">Teknik Not:</span> Konumun son 10 yıllık güneşlenme süresi, radyasyon
                şiddeti ve panel eğim verimliliği hesaplanarak yıllık toplam enerji üretim kapasitesi simüle edilir.
              </p>
            </div>
            <div className="rounded-xl border border-[#dbe5df] p-4">
              <p className="text-sm font-semibold text-[#2F5338]">🌿 Adım 3: Çevresel Etki ve Karbon Ayak İzi</p>
              <p className="mt-2 text-sm text-gray-700">
                Üretilecek temiz enerji, Türkiye’nin enerji karma katsayıları baz alınarak doğaya olan katkısına
                dönüştürülür.
              </p>
              <p className="mt-2 text-xs text-gray-600">
                <span className="font-semibold">Teknik Not:</span> Engellenen yıllık CO2 salımı hesaplanır ve bu değer,
                yetişkin bir ağacın karbon emilim kapasitesiyle kıyaslanarak "Ağaç Eşdeğeri" olarak sunulur.
              </p>
            </div>
            <div className="rounded-xl border border-[#dbe5df] p-4">
              <p className="text-sm font-semibold text-[#2F5338]">💰 Adım 4: Finansal Fizibilite ve ROI Hesabı</p>
              <p className="mt-2 text-sm text-gray-700">
                Sistemin kurulum maliyeti ile güncel elektrik birim fiyatları üzerinden sağladığı tasarruf
                karşılaştırılır.
              </p>
              <p className="mt-2 text-xs text-gray-600">
                <span className="font-semibold">Teknik Not:</span> Kurulumun kendini kaç yılda amorti edeceği (ROI) ve
                yıllık finansal kazancınız, bir Karar Destek Raporu formatında yansıtılır.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="bilgi-merkezi" className="mx-auto mt-6 max-w-[1280px] px-6">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-[#133825]">Sürdürülebilirlik Bilgi Merkezi</h2>
          <p className="mt-3 text-gray-700">
            Bu merkez; SolarFootprint analizlerinde kullanılan bilimsel temelleri, güneş enerjisinin işleyiş
            prensiplerini ve temiz bir gelecek inşa etmedeki kritik önemini sade bir dille açıklar.
          </p>

          <div className="mt-6 space-y-4">
            <article className="rounded-xl border border-[#dbe5df] p-4">
              <h3 className="text-lg font-semibold text-[#2F5338]">1. Güneş Enerjisinin İşleyişi (Fotovoltaik Sistemler)</h3>
              <p className="mt-2 text-sm text-gray-700">
                Güneş panelleri, gezegenimizin en bol kaynağı olan ışığı doğrudan elektriğe dönüştüren sessiz ve temiz
                teknoloji harikalarıdır.
              </p>
              <p className="mt-2 text-sm text-gray-700">
                <span className="font-semibold">Fotovoltaik (PV) Etki:</span> Panellerin içindeki silikon hücreler,
                güneş ışığındaki fotonları yakalayarak elektronları harekete geçirir. Bu hareket, evlerimizde
                kullandığımız elektriğin temeli olan akımı oluşturur.
              </p>
              <p className="mt-2 text-sm text-gray-700">
                <span className="font-semibold">Sistem Bileşenleri:</span> Paneller Doğru Akım (DC) üretir.
                Evinizdeki cihazların çalışabilmesi için bu enerji, bir İnvertör (Evirici) aracılığıyla Alternatif
                Akıma (AC) dönüştürülür.
              </p>
              <p className="mt-2 text-sm text-gray-700">
                <span className="font-semibold">Dayanıklılık ve Verimlilik:</span> Modern paneller yaklaşık 25-30 yıl
                ömre sahiptir ve sadece doğrudan güneş ışığında değil, bulutlu havalarda da enerji üretmeye devam eder.
              </p>
            </article>

            <article className="rounded-xl border border-[#dbe5df] p-4">
              <h3 className="text-lg font-semibold text-[#2F5338]">2. Sürdürülebilirlik ve Temiz Bir Gelecek</h3>
              <p className="mt-2 text-sm text-gray-700">
                Sürdürülebilirlik, bugünün enerji ihtiyacını karşılarken gelecek nesillerin kaynaklarını
                tüketmemektir.
              </p>
              <p className="mt-2 text-sm text-gray-700">
                <span className="font-semibold">Karbon Ayak İzi:</span> Elektrik şebekesinden çekilen her birim enerji,
                fosil yakıt kullanımı nedeniyle doğaya CO2 salar. Kendi enerjinizi üretmek, kişisel karbon ayak izinizi
                doğrudan küçültmek demektir.
              </p>
              <p className="mt-2 text-sm text-gray-700">
                <span className="font-semibold">Net Sıfır (Net Zero) Hedefi:</span> Çatılarımızdaki atıl alanları enerji
                tarlalarına dönüştürmek, küresel ısınmayı sınırlandırmak için kritik olan "Net Sıfır Emisyon" hedefine
                giden en etik ve verimli yoldur.
              </p>
              <p className="mt-2 text-sm text-gray-700">
                <span className="font-semibold">Enerji Bağımsızlığı:</span> Güneş enerjisi, yerel ve sonsuz bir
                kaynaktır. Bu sistemler, binaların enerji bağımsızlığını artırarak toplumsal dayanıklılığa katkı
                sağlar.
              </p>
            </article>

            <article className="rounded-xl border border-[#dbe5df] p-4">
              <h3 className="text-lg font-semibold text-[#2F5338]">3. Analiz Metodolojimiz ve Bilimsel Temeller</h3>
              <p className="mt-2 text-sm text-gray-700">
                SolarFootprint, hayali rakamlar yerine doğrulanmış mühendislik verileriyle çalışır.
              </p>
              <p className="mt-2 text-sm text-gray-700">
                <span className="font-semibold">Enerji Modelleme:</span> Yıllık üretim simülasyonumuz; seçtiğiniz
                alanın gerçek izdüşümü (m2), panel verimliliği (%20), konumun son 10 yıllık uydu tabanlı güneşlenme
                verisi ve sistem kayıpları (0.85 katsayısı) baz alınarak yapılır.
              </p>
              <p className="mt-2 text-sm text-gray-700">
                <span className="font-semibold">Veri Kaynakları:</span> Bina geometrisi için Overpass API, ışınım
                verileri için Avrupa Komisyonu destekli PVGIS API verileri gerçek zamanlı işlenir.
              </p>
              <p className="mt-2 text-sm text-gray-700">
                <span className="font-semibold">Ağaç Eşdeğeri:</span> Engellenen karbon miktarını daha iyi anlamanız
                için, yetişkin bir ağacın yıllık ortalama 20 kg CO2 emme kapasitesiyle kıyaslayarak somutlaştırırız.
              </p>
            </article>

            <article className="rounded-xl border border-[#dbe5df] p-4">
              <h3 className="text-lg font-semibold text-[#2F5338]">4. Sıkça Sorulan Sorular (Kısa Notlar)</h3>
              <p className="mt-2 text-sm text-gray-700">
                <span className="font-semibold">Geceleri üretim olur mu?</span> Hayır, ancak gündüz üretilen fazla
                enerji akülerde depolanabilir veya şebekeye geri satılabilir.
              </p>
              <p className="mt-2 text-sm text-gray-700">
                <span className="font-semibold">Bakım maliyeti nedir?</span> Güneş panellerinin hareketli parçası
                olmadığı için bakım maliyetleri çok düşüktür; sadece yılda 1-2 kez temizlenmeleri verimliliği korumak
                için yeterlidir.
              </p>
              <p className="mt-2 text-sm text-gray-700">
                <span className="font-semibold">ROI (Geri Dönüş Süresi) neye göre değişir?</span> Elektrik fiyatları
                arttıkça ve panel maliyetleri düştükçe, yatırımınızın kendini amorti etme süresi kısalır.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section id="analiz" className="mt-6 bg-gradient-to-r from-[#0c3e28] via-[#0d4b31] to-[#1a5a40] pb-6 pt-4">
        <div className="mx-auto max-w-[1280px] px-6">
          <h2 className="mb-3 text-3xl font-semibold text-white">Güneş Enerjisi Potansiyel Analizi</h2>
          <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
            <MapPanel
              clickedPoint={clickedPoint}
              polygon={polygon}
              drawingMode={drawingMode}
              drawingPoints={drawingPoints}
              hoverPoint={hoverPoint}
              shakeDrawButton={shakeDrawButton}
              onMapClick={onMapClick}
              onMouseMove={onMapMouseMove}
              onToggleDrawingMode={() => {
                setDrawingMode((prev) => !prev);
                setDrawingPoints([]);
                setHoverPoint(null);
                setError(null);
              }}
              onCompleteDrawing={() => void completeDrawingAndAnalyze()}
              onClearDrawing={() => {
                setDrawingPoints([]);
                setHoverPoint(null);
                setPolygon([]);
                setResult(null);
                setClickedPoint(null);
                setError(null);
              }}
            />
            <div className="space-y-3">
              <div className="rounded-2xl bg-[#0f3a25] p-4 text-white">
                <p className="mb-3 text-3xl font-bold text-black">Analiz Sonuçları</p>
                {loading ? <p className="rounded-xl bg-white/10 p-3">Hesaplanıyor...</p> : null}
                {error ? <p className="rounded-xl bg-red-500/20 p-3 text-red-100">{error}</p> : null}
                <div className="grid grid-cols-1 gap-3">
                  <div className="rounded-xl bg-[#effaf2] p-3 text-[#123322]">
                    <p className="text-xs">Tahmini Yıllık Enerji Üretimi ⚡</p>
                    <p className="text-2xl font-bold">
                      {result ? `${result.annual_energy_kwh.toLocaleString("tr-TR")} kWh` : "-"}
                    </p>
                  </div>
                  <div className="rounded-xl bg-[#effaf2] p-3 text-[#123322]">
                    <p className="text-xs">Engellenen CO2 Salımı ☁️</p>
                    <p className="text-2xl font-bold">
                      {result ? `${(result.sustainability.co2_kg_per_year / 1000).toLocaleString("tr-TR")} ton` : "-"}
                    </p>
                  </div>
                  <div className="rounded-xl bg-[#effaf2] p-3 text-[#123322]">
                    <p className="text-xs">Geri Dönüş Süresi (ROI) ⏳</p>
                    <p className="text-2xl font-bold">{result ? `${result.financial.roi_years.toLocaleString("tr-TR")} yıl` : "-"}</p>
                  </div>
                  <div className="rounded-xl bg-[#effaf2] p-3 text-[#123322]">
                    <p className="text-xs">Çevresel Etki Eşdeğeri 🌳</p>
                    <p className="text-sm">
                      Bu kurulum yıllık{" "}
                      <span className="font-semibold">
                        {result ? Math.round(result.sustainability.tree_equivalent).toLocaleString("tr-TR") : "-"}
                      </span>{" "}
                      yetişkin ağacın temizlediği havaya eşdeğer katkı sağlar.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}

# SolarFootprint Task Listesi

Bu görevler `prd.md` ve `.cursorrules` gereksinimlerine göre oluşturulmuştur.

## 1) Proje Kurulumu ve Monorepo Yapısı
- [ ] `/client` (Next.js 14+, TypeScript, Tailwind, Lucide) klasörünü oluştur.
- [ ] `/server` (FastAPI, Python 3.10+, Pydantic v2) klasörünü oluştur.
- [ ] Frontend ve backend için temel bağımlılık kurulumlarını tamamla.
- [ ] Geliştirme ortamını sadece `localhost:3000` ve `localhost:8000` odaklı yapılandır.

## 2) Backend (FastAPI) - Analiz Motoru
- [ ] FastAPI uygulaması ve temel router yapısını kur (`/server`).
- [ ] `CORSMiddleware` ekleyip `localhost:3000` erişimine izin ver.
- [ ] Overpass API entegrasyonu ekle: tıklanan noktaya 5m yarıçapta en yakın bina (`way["building"]`) sorgusu yap.
- [ ] Bina bulunamazsa kullanıcıya döndürülecek net hata mesajını standartlaştır: "Bina bulunamadı, lütfen alanı manuel çizin".
- [ ] Geometri dönüşümü ekle: EPSG:4326 -> EPSG:5637 dönüşümü ile alan (m2) hesapla.
- [ ] Enerji hesap modülünü ekle: `Yillik Enerji (kWh) = Alan * 0.20 * Radyasyon * 0.85`.
- [ ] Karbon ve sürdürülebilirlik hesapları ekle:
  - CO2 = `kWh * 0.50`
  - Ağaç eşdeğeri = `CO2 / 20`
- [ ] Finans modülü ekle: yıllık tasarruf + yatırım maliyeti + ROI/amortisman süresi.
- [ ] PVGIS API entegrasyonu ekle: seçilen poligon için 10 yıllık güneşlenme/radyasyon verisi çek.
- [ ] Tüm backend fonksiyonları için Python type hints kullan.

## 3) Frontend (Next.js + Leaflet) - Kullanıcı Akışı
- [ ] Sol panelde interaktif Leaflet haritayı kur (OSM tile).
- [ ] Harita tıklamasında backend snap-to-building servisini çağır (axios ile).
- [ ] Bina bulunmazsa manuel çizim fallback akışını aktive et.
- [ ] Sağ panelde dinamik dashboard kartları oluştur:
  - Yıllık enerji (kWh)
  - CO2 tasarrufu
  - Ağaç eşdeğeri
  - Engellenen araç mesafesi
  - Finansal metrikler (yatırım, tasarruf, ROI)
- [ ] Hesaplama sırasında "Hesaplaniyor..." loading durumlarını göster.
- [ ] Renk paletini uygula: `#2F5338`, `#F4D03F`, `#82C47C`.
- [ ] UI stilini uygula: 16px radius, temiz tipografi, modern SaaS görünümü.
- [ ] Tüm frontend kodunu TypeScript ve fonksiyonel component yaklaşımı ile yaz.

## 4) API Sözleşmesi ve Veri Modeli
- [ ] Frontend-backend veri sözleşmesini tanımla (request/response şemaları).
- [ ] Pydantic v2 modelleri ile input doğrulama ve hata mesajlarını standardize et.
- [ ] Hesap sonuçlarının tek bir "analysis result" payload'ında dönmesini sağla.

## 5) Veri ve Depolama (Supabase/PostGIS)
- [ ] Supabase bağlantı yapılandırmasını hazırla (ücretsiz katman).
- [ ] Analiz geçmişi saklama modeli tasarla (poligon, alan, enerji, karbon, ROI, zaman damgası).
- [ ] PostGIS uyumlu geometri alanları için şema planla.

## 6) Test ve Doğrulama
- [ ] Backend için birim testler yaz:
  - EPSG dönüşümü ve alan hesap doğruluğu
  - Enerji/karbon/ROI formülleri
  - Overpass 5m bina bulma akışı
- [ ] Frontend entegrasyon testleri yaz:
  - Harita tıklama -> analiz sonucu görüntüleme
  - Bina bulunamadı -> manuel çizim fallback
  - Loading/empty/error state doğrulamaları
- [ ] Uçtan uca akışı localhost ortamında doğrula.

## 7) Teslim ve Dokümantasyon
- [ ] Kurulum adımlarını ve çalıştırma komutlarını `README.md` içinde belgeleyin.
- [ ] API endpoint dokümantasyonunu ekle (`/server` için).
- [ ] Bilimsel sabitleri dokümante et:
  - CO2: `0.50 kg/kWh`
  - Ağaç: `20 kg/yıl`
  - Verimlilik: `20%`
  - Sistem kaybı: `15%`
- [ ] "Canlıya alma kapsam dışı, sadece local geliştirme" notunu dokümantasyonda açıkça belirt.

## 8) Önceliklendirilmiş Sprint Planı (Öneri)
- [ ] Sprint 1: Monorepo kurulum + FastAPI/Next.js iskeleti + CORS + Leaflet temel harita.
- [ ] Sprint 2: Overpass snap-to-building + EPSG dönüşümü + alan hesabı.
- [ ] Sprint 3: PVGIS entegrasyonu + enerji/karbon hesapları + dashboard kartları.
- [ ] Sprint 4: Finansal hesaplar + manuel çizim fallback + hata/loading durumları.
- [ ] Sprint 5: Testler + Supabase kayıtları + dokümantasyon.

# 📄 Ürün Gereksinim Dokümanı (PRD): SolarFootprint 

## 1. Ürün Vizyonu ve Amacı
SolarFootprint, binaların değerlendirilmemiş (atıl) çatı alanlarını ve enerji üretimine uygun boş arazileri analiz ederek, güneş enerjisi potansiyelini bilimsel verilerle hesaplayan bir **Karar Destek Portalıdır**. Platform, karmaşık CBS (Coğrafi Bilgi Sistemleri) verilerini son kullanıcı için finansal ve çevresel bir yol haritasına dönüştürür.

## 2. Kullanıcı Deneyimi ve İş Akışı (Localhost Focus)
1.  **Adım 1: Alan Seçimi (Snap-to-Building):** Kullanıcı haritaya tıkladığında, sistem 5 metre yarıçapındaki en yakın binayı **Overpass API** ile otomatik yakalar. Bina bulunamazsa serbest çizim aracı aktif olur.
2.  **Adım 2: Enerji Analizi:** Seçilen poligonun koordinatları üzerinden **PVGIS API** ile 10 yıllık güneşlenme verisi çekilir.
3.  **Adım 3: Karbon Dashboard:** Hesaplanan enerji; $CO_2$ tasarrufu, ağaç eşdeğeri olarak görselleştirilir.
4.  **Adım 4: Finansal Rapor:** Yatırım maliyeti (USD/TL) ve amortisman süresi (ROI) hesaplanır.

## 3. Teknik Modüller ve Algoritmalar

### 3.1. Analiz Motoru (Backend - Python/FastAPI)
* **Geometrik Hesaplama:** Koordinatlar `EPSG:4326`'dan metrik sistem olan `EPSG:5637`'ye dönüştürülerek gerçek $m^2$ alanı hesaplanır. (Hassas ölçüm için zorunludur).
* **Snap-to-Building:** Tıklanan noktada `way["building"]` sorgusu yapılarak bina poligonu OSM üzerinden otomatik çekilir.
* **Enerji Modelleme:** `Yıllık Enerji (kWh) = Alan * Verimlilik (0.20) * Radyasyon * Sistem Kaybı (0.85)`.

### 3.2. Sürdürülebilirlik ve Finans
* **Karbon Katsayısı:** $0.50\ kg\ CO_2/kWh$ (Türkiye ortalaması).
* **Ağaç Katsayısı:** $20\ kg/yıl$ (Bir yetişkin ağacın ortalama emilimi).
* **Ekonomi:** Güncel elektrik birim fiyatı üzerinden yıllık tasarruf ve yatırımın geri dönüş (ROI) hesabı.

## 4. Teknik Mimari (Sıfır Maliyet / Zero-Cost Stack)
* **Frontend:** Next.js (React) - `localhost:3000`.
* **Backend:** FastAPI (Python) - `localhost:8000`.
* **Harita Kütüphanesi:** **Leaflet.js** (Ücretsiz ve Açık Kaynak).
* **Harita Sağlayıcısı:** OpenStreetMap (OSM) Tiles.
* **Veri Kaynakları:** Overpass API (Bina Poligonları), PVGIS API (Güneş Verisi).
* **Veritabanı:** Supabase (PostgreSQL + PostGIS) - Ücretsiz Katman.

## 5. UI/UX Tasarım Gereksinimleri
* **Düzen:** Sol Panel (İnteraktif Harita), Sağ Panel (Dinamik Dashboard Kartları).
* **Renk Paleti:** * Derin Orman Yeşili (#2F5338) 
    * Güneş Sarısı (#F4D03F) 
    * Yaprak Yeşili (#82C47C)
* **Stil:** 16px yuvarlatılmış köşeler, modern SaaS estetiği, temiz tipografi.
* **Geri Bildirim:** Veri çekme ve hesaplama sırasında "Hesaplanıyor..." loading animasyonları.

## 6. Geliştirme Talimatları (Cursor İçin Özel Notlar)
* **CORS:** Backend tarafında `CORSMiddleware` yapılandırılarak frontend erişimine (localhost:3000) izin verilmelidir.
* **Kütüphaneler:** * Python: `shapely`, `pyproj`, `requests`.
    * JS: `react-leaflet`, `recharts`, `axios`.
* **Hata Yönetimi:** Belirlenen yarıçapta bina bulunamazsa kullanıcıya "Bina bulunamadı, lütfen alanı manuel çizin" uyarısı verilmelidir.
* **Deployment:** Canlıya alma (hosting) işlemleri şu aşamada kapsam dışıdır; sistem sadece **yerel (local)** geliştirme ortamında çalışacaktır.

## 7. Bilimsel Dayanak ve Notlar
"Hesaplamalarda Türkiye için $0.50\ kg\ CO_2/kWh$ karbon yoğunluğu ve $20\ kg/yıl$ ağaç karbon emilimi katsayıları baz alınmıştır. Veri doğruluğu OSM ve PVGIS kaynaklıdır."
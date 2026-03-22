# ☀️ SolarFootprint: Akıllı Güneş Enerjisi & Karar Destek Platformu

SolarFootprint; kentsel alanlardaki binaların ve arazilerin güneş enerjisi potansiyelini modern CBS (Coğrafi Bilgi Sistemleri), veri analitiği ve finansal modelleme yöntemleriyle hesaplayan uçtan uca bir web çözümüdür.

🚀 **Canlı Demo:** [https://solarfootprint.onrender.com](https://solarfootprint.onrender.com)

---

## 🏗️ Proje Mimarisi ve Analiz Metodolojisi

Uygulama, açık kaynaklı harita verilerini (OpenStreetMap) alarak kullanıcı dostu bir arayüzde 4 aşamalı bir mühendislik algoritmasıyla birleştirir:

### 📍 1. Konum ve Geometrik Analiz
* **Otomatik Tespit:** `OSMNX` kütüphanesi kullanılarak OpenStreetMap üzerinden bina geometrileri (poligonlar) çekilir. Kullanıcı tıkladığında, o noktanın içinde bulunduğu poligon `GeoPandas` ve **Overpass API** ile saptanır.
* **Serbest Çizim (Free Draw):** Bina verisi bulunmayan alanlar için geliştirilen algoritma, kullanıcının tıkladığı noktaları bir dizi (array) olarak tutar ve son nokta ilk noktaya yaklaştığında poligonu otomatik kapatır (**Auto-close logic**).

### 📊 2. PVGIS Tabanlı Güneş Enerjisi Analizi
Seçilen alanın coğrafi koordinatları üzerinden **PVGIS (Photovoltaic Geography Information System)** verileri simüle edilir. Konumun son 10 yıllık güneşlenme süresi, radyasyon şiddeti ve panel eğim verimliliği hesaplanarak yıllık toplam enerji üretim kapasitesi (kW/h) belirlenir.

### 🌿 3. Çevresel Etki ve Karbon Ayak İzi
Üretilecek temiz enerji, Türkiye’nin enerji karma katsayıları baz alınarak doğaya olan katkısına dönüştürülür. Engellenen yıllık **CO2 salımı** hesaplanır ve bu değer, yetişkin bir ağacın karbon emilim kapasitesiyle kıyaslanarak "Ağaç Eşdeğeri" olarak sunulur.

### 💰 4. Finansal Fizibilite ve ROI Hesabı
Sistemin tahmini kurulum maliyeti ile güncel elektrik birim fiyatları üzerinden sağladığı tasarruf karşılaştırılır. Kurulumun kendini kaç yılda amorti edeceği (**Return on Investment - ROI**) bir **Karar Destek Raporu** formatında kullanıcıya yansıtılır.

---

## 🛠️ Teknik Yetkinlikler (Tech Stack)

### **Backend (Python & CBS)**
* **OSMNX & GeoPandas:** Coğrafi verilerin analizi, poligon oluşturma ve alan hesaplamaları.
* **Flask:** API uç noktalarının yönetimi ve istemci-sunucu iletişimi.
* **Shapely:** Geometrik objelerin (Point, Polygon) manipülasyonu.

### **Frontend (UI/UX)**
* **Leaflet.js:** Harita render motoru ve interaktif katman yönetimi.
* **Tailwind CSS:** Modern, temiz ve mühendislik odaklı arayüz tasarımı.
* **JavaScript (ES6+):** Dinamik çizim modları ve **titreşimli (shake)** hata uyarı animasyonları.

### **DevOps & Deployment**
* **Docker:** Uygulamanın kütüphanelerle birlikte konteynerize edilmesi.
* **Render Blueprints:** `render.yaml` üzerinden otomatik altyapı yönetimi.
* **GitHub Sync:** Kod güncellendiğinde (Push) otomatik canlıya alma (CI/CD).

---

## 🌟 Öne Çıkan Özellikler

* ✅ **Çift Modlu Analiz:** Mevcut binaları otomatik seçme veya manuel alan çizimi.
* ✅ **Akıllı Poligon Kapatma:** Karmaşık alanları hatasız oluşturmak için geliştirilmiş çizim modu.
* ✅ **Titreşimli Uyarı Sistemi:** Veri bulunamadığında kullanıcıyı CSS animasyonuyla doğru moda yönlendirme.
* ✅ **Şeffaf Katmanlama:** Seçilen alanların harita üzerinde profesyonel görselleştirmesi.

---


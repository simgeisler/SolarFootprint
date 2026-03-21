# SolarFootprint

Monorepo yapisi:
- `client`: Next.js 14 + TypeScript + Tailwind + Leaflet
- `server`: FastAPI + Pydantic v2 + Shapely + PyProj

## 1) Backend Calistirma

```bash
cd server
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

## 2) Frontend Calistirma

```bash
cd client
npm install
npm run dev
```

Uygulama:
- Frontend: http://localhost:3000
- Backend: http://localhost:8000

## Ozellikler
- Haritaya tiklandiginda backend Overpass API ile 5m cevrede bina poligonu arar.
- Bina bulunamazsa manuel poligon fallback sunulur.
- Alan hesabi EPSG:4326 -> EPSG:5637 donusumu ile yapilir.
- PVGIS API verisi ile yillik enerji, CO2, agac esdegeri ve ROI hesaplanir.

## 3) Render — tek Web Service (Docker)

Repo kökünde `Dockerfile` ve `render.yaml` ile **frontend + backend aynı serviste** yayınlanır:

- Next.js `output: "export"` ile statik `out/` üretilir.
- FastAPI `STATIC_ROOT=/app/out` ile arayüzü kökten sunar; `/health`, `/analyze` API olarak kalır.

**Render’da:**

1. GitHub/GitLab repo’yu bağlayın.
2. **Blueprint** ile `render.yaml` kullanın **veya** **New → Web Service** → Runtime: **Docker**, Dockerfile Path: `Dockerfile`, Root Directory: boş (repo kökü).
3. Ortam değişkeni (Blueprint’te tanımlı): `STATIC_ROOT=/app/out`
4. `PORT` Render tarafından otomatik verilir.

**Yerel Docker denemesi:**

```bash
docker build -t solarfootprint .
docker run -p 8000:8000 -e PORT=8000 solarfootprint
```

Tarayıcı: `http://localhost:8000`

## Not
- Yerel geliştirme için hâlâ `client` (3000) + `server` (8000) ayrı çalıştırılabilir.
- Üretimde API adresi: `client/.env.example` içindeki `NEXT_PUBLIC_API_BASE_URL` ile ayarlanır (Render imajında boş = göreli URL).

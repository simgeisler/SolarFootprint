# SolarFootprint — tek konteyner: Next.js static export + FastAPI (Render uyumlu)
# syntax=docker/dockerfile:1

FROM node:20-alpine AS frontend
WORKDIR /app
COPY client/package.json client/package-lock.json ./
RUN npm ci
COPY client/ ./
ENV NEXT_TELEMETRY_DISABLED=1
# Üretimde API aynı origin; boş string = göreli URL
ARG NEXT_PUBLIC_API_BASE_URL=
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
RUN npm run build

FROM python:3.12-slim
WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
COPY server/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY server/app ./app
COPY --from=frontend /app/out ./out
ENV STATIC_ROOT=/app/out
EXPOSE 8000
# Render PORT ortam değişkenini kullanır
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]

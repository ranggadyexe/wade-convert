FROM python:3.12-slim

# Dependensi sistem untuk konversi (OCR, PDF, gambar)
RUN apt-get update && apt-get install -y --no-install-recommends \
    ghostscript \
    poppler-utils \
    imagemagick \
    tesseract-ocr \
    tesseract-ocr-ind \
    tesseract-ocr-eng \
    qpdf \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app
COPY tests ./tests

# Jalankan sebagai user non-root
RUN useradd -m appuser
USER appuser

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

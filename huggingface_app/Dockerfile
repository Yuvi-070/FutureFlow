FROM python:3.13.2-slim

WORKDIR /app

# Install system dependencies (needed by some Python packages)
RUN apt-get update && apt-get install -y --no-install-recommends \
        build-essential \
        curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better layer caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application source
COPY src/ ./src/

# Expose Streamlit default port
EXPOSE 8501

# Health-check so HF Spaces knows the app is running
HEALTHCHECK CMD curl --fail http://localhost:8501/_stcore/health || exit 1

# Entry-point — matches the Hugging Face Space configuration
CMD ["streamlit", "run", "src/future.py", \
     "--server.port=8501", \
     "--server.address=0.0.0.0", \
     "--server.headless=true", \
     "--browser.gatherUsageStats=false"]

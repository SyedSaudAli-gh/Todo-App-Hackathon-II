# Multi-stage Dockerfile for FastAPI Backend
# Stage 1: Build stage
FROM python:3.13-slim AS builder

WORKDIR /app

# Install build dependencies for compiling Python packages
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better layer caching
COPY requirements.txt .

# Install dependencies to user directory
RUN pip install --no-cache-dir --user -r requirements.txt

# Stage 2: Runtime stage
FROM python:3.13-slim

WORKDIR /app

# Create non-root user first
RUN useradd -m -u 1000 appuser

# Copy installed dependencies from builder to appuser's home
COPY --from=builder --chown=appuser:appuser /root/.local /home/appuser/.local

# Copy application code
COPY --chown=appuser:appuser . .

# Add local bin to PATH
ENV PATH=/home/appuser/.local/bin:$PATH

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 8001

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8001/api/v1/health')" || exit 1

# Start application
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8001"]

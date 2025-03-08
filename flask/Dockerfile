# Use a base image with proper SSL support
FROM python:3.9-slim

# Set the working directory
WORKDIR /app

# Install system dependencies for SSL and spaCy
RUN apt-get update && apt-get install -y \
    libssl-dev libffi-dev build-essential wget \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Install spaCy model explicitly
RUN python -m spacy download en_core_web_sm

# Copy the entire project, including the "model" folder
COPY . .

# Expose the Flask port
EXPOSE 5000

# Run the Flask app
CMD ["python", "app.py"]

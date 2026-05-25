#!/bin/bash

# Navigate to the project directory
cd "$(dirname "$0")"

# Check if Python 3 is installed
if command -v python3 &>/dev/null; then
    echo "Starting local server at http://localhost:8000/"
    python3 -m http.server 8000
# Fallback to Python 2 if Python 3 is not available
elif command -v python &>/dev/null; then
    echo "Starting local server at http://localhost:8000/"
    python -m SimpleHTTPServer 8000
else
    echo "Error: Python is not installed. Please install Python to use this script."
    exit 1
fi

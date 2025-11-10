#!/bin/bash
# Quick start script for Player Modal Python Server

echo "🎯 Starting Player Modal Server (Python)..."
echo ""

# Check if Python 3 is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.6 or higher."
    exit 1
fi

# Check if Flask is installed
if ! python3 -c "import flask" &> /dev/null; then
    echo "⚠️  Flask is not installed. Installing..."
    pip3 install -r api/player-modal-requirements.txt
fi

# Check if requests is installed
if ! python3 -c "import requests" &> /dev/null; then
    echo "⚠️  Requests is not installed. Installing..."
    pip3 install requests flask-cors
fi

# Change to api directory
cd api || exit

# Run the server
echo "✅ Starting server on http://localhost:5001"
echo "📖 Endpoint: http://localhost:5001/api/player-modal?team=RCB&player=PlayerName"
echo "⏹️  Press Ctrl+C to stop the server"
echo ""

python3 player-modal.py


#!/bin/bash

# HITL MCP Server Runner Script

set -e

echo "🚀 HITL MCP Server Setup"

# Check if API key is set
if [ -z "$AGENTMP_API_KEY" ]; then
    echo "❌ Error: AGENTMP_API_KEY environment variable is not set"
    echo "Please set it with: export AGENTMP_API_KEY='your_api_key_here'"
    exit 1
fi

echo "✅ API key is set"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Error: Docker is not installed"
    echo "Please install Docker first"
    exit 1
fi

echo "✅ Docker is available"

# Generate package-lock.json if it doesn't exist
if [ ! -f "package-lock.json" ]; then
    echo "🔧 Generating package-lock.json..."
    if command -v npm &> /dev/null; then
        npm install --package-lock-only
    else
        echo "⚠️  npm not found locally, using basic package-lock.json"
    fi
fi

# Check if docker-compose is available
if command -v docker-compose &> /dev/null; then
    COMPOSE_CMD="docker-compose"
elif docker compose version &> /dev/null; then
    COMPOSE_CMD="docker compose"
else
    echo "❌ Error: docker-compose is not available"
    echo "Please install docker-compose"
    exit 1
fi

echo "✅ Docker Compose is available"

# Build and run the container
echo "🔨 Building Docker image..."
$COMPOSE_CMD build

echo "🏃 Starting HITL MCP Server..."
$COMPOSE_CMD up -d

echo "✅ HITL MCP Server is running!"
echo ""
echo "📝 Next steps:"
echo "1. Configure Claude Desktop with the MCP server settings (see README.md)"
echo "2. Restart Claude Desktop"
echo "3. Start using HITL commands in Claude!"
echo ""
echo "📊 To check logs: $COMPOSE_CMD logs -f"
echo "🛑 To stop: $COMPOSE_CMD down"
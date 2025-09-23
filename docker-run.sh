#!/bin/bash

# Simple Docker build and run script for HITL MCP Server

set -e

echo "🚀 HITL MCP Server Docker Setup (without docker-compose)"

# Check if API key is set
if [ -z "$AGENTMP_API_KEY" ]; then
    echo "❌ Error: AGENTMP_API_KEY environment variable is not set"
    echo "Please set it with: export AGENTMP_API_KEY='your_api_key_here'"
    exit 1
fi

echo "✅ API key is set"

# Check if Docker is available
if ! command -v docker &> /dev/null; then
    echo "❌ Error: Docker is not installed"
    exit 1
fi

echo "✅ Docker is available"

# Stop and remove existing container if it exists
echo "🧹 Cleaning up existing container..."
docker stop hitl-mcp-server 2>/dev/null || true
docker rm hitl-mcp-server 2>/dev/null || true

# Build the Docker image
echo "🔨 Building Docker image..."
docker build -t hitl-mcp-server .

# Run the container
echo "🏃 Starting HITL MCP Server container..."
docker run -d \
  --name hitl-mcp-server \
  --env AGENTMP_API_KEY="$AGENTMP_API_KEY" \
  --restart unless-stopped \
  -i \
  hitl-mcp-server

echo "✅ HITL MCP Server container is running!"
echo ""
echo "📊 Container status:"
docker ps | grep hitl-mcp-server

echo ""
echo "📝 Next steps:"
echo "1. Configure Claude Desktop with this MCP server config:"
echo ""
echo "{"
echo "  \"mcpServers\": {"
echo "    \"hitl\": {"
echo "      \"command\": \"docker\","
echo "      \"args\": [\"exec\", \"-i\", \"hitl-mcp-server\", \"node\", \"app.js\"],"
echo "      \"env\": {"
echo "        \"AGENTMP_API_KEY\": \"$AGENTMP_API_KEY\""
echo "      }"
echo "    }"
echo "  }"
echo "}"
echo ""
echo "2. Restart Claude Desktop"
echo "3. Start using HITL commands in Claude!"
echo ""
echo "🔍 Useful commands:"
echo "  View logs: docker logs hitl-mcp-server"
echo "  Stop container: docker stop hitl-mcp-server"
echo "  Remove container: docker rm hitl-mcp-server"
echo "  Test container: docker exec -i hitl-mcp-server node -e 'console.log(\"Container is working!\")'"
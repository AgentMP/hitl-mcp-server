# HITL MCP Server - Public Usage Instructions

🚀 **Globally Available Docker Container**: `agentmp/hitl-mcp-server`

## Quick Start (Anyone, Anywhere)

```bash
# Pull the image (works globally)
docker pull agentmp/hitl-mcp-server:latest

# Run with your configuration
## Pre requisite - Get you API Key from https://agentmp.ai/createapikey
docker run -d \
  --name hitl-mcp-server \
  -p 3000:3000 \
  -e HITL_API_URL="https://backend.agentmp.io" \
  -e HITL_API_KEY="your-api-key" \
  --restart unless-stopped \
  agentmp/hitl-mcp-server:latest
```

## Global Availability Verification

Test that the image is publicly accessible:

```bash
# This should work from any machine worldwide
docker search agentmp/hitl-mcp-server
docker pull agentmp/hitl-mcp-server:latest
```

## Platform Support

✅ **Linux x86_64** (Intel/AMD processors)  
✅ **Linux ARM64** (Apple Silicon, ARM servers)  
✅ **Docker Desktop on macOS** (Intel and Apple Silicon)  
✅ **Docker Desktop on Windows** (Intel/AMD)  
✅ **Linux servers and cloud platforms**

## Integration Examples

### Basic Docker Run
```bash
docker run -d \
  --name hitl-mcp-server \
  -p 3000:3000 \
  -e HITL_API_URL="$HITL_API_URL" \
  -e HITL_API_KEY="$HITL_API_KEY" \
  agentmp/hitl-mcp-server:latest
```

### Docker Compose
```yaml
version: '3.8'
services:
  hitl-mcp-server:
    image: agentmp/hitl-mcp-server:latest
    container_name: hitl-mcp-server
    ports:
      - "3000:3000"
    environment:
      - HITL_API_URL=${HITL_API_URL}
      - HITL_API_KEY=${HITL_API_KEY}
    restart: unless-stopped
```

### Kubernetes Deployment
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: hitl-mcp-server
spec:
  replicas: 1
  selector:
    matchLabels:
      app: hitl-mcp-server
  template:
    metadata:
      labels:
        app: hitl-mcp-server
    spec:
      containers:
      - name: hitl-mcp-server
        image: agentmp/hitl-mcp-server:latest
        ports:
        - containerPort: 3000
        env:
        - name: HITL_API_URL
          value: "https://your-hitl-api.com"
        - name: HITL_API_KEY
          valueFrom:
            secretKeyRef:
              name: hitl-secret
              key: api-key
---
apiVersion: v1
kind: Service
metadata:
  name: hitl-mcp-server-service
spec:
  selector:
    app: hitl-mcp-server
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000
  type: LoadBalancer
```

## Claude Desktop Configuration

Add to your Claude Desktop config:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`  
**Windows**: `%APPDATA%/Claude/claude_desktop_config.json`  
**Linux**: `~/.config/claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "hitl-server": {
      "command": "docker",
      "args": [
        "exec",
        "hitl-mcp-server",
        "node",
        "server.js"
      ],
      "env": {
        "HITL_API_URL": "https://your-hitl-api.com",
        "HITL_API_KEY": "your-api-key"
      }
    }
  }
}
```

## Available Tags

- `latest` - Most recent stable version
- `v1.0.0` - Specific version (recommended for production)
- Future versions will be tagged accordingly

## Support & Documentation

- **Docker Hub**: https://hub.docker.com/r/agentmp/hitl-mcp-server
- **Issues**: Report via your preferred channel
- **Updates**: Watch the Docker Hub repository for new versions

## Security Note

⚠️ Always use environment variables or Docker secrets for API keys:
```bash
# Good: Using environment variables
docker run -e HITL_API_KEY="$MY_SECRET_KEY" agentmp/hitl-mcp-server:latest

# Bad: Hardcoding secrets in commands
docker run -e HITL_API_KEY="actual-secret-here" agentmp/hitl-mcp-server:latest
```
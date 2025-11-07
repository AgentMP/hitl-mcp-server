# How to setup Claude Desktop to use HITL MCP?

1) Sign up for AgentMP.ai and get an API Key:

https://agentmp.ai/createapikey

(You will have to sign in using your gmail/linkedIn)

2) Get Local Setup Docker Image and Run it: (Prereq - Docker desktop installed & running)

docker pull agentmp/hitl-mcp-server:latest

docker run -d \
  --name hitl-mcp-server \
  --env AGENTMP_API_KEY="<YOUR AGENTMP API KEY>" \
  --restart unless-stopped \
  -i \
  agentmp/hitl-mcp-server

  3) Configure claude_desktop.json

  {
  "mcpServers": {
    "hitl": {
      "command": "docker",
      "args": ["exec", "-i", "hitl-mcp-server", "node", "app.js"],
      "env": {
        "AGENTMP_API_KEY": **"your_api_key_here"**
      }
    }
  }
}

4) Use Cogito HITL on Claude

eg. 

List all my HITL escalations

Create a HITL escalation with these details:
- Session ID: "test-session-123"  
- Agent ID: "claude-test-agent"
- User prompt: "User wants to purchase premium subscription"
- Proposed action: Purchase of "Premium Plan" for $29.99
- Escalate to: "karthik6461@gmail.com"
- Priority: "normal"

Get details for HITL escalation "esc-[ID-FROM-TEST-2]"


Approve HITL escalation "esc-[ID-FROM-TEST-2]" with comment "Approved for testing purposes"

Create a HITL escalation for a $50 software license purchase, then modify it to $75 enterprise license

# Receiving push notifications

5) To receive Cogito push notifications on Slack/Teams/WhatsApp/Telegram , go to https://agentmp.ai/linkchannels , select your preferred channel and configure your channel identifier.


For Teams and Slack contact your channel admin to enable AgentMP bot.

We are actively onboarding other channels. If you need to run this MCP server entirely within your firewall reachout to ops@manifoldsystems.io

6) To test out Cogito HITL API on postman you can use postman collection - HITL.postman_collection.json - in this repo.

Please refer to this demo video:

https://github.com/AgentMP/hitl-mcp-server/blob/main/HITLDemoVideo.mp4

# HITL MCP Server

# What is it?

HITL MCP server streamlines user interactions with AI Agents that are semi-autonomous. Agents can perform their tasks and reach out to humans for approvals, status updates, feedbacks, course corrections using this MCP tool. User interactions are captured, stored for future enhancements. User interactions are managed in channels of choice by end user (slack/teams/whatsapp/telegram/web browser).

# Why?

1. Standardized interactions, does not assume user is sitting in front of the agent and waits for feedback/approvals
2. Ease of use, without any new app installation
3. Structured interactions that are stored and tracked for future reference
4. Domain agnostic implementation
   

# Why Now?

There does not seem to be a single standard for HITL.

A Model Context Protocol (MCP) server that bridges Claude Desktop with your HITL (Human In The Loop) escalation service. This allows Claude to create, approve, modify, reject, and manage HITL escalations directly from Claude Desktop.

https://hub.docker.com/r/agentmp/hitl-mcp-server

## Features

- **Create HITL Escalations**: Create new escalation requests with proposed actions
- **Approve Escalations**: Approve pending escalations with optional comments
- **Modify Escalations**: Modify existing escalations with new actions
- **Reject Escalations**: Reject escalations with optional comments
- **Get Escalation Details**: Retrieve details of specific escalations
- **List Escalations**: List all escalations for the authenticated user



### If you want to build and run locally yourself ...

## Prerequisites

- Node.js 18+ 
- Docker (optional, for containerized deployment)
- AGENTMP API Key from your platform
- Claude Desktop application

## Steps to Configure Cogito HITL on Claude Desktop

(Please refer to SetupClaudeDesktop.md for steps)

## Setup

### Option 1: Docker Deployment (Recommended)

1. **Clone or create the project files**:
   ```bash
   mkdir hitl-mcp-server
   cd hitl-mcp-server
   ```

2. **Create all the required files** (app.js, package.json, package-lock.json, Dockerfile, docker-compose.yml)

3. **Set your API key**:
   ```bash
   export AGENTMP_API_KEY="your_api_key_here"
   ```

4. **Build and run the container**:
   ```bash
   chmod +x run.sh
   ./run.sh
   ```
   
   Or manually:
   ```bash
   docker-compose up --build -d
   ```

### Option 2: Local Node.js Deployment (Recommended for troubleshooting)

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set your API key**:
   ```bash
   export AGENTMP_API_KEY="your_api_key_here"
   ```

3. **Use the setup script**:
   ```bash
   chmod +x setup-local.sh
   ./setup-local.sh
   ```

4. **Or run manually**:
   ```bash
   node app.js
   ```

### Testing Your Setup

Before configuring Claude Desktop, test your setup:

```bash
# Test the server directly
export AGENTMP_API_KEY="your_api_key"
node app.js
```

If working correctly, you should see:
```
🚀 Starting HITL MCP Server...
✅ API Key loaded successfully  
🔧 Setting up request handlers...
✅ HITL MCP Server initialized successfully
🌟 HITL MCP Server running and connected via stdio
📡 Ready to handle HITL requests from Claude Desktop
```

## Claude Desktop Configuration

To use this MCP server with Claude Desktop, you need to configure it in your Claude Desktop settings.

### Configuration Steps

1. **Open Claude Desktop**
2. **Go to Settings** → **Developer**
3. **Edit Config** (this opens your MCP configuration file)
4. **Add the following configuration**:

#### For Docker Deployment:
```json
{
  "mcpServers": {
    "hitl": {
      "command": "docker",
      "args": ["exec", "-i", "hitl-mcp-server", "node", "app.js"],
      "env": {
        "AGENTMP_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

#### For Local Node.js Deployment:
```json
{
  "mcpServers": {
    "hitl": {
      "command": "node",
      "args": ["/path/to/your/hitl-mcp-server/app.js"],
      "env": {
        "AGENTMP_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

5. **Save the configuration file**
6. **Restart Claude Desktop**

## Usage Examples

Once configured, you can use the following commands in Claude Desktop:

### Create a HITL Escalation
```
Create a HITL escalation for session "sess-123" with agent "my-agent" for a purchase of "Premium License" costing $99.99. Escalate to user "user@example.com" with normal priority.
```

### Approve an Escalation
```
Approve HITL escalation "esc-123456789" with comment "Approved for purchase"
```

### Modify an Escalation
```
Modify HITL escalation "esc-123456789" to change the item to "Enterprise License" and amount to $199.99 with comment "Upgraded to enterprise"
```

### Reject an Escalation
```
Reject HITL escalation "esc-123456789" with comment "Budget exceeded"
```

### Get Escalation Details
```
Get details for HITL escalation "esc-123456789"
```

### List All Escalations
```
List all my HITL escalations
```

## Available Tools

The MCP server provides the following tools:

1. **create_hitl**: Create a new HITL escalation request
2. **approve_hitl**: Approve a HITL escalation
3. **modify_hitl**: Modify a HITL escalation with new action
4. **reject_hitl**: Reject a HITL escalation
5. **get_hitl**: Get details of a specific HITL escalation
6. **list_hitls**: List all HITL escalations for the authenticated user

## Environment Variables

- `AGENTMP_API_KEY` (required): Your API key for the AGENTMP platform

## API Endpoints Used

The server communicates with your HITL service using these endpoints:

- `POST /api/hitl/mcp` - MCP JSON-RPC endpoint for create, approve, modify
- `POST /api/hitl/{id}/reject` - REST endpoint for rejecting escalations
- `GET /api/hitl/{id}` - REST endpoint for getting escalation details
- `GET /api/hitl` - REST endpoint for listing escalations

## Troubleshooting

### Common Issues

1. **"No such container: hitl-mcp-server"**
   - The Docker container isn't running
   - Run: `docker-compose up -d` to start it
   - Check: `docker ps | grep hitl-mcp-server` to verify it's running
   - **Recommendation**: Use local Node.js setup instead

2. **"Cannot find module '@modelcontextprotocol/sdk/server/index.js'"**
   - Dependencies not installed locally
   - Run: `npm install` in the project directory
   - Make sure you're in the correct directory with package.json

3. **API Key Not Set**
   - Ensure `AGENTMP_API_KEY` environment variable is properly set
   - Check that the API key is valid and has proper permissions

4. **Container Not Starting**
   - Check Docker logs: `docker logs hitl-mcp-server`
   - Ensure the API key is provided in the environment

5. **Claude Desktop Not Recognizing Server**
   - Verify the MCP configuration syntax in Claude Desktop
   - Check that the path to the script is correct (use absolute path)
   - Restart Claude Desktop after configuration changes
   - For local setup, use the config format provided by `setup-local.sh`

6. **Connection Issues**
   - Ensure your network allows connections to `backend.agentmp.io`
   - Check if any firewall rules are blocking the connection

### Logs

For Docker deployment, view logs with:
```bash
docker logs hitl-mcp-server
```

For local deployment, logs will appear in the terminal where you ran `npm start`.

## Security Considerations

- Store your API key securely and never commit it to version control
- The container runs as a non-root user for security
- Consider using Docker secrets for production deployments
- Regularly rotate your API keys

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License



# Set your API key  
export AGENTMP_API_KEY="99aeae0e6b4f4107a59d1b59010834cb3eb96ae0f667078f7cc2a296dad27785"

# Build the image
docker build -t hitl-mcp-server .

# Run the container
docker run -d \
  --name hitl-mcp-server \
  --env AGENTMP_API_KEY="99aeae0e6b4f4107a59d1b59010834cb3eb96ae0f667078f7cc2a296dad27785" \
  --restart unless-stopped \
  -i \
  hitl-mcp-server



  Perfect! Your Docker container is running successfully (ID: `3c10bcf71a6d...`). 

## 🎯 **Claude Desktop Configuration**

Open Claude Desktop → Settings → Developer → Edit Config and add this:## 📝 **Setup Steps**

1. **Save the config above** in Claude Desktop
2. **Restart Claude Desktop** 
3. **Test with the examples below**

## 🧪 **Simple Test Cases**

Here are test cases from basic to advanced:

### **Test 1: List Existing HITLs (Basic)**
```
List all my HITL escalations
```
*Expected: Should show your existing HITL escalations or empty list*

### **Test 2: Create a HITL Escalation (Core Function)**
```
Create a HITL escalation with these details:
- Session ID: "test-session-123"  
- Agent ID: "claude-test-agent"
- User prompt: "User wants to purchase premium subscription"
- Proposed action: Purchase of "Premium Plan" for $29.99
- Escalate to: "karthik6461@gmail.com"
- Priority: "normal"
```
*Expected: Should return escalation ID like "esc-xxxxx-xxxxx-xxxxx"*

### **Test 3: Get HITL Details (Verification)**
```
Get details for HITL escalation "esc-[ID-FROM-TEST-2]"
```
*Replace [ID-FROM-TEST-2] with the actual ID from Test 2*

### **Test 4: Approve HITL (Action)**
```
Approve HITL escalation "esc-[ID-FROM-TEST-2]" with comment "Approved for testing purposes"
```

### **Test 5: Create and Modify (Advanced)**
```
Create a HITL escalation for a $50 software license purchase, then modify it to $75 enterprise license
```

## 🔍 **Quick Verification Commands**

Before testing in Claude, verify your container:

```bash
# Check container is running
docker ps | grep hitl-mcp-server

# Check container logs
docker logs hitl-mcp-server

# Test the container directly
docker exec -i hitl-mcp-server node -e 'console.log("✅ Container is working!")'
```

## 📊 **Expected Claude Responses**

If working correctly, Claude should:
- ✅ Recognize the HITL tools automatically
- ✅ Create escalations and return IDs like `esc-xxxxx-xxxxx-xxxxx`
- ✅ Show JSON responses with escalation details
- ✅ Handle approve/modify/reject operations

## 🚨 **If Something Goes Wrong**

1. **Check Docker logs**: `docker logs hitl-mcp-server`
2. **Restart Claude Desktop** after any config changes
3. **Verify container is running**: `docker ps | grep hitl-mcp-server`

Start with **Test 1** (list HITLs) - it's the safest and will confirm the connection is working!

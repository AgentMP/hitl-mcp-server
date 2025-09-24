1) Sign up for AgentMP.ai and get an API Key:

https://agentmp.ai/createapikey

2) Get Local Setup Docker Image and Run it:

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
        "AGENTMP_API_KEY": "your_api_key_here"
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
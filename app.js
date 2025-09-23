import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import axios from 'axios';

class HITLMCPServer {
  constructor() {
    console.error('🚀 Starting HITL MCP Server...');
    
    this.server = new Server(
      {
        name: 'hitl-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.apiKey = process.env.AGENTMP_API_KEY;
    this.baseUrl = 'https://backend.agentmp.io';
    
    if (!this.apiKey) {
      console.error('❌ AGENTMP_API_KEY environment variable is required');
      console.error('💡 Set it with: export AGENTMP_API_KEY="your_api_key"');
      process.exit(1);
    }

    console.error('✅ API Key loaded successfully');
    console.error('🔧 Setting up request handlers...');
    
    this.setupHandlers();
    
    console.error('✅ HITL MCP Server initialized successfully');
  }

  setupHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'create_hitl',
          description: 'Create a new HITL escalation request',
          inputSchema: {
            type: 'object',
            properties: {
              session_id: {
                type: 'string',
                description: 'Session identifier for the escalation',
              },
              agent_id: {
                type: 'string',
                description: 'Agent identifier that is requesting escalation',
              },
              user_prompt: {
                type: 'string',
                description: 'The user prompt that triggered the escalation',
              },
              proposed_action: {
                type: 'object',
                description: 'The action that the agent wants to perform',
                properties: {
                  type: { type: 'string' },
                  item: { type: 'string' },
                  amount: { type: 'number' }
                }
              },
              escalate_to: {
                type: 'object',
                description: 'Who to escalate to',
                properties: {
                  type: { type: 'string', enum: ['user'] },
                  target_id: { type: 'string' }
                },
                required: ['type', 'target_id']
              },
              priority: {
                type: 'string',
                enum: ['low', 'normal', 'high'],
                description: 'Priority level of the escalation',
              },
              webhookurl: {
                type: 'string',
                description: 'Webhook URL for status updates (optional)',
              },
              webhookverificationtoken: {
                type: 'string',
                description: 'Webhook verification token (optional)',
              }
            },
            required: ['session_id', 'agent_id', 'user_prompt', 'proposed_action', 'escalate_to', 'priority'],
          },
        },
        {
          name: 'approve_hitl',
          description: 'Approve a HITL escalation',
          inputSchema: {
            type: 'object',
            properties: {
              escalation_id: {
                type: 'string',
                description: 'The ID of the escalation to approve',
              },
              comments: {
                type: 'string',
                description: 'Optional comments for the approval',
              },
            },
            required: ['escalation_id'],
          },
        },
        {
          name: 'modify_hitl',
          description: 'Modify a HITL escalation with new action',
          inputSchema: {
            type: 'object',
            properties: {
              escalation_id: {
                type: 'string',
                description: 'The ID of the escalation to modify',
              },
              modified_action: {
                type: 'object',
                description: 'The modified action to replace the original',
                properties: {
                  type: { type: 'string' },
                  item: { type: 'string' },
                  amount: { type: 'number' }
                }
              },
              comments: {
                type: 'string',
                description: 'Comments explaining the modification',
              },
            },
            required: ['escalation_id', 'modified_action'],
          },
        },
        {
          name: 'reject_hitl',
          description: 'Reject a HITL escalation',
          inputSchema: {
            type: 'object',
            properties: {
              escalation_id: {
                type: 'string',
                description: 'The ID of the escalation to reject',
              },
              comments: {
                type: 'string',
                description: 'Optional comments for the rejection',
              },
            },
            required: ['escalation_id'],
          },
        },
        {
          name: 'get_hitl',
          description: 'Get details of a specific HITL escalation',
          inputSchema: {
            type: 'object',
            properties: {
              escalation_id: {
                type: 'string',
                description: 'The ID of the escalation to retrieve',
              },
            },
            required: ['escalation_id'],
          },
        },
        {
          name: 'list_hitls',
          description: 'List all HITL escalations for the authenticated user',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
      ],
    }));

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'create_hitl':
            return await this.createHITL(args);
          case 'approve_hitl':
            return await this.approveHITL(args);
          case 'modify_hitl':
            return await this.modifyHITL(args);
          case 'reject_hitl':
            return await this.rejectHITL(args);
          case 'get_hitl':
            return await this.getHITL(args);
          case 'list_hitls':
            return await this.listHITLs(args);
          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Unknown tool: ${name}`
            );
        }
      } catch (error) {
        console.error(`Error in ${name}:`, error.message);
        throw new McpError(
          ErrorCode.InternalError,
          `Failed to execute ${name}: ${error.message}`
        );
      }
    });
  }

  async createHITL(args) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/api/hitl/mcp`,
        {
          jsonrpc: '2.0',
          id: '1',
          method: 'hitl.create',
          params: {
            ...args,
            authorization: this.apiKey
          }
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        content: [
          {
            type: 'text',
            text: `HITL escalation created successfully!\n\nResponse: ${JSON.stringify(response.data, null, 2)}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to create HITL: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  async approveHITL(args) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/api/hitl/mcp`,
        {
          jsonrpc: '2.0',
          id: '1',
          method: 'hitl.approve',
          params: {
            ...args
          }
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
          },
        }
      );

      return {
        content: [
          {
            type: 'text',
            text: `HITL escalation approved successfully!\n\nResponse: ${JSON.stringify(response.data, null, 2)}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to approve HITL: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  async modifyHITL(args) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/api/hitl/mcp`,
        {
          jsonrpc: '2.0',
          id: '1',
          method: 'hitl.modify',
          params: {
            ...args
          }
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
          },
        }
      );

      return {
        content: [
          {
            type: 'text',
            text: `HITL escalation modified successfully!\n\nResponse: ${JSON.stringify(response.data, null, 2)}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to modify HITL: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  async rejectHITL(args) {
    try {
      // Using REST API for reject since it's not in MCP examples
      const response = await axios.post(
        `${this.baseUrl}/api/hitl/${args.escalation_id}/reject`,
        {
          comments: args.comments || ''
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
          },
        }
      );

      return {
        content: [
          {
            type: 'text',
            text: `HITL escalation rejected successfully!\n\nResponse: ${JSON.stringify(response.data, null, 2)}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to reject HITL: ${error.response?.data?.message || error.message}`);
    }
  }

  async getHITL(args) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/api/hitl/${args.escalation_id}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
          },
        }
      );

      return {
        content: [
          {
            type: 'text',
            text: `HITL escalation details:\n\n${JSON.stringify(response.data, null, 2)}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to get HITL: ${error.response?.data?.message || error.message}`);
    }
  }

  async listHITLs() {
    try {
      const response = await axios.get(
        `${this.baseUrl}/api/hitl`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
          },
        }
      );

      return {
        content: [
          {
            type: 'text',
            text: `All HITL escalations:\n\n${JSON.stringify(response.data, null, 2)}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to list HITLs: ${error.response?.data?.message || error.message}`);
    }
  }

  async run() {
    try {
      const transport = new StdioServerTransport();
      await this.server.connect(transport);
      console.error('🌟 HITL MCP Server running and connected via stdio');
      console.error('📡 Ready to handle HITL requests from Claude Desktop');
    } catch (error) {
      console.error('❌ Failed to start HITL MCP Server:', error.message);
      process.exit(1);
    }
  }
}

// Start the server
const server = new HITLMCPServer();
server.run().catch(console.error);
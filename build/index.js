#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("@modelcontextprotocol/sdk/server/index.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const types_js_1 = require("@modelcontextprotocol/sdk/types.js");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Environment variables required for Keka API authentication
const KEKA_CLIENT_ID = process.env.KEKA_CLIENT_ID;
const KEKA_CLIENT_SECRET = process.env.KEKA_CLIENT_SECRET;
const KEKA_REFRESH_TOKEN = process.env.KEKA_REFRESH_TOKEN;
const KEKA_API_BASE_URL = process.env.KEKA_API_BASE_URL || "https://master.kekademo.com/api/v1";
if (!KEKA_CLIENT_ID || !KEKA_CLIENT_SECRET || !KEKA_REFRESH_TOKEN) {
    console.error("Required Keka OAuth credentials not found in environment variables");
    process.exit(1);
}
// Tool definitions for our target 8 tools
const getEmployeeProfileTool = {
    name: "keka_get_employee_profile",
    description: "Get detailed profile information for a specific employee",
    inputSchema: {
        type: "object",
        properties: {
            employee_id: {
                type: "string",
                description: "The UUID of the employee",
            },
        },
        required: ["employee_id"],
    },
};
const getAttendanceTool = {
    name: "keka_get_attendance",
    description: "Get attendance records for an employee within a date range",
    inputSchema: {
        type: "object",
        properties: {
            employee_id: {
                type: "string",
                description: "The UUID of the employee",
            },
            start_date: {
                type: "string",
                description: "Start date in YYYY-MM-DD format",
            },
            end_date: {
                type: "string",
                description: "End date in YYYY-MM-DD format",
            },
            page: {
                type: "number",
                description: "Page number for pagination (default: 1)",
                default: 1,
            },
            page_size: {
                type: "number",
                description: "Number of records per page (default: 100, max: 100)",
                default: 100,
            },
        },
        required: ["employee_id", "start_date", "end_date"],
    },
};
const getLeaveTypesTool = {
    name: "keka_get_leave_types",
    description: "Get the list of available leave types",
    inputSchema: {
        type: "object",
        properties: {},
    },
};
const applyLeaveTool = {
    name: "keka_apply_leave",
    description: "Apply for leave for an employee",
    inputSchema: {
        type: "object",
        properties: {
            employee_id: {
                type: "string",
                description: "The UUID of the employee",
            },
            start_date: {
                type: "string",
                description: "Start date in YYYY-MM-DD format",
            },
            end_date: {
                type: "string",
                description: "End date in YYYY-MM-DD format",
            },
            leave_type: {
                type: "string",
                description: "UUID of the leave type",
            },
            reason: {
                type: "string",
                description: "Reason for applying leave",
            },
        },
        required: ["employee_id", "start_date", "end_date", "leave_type", "reason"],
    },
};
const getLeaveBalancesTool = {
    name: "keka_get_leave_balances",
    description: "Get a consolidated view of all leave balances for an employee",
    inputSchema: {
        type: "object",
        properties: {
            employee_id: {
                type: "string",
                description: "The UUID of the employee",
            },
        },
        required: ["employee_id"],
    },
};
const viewLeaveHistoryTool = {
    name: "keka_view_leave_history",
    description: "View the leave history for an employee",
    inputSchema: {
        type: "object",
        properties: {
            employee_id: {
                type: "string",
                description: "The UUID of the employee",
            },
            start_date: {
                type: "string",
                description: "Filter by start date (YYYY-MM-DD)",
            },
            end_date: {
                type: "string",
                description: "Filter by end date (YYYY-MM-DD)",
            },
            status: {
                type: "string",
                description: "Filter by leave request status",
            },
            page: {
                type: "number",
                description: "Page number for pagination (default: 1)",
                default: 1,
            },
            page_size: {
                type: "number",
                description: "Number of records per page (default: 100)",
                default: 100,
            },
        },
        required: ["employee_id"],
    },
};
const getPayslipTool = {
    name: "keka_get_payslip",
    description: "Get payslip for an employee for a specific month and year",
    inputSchema: {
        type: "object",
        properties: {
            employee_id: {
                type: "string",
                description: "The UUID of the employee",
            },
            month: {
                type: "string",
                description: "Month (1-12)",
            },
            year: {
                type: "string",
                description: "Year (YYYY)",
            },
        },
        required: ["employee_id", "month", "year"],
    },
};
const getUpcomingHolidaysTool = {
    name: "keka_get_upcoming_holidays",
    description: "Get the list of upcoming company holidays",
    inputSchema: {
        type: "object",
        properties: {},
    },
};
class KekaClient {
    accessToken = null;
    clientId;
    clientSecret;
    refreshToken;
    baseUrl;
    constructor(clientId, clientSecret, refreshToken, baseUrl) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.refreshToken = refreshToken;
        this.baseUrl = baseUrl;
    }
    async getAccessToken() {
        if (this.accessToken) {
            return this.accessToken;
        }
        const tokenEndpoint = `${this.baseUrl}/oauth/token`;
        const params = new URLSearchParams();
        params.append("grant_type", "refresh_token");
        params.append("refresh_token", this.refreshToken);
        params.append("client_id", this.clientId);
        params.append("client_secret", this.clientSecret);
        const response = await fetch(tokenEndpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: params.toString(),
        });
        const data = await response.json();
        if (!response.ok || data.error) {
            console.error("Error refreshing token:", data);
            throw new Error(data.error_description || "Failed to refresh access token");
        }
        const accessToken = data.access_token;
        if (!accessToken || typeof accessToken !== "string") {
            throw new Error("No access token returned from Keka OAuth server");
        }
        this.accessToken = accessToken;
        // Consider storing the expiry and refreshing proactively
        return this.accessToken;
    }
    async makeApiRequest(url, method = "GET", body = null) {
        const accessToken = await this.getAccessToken();
        const headers = {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        };
        const config = {
            method,
            headers,
        };
        if (body) {
            config.body = JSON.stringify(body);
        }
        const response = await fetch(url, config);
        if (!response.ok) {
            const errorData = await response.json();
            console.error(`API request failed for ${url} with status ${response.status}:`, errorData);
            throw new Error(errorData.error || errorData.message || `API request failed with status ${response.status}`);
        }
        return await response.json();
    }
    async getEmployeeProfile(employee_id) {
        const url = `${this.baseUrl}/v1/employees/${employee_id}`;
        const response = await this.makeApiRequest(url);
        return response.data;
    }
    async getAttendance(employee_id, start_date, end_date, page = 1, page_size = 100) {
        const params = new URLSearchParams({
            startDate: start_date,
            endDate: end_date,
            page: page.toString(),
            pageSize: Math.min(page_size, 100).toString(),
        });
        const url = `${this.baseUrl}/v1/employees/${employee_id}/attendance?${params}`;
        const response = await this.makeApiRequest(url);
        return response.data;
    }
    async getLeaveTypes() {
        const url = `${this.baseUrl}/v1/leaves/types`;
        const response = await this.makeApiRequest(url);
        return response.data;
    }
    async applyLeave(employee_id, start_date, end_date, leave_type, reason) {
        const url = `${this.baseUrl}/v1/leaves/requests`;
        const body = {
            employeeId: employee_id,
            fromDate: start_date,
            toDate: end_date,
            leaveTypeId: leave_type,
            reason: reason,
        };
        const response = await this.makeApiRequest(url, "POST", body);
        return response.data;
    }
    async getLeaveBalances(employee_id) {
        const params = new URLSearchParams({
            employeeId: employee_id,
        });
        const url = `${this.baseUrl}/v1/leaves/balances?${params}`;
        const response = await this.makeApiRequest(url);
        return response.data;
    }
    async viewLeaveHistory(employee_id, startDate, endDate, status, page = 1, pageSize = 100) {
        const params = new URLSearchParams({
            employeeId: employee_id,
            startDate: startDate || "",
            endDate: endDate || "",
            status: status || "",
            page: page.toString(),
            pageSize: pageSize.toString(),
        });
        const url = `${this.baseUrl}/v1/leaves/requests?${params}`;
        const response = await this.makeApiRequest(url);
        return response.data;
    }
    async getPayslip(employee_id, month, year) {
        const params = new URLSearchParams({
            employeeId: employee_id,
            month: month,
            year: year,
        });
        const url = `${this.baseUrl}/v1/payroll/payslips?${params}`;
        const response = await this.makeApiRequest(url);
        return response.data;
    }
    async getUpcomingHolidays() {
        const url = `${this.baseUrl}/v1/holidays`;
        const response = await this.makeApiRequest(url);
        return response.data;
    }
}
class KekaMcpServer {
    server;
    kekaClient;
    constructor() {
        this.server = new index_js_1.Server({
            name: "keka-mcp-server",
            version: "1.0.0",
        }, {
            capabilities: {
                tools: {},
            },
        });
        const clientId = KEKA_CLIENT_ID;
        const clientSecret = KEKA_CLIENT_SECRET;
        const refreshToken = KEKA_REFRESH_TOKEN;
        const baseUrl = KEKA_API_BASE_URL;
        this.kekaClient = new KekaClient(clientId, clientSecret, refreshToken, baseUrl);
        this.setupToolHandlers();
        this.server.onerror = (error) => console.error("[MCP Error]", error);
        process.on("SIGINT", async () => {
            await this.server.close();
            process.exit(0);
        });
    }
    setupToolHandlers() {
        this.server.setRequestHandler(types_js_1.ListToolsRequestSchema, async () => ({
            tools: [
                getEmployeeProfileTool,
                getAttendanceTool,
                getLeaveTypesTool,
                applyLeaveTool,
                getLeaveBalancesTool,
                viewLeaveHistoryTool,
                getPayslipTool,
                getUpcomingHolidaysTool,
            ],
        }));
        this.server.setRequestHandler(types_js_1.CallToolRequestSchema, async (request) => {
            try {
                if (!request.params.arguments) {
                    throw new types_js_1.McpError(types_js_1.ErrorCode.InvalidParams, "No arguments provided");
                }
                switch (request.params.name) {
                    case "keka_get_employee_profile":
                        return await this.handleGetEmployeeProfile(request.params.arguments);
                    case "keka_get_attendance":
                        return await this.handleGetAttendance(request.params.arguments);
                    case "keka_apply_leave":
                        return await this.handleApplyLeave(request.params.arguments);
                    case "keka_get_leave_balances":
                        return await this.handleGetLeaveBalances(request.params.arguments);
                    case "keka_get_payslip":
                        return await this.handleGetPayslip(request.params.arguments);
                    case "keka_get_upcoming_holidays":
                        return await this.handleGetUpcomingHolidays(request.params.arguments);
                    case "keka_view_leave_history":
                        return await this.handleViewLeaveHistory(request.params.arguments);
                    case "keka_get_leave_types":
                        return await this.handleGetLeaveTypes(request.params.arguments);
                    default:
                        throw new types_js_1.McpError(types_js_1.ErrorCode.MethodNotFound, `Unknown tool: ${request.params.name}`);
                }
            }
            catch (error) {
                return {
                    content: [
                        {
                            type: "text",
                            text: `Error: ${error.message}`,
                        },
                    ],
                    isError: true,
                };
            }
        });
    }
    async handleGetEmployeeProfile(args) {
        try {
            const response = await this.kekaClient.getEmployeeProfile(args.employee_id);
            return { content: [{ type: "text", text: JSON.stringify(response) }] };
        }
        catch (error) {
            return {
                content: [{ type: "text", text: `Error: ${error.message}` }],
                isError: true,
            };
        }
    }
    async handleGetAttendance(args) {
        try {
            const response = await this.kekaClient.getAttendance(args.employee_id, args.start_date, args.end_date, args.page, args.page_size);
            return { content: [{ type: "text", text: JSON.stringify(response) }] };
        }
        catch (error) {
            return {
                content: [{ type: "text", text: `Error: ${error.message}` }],
                isError: true,
            };
        }
    }
    async handleGetLeaveTypes(args) {
        try {
            const response = await this.kekaClient.getLeaveTypes();
            return { content: [{ type: "text", text: JSON.stringify(response) }] };
        }
        catch (error) {
            return {
                content: [{ type: "text", text: `Error: ${error.message}` }],
                isError: true,
            };
        }
    }
    async handleApplyLeave(args) {
        try {
            const response = await this.kekaClient.applyLeave(args.employee_id, args.start_date, args.end_date, args.leave_type, args.reason);
            return { content: [{ type: "text", text: JSON.stringify(response) }] };
        }
        catch (error) {
            return {
                content: [{ type: "text", text: `Error: ${error.message}` }],
                isError: true,
            };
        }
    }
    async handleGetLeaveBalances(args) {
        try {
            const response = await this.kekaClient.getLeaveBalances(args.employee_id);
            return { content: [{ type: "text", text: JSON.stringify(response) }] };
        }
        catch (error) {
            return {
                content: [{ type: "text", text: `Error: ${error.message}` }],
                isError: true,
            };
        }
    }
    async handleViewLeaveHistory(args) {
        try {
            const response = await this.kekaClient.viewLeaveHistory(args.employee_id, args.startDate, args.endDate, args.status, args.page, args.pageSize);
            return { content: [{ type: "text", text: JSON.stringify(response) }] };
        }
        catch (error) {
            return {
                content: [{ type: "text", text: `Error: ${error.message}` }],
                isError: true,
            };
        }
    }
    async handleGetPayslip(args) {
        try {
            const response = await this.kekaClient.getPayslip(args.employee_id, args.month, args.year);
            return { content: [{ type: "text", text: JSON.stringify(response) }] };
        }
        catch (error) {
            return {
                content: [{ type: "text", text: `Error: ${error.message}` }],
                isError: true,
            };
        }
    }
    async handleGetUpcomingHolidays(args) {
        try {
            const response = await this.kekaClient.getUpcomingHolidays();
            return { content: [{ type: "text", text: JSON.stringify(response) }] };
        }
        catch (error) {
            return {
                content: [{ type: "text", text: `Error: ${error.message}` }],
                isError: true,
            };
        }
    }
    async run() {
        const transport = new stdio_js_1.StdioServerTransport();
        await this.server.connect(transport);
        console.error("Keka MCP server running on stdio");
    }
}
const server = new KekaMcpServer();
server.run().catch(console.error);

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequest,
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";

import dotenv from "dotenv";
dotenv.config();

// Type definitions for tool arguments
interface GetEmployeeProfileArgs {
  employee_id: string;
}

interface GetAttendanceArgs {
  employee_id: string;
  start_date: string;
  end_date: string;
  page?: number;
  page_size?: number;
}

interface ApplyLeaveArgs {
  employee_id: string;
  start_date: string;
  end_date: string;
  leave_type: string;
  reason: string;
}

interface GetLeaveBalanceArgs {
  employee_id: string;
}

interface GetPayslipArgs {
  employee_id: string;
  month: string;
  year: string;
}

// New tool argument types
interface GetLeaveTypesArgs {}

interface GetLeaveBalancesArgs {
  employee_id: string;
}

interface ViewLeaveHistoryArgs {
  employee_id: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

interface GetUpcomingHolidaysArgs {}

// Tool definitions for our target 8 tools
const getEmployeeProfileTool: Tool = {
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

const getAttendanceTool: Tool = {
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

const getLeaveTypesTool: Tool = {
  name: "keka_get_leave_types",
  description: "Get the list of available leave types",
  inputSchema: {
    type: "object",
    properties: {},
  },
};

const applyLeaveTool: Tool = {
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

const getLeaveBalancesTool: Tool = {
  name: "keka_leave_balances",
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

const viewLeaveHistoryTool: Tool = {
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

const getPayslipTool: Tool = {
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

const getUpcomingHolidaysTool: Tool = {
  name: "keka_get_upcoming_holidays",
  description: "Get the list of upcoming company holidays",
  inputSchema: {
    type: "object",
    properties: {},
  },
};

// KekaClient class (as you provided)
class KekaClient {
  private apiHeaders: { Authorization: string; "Content-Type": string };
  private baseUrl: string;

  constructor(apiKey: string, baseUrl: string = "https://master.kekademo.com/api/v1") {
    this.apiHeaders = {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    };
    this.baseUrl = baseUrl;
  }

  async getEmployeeProfile(employee_id: string): Promise<any> {
    const response = await fetch(
      `<span class="math-inline">\{this\.baseUrl\}/v1/employees/</span>{employee_id}`,
      {
        method: "GET",
        headers: this.apiHeaders
      }
    );
    return this.handleResponse(response);
  }

  async getAttendance(
    employee_id: string,
    start_date: string,
    end_date: string,
    page: number = 1,
    page_size: number = 100
  ): Promise<any> {
    const params = new URLSearchParams({
      startDate: start_date,
      endDate: end_date,
      page: page.toString(),
      pageSize: Math.min(page_size, 100).toString(),
    });
    const response = await fetch(
      `<span class="math-inline">\{this\.baseUrl\}/v1/employees/</span>{employee_id}/attendance?${params}`,
      {
        method: "GET",
        headers: this.apiHeaders
      }
    );
    return this.handleResponse(response);
  }

  async getLeaveTypes(): Promise<any> {
    const response = await fetch(
      `${this.baseUrl}/v1/leaves/types`,
      {
        method: "GET",
        headers: this.apiHeaders
      }
    );
    return this.handleResponse(response);
  }

  async applyLeave(
    employee_id: string,
    start_date: string,
    end_date: string,
    leave_type: string,
    reason: string
  ): Promise<any> {
    const response = await fetch(`${this.baseUrl}/v1/leaves/requests`, {
      method: "POST",
      headers: this.apiHeaders,
      body: JSON.stringify({
        employeeId: employee_id, // Ensure correct parameter name
        fromDate: start_date,
        toDate: end_date,
        leaveTypeId: leave_type, // Ensure correct parameter name
        reason: reason,
      }),
    });
    return this.handleResponse(response);
  }

  async getLeaveBalances(employee_id: string): Promise<any> {
    const params = new URLSearchParams({
      employeeId: employee_id,
    });
    const response = await fetch(
      `<span class="math-inline">\{this\.baseUrl\}/v1/leaves/balances?</span>{params}`,
      {
        method: "GET",
        headers: this.apiHeaders
      }
    );
    return this.handleResponse(response);
  }

  async viewLeaveHistory(
    employee_id: string,
    startDate?: string,
    endDate?: string,
    status?: string,
    page: number = 1,
    pageSize: number = 100
  ): Promise<any> {
    const params = new URLSearchParams({
      employeeId: employee_id,
      startDate: startDate || "",
      endDate: endDate || "",
      status: status || "",
      page: page.toString(),
      pageSize: pageSize.toString(),
    });
    const response = await fetch(
      `<span class="math-inline">\{this\.baseUrl\}/v1/leaves/requests?</span>{params}`,
      {
        method: "GET",
        headers: this.apiHeaders
      }
    );
    return this.handleResponse(response);
  }

  async getPayslip(
    employee_id: string,
    month: string,
    year: string
  ): Promise<any> {
    const params = new URLSearchParams({
      employeeId: employee_id,
      month: month,
      year: year,
    });
    const response = await fetch(
      `<span class="math-inline">\{this\.baseUrl\}/v1/payroll/payslips?</span>{params}`,
      {
        method: "GET",
        headers: this.apiHeaders
      }
    );
    return this.handleResponse(response);
  }

  async getUpcomingHolidays(): Promise<any> {
    const response = await fetch(
      `${this.baseUrl}/v1/holidays`,
      {
        method: "GET",
        headers: this.apiHeaders
      }
    );
    return this.handleResponse(response);
  }

  private async handleResponse(response: Response): Promise<any> {
    if (response.status === 429) {
      throw new Error("Rate limit exceeded. Please try again after 1 minute.");
    }
    const data = await response.json();
    if (!data.success) { // Adjust based on actual Keka API response structure
      throw new Error(data.error || data.message || "API request failed"); // Adjust error handling
    }
    return data.data; // Assuming the actual data is under a 'data' key
  }
}

async function main() {
  const apiKey = process.env.KEKA_API_KEY;
  const baseUrl = process.env.KEKA_API_BASE_URL || "https://master.kekademo.com/api/v1";

  if (!apiKey) {
    console.error("Please set KEKA_API_KEY environment variable");
    process.exit(1);
  }

  console.error("Starting Keka MCP Server...");
  const server = new Server(
    {
      name: "Keka MCP Server",
      version: "1.0.0",
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  const kekaClient = new KekaClient(apiKey, baseUrl);

  server.setRequestHandler(
    CallToolRequestSchema,
    async (request: CallToolRequest) => {
      console.error("Received CallToolRequest:", request);
      try {
        if (!request.params.arguments) {
          throw new Error("No arguments provided");
        }

        switch (request.params.name) {
          case "keka_get_employee_profile": {
            const args = request.params
              .arguments as unknown as GetEmployeeProfileArgs;
            if (!args.employee_id) {
              throw new Error("Missing required argument: employee_id");
            }
            const response = await kekaClient.getEmployeeProfile(
              args.employee_id
            );
            return {
              content: [{ type: "text", text: JSON.stringify(response) }],
            };
          }

          case "keka_get_attendance": {
            const args = request.params.arguments as unknown as GetAttendanceArgs;
            if (!args.employee_id || !args.start_date || !args.end_date) {
              throw new Error(
                "Missing required arguments: employee_id, start_date, and end_date"
              );
            }
            const response = await kekaClient.getAttendance(
              args.employee_id,
              args.start_date,
              args.end_date,
              args.page,
              args.page_size
            );
            return {
              content: [{ type: "text", text: JSON.stringify(response) }],
            };
          }

          case "keka_get_leave_types": {
            const args = request.params.arguments as unknown as GetLeaveTypesArgs;
            const response = await kekaClient.getLeaveTypes();
            return {
              content: [{ type: "text", text: JSON.stringify(response) }],
            };
          }

          case "keka_apply_leave": {
            const args = request.params.arguments as unknown as ApplyLeaveArgs;
            if (
              !args.employee_id ||
              !args.start_date ||
              !args.end_date ||
              !args.leave_type ||
              !args.reason
            ) {
              throw new Error(
                "Missing required arguments: employee_id, start_date, end_date, leave_type, and reason"
              );
            }
            const response = await kekaClient.applyLeave(
              args.employee_id,
              args.start_date,
              args.end_date,
              args.leave_type,
              args.reason
            );
            return {
              content: [{ type: "text", text: JSON.stringify(response) }],
            };
          }

          case "keka_leave_balances": {
            const args = request.params
              .arguments as unknown as GetLeaveBalancesArgs;
            if (!args.employee_id) {
              throw new Error("Missing required argument: employee_id");
            }
            const response = await kekaClient.getLeaveBalances(args.employee_id);
            return {
              content: [{ type: "text", text: JSON.stringify(response) }],
            };
          }

          case "keka_view_leave_history": {
            const args = request.params
              .arguments as unknown as ViewLeaveHistoryArgs;
            if (!args.employee_id) {
              throw new Error("Missing required argument: employee_id");
            }
            const response = await kekaClient.viewLeaveHistory(
              args.employee_id,
              args.startDate,
              args.endDate,
              args.status,
              args.page,
              args.pageSize
            );
            return {
              content: [{ type: "text", text: JSON.stringify(response) }],
            };
          }

          case "keka_get_payslip": {
            const args = request.params.arguments as unknown as GetPayslipArgs;
            if (!args.employee_id || !args.month || !args.year) {
              throw new Error(
                "Missing required arguments: employee_id, month, and year"
              );
            }
            const response = await kekaClient.getPayslip(
              args.employee_id,
              args.month,
              args.year
            );
            return {
              content: [{ type: "text", text: JSON.stringify(response) }],
            };
          }

          case "keka_get_upcoming_holidays": {
            const args = request.params
              .arguments as unknown as GetUpcomingHolidaysArgs;
            const response = await kekaClient.getUpcomingHolidays();
            return {
              content: [{ type: "text", text: JSON.stringify(response) }],
            };
          }

          default:
            throw new Error(`Unknown tool: ${request.params.name}`);
        }
      } catch (error) {
        console.error("Error executing tool:", error);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                error: error instanceof Error ? error.message : String(error),
              }),
            },
          ],
        };
      }
    }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    console.error("Received ListToolsRequest");
    return {
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
    };
  });

  const transport = new StdioServerTransport();
  console.error("Connecting server to transport...");
  await server.connect(transport);

  console.error("Keka MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
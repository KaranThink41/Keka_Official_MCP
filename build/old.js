"use strict";
// // #!/usr/bin/env node
// // import dotenv from 'dotenv';
// // import { Server } from "@modelcontextprotocol/sdk/server/index.js";
// // import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
// // import {
// //   CallToolRequest,
// //   CallToolRequestSchema,
// //   ListToolsRequestSchema,
// //   Tool,
// // } from "@modelcontextprotocol/sdk/types.js";
// // dotenv.config();
// // // Type definitions for tool arguments
// // interface GetEmployeeProfileArgs {
// //   employee_id: string;
// // }
// // interface GetAttendanceArgs {
// //   employee_id: string;
// //   start_date: string;
// //   end_date: string;
// //   page?: number;
// //   page_size?: number;
// // }
// // interface ApplyLeaveArgs {
// //   employee_id: string;
// //   start_date: string;
// //   end_date: string;
// //   leave_type: string;
// //   reason: string;
// // }
// // interface GetLeaveBalanceArgs {
// //   employee_id: string;
// // }
// // interface GetPayslipArgs {
// //   employee_id: string;
// //   month: string;
// //   year: string;
// // }
// // interface UpdateExitRequestArgs {
// //   employee_id: string;
// //   exit_type: number;
// //   exit_reason: string;
// //   resignation_date: string;
// //   last_working_date: string;
// //   is_ok_to_rehire: boolean;
// //   comments?: string;
// // }
// // // Tool definitions
// // const getEmployeeProfileTool: Tool = {
// //   name: "keka_get_employee_profile",
// //   description: "Get detailed profile information for a specific employee",
// //   inputSchema: {
// //     type: "object",
// //     properties: {
// //       employee_id: {
// //         type: "string",
// //         description: "The UUID of the employee",
// //       },
// //     },
// //     required: ["employee_id"],
// //   },
// // };
// // const getAttendanceTool: Tool = {
// //   name: "keka_get_attendance",
// //   description: "Get attendance records for an employee within a date range",
// //   inputSchema: {
// //     type: "object",
// //     properties: {
// //       employee_id: {
// //         type: "string",
// //         description: "The UUID of the employee",
// //       },
// //       start_date: {
// //         type: "string",
// //         description: "Start date in YYYY-MM-DD format",
// //       },
// //       end_date: {
// //         type: "string",
// //         description: "End date in YYYY-MM-DD format",
// //       },
// //       page: {
// //         type: "number",
// //         description: "Page number for pagination (default: 1)",
// //         default: 1,
// //       },
// //       page_size: {
// //         type: "number",
// //         description: "Number of records per page (default: 100, max: 100)",
// //         default: 100,
// //       },
// //     },
// //     required: ["employee_id", "start_date", "end_date"],
// //   },
// // };
// // const applyLeaveTool: Tool = {
// //   name: "keka_apply_leave",
// //   description: "Apply for leave for an employee",
// //   inputSchema: {
// //     type: "object",
// //     properties: {
// //       employee_id: {
// //         type: "string",
// //         description: "The UUID of the employee",
// //       },
// //       start_date: {
// //         type: "string",
// //         description: "Start date in YYYY-MM-DD format",
// //       },
// //       end_date: {
// //         type: "string",
// //         description: "End date in YYYY-MM-DD format",
// //       },
// //       leave_type: {
// //         type: "string",
// //         description: "Type of leave (UUID of leave type)",
// //       },
// //       reason: {
// //         type: "string",
// //         description: "Reason for applying leave",
// //       },
// //     },
// //     required: ["employee_id", "start_date", "end_date", "leave_type", "reason"],
// //   },
// // };
// // const getLeaveBalanceTool: Tool = {
// //   name: "keka_get_leave_balance",
// //   description: "Get leave balance for an employee",
// //   inputSchema: {
// //     type: "object",
// //     properties: {
// //       employee_id: {
// //         type: "string",
// //         description: "The UUID of the employee",
// //       },
// //     },
// //     required: ["employee_id"],
// //   },
// // };
// // const getPayslipTool: Tool = {
// //   name: "keka_get_payslip",
// //   description: "Get payslip for an employee for a specific month and year",
// //   inputSchema: {
// //     type: "object",
// //     properties: {
// //       employee_id: {
// //         type: "string",
// //         description: "The UUID of the employee",
// //       },
// //       month: {
// //         type: "string",
// //         description: "Month (1-12)",
// //       },
// //       year: {
// //         type: "string",
// //         description: "Year (YYYY)",
// //       },
// //     },
// //     required: ["employee_id", "month", "year"],
// //   },
// // };
// // const updateExitRequestTool: Tool = {
// //   name: "keka_update_exit_request",
// //   description: "Update exit request for an employee",
// //   inputSchema: {
// //     type: "object",
// //     properties: {
// //       employee_id: {
// //         type: "string",
// //         description: "The UUID of the employee",
// //       },
// //       exit_type: {
// //         type: "number",
// //         description: "Type of exit (e.g., 1 for resignation)",
// //       },
// //       exit_reason: {
// //         type: "string",
// //         description: "UUID of the exit reason",
// //       },
// //       resignation_date: {
// //         type: "string",
// //         description: "Resignation date in YYYY-MM-DDT00:00:00 format",
// //       },
// //       last_working_date: {
// //         type: "string",
// //         description: "Last working date in YYYY-MM-DDT00:00:00 format",
// //       },
// //       is_ok_to_rehire: {
// //         type: "boolean",
// //         description: "Whether the employee is eligible for rehire",
// //       },
// //       comments: {
// //         type: "string",
// //         description: "Additional comments",
// //       },
// //     },
// //     required: ["employee_id", "exit_type", "exit_reason", "resignation_date", "last_working_date", "is_ok_to_rehire"],
// //   },
// // };
// // class KekaClient {
// //   private apiHeaders: { Authorization: string; "Content-Type": string };
// //   private baseUrl: string;
// //   constructor(apiKey: string, baseUrl: string = "https://master.kekademo.com/api/v1") {
// //     this.apiHeaders = {
// //       Authorization: `Bearer ${apiKey}`,
// //       "Content-Type": "application/json",
// //     };
// //     this.baseUrl = baseUrl;
// //   }
// //   async getEmployeeProfile(employee_id: string): Promise<any> {
// //     const response = await fetch(
// //       `${this.baseUrl}/hris/employees/${employee_id}`,
// //       { 
// //         method: "GET",
// //         headers: this.apiHeaders 
// //       }
// //     );
// //     return this.handleResponse(response);
// //   }
// //   async getAttendance(
// //     employee_id: string,
// //     start_date: string,
// //     end_date: string,
// //     page: number = 1,
// //     page_size: number = 100
// //   ): Promise<any> {
// //     const params = new URLSearchParams({
// //       startDate: start_date,
// //       endDate: end_date,
// //       page: page.toString(),
// //       pageSize: Math.min(page_size, 100).toString(),
// //     });
// //     const response = await fetch(
// //       `${this.baseUrl}/hris/employees/${employee_id}/attendance?${params}`,
// //       { 
// //         method: "GET",
// //         headers: this.apiHeaders 
// //       }
// //     );
// //     return this.handleResponse(response);
// //   }
// //   async applyLeave(
// //     employee_id: string,
// //     start_date: string,
// //     end_date: string,
// //     leave_type: string,
// //     reason: string
// //   ): Promise<any> {
// //     const response = await fetch(`${this.baseUrl}/hris/employees/${employee_id}/leaves`, {
// //       method: "POST",
// //       headers: this.apiHeaders,
// //       body: JSON.stringify({
// //         leaveTypeId: leave_type,
// //         fromDate: start_date,
// //         toDate: end_date,
// //         reason: reason,
// //       }),
// //     });
// //     return this.handleResponse(response);
// //   }
// //   async getLeaveBalance(employee_id: string): Promise<any> {
// //     const response = await fetch(
// //       `${this.baseUrl}/hris/employees/${employee_id}/leaves/balance`,
// //       { 
// //         method: "GET",
// //         headers: this.apiHeaders 
// //       }
// //     );
// //     return this.handleResponse(response);
// //   }
// //   async getPayslip(
// //     employee_id: string,
// //     month: string,
// //     year: string
// //   ): Promise<any> {
// //     const params = new URLSearchParams({
// //       month,
// //       year,
// //     });
// //     const response = await fetch(
// //       `${this.baseUrl}/payroll/employees/${employee_id}/payslips?${params}`,
// //       { 
// //         method: "GET",
// //         headers: this.apiHeaders 
// //       }
// //     );
// //     return this.handleResponse(response);
// //   }
// //   async updateExitRequest(
// //     employee_id: string,
// //     exit_type: number,
// //     exit_reason: string,
// //     resignation_date: string,
// //     last_working_date: string,
// //     is_ok_to_rehire: boolean,
// //     comments?: string
// //   ): Promise<any> {
// //     const response = await fetch(`${this.baseUrl}/hris/employees/${employee_id}/exitrequest`, {
// //       method: "PUT",
// //       headers: this.apiHeaders,
// //       body: JSON.stringify({
// //         exitType: exit_type,
// //         exitReason: exit_reason,
// //         resignationDate: resignation_date,
// //         lastWorkingDate: last_working_date,
// //         isOkToRehire: is_ok_to_rehire,
// //         comments: comments || "",
// //       }),
// //     });
// //     return this.handleResponse(response);
// //   }
// //   private async handleResponse(response: Response): Promise<any> {
// //     if (response.status === 429) {
// //       throw new Error("Rate limit exceeded. Please try again after 1 minute.");
// //     }
// //     const data = await response.json();
// //     if (!data.succeeded) {
// //       throw new Error(data.message || "API request failed");
// //     }
// //     return data;
// //   }
// // }
// // async function main() {
// //   const apiKey = process.env.KEKA_API_KEY;
// //   const baseUrl = process.env.KEKA_API_BASE_URL || "https://master.kekademo.com/api/v1";
// //   if (!apiKey) {
// //     console.error("Please set KEKA_API_KEY environment variable");
// //     process.exit(1);
// //   }
// //   console.error("Starting Keka MCP Server...");
// //   const server = new Server(
// //     {
// //       name: "Keka MCP Server",
// //       version: "1.0.0",
// //     },
// //     {
// //       capabilities: {
// //         tools: {},
// //       },
// //     }
// //   );
// //   const kekaClient = new KekaClient(apiKey, baseUrl);
// //   server.setRequestHandler(
// //     CallToolRequestSchema,
// //     async (request: CallToolRequest) => {
// //       console.error("Received CallToolRequest:", request);
// //       try {
// //         if (!request.params.arguments) {
// //           throw new Error("No arguments provided");
// //         }
// //         switch (request.params.name) {
// //           case "keka_get_employee_profile": {
// //             const args = request.params
// //               .arguments as unknown as GetEmployeeProfileArgs;
// //             if (!args.employee_id) {
// //               throw new Error("Missing required argument: employee_id");
// //             }
// //             const response = await kekaClient.getEmployeeProfile(
// //               args.employee_id
// //             );
// //             return {
// //               content: [{ type: "text", text: JSON.stringify(response) }],
// //             };
// //           }
// //           case "keka_get_attendance": {
// //             const args = request.params.arguments as unknown as GetAttendanceArgs;
// //             if (!args.employee_id || !args.start_date || !args.end_date) {
// //               throw new Error(
// //                 "Missing required arguments: employee_id, start_date, and end_date"
// //               );
// //             }
// //             const response = await kekaClient.getAttendance(
// //               args.employee_id,
// //               args.start_date,
// //               args.end_date,
// //               args.page,
// //               args.page_size
// //             );
// //             return {
// //               content: [{ type: "text", text: JSON.stringify(response) }],
// //             };
// //           }
// //           case "keka_apply_leave": {
// //             const args = request.params.arguments as unknown as ApplyLeaveArgs;
// //             if (
// //               !args.employee_id ||
// //               !args.start_date ||
// //               !args.end_date ||
// //               !args.leave_type ||
// //               !args.reason
// //             ) {
// //               throw new Error(
// //                 "Missing required arguments: employee_id, start_date, end_date, leave_type, and reason"
// //               );
// //             }
// //             const response = await kekaClient.applyLeave(
// //               args.employee_id,
// //               args.start_date,
// //               args.end_date,
// //               args.leave_type,
// //               args.reason
// //             );
// //             return {
// //               content: [{ type: "text", text: JSON.stringify(response) }],
// //             };
// //           }
// //           case "keka_get_leave_balance": {
// //             const args = request.params
// //               .arguments as unknown as GetLeaveBalanceArgs;
// //             if (!args.employee_id) {
// //               throw new Error("Missing required argument: employee_id");
// //             }
// //             const response = await kekaClient.getLeaveBalance(args.employee_id);
// //             return {
// //               content: [{ type: "text", text: JSON.stringify(response) }],
// //             };
// //           }
// //           case "keka_get_payslip": {
// //             const args = request.params.arguments as unknown as GetPayslipArgs;
// //             if (!args.employee_id || !args.month || !args.year) {
// //               throw new Error(
// //                 "Missing required arguments: employee_id, month, and year"
// //               );
// //             }
// //             const response = await kekaClient.getPayslip(
// //               args.employee_id,
// //               args.month,
// //               args.year
// //             );
// //             return {
// //               content: [{ type: "text", text: JSON.stringify(response) }],
// //             };
// //           }
// //           case "keka_update_exit_request": {
// //             const args = request.params.arguments as unknown as UpdateExitRequestArgs;
// //             if (
// //               !args.employee_id ||
// //               args.exit_type === undefined ||
// //               !args.exit_reason ||
// //               !args.resignation_date ||
// //               !args.last_working_date ||
// //               args.is_ok_to_rehire === undefined
// //             ) {
// //               throw new Error(
// //                 "Missing required arguments for exit request"
// //               );
// //             }
// //             const response = await kekaClient.updateExitRequest(
// //               args.employee_id,
// //               args.exit_type,
// //               args.exit_reason,
// //               args.resignation_date,
// //               args.last_working_date,
// //               args.is_ok_to_rehire,
// //               args.comments
// //             );
// //             return {
// //               content: [{ type: "text", text: JSON.stringify(response) }],
// //             };
// //           }
// //           default:
// //             throw new Error(`Unknown tool: ${request.params.name}`);
// //         }
// //       } catch (error) {
// //         console.error("Error executing tool:", error);
// //         return {
// //           content: [
// //             {
// //               type: "text",
// //               text: JSON.stringify({
// //                 error: error instanceof Error ? error.message : String(error),
// //               }),
// //             },
// //           ],
// //         };
// //       }
// //     }
// //   );
// //   server.setRequestHandler(ListToolsRequestSchema, async () => {
// //     console.error("Received ListToolsRequest");
// //     return {
// //       tools: [
// //         getEmployeeProfileTool,
// //         getAttendanceTool,
// //         applyLeaveTool,
// //         getLeaveBalanceTool,
// //         getPayslipTool,
// //         updateExitRequestTool,
// //       ],
// //     };
// //   });
// //   const transport = new StdioServerTransport();
// //   console.error("Connecting server to transport...");
// //   await server.connect(transport);
// //   console.error("Keka MCP Server running on stdio");
// // }
// // main().catch((error) => {
// //   console.error("Fatal error in main():", error);
// //   process.exit(1);
// // });
// import {config} from 'dotenv';
// import { Server } from "@modelcontextprotocol/sdk/server/index.js";
// import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
// import {
//   CallToolRequest,
//   CallToolRequestSchema,
//   ListToolsRequestSchema,
//   Tool,
// } from "@modelcontextprotocol/sdk/types.js";
// config();
// // Type definitions for tool arguments
// interface GetEmployeeProfileArgs {
//   employee_id: string;
// }
// interface GetAttendanceArgs {
//   employee_id: string;
//   start_date: string;
//   end_date: string;
//   page?: number;
//   page_size?: number;
// }
// interface ApplyLeaveArgs {
//   employee_id: string;
//   start_date: string;
//   end_date: string;
//   leave_type: string;
//   reason: string;
// }
// interface GetLeaveBalanceArgs {
//   employee_id: string;
// }
// interface GetPayslipArgs {
//   employee_id: string;
//   month: string;
//   year: string;
// }
// interface UpdateExitRequestArgs {
//   employee_id: string;
//   exit_type: number;
//   exit_reason: string;
//   resignation_date: string;
//   last_working_date: string;
//   is_ok_to_rehire: boolean;
//   comments?: string;
// }
// // Tool definitions
// const getEmployeeProfileTool: Tool = {
//   name: "keka_get_employee_profile",
//   description: "Get detailed profile information for a specific employee",
//   inputSchema: {
//     type: "object",
//     properties: {
//       employee_id: {
//         type: "string",
//         description: "The UUID of the employee",
//       },
//     },
//     required: ["employee_id"],
//   },
// };
// const getAttendanceTool: Tool = {
//   name: "keka_get_attendance",
//   description: "Get attendance records for an employee within a date range",
//   inputSchema: {
//     type: "object",
//     properties: {
//       employee_id: {
//         type: "string",
//         description: "The UUID of the employee",
//       },
//       start_date: {
//         type: "string",
//         description: "Start date in YYYY-MM-DD format",
//       },
//       end_date: {
//         type: "string",
//         description: "End date in YYYY-MM-DD format",
//       },
//       page: {
//         type: "number",
//         description: "Page number for pagination (default: 1)",
//         default: 1,
//       },
//       page_size: {
//         type: "number",
//         description: "Number of records per page (default: 100, max: 100)",
//         default: 100,
//       },
//     },
//     required: ["employee_id", "start_date", "end_date"],
//   },
// };
// const applyLeaveTool: Tool = {
//   name: "keka_apply_leave",
//   description: "Apply for leave for an employee",
//   inputSchema: {
//     type: "object",
//     properties: {
//       employee_id: {
//         type: "string",
//         description: "The UUID of the employee",
//       },
//       start_date: {
//         type: "string",
//         description: "Start date in YYYY-MM-DD format",
//       },
//       end_date: {
//         type: "string",
//         description: "End date in YYYY-MM-DD format",
//       },
//       leave_type: {
//         type: "string",
//         description: "Type of leave (UUID of leave type)",
//       },
//       reason: {
//         type: "string",
//         description: "Reason for applying leave",
//       },
//     },
//     required: ["employee_id", "start_date", "end_date", "leave_type", "reason"],
//   },
// };
// const getLeaveBalanceTool: Tool = {
//   name: "keka_get_leave_balance",
//   description: "Get leave balance for an employee",
//   inputSchema: {
//     type: "object",
//     properties: {
//       employee_id: {
//         type: "string",
//         description: "The UUID of the employee",
//       },
//     },
//     required: ["employee_id"],
//   },
// };
// const getPayslipTool: Tool = {
//   name: "keka_get_payslip",
//   description: "Get payslip for an employee for a specific month and year",
//   inputSchema: {
//     type: "object",
//     properties: {
//       employee_id: {
//         type: "string",
//         description: "The UUID of the employee",
//       },
//       month: {
//         type: "string",
//         description: "Month (1-12)",
//       },
//       year: {
//         type: "string",
//         description: "Year (YYYY)",
//       },
//     },
//     required: ["employee_id", "month", "year"],
//   },
// };
// const updateExitRequestTool: Tool = {
//   name: "keka_update_exit_request",
//   description: "Update exit request for an employee",
//   inputSchema: {
//     type: "object",
//     properties: {
//       employee_id: {
//         type: "string",
//         description: "The UUID of the employee",
//       },
//       exit_type: {
//         type: "number",
//         description: "Type of exit (e.g., 1 for resignation)",
//       },
//       exit_reason: {
//         type: "string",
//         description: "UUID of the exit reason",
//       },
//       resignation_date: {
//         type: "string",
//         description: "Resignation date in YYYY-MM-DDT00:00:00 format",
//       },
//       last_working_date: {
//         type: "string",
//         description: "Last working date in YYYY-MM-DDT00:00:00 format",
//       },
//       is_ok_to_rehire: {
//         type: "boolean",
//         description: "Whether the employee is eligible for rehire",
//       },
//       comments: {
//         type: "string",
//         description: "Additional comments",
//       },
//     },
//     required: ["employee_id", "exit_type", "exit_reason", "resignation_date", "last_working_date", "is_ok_to_rehire"],
//   },
// };
// // KekaClient class (as you provided)
// class KekaClient {
//   private apiHeaders: { Authorization: string; "Content-Type": string };
//   private baseUrl: string;
//   constructor(apiKey: string, baseUrl: string = "https://master.kekademo.com/api/v1") {
//     this.apiHeaders = {
//       Authorization: `Bearer ${apiKey}`,
//       "Content-Type": "application/json",
//     };
//     this.baseUrl = baseUrl;
//   }
//   async getEmployeeProfile(employee_id: string): Promise<any> {
//     const response = await fetch(
//       `${this.baseUrl}/hris/employees/${employee_id}`,
//       { 
//         method: "GET",
//         headers: this.apiHeaders 
//       }
//     );
//     return this.handleResponse(response);
//   }
//   async getAttendance(
//     employee_id: string,
//     start_date: string,
//     end_date: string,
//     page: number = 1,
//     page_size: number = 100
//   ): Promise<any> {
//     const params = new URLSearchParams({
//       startDate: start_date,
//       endDate: end_date,
//       page: page.toString(),
//       pageSize: Math.min(page_size, 100).toString(),
//     });
//     const response = await fetch(
//       `${this.baseUrl}/hris/employees/${employee_id}/attendance?${params}`,
//       { 
//         method: "GET",
//         headers: this.apiHeaders 
//       }
//     );
//     return this.handleResponse(response);
//   }
//   async applyLeave(
//     employee_id: string,
//     start_date: string,
//     end_date: string,
//     leave_type: string,
//     reason: string
//   ): Promise<any> {
//     const response = await fetch(`${this.baseUrl}/hris/employees/${employee_id}/leaves`, {
//       method: "POST",
//       headers: this.apiHeaders,
//       body: JSON.stringify({
//         leaveTypeId: leave_type,
//         fromDate: start_date,
//         toDate: end_date,
//         reason: reason,
//       }),
//     });
//     return this.handleResponse(response);
//   }
//   async getLeaveBalance(employee_id: string): Promise<any> {
//     const response = await fetch(
//       `${this.baseUrl}/hris/employees/${employee_id}/leaves/balance`,
//       { 
//         method: "GET",
//         headers: this.apiHeaders 
//       }
//     );
//     return this.handleResponse(response);
//   }
//   async getPayslip(
//     employee_id: string,
//     month: string,
//     year: string
//   ): Promise<any> {
//     const params = new URLSearchParams({
//       month,
//       year,
//     });
//     const response = await fetch(
//       `${this.baseUrl}/payroll/employees/${employee_id}/payslips?${params}`,
//       { 
//         method: "GET",
//         headers: this.apiHeaders 
//       }
//     );
//     return this.handleResponse(response);
//   }
//   async updateExitRequest(
//     employee_id: string,
//     exit_type: number,
//     exit_reason: string,
//     resignation_date: string,
//     last_working_date: string,
//     is_ok_to_rehire: boolean,
//     comments?: string
//   ): Promise<any> {
//     const response = await fetch(`${this.baseUrl}/hris/employees/${employee_id}/exitrequest`, {
//       method: "PUT",
//       headers: this.apiHeaders,
//       body: JSON.stringify({
//         exitType: exit_type,
//         exitReason: exit_reason,
//         resignationDate: resignation_date,
//         lastWorkingDate: last_working_date,
//         isOkToRehire: is_ok_to_rehire,
//         comments: comments || "",
//       }),
//     });
//     return this.handleResponse(response);
//   }
//   private async handleResponse(response: Response): Promise<any> {
//     if (response.status === 429) {
//       throw new Error("Rate limit exceeded. Please try again after 1 minute.");
//     }
//     const data = await response.json();
//     if (!data.succeeded) {
//       throw new Error(data.message || "API request failed");
//     }
//     return data;
//   }
// }
// async function main() {
//   const apiKey = process.env.KEKA_API_KEY;
//   const baseUrl = process.env.KEKA_API_BASE_URL || "https://master.kekademo.com/api/v1";
//   if (!apiKey) {
//     console.error("Please set KEKA_API_KEY environment variable");
//     process.exit(1);
//   }
//   console.error("Starting Keka MCP Server...");
//   const server = new Server(
//     {
//       name: "Keka MCP Server",
//       version: "1.0.0",
//     },
//     {
//       capabilities: {
//         tools: {},
//       },
//     }
//   );
//   const kekaClient = new KekaClient(apiKey, baseUrl); // Instantiate KekaClient
//   server.setRequestHandler(
//     CallToolRequestSchema,
//     async (request: CallToolRequest) => {
//       console.error("Received CallToolRequest:", request);
//       try {
//         if (!request.params.arguments) {
//           throw new Error("No arguments provided");
//         }
//         switch (request.params.name) {
//           case "keka_get_employee_profile": {
//             const args = request.params
//               .arguments as unknown as GetEmployeeProfileArgs;
//             if (!args.employee_id) {
//               throw new Error("Missing required argument: employee_id");
//             }
//             const response = await kekaClient.getEmployeeProfile( // Use KekaClient instance
//               args.employee_id
//             );
//             return {
//               content: [{ type: "text", text: JSON.stringify(response) }],
//             };
//           }
//           case "keka_get_attendance": {
//             const args = request.params.arguments as unknown as GetAttendanceArgs;
//             if (!args.employee_id || !args.start_date || !args.end_date) {
//               throw new Error(
//                 "Missing required arguments: employee_id, start_date, and end_date"
//               );
//             }
//             const response = await kekaClient.getAttendance( // Use KekaClient instance
//               args.employee_id,
//               args.start_date,
//               args.end_date,
//               args.page,
//               args.page_size
//             );
//             return {
//               content: [{ type: "text", text: JSON.stringify(response) }],
//             };
//           }
//           case "keka_apply_leave": {
//             const args = request.params.arguments as unknown as ApplyLeaveArgs;
//             if (
//               !args.employee_id ||
//               !args.start_date ||
//               !args.end_date ||
//               !args.leave_type ||
//               !args.reason
//             ) {
//               throw new Error(
//                 "Missing required arguments: employee_id, start_date, end_date, leave_type, and reason"
//               );
//             }
//             const response = await kekaClient.applyLeave( // Use KekaClient instance
//               args.employee_id,
//               args.start_date,
//               args.end_date,
//               args.leave_type,
//               args.reason
//             );
//             return {
//               content: [{ type: "text", text: JSON.stringify(response) }],
//             };
//           }
//           case "keka_get_leave_balance": {
//             const args = request.params
//               .arguments as unknown as GetLeaveBalanceArgs;
//             if (!args.employee_id) {
//               throw new Error("Missing required argument: employee_id");
//             }
//             const response = await kekaClient.getLeaveBalance(args.employee_id); // Use KekaClient instance
//             return {
//               content: [{ type: "text", text: JSON.stringify(response) }],
//             };
//           }
//           case "keka_get_payslip": {
//             const args = request.params.arguments as unknown as GetPayslipArgs;
//             if (!args.employee_id || !args.month || !args.year) {
//               throw new Error(
//                 "Missing required arguments: employee_id, month, and year"
//               );
//             }
//             const response = await kekaClient.getPayslip( // Use KekaClient instance
//               args.employee_id,
//               args.month,
//               args.year
//             );
//             return {
//               content: [{ type: "text", text: JSON.stringify(response) }],
//             };
//           }
//           case "keka_update_exit_request": {
//             const args = request.params.arguments as unknown as UpdateExitRequestArgs;
//             if (
//               !args.employee_id ||
//               args.exit_type === undefined ||
//               !args.exit_reason ||
//               !args.resignation_date ||
//               !args.last_working_date ||
//               args.is_ok_to_rehire === undefined
//             ) {
//               throw new Error(
//                 "Missing required arguments for exit request"
//               );
//             }
//             const response = await kekaClient.updateExitRequest( // Use KekaClient instance
//               args.employee_id,
//               args.exit_type,
//               args.exit_reason,
//               args.resignation_date,
//               args.last_working_date,
//               args.is_ok_to_rehire,
//               args.comments
//             );
//             return {
//               content: [{ type: "text", text: JSON.stringify(response) }],
//             };
//           }
//           default:
//             throw new Error(`Unknown tool: ${request.params.name}`);
//         }
//       } catch (error) {
//         console.error("Error executing tool:", error);
//         return {
//           content: [
//             {
//               type: "text",
//               text: JSON.stringify({
//                 error: error instanceof Error ? error.message : String(error),
//               }),
//             },
//           ],
//         };
//       }
//     }
//   );
//   server.setRequestHandler(ListToolsRequestSchema, async () => {
//     console.error("Received ListToolsRequest");
//     return {
//       tools: [
//         getEmployeeProfileTool,
//         getAttendanceTool,
//         applyLeaveTool,
//         getLeaveBalanceTool,
//         getPayslipTool,
//         updateExitRequestTool,
//       ],
//     };
//   });
//   const transport = new StdioServerTransport();
//   console.error("Connecting server to transport...");
//   await server.connect(transport);
//   console.error("Keka MCP Server running on stdio");
// }
// main().catch((error) => {
//   console.error("Fatal error in main():", error);
//   process.exit(1);
// });

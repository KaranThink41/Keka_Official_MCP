# Keka MCP Server

A Model Context Protocol (MCP) server for integrating with the Keka HR platform. This server exposes Keka employee management, attendance, leave, payslip, and holiday APIs as MCP tools, with robust OAuth2 authentication and modular code structure.

---

## Features
- **OAuth2 Authentication**: Securely connects to Keka using OAuth2 credentials.
- **Tool-based API**: Exposes Keka HR features as MCP tools for easy integration and automation.
- **Modular Structure**: Clean, extensible TypeScript codebase modeled after best practices.
- **Docker Support**: Ready-to-use Dockerfile for containerized deployment.

---

## Environment Variables
Create a `.env` file in the project root with the following:

```
KEKA_CLIENT_ID=your_keka_client_id_here
KEKA_CLIENT_SECRET=your_keka_client_secret_here
KEKA_REFRESH_TOKEN=your_keka_refresh_token_here
# Optional:
KEKA_API_BASE_URL=https://master.kekademo.com/api/v1
```

---

## Available Tools

### 1. `keka_get_employee_profile`
Get detailed profile information for a specific employee.
- **Arguments:**
  - `employee_id` (string, required): The UUID of the employee.
- **Example:**
```json
{
  "employee_id": "EMP123456"
}
```

---

### 2. `keka_get_attendance`
Get attendance records for an employee within a date range.
- **Arguments:**
  - `employee_id` (string, required)
  - `start_date` (string, required, format: YYYY-MM-DD)
  - `end_date` (string, required, format: YYYY-MM-DD)
  - `page` (number, optional, default: 1)
  - `page_size` (number, optional, default: 100)
- **Example:**
```json
{
  "employee_id": "EMP123456",
  "start_date": "2024-01-01",
  "end_date": "2024-01-31",
  "page": 1,
  "page_size": 50
}
```

---

### 3. `keka_apply_leave`
Apply for leave for an employee.
- **Arguments:**
  - `employee_id` (string, required)
  - `start_date` (string, required)
  - `end_date` (string, required)
  - `leave_type` (string, required, leave type UUID)
  - `reason` (string, required)
- **Example:**
```json
{
  "employee_id": "EMP123456",
  "start_date": "2024-04-10",
  "end_date": "2024-04-12",
  "leave_type": "ANNUAL",
  "reason": "Family function"
}
```

---

### 4. `keka_get_leave_balances`
Get a consolidated view of all leave balances for an employee.
- **Arguments:**
  - `employee_id` (string, required)
- **Example:**
```json
{
  "employee_id": "EMP123456"
}
```

---

### 5. `keka_get_payslip`
Get payslip for an employee for a specific month and year.
- **Arguments:**
  - `employee_id` (string, required)
  - `month` (string, required, e.g., "4" for April)
  - `year` (string, required, e.g., "2024")
- **Example:**
```json
{
  "employee_id": "EMP123456",
  "month": "4",
  "year": "2024"
}
```

---

### 6. `keka_get_upcoming_holidays`
Get the list of upcoming company holidays.
- **Arguments:** _none_
- **Example:**
```json
{}
```

---

### 7. `keka_view_leave_history`
View the leave history for an employee.
- **Arguments:**
  - `employee_id` (string, required)
  - `start_date` (string, optional)
  - `end_date` (string, optional)
  - `status` (string, optional)
  - `page` (number, optional, default: 1)
  - `page_size` (number, optional, default: 100)
- **Example:**
```json
{
  "employee_id": "EMP123456",
  "start_date": "2024-01-01",
  "end_date": "2024-04-01",
  "status": "APPROVED",
  "page": 1,
  "page_size": 20
}
```

---

### 8. `keka_get_leave_types`
Get the list of available leave types.
- **Arguments:** _none_
- **Example:**
```json
{}
```

---

## Usage

### Local (Node.js)
1. Install dependencies:
   ```sh
   npm install
   ```
2. Build the TypeScript project:
   ```sh
   npm run build
   ```
3. Start the MCP server:
   ```sh
   node build/index.js
   ```

### Docker
1. Build the Docker image:
   ```sh
   docker build -t keka-mcp .
   ```
2. Run the container (using your .env file):
   ```sh
   docker run --env-file .env keka-mcp
   ```

---

## Project Structure
- `src/index.ts` — Main MCP server implementation, tool definitions, Keka API integration.
- `.env` — Environment variables for Keka OAuth2 credentials.
- `Dockerfile` — Containerization support.
- `package.json` — Project dependencies and scripts.

---

## Contributing
Pull requests and issues are welcome! Please ensure any new tools or features follow the modular handler style and include robust error handling.

---

## License
MIT

---

## Reference
- [Keka API documentation](https://www.keka.com/developer-portal)
- [Model Context Protocol (MCP)](https://smithery.ai/docs/modelcontextprotocol)

---

_This project is generated and maintained with best practices for MCP integrations._

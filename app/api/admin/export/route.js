import { connectToDatabase } from "@/app/utils/mongodb";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

// Force dynamic rendering for API routes
export const dynamic = "force-dynamic";

// Middleware to check authentication
async function checkAuth(request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token");

  if (!token) {
    return false;
  }

  try {
    jwt.verify(token.value, process.env.JWT_SECRET || "fallback-secret");
    return true;
  } catch (error) {
    return false;
  }
}

// Helper function to get date range
function getDateRange(reportType, customStartDate = null, customEndDate = null) {
  const now = new Date();
  let startDate, endDate;

  if (customStartDate && customEndDate) {
    startDate = new Date(customStartDate);
    endDate = new Date(customEndDate);
    endDate.setHours(23, 59, 59, 999);
  } else {
    switch (reportType) {
      case 'daily':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
        break;
      case 'weekly':
        const dayOfWeek = now.getDay();
        const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
        startDate = new Date(now.setDate(diff));
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'monthly':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        break;
      default:
        throw new Error('Invalid report type');
    }
  }

  return { startDate, endDate };
}

// Helper function to format date for display
function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit'
  });
}

// Helper function to format time for display
function formatTime(date) {
  if (!date) return 'N/A';
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}

// Helper function to generate CSV content
function generateCSV(data, headers) {
  const csvHeaders = headers.join(',');
  const csvRows = data.map(row => {
    return headers.map(header => {
      const value = row[header] || '';
      // Escape commas and quotes in CSV
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }).join(',');
  });
  
  return [csvHeaders, ...csvRows].join('\n');
}

// Helper function to generate HTML table for PDF
function generateHTMLTable(data, headers, title, period) {
  const headerRow = headers.map(h => `<th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;">${h}</th>`).join('');
  const dataRows = data.map(row => {
    const cells = headers.map(header => {
      const value = row[header] || '';
      return `<td style="border: 1px solid #ddd; padding: 8px;">${value}</td>`;
    }).join('');
    return `<tr>${cells}</tr>`;
  }).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${title}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; margin-bottom: 20px; }
        .period { text-align: center; color: #666; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { text-align: left; }
        .summary { margin-top: 20px; padding: 15px; background-color: #f9f9f9; border-radius: 5px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${title}</h1>
      </div>
      <div class="period">
        <p><strong>Period:</strong> ${period}</p>
        <p><strong>Generated on:</strong> ${new Date().toLocaleString()}</p>
      </div>
      <table>
        <thead>
          <tr>${headerRow}</tr>
        </thead>
        <tbody>
          ${dataRows}
        </tbody>
      </table>
    </body>
    </html>
  `;
}

// POST - Export reports in various formats
export async function POST(request) {
  if (!(await checkAuth(request))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const {
      reportType,
      format, // 'csv', 'pdf', 'excel'
      startDate,
      endDate,
      employeeId,
      department,
      includeLeaves = false,
      reportTitle
    } = await request.json();

    // Validate required fields
    if (!reportType || !format) {
      return NextResponse.json(
        { message: "Report type and format are required" },
        { status: 400 }
      );
    }

    // Validate format
    if (!['csv', 'pdf', 'excel'].includes(format)) {
      return NextResponse.json(
        { message: "Invalid format. Use: csv, pdf, or excel" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    // Get date range
    const { startDate: rangeStart, endDate: rangeEnd } = getDateRange(
      reportType,
      startDate,
      endDate
    );

    // Build attendance query
    let attendanceQuery = {
      date: {
        $gte: rangeStart,
        $lte: rangeEnd
      }
    };

    // Filter by employee if specified
    if (employeeId) {
      attendanceQuery.employeeId = employeeId;
    }

    // Build employee query for department filtering
    let employeeQuery = {};
    if (department) {
      employeeQuery.department = department;
    }

    // Get employees
    const employees = await db.collection("employees").find(employeeQuery).toArray();
    const employeeMap = new Map(employees.map(emp => [emp._id.toString(), emp]));

    // Filter attendance by department if specified
    if (department) {
      const employeeIds = employees.map(emp => emp._id.toString());
      attendanceQuery.employeeId = { $in: employeeIds };
    }

    // Get attendance records
    const attendanceRecords = await db.collection("attendance")
      .find(attendanceQuery)
      .sort({ date: -1, employeeId: 1 })
      .toArray();

    // Get leave records if requested
    let leaveRecords = [];
    if (includeLeaves) {
      leaveRecords = await db.collection("leaves")
        .find({
          status: 'approved',
          startDate: { $lte: rangeEnd },
          endDate: { $gte: rangeStart }
        })
        .toArray();
    }

    // Prepare data for export
    const exportData = attendanceRecords.map(record => {
      const employee = employeeMap.get(record.employeeId);
      return {
        'Employee Name': employee?.name || 'Unknown',
        'Employee ID': employee?.employeeId || 'N/A',
        'Department': employee?.department || 'Unknown',
        'Designation': employee?.designation || 'Unknown',
        'Date': formatDate(record.date),
        'Clock In': formatTime(record.clockIn),
        'Clock Out': formatTime(record.clockOut),
        'Status': record.status || 'N/A',
        'Hours Worked': record.hoursWorked ? record.hoursWorked.toFixed(2) : '0.00',
        'Overtime Hours': record.overtimeHours ? record.overtimeHours.toFixed(2) : '0.00',
        'Notes': record.notes || ''
      };
    });

    // Add leave data if requested
    if (includeLeaves && leaveRecords.length > 0) {
      const leaveData = leaveRecords.map(leave => {
        const employee = employeeMap.get(leave.employeeId);
        return {
          'Employee Name': employee?.name || 'Unknown',
          'Employee ID': employee?.employeeId || 'N/A',
          'Department': employee?.department || 'Unknown',
          'Designation': employee?.designation || 'Unknown',
          'Date': `${formatDate(leave.startDate)} - ${formatDate(leave.endDate)}`,
          'Clock In': 'LEAVE',
          'Clock Out': 'LEAVE',
          'Status': leave.leaveType.toUpperCase(),
          'Hours Worked': '0.00',
          'Overtime Hours': '0.00',
          'Notes': `${leave.leaveType} leave: ${leave.reason}`
        };
      });
      exportData.push(...leaveData);
    }

    // Sort by date and employee name
    exportData.sort((a, b) => {
      const dateA = new Date(a.Date);
      const dateB = new Date(b.Date);
      if (dateA.getTime() !== dateB.getTime()) {
        return dateB.getTime() - dateA.getTime(); // Newest first
      }
      return a['Employee Name'].localeCompare(b['Employee Name']);
    });

    const headers = [
      'Employee Name', 'Employee ID', 'Department', 'Designation',
      'Date', 'Clock In', 'Clock Out', 'Status',
      'Hours Worked', 'Overtime Hours', 'Notes'
    ];

    const title = reportTitle || `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Attendance Report`;
    const period = `${formatDate(rangeStart)} to ${formatDate(rangeEnd)}`;

    // Generate export based on format
    switch (format) {
      case 'csv':
        const csvContent = generateCSV(exportData, headers);
        const csvBlob = Buffer.from(csvContent, 'utf-8');
        
        return new NextResponse(csvBlob, {
          status: 200,
          headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': `attachment; filename="${title.replace(/\s+/g, '_')}_${formatDate(rangeStart)}_to_${formatDate(rangeEnd)}.csv"`
          }
        });

      case 'pdf':
        // For PDF, we'll return HTML that can be converted to PDF on the frontend
        const htmlContent = generateHTMLTable(exportData, headers, title, period);
        
        return NextResponse.json({
          format: 'pdf',
          title,
          period,
          htmlContent,
          filename: `${title.replace(/\s+/g, '_')}_${formatDate(rangeStart)}_to_${formatDate(rangeEnd)}.pdf`
        });

      case 'excel':
        // For Excel, we'll return structured data that can be processed on the frontend
        const excelData = {
          title,
          period,
          headers,
          data: exportData,
          summary: {
            totalRecords: exportData.length,
            totalEmployees: new Set(exportData.map(row => row['Employee Name'])).size,
            dateRange: period
          }
        };
        
        return NextResponse.json({
          format: 'excel',
          ...excelData,
          filename: `${title.replace(/\s+/g, '_')}_${formatDate(rangeStart)}_to_${formatDate(rangeEnd)}.xlsx`
        });

      default:
        return NextResponse.json(
          { message: "Unsupported export format" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Error exporting report:", error);
    return NextResponse.json(
      { message: "Error exporting report" },
      { status: 500 }
    );
  }
}

// GET - Get export formats and options
export async function GET(request) {
  if (!(await checkAuth(request))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const exportOptions = {
      formats: [
        {
          value: 'csv',
          label: 'CSV (Comma Separated Values)',
          description: 'Simple spreadsheet format compatible with Excel and Google Sheets',
          mimeType: 'text/csv'
        },
        {
          value: 'pdf',
          label: 'PDF (Portable Document Format)',
          description: 'Professional document format for printing and sharing',
          mimeType: 'application/pdf'
        },
        {
          value: 'excel',
          label: 'Excel (XLSX)',
          description: 'Microsoft Excel format with advanced formatting',
          mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
      ],
      reportTypes: [
        { value: 'daily', label: 'Daily Report' },
        { value: 'weekly', label: 'Weekly Report' },
        { value: 'monthly', label: 'Monthly Report' },
        { value: 'custom', label: 'Custom Date Range' }
      ],
      options: {
        includeLeaves: {
          label: 'Include Leave Records',
          description: 'Add approved leave records to the report',
          default: false
        },
        filterByEmployee: {
          label: 'Filter by Employee',
          description: 'Generate report for specific employee only',
          default: false
        },
        filterByDepartment: {
          label: 'Filter by Department',
          description: 'Generate report for specific department only',
          default: false
        }
      }
    };

    return NextResponse.json(exportOptions);
  } catch (error) {
    console.error("Error getting export options:", error);
    return NextResponse.json(
      { message: "Error getting export options" },
      { status: 500 }
    );
  }
}
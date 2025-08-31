"use client";

import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import jsPDF from "jspdf";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import * as XLSX from "xlsx";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

export default function HumanResourcePage() {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [employeeStats, setEmployeeStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard"); // dashboard, employees, attendance, leaves, reports, overview
  const [statsPeriod, setStatsPeriod] = useState("month"); // today, week, month, year
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);
  const [showClockForm, setShowClockForm] = useState(false);
  const [showLeaveForm, setShowLeaveForm] = useState(false);
  const [showManualTimeForm, setShowManualTimeForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [clockAction, setClockAction] = useState("in"); // in or out
  const [clockTime, setClockTime] = useState(
    new Date().toTimeString().slice(0, 5)
  );
  const [editingAttendance, setEditingAttendance] = useState(null);
  const [showEditAttendanceForm, setShowEditAttendanceForm] = useState(false);
  const [editAttendanceData, setEditAttendanceData] = useState({
    clockIn: "",
    clockOut: "",
    status: "on time",
  }); // HH:MM format
  
  // Reports Edit/Delete State
  const [showReportEditForm, setShowReportEditForm] = useState(false);
  const [editingReportRecord, setEditingReportRecord] = useState(null);
  const [reportEditData, setReportEditData] = useState({
    clockIn: "",
    clockOut: "",
    status: "on time",
    description: "",
    projectName: ""
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);

  // Individual Employee Reports State
  const [selectedEmployeeForReport, setSelectedEmployeeForReport] =
    useState("");
  const [reportPeriod, setReportPeriod] = useState("monthly"); // daily, weekly, monthly
  const [employeeReportData, setEmployeeReportData] = useState(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportType, setReportType] = useState("daily"); // daily, weekly, monthly
  const [reportDate, setReportDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [employeeFormData, setEmployeeFormData] = useState({
    name: "",
    employeeId: "",
    department: "",
    designation: "",
    email: "",
    phone: "",
    address: "",
    workSchedule: "9:00-17:00",
    joinDate: new Date().toISOString().split("T")[0],
    isIntern: false,
  });

  const [leaveFormData, setLeaveFormData] = useState({
    employeeId: "",
    leaveType: "sick", // sick, casual
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
    reason: "",
  });

  const [manualTimeFormData, setManualTimeFormData] = useState({
    employeeId: "",
    date: new Date().toISOString().split("T")[0],
    clockIn: "09:00",
    clockOut: "17:00",
    breakDuration: 60, // minutes
    reason: "",
    notes: "",
  });

  const [bulkTimeEntry, setBulkTimeEntry] = useState({
    isBulkMode: false,
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
    employeeId: "",
    reason: "",
    notes: "",
    dateEntries: [] // Array of {date, clockIn, clockOut, breakDuration}
  });

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const router = useRouter();

  useEffect(() => {
    checkAuth();
    loadData();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/admin/hr-auth-check");
      if (!response.ok) {
        router.push("/admin/human-resource/login");
        return;
      }
    } catch (error) {
      router.push("/admin/human-resource/login");
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      console.log('HR Page: Starting to load data...');
      
      // Load employees, attendance, and leaves data
      const [employeesRes, attendanceRes, leavesRes] = await Promise.all([
        fetch("/api/admin/employees"),
        fetch("/api/admin/attendance"),
        fetch("/api/admin/leaves"),
      ]);

      console.log('HR Page: API responses received', {
        employees: employeesRes.status,
        attendance: attendanceRes.status,
        leaves: leavesRes.status
      });

      if (employeesRes.ok) {
        const employeesData = await employeesRes.json();
        setEmployees(employeesData);
        console.log('HR Page: Employees loaded successfully', employeesData.length, 'employees');
      } else {
        console.error('HR Page: Failed to load employees', employeesRes.status, employeesRes.statusText);
      }

      if (attendanceRes.ok) {
        const attendanceData = await attendanceRes.json();
        setAttendance(attendanceData);
        console.log('HR Page: Attendance loaded successfully', attendanceData.length, 'records');
      } else {
        console.error('HR Page: Failed to load attendance', attendanceRes.status, attendanceRes.statusText);
      }

      if (leavesRes.ok) {
        const leavesData = await leavesRes.json();
        setLeaves(leavesData);
        console.log('HR Page: Leaves loaded successfully', leavesData.length, 'records');
      } else {
        console.error('HR Page: Failed to load leaves', leavesRes.status, leavesRes.statusText);
      }
    } catch (error) {
      console.error("HR Page: Error loading data:", error);
    } finally {
      setLoading(false);
      console.log('HR Page: Data loading completed');
    }
  };

  const loadEmployeeStats = async () => {
    try {
      setStatsLoading(true);
      const params = new URLSearchParams({
        period: statsPeriod,
        ...(selectedDepartment && { department: selectedDepartment }),
      });

      const response = await fetch(`/api/admin/employee-stats?${params}`);
      if (response.ok) {
        const statsData = await response.json();
        setEmployeeStats(statsData);
      } else {
        showToast("Error loading employee statistics", "error");
      }
    } catch (error) {
      console.error("Error loading employee stats:", error);
      showToast("Error loading employee statistics", "error");
    } finally {
      setStatsLoading(false);
    }
  };

  // Load stats when tab changes to overview or filters change
  useEffect(() => {
    if (activeTab === "overview") {
      loadEmployeeStats();
    }
  }, [activeTab, statsPeriod, selectedDepartment]);

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(
      () => setToast({ show: false, message: "", type: "success" }),
      3000
    );
  };

  // Employee Management Functions
  const handleEmployeeSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingEmployee
        ? `/api/admin/employees/${editingEmployee._id}`
        : "/api/admin/employees";
      const method = editingEmployee ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(employeeFormData),
      });

      if (response.ok) {
        showToast(
          editingEmployee
            ? "Employee updated successfully"
            : "Employee added successfully"
        );
        setShowEmployeeForm(false);
        setEditingEmployee(null);
        resetEmployeeForm();
        loadData();
      } else {
        const error = await response.json();
        showToast(error.message || "Error saving employee", "error");
      }
    } catch (error) {
      showToast("Error saving employee", "error");
    }
  };

  const handleDeleteEmployee = async (id) => {
    if (!confirm("Are you sure you want to delete this employee?")) return;

    try {
      const response = await fetch(`/api/admin/employees/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        showToast("Employee deleted successfully");
        loadData();
      } else {
        showToast("Error deleting employee", "error");
      }
    } catch (error) {
      showToast("Error deleting employee", "error");
    }
  };

  const resetEmployeeForm = () => {
    setEmployeeFormData({
      name: "",
      employeeId: "",
      department: "",
      designation: "",
      email: "",
      phone: "",
      address: "",
      workSchedule: "9:00-17:00",
      joinDate: new Date().toISOString().split("T")[0],
      isIntern: false,
    });
  };

  // Clock In/Out Functions
  const handleClockSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create timestamp with custom time
      const today = new Date();
      const [hours, minutes] = clockTime.split(":");
      const customDateTime = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        parseInt(hours),
        parseInt(minutes)
      );

      const response = await fetch("/api/admin/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId: selectedEmployee,
          action: clockAction,
          timestamp: customDateTime.toISOString(),
        }),
      });

      if (response.ok) {
        showToast(`Clock ${clockAction} recorded successfully`);
        setShowClockForm(false);
        setSelectedEmployee("");
        setClockAction("in");
        setClockTime(new Date().toTimeString().slice(0, 5));
        loadData();
      } else {
        const error = await response.json();
        showToast(error.message || "Error recording clock action", "error");
      }
    } catch (error) {
      showToast("Error recording clock action", "error");
    }
  };

  // Edit Attendance Functions
  const handleEditAttendance = (record) => {
    console.log("handleEditAttendance called with record:", record);
    setEditingAttendance(record);
    setEditAttendanceData({
      clockIn: record.clockIn
        ? new Date(record.clockIn).toTimeString().slice(0, 5)
        : "",
      clockOut: record.clockOut
        ? new Date(record.clockOut).toTimeString().slice(0, 5)
        : "",
      status: record.status,
    });
    setShowEditAttendanceForm(true);
    console.log("Edit form should now be visible");
  };

  const handleEditAttendanceSubmit = async (e) => {
    e.preventDefault();

    console.log("Frontend - editingAttendance:", editingAttendance);
    console.log("Frontend - editAttendanceData:", editAttendanceData);

    try {
      const today = new Date(editingAttendance.date);
      let clockInDateTime = null;
      let clockOutDateTime = null;

      if (editAttendanceData.clockIn) {
        const [inHours, inMinutes] = editAttendanceData.clockIn.split(":");
        clockInDateTime = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          parseInt(inHours),
          parseInt(inMinutes)
        );
      }

      if (editAttendanceData.clockOut) {
        const [outHours, outMinutes] = editAttendanceData.clockOut.split(":");
        clockOutDateTime = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          parseInt(outHours),
          parseInt(outMinutes)
        );
      }

      const requestData = {
        employeeId: editingAttendance.employeeId,
        date: editingAttendance.date,
        clockIn: clockInDateTime ? clockInDateTime.toISOString() : null,
        clockOut: clockOutDateTime ? clockOutDateTime.toISOString() : null,
        status: editAttendanceData.status,
      };

      console.log("Frontend - sending request data:", requestData);

      const response = await fetch("/api/admin/attendance", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        showToast("Attendance record updated successfully!");
        setShowEditAttendanceForm(false);
        setEditingAttendance(null);
        setEditAttendanceData({ clockIn: "", clockOut: "", status: "on time" });
        loadData();
      } else {
        const error = await response.json();
        showToast(error.message || "Error updating attendance", "error");
      }
    } catch (error) {
      showToast("Error updating attendance", "error");
    }
  };

  // Leave Management Functions
  const handleLeaveSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/admin/leaves", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leaveFormData),
      });

      if (response.ok) {
        showToast("Leave request submitted successfully");
        setShowLeaveForm(false);
        setLeaveFormData({
          employeeId: "",
          leaveType: "sick",
          startDate: new Date().toISOString().split("T")[0],
          endDate: new Date().toISOString().split("T")[0],
          reason: "",
        });
        loadData();
      } else {
        const error = await response.json();
        showToast(error.message || "Error submitting leave request", "error");
      }
    } catch (error) {
      showToast("Error submitting leave request", "error");
    }
  };

  // Manual Time Entry Functions
  const handleManualTimeSubmit = async (e) => {
    e.preventDefault();
    try {
      // Map form data to API expected format
      const apiData = {
        employeeId: manualTimeFormData.employeeId,
        date: manualTimeFormData.date,
        startTime: manualTimeFormData.clockIn, // Send time as HH:MM format
        endTime: manualTimeFormData.clockOut,  // Send time as HH:MM format
        description: manualTimeFormData.reason || manualTimeFormData.notes || '',
        projectName: '' // Add if needed
      };

      console.log('Submitting manual time entry:', apiData);

      const response = await fetch("/api/admin/manual-time", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiData),
      });

      if (response.ok) {
        showToast("Manual time entry added successfully");
        setShowManualTimeForm(false);
        resetManualTimeForm();
        loadData();
      } else {
        const error = await response.json();
        console.error('API Error:', error);
        showToast(error.message || "Error adding manual time entry", "error");
      }
    } catch (error) {
      console.error('Network Error:', error);
      showToast("Network error. Please try again.", "error");
    }
  };

  const handleBulkTimeSubmit = async (e) => {
    e.preventDefault();
    try {
      let successCount = 0;
      let errorCount = 0;
      const errors = [];

      for (const entry of bulkTimeEntry.dateEntries) {
        try {
          const apiData = {
            employeeId: bulkTimeEntry.employeeId,
            date: entry.date,
            startTime: entry.clockIn, // Send time as HH:MM format
            endTime: entry.clockOut,  // Send time as HH:MM format
            description: bulkTimeEntry.reason || bulkTimeEntry.notes || '',
            projectName: ''
          };

          const response = await fetch("/api/admin/manual-time", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(apiData),
          });

          if (response.ok) {
            successCount++;
          } else {
            const error = await response.json();
            errors.push(`${entry.date}: ${error.message || 'Unknown error'}`);
            errorCount++;
          }
        } catch (entryError) {
          errors.push(`${entry.date}: Network error`);
          errorCount++;
        }
      }

      if (successCount > 0) {
        showToast(`Successfully added ${successCount} time entries`);
        setShowManualTimeForm(false);
        resetBulkTimeForm();
        loadData();
      }
      
      if (errorCount > 0) {
        showToast(`${errorCount} entries failed. ${errors.slice(0, 3).join(', ')}${errors.length > 3 ? '...' : ''}`, "error");
      }
    } catch (error) {
      console.error('Bulk submission error:', error);
      showToast("Error submitting bulk entries. Please try again.", "error");
    }
  };

  const resetManualTimeForm = () => {
    setManualTimeFormData({
      employeeId: "",
      date: new Date().toISOString().split("T")[0],
      clockIn: "09:00",
      clockOut: "17:00",
      breakDuration: 60,
      reason: "",
      notes: "",
    });
  };

  const resetBulkTimeForm = () => {
    setBulkTimeEntry({
      isBulkMode: false,
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date().toISOString().split("T")[0],
      employeeId: "",
      reason: "",
      notes: "",
      dateEntries: []
    });
  };

  const generateDateEntries = (startDate, endDate) => {
    const entries = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      entries.push({
        date: date.toISOString().split('T')[0],
        clockIn: "09:00",
        clockOut: "17:00",
        breakDuration: 60
      });
    }
    
    return entries;
  };

  const handleBulkModeToggle = () => {
    const newBulkMode = !bulkTimeEntry.isBulkMode;
    setBulkTimeEntry(prev => ({
      ...prev,
      isBulkMode: newBulkMode,
      dateEntries: newBulkMode ? generateDateEntries(prev.startDate, prev.endDate) : []
    }));
  };

  const handleDateRangeChange = (field, value) => {
    setBulkTimeEntry(prev => {
      const updated = { ...prev, [field]: value };
      if (field === 'startDate' || field === 'endDate') {
        updated.dateEntries = generateDateEntries(updated.startDate, updated.endDate);
      }
      return updated;
    });
  };

  const updateDateEntry = (index, field, value) => {
    setBulkTimeEntry(prev => ({
      ...prev,
      dateEntries: prev.dateEntries.map((entry, i) => 
        i === index ? { ...entry, [field]: value } : entry
      )
    }));
  };

  // Update attendance status from 'present' to 'on time'
  const updateAttendanceStatus = async () => {
    try {
      const response = await fetch("/api/admin/update-attendance-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const result = await response.json();
        showToast(
          `Updated ${result.modifiedCount} attendance records successfully!`
        );
        loadData(); // Reload data to reflect changes
      } else {
        const error = await response.json();
        showToast(
          error.message || "Error updating attendance records",
          "error"
        );
      }
    } catch (error) {
      console.error("Error updating attendance status:", error);
      showToast("Error updating attendance records", "error");
    }
  };

  // Handle individual attendance status change
  const handleAttendanceStatusChange = async (employeeId, newStatus) => {
    try {
      const today = new Date().toISOString().split("T")[0];

      // Check if attendance record exists for today
      const todayAttendance = attendance.find(
        (record) =>
          record.employeeId === employeeId &&
          new Date(record.date).toDateString() === new Date().toDateString()
      );

      let response;

      if (todayAttendance) {
        // Update existing record
        response = await fetch("/api/admin/attendance", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            employeeId,
            date: today,
            status: newStatus,
          }),
        });
      } else {
        // For new records, we need to use the clock-in format that the API expects
        if (newStatus === "absent" || newStatus === "off day") {
          // For absent status and off day, create a manual attendance record
          response = await fetch("/api/admin/attendance/manual", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              employeeId,
              date: today,
              status: newStatus,
            }),
          });
        } else {
          // For other statuses, simulate a clock-in action
          response = await fetch("/api/admin/attendance", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              employeeId,
              action: "in",
              timestamp: new Date().toISOString(),
            }),
          });

          // If successful and we need to set a specific status, update it
          if (response.ok && newStatus !== "on time") {
            response = await fetch("/api/admin/attendance", {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                employeeId,
                date: today,
                status: newStatus,
              }),
            });
          }
        }
      }

      if (response.ok) {
        showToast(`Attendance status updated to ${newStatus}!`);
        loadData(); // Reload data to reflect changes
      } else {
        const error = await response.json();
        showToast(error.message || "Error updating attendance status", "error");
      }
    } catch (error) {
      console.error("Error updating attendance status:", error);
      showToast("Error updating attendance status", "error");
    }
  };

  // Manual Clock In/Out Functions
  const handleManualClockIn = async (employeeId) => {
    try {
      const response = await fetch("/api/admin/attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employeeId: employeeId,
          action: "in",
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        showToast("Employee clocked in successfully!");
        loadData(); // Reload data to reflect changes
      } else {
        const error = await response.json();
        showToast(error.message || "Error clocking in employee", "error");
      }
    } catch (error) {
      console.error("Error clocking in employee:", error);
      showToast("Error clocking in employee", "error");
    }
  };

  const handleManualClockOut = async (employeeId) => {
    try {
      const response = await fetch("/api/admin/attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employeeId: employeeId,
          action: "out",
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        showToast("Employee clocked out successfully!");
        loadData(); // Reload data to reflect changes
      } else {
        const error = await response.json();
        showToast(error.message || "Error clocking out employee", "error");
      }
    } catch (error) {
      console.error("Error clocking out employee:", error);
      showToast("Error clocking out employee", "error");
    }
  };

  // Undo Attendance Function
  const handleUndoAttendance = async (employeeId, attendanceRecord) => {
    console.log("Undo button clicked for:", { employeeId, attendanceRecord });
    console.log(
      "Attendance record date type:",
      typeof attendanceRecord.date,
      attendanceRecord.date
    );

    try {
      const requestBody = {
        employeeId: employeeId,
        date: attendanceRecord.date,
      };
      console.log("Sending DELETE request with:", requestBody);

      const response = await fetch("/api/admin/attendance", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      console.log("Response status:", response.status);

      if (response.ok) {
        const result = await response.json();
        console.log("Delete successful:", result);
        showToast("Attendance record restored to previous state!");
        loadData(); // Reload data to reflect changes
      } else {
        const error = await response.json();
        console.log("Delete failed:", error);
        showToast(
          error.message || "Error restoring attendance record",
          "error"
        );
      }
    } catch (error) {
      console.error("Error restoring attendance record:", error);
      showToast("Error restoring attendance record", "error");
    }
  };

  // Reports Edit/Delete Functions
  const handleReportRecordEdit = (record) => {
    setEditingReportRecord(record);
    setReportEditData({
      clockIn: record.clockIn
        ? new Date(record.clockIn).toLocaleTimeString('en-GB', { hour12: false, hour: '2-digit', minute: '2-digit' })
        : "",
      clockOut: record.clockOut
        ? new Date(record.clockOut).toLocaleTimeString('en-GB', { hour12: false, hour: '2-digit', minute: '2-digit' })
        : "",
      status: record.status || "on time",
      description: record.description || "",
      projectName: record.projectName || ""
    });
    setShowReportEditForm(true);
  };

  const handleReportRecordDelete = (record) => {
    console.log("Deleting report record:", record);
    setRecordToDelete(record);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteRecord = async () => {
    if (!recordToDelete) return;

    try {
      let response;
      
      if (recordToDelete.entryType === 'manual') {
        // Delete manual time entry
        response = await fetch(`/api/admin/manual-time?id=${recordToDelete._id}`, {
          method: "DELETE"
        });
      } else {
        // Delete regular attendance record
        response = await fetch("/api/admin/attendance", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            employeeId: recordToDelete.employeeId || selectedEmployeeForReport,
            date: recordToDelete.date,
          }),
        });
      }

      if (response.ok) {
        showToast("Record deleted successfully!");
        // Refresh the employee report data
        if (selectedEmployeeForReport) {
          fetchEmployeeReportData(selectedEmployeeForReport, reportPeriod);
        }
        loadData(); // Also refresh main data
      } else {
        const error = await response.json();
        showToast(error.message || "Error deleting record", "error");
      }
    } catch (error) {
      console.error("Error deleting record:", error);
      showToast("Error deleting record", "error");
    } finally {
      setShowDeleteConfirm(false);
      setRecordToDelete(null);
    }
  };

  const handleReportEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingReportRecord) return;

    try {
      let response;
      
      if (editingReportRecord.entryType === 'manual') {
        // Update manual time entry
        const recordDate = new Date(editingReportRecord.date);
        const dateString = recordDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
        
        const updateData = {
          id: editingReportRecord._id,
          employeeId: editingReportRecord.employeeId || selectedEmployeeForReport,
          date: dateString,
          startTime: reportEditData.clockIn || null,
          endTime: reportEditData.clockOut || null,
          description: reportEditData.description,
          projectName: reportEditData.projectName
        };
        
        response = await fetch("/api/admin/manual-time", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        });
      } else {
        // Update regular attendance record
        const recordDate = new Date(editingReportRecord.date);
        let clockInDateTime = null;
        let clockOutDateTime = null;

        if (reportEditData.clockIn) {
          const [inHours, inMinutes] = reportEditData.clockIn.split(":");
          clockInDateTime = new Date(
            recordDate.getFullYear(),
            recordDate.getMonth(),
            recordDate.getDate(),
            parseInt(inHours),
            parseInt(inMinutes)
          );
        }

        if (reportEditData.clockOut) {
          const [outHours, outMinutes] = reportEditData.clockOut.split(":");
          clockOutDateTime = new Date(
            recordDate.getFullYear(),
            recordDate.getMonth(),
            recordDate.getDate(),
            parseInt(outHours),
            parseInt(outMinutes)
          );
        }

        const requestData = {
          employeeId: editingReportRecord.employeeId || selectedEmployeeForReport,
          date: editingReportRecord.date,
          clockIn: clockInDateTime ? clockInDateTime.toISOString() : null,
          clockOut: clockOutDateTime ? clockOutDateTime.toISOString() : null,
          status: reportEditData.status,
        };
        
        console.log('Regular attendance update data:', requestData);

        response = await fetch("/api/admin/attendance", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        });
      }

      if (response.ok) {
        showToast("Record updated successfully!");
        setShowReportEditForm(false);
        setEditingReportRecord(null);
        // Refresh the employee report data
        if (selectedEmployeeForReport) {
          fetchEmployeeReportData(selectedEmployeeForReport, reportPeriod);
        }
        loadData(); // Also refresh main data
      } else {
        const error = await response.json();
        showToast(error.message || "Error updating record", "error");
      }
    } catch (error) {
      console.error("Error updating record:", error);
      showToast("Error updating record", "error");
    }
  };

  // Individual Employee Report Functions
  const fetchEmployeeReportData = async (employeeId, period) => {
    if (!employeeId) return;

    setReportLoading(true);
    try {
      const response = await fetch(
        `/api/admin/employee-reports/${employeeId}?period=${period}`
      );
      if (response.ok) {
        const data = await response.json();
        setEmployeeReportData(data);
      } else {
        console.error("Failed to fetch employee report data");
        setEmployeeReportData(null);
      }
    } catch (error) {
      console.error("Error fetching employee report data:", error);
      setEmployeeReportData(null);
    } finally {
      setReportLoading(false);
    }
  };

  // Handle employee selection change
  const handleEmployeeReportChange = (employeeId) => {
    setSelectedEmployeeForReport(employeeId);
    if (employeeId) {
      fetchEmployeeReportData(employeeId, reportPeriod);
    } else {
      setEmployeeReportData(null);
    }
  };

  // Handle period change
  const handleReportPeriodChange = (period) => {
    setReportPeriod(period);
    if (selectedEmployeeForReport) {
      fetchEmployeeReportData(selectedEmployeeForReport, period);
    }
  };

  // Report Generation Functions
  const generateReport = () => {
    const reportData = getReportData();
    return reportData;
  };

  const getReportData = () => {
    const today = new Date(reportDate);
    let filteredAttendance = [];

    switch (reportType) {
      case "daily":
        filteredAttendance = attendance.filter(
          (record) =>
            new Date(record.date).toDateString() === today.toDateString()
        );
        break;
      case "weekly":
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        filteredAttendance = attendance.filter((record) => {
          const recordDate = new Date(record.date);
          return recordDate >= weekStart && recordDate <= weekEnd;
        });
        break;
      case "monthly":
        filteredAttendance = attendance.filter((record) => {
          const recordDate = new Date(record.date);
          return (
            recordDate.getMonth() === today.getMonth() &&
            recordDate.getFullYear() === today.getFullYear()
          );
        });
        break;
    }

    return filteredAttendance;
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const reportData = generateReport();

    doc.setFontSize(20);
    doc.text(
      `${
        reportType.charAt(0).toUpperCase() + reportType.slice(1)
      } Attendance Report`,
      20,
      20
    );
    doc.setFontSize(12);
    doc.text(`Date: ${reportDate}`, 20, 35);

    let yPosition = 50;
    reportData.forEach((record, index) => {
      const employee = employees.find((emp) => emp._id === record.employeeId);
      const employeeName = employee ? employee.name : "Unknown";

      doc.text(
        `${employeeName} - ${record.status} - ${new Date(
          record.clockIn || record.date
        ).toLocaleString()}`,
        20,
        yPosition
      );
      yPosition += 10;

      if (yPosition > 280) {
        doc.addPage();
        yPosition = 20;
      }
    });

    doc.save(`attendance-report-${reportType}-${reportDate}.pdf`);
    showToast("PDF report generated successfully");
  };

  const exportToExcel = () => {
    const reportData = generateReport();
    const excelData = reportData.map((record) => {
      const employee = employees.find((emp) => emp._id === record.employeeId);
      return {
        "Employee Name": employee ? employee.name : "Unknown",
        "Employee ID": employee ? employee.employeeId : "Unknown",
        Date: new Date(record.date).toLocaleDateString(),
        Status: record.status,
        "Clock In": record.clockIn
          ? new Date(record.clockIn).toLocaleTimeString()
          : "N/A",
        "Clock Out": record.clockOut
          ? new Date(record.clockOut).toLocaleTimeString()
          : "N/A",
        "Overtime Hours": record.overtimeHours || 0,
      };
    });

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Attendance Report");
    XLSX.writeFile(wb, `attendance-report-${reportType}-${reportDate}.xlsx`);
    showToast("Excel report generated successfully");
  };

  // Get today's attendance summary
  const getTodayStats = () => {
    const today = new Date().toDateString();
    const todayAttendance = attendance.filter(
      (record) => new Date(record.date).toDateString() === today
    );

    // Get unique employee IDs who have attendance records today
    const presentEmployeeIds = new Set(
      todayAttendance.map((record) => record.employeeId)
    );

    const onTime = todayAttendance.filter(
      (record) => record.status === "on time"
    ).length;
    const late = todayAttendance.filter(
      (record) => record.status === "late"
    ).length;
    const absent = Math.max(0, employees.length - presentEmployeeIds.size);

    return { onTime, absent, late, total: employees.length };
  };

  const stats = getTodayStats();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading HR Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Toast Notification */}
      {toast.show && (
        <div
          className={`position-fixed top-0 end-0 m-3 p-3 rounded shadow-sm ${
            toast.type === "success" ? "bg-success text-white" : "text-white"
          }`}
          style={{
            zIndex: 9999,
            minWidth: "300px",
            backgroundColor: toast.type === "success" ? undefined : "#245e99",
          }}
        >
          <div className="d-flex align-items-center">
            <i
              className={`bi me-2 ${
                toast.type === "success"
                  ? "bi-check-circle"
                  : "bi-exclamation-circle"
              }`}
            ></i>
            <span>{toast.message}</span>
            <button
              type="button"
              className="btn-close btn-close-white ms-auto"
              onClick={() =>
                setToast({ show: false, message: "", type: "success" })
              }
            ></button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3 gap-2">
        <h1 className="h3 mb-0 text-white">Human Resource Management</h1>
        <div className="d-flex flex-column flex-sm-row gap-2 w-100 w-md-auto">
          <button
            className="btn btn-sm"
            style={{
              backgroundColor: "#245e99",
              borderColor: "#245e99",
              color: "white",
            }}
            onClick={() => {
              fetch("/api/admin/hr-logout", { method: "POST" });
              router.push("/admin/human-resource/login");
            }}
          >
            <i className="bi bi-box-arrow-right me-1"></i>
            Logout
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-4">
        {/* Mobile Navigation Dropdown */}
        <div className="d-block d-lg-none mb-3">
          <div className="dropdown">
            <button
              className="btn dropdown-toggle w-100"
              style={{ borderColor: "#245e99", color: "#245e99" }}
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {[
                { id: "dashboard", name: "Dashboard" },
                { id: "attendance", name: "Attendance" },
                { id: "leaves", name: "Leave Management" },
                { id: "employees", name: "Employees" },
                { id: "overview", name: "Employee Overview" },
                { id: "reports", name: "Reports" },
              ].find((tab) => tab.id === activeTab)?.name || "Select Tab"}
            </button>
            <ul className="dropdown-menu w-100">
              {[
                { id: "dashboard", name: "Dashboard", icon: "bi-speedometer2" },
                { id: "attendance", name: "Attendance", icon: "bi-clock" },
                {
                  id: "leaves",
                  name: "Leave Management",
                  icon: "bi-calendar-check",
                },
                { id: "employees", name: "Employees", icon: "bi-person-badge" },
                {
                  id: "overview",
                  name: "Employee Overview",
                  icon: "bi-people",
                },
                { id: "reports", name: "Reports", icon: "bi-graph-up" },
              ].map((tab) => (
                <li key={tab.id}>
                  <button
                    className={`dropdown-item ${
                      activeTab === tab.id ? "active" : ""
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <i className={`${tab.icon} me-2`}></i>
                    {tab.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Desktop Navigation Tabs */}
        <div className="d-none d-lg-block">
          <ul
            className="nav nav-tabs"
            id="hrTabs"
            role="tablist"
            style={{ borderBottomColor: "#245e99", marginBottom: "0" }}
          >
            {[
              { id: "dashboard", name: "Dashboard" },
              { id: "attendance", name: "Attendance" },
              { id: "leaves", name: "Leave Management" },
              { id: "employees", name: "Employees" },
              { id: "overview", name: "Employee Overview" },
              { id: "reports", name: "Reports" },
            ].map((tab) => (
              <li className="nav-item" role="presentation" key={tab.id}>
                <button
                  className={`nav-link ${activeTab === tab.id ? "active" : ""}`}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    color: activeTab === tab.id ? "#ffffff" : "#245e99",
                    backgroundColor:
                      activeTab === tab.id ? "#245e99" : "transparent",
                    borderColor: "#245e99",
                    borderBottomColor:
                      activeTab === tab.id ? "#245e99" : "transparent",
                  }}
                >
                  {tab.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="tab-content">
        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div className="tab-pane fade show active">
            {/* Stats Cards */}
            <div className="row g-3 g-md-4 mb-4">
              <div className="col-6 col-lg-3">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body d-flex flex-column flex-sm-row align-items-center text-center text-sm-start">
                    <div className="flex-shrink-0 mb-2 mb-sm-0 me-sm-3">
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold mx-auto"
                        style={{
                          width: "48px",
                          height: "48px",
                          backgroundColor: "#28a745",
                        }}
                      >
                        {stats.onTime}
                      </div>
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="card-subtitle mb-1 text-muted small">
                        On Time Today
                      </h6>
                      <h5 className="card-title mb-0 fs-6">
                        {stats.onTime} employees
                      </h5>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-6 col-lg-3">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body d-flex flex-column flex-sm-row align-items-center text-center text-sm-start">
                    <div className="flex-shrink-0 mb-2 mb-sm-0 me-sm-3">
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold mx-auto"
                        style={{
                          width: "48px",
                          height: "48px",
                          backgroundColor: "#245e99",
                        }}
                      >
                        {stats.absent}
                      </div>
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="card-subtitle mb-1 text-muted small">
                        Absent Today
                      </h6>
                      <h5 className="card-title mb-0 fs-6">
                        {stats.absent} employees
                      </h5>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-6 col-lg-3">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body d-flex flex-column flex-sm-row align-items-center text-center text-sm-start">
                    <div className="flex-shrink-0 mb-2 mb-sm-0 me-sm-3">
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold mx-auto"
                        style={{
                          width: "48px",
                          height: "48px",
                          backgroundColor: "#ffc107",
                        }}
                      >
                        {stats.late}
                      </div>
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="card-subtitle mb-1 text-muted small">
                        Late Today
                      </h6>
                      <h5 className="card-title mb-0 fs-6">
                        {stats.late} employees
                      </h5>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-6 col-lg-3">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body d-flex flex-column flex-sm-row align-items-center text-center text-sm-start">
                    <div className="flex-shrink-0 mb-2 mb-sm-0 me-sm-3">
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold mx-auto"
                        style={{
                          width: "48px",
                          height: "48px",
                          backgroundColor: "#007bff",
                        }}
                      >
                        {stats.total}
                      </div>
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="card-subtitle mb-1 text-muted small">
                        Total Employees
                      </h6>
                      <h5 className="card-title mb-0 fs-6">
                        {stats.total} employees
                      </h5>
                    </div>
                  </div>
                </div>
                <div className="row g-3 mt-2">
                  <div className="col-12 col-sm-6 col-md-4">
                    <button
                      onClick={updateAttendanceStatus}
                      className="btn btn-warning w-100"
                    >
                      <i className="fas fa-sync-alt me-2"></i>
                      <span className="d-none d-sm-inline">
                        Update Status Records
                      </span>
                      <span className="d-sm-none">Update Status</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h5 className="card-title mb-4" style={{ color: "#245e99" }}>
                  Quick Actions
                </h5>
                <div className="row g-3">
                  <div className="col-6 col-lg-3">
                    <button
                      onClick={() => {
                        setShowEmployeeForm(true);
                        setEditingEmployee(null);
                        resetEmployeeForm();
                      }}
                      className="btn w-100"
                      style={{
                        backgroundColor: "#245e99",
                        borderColor: "#245e99",
                        color: "white",
                      }}
                    >
                      <i className="fas fa-user-plus me-2"></i>
                      <span className="d-none d-sm-inline">
                        Add New Employee
                      </span>
                      <span className="d-sm-none">Add Employee</span>
                    </button>
                  </div>
                  <div className="col-6 col-lg-3">
                    <button
                      onClick={() => setShowClockForm(true)}
                      className="btn w-100"
                      style={{
                        backgroundColor: "#245e99",
                        borderColor: "#245e99",
                        color: "white",
                      }}
                    >
                      <i className="fas fa-clock me-2"></i>
                      <span className="d-none d-sm-inline">Clock In/Out</span>
                      <span className="d-sm-none">Clock</span>
                    </button>
                  </div>
                  <div className="col-6 col-lg-3">
                    <button
                      onClick={() => setShowLeaveForm(true)}
                      className="btn w-100"
                      style={{
                        backgroundColor: "#245e99",
                        borderColor: "#245e99",
                        color: "white",
                      }}
                    >
                      <i className="fas fa-calendar-alt me-2"></i>
                      <span className="d-none d-sm-inline">Apply Leave</span>
                      <span className="d-sm-none">Leave</span>
                    </button>
                  </div>
                  <div className="col-6 col-lg-3">
                    <button
                      onClick={() => {
                        setShowManualTimeForm(true);
                        resetManualTimeForm();
                      }}
                      className="btn w-100"
                      style={{
                        backgroundColor: "#245e99",
                        borderColor: "#245e99",
                        color: "white",
                      }}
                    >
                      <i className="fas fa-history me-2"></i>
                      <span className="d-none d-sm-inline">
                        Manual Time Entry
                      </span>
                      <span className="d-sm-none">Manual</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h5 className="card-title mb-4" style={{ color: "#245e99" }}>
                  Recent Activity
                </h5>
                <div className="list-group list-group-flush">
                  {attendance.slice(0, 5).map((record, index) => {
                    const employee = employees.find(
                      (emp) => emp._id === record.employeeId
                    );
                    return (
                      <div
                        key={index}
                        className="list-group-item d-flex justify-content-between align-items-start border-0 px-0"
                      >
                        <div className="ms-2 me-auto">
                          <div className="fw-bold">
                            {employee ? employee.name : "Unknown Employee"}
                          </div>
                          <small className="text-muted">
                            {record.status} -{" "}
                            {new Date(record.date).toLocaleDateString()}
                          </small>
                        </div>
                        <small className="text-muted">
                          {record.clockIn &&
                            new Date(record.clockIn).toLocaleTimeString()}
                        </small>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Employee Overview Tab */}
        {activeTab === "overview" && (
          <div className="tab-pane fade show active">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="h3 mb-0" style={{ color: "#245e99" }}>
                Employee Overview & Statistics
              </h2>
              <div className="d-flex gap-2">
                <select
                  value={statsPeriod}
                  onChange={(e) => setStatsPeriod(e.target.value)}
                  className="form-select"
                  style={{ width: "auto" }}
                >
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="year">This Year</option>
                </select>
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="form-select"
                  style={{ width: "auto" }}
                >
                  <option value="">All Departments</option>
                  {[...new Set(employees.map((emp) => emp.department))].map(
                    (dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>

            {statsLoading ? (
              <div className="text-center py-5">
                <div
                  className="spinner-border"
                  style={{ color: "#245e99" }}
                  role="status"
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2 text-muted">
                  Loading employee statistics...
                </p>
              </div>
            ) : employeeStats ? (
              <>
                {/* Overall Statistics Cards */}
                <div className="row g-4 mb-4">
                  <div className="col-md-3">
                    <div className="card border-0 shadow-sm h-100">
                      <div className="card-body text-center">
                        <div className="mb-2">
                          <i
                            className="fas fa-users fa-2x"
                            style={{ color: "#245e99" }}
                          ></i>
                        </div>
                        <h3 className="mb-1" style={{ color: "#245e99" }}>
                          {employeeStats.overallStats.totalEmployees}
                        </h3>
                        <p className="text-muted mb-0">Total Employees</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="card border-0 shadow-sm h-100">
                      <div className="card-body text-center">
                        <div className="mb-2">
                          <i className="fas fa-clock fa-2x text-success"></i>
                        </div>
                        <h3 className="text-success mb-1">
                          {employeeStats.overallStats.attendance.totalHours.toFixed(
                            1
                          )}
                        </h3>
                        <p className="text-muted mb-0">Total Hours Worked</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="card border-0 shadow-sm h-100">
                      <div className="card-body text-center">
                        <div className="mb-2">
                          <i className="fas fa-calendar-times fa-2x text-warning"></i>
                        </div>
                        <h3 className="text-warning mb-1">
                          {employeeStats.overallStats.leaves.totalLeaveDays}
                        </h3>
                        <p className="text-muted mb-0">Total Leave Days</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="card border-0 shadow-sm h-100">
                      <div className="card-body text-center">
                        <div className="mb-2">
                          <i className="fas fa-home fa-2x text-info"></i>
                        </div>
                        <h3 className="text-info mb-1">
                          {
                            employeeStats.overallStats.remoteWork
                              .currentlyRemote
                          }
                        </h3>
                        <p className="text-muted mb-0">Currently Remote</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Employee Type Breakdown */}
                <div className="row g-4 mb-4">
                  <div className="col-md-6">
                    <div className="card border-0 shadow-sm">
                      <div
                        className="card-header text-white"
                        style={{ backgroundColor: "#245e99" }}
                      >
                        <h6 className="mb-0">
                          <i className="fas fa-user-tie me-2"></i>Regular
                          Employees (
                          {employeeStats.overallStats.totalRegularEmployees})
                        </h6>
                      </div>
                      <div className="card-body">
                        <div className="row text-center">
                          <div className="col-4">
                            <div className="text-success">
                              <i className="fas fa-clock fa-lg"></i>
                              <div className="mt-1">
                                <h5>
                                  {employeeStats.overallStats.attendance.regular.totalHours.toFixed(
                                    1
                                  )}
                                </h5>
                                <small>Hours Worked</small>
                              </div>
                            </div>
                          </div>
                          <div className="col-4">
                            <div className="text-warning">
                              <i className="fas fa-calendar-times fa-lg"></i>
                              <div className="mt-1">
                                <h5>
                                  {
                                    employeeStats.overallStats.leaves.regular
                                      .totalLeaveDays
                                  }
                                </h5>
                                <small>Leave Days</small>
                              </div>
                            </div>
                          </div>
                          <div className="col-4">
                            <div className="text-info">
                              <i className="fas fa-user-check fa-lg"></i>
                              <div className="mt-1">
                                <h5>
                                  {
                                    employeeStats.overallStats.attendance
                                      .regular.totalOnTime
                                  }
                                </h5>
                                <small>On Time</small>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="card border-0 shadow-sm">
                      <div className="card-header bg-secondary text-white">
                        <h6 className="mb-0" style={{ color: "white" }}>
                          <i className="fas fa-graduation-cap me-2"></i>
                          <span style={{ color: "white" }}>Interns</span> (
                          {employeeStats.overallStats.totalInterns})
                        </h6>
                      </div>
                      <div className="card-body">
                        <div className="row text-center">
                          <div className="col-4">
                            <div className="text-success">
                              <i className="fas fa-clock fa-lg"></i>
                              <div className="mt-1">
                                <h5>
                                  {employeeStats.overallStats.attendance.interns.totalHours.toFixed(
                                    1
                                  )}
                                </h5>
                                <small>Hours Worked</small>
                              </div>
                            </div>
                          </div>
                          <div className="col-4">
                            <div className="text-warning">
                              <i className="fas fa-calendar-times fa-lg"></i>
                              <div className="mt-1">
                                <h5>
                                  {
                                    employeeStats.overallStats.leaves.interns
                                      .totalLeaveDays
                                  }
                                </h5>
                                <small>Leave Days</small>
                              </div>
                            </div>
                          </div>
                          <div className="col-4">
                            <div className="text-info">
                              <i className="fas fa-user-check fa-lg"></i>
                              <div className="mt-1">
                                <h5>
                                  {
                                    employeeStats.overallStats.attendance
                                      .interns.totalOnTime
                                  }
                                </h5>
                                <small>On Time</small>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Regular Employees Table */}
                <div className="card border-0 shadow-sm mb-4">
                  <div
                    className="card-header"
                    style={{ backgroundColor: "#245e99", color: "white" }}
                  >
                    <h5 className="mb-0">
                      <i className="fas fa-user-tie me-2"></i>
                      Regular Employees Statistics (
                      {statsPeriod.charAt(0).toUpperCase() +
                        statsPeriod.slice(1)}
                      )
                    </h5>
                  </div>
                  <div className="card-body p-0">
                    <div className="table-responsive">
                      <table className="table table-hover mb-0">
                        <thead className="table-light">
                          <tr>
                            <th className="text-nowrap">Employee</th>
                            <th className="text-nowrap d-none d-md-table-cell">
                              Department
                            </th>
                            <th className="text-nowrap">Attendance</th>
                            <th className="text-nowrap d-none d-lg-table-cell">
                              Leave Usage
                            </th>
                            <th className="text-nowrap d-none d-xl-table-cell">
                              Remote Work
                            </th>
                            <th className="text-nowrap d-none d-lg-table-cell">
                              Performance
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {employeeStats.employeeStats
                            .filter((emp) => !emp.isIntern)
                            .map((emp, index) => (
                              <tr key={emp.employeeId}>
                                <td>
                                  <div>
                                    <div className="fw-bold">{emp.name}</div>
                                    <small className="text-muted">
                                      {emp.employeeCode} - {emp.designation}
                                    </small>
                                    <div className="d-md-none mt-1">
                                      <span className="badge bg-secondary">
                                        {emp.department}
                                      </span>
                                    </div>
                                  </div>
                                </td>
                                <td className="d-none d-md-table-cell">
                                  <span className="badge bg-secondary">
                                    {emp.department}
                                  </span>
                                </td>
                                <td>
                                  <div className="small">
                                    <div className="d-flex justify-content-between">
                                      <span>Present:</span>
                                      <span className="text-success fw-bold">
                                        {emp.attendance.totalDays}
                                      </span>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                      <span>Late:</span>
                                      <span className="text-warning fw-bold">
                                        {emp.attendance.lateDays}
                                      </span>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                      <span>Absent:</span>
                                      <span
                                        style={{ color: "#245e99" }}
                                        className="fw-bold"
                                      >
                                        {emp.attendance.absentDays}
                                      </span>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                      <span>Hours:</span>
                                      <span className="fw-bold">
                                        {emp.attendance.totalHours}h
                                      </span>
                                    </div>
                                  </div>
                                </td>
                                <td className="d-none d-lg-table-cell">
                                  <div className="small">
                                    <div className="d-flex justify-content-between">
                                      <span>Sick:</span>
                                      <span className="text-info">
                                        {emp.leaves.sick.taken}/
                                        {emp.leaves.sick.available}
                                      </span>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                      <span>Casual:</span>
                                      <span className="text-primary">
                                        {emp.leaves.casual.taken}/
                                        {emp.leaves.casual.available}
                                      </span>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                      <span>Annual:</span>
                                      <span className="text-success">
                                        {emp.leaves.annual.taken}/
                                        {emp.leaves.annual.available}
                                      </span>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                      <span>Total:</span>
                                      <span className="fw-bold">
                                        {emp.leaves.totalTaken} days
                                      </span>
                                    </div>
                                  </div>
                                </td>
                                <td className="d-none d-xl-table-cell">
                                  <div className="small">
                                    <div className="mb-1">
                                      <span
                                        className={`badge ${
                                          emp.remoteWork.currentStatus ===
                                          "remote"
                                            ? "bg-info"
                                            : emp.remoteWork.currentStatus ===
                                              "hybrid"
                                            ? "bg-warning"
                                            : "bg-success"
                                        }`}
                                        style={{
                                          color:
                                            emp.remoteWork.currentStatus ===
                                            "office"
                                              ? "black"
                                              : "white",
                                        }}
                                      >
                                        {emp.remoteWork.currentStatus
                                          .charAt(0)
                                          .toUpperCase() +
                                          emp.remoteWork.currentStatus.slice(1)}
                                      </span>
                                    </div>
                                    <div>
                                      Remote Days: {emp.remoteWork.daysInPeriod}
                                    </div>
                                    <div>
                                      Enabled:{" "}
                                      {emp.remoteWork.isEnabled ? "Yes" : "No"}
                                    </div>
                                  </div>
                                </td>
                                <td className="d-none d-lg-table-cell">
                                  <div className="small">
                                    <div className="d-flex justify-content-between">
                                      <span>Avg Hours/Day:</span>
                                      <span className="fw-bold">
                                        {emp.attendance.averageHoursPerDay}h
                                      </span>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                      <span>Overtime:</span>
                                      <span className="text-warning">
                                        {emp.attendance.overtimeHours}h
                                      </span>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                      <span>Manual Entries:</span>
                                      <span className="text-info">
                                        {emp.manualTimeEntries.totalEntries}
                                      </span>
                                    </div>
                                    <div className="mt-1">
                                      <div
                                        className="progress"
                                        style={{ height: "4px" }}
                                      >
                                        <div
                                          className="progress-bar bg-success"
                                          style={{
                                            width: `${Math.min(
                                              100,
                                              (emp.attendance.onTimeDays /
                                                Math.max(
                                                  1,
                                                  emp.attendance.totalDays
                                                )) *
                                                100
                                            )}%`,
                                          }}
                                        ></div>
                                      </div>
                                      <small className="text-muted">
                                        On-time Rate
                                      </small>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                      {employeeStats.employeeStats.filter(
                        (emp) => !emp.isIntern
                      ).length === 0 && (
                        <div className="text-center py-4 text-muted">
                          <i className="fas fa-users fa-2x mb-2"></i>
                          <p>No regular employees found</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Interns Table */}
                <div className="card border-0 shadow-sm">
                  <div
                    className="card-header"
                    style={{ backgroundColor: "#6c757d", color: "white" }}
                  >
                    <h5 className="mb-0" style={{ color: "white" }}>
                      <i className="fas fa-graduation-cap me-2"></i>
                      <span style={{ color: "white" }}>Interns</span> Statistics
                      (
                      {statsPeriod.charAt(0).toUpperCase() +
                        statsPeriod.slice(1)}
                      )
                    </h5>
                  </div>
                  <div className="card-body p-0">
                    <div className="table-responsive">
                      <table className="table table-hover mb-0">
                        <thead className="table-light">
                          <tr>
                            <th className="text-nowrap">Intern</th>
                            <th className="text-nowrap d-none d-md-table-cell">
                              Department
                            </th>
                            <th className="text-nowrap">Attendance</th>
                            <th className="text-nowrap d-none d-lg-table-cell">
                              Leave Usage
                            </th>
                            <th className="text-nowrap d-none d-xl-table-cell">
                              Remote Work
                            </th>
                            <th className="text-nowrap d-none d-lg-table-cell">
                              Performance
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {employeeStats.employeeStats
                            .filter((emp) => emp.isIntern)
                            .map((emp, index) => (
                              <tr key={emp.employeeId}>
                                <td>
                                  <div>
                                    <div className="fw-bold">
                                      {emp.name}
                                      <span
                                        className="badge bg-info ms-2"
                                        style={{ fontSize: "0.7em" }}
                                      >
                                        <i className="fas fa-graduation-cap me-1"></i>
                                        Intern
                                      </span>
                                    </div>
                                    <small className="text-muted">
                                      {emp.employeeCode} - {emp.designation}
                                    </small>
                                    <div className="d-md-none mt-1">
                                      <span className="badge bg-secondary">
                                        {emp.department}
                                      </span>
                                    </div>
                                  </div>
                                </td>
                                <td className="d-none d-md-table-cell">
                                  <span className="badge bg-secondary">
                                    {emp.department}
                                  </span>
                                </td>
                                <td>
                                  <div className="small">
                                    <div className="d-flex justify-content-between">
                                      <span>Present:</span>
                                      <span className="text-success fw-bold">
                                        {emp.attendance.totalDays}
                                      </span>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                      <span>Late:</span>
                                      <span className="text-warning fw-bold">
                                        {emp.attendance.lateDays}
                                      </span>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                      <span>Absent:</span>
                                      <span
                                        style={{ color: "#245e99" }}
                                        className="fw-bold"
                                      >
                                        {emp.attendance.absentDays}
                                      </span>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                      <span>Hours:</span>
                                      <span className="fw-bold">
                                        {emp.attendance.totalHours}h
                                      </span>
                                    </div>
                                  </div>
                                </td>
                                <td className="d-none d-lg-table-cell">
                                  <div className="small">
                                    <div className="d-flex justify-content-between">
                                      <span>Sick:</span>
                                      <span className="text-info">
                                        {emp.leaves.sick.taken}/
                                        {emp.leaves.sick.available}
                                      </span>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                      <span>Casual:</span>
                                      <span className="text-primary">
                                        {emp.leaves.casual.taken}/
                                        {emp.leaves.casual.available}
                                      </span>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                      <span>Annual:</span>
                                      <span className="text-success">
                                        {emp.leaves.annual.taken}/
                                        {emp.leaves.annual.available}
                                      </span>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                      <span>Total:</span>
                                      <span className="fw-bold">
                                        {emp.leaves.totalTaken} days
                                      </span>
                                    </div>
                                  </div>
                                </td>
                                <td className="d-none d-xl-table-cell">
                                  <div className="small">
                                    <div className="mb-1">
                                      <span
                                        className={`badge ${
                                          emp.remoteWork.currentStatus ===
                                          "remote"
                                            ? "bg-info"
                                            : emp.remoteWork.currentStatus ===
                                              "hybrid"
                                            ? "bg-warning"
                                            : "bg-success"
                                        }`}
                                        style={{
                                          color:
                                            emp.remoteWork.currentStatus ===
                                            "office"
                                              ? "black"
                                              : "white",
                                        }}
                                      >
                                        {emp.remoteWork.currentStatus
                                          .charAt(0)
                                          .toUpperCase() +
                                          emp.remoteWork.currentStatus.slice(1)}
                                      </span>
                                    </div>
                                    <div>
                                      Remote Days: {emp.remoteWork.daysInPeriod}
                                    </div>
                                    <div>
                                      Enabled:{" "}
                                      {emp.remoteWork.isEnabled ? "Yes" : "No"}
                                    </div>
                                  </div>
                                </td>
                                <td className="d-none d-lg-table-cell">
                                  <div className="small">
                                    <div className="d-flex justify-content-between">
                                      <span>Avg Hours/Day:</span>
                                      <span className="fw-bold">
                                        {emp.attendance.averageHoursPerDay}h
                                      </span>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                      <span>Overtime:</span>
                                      <span className="text-warning">
                                        {emp.attendance.overtimeHours}h
                                      </span>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                      <span>Manual Entries:</span>
                                      <span className="text-info">
                                        {emp.manualTimeEntries.totalEntries}
                                      </span>
                                    </div>
                                    <div className="mt-1">
                                      <div
                                        className="progress"
                                        style={{ height: "4px" }}
                                      >
                                        <div
                                          className="progress-bar bg-success"
                                          style={{
                                            width: `${Math.min(
                                              100,
                                              (emp.attendance.onTimeDays /
                                                Math.max(
                                                  1,
                                                  emp.attendance.totalDays
                                                )) *
                                                100
                                            )}%`,
                                          }}
                                        ></div>
                                      </div>
                                      <small className="text-muted">
                                        On-time Rate
                                      </small>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                      {employeeStats.employeeStats.filter((emp) => emp.isIntern)
                        .length === 0 && (
                        <div className="text-center py-4 text-muted">
                          <i className="fas fa-graduation-cap fa-2x mb-2"></i>
                          <p>No interns found</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-5">
                <i className="fas fa-chart-bar fa-3x text-muted mb-3"></i>
                <p className="text-muted">
                  No statistics available. Please try refreshing the page.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Employees Tab */}
        {activeTab === "employees" && (
          <div className="tab-pane fade show active">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="h3 mb-0" style={{ color: "#245e99" }}>
                Employee Management
              </h2>
              <button
                onClick={() => {
                  setShowEmployeeForm(true);
                  setEditingEmployee(null);
                  resetEmployeeForm();
                }}
                className="btn"
                style={{
                  backgroundColor: "#245e99",
                  borderColor: "#245e99",
                  color: "white",
                }}
              >
                <i className="fas fa-plus me-2"></i>
                Add Employee
              </button>
            </div>

            <div className="row g-3">
              {employees.map((employee) => (
                <div key={employee._id} className="col-md-6 col-lg-4">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body">
                      <div className="d-flex align-items-center mb-3">
                        <div className="flex-shrink-0 me-3">
                          <div
                            className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                            style={{
                              width: "48px",
                              height: "48px",
                              backgroundColor: "#245e99",
                            }}
                          >
                            {employee.name.charAt(0).toUpperCase()}
                          </div>
                        </div>
                        <div className="flex-grow-1">
                          <h6
                            className="card-title mb-1"
                            style={{ color: "#245e99" }}
                          >
                            {employee.name}
                          </h6>
                          <small className="text-muted">
                            ID: {employee.employeeId}
                          </small>
                        </div>
                      </div>
                      <div className="mb-3">
                        <p className="card-text mb-1">
                          <i className="fas fa-building me-2 text-muted"></i>
                          {employee.department}
                        </p>
                        <p className="card-text mb-1">
                          <i className="fas fa-briefcase me-2 text-muted"></i>
                          {employee.designation}
                        </p>
                        <p className="card-text mb-0">
                          <i className="fas fa-envelope me-2 text-muted"></i>
                          {employee.email}
                        </p>
                      </div>
                      <div className="d-flex gap-2">
                        <button
                          onClick={() => {
                            setEditingEmployee(employee);
                            setEmployeeFormData({
                              ...employee,
                              isIntern: employee.isIntern || false,
                            });
                            setShowEmployeeForm(true);
                          }}
                          className="btn btn-sm flex-fill"
                          style={{ borderColor: "#245e99", color: "#245e99" }}
                        >
                          <i className="fas fa-edit me-1"></i>
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteEmployee(employee._id)}
                          className="btn btn-sm flex-fill"
                          style={{ borderColor: "#245e99", color: "#245e99" }}
                        >
                          <i className="fas fa-trash me-1"></i>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Attendance Tab */}
        {activeTab === "attendance" && (
          <div className="tab-pane fade show active">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="h3 mb-0" style={{ color: "#245e99" }}>
                Attendance Management
              </h2>
              <button
                onClick={() => setShowClockForm(true)}
                className="btn"
                style={{
                  backgroundColor: "#245e99",
                  borderColor: "#245e99",
                  color: "white",
                }}
              >
                <i className="fas fa-clock me-2"></i>
                Clock In/Out
              </button>
            </div>

            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h5 className="card-title mb-4" style={{ color: "#245e99" }}>
                  Today's Attendance
                </h5>
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="table-light">
                      <tr>
                        <th scope="col">
                          <i className="fas fa-user me-2"></i>
                          Employee
                        </th>
                        <th scope="col">
                          <i className="fas fa-info-circle me-2"></i>
                          Status
                        </th>
                        <th scope="col">
                          <i className="fas fa-sign-in-alt me-2"></i>
                          Clock In
                        </th>
                        <th scope="col">
                          <i className="fas fa-sign-out-alt me-2"></i>
                          Clock Out
                        </th>
                        <th scope="col">
                          <i className="fas fa-clock me-2"></i>
                          Overtime
                        </th>
                        <th scope="col">
                          <i className="fas fa-cogs me-2"></i>
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {employees.map((employee, index) => {
                        const todayAttendance = attendance.find(
                          (record) =>
                            record.employeeId === employee._id &&
                            new Date(record.date).toDateString() ===
                              new Date().toDateString()
                        );

                        return (
                          <tr key={employee._id}>
                            <td className="fw-medium">{employee.name}</td>
                            <td>
                              <select
                                value={
                                  !todayAttendance
                                    ? "absent"
                                    : todayAttendance.status
                                }
                                onChange={(e) => {
                                  const newStatus = e.target.value;
                                  handleAttendanceStatusChange(
                                    employee._id,
                                    newStatus
                                  );
                                }}
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border-0 ${
                                  !todayAttendance
                                    ? "bg-blue-100 text-blue-800"
                                    : todayAttendance.status === "on time"
                                    ? "bg-green-500 text-white"
                                    : todayAttendance.status === "late"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : todayAttendance.status === "casual leave"
                                    ? "bg-blue-100 text-blue-800"
                                    : todayAttendance.status === "sick leave"
                                    ? "bg-purple-100 text-purple-800"
                                    : todayAttendance.status ===
                                      "government vacation"
                                    ? "bg-indigo-100 text-indigo-800"
                                    : todayAttendance.status === "off day"
                                    ? "bg-gray-100 text-gray-800"
                                    : "bg-blue-100 text-blue-800"
                                }`}
                                style={{
                                  minWidth: "120px",
                                  fontSize: "12px",
                                  appearance: "none",
                                  backgroundImage:
                                    "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e\")",
                                  backgroundPosition: "right 0.5rem center",
                                  backgroundRepeat: "no-repeat",
                                  backgroundSize: "1.5em 1.5em",
                                  paddingRight: "2.5rem",
                                }}
                              >
                                <option value="on time">On Time</option>
                                <option value="late">Late</option>
                                <option value="absent">Absent</option>
                                <option value="casual leave">
                                  Casual Leave
                                </option>
                                <option value="sick leave">Sick Leave</option>
                                <option value="government vacation">
                                  Government Vacation
                                </option>
                                <option value="off day">Off Day</option>
                              </select>
                            </td>
                            <td>
                              {todayAttendance?.clockIn
                                ? new Date(
                                    todayAttendance.clockIn
                                  ).toLocaleTimeString()
                                : "N/A"}
                            </td>
                            <td>
                              {todayAttendance?.clockOut
                                ? new Date(
                                    todayAttendance.clockOut
                                  ).toLocaleTimeString()
                                : "N/A"}
                            </td>
                            <td>{todayAttendance?.overtimeHours || 0} hours</td>
                            <td>
                              <div className="d-flex gap-2">
                                {!todayAttendance?.clockIn ? (
                                  <button
                                    onClick={() =>
                                      handleManualClockIn(employee._id)
                                    }
                                    className="btn btn-sm"
                                    style={{
                                      backgroundColor: "#245e99",
                                      borderColor: "#245e99",
                                      color: "white",
                                    }}
                                    title="Clock In (Login)"
                                  >
                                    <i className="fas fa-sign-in-alt me-1"></i>
                                    Login
                                  </button>
                                ) : !todayAttendance?.clockOut ? (
                                  <button
                                    onClick={() =>
                                      handleManualClockOut(employee._id)
                                    }
                                    className="btn btn-sm"
                                    style={{
                                      backgroundColor: "#245e99",
                                      borderColor: "#245e99",
                                      color: "white",
                                    }}
                                    title="Clock Out (Logout)"
                                  >
                                    <i className="fas fa-sign-out-alt me-1"></i>
                                    Logout
                                  </button>
                                ) : (
                                  <span className="text-muted small">
                                    Complete
                                  </span>
                                )}

                                {/* Edit button - show if there's an attendance record to edit */}
                                {todayAttendance && (
                                  <button
                                    onClick={() => {
                                      console.log(
                                        "Inline edit button clicked for employee:",
                                        employee._id
                                      );
                                      console.log(
                                        "todayAttendance:",
                                        todayAttendance
                                      );
                                      setEditingAttendance({
                                        employeeId: employee._id,
                                        employeeName: employee.name,
                                        date: new Date()
                                          .toISOString()
                                          .split("T")[0],
                                        ...todayAttendance,
                                      });
                                      setEditAttendanceData({
                                        clockIn: todayAttendance.clockIn
                                          ? new Date(todayAttendance.clockIn)
                                              .toTimeString()
                                              .slice(0, 5)
                                          : "",
                                        clockOut: todayAttendance.clockOut
                                          ? new Date(todayAttendance.clockOut)
                                              .toTimeString()
                                              .slice(0, 5)
                                          : "",
                                        status:
                                          todayAttendance.status || "on time",
                                      });
                                      setShowEditAttendanceForm(true);
                                      console.log(
                                        "Inline edit form should now be visible"
                                      );
                                    }}
                                    className="btn btn-sm"
                                    style={{
                                      backgroundColor: "#245e99",
                                      borderColor: "#245e99",
                                      color: "white",
                                    }}
                                    title="Edit attendance times"
                                  >
                                    <i className="fas fa-edit me-1"></i>
                                    Edit
                                  </button>
                                )}

                                {/* Undo button - show if there's an attendance record to undo */}
                                {todayAttendance && (
                                  <button
                                    onClick={() =>
                                      handleUndoAttendance(
                                        employee._id,
                                        todayAttendance
                                      )
                                    }
                                    className="btn btn-sm"
                                    style={{
                                      backgroundColor: "#245e99",
                                      borderColor: "#245e99",
                                      color: "white",
                                    }}
                                    title="Undo last action (restore previous state)"
                                  >
                                    <i className="fas fa-undo me-1"></i>
                                    Undo
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Leave Management Tab */}
        {activeTab === "leaves" && (
          <div className="tab-pane fade show active">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="h3 mb-0" style={{ color: "#245e99" }}>
                Leave Management
              </h2>
              <button
                onClick={() => setShowLeaveForm(true)}
                className="btn"
                style={{
                  backgroundColor: "#245e99",
                  borderColor: "#245e99",
                  color: "white",
                }}
              >
                <i className="fas fa-calendar-plus me-2"></i>
                Apply Leave
              </button>
            </div>

            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h5 className="card-title mb-4" style={{ color: "#245e99" }}>
                  Leave Requests
                </h5>
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Employee
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Leave Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Start Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          End Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Reason
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {leaves.map((leave, index) => {
                        const employee = employees.find(
                          (emp) => emp._id === leave.employeeId
                        );
                        return (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {employee ? employee.name : "Unknown"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {leave.leaveType}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {new Date(leave.startDate).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {new Date(leave.endDate).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {leave.reason}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  leave.status === "approved"
                                    ? "bg-green-100 text-green-800"
                                    : leave.status === "rejected"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {leave.status || "pending"}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reports Tab - Individual Employee Reports */}
        {activeTab === "reports" && (
          <div className="tab-pane fade show active">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="h3 mb-0" style={{ color: "#245e99" }}>
                <i className="fas fa-chart-pie me-2"></i>
                Individual Employee Reports
              </h2>
            </div>

            {/* Employee Selection and Filters */}
            <div className="card border-0 shadow-sm mb-4">
              <div
                className="card-header"
                style={{ backgroundColor: "#245e99", color: "white" }}
              >
                <h5 className="mb-0">
                  <i className="fas fa-filter me-2"></i>
                  Report Filters
                </h5>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-bold">
                      <i className="fas fa-user me-2"></i>
                      Select Employee
                    </label>
                    <select
                      className="form-select"
                      value={selectedEmployeeForReport}
                      onChange={(e) =>
                        handleEmployeeReportChange(e.target.value)
                      }
                    >
                      <option value="">Choose an employee...</option>
                      {employees.map((employee) => (
                        <option key={employee._id} value={employee._id}>
                          {employee.name} - {employee.employeeId} (
                          {employee.department})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold">
                      <i className="fas fa-calendar me-2"></i>
                      Time Period
                    </label>
                    <select
                      className="form-select"
                      value={reportPeriod}
                      onChange={(e) => handleReportPeriodChange(e.target.value)}
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {reportLoading && (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2 text-muted">
                  Loading employee report data...
                </p>
              </div>
            )}

            {/* No Employee Selected */}
            {!selectedEmployeeForReport && !reportLoading && (
              <div className="text-center py-5">
                <i className="fas fa-user-plus fa-3x text-muted mb-3"></i>
                <h4 className="text-muted">Select an Employee</h4>
                <p className="text-muted">
                  Choose an employee from the dropdown above to view their
                  attendance report.
                </p>
              </div>
            )}

            {/* Employee Report Data */}
            {employeeReportData && !reportLoading && (
              <>
                {/* Employee Info Card */}
                <div className="card border-0 shadow-sm mb-4">
                  <div
                    className="card-header"
                    style={{ backgroundColor: "#28a745", color: "white" }}
                  >
                    <h5 className="mb-0">
                      <i className="fas fa-id-card me-2"></i>
                      {employeeReportData.employee.name} - Report Summary
                    </h5>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-3">
                        <div className="text-center">
                          <i className="fas fa-user-tie fa-2x text-primary mb-2"></i>
                          <h6>Employee ID</h6>
                          <p className="fw-bold">
                            {employeeReportData.employee.employeeId}
                          </p>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="text-center">
                          <i className="fas fa-building fa-2x text-info mb-2"></i>
                          <h6>Department</h6>
                          <p className="fw-bold">
                            {employeeReportData.employee.department}
                          </p>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="text-center">
                          <i className="fas fa-briefcase fa-2x text-warning mb-2"></i>
                          <h6>Designation</h6>
                          <p className="fw-bold">
                            {employeeReportData.employee.designation}
                          </p>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="text-center">
                          <i className="fas fa-calendar-alt fa-2x text-success mb-2"></i>
                          <h6>Report Period</h6>
                          <p className="fw-bold">
                            {reportPeriod.charAt(0).toUpperCase() +
                              reportPeriod.slice(1)}
                          </p>
                          <small className="text-muted">
                            {employeeReportData.dateRange.start} to{" "}
                            {employeeReportData.dateRange.end}
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Charts Row */}
                <div className="row">
                  {/* Pie Chart */}
                  <div className="col-12 col-lg-6 mb-4">
                    <div className="card border-0 shadow-sm h-100">
                      <div
                        className="card-header"
                        style={{ backgroundColor: "#6f42c1", color: "white" }}
                      >
                        <h5 className="mb-0">
                          <i className="fas fa-chart-pie me-2"></i>
                          Attendance Distribution
                        </h5>
                      </div>
                      <div className="card-body d-flex align-items-center justify-content-center">
                        <div
                          className="w-100"
                          style={{ maxWidth: "300px", height: "300px" }}
                        >
                          <Pie
                            data={{
                              labels: employeeReportData.chartData.labels,
                              datasets: [
                                {
                                  data: employeeReportData.chartData.data,
                                  backgroundColor:
                                    employeeReportData.chartData
                                      .backgroundColor,
                                  borderWidth: 2,
                                  borderColor: "#fff",
                                },
                              ],
                            }}
                            options={{
                              responsive: true,
                              maintainAspectRatio: true,
                              plugins: {
                                legend: {
                                  position: "bottom",
                                  labels: {
                                    padding: 20,
                                    usePointStyle: true,
                                  },
                                },
                                tooltip: {
                                  callbacks: {
                                    label: function (context) {
                                      const label = context.label || "";
                                      const value = context.parsed || 0;
                                      const total = context.dataset.data.reduce(
                                        (a, b) => a + b,
                                        0
                                      );
                                      const percentage =
                                        total > 0
                                          ? ((value / total) * 100).toFixed(1)
                                          : 0;
                                      return `${label}: ${value} days (${percentage}%)`;
                                    },
                                  },
                                },
                              },
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Statistics Cards */}
                  <div className="col-12 col-lg-6 mb-4">
                    <div className="card border-0 shadow-sm h-100">
                      <div
                        className="card-header"
                        style={{ backgroundColor: "#17a2b8", color: "white" }}
                      >
                        <h5 className="mb-0">
                          <i className="fas fa-chart-bar me-2"></i>
                          Attendance Statistics
                        </h5>
                      </div>
                      <div className="card-body">
                        <div className="row g-3">
                          {/* On Time */}
                          <div className="col-6">
                            <div className="text-center p-3 rounded" style={{ backgroundColor: "#d4edda" }}>
                              <div className="text-success mb-2">
                                <i className="fas fa-check-circle fa-2x"></i>
                              </div>
                              <h3 className="mb-1 text-success">
                                {employeeReportData.chartData.data[0] || 0}
                              </h3>
                              <small className="text-muted fw-medium">On Time Days</small>
                            </div>
                          </div>

                          {/* Late */}
                          <div className="col-6">
                            <div className="text-center p-3 rounded" style={{ backgroundColor: "#fff3cd" }}>
                              <div className="text-warning mb-2">
                                <i className="fas fa-clock fa-2x"></i>
                              </div>
                              <h3 className="mb-1 text-warning">
                                {employeeReportData.chartData.data[1] || 0}
                              </h3>
                              <small className="text-muted fw-medium">Late Days</small>
                            </div>
                          </div>

                          {/* Absent */}
                          <div className="col-6">
                            <div className="text-center p-3 rounded" style={{ backgroundColor: "#f8d7da" }}>
                              <div className="text-danger mb-2">
                                <i className="fas fa-times-circle fa-2x"></i>
                              </div>
                              <h3 className="mb-1 text-danger">
                                {employeeReportData.chartData.data[2] || 0}
                              </h3>
                              <small className="text-muted fw-medium">Absent Days</small>
                            </div>
                          </div>

                          {/* Leave Days */}
                          <div className="col-6">
                            <div className="text-center p-3 rounded" style={{ backgroundColor: "#d1ecf1" }}>
                              <div className="text-info mb-2">
                                <i className="fas fa-calendar-alt fa-2x"></i>
                              </div>
                              <h3 className="mb-1 text-info">
                                {(employeeReportData.chartData.data[3] || 0) + (employeeReportData.chartData.data[4] || 0)}
                              </h3>
                              <small className="text-muted fw-medium">Leave Days</small>
                              <div className="mt-1">
                                <small className="text-muted d-block">
                                  Sick: {employeeReportData.chartData.data[3] || 0} | 
                                  Casual: {employeeReportData.chartData.data[4] || 0}
                                </small>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Summary */}
                        <div className="mt-4 p-3 rounded" style={{ backgroundColor: "#f8f9fa" }}>
                          <div className="row text-center">
                            <div className="col-4">
                              <div className="text-primary">
                                <i className="fas fa-calendar-day fa-lg"></i>
                                <div className="mt-1">
                                  <h6 className="mb-0">
                                    {employeeReportData.chartData.data.reduce((a, b) => a + b, 0)}
                                  </h6>
                                  <small className="text-muted">Total Days</small>
                                </div>
                              </div>
                            </div>
                            <div className="col-4">
                              <div className="text-success">
                                <i className="fas fa-percentage fa-lg"></i>
                                <div className="mt-1">
                                  <h6 className="mb-0">
                                    {employeeReportData.chartData.data.reduce((a, b) => a + b, 0) > 0 
                                      ? ((employeeReportData.chartData.data[0] / employeeReportData.chartData.data.reduce((a, b) => a + b, 0)) * 100).toFixed(1)
                                      : 0}%
                                  </h6>
                                  <small className="text-muted">On-Time Rate</small>
                                </div>
                              </div>
                            </div>
                            <div className="col-4">
                              <div className="text-info">
                                <i className="fas fa-user-check fa-lg"></i>
                                <div className="mt-1">
                                  <h6 className="mb-0">
                                    {(employeeReportData.chartData.data[0] || 0) + (employeeReportData.chartData.data[1] || 0)}
                                  </h6>
                                  <small className="text-muted">Present Days</small>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Attendance Records Table */}
                <div className="card border-0 shadow-sm mb-4">
                  <div
                    className="card-header"
                    style={{ backgroundColor: "#17a2b8", color: "white" }}
                  >
                    <h5 className="mb-0">
                      <i className="fas fa-table me-2"></i>
                      Detailed Attendance Records
                    </h5>
                  </div>
                  <div className="card-body p-0">
                    {employeeReportData.attendanceRecords && employeeReportData.attendanceRecords.length > 0 ? (
                      <div className="table-responsive">
                        <table className="table table-hover mb-0">
                          <thead className="table-light">
                            <tr>
                              <th className="text-nowrap">
                                <i className="fas fa-calendar me-2"></i>
                                Date
                              </th>
                              <th className="text-nowrap">
                                <i className="fas fa-sign-in-alt me-2"></i>
                                Clock In
                              </th>
                              <th className="text-nowrap">
                                <i className="fas fa-sign-out-alt me-2"></i>
                                Clock Out
                              </th>
                              <th className="text-nowrap">
                                <i className="fas fa-info-circle me-2"></i>
                                Status
                              </th>
                              <th className="text-nowrap">
                                <i className="fas fa-clock me-2"></i>
                                Hours Worked
                              </th>
                              <th className="text-nowrap">
                                <i className="fas fa-plus-circle me-2"></i>
                                Overtime
                              </th>
                              <th className="text-nowrap">
                                <i className="fas fa-file-alt me-2"></i>
                                Description
                              </th>
                              <th className="text-nowrap">
                                <i className="fas fa-project-diagram me-2"></i>
                                Project
                              </th>
                              <th className="text-nowrap">
                                <i className="fas fa-tag me-2"></i>
                                Type
                              </th>
                              <th className="text-nowrap">
                                <i className="fas fa-cogs me-2"></i>
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {employeeReportData.attendanceRecords.map((record, index) => (
                              <tr key={index}>
                                <td className="fw-medium">
                                  {new Date(record.date).toLocaleDateString()}
                                </td>
                                <td>
                                  {record.clockIn
                                    ? new Date(record.clockIn).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      })
                                    : '-'}
                                </td>
                                <td>
                                  {record.clockOut
                                    ? new Date(record.clockOut).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      })
                                    : '-'}
                                </td>
                                <td>
                                  <span
                                    className={`badge ${
                                      record.status === 'on time'
                                        ? 'bg-success'
                                        : record.status === 'late'
                                        ? 'bg-warning text-dark'
                                        : record.status === 'absent'
                                        ? 'bg-danger'
                                        : record.status === 'manual entry'
                                        ? 'bg-info'
                                        : record.status === 'present'
                                        ? 'bg-primary'
                                        : record.status === 'half day'
                                        ? 'bg-warning text-dark'
                                        : 'bg-secondary'
                                    }`}
                                  >
                                    {record.status || 'N/A'}
                                  </span>
                                </td>
                                <td>
                                  {record.hoursWorked
                                    ? `${record.hoursWorked.toFixed(2)} hrs`
                                    : '-'}
                                </td>
                                <td>
                                  {record.overtimeHours && record.overtimeHours > 0
                                    ? `${record.overtimeHours.toFixed(2)} hrs`
                                    : '-'}
                                </td>
                                <td>
                                  {record.description || '-'}
                                </td>
                                <td>
                                  {record.projectName || '-'}
                                </td>
                                <td>
                                  <span
                                    className={`badge ${
                                      record.entryType === 'manual'
                                        ? 'bg-info'
                                        : 'bg-primary'
                                    }`}
                                  >
                                    {record.entryType === 'manual' ? 'Manual Entry' : 'Regular'}
                                  </span>
                                </td>
                                <td>
                                  <div className="btn-group" role="group">
                                    <button
                                      type="button"
                                      className="btn btn-sm"
                                      onClick={() => handleReportRecordEdit(record)}
                                      title="Edit Record"
                                      style={{
                                        backgroundColor: '#245e99',
                                        borderColor: '#245e99',
                                        color: 'white'
                                      }}
                                      onMouseEnter={(e) => {
                                        e.target.style.backgroundColor = 'white';
                                        e.target.style.color = '#245e99';
                                        e.target.style.borderColor = '#245e99';
                                      }}
                                      onMouseLeave={(e) => {
                                        e.target.style.backgroundColor = '#245e99';
                                        e.target.style.color = 'white';
                                        e.target.style.borderColor = '#245e99';
                                      }}
                                    >
                                      <iconify-icon icon="mdi:pencil" width="16" height="16"></iconify-icon>
                                      <span className="ms-1">Edit</span>
                                    </button>
                                    <button
                                      type="button"
                                      className="btn btn-sm"
                                      onClick={() => handleReportRecordDelete(record)}
                                      title="Delete Record"
                                      style={{
                                        backgroundColor: '#dc3545',
                                        borderColor: '#dc3545',
                                        color: 'white'
                                      }}
                                      onMouseEnter={(e) => {
                                        e.target.style.backgroundColor = 'white';
                                        e.target.style.color = '#dc3545';
                                        e.target.style.borderColor = '#dc3545';
                                      }}
                                      onMouseLeave={(e) => {
                                        e.target.style.backgroundColor = '#dc3545';
                                        e.target.style.color = 'white';
                                        e.target.style.borderColor = '#dc3545';
                                      }}
                                    >
                                      <iconify-icon icon="mdi:delete" width="16" height="16"></iconify-icon>
                                      <span className="ms-1">Delete</span>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <i className="fas fa-calendar-times fa-3x text-muted mb-3"></i>
                        <h5 className="text-muted">No Attendance Records</h5>
                        <p className="text-muted">
                          No attendance records found for the selected period.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Leave Records Table */}
                {employeeReportData.leaveRecords && employeeReportData.leaveRecords.length > 0 && (
                  <div className="card border-0 shadow-sm mb-4">
                    <div
                      className="card-header"
                      style={{ backgroundColor: "#fd7e14", color: "white" }}
                    >
                      <h5 className="mb-0">
                        <i className="fas fa-calendar-minus me-2"></i>
                        Leave Records
                      </h5>
                    </div>
                    <div className="card-body p-0">
                      <div className="table-responsive">
                        <table className="table table-hover mb-0">
                          <thead className="table-light">
                            <tr>
                              <th className="text-nowrap">
                                <i className="fas fa-calendar-alt me-2"></i>
                                Start Date
                              </th>
                              <th className="text-nowrap">
                                <i className="fas fa-calendar-alt me-2"></i>
                                End Date
                              </th>
                              <th className="text-nowrap">
                                <i className="fas fa-tag me-2"></i>
                                Type
                              </th>
                              <th className="text-nowrap">
                                <i className="fas fa-comment me-2"></i>
                                Reason
                              </th>
                              <th className="text-nowrap">
                                <i className="fas fa-check-circle me-2"></i>
                                Status
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {employeeReportData.leaveRecords.map((leave, index) => (
                              <tr key={index}>
                                <td className="fw-medium">
                                  {new Date(leave.startDate).toLocaleDateString()}
                                </td>
                                <td className="fw-medium">
                                  {new Date(leave.endDate).toLocaleDateString()}
                                </td>
                                <td>
                                  <span
                                    className={`badge ${
                                      leave.leaveType === 'sick'
                                        ? 'bg-danger'
                                        : leave.leaveType === 'casual'
                                        ? 'bg-info'
                                        : 'bg-secondary'
                                    }`}
                                  >
                                    {leave.leaveType || 'N/A'}
                                  </span>
                                </td>
                                <td>
                                  {leave.reason || '-'}
                                </td>
                                <td>
                                  <span className="badge bg-success">
                                    {leave.status || 'approved'}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Employee Form Modal */}
      {showEmployeeForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingEmployee ? "Edit Employee" : "Add New Employee"}
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setShowEmployeeForm(false);
                    setEditingEmployee(null);
                    resetEmployeeForm();
                  }}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleEmployeeSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={employeeFormData.name}
                      onChange={(e) =>
                        setEmployeeFormData({
                          ...employeeFormData,
                          name: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Employee ID *
                    </label>
                    <input
                      type="text"
                      required
                      value={employeeFormData.employeeId}
                      onChange={(e) =>
                        setEmployeeFormData({
                          ...employeeFormData,
                          employeeId: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Department *
                    </label>
                    <select
                      required
                      value={employeeFormData.department}
                      onChange={(e) =>
                        setEmployeeFormData({
                          ...employeeFormData,
                          department: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Select Department</option>
                      <option value="IT">IT</option>
                      <option value="HR">HR</option>
                      <option value="Finance">Finance</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Operations">Operations</option>
                      <option value="Sales">Sales</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Designation *
                    </label>
                    <input
                      type="text"
                      required
                      value={employeeFormData.designation}
                      onChange={(e) =>
                        setEmployeeFormData({
                          ...employeeFormData,
                          designation: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={employeeFormData.email}
                      onChange={(e) =>
                        setEmployeeFormData({
                          ...employeeFormData,
                          email: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={employeeFormData.phone}
                      onChange={(e) =>
                        setEmployeeFormData({
                          ...employeeFormData,
                          phone: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <textarea
                      value={employeeFormData.address}
                      onChange={(e) =>
                        setEmployeeFormData({
                          ...employeeFormData,
                          address: e.target.value,
                        })
                      }
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Work Schedule
                    </label>
                    <input
                      type="text"
                      value={employeeFormData.workSchedule}
                      onChange={(e) =>
                        setEmployeeFormData({
                          ...employeeFormData,
                          workSchedule: e.target.value,
                        })
                      }
                      placeholder="e.g., 9:00-17:00"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Join Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={employeeFormData.joinDate}
                      onChange={(e) =>
                        setEmployeeFormData({
                          ...employeeFormData,
                          joinDate: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Intern Checkbox */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isIntern"
                    checked={employeeFormData.isIntern}
                    onChange={(e) =>
                      setEmployeeFormData({
                        ...employeeFormData,
                        isIntern: e.target.checked,
                      })
                    }
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="isIntern"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    This employee is an intern
                  </label>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEmployeeForm(false);
                      setEditingEmployee(null);
                      resetEmployeeForm();
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    {editingEmployee ? "Update" : "Add"} Employee
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Clock In/Out Form Modal */}
      {showClockForm && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content border-0 shadow-lg">
              <div
                className="modal-header"
                style={{ backgroundColor: "#245e99", color: "white" }}
              >
                <h5 className="modal-title">
                  <i className="fas fa-clock me-2"></i>
                  Clock In/Out
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => {
                    setShowClockForm(false);
                    setSelectedEmployee("");
                    setClockAction("in");
                    setClockTime(new Date().toTimeString().slice(0, 5));
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleClockSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-medium">
                      <i
                        className="fas fa-user me-2"
                        style={{ color: "#245e99" }}
                      ></i>
                      Select Employee *
                    </label>
                    <select
                      required
                      value={selectedEmployee}
                      onChange={(e) => setSelectedEmployee(e.target.value)}
                      className="form-select border-2"
                      style={{ borderColor: "#245e99" }}
                    >
                      <option value="">Choose Employee</option>
                      {employees.map((employee) => (
                        <option key={employee._id} value={employee._id}>
                          {employee.name} - {employee.employeeId}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-medium">
                      <i
                        className="fas fa-tasks me-2"
                        style={{ color: "#245e99" }}
                      ></i>
                      Action *
                    </label>
                    <div className="d-flex gap-4">
                      <div className="form-check">
                        <input
                          type="radio"
                          value="in"
                          checked={clockAction === "in"}
                          onChange={(e) => setClockAction(e.target.value)}
                          className="form-check-input"
                          id="clockIn"
                          style={{ borderColor: "#245e99" }}
                        />
                        <label className="form-check-label" htmlFor="clockIn">
                          <i className="fas fa-sign-in-alt me-1 text-success"></i>
                          Clock In
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          type="radio"
                          value="out"
                          checked={clockAction === "out"}
                          onChange={(e) => setClockAction(e.target.value)}
                          className="form-check-input"
                          id="clockOut"
                          style={{ borderColor: "#245e99" }}
                        />
                        <label className="form-check-label" htmlFor="clockOut">
                          <i className="fas fa-sign-out-alt me-1 text-warning"></i>
                          Clock Out
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-medium">
                      <i
                        className="fas fa-clock me-2"
                        style={{ color: "#245e99" }}
                      ></i>
                      Time *
                    </label>
                    <input
                      type="time"
                      required
                      value={clockTime}
                      onChange={(e) => setClockTime(e.target.value)}
                      className="form-control border-2"
                      style={{ borderColor: "#245e99" }}
                    />
                    <div className="form-text">
                      <i className="fas fa-info-circle me-1"></i>
                      Current time: {new Date().toLocaleTimeString()}
                    </div>
                  </div>

                  <div className="d-flex justify-content-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowClockForm(false);
                        setSelectedEmployee("");
                        setClockAction("in");
                        setClockTime(new Date().toTimeString().slice(0, 5));
                      }}
                      className="btn btn-outline-secondary"
                    >
                      <i className="fas fa-times me-1"></i>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-success">
                      <i
                        className={`fas ${
                          clockAction === "in"
                            ? "fa-sign-in-alt"
                            : "fa-sign-out-alt"
                        } me-1`}
                      ></i>
                      Record {clockAction === "in" ? "Clock In" : "Clock Out"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Leave Form Modal */}
      {showLeaveForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 lg:w-1/3 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Apply for Leave
              </h3>
              <form onSubmit={handleLeaveSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Employee *
                  </label>
                  <select
                    required
                    value={leaveFormData.employeeId}
                    onChange={(e) =>
                      setLeaveFormData({
                        ...leaveFormData,
                        employeeId: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Choose Employee</option>
                    {employees.map((employee) => (
                      <option key={employee._id} value={employee._id}>
                        {employee.name} - {employee.employeeId}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Leave Type *
                  </label>
                  <select
                    required
                    value={leaveFormData.leaveType}
                    onChange={(e) =>
                      setLeaveFormData({
                        ...leaveFormData,
                        leaveType: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="sick">Sick Leave</option>
                    <option value="casual">Casual Leave</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={leaveFormData.startDate}
                      onChange={(e) =>
                        setLeaveFormData({
                          ...leaveFormData,
                          startDate: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={leaveFormData.endDate}
                      onChange={(e) =>
                        setLeaveFormData({
                          ...leaveFormData,
                          endDate: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reason *
                  </label>
                  <textarea
                    required
                    value={leaveFormData.reason}
                    onChange={(e) =>
                      setLeaveFormData({
                        ...leaveFormData,
                        reason: e.target.value,
                      })
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Please provide reason for leave"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowLeaveForm(false);
                      setLeaveFormData({
                        employeeId: "",
                        leaveType: "sick",
                        startDate: new Date().toISOString().split("T")[0],
                        endDate: new Date().toISOString().split("T")[0],
                        reason: "",
                      });
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
                  >
                    Submit Leave Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Attendance Form Modal */}
      {showEditAttendanceForm && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content border-0 shadow-lg">
              <div
                className="modal-header"
                style={{ backgroundColor: "#245e99", color: "white" }}
              >
                <h5 className="modal-title">
                  <i className="fas fa-edit me-2"></i>
                  Edit Attendance Record
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => {
                    setShowEditAttendanceForm(false);
                    setEditingAttendance(null);
                    setEditAttendanceData({
                      clockIn: "",
                      clockOut: "",
                      status: "on time",
                    });
                  }}
                ></button>
              </div>
              <div className="modal-body">
                {editingAttendance && (
                  <div
                    className="mb-3 p-3 border rounded"
                    style={{ backgroundColor: "#f8f9fa" }}
                  >
                    <h6 className="mb-2">
                      <i
                        className="fas fa-user me-2"
                        style={{ color: "#245e99" }}
                      ></i>
                      Employee:{" "}
                      {employees.find(
                        (emp) => emp._id === editingAttendance.employeeId
                      )?.name || "Unknown"}
                    </h6>
                    <p className="mb-0 text-muted">
                      <i className="fas fa-calendar me-2"></i>
                      Date:{" "}
                      {new Date(editingAttendance.date).toLocaleDateString()}
                    </p>
                  </div>
                )}
                <form onSubmit={handleEditAttendanceSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-medium">
                        <i className="fas fa-sign-in-alt me-2 text-success"></i>
                        Clock In Time
                      </label>
                      <input
                        type="time"
                        value={editAttendanceData.clockIn}
                        onChange={(e) =>
                          setEditAttendanceData({
                            ...editAttendanceData,
                            clockIn: e.target.value,
                          })
                        }
                        className="form-control border-2"
                        style={{ borderColor: "#245e99" }}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-medium">
                        <i className="fas fa-sign-out-alt me-2 text-warning"></i>
                        Clock Out Time
                      </label>
                      <input
                        type="time"
                        value={editAttendanceData.clockOut}
                        onChange={(e) =>
                          setEditAttendanceData({
                            ...editAttendanceData,
                            clockOut: e.target.value,
                          })
                        }
                        className="form-control border-2"
                        style={{ borderColor: "#245e99" }}
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-medium">
                      <i
                        className="fas fa-user-check me-2"
                        style={{ color: "#245e99" }}
                      ></i>
                      Status *
                    </label>
                    <select
                      value={editAttendanceData.status}
                      onChange={(e) =>
                        setEditAttendanceData({
                          ...editAttendanceData,
                          status: e.target.value,
                        })
                      }
                      className="form-select border-2"
                      style={{ borderColor: "#245e99" }}
                    >
                      <option value="on time">On Time</option>
                      <option value="late">Late</option>
                      <option value="absent">Absent</option>
                      <option value="casual leave">Casual Leave</option>
                      <option value="sick leave">Sick Leave</option>
                      <option value="government vacation">
                        Government Vacation
                      </option>
                    </select>
                  </div>

                  <div className="d-flex justify-content-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowEditAttendanceForm(false);
                        setEditingAttendance(null);
                        setEditAttendanceData({
                          clockIn: "",
                          clockOut: "",
                          status: "on time",
                        });
                      }}
                      className="btn btn-outline-secondary"
                    >
                      <i className="fas fa-times me-1"></i>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-success">
                      <i className="fas fa-save me-1"></i>
                      Update Record
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Manual Time Entry Form Modal */}
      {showManualTimeForm && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
            <div className="modal-content border-0 shadow-lg">
              <div
                className="modal-header"
                style={{ backgroundColor: "#245e99", color: "white" }}
              >
                <h5 className="modal-title">
                  <i className="fas fa-history me-2"></i>
                  Manual Time Entry
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => {
                    setShowManualTimeForm(false);
                    resetManualTimeForm();
                  }}
                ></button>
              </div>
              <div className="modal-body">
                {/* Mode Toggle */}
                <div className="mb-4">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="bulkModeToggle"
                      checked={bulkTimeEntry.isBulkMode}
                      onChange={handleBulkModeToggle}
                    />
                    <label className="form-check-label fw-medium" htmlFor="bulkModeToggle">
                      <i className="fas fa-calendar-alt me-2" style={{ color: "#245e99" }}></i>
                      Bulk Date Range Entry
                    </label>
                  </div>
                  <small className="text-muted">
                    {bulkTimeEntry.isBulkMode 
                      ? "Add time entries for multiple dates at once" 
                      : "Add time entry for a single date"}
                  </small>
                </div>

                <form onSubmit={bulkTimeEntry.isBulkMode ? handleBulkTimeSubmit : handleManualTimeSubmit}>
                  <div className="row">
                    <div className="col-12 col-md-6 mb-3">
                      <label className="form-label fw-medium">
                        <i
                          className="fas fa-user me-2"
                          style={{ color: "#245e99" }}
                        ></i>
                        Employee *
                      </label>
                      <select
                        required
                        value={bulkTimeEntry.isBulkMode ? bulkTimeEntry.employeeId : manualTimeFormData.employeeId}
                        onChange={(e) => {
                          if (bulkTimeEntry.isBulkMode) {
                            handleDateRangeChange('employeeId', e.target.value);
                          } else {
                            setManualTimeFormData({
                              ...manualTimeFormData,
                              employeeId: e.target.value,
                            });
                          }
                        }}
                        className="form-select border-2"
                        style={{ borderColor: "#245e99" }}
                      >
                        <option value="">Select Employee</option>
                        {employees.map((employee) => (
                          <option key={employee._id} value={employee._id}>
                            {employee.name} - {employee.employeeId}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    {/* Date Selection - Single or Range */}
                    {bulkTimeEntry.isBulkMode ? (
                      <>
                        <div className="col-12 col-md-3 mb-3">
                          <label className="form-label fw-medium">
                            <i
                              className="fas fa-calendar me-2"
                              style={{ color: "#245e99" }}
                            ></i>
                            Start Date *
                          </label>
                          <input
                            type="date"
                            required
                            value={bulkTimeEntry.startDate}
                            onChange={(e) => handleDateRangeChange('startDate', e.target.value)}
                            className="form-control border-2"
                            style={{ borderColor: "#245e99" }}
                            max={new Date().toISOString().split("T")[0]}
                          />
                        </div>
                        <div className="col-12 col-md-3 mb-3">
                          <label className="form-label fw-medium">
                            <i
                              className="fas fa-calendar me-2"
                              style={{ color: "#245e99" }}
                            ></i>
                            End Date *
                          </label>
                          <input
                            type="date"
                            required
                            value={bulkTimeEntry.endDate}
                            onChange={(e) => handleDateRangeChange('endDate', e.target.value)}
                            className="form-control border-2"
                            style={{ borderColor: "#245e99" }}
                            max={new Date().toISOString().split("T")[0]}
                            min={bulkTimeEntry.startDate}
                          />
                        </div>
                      </>
                    ) : (
                      <div className="col-12 col-md-6 mb-3">
                        <label className="form-label fw-medium">
                          <i
                            className="fas fa-calendar me-2"
                            style={{ color: "#245e99" }}
                          ></i>
                          Date *
                        </label>
                        <input
                          type="date"
                          required
                          value={manualTimeFormData.date}
                          onChange={(e) =>
                            setManualTimeFormData({
                              ...manualTimeFormData,
                              date: e.target.value,
                            })
                          }
                          className="form-control border-2"
                          style={{ borderColor: "#245e99" }}
                          max={new Date().toISOString().split("T")[0]}
                        />
                      </div>
                    )}
                  </div>

                  {/* Bulk Date Entries or Single Time Entry */}
                  {bulkTimeEntry.isBulkMode ? (
                    <div className="mb-4">
                      <h6 className="fw-medium mb-3">
                        <i className="fas fa-list me-2" style={{ color: "#245e99" }}></i>
                        Time Entries ({bulkTimeEntry.dateEntries.length} days)
                      </h6>
                      <div className="border rounded p-3" style={{ maxHeight: "300px", overflowY: "auto" }}>
                        {bulkTimeEntry.dateEntries.map((entry, index) => (
                          <div key={entry.date} className="row align-items-center mb-3 pb-3 border-bottom">
                            <div className="col-md-3">
                              <label className="form-label fw-medium small">
                                <i className="fas fa-calendar me-1" style={{ color: "#245e99" }}></i>
                                {new Date(entry.date).toLocaleDateString()}
                              </label>
                            </div>
                            <div className="col-md-3">
                              <label className="form-label small">Clock In *</label>
                              <input
                                type="time"
                                required
                                value={entry.clockIn}
                                onChange={(e) => updateDateEntry(index, 'clockIn', e.target.value)}
                                className="form-control form-control-sm border-2"
                                style={{ borderColor: "#245e99" }}
                              />
                            </div>
                            <div className="col-md-3">
                              <label className="form-label small">Clock Out *</label>
                              <input
                                type="time"
                                required
                                value={entry.clockOut}
                                onChange={(e) => updateDateEntry(index, 'clockOut', e.target.value)}
                                className="form-control form-control-sm border-2"
                                style={{ borderColor: "#245e99" }}
                              />
                            </div>
                            <div className="col-md-3">
                              <label className="form-label small">Break (min)</label>
                              <input
                                type="number"
                                min="0"
                                max="480"
                                value={entry.breakDuration}
                                onChange={(e) => updateDateEntry(index, 'breakDuration', parseInt(e.target.value) || 0)}
                                className="form-control form-control-sm border-2"
                                style={{ borderColor: "#245e99" }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="row">
                      <div className="col-12 col-md-6 mb-3">
                        <label className="form-label fw-medium">
                          <i className="fas fa-sign-in-alt me-2 text-success"></i>
                          Clock In Time *
                        </label>
                        <input
                          type="time"
                          required
                          value={manualTimeFormData.clockIn}
                          onChange={(e) =>
                            setManualTimeFormData({
                              ...manualTimeFormData,
                              clockIn: e.target.value,
                            })
                          }
                          className="form-control border-2"
                          style={{ borderColor: "#245e99" }}
                        />
                      </div>
                      <div className="col-12 col-md-6 mb-3">
                        <label className="form-label fw-medium">
                          <i className="fas fa-sign-out-alt me-2 text-warning"></i>
                          Clock Out Time *
                        </label>
                        <input
                          type="time"
                          required
                          value={manualTimeFormData.clockOut}
                          onChange={(e) =>
                            setManualTimeFormData({
                              ...manualTimeFormData,
                              clockOut: e.target.value,
                            })
                          }
                          className="form-control border-2"
                          style={{ borderColor: "#245e99" }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Break Duration and Reason - Only for Single Mode */}
                  {!bulkTimeEntry.isBulkMode && (
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-medium">
                          <i className="fas fa-coffee me-2 text-info"></i>
                          Break Duration (minutes)
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="480"
                          value={manualTimeFormData.breakDuration}
                          onChange={(e) =>
                            setManualTimeFormData({
                              ...manualTimeFormData,
                              breakDuration: parseInt(e.target.value) || 0,
                            })
                          }
                          className="form-control border-2"
                          style={{ borderColor: "#245e99" }}
                        />
                        <div className="form-text">
                          <i className="fas fa-info-circle me-1"></i>
                          Default: 60 minutes
                        </div>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-medium">
                          <i
                            className="fas fa-question-circle me-2"
                            style={{ color: "#245e99" }}
                          ></i>
                          Reason
                        </label>
                        <select
                          value={manualTimeFormData.reason}
                          onChange={(e) =>
                            setManualTimeFormData({
                              ...manualTimeFormData,
                              reason: e.target.value,
                            })
                          }
                          className="form-select border-2"
                          style={{ borderColor: "#245e99" }}
                        >
                          <option value="">Select Reason</option>
                          <option value="forgot_to_clock">
                            Forgot to Clock In/Out
                          </option>
                          <option value="system_error">System Error</option>
                          <option value="remote_work">Remote Work</option>
                          <option value="field_work">Field Work</option>
                          <option value="meeting_offsite">
                            Off-site Meeting
                          </option>
                          <option value="admin_correction">
                            Administrative Correction
                          </option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Bulk Mode - Common Reason and Notes */}
                  {bulkTimeEntry.isBulkMode && (
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-medium">
                          <i
                            className="fas fa-question-circle me-2"
                            style={{ color: "#245e99" }}
                          ></i>
                          Reason (applies to all dates)
                        </label>
                        <select
                          value={bulkTimeEntry.reason}
                          onChange={(e) => handleDateRangeChange('reason', e.target.value)}
                          className="form-select border-2"
                          style={{ borderColor: "#245e99" }}
                        >
                          <option value="">Select Reason</option>
                          <option value="forgot_to_clock">
                            Forgot to Clock In/Out
                          </option>
                          <option value="system_error">System Error</option>
                          <option value="remote_work">Remote Work</option>
                          <option value="field_work">Field Work</option>
                          <option value="meeting_offsite">
                            Off-site Meeting
                          </option>
                          <option value="admin_correction">
                            Administrative Correction
                          </option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                  )}

                  <div className="mb-4">
                    <label className="form-label fw-medium">
                      <i className="fas fa-sticky-note me-2 text-secondary"></i>
                      Additional Notes {bulkTimeEntry.isBulkMode && '(applies to all dates)'}
                    </label>
                    <textarea
                      value={bulkTimeEntry.isBulkMode ? bulkTimeEntry.notes : manualTimeFormData.notes}
                      onChange={(e) => {
                        if (bulkTimeEntry.isBulkMode) {
                          handleDateRangeChange('notes', e.target.value);
                        } else {
                          setManualTimeFormData({
                            ...manualTimeFormData,
                            notes: e.target.value,
                          });
                        }
                      }}
                      rows={3}
                      className="form-control border-2"
                      style={{ borderColor: "#245e99" }}
                      placeholder="Any additional details or explanations..."
                    />
                  </div>

                  <div className="d-flex justify-content-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowManualTimeForm(false);
                        resetManualTimeForm();
                        resetBulkTimeForm();
                      }}
                      className="btn btn-outline-secondary"
                    >
                      <i className="fas fa-times me-1"></i>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-success">
                      <i className={`fas ${bulkTimeEntry.isBulkMode ? 'fa-calendar-plus' : 'fa-save'} me-1`}></i>
                      {bulkTimeEntry.isBulkMode 
                        ? `Add ${bulkTimeEntry.dateEntries.length} Time Entries` 
                        : 'Add Time Entry'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Report Edit Modal */}
      {showReportEditForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Edit Attendance Record
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setShowReportEditForm(false);
                    setEditingReportRecord(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleReportEditSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Clock In Time
                    </label>
                    <input
                      type="time"
                      value={reportEditData.clockIn}
                      onChange={(e) =>
                        setReportEditData({
                          ...reportEditData,
                          clockIn: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Clock Out Time
                    </label>
                    <input
                      type="time"
                      value={reportEditData.clockOut}
                      onChange={(e) =>
                        setReportEditData({
                          ...reportEditData,
                          clockOut: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
                
                {editingReportRecord?.entryType !== 'manual' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={reportEditData.status}
                      onChange={(e) =>
                        setReportEditData({
                          ...reportEditData,
                          status: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="on time">On Time</option>
                      <option value="late">Late</option>
                      <option value="absent">Absent</option>
                      <option value="present">Present</option>
                      <option value="half day">Half Day</option>
                    </select>
                  </div>
                )}
                
                {editingReportRecord?.entryType === 'manual' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        value={reportEditData.description}
                        onChange={(e) =>
                          setReportEditData({
                            ...reportEditData,
                            description: e.target.value,
                          })
                        }
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Enter description..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Project Name
                      </label>
                      <input
                        type="text"
                        value={reportEditData.projectName}
                        onChange={(e) =>
                          setReportEditData({
                            ...reportEditData,
                            projectName: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Enter project name..."
                      />
                    </div>
                  </>
                )}
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowReportEditForm(false);
                      setEditingReportRecord(null);
                    }}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    Update Record
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h3 className="text-lg leading-6 font-medium text-gray-900 mt-2">
                Delete Record
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete this attendance record? This action cannot be undone.
                </p>
                {recordToDelete && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-md">
                    <p className="text-sm font-medium text-gray-700">
                      Date: {new Date(recordToDelete.date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      Type: {recordToDelete.entryType === 'manual' ? 'Manual Entry' : 'Regular'}
                    </p>
                  </div>
                )}
              </div>
              <div className="flex justify-center space-x-3 px-4 py-3">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setRecordToDelete(null);
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteRecord}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* HR-specific color overrides */}
      <style jsx>{`
        :global(.text-primary) {
          color: #245e99 !important;
        }
        :global(.bg-primary) {
          background-color: #245e99 !important;
        }
        :global(.border-primary) {
          border-color: #245e99 !important;
        }
        :global(.btn-primary) {
          background-color: #245e99 !important;
          border-color: #245e99 !important;
          color: #ffffff !important;
        }
        :global(.btn-primary:hover) {
          background-color: transparent !important;
          border-color: #245e99 !important;
          color: #245e99 !important;
        }
        :global(.text-success) {
          color: #245e99 !important;
        }
        :global(.bg-success) {
          background-color: #245e99 !important;
        }
        :global(.btn-success) {
          background-color: #245e99 !important;
          border-color: #245e99 !important;
          color: #ffffff !important;
        }
        :global(.btn-success:hover) {
          background-color: transparent !important;
          border-color: #245e99 !important;
          color: #245e99 !important;
        }
        :global(.progress-bar.bg-success) {
          background-color: #245e99 !important;
        }
        :global(.spinner-border.text-primary) {
          color: #245e99 !important;
        }
        :global(.btn) {
          background-color: #245e99 !important;
          border-color: #245e99 !important;
          color: #ffffff !important;
        }
        :global(.btn:hover) {
          background-color: transparent !important;
          border-color: #245e99 !important;
          color: #245e99 !important;
        }
      `}</style>
    </div>
  );
}

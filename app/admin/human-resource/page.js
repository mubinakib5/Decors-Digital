"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";

export default function HumanResourcePage() {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard"); // dashboard, employees, attendance, leaves, reports
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);
  const [showClockForm, setShowClockForm] = useState(false);
  const [showLeaveForm, setShowLeaveForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [clockAction, setClockAction] = useState("in"); // in or out
  const [clockTime, setClockTime] = useState(new Date().toTimeString().slice(0, 5));
  const [editingAttendance, setEditingAttendance] = useState(null);
  const [showEditAttendanceForm, setShowEditAttendanceForm] = useState(false);
  const [editAttendanceData, setEditAttendanceData] = useState({
    clockIn: '',
    clockOut: '',
    status: 'on time'
  }); // HH:MM format
  const [reportType, setReportType] = useState("daily"); // daily, weekly, monthly
  const [reportDate, setReportDate] = useState(new Date().toISOString().split("T")[0]);
  
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
  });

  const [leaveFormData, setLeaveFormData] = useState({
    employeeId: "",
    leaveType: "sick", // sick, casual
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
    reason: "",
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
      const response = await fetch("/api/admin/auth-check");
      if (!response.ok) {
        router.push("/admin/login");
        return;
      }
    } catch (error) {
      router.push("/admin/login");
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      // Load employees, attendance, and leaves data
      const [employeesRes, attendanceRes, leavesRes] = await Promise.all([
        fetch("/api/admin/employees"),
        fetch("/api/admin/attendance"),
        fetch("/api/admin/leaves"),
      ]);

      if (employeesRes.ok) {
        const employeesData = await employeesRes.json();
        setEmployees(employeesData);
      }

      if (attendanceRes.ok) {
        const attendanceData = await attendanceRes.json();
        setAttendance(attendanceData);
      }

      if (leavesRes.ok) {
        const leavesData = await leavesRes.json();
        setLeaves(leavesData);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
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
    });
  };

  // Clock In/Out Functions
  const handleClockSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create timestamp with custom time
      const today = new Date();
      const [hours, minutes] = clockTime.split(':');
      const customDateTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), parseInt(hours), parseInt(minutes));
      
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
    setEditingAttendance(record);
    setEditAttendanceData({
      clockIn: record.clockIn ? new Date(record.clockIn).toTimeString().slice(0, 5) : '',
      clockOut: record.clockOut ? new Date(record.clockOut).toTimeString().slice(0, 5) : '',
      status: record.status
    });
    setShowEditAttendanceForm(true);
  };

  const handleEditAttendanceSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const today = new Date(editingAttendance.date);
      let clockInDateTime = null;
      let clockOutDateTime = null;
      
      if (editAttendanceData.clockIn) {
        const [inHours, inMinutes] = editAttendanceData.clockIn.split(':');
        clockInDateTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), parseInt(inHours), parseInt(inMinutes));
      }
      
      if (editAttendanceData.clockOut) {
        const [outHours, outMinutes] = editAttendanceData.clockOut.split(':');
        clockOutDateTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), parseInt(outHours), parseInt(outMinutes));
      }

      const response = await fetch("/api/admin/attendance", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId: editingAttendance.employeeId,
          date: editingAttendance.date,
          clockIn: clockInDateTime ? clockInDateTime.toISOString() : null,
          clockOut: clockOutDateTime ? clockOutDateTime.toISOString() : null,
          status: editAttendanceData.status
        }),
      });

      if (response.ok) {
        showToast("Attendance record updated successfully!");
        setShowEditAttendanceForm(false);
        setEditingAttendance(null);
        setEditAttendanceData({ clockIn: '', clockOut: '', status: 'on time' });
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

  // Update attendance status from 'present' to 'on time'
  const updateAttendanceStatus = async () => {
    try {
      const response = await fetch('/api/admin/update-attendance-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const result = await response.json();
        showToast(`Updated ${result.modifiedCount} attendance records successfully!`);
        loadData(); // Reload data to reflect changes
      } else {
        const error = await response.json();
        showToast(error.message || "Error updating attendance records", "error");
      }
    } catch (error) {
      console.error('Error updating attendance status:', error);
      showToast("Error updating attendance records", "error");
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
    doc.text(`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Attendance Report`, 20, 20);
    doc.setFontSize(12);
    doc.text(`Date: ${reportDate}`, 20, 35);
    
    let yPosition = 50;
    reportData.forEach((record, index) => {
      const employee = employees.find(emp => emp._id === record.employeeId);
      const employeeName = employee ? employee.name : 'Unknown';
      
      doc.text(`${employeeName} - ${record.status} - ${new Date(record.clockIn || record.date).toLocaleString()}`, 20, yPosition);
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
    const excelData = reportData.map(record => {
      const employee = employees.find(emp => emp._id === record.employeeId);
      return {
        'Employee Name': employee ? employee.name : 'Unknown',
        'Employee ID': employee ? employee.employeeId : 'Unknown',
        'Date': new Date(record.date).toLocaleDateString(),
        'Status': record.status,
        'Clock In': record.clockIn ? new Date(record.clockIn).toLocaleTimeString() : 'N/A',
        'Clock Out': record.clockOut ? new Date(record.clockOut).toLocaleTimeString() : 'N/A',
        'Overtime Hours': record.overtimeHours || 0
      };
    });
    
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Attendance Report');
    XLSX.writeFile(wb, `attendance-report-${reportType}-${reportDate}.xlsx`);
    showToast("Excel report generated successfully");
  };

  // Get today's attendance summary
  const getTodayStats = () => {
    const today = new Date().toDateString();
    const todayAttendance = attendance.filter(
      (record) => new Date(record.date).toDateString() === today
    );
    
    const onTime = todayAttendance.filter(record => record.status === 'on time').length;
    const late = todayAttendance.filter(record => record.status === 'late').length;
    const absent = employees.length - todayAttendance.length;
    
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
            toast.type === "success"
              ? "bg-success text-white"
              : "bg-danger text-white"
          }`}
          style={{ zIndex: 9999, minWidth: "300px" }}
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
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h1 className="h3 mb-0">Human Resource Management</h1>
        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => router.push("/admin/expenses")}
          >
            <i className="bi bi-arrow-left me-1"></i>
            Back to Expenses
          </button>
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => {
              fetch("/api/admin/logout", { method: "POST" });
              router.push("/admin/login");
            }}
          >
            <i className="bi bi-box-arrow-right me-1"></i>
            Logout
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <ul
          className="nav nav-tabs"
          id="hrTabs"
          role="tablist"
          style={{ borderBottomColor: "#ff0000", marginBottom: "0" }}
        >
          {[
            { id: "dashboard", name: "Dashboard" },
            { id: "employees", name: "Employees" },
            { id: "attendance", name: "Attendance" },
            { id: "leaves", name: "Leave Management" },
            { id: "reports", name: "Reports" },
          ].map((tab) => (
            <li className="nav-item" role="presentation" key={tab.id}>
              <button
                className={`nav-link ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  color: activeTab === tab.id ? "#ffffff" : "#ff0000",
                  backgroundColor:
                    activeTab === tab.id ? "#ff0000" : "transparent",
                  borderColor: "#ff0000",
                  borderBottomColor:
                    activeTab === tab.id ? "#ff0000" : "transparent",
                }}
              >
                {tab.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="tab-content">
        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div className="tab-pane fade show active">
            {/* Stats Cards */}
            <div className="row g-4 mb-4">
              <div className="col-md-3">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body d-flex align-items-center">
                    <div className="flex-shrink-0 me-3">
                      <div 
                        className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                        style={{ width: "48px", height: "48px", backgroundColor: "#28a745" }}
                      >
                        {stats.onTime}
                      </div>
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="card-subtitle mb-1 text-muted">On Time Today</h6>
                      <h5 className="card-title mb-0">{stats.onTime} employees</h5>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-3">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body d-flex align-items-center">
                    <div className="flex-shrink-0 me-3">
                      <div 
                        className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                        style={{ width: "48px", height: "48px", backgroundColor: "#dc3545" }}
                      >
                        {stats.absent}
                      </div>
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="card-subtitle mb-1 text-muted">Absent Today</h6>
                      <h5 className="card-title mb-0">{stats.absent} employees</h5>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-3">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body d-flex align-items-center">
                    <div className="flex-shrink-0 me-3">
                      <div 
                        className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                        style={{ width: "48px", height: "48px", backgroundColor: "#ffc107" }}
                      >
                        {stats.late}
                      </div>
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="card-subtitle mb-1 text-muted">Late Today (After 10:45 AM)</h6>
                      <h5 className="card-title mb-0">{stats.late} employees</h5>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-3">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body d-flex align-items-center">
                    <div className="flex-shrink-0 me-3">
                      <div 
                        className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                        style={{ width: "48px", height: "48px", backgroundColor: "#007bff" }}
                      >
                        {stats.total}
                      </div>
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="card-subtitle mb-1 text-muted">Total Employees</h6>
                      <h5 className="card-title mb-0">{stats.total} employees</h5>
                    </div>
                  </div>
                </div>
                <div className="row g-3 mt-2">
                  <div className="col-md-4">
                    <button
                      onClick={updateAttendanceStatus}
                      className="btn btn-warning w-100"
                    >
                      <i className="fas fa-sync-alt me-2"></i>
                      Update Status Records
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h5 className="card-title mb-4" style={{ color: "#dc3545" }}>Quick Actions</h5>
                <div className="row g-3">
                  <div className="col-md-4">
                    <button
                      onClick={() => {
                        setShowEmployeeForm(true);
                        setEditingEmployee(null);
                        resetEmployeeForm();
                      }}
                      className="btn w-100"
                      style={{ backgroundColor: "#dc3545", borderColor: "#dc3545", color: "white" }}
                    >
                      <i className="fas fa-user-plus me-2"></i>
                      Add New Employee
                    </button>
                  </div>
                  <div className="col-md-4">
                    <button
                      onClick={() => setShowClockForm(true)}
                      className="btn btn-outline-danger w-100"
                    >
                      <i className="fas fa-clock me-2"></i>
                      Clock In/Out
                    </button>
                  </div>
                  <div className="col-md-4">
                    <button
                      onClick={() => setShowLeaveForm(true)}
                      className="btn btn-outline-danger w-100"
                    >
                      <i className="fas fa-calendar-alt me-2"></i>
                      Apply Leave
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h5 className="card-title mb-4" style={{ color: "#dc3545" }}>Recent Activity</h5>
                <div className="list-group list-group-flush">
                  {attendance.slice(0, 5).map((record, index) => {
                    const employee = employees.find(emp => emp._id === record.employeeId);
                    return (
                      <div key={index} className="list-group-item d-flex justify-content-between align-items-start border-0 px-0">
                        <div className="ms-2 me-auto">
                          <div className="fw-bold">
                            {employee ? employee.name : 'Unknown Employee'}
                          </div>
                          <small className="text-muted">
                            {record.status} - {new Date(record.date).toLocaleDateString()}
                          </small>
                        </div>
                        <small className="text-muted">
                          {record.clockIn && new Date(record.clockIn).toLocaleTimeString()}
                        </small>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Employees Tab */}
        {activeTab === "employees" && (
          <div className="tab-pane fade show active">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="h3 mb-0" style={{ color: "#dc3545" }}>Employee Management</h2>
              <button
                onClick={() => {
                  setShowEmployeeForm(true);
                  setEditingEmployee(null);
                  resetEmployeeForm();
                }}
                className="btn"
                style={{ backgroundColor: "#dc3545", borderColor: "#dc3545", color: "white" }}
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
                            style={{ width: "48px", height: "48px", backgroundColor: "#dc3545" }}
                          >
                            {employee.name.charAt(0).toUpperCase()}
                          </div>
                        </div>
                        <div className="flex-grow-1">
                          <h6 className="card-title mb-1" style={{ color: "#dc3545" }}>
                            {employee.name}
                          </h6>
                          <small className="text-muted">ID: {employee.employeeId}</small>
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
                            setEmployeeFormData(employee);
                            setShowEmployeeForm(true);
                          }}
                          className="btn btn-outline-danger btn-sm flex-fill"
                        >
                          <i className="fas fa-edit me-1"></i>
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteEmployee(employee._id)}
                          className="btn btn-outline-danger btn-sm flex-fill"
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
              <h2 className="h3 mb-0" style={{ color: "#dc3545" }}>Attendance Management</h2>
              <button
                onClick={() => setShowClockForm(true)}
                className="btn"
                style={{ backgroundColor: "#dc3545", borderColor: "#dc3545", color: "white" }}
              >
                <i className="fas fa-clock me-2"></i>
                Clock In/Out
              </button>
            </div>

            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h5 className="card-title mb-4" style={{ color: "#dc3545" }}>Today's Attendance</h5>
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
                      </tr>
                    </thead>
                    <tbody>
                      {attendance
                        .filter(record => 
                          new Date(record.date).toDateString() === new Date().toDateString()
                        )
                        .map((record, index) => {
                          const employee = employees.find(emp => emp._id === record.employeeId);
                          return (
                            <tr key={index}>
                              <td className="fw-medium">
                                {employee ? employee.name : 'Unknown'}
                              </td>
                              <td>
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  record.status === 'on time' ? 'bg-green-500 text-white' :
                                  record.status === 'late' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {record.status}
                                </span>
                              </td>
                              <td>
                                {record.clockIn ? new Date(record.clockIn).toLocaleTimeString() : 'N/A'}
                              </td>
                              <td>
                                {record.clockOut ? new Date(record.clockOut).toLocaleTimeString() : 'N/A'}
                              </td>
                              <td>
                                {record.overtimeHours || 0} hours
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
              <h2 className="h3 mb-0" style={{ color: "#dc3545" }}>Leave Management</h2>
              <button
                onClick={() => setShowLeaveForm(true)}
                className="btn"
                style={{ backgroundColor: "#dc3545", borderColor: "#dc3545", color: "white" }}
              >
                <i className="fas fa-calendar-plus me-2"></i>
                Apply Leave
              </button>
            </div>

            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h5 className="card-title mb-4" style={{ color: "#dc3545" }}>Leave Requests</h5>
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
                        const employee = employees.find(emp => emp._id === leave.employeeId);
                        return (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {employee ? employee.name : 'Unknown'}
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
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                leave.status === 'approved' ? 'bg-green-100 text-green-800' :
                                leave.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {leave.status || 'pending'}
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

        {/* Reports Tab */}
        {activeTab === "reports" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Reports</h2>
            
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Generate Report</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Report Type
                    </label>
                    <select
                      value={reportType}
                      onChange={(e) => setReportType(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      value={reportDate}
                      onChange={(e) => setReportDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  <div className="flex items-end space-x-2">
                    <button
                      onClick={exportToPDF}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
                    >
                      Export PDF
                    </button>
                    <button
                      onClick={exportToExcel}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                    >
                      Export Excel
                    </button>
                  </div>
                </div>
                
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-sm text-blue-800">
                    <i className="fas fa-info-circle me-2"></i>
                    <strong>Note:</strong> Employees are marked as "Late" if they clock in after 10:45 AM.
                  </p>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Employee
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Clock In
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Clock Out
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Overtime
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {generateReport().map((record, index) => {
                        const employee = employees.find(emp => emp._id === record.employeeId);
                        return (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {employee ? employee.name : 'Unknown'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {new Date(record.date).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                record.status === 'on time' ? 'bg-green-500 text-white' :
                                record.status === 'late' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {record.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {record.clockIn ? new Date(record.clockIn).toLocaleTimeString() : 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {record.clockOut ? new Date(record.clockOut).toLocaleTimeString() : 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {record.overtimeHours || 0} hours
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => handleEditAttendance(record)}
                                className="text-indigo-600 hover:text-indigo-900 mr-3"
                              >
                                <i className="fas fa-edit"></i> Edit
                              </button>
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
      </div>

      {/* Employee Form Modal */}
      {showEmployeeForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingEmployee ? "Edit Employee" : "Add New Employee"}
              </h3>
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
                      onChange={(e) => setEmployeeFormData({...employeeFormData, name: e.target.value})}
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
                      onChange={(e) => setEmployeeFormData({...employeeFormData, employeeId: e.target.value})}
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
                      onChange={(e) => setEmployeeFormData({...employeeFormData, department: e.target.value})}
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
                      onChange={(e) => setEmployeeFormData({...employeeFormData, designation: e.target.value})}
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
                      onChange={(e) => setEmployeeFormData({...employeeFormData, email: e.target.value})}
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
                      onChange={(e) => setEmployeeFormData({...employeeFormData, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <textarea
                      value={employeeFormData.address}
                      onChange={(e) => setEmployeeFormData({...employeeFormData, address: e.target.value})}
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
                      onChange={(e) => setEmployeeFormData({...employeeFormData, workSchedule: e.target.value})}
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
                      onChange={(e) => setEmployeeFormData({...employeeFormData, joinDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
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
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header" style={{ backgroundColor: '#dc3545', color: 'white' }}>
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
                      <i className="fas fa-user me-2 text-danger"></i>
                      Select Employee *
                    </label>
                    <select
                      required
                      value={selectedEmployee}
                      onChange={(e) => setSelectedEmployee(e.target.value)}
                      className="form-select border-2"
                      style={{ borderColor: '#dc3545' }}
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
                      <i className="fas fa-tasks me-2 text-danger"></i>
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
                          style={{ borderColor: '#dc3545' }}
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
                          style={{ borderColor: '#dc3545' }}
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
                      <i className="fas fa-clock me-2 text-danger"></i>
                      Time *
                    </label>
                    <input
                      type="time"
                      required
                      value={clockTime}
                      onChange={(e) => setClockTime(e.target.value)}
                      className="form-control border-2"
                      style={{ borderColor: '#dc3545' }}
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
                    <button
                      type="submit"
                      className="btn btn-success"
                    >
                      <i className={`fas ${clockAction === 'in' ? 'fa-sign-in-alt' : 'fa-sign-out-alt'} me-1`}></i>
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
              <h3 className="text-lg font-medium text-gray-900 mb-4">Apply for Leave</h3>
              <form onSubmit={handleLeaveSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Employee *
                  </label>
                  <select
                    required
                    value={leaveFormData.employeeId}
                    onChange={(e) => setLeaveFormData({...leaveFormData, employeeId: e.target.value})}
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
                    onChange={(e) => setLeaveFormData({...leaveFormData, leaveType: e.target.value})}
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
                      onChange={(e) => setLeaveFormData({...leaveFormData, startDate: e.target.value})}
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
                      onChange={(e) => setLeaveFormData({...leaveFormData, endDate: e.target.value})}
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
                    onChange={(e) => setLeaveFormData({...leaveFormData, reason: e.target.value})}
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
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header" style={{ backgroundColor: '#dc3545', color: 'white' }}>
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
                    setEditAttendanceData({ clockIn: '', clockOut: '', status: 'on time' });
                  }}
                ></button>
              </div>
              <div className="modal-body">
                {editingAttendance && (
                  <div className="mb-3 p-3 border rounded" style={{ backgroundColor: '#f8f9fa' }}>
                    <h6 className="mb-2">
                      <i className="fas fa-user me-2 text-danger"></i>
                      Employee: {employees.find(emp => emp._id === editingAttendance.employeeId)?.name || 'Unknown'}
                    </h6>
                    <p className="mb-0 text-muted">
                      <i className="fas fa-calendar me-2"></i>
                      Date: {new Date(editingAttendance.date).toLocaleDateString()}
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
                        onChange={(e) => setEditAttendanceData({...editAttendanceData, clockIn: e.target.value})}
                        className="form-control border-2"
                        style={{ borderColor: '#dc3545' }}
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
                        onChange={(e) => setEditAttendanceData({...editAttendanceData, clockOut: e.target.value})}
                        className="form-control border-2"
                        style={{ borderColor: '#dc3545' }}
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="form-label fw-medium">
                      <i className="fas fa-user-check me-2 text-danger"></i>
                      Status *
                    </label>
                    <select
                      required
                      value={editAttendanceData.status}
                      onChange={(e) => setEditAttendanceData({...editAttendanceData, status: e.target.value})}
                      className="form-select border-2"
                      style={{ borderColor: '#dc3545' }}
                    >
                      <option value="on time">On Time</option>
                      <option value="late">Late</option>
                      <option value="absent">Absent</option>
                    </select>
                  </div>
                  
                  <div className="d-flex justify-content-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowEditAttendanceForm(false);
                        setEditingAttendance(null);
                        setEditAttendanceData({ clockIn: '', clockOut: '', status: 'on time' });
                      }}
                      className="btn btn-outline-secondary"
                    >
                      <i className="fas fa-times me-1"></i>
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-success"
                    >
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
    </div>
  );
}
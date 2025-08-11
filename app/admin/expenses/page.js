"use client";

import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    category: "",
    description: "",
    amount: "",
  });
  const [error, setError] = useState("");
  const router = useRouter();

  // Filter and search states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [isFilterExpanded, setIsFilterExpanded] = useState(true);

  const categories = [
    "Operational Cost",
    "Employee Salary",
    "Marketing",
    "Office Supplies",
    "Software Licenses",
    "Travel",
    "Utilities",
    "Rent",
    "Insurance",
    "Other",
  ];

  // Generate month and year options
  const months = [
    { value: "", label: "All Months" },
    { value: "0", label: "January" },
    { value: "1", label: "February" },
    { value: "2", label: "March" },
    { value: "3", label: "April" },
    { value: "4", label: "May" },
    { value: "5", label: "June" },
    { value: "6", label: "July" },
    { value: "7", label: "August" },
    { value: "8", label: "September" },
    { value: "9", label: "October" },
    { value: "10", label: "November" },
    { value: "11", label: "December" },
  ];

  const currentYear = new Date().getFullYear();
  const years = [
    { value: "", label: "All Years" },
    ...Array.from({ length: 5 }, (_, i) => ({
      value: (currentYear - i).toString(),
      label: (currentYear - i).toString(),
    })),
  ];

  useEffect(() => {
    fetchExpenses();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [
    expenses,
    searchTerm,
    selectedMonth,
    selectedYear,
    selectedCategory,
    sortBy,
    sortOrder,
  ]);

  const fetchExpenses = async () => {
    try {
      const response = await fetch("/api/admin/expenses");
      if (response.ok) {
        const data = await response.json();
        setExpenses(data.expenses);
      } else if (response.status === 401) {
        router.push("/admin/login");
      }
    } catch (error) {
      setError("Failed to fetch expenses");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...expenses];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter((expense) =>
        expense.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Month filter
    if (selectedMonth !== "") {
      filtered = filtered.filter((expense) => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() === parseInt(selectedMonth);
      });
    }

    // Year filter
    if (selectedYear !== "") {
      filtered = filtered.filter((expense) => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getFullYear() === parseInt(selectedYear);
      });
    }

    // Category filter
    if (selectedCategory !== "") {
      filtered = filtered.filter(
        (expense) => expense.category === selectedCategory
      );
    }

    // Sorting
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "date":
          aValue = new Date(a.date);
          bValue = new Date(b.date);
          break;
        case "amount":
          aValue = a.amount;
          bValue = b.amount;
          break;
        case "category":
          aValue = a.category.toLowerCase();
          bValue = b.category.toLowerCase();
          break;
        case "description":
          aValue = a.description.toLowerCase();
          bValue = b.description.toLowerCase();
          break;
        default:
          aValue = new Date(a.date);
          bValue = new Date(b.date);
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredExpenses(filtered);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedMonth("");
    setSelectedYear("");
    setSelectedCategory("");
    setSortBy("date");
    setSortOrder("desc");
  };

  const exportToPDF = async () => {
    try {
      // Dynamic import to avoid SSR issues
      const jsPDFModule = await import("jspdf");
      const jsPDF = jsPDFModule.default;
      const doc = new jsPDF();

      // Add title
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text("Expense Report", 14, 22);

      // Add subtitle with date
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 32);

      // Add summary information
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Summary", 14, 45);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Total Expenses: ৳${Number(totalAmount).toFixed(2)}`, 14, 55);
      doc.text(`Total Entries: ${filteredExpenses.length}`, 14, 62);

      // Add filter information if any filters are applied
      const activeFilters = [];
      if (searchTerm) activeFilters.push(`Search: "${searchTerm}"`);
      if (selectedMonth !== "") {
        const monthName =
          months.find((m) => m.value === selectedMonth)?.label || selectedMonth;
        activeFilters.push(`Month: ${monthName}`);
      }
      if (selectedYear !== "") activeFilters.push(`Year: ${selectedYear}`);
      if (selectedCategory !== "")
        activeFilters.push(`Category: ${selectedCategory}`);

      if (activeFilters.length > 0) {
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Applied Filters:", 14, 75);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        activeFilters.forEach((filter, index) => {
          doc.text(filter, 14, 82 + index * 7);
        });
      }

      // Prepare table data
      const tableData = filteredExpenses.map((expense) => [
        new Date(expense.date).toLocaleDateString(),
        expense.category,
        expense.description,
        `৳${Number(expense.amount).toFixed(2)}`,
      ]);

      // Add table manually since autoTable might not be available
      const startY =
        activeFilters.length > 0 ? 95 + activeFilters.length * 7 : 85;

      let currentY = startY;

      // Add table header
      doc.setFillColor(220, 53, 69); // Red background
      doc.setTextColor(255, 255, 255); // White text
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.rect(14, currentY, 165, 8, "F");
      doc.text("Date", 16, currentY + 6);
      doc.text("Category", 45, currentY + 6);
      doc.text("Description", 85, currentY + 6);
      doc.text("Amount", 150, currentY + 6);

      currentY += 10;

      // Add table rows
      doc.setFillColor(255, 255, 255);
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");

      tableData.forEach((row, index) => {
        // Alternate row colors
        if (index % 2 === 1) {
          doc.setFillColor(248, 249, 250);
          doc.rect(14, currentY - 2, 165, 8, "F");
        } else {
          doc.setFillColor(255, 255, 255);
          doc.rect(14, currentY - 2, 165, 8, "F");
        }

        doc.text(row[0], 16, currentY + 6); // Date
        doc.text(row[1], 45, currentY + 6); // Category
        doc.text(row[2], 85, currentY + 6); // Description
        doc.text(row[3], 150, currentY + 6, { align: "right" }); // Amount

        currentY += 10;

        // Add new page if needed
        if (currentY > 250) {
          doc.addPage();
          currentY = 20;
        }
      });

      // Add footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setFont("helvetica", "italic");
        doc.text(
          `Page ${i} of ${pageCount} - Expense Tracker Report`,
          doc.internal.pageSize.width / 2,
          doc.internal.pageSize.height - 10,
          { align: "center" }
        );
      }

      // Save the PDF
      const fileName = `expense-report-${
        new Date().toISOString().split("T")[0]
      }.pdf`;
      doc.save(fileName);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const url = editingExpense
        ? `/api/admin/expenses/${editingExpense._id}`
        : "/api/admin/expenses";

      const method = editingExpense ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowAddForm(false);
        setEditingExpense(null);
        setFormData({
          date: new Date().toISOString().split("T")[0],
          category: "",
          description: "",
          amount: "",
        });
        fetchExpenses();
      } else {
        const data = await response.json();
        setError(data.message || "Failed to save expense");
      }
    } catch (error) {
      setError("An error occurred");
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setFormData({
      date: expense.date.split("T")[0],
      category: expense.category,
      description: expense.description,
      amount: expense.amount.toString(),
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this expense?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/expenses/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchExpenses();
      } else {
        setError("Failed to delete expense");
      }
    } catch (error) {
      setError("An error occurred");
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch (error) {
      console.error("Logout API error:", error);
    }
    router.push("/admin/login");
  };

  const totalAmount = filteredExpenses.reduce(
    (sum, expense) => sum + Number(expense.amount),
    0
  );

  // Calculate pie chart data
  const pieChartData = React.useMemo(() => {
    const categoryTotals = {};

    filteredExpenses.forEach((expense) => {
      const category = expense.category;
      const amount = Number(expense.amount);

      if (categoryTotals[category]) {
        categoryTotals[category] += amount;
      } else {
        categoryTotals[category] = amount;
      }
    });

    const categories = Object.keys(categoryTotals);
    const amounts = Object.values(categoryTotals);

    // Generate colors for each category
    const colors = [
      "#DC2626", // Red
      "#2563EB", // Blue
      "#059669", // Green
      "#D97706", // Orange
      "#7C3AED", // Purple
      "#DB2777", // Pink
      "#0891B2", // Cyan
      "#65A30D", // Lime
      "#EA580C", // Amber
      "#9333EA", // Violet
    ];

    return {
      labels: categories,
      datasets: [
        {
          data: amounts,
          backgroundColor: categories.map(
            (_, index) => colors[index % colors.length]
          ),
          borderColor: categories.map(
            (_, index) => colors[index % colors.length]
          ),
          borderWidth: 2,
          hoverBorderWidth: 3,
        },
      ],
    };
  }, [filteredExpenses]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-xl font-semibold text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Modern Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-red-700 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                Expense Tracker
              </h1>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Enhanced Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Total Expenses
                </p>
                <p className="text-3xl font-bold text-red-600">
                  ৳{Number(totalAmount).toFixed(2)}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Total Entries
                </p>
                <p className="text-3xl font-bold text-green-600">
                  {filteredExpenses.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  This Month
                </p>
                <p className="text-3xl font-bold text-blue-600">
                  ৳
                  {expenses
                    .filter((expense) => {
                      const expenseDate = new Date(expense.date);
                      const now = new Date();
                      return (
                        expenseDate.getMonth() === now.getMonth() &&
                        expenseDate.getFullYear() === now.getFullYear()
                      );
                    })
                    .reduce((sum, expense) => sum + expense.amount, 0)
                    .toFixed(2)}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Pie Chart Section */}
        {filteredExpenses.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
                  />
                </svg>
                <span>Expense Distribution by Category</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Chart */}
              <div className="flex justify-center">
                <div className="w-full max-w-md">
                  <Pie
                    data={pieChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: true,
                      plugins: {
                        legend: {
                          position: "bottom",
                          labels: {
                            padding: 20,
                            usePointStyle: true,
                            font: {
                              size: 12,
                              weight: "500",
                            },
                          },
                        },
                        tooltip: {
                          callbacks: {
                            label: function (context) {
                              const label = context.label || "";
                              const value = context.parsed;
                              const total = context.dataset.data.reduce(
                                (a, b) => a + b,
                                0
                              );
                              const percentage = (
                                (value / total) *
                                100
                              ).toFixed(1);
                              return `${label}: ৳${value.toFixed(
                                2
                              )} (${percentage}%)`;
                            },
                          },
                        },
                      },
                    }}
                  />
                </div>
              </div>

              {/* Category Breakdown */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Category Breakdown
                </h3>
                <div className="space-y-3">
                  {pieChartData.labels.map((category, index) => {
                    const amount = pieChartData.datasets[0].data[index];
                    const percentage = ((amount / totalAmount) * 100).toFixed(
                      1
                    );
                    const color =
                      pieChartData.datasets[0].backgroundColor[index];

                    return (
                      <div
                        key={category}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: color }}
                          ></div>
                          <span className="font-medium text-gray-900">
                            {category}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">
                            ৳{amount.toFixed(2)}
                          </div>
                          <div className="text-sm text-gray-600">
                            {percentage}%
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Add Expense Button and Export */}
        <div className="mb-8 flex flex-wrap gap-4">
          <button
            onClick={() => {
              setShowAddForm(true);
              setEditingExpense(null);
              setFormData({
                date: new Date().toISOString().split("T")[0],
                category: "",
                description: "",
                amount: "",
              });
            }}
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <span>Add New Expense</span>
          </button>

          <button
            onClick={exportToPDF}
            disabled={filteredExpenses.length === 0}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span>Export to PDF</span>
          </button>
        </div>

        {/* Filter and Search Section */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 mb-8">
          {/* Header - Always Visible */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Filter & Search
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Find and organize your expenses
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center space-x-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg font-medium transition-all duration-200 border border-red-200 hover:border-red-300"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  <span>Clear All</span>
                </button>
                <button
                  onClick={() => setIsFilterExpanded(!isFilterExpanded)}
                  className="inline-flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-all duration-200 border border-gray-200 hover:border-gray-300"
                >
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isFilterExpanded ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                  <span>{isFilterExpanded ? "Hide" : "Show"} Filters</span>
                </button>
              </div>
            </div>
          </div>

          {/* Collapsible Content */}
          <div
            className={`transition-all duration-300 ease-in-out overflow-hidden ${
              isFilterExpanded
                ? "max-h-screen opacity-100"
                : "max-h-0 opacity-0"
            }`}
          >
            <div className="p-6 space-y-6">
              {/* Search Row */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Search Expenses
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by description, category, or amount..."
                    className="w-full pl-16 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 text-gray-900 placeholder-gray-500"
                  />
                  <svg
                    className="w-5 h-5 text-gray-400 absolute left-5 top-1/2 transform -translate-y-1/2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* Filter Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Month Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    <div className="flex items-center space-x-2">
                      <svg
                        className="w-4 h-4 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span>Month</span>
                    </div>
                  </label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 text-gray-900 bg-white"
                  >
                    {months.map((month) => (
                      <option key={month.value} value={month.value}>
                        {month.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Year Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    <div className="flex items-center space-x-2">
                      <svg
                        className="w-4 h-4 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>Year</span>
                    </div>
                  </label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 text-gray-900 bg-white"
                  >
                    {years.map((year) => (
                      <option key={year.value} value={year.value}>
                        {year.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    <div className="flex items-center space-x-2">
                      <svg
                        className="w-4 h-4 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                        />
                      </svg>
                      <span>Category</span>
                    </div>
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 text-gray-900 bg-white"
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Sort Row */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-3">
                      <svg
                        className="w-5 h-5 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
                        />
                      </svg>
                      <label className="text-sm font-semibold text-gray-700">
                        Sort by:
                      </label>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 text-gray-900 bg-white font-medium"
                      >
                        <option value="date">Date</option>
                        <option value="amount">Amount</option>
                        <option value="category">Category</option>
                        <option value="description">Description</option>
                      </select>
                    </div>
                    <div className="flex items-center space-x-3">
                      <label className="text-sm font-semibold text-gray-700">
                        Order:
                      </label>
                      <button
                        onClick={() =>
                          setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                        }
                        className="inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-white hover:border-red-300 transition-all duration-200 bg-white"
                      >
                        <svg
                          className={`w-4 h-4 ${
                            sortOrder === "asc"
                              ? "text-red-600"
                              : "text-gray-400"
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 15l7-7 7 7"
                          />
                        </svg>
                        <span className="text-sm font-medium text-gray-700">
                          {sortOrder === "asc" ? "Ascending" : "Descending"}
                        </span>
                      </button>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full border border-gray-200">
                    {filteredExpenses.length} results
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Add/Edit Form */}
        {showAddForm && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-100">
            <h2 className="text-xl font-semibold mb-6 text-gray-900 flex items-center space-x-2">
              <svg
                className="w-5 h-5 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              <span>{editingExpense ? "Edit Expense" : "Add New Expense"}</span>
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200"
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <input
                  type="text"
                  required
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200"
                  placeholder="Enter expense description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (BDT)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200"
                  placeholder="0.00"
                />
              </div>
              {error && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                  {error}
                </div>
              )}
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>
                    {editingExpense ? "Update Expense" : "Add Expense"}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingExpense(null);
                    setError("");
                  }}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  <span>Cancel</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Enhanced Expenses List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                <svg
                  className="w-5 h-5 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span>Expenses</span>
              </h2>
              <div className="text-sm text-gray-600">
                Showing {filteredExpenses.length} of {expenses.length} expenses
              </div>
            </div>
          </div>
          {filteredExpenses.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <svg
                className="w-16 h-16 mx-auto mb-4 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-lg font-medium">
                {expenses.length === 0
                  ? "No expenses found"
                  : "No expenses match your filters"}
              </p>
              <p className="text-sm">
                {expenses.length === 0
                  ? "Add your first expense to get started"
                  : "Try adjusting your search criteria"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredExpenses.map((expense) => (
                    <tr
                      key={expense._id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(expense.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {expense.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {expense.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        ৳{Number(expense.amount).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleEdit(expense)}
                            className="text-blue-600 hover:text-blue-900 transition-colors duration-200 p-2 rounded-lg hover:bg-blue-50"
                            title="Edit"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(expense._id)}
                            className="text-red-600 hover:text-red-900 transition-colors duration-200 p-2 rounded-lg hover:bg-red-50"
                            title="Delete"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

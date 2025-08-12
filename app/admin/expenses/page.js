"use client";

import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

export default function FinancialManagementPage() {
  const [expenses, setExpenses] = useState([]);
  const [income, setIncome] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [filteredIncome, setFilteredIncome] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview"); // overview, expenses, income
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [editingIncome, setEditingIncome] = useState(null);
  const [expenseFormData, setExpenseFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    category: "",
    description: "",
    amount: "",
  });
  const [incomeFormData, setIncomeFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    category: "",
    description: "",
    amount: "",
  });
  const [error, setError] = useState("");
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteItem, setDeleteItem] = useState({ type: "", id: "" });
  const router = useRouter();

  // Toast notification helper
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(
      () => setToast({ show: false, message: "", type: "success" }),
      3000
    );
  };

  // Confirmation dialog helper
  const showDeleteConfirmation = (type, id) => {
    setDeleteItem({ type, id });
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      if (deleteItem.type === "expense") {
        await handleDeleteExpense(deleteItem.id);
      } else if (deleteItem.type === "income") {
        await handleDeleteIncome(deleteItem.id);
      }
      setShowDeleteConfirm(false);
      setDeleteItem({ type: "", id: "" });
    } catch (error) {
      console.error("Error in handleConfirmDelete:", error);
    }
  };

  // Filter and search states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [isFilterExpanded, setIsFilterExpanded] = useState(true);

  const expenseCategories = [
    "Operational Cost",
    "Employee Salary",
    "Travel",
    "Office Supplies",
    "Premium Licenses",
    "Travel Allowance",
    "Utilities",
    "Rent",
    "Insurance",
    "Intern TA",
    "Other",
  ];

  const incomeCategories = [
    "AV",
    "Web Development",
    "Social Media Services",
    "Photography",
    "Strategy",
    "Consultation",
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
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [
    expenses,
    income,
    searchTerm,
    selectedMonth,
    selectedYear,
    selectedCategory,
    sortBy,
    sortOrder,
  ]);

  const fetchData = async () => {
    try {
      const [expensesResponse, incomeResponse] = await Promise.all([
        fetch("/api/admin/expenses"),
        fetch("/api/admin/income"),
      ]);

      if (expensesResponse.ok) {
        const expensesData = await expensesResponse.json();
        setExpenses(expensesData.expenses);
      } else if (expensesResponse.status === 401) {
        router.push("/admin/login");
        return;
      }

      if (incomeResponse.ok) {
        const incomeData = await incomeResponse.json();
        setIncome(incomeData.income);
      } else if (incomeResponse.status === 401) {
        router.push("/admin/login");
        return;
      }
    } catch (error) {
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filteredExp = [...expenses];
    let filteredInc = [...income];

    // Search filter
    if (searchTerm) {
      filteredExp = filteredExp.filter((expense) =>
        expense.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      filteredInc = filteredInc.filter((income) =>
        income.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Month filter
    if (selectedMonth !== "") {
      filteredExp = filteredExp.filter((expense) => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() === parseInt(selectedMonth);
      });
      filteredInc = filteredInc.filter((income) => {
        const incomeDate = new Date(income.date);
        return incomeDate.getMonth() === parseInt(selectedMonth);
      });
    }

    // Year filter
    if (selectedYear !== "") {
      filteredExp = filteredExp.filter((expense) => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getFullYear() === parseInt(selectedYear);
      });
      filteredInc = filteredInc.filter((income) => {
        const incomeDate = new Date(income.date);
        return incomeDate.getFullYear() === parseInt(selectedYear);
      });
    }

    // Category filter
    if (selectedCategory !== "") {
      filteredExp = filteredExp.filter(
        (expense) => expense.category === selectedCategory
      );
      filteredInc = filteredInc.filter(
        (income) => income.category === selectedCategory
      );
    }

    // Sort
    const sortFunction = (a, b) => {
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
          aValue = a.category;
          bValue = b.category;
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
    };

    filteredExp.sort(sortFunction);
    filteredInc.sort(sortFunction);

    setFilteredExpenses(filteredExp);
    setFilteredIncome(filteredInc);
  };

  const handleExpenseSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const url = editingExpense
        ? `/api/admin/expenses/${editingExpense._id}`
        : "/api/admin/expenses";
      const method = editingExpense ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(expenseFormData),
      });

      if (response.ok) {
        setShowExpenseForm(false);
        setEditingExpense(null);
        setExpenseFormData({
          date: new Date().toISOString().split("T")[0],
          category: "",
          description: "",
          amount: "",
        });
        fetchData();
        showToast(
          editingExpense
            ? "Expense updated successfully!"
            : "Expense added successfully!"
        );
      } else {
        const data = await response.json();
        setError(data.message || "Failed to save expense");
        showToast(data.message || "Failed to save expense", "error");
      }
    } catch (error) {
      setError("Failed to save expense");
      showToast("Failed to save expense", "error");
    }
  };

  const handleIncomeSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const url = editingIncome
        ? `/api/admin/income/${editingIncome._id}`
        : "/api/admin/income";
      const method = editingIncome ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(incomeFormData),
      });

      if (response.ok) {
        setShowIncomeForm(false);
        setEditingIncome(null);
        setIncomeFormData({
          date: new Date().toISOString().split("T")[0],
          category: "",
          description: "",
          amount: "",
        });
        fetchData();
        showToast(
          editingIncome
            ? "Income updated successfully!"
            : "Income added successfully!"
        );
      } else {
        const data = await response.json();
        setError(data.message || "Failed to save income");
        showToast(data.message || "Failed to save income", "error");
      }
    } catch (error) {
      setError("Failed to save income");
      showToast("Failed to save income", "error");
    }
  };

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    setExpenseFormData({
      date: new Date(expense.date).toISOString().split("T")[0],
      category: expense.category,
      description: expense.description,
      amount: expense.amount.toString(),
    });
    setShowExpenseForm(true);
  };

  const handleEditIncome = (income) => {
    setEditingIncome(income);
    setIncomeFormData({
      date: new Date(income.date).toISOString().split("T")[0],
      category: income.category,
      description: income.description,
      amount: income.amount.toString(),
    });
    setShowIncomeForm(true);
  };

  const handleDeleteExpense = async (id) => {
    try {
      const response = await fetch(`/api/admin/expenses/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchData();
        showToast("Expense deleted successfully!");
      } else {
        const data = await response.json();
        setError(data.message || "Failed to delete expense");
        showToast(data.message || "Failed to delete expense", "error");
      }
    } catch (error) {
      setError("Failed to delete expense");
      showToast("Failed to delete expense", "error");
    }
  };

  const handleDeleteIncome = async (id) => {
    try {
      const response = await fetch(`/api/admin/income/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchData();
        showToast("Income deleted successfully!");
      } else {
        const data = await response.json();
        setError(data.message || "Failed to delete income");
        showToast(data.message || "Failed to delete income", "error");
      }
    } catch (error) {
      setError("Failed to delete income");
      showToast("Failed to delete income", "error");
    }
  };

  // Calculate totals
  const totalExpenses = filteredExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );
  const totalIncome = filteredIncome.reduce(
    (sum, income) => sum + income.amount,
    0
  );
  const netAmount = totalIncome - totalExpenses;

  // Prepare chart data
  const expenseChartData = {
    labels: expenseCategories,
    datasets: [
      {
        data: expenseCategories.map((category) =>
          filteredExpenses
            .filter((expense) => expense.category === category)
            .reduce((sum, expense) => sum + expense.amount, 0)
        ),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
          "#FF6384",
          "#C9CBCF",
          "#4BC0C0",
          "#FF6384",
          "#36A2EB",
        ],
      },
    ],
  };

  const incomeChartData = {
    labels: incomeCategories,
    datasets: [
      {
        data: incomeCategories.map((category) =>
          filteredIncome
            .filter((income) => income.category === category)
            .reduce((sum, income) => sum + income.amount, 0)
        ),
        backgroundColor: [
          "#4BC0C0",
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#9966FF",
          "#FF9F40",
          "#C9CBCF",
        ],
      },
    ],
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="d-flex justify-content-between align-items-center mb-4 pb-3">
        <h1 className="h2 mb-0">Financial Management</h1>
        <div className="d-flex gap-2">
          <button
            className="btn btn-success"
            onClick={() => {
              setShowIncomeForm(true);
              setEditingIncome(null);
              setIncomeFormData({
                date: new Date().toISOString().split("T")[0],
                category: "",
                description: "",
                amount: "",
              });
            }}
          >
            <i className="bi bi-plus-circle me-2"></i>
            Add Income
          </button>
          <button
            className="btn btn-danger"
            onClick={() => {
              setShowExpenseForm(true);
              setEditingExpense(null);
              setExpenseFormData({
                date: new Date().toISOString().split("T")[0],
                category: "",
                description: "",
                amount: "",
              });
            }}
          >
            <i className="bi bi-plus-circle me-2"></i>
            Add Expense
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <ul
        className="nav nav-tabs mb-4 mt-5"
        id="financialTabs"
        role="tablist"
        style={{ borderBottomColor: "#ff0000" }}
      >
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
            style={{
              color: activeTab === "overview" ? "#ffffff" : "#ff0000",
              backgroundColor:
                activeTab === "overview" ? "#ff0000" : "transparent",
              borderColor: "#ff0000",
              borderBottomColor:
                activeTab === "overview" ? "#ff0000" : "transparent",
            }}
          >
            Overview
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === "expenses" ? "active" : ""}`}
            onClick={() => setActiveTab("expenses")}
            style={{
              color: activeTab === "expenses" ? "#ffffff" : "#ff0000",
              backgroundColor:
                activeTab === "expenses" ? "#ff0000" : "transparent",
              borderColor: "#ff0000",
              borderBottomColor:
                activeTab === "expenses" ? "#ff0000" : "transparent",
            }}
          >
            Expenses
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === "income" ? "active" : ""}`}
            onClick={() => setActiveTab("income")}
            style={{
              color: activeTab === "income" ? "#ffffff" : "#ff0000",
              backgroundColor:
                activeTab === "income" ? "#ff0000" : "transparent",
              borderColor: "#ff0000",
              borderBottomColor:
                activeTab === "income" ? "#ff0000" : "transparent",
            }}
          >
            Income
          </button>
        </li>
      </ul>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="tab-content">
          {/* Summary Cards */}
          <div className="row mb-4">
            <div className="col-md-4">
              <div className="card bg-success text-white">
                <div className="card-body">
                  <h5 className="card-title">Total Income</h5>
                  <h3 className="card-text">
                    Tk {totalIncome.toLocaleString()}
                  </h3>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card bg-danger text-white">
                <div className="card-body">
                  <h5 className="card-title">Total Expenses</h5>
                  <h3 className="card-text">
                    Tk {totalExpenses.toLocaleString()}
                  </h3>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div
                className={`card ${
                  netAmount >= 0 ? "bg-primary" : "bg-warning"
                } text-white`}
              >
                <div className="card-body">
                  <h5 className="card-title">Net Amount</h5>
                  <h3 className="card-text">Tk {netAmount.toLocaleString()}</h3>
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="row">
            <div className="col-md-6">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title mb-0">Expense Breakdown</h5>
                </div>
                <div className="card-body">
                  <div style={{ height: "300px" }}>
                    <Pie
                      data={expenseChartData}
                      options={{ maintainAspectRatio: false }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title mb-0">Income Breakdown</h5>
                </div>
                <div className="card-body">
                  <div style={{ height: "300px" }}>
                    <Pie
                      data={incomeChartData}
                      options={{ maintainAspectRatio: false }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Expenses Tab */}
      {activeTab === "expenses" && (
        <div className="tab-content">
          {/* Filters */}
          <div className="card mb-4">
            <div className="card-header">
              <button
                className="btn btn-link"
                onClick={() => setIsFilterExpanded(!isFilterExpanded)}
              >
                <i
                  className={`bi bi-chevron-${
                    isFilterExpanded ? "up" : "down"
                  }`}
                ></i>
                Filters
              </button>
            </div>
            {isFilterExpanded && (
              <div className="card-body">
                <div className="row">
                  <div className="col-md-3">
                    <label className="form-label">Search</label>
                    <input
                      type="text"
                      className="form-control border"
                      placeholder="Search descriptions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="col-md-2">
                    <label className="form-label">Month</label>
                    <select
                      className="form-select border"
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                    >
                      {months.map((month) => (
                        <option key={month.value} value={month.value}>
                          {month.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-2">
                    <label className="form-label">Year</label>
                    <select
                      className="form-select border"
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                    >
                      {years.map((year) => (
                        <option key={year.value} value={year.value}>
                          {year.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-2">
                    <label className="form-label">Category</label>
                    <select
                      className="form-select border"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      <option value="">All Categories</option>
                      {expenseCategories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Sort By</label>
                    <div className="d-flex gap-2">
                      <select
                        className="form-select border"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                      >
                        <option value="date">Date</option>
                        <option value="amount">Amount</option>
                        <option value="category">Category</option>
                      </select>
                      <select
                        className="form-select border"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                      >
                        <option value="desc">Desc</option>
                        <option value="asc">Asc</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Expenses Table */}
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                Expenses ({filteredExpenses.length})
              </h5>
            </div>
            <div className="card-body">
              {filteredExpenses.length === 0 ? (
                <p className="text-muted">No expenses found.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Category</th>
                        <th>Description</th>
                        <th>Amount</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredExpenses.map((expense) => (
                        <tr key={expense._id}>
                          <td>{new Date(expense.date).toLocaleDateString()}</td>
                          <td>
                            <span className="badge bg-secondary">
                              {expense.category}
                            </span>
                          </td>
                          <td>{expense.description}</td>
                          <td className="text-danger">
                            -Tk {expense.amount.toLocaleString()}
                          </td>
                          <td>
                            <i
                              className="bi bi-pencil me-2"
                              style={{
                                color: "black",
                                cursor: "pointer",
                                fontSize: "16px",
                              }}
                              onClick={() => handleEditExpense(expense)}
                            ></i>
                            <i
                              className="bi bi-trash"
                              style={{
                                color: "black",
                                cursor: "pointer",
                                fontSize: "16px",
                              }}
                              onClick={() =>
                                showDeleteConfirmation("expense", expense._id)
                              }
                            ></i>
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
      )}

      {/* Income Tab */}
      {activeTab === "income" && (
        <div className="tab-content">
          {/* Filters */}
          <div className="card mb-4">
            <div className="card-header">
              <button
                className="btn btn-link"
                onClick={() => setIsFilterExpanded(!isFilterExpanded)}
              >
                <i
                  className={`bi bi-chevron-${
                    isFilterExpanded ? "up" : "down"
                  }`}
                ></i>
                Filters
              </button>
            </div>
            {isFilterExpanded && (
              <div className="card-body">
                <div className="row">
                  <div className="col-md-3">
                    <label className="form-label">Search</label>
                    <input
                      type="text"
                      className="form-control border"
                      placeholder="Search descriptions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="col-md-2">
                    <label className="form-label">Month</label>
                    <select
                      className="form-select border"
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                    >
                      {months.map((month) => (
                        <option key={month.value} value={month.value}>
                          {month.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-2">
                    <label className="form-label">Year</label>
                    <select
                      className="form-select border"
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                    >
                      {years.map((year) => (
                        <option key={year.value} value={year.value}>
                          {year.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-2">
                    <label className="form-label">Category</label>
                    <select
                      className="form-select border"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      <option value="">All Categories</option>
                      {incomeCategories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Sort By</label>
                    <div className="d-flex gap-2">
                      <select
                        className="form-select border"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                      >
                        <option value="date">Date</option>
                        <option value="amount">Amount</option>
                        <option value="category">Category</option>
                      </select>
                      <select
                        className="form-select border"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                      >
                        <option value="desc">Desc</option>
                        <option value="asc">Asc</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Income Table */}
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                Income ({filteredIncome.length})
              </h5>
            </div>
            <div className="card-body">
              {filteredIncome.length === 0 ? (
                <p className="text-muted">No income found.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Category</th>
                        <th>Description</th>
                        <th>Amount</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredIncome.map((income) => (
                        <tr key={income._id}>
                          <td>{new Date(income.date).toLocaleDateString()}</td>
                          <td>
                            <span className="badge bg-secondary">
                              {income.category}
                            </span>
                          </td>
                          <td>{income.description}</td>
                          <td className="text-success">
                            +Tk {income.amount.toLocaleString()}
                          </td>
                          <td>
                            <i
                              className="bi bi-pencil me-2"
                              style={{
                                color: "black",
                                cursor: "pointer",
                                fontSize: "16px",
                              }}
                              onClick={() => handleEditIncome(income)}
                            ></i>
                            <i
                              className="bi bi-trash"
                              style={{
                                color: "black",
                                cursor: "pointer",
                                fontSize: "16px",
                              }}
                              onClick={() =>
                                showDeleteConfirmation("income", income._id)
                              }
                            ></i>
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
      )}

      {/* Expense Form Modal */}
      {showExpenseForm && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingExpense ? "Edit Expense" : "Add New Expense"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowExpenseForm(false);
                    setEditingExpense(null);
                  }}
                ></button>
              </div>
              <form onSubmit={handleExpenseSubmit}>
                <div className="modal-body">
                  {error && <div className="alert alert-danger">{error}</div>}
                  <div className="mb-3">
                    <label className="form-label">Date</label>
                    <input
                      type="date"
                      className="form-control border"
                      value={expenseFormData.date}
                      onChange={(e) =>
                        setExpenseFormData({
                          ...expenseFormData,
                          date: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Category</label>
                    <select
                      className="form-select border"
                      value={expenseFormData.category}
                      onChange={(e) =>
                        setExpenseFormData({
                          ...expenseFormData,
                          category: e.target.value,
                        })
                      }
                      required
                    >
                      <option value="">Select Category</option>
                      {expenseCategories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <input
                      type="text"
                      className="form-control border"
                      value={expenseFormData.description}
                      onChange={(e) =>
                        setExpenseFormData({
                          ...expenseFormData,
                          description: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Amount</label>
                    <input
                      type="number"
                      className="form-control border"
                      value={expenseFormData.amount}
                      onChange={(e) =>
                        setExpenseFormData({
                          ...expenseFormData,
                          amount: e.target.value,
                        })
                      }
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowExpenseForm(false);
                      setEditingExpense(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-danger">
                    {editingExpense ? "Update" : "Add"} Expense
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Income Form Modal */}
      {showIncomeForm && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingIncome ? "Edit Income" : "Add New Income"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowIncomeForm(false);
                    setEditingIncome(null);
                  }}
                ></button>
              </div>
              <form onSubmit={handleIncomeSubmit}>
                <div className="modal-body">
                  {error && <div className="alert alert-danger">{error}</div>}
                  <div className="mb-3">
                    <label className="form-label">Date</label>
                    <input
                      type="date"
                      className="form-control border"
                      value={incomeFormData.date}
                      onChange={(e) =>
                        setIncomeFormData({
                          ...incomeFormData,
                          date: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Category</label>
                    <select
                      className="form-select border"
                      value={incomeFormData.category}
                      onChange={(e) =>
                        setIncomeFormData({
                          ...incomeFormData,
                          category: e.target.value,
                        })
                      }
                      required
                    >
                      <option value="">Select Category</option>
                      {incomeCategories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <input
                      type="text"
                      className="form-control border"
                      value={incomeFormData.description}
                      onChange={(e) =>
                        setIncomeFormData({
                          ...incomeFormData,
                          description: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Amount</label>
                    <input
                      type="number"
                      className="form-control border"
                      value={incomeFormData.amount}
                      onChange={(e) =>
                        setIncomeFormData({
                          ...incomeFormData,
                          amount: e.target.value,
                        })
                      }
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowIncomeForm(false);
                      setEditingIncome(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-success">
                    {editingIncome ? "Update" : "Add"} Income
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

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

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div
          className="modal fade show"
          style={{
            display: "block",
            zIndex: 9999,
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            style={{ zIndex: 10000 }}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDeleteConfirm(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  Are you sure you want to delete this{" "}
                  {deleteItem.type === "expense" ? "expense" : "income"}? This
                  action cannot be undone.
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  style={{
                    position: "relative",
                    zIndex: 10001,
                    cursor: "pointer",
                    pointerEvents: "auto",
                  }}
                  onClick={handleConfirmDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
          <div
            className="modal-backdrop fade show"
            style={{
              zIndex: 9998,
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
            onClick={() => setShowDeleteConfirm(false)}
          ></div>
        </div>
      )}
    </div>
  );
}

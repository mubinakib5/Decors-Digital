"use client";

import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import jsPDF from "jspdf";
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
    subcategory: "",
    company: "",
    description: "",
    amount: "",
    isPaid: false,
  });
  const [incomeFormData, setIncomeFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    category: "",
    subcategory: "",
    company: "",
    description: "",
    amount: "",
    isPaid: false,
  });
  const [error, setError] = useState("");
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteItem, setDeleteItem] = useState({ type: "", id: "" });

  // Category management states
  const [categories, setCategories] = useState([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showCategoryListModal, setShowCategoryListModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryFormData, setCategoryFormData] = useState({
    type: "expense",
    name: "",
    subcategories: [],
  });
  const [newSubcategory, setNewSubcategory] = useState("");

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

  // Clear all filters function
  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedMonth("");
    setSelectedYear("");
    setSelectedCategory("");
    setSortBy("date");
    setSortOrder("desc");
  };

  // Get categories by type
  const getCategoriesByType = (type) => {
    return categories.filter((cat) => cat.type === type);
  };

  const expenseCategories = getCategoriesByType("expense");
  const incomeCategories = getCategoriesByType("income");

  // Get subcategories for a specific category
  const getSubcategoriesForCategory = (categoryName, type) => {
    const category = categories.find(
      (cat) => cat.type === type && cat.name === categoryName
    );
    return category ? category.subcategories || [] : [];
  };

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
      const [expensesResponse, incomeResponse, categoriesResponse] =
        await Promise.all([
          fetch("/api/admin/expenses"),
          fetch("/api/admin/income"),
          fetch("/api/admin/categories"),
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

      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData.categories);
      } else if (categoriesResponse.status === 401) {
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
          subcategory: "",
          company: "",
          description: "",
          amount: "",
          isPaid: false,
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
          subcategory: "",
          company: "",
          description: "",
          amount: "",
          isPaid: false,
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
      subcategory: expense.subcategory || "",
      company: expense.company || "",
      description: expense.description,
      amount: expense.amount.toString(),
      isPaid: expense.isPaid || false,
    });
    setShowExpenseForm(true);
  };

  const handleEditIncome = (income) => {
    setEditingIncome(income);
    setIncomeFormData({
      date: new Date(income.date).toISOString().split("T")[0],
      category: income.category,
      subcategory: income.subcategory || "",
      company: income.company || "",
      description: income.description,
      amount: income.amount.toString(),
      isPaid: income.isPaid || false,
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

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/admin/logout", {
        method: "POST",
      });

      if (response.ok) {
        showToast("Logged out successfully!");
        // Redirect to login page after a short delay
        setTimeout(() => {
          router.push("/admin/login");
        }, 1000);
      } else {
        showToast("Failed to logout", "error");
      }
    } catch (error) {
      showToast("Failed to logout", "error");
    }
  };

  // Category management functions
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const url = editingCategory
        ? `/api/admin/categories/${editingCategory._id}`
        : "/api/admin/categories";
      const method = editingCategory ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoryFormData),
      });

      if (response.ok) {
        const data = await response.json();
        setShowCategoryModal(false);

        // If we're editing, go back to category list
        if (editingCategory) {
          setShowCategoryListModal(true);
        } else {
          // If we're creating a new category, check if we should return to a form
          if (categoryFormData.type === "expense") {
            setShowExpenseForm(true);
            setExpenseFormData({
              ...expenseFormData,
              category: categoryFormData.name,
              subcategory: "",
            });
          } else if (categoryFormData.type === "income") {
            setShowIncomeForm(true);
            setIncomeFormData({
              ...incomeFormData,
              category: categoryFormData.name,
              subcategory: "",
            });
          } else {
            setShowCategoryListModal(true);
          }
        }

        setEditingCategory(null);
        setCategoryFormData({
          type: "expense",
          name: "",
          subcategories: [],
        });
        fetchData();
        showToast(
          editingCategory
            ? "Category updated successfully!"
            : "Category added successfully!"
        );
      } else {
        const data = await response.json();
        setError(data.message || "Failed to save category");
        showToast(data.message || "Failed to save category", "error");
      }
    } catch (error) {
      setError("Failed to save category");
      showToast("Failed to save category", "error");
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setCategoryFormData({
      type: category.type,
      name: category.name,
      subcategories: category.subcategories || [],
    });
    setShowCategoryListModal(false);
    setShowCategoryModal(true);
  };

  const handleDeleteCategory = async (id) => {
    try {
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchData();
        showToast("Category deleted successfully!");
      } else {
        const data = await response.json();
        setError(data.message || "Failed to delete category");
        showToast(data.message || "Failed to delete category", "error");
      }
    } catch (error) {
      setError("Failed to delete category");
      showToast("Failed to delete category", "error");
    }
  };

  const addSubcategory = () => {
    if (
      newSubcategory.trim() &&
      !categoryFormData.subcategories.includes(newSubcategory.trim())
    ) {
      setCategoryFormData({
        ...categoryFormData,
        subcategories: [
          ...categoryFormData.subcategories,
          newSubcategory.trim(),
        ],
      });
      setNewSubcategory("");
    }
  };

  const removeSubcategory = (index) => {
    setCategoryFormData({
      ...categoryFormData,
      subcategories: categoryFormData.subcategories.filter(
        (_, i) => i !== index
      ),
    });
  };

  // PDF Export functions
  const exportToPDF = async (type) => {
    try {
      // Dynamically import jspdf-autotable
      const autoTable = (await import("jspdf-autotable")).default;

      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;

      // Add title
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("Financial Management Report", pageWidth / 2, 20, {
        align: "center",
      });

      // Add subtitle with type and date
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      const currentDate = new Date().toLocaleDateString();
      doc.text(
        `${
          type.charAt(0).toUpperCase() + type.slice(1)
        } Report - ${currentDate}`,
        pageWidth / 2,
        30,
        { align: "center" }
      );

      // Add filter information if any filters are applied
      let filterInfo = [];
      if (searchTerm) filterInfo.push(`Search: "${searchTerm}"`);
      if (selectedMonth !== "") {
        const monthName =
          months.find((m) => m.value === selectedMonth)?.label || selectedMonth;
        filterInfo.push(`Month: ${monthName}`);
      }
      if (selectedYear !== "") filterInfo.push(`Year: ${selectedYear}`);
      if (selectedCategory !== "")
        filterInfo.push(`Category: ${selectedCategory}`);

      if (filterInfo.length > 0) {
        doc.setFontSize(10);
        doc.text(`Filters Applied: ${filterInfo.join(", ")}`, 14, 40);
      }

      if (type === "expenses") {
        await exportExpensesToPDF(doc, autoTable);
      } else if (type === "income") {
        await exportIncomeToPDF(doc, autoTable);
      } else if (type === "overview") {
        await exportOverviewToPDF(doc, autoTable);
      }
    } catch (error) {
      console.error("Error exporting PDF:", error);
      showToast("Failed to export PDF", "error");
    }
  };

  const exportExpensesToPDF = (doc, autoTable) => {
    const tableData = filteredExpenses.map((expense) => [
      new Date(expense.date).toLocaleDateString(),
      expense.category,
      expense.subcategory || "",
      expense.description,
      `Tk ${expense.amount.toLocaleString()}`,
    ]);

    autoTable(doc, {
      startY: 50,
      head: [["Date", "Category", "Subcategory", "Description", "Amount"]],
      body: tableData,
      theme: "grid",
      headStyles: {
        fillColor: [255, 0, 0],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      styles: {
        fontSize: 10,
        cellPadding: 5,
      },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 30 },
        2: { cellWidth: 30 },
        3: { cellWidth: 60 },
        4: { cellWidth: 30, halign: "right" },
      },
    });

    // Add summary
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(
      `Total Expenses: Tk ${filteredExpenses
        .reduce((sum, expense) => sum + expense.amount, 0)
        .toLocaleString()}`,
      14,
      finalY
    );

    doc.save(`expenses-report-${new Date().toISOString().split("T")[0]}.pdf`);
  };

  const exportIncomeToPDF = (doc, autoTable) => {
    const tableData = filteredIncome.map((income) => [
      new Date(income.date).toLocaleDateString(),
      income.category,
      income.subcategory || "",
      income.description,
      `Tk ${income.amount.toLocaleString()}`,
    ]);

    autoTable(doc, {
      startY: 50,
      head: [["Date", "Category", "Subcategory", "Description", "Amount"]],
      body: tableData,
      theme: "grid",
      headStyles: {
        fillColor: [255, 0, 0],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      styles: {
        fontSize: 10,
        cellPadding: 5,
      },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 30 },
        2: { cellWidth: 30 },
        3: { cellWidth: 60 },
        4: { cellWidth: 30, halign: "right" },
      },
    });

    // Add summary
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(
      `Total Income: Tk ${filteredIncome
        .reduce((sum, income) => sum + income.amount, 0)
        .toLocaleString()}`,
      14,
      finalY
    );

    doc.save(`income-report-${new Date().toISOString().split("T")[0]}.pdf`);
  };

  const exportOverviewToPDF = (doc, autoTable) => {
    // Summary section
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Financial Summary", 14, 50);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Total Income: Tk ${totalIncome.toLocaleString()}`, 14, 65);
    doc.text(`Total Expenses: Tk ${totalExpenses.toLocaleString()}`, 14, 75);
    doc.text(`Net Amount: Tk ${netAmount.toLocaleString()}`, 14, 85);

    // Top expenses by category
    const expenseByCategory = {};
    filteredExpenses.forEach((expense) => {
      expenseByCategory[expense.category] =
        (expenseByCategory[expense.category] || 0) + expense.amount;
    });

    const topExpenses = Object.entries(expenseByCategory)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    if (topExpenses.length > 0) {
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Top Expense Categories", 14, 110);

      const expenseData = topExpenses.map(([category, amount]) => [
        category,
        `Tk ${amount.toLocaleString()}`,
      ]);

      autoTable(doc, {
        startY: 120,
        head: [["Category", "Amount"]],
        body: expenseData,
        theme: "grid",
        headStyles: {
          fillColor: [255, 0, 0],
          textColor: [255, 255, 255],
          fontStyle: "bold",
        },
        styles: {
          fontSize: 10,
          cellPadding: 5,
        },
        columnStyles: {
          0: { cellWidth: 100 },
          1: { cellWidth: 50, halign: "right" },
        },
      });
    }

    // Top income by category
    const incomeByCategory = {};
    filteredIncome.forEach((income) => {
      incomeByCategory[income.category] =
        (incomeByCategory[income.category] || 0) + income.amount;
    });

    const topIncome = Object.entries(incomeByCategory)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    if (topIncome.length > 0) {
      const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 20 : 180;

      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Top Income Categories", 14, finalY);

      const incomeData = topIncome.map(([category, amount]) => [
        category,
        `Tk ${amount.toLocaleString()}`,
      ]);

      autoTable(doc, {
        startY: finalY + 10,
        head: [["Category", "Amount"]],
        body: incomeData,
        theme: "grid",
        headStyles: {
          fillColor: [255, 0, 0],
          textColor: [255, 255, 255],
          fontStyle: "bold",
        },
        styles: {
          fontSize: 10,
          cellPadding: 5,
        },
        columnStyles: {
          0: { cellWidth: 100 },
          1: { cellWidth: 50, halign: "right" },
        },
      });
    }

    doc.save(
      `financial-overview-${new Date().toISOString().split("T")[0]}.pdf`
    );
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
    labels: expenseCategories.map((cat) => cat.name),
    datasets: [
      {
        data: expenseCategories.map((category) =>
          filteredExpenses
            .filter((expense) => expense.category === category.name)
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
    labels: incomeCategories.map((cat) => cat.name),
    datasets: [
      {
        data: incomeCategories.map((category) =>
          filteredIncome
            .filter((income) => income.category === category.name)
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
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h1 className="h3 mb-0">Financial Management</h1>
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={handleLogout}
        >
          <i className="bi bi-box-arrow-right me-1"></i>
          Logout
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <ul
          className="nav nav-tabs"
          id="financialTabs"
          role="tablist"
          style={{ borderBottomColor: "#ff0000", marginBottom: "0" }}
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
        <div className="d-flex gap-2">
          <button
            className="btn btn-sm"
            style={{
              color: "#ffffff",
              backgroundColor: "#ff0000",
              borderColor: "#ff0000",
              padding: "6px 12px",
              fontSize: "14px",
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = "#cc0000";
              e.target.style.borderColor = "#cc0000";
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = "#ff0000";
              e.target.style.borderColor = "#ff0000";
            }}
            onClick={() => {
              setShowIncomeForm(true);
              setEditingIncome(null);
              setIncomeFormData({
                date: new Date().toISOString().split("T")[0],
                category: "",
                subcategory: "",
                company: "",
                description: "",
                amount: "",
                isPaid: false,
              });
            }}
          >
            <i className="bi bi-plus-circle me-1"></i>
            Add Income
          </button>
          <button
            className="btn btn-sm"
            style={{
              color: "#ffffff",
              backgroundColor: "#ff0000",
              borderColor: "#ff0000",
              padding: "6px 12px",
              fontSize: "14px",
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = "#cc0000";
              e.target.style.borderColor = "#cc0000";
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = "#ff0000";
              e.target.style.borderColor = "#ff0000";
            }}
            onClick={() => {
              setShowExpenseForm(true);
              setEditingExpense(null);
              setExpenseFormData({
                date: new Date().toISOString().split("T")[0],
                category: "",
                subcategory: "",
                company: "",
                description: "",
                amount: "",
                isPaid: false,
              });
            }}
          >
            <i className="bi bi-plus-circle me-1"></i>
            Add Expense
          </button>
          <button
            className="btn btn-sm"
            style={{
              color: "#ffffff",
              backgroundColor: "#ff0000",
              borderColor: "#ff0000",
              padding: "6px 12px",
              fontSize: "14px",
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = "#cc0000";
              e.target.style.borderColor = "#cc0000";
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = "#ff0000";
              e.target.style.borderColor = "#ff0000";
            }}
            onClick={() => {
              setShowCategoryListModal(true);
            }}
          >
            <i className="bi bi-gear me-1"></i>
            Manage Categories
          </button>
          <button
            className="btn btn-sm"
            style={{
              color: "#ffffff",
              backgroundColor: "#ff0000",
              borderColor: "#ff0000",
              padding: "6px 12px",
              fontSize: "14px",
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = "#cc0000";
              e.target.style.borderColor = "#cc0000";
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = "#ff0000";
              e.target.style.borderColor = "#ff0000";
            }}
            onClick={() => exportToPDF(activeTab)}
          >
            <i className="bi bi-file-earmark-pdf me-1"></i>
            Export PDF
          </button>
        </div>
      </div>

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

          {/* Company-based Analysis */}
          <div className="row mt-4">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title mb-0">Company-based Analysis</h5>
                </div>
                <div className="card-body">
                  {(() => {
                    // Calculate company-based data
                    const companyData = {};

                    // Process expenses
                    filteredExpenses.forEach((expense) => {
                      if (expense.company && expense.company.trim()) {
                        const company = expense.company.trim();
                        if (!companyData[company]) {
                          companyData[company] = {
                            expenses: 0,
                            income: 0,
                            net: 0,
                          };
                        }
                        companyData[company].expenses += expense.amount;
                      }
                    });

                    // Process income
                    filteredIncome.forEach((income) => {
                      if (income.company && income.company.trim()) {
                        const company = income.company.trim();
                        if (!companyData[company]) {
                          companyData[company] = {
                            expenses: 0,
                            income: 0,
                            net: 0,
                          };
                        }
                        companyData[company].income += income.amount;
                      }
                    });

                    // Calculate net amounts
                    Object.keys(companyData).forEach((company) => {
                      companyData[company].net =
                        companyData[company].income -
                        companyData[company].expenses;
                    });

                    const companies = Object.keys(companyData);

                    if (companies.length === 0) {
                      return (
                        <p className="text-muted text-center">
                          No company data available. Add company names to your
                          expenses and income to see analysis.
                        </p>
                      );
                    }

                    return (
                      <div className="table-responsive">
                        <table className="table table-striped">
                          <thead>
                            <tr>
                              <th>Company</th>
                              <th>Total Income</th>
                              <th>Total Expenses</th>
                              <th>Net Profit/Loss</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {companies
                              .sort(
                                (a, b) =>
                                  companyData[b].net - companyData[a].net
                              )
                              .map((company) => {
                                const data = companyData[company];
                                const isProfit = data.net >= 0;
                                return (
                                  <tr key={company}>
                                    <td>
                                      <span className="badge bg-warning text-dark">
                                        {company}
                                      </span>
                                    </td>
                                    <td className="text-success">
                                      Tk {data.income.toLocaleString()}
                                    </td>
                                    <td className="text-danger">
                                      Tk {data.expenses.toLocaleString()}
                                    </td>
                                    <td
                                      className={
                                        isProfit
                                          ? "text-success"
                                          : "text-danger"
                                      }
                                    >
                                      <strong>
                                        {isProfit ? "+" : ""}Tk{" "}
                                        {data.net.toLocaleString()}
                                      </strong>
                                    </td>
                                    <td>
                                      <span
                                        className="badge"
                                        style={{
                                          backgroundColor: isProfit
                                            ? "#28a745"
                                            : "#dc3545",
                                          color: "white",
                                          padding: "0.375rem 0.75rem",
                                          fontSize: "0.75rem",
                                          fontWeight: "600",
                                          borderRadius: "0.375rem",
                                        }}
                                      >
                                        {isProfit ? "Profit" : "Loss"}
                                      </span>
                                    </td>
                                  </tr>
                                );
                              })}
                          </tbody>
                        </table>
                      </div>
                    );
                  })()}
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
                      className="form-control border rounded"
                      placeholder="Search descriptions..."
                      value={searchTerm || ""}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{ padding: "8px 12px" }}
                    />
                  </div>
                  <div className="col-md-2">
                    <label className="form-label">Month</label>
                    <select
                      className="form-select border rounded"
                      value={selectedMonth || ""}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      style={{ padding: "8px 12px" }}
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
                      className="form-select border rounded"
                      value={selectedYear || ""}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      style={{ padding: "8px 12px" }}
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
                      className="form-select border rounded"
                      value={selectedCategory || ""}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      style={{ padding: "8px 12px" }}
                    >
                      <option value="">All Categories</option>
                      {expenseCategories.map((category) => (
                        <option key={category.name} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Sort By</label>
                    <div className="d-flex gap-2">
                      <select
                        className="form-select border rounded"
                        value={sortBy || "date"}
                        onChange={(e) => setSortBy(e.target.value)}
                        style={{ padding: "8px 12px" }}
                      >
                        <option value="date">Date</option>
                        <option value="amount">Amount</option>
                        <option value="category">Category</option>
                      </select>
                      <select
                        className="form-select border rounded"
                        value={sortOrder || "desc"}
                        onChange={(e) => setSortOrder(e.target.value)}
                        style={{ padding: "8px 12px" }}
                      >
                        <option value="desc">Desc</option>
                        <option value="asc">Asc</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-12">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={clearAllFilters}
                      style={{ padding: "8px 16px" }}
                    >
                      <i className="bi bi-x-circle me-1"></i>
                      Clear All Filters
                    </button>
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
                        <th>Subcategory</th>
                        <th>Company</th>
                        <th>Description</th>
                        <th>Amount</th>
                        <th>Status</th>
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
                          <td>
                            {expense.subcategory && (
                              <span className="badge bg-secondary text-white">
                                {expense.subcategory}
                              </span>
                            )}
                          </td>
                          <td>
                            {expense.company && (
                              <span className="badge bg-warning text-dark">
                                {expense.company}
                              </span>
                            )}
                          </td>
                          <td>{expense.description}</td>
                          <td className="text-danger">
                            Tk {expense.amount.toLocaleString()}
                          </td>
                          <td>
                            <span
                              className={`badge ${
                                expense.isPaid
                                  ? "bg-success"
                                  : "bg-warning text-dark"
                              }`}
                            >
                              {expense.isPaid ? "Paid" : "Unpaid"}
                            </span>
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
                      className="form-control border rounded"
                      placeholder="Search descriptions..."
                      value={searchTerm || ""}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{ padding: "8px 12px" }}
                    />
                  </div>
                  <div className="col-md-2">
                    <label className="form-label">Month</label>
                    <select
                      className="form-select border rounded"
                      value={selectedMonth || ""}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      style={{ padding: "8px 12px" }}
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
                      className="form-select border rounded"
                      value={selectedYear || ""}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      style={{ padding: "8px 12px" }}
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
                      className="form-select border rounded"
                      value={selectedCategory || ""}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      style={{ padding: "8px 12px" }}
                    >
                      <option value="">All Categories</option>
                      {incomeCategories.map((category) => (
                        <option key={category.name} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Sort By</label>
                    <div className="d-flex gap-2">
                      <select
                        className="form-select border rounded"
                        value={sortBy || "date"}
                        onChange={(e) => setSortBy(e.target.value)}
                        style={{ padding: "8px 12px" }}
                      >
                        <option value="date">Date</option>
                        <option value="amount">Amount</option>
                        <option value="category">Category</option>
                      </select>
                      <select
                        className="form-select border rounded"
                        value={sortOrder || "desc"}
                        onChange={(e) => setSortOrder(e.target.value)}
                        style={{ padding: "8px 12px" }}
                      >
                        <option value="desc">Desc</option>
                        <option value="asc">Asc</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-12">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={clearAllFilters}
                      style={{ padding: "8px 16px" }}
                    >
                      <i className="bi bi-x-circle me-1"></i>
                      Clear All Filters
                    </button>
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
                        <th>Subcategory</th>
                        <th>Company</th>
                        <th>Description</th>
                        <th>Amount</th>
                        <th>Status</th>
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
                          <td>
                            {income.subcategory && (
                              <span className="badge bg-secondary text-white">
                                {income.subcategory}
                              </span>
                            )}
                          </td>
                          <td>
                            {income.company && (
                              <span className="badge bg-warning text-dark">
                                {income.company}
                              </span>
                            )}
                          </td>
                          <td>{income.description}</td>
                          <td className="text-success">
                            Tk {income.amount.toLocaleString()}
                          </td>
                          <td>
                            <span
                              className={`badge ${
                                income.isPaid
                                  ? "bg-success"
                                  : "bg-warning text-dark"
                              }`}
                            >
                              {income.isPaid ? "Received" : "Pending"}
                            </span>
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
                      className="form-control border rounded"
                      value={expenseFormData.date || ""}
                      onChange={(e) =>
                        setExpenseFormData({
                          ...expenseFormData,
                          date: e.target.value,
                        })
                      }
                      required
                      style={{ padding: "8px 12px" }}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Category</label>
                    <select
                      className="form-select border rounded"
                      value={expenseFormData.category || ""}
                      onChange={(e) => {
                        if (e.target.value === "create_custom") {
                          setShowExpenseForm(false);
                          setShowCategoryModal(true);
                          setCategoryFormData({
                            type: "expense",
                            name: "",
                            subcategories: [],
                          });
                        } else {
                          setExpenseFormData({
                            ...expenseFormData,
                            category: e.target.value,
                            subcategory: "", // Reset subcategory when category changes
                          });
                        }
                      }}
                      required
                      style={{ padding: "8px 12px" }}
                    >
                      <option value="">Select Category</option>
                      {expenseCategories.map((category) => (
                        <option key={category.name} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                      <option
                        value="create_custom"
                        style={{ fontStyle: "italic" }}
                      >
                        + Create Custom Category
                      </option>
                    </select>
                  </div>
                  {expenseFormData.category &&
                    getSubcategoriesForCategory(
                      expenseFormData.category,
                      "expense"
                    ).length > 0 && (
                      <div className="mb-3">
                        <label className="form-label">Subcategory</label>
                        <select
                          className="form-select border rounded"
                          value={expenseFormData.subcategory || ""}
                          onChange={(e) =>
                            setExpenseFormData({
                              ...expenseFormData,
                              subcategory: e.target.value,
                            })
                          }
                          style={{ padding: "8px 12px" }}
                        >
                          <option value="">
                            Select Subcategory (Optional)
                          </option>
                          {getSubcategoriesForCategory(
                            expenseFormData.category,
                            "expense"
                          ).map((subcat) => (
                            <option key={subcat} value={subcat}>
                              {subcat}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  <div className="mb-3">
                    <label className="form-label">Company Name</label>
                    <input
                      type="text"
                      className="form-control border rounded"
                      value={expenseFormData.company || ""}
                      onChange={(e) =>
                        setExpenseFormData({
                          ...expenseFormData,
                          company: e.target.value,
                        })
                      }
                      placeholder="e.g., ABC Company"
                      style={{ padding: "8px 12px" }}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <input
                      type="text"
                      className="form-control border rounded"
                      value={expenseFormData.description || ""}
                      onChange={(e) =>
                        setExpenseFormData({
                          ...expenseFormData,
                          description: e.target.value,
                        })
                      }
                      required
                      style={{ padding: "8px 12px" }}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Amount</label>
                    <input
                      type="number"
                      className="form-control border rounded"
                      value={expenseFormData.amount || ""}
                      onChange={(e) =>
                        setExpenseFormData({
                          ...expenseFormData,
                          amount: e.target.value,
                        })
                      }
                      step="0.01"
                      min="0"
                      required
                      style={{ padding: "8px 12px" }}
                    />
                  </div>
                  <div className="mb-3">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="expensePaidStatus"
                        checked={expenseFormData.isPaid || false}
                        onChange={(e) =>
                          setExpenseFormData({
                            ...expenseFormData,
                            isPaid: e.target.checked,
                          })
                        }
                      />
                      <label
                        className="form-check-label"
                        htmlFor="expensePaidStatus"
                      >
                        Mark as Paid
                      </label>
                    </div>
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
                      className="form-control border rounded"
                      value={incomeFormData.date || ""}
                      onChange={(e) =>
                        setIncomeFormData({
                          ...incomeFormData,
                          date: e.target.value,
                        })
                      }
                      required
                      style={{ padding: "8px 12px" }}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Category</label>
                    <select
                      className="form-select border rounded"
                      value={incomeFormData.category || ""}
                      onChange={(e) => {
                        if (e.target.value === "create_custom") {
                          setShowIncomeForm(false);
                          setShowCategoryModal(true);
                          setCategoryFormData({
                            type: "income",
                            name: "",
                            subcategories: [],
                          });
                        } else {
                          setIncomeFormData({
                            ...incomeFormData,
                            category: e.target.value,
                            subcategory: "", // Reset subcategory when category changes
                          });
                        }
                      }}
                      required
                      style={{ padding: "8px 12px" }}
                    >
                      <option value="">Select Category</option>
                      {incomeCategories.map((category) => (
                        <option key={category.name} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                      <option
                        value="create_custom"
                        style={{ fontStyle: "italic" }}
                      >
                        + Create Custom Category
                      </option>
                    </select>
                  </div>
                  {incomeFormData.category &&
                    getSubcategoriesForCategory(
                      incomeFormData.category,
                      "income"
                    ).length > 0 && (
                      <div className="mb-3">
                        <label className="form-label">Subcategory</label>
                        <select
                          className="form-select border rounded"
                          value={incomeFormData.subcategory || ""}
                          onChange={(e) =>
                            setIncomeFormData({
                              ...incomeFormData,
                              subcategory: e.target.value,
                            })
                          }
                          style={{ padding: "8px 12px" }}
                        >
                          <option value="">
                            Select Subcategory (Optional)
                          </option>
                          {getSubcategoriesForCategory(
                            incomeFormData.category,
                            "income"
                          ).map((subcat) => (
                            <option key={subcat} value={subcat}>
                              {subcat}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  <div className="mb-3">
                    <label className="form-label">Company Name</label>
                    <input
                      type="text"
                      className="form-control border rounded"
                      value={incomeFormData.company || ""}
                      onChange={(e) =>
                        setIncomeFormData({
                          ...incomeFormData,
                          company: e.target.value,
                        })
                      }
                      placeholder="e.g., ABC Company"
                      style={{ padding: "8px 12px" }}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <input
                      type="text"
                      className="form-control border rounded"
                      value={incomeFormData.description || ""}
                      onChange={(e) =>
                        setIncomeFormData({
                          ...incomeFormData,
                          description: e.target.value,
                        })
                      }
                      required
                      style={{ padding: "8px 12px" }}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Amount</label>
                    <input
                      type="number"
                      className="form-control border rounded"
                      value={incomeFormData.amount || ""}
                      onChange={(e) =>
                        setIncomeFormData({
                          ...incomeFormData,
                          amount: e.target.value,
                        })
                      }
                      step="0.01"
                      min="0"
                      required
                      style={{ padding: "8px 12px" }}
                    />
                  </div>
                  <div className="mb-3">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="incomePaidStatus"
                        checked={incomeFormData.isPaid || false}
                        onChange={(e) =>
                          setIncomeFormData({
                            ...incomeFormData,
                            isPaid: e.target.checked,
                          })
                        }
                      />
                      <label
                        className="form-check-label"
                        htmlFor="incomePaidStatus"
                      >
                        Mark as Received
                      </label>
                    </div>
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

      {/* Category Management Modal */}
      {showCategoryModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingCategory ? "Edit Category" : "Add New Category"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowCategoryModal(false);
                    setEditingCategory(null);
                  }}
                ></button>
              </div>
              <form onSubmit={handleCategorySubmit}>
                <div className="modal-body">
                  {error && <div className="alert alert-danger">{error}</div>}

                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Category Type</label>
                        <select
                          className="form-select border rounded"
                          value={categoryFormData.type || "expense"}
                          onChange={(e) =>
                            setCategoryFormData({
                              ...categoryFormData,
                              type: e.target.value,
                            })
                          }
                          required
                          style={{ padding: "8px 12px" }}
                        >
                          <option value="expense">Expense</option>
                          <option value="income">Income</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Category Name</label>
                        <input
                          type="text"
                          className="form-control border rounded"
                          value={categoryFormData.name || ""}
                          onChange={(e) =>
                            setCategoryFormData({
                              ...categoryFormData,
                              name: e.target.value,
                            })
                          }
                          required
                          style={{ padding: "8px 12px" }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Subcategories</label>
                    <div className="d-flex gap-2 mb-2">
                      <input
                        type="text"
                        className="form-control border rounded"
                        placeholder="Add subcategory..."
                        value={newSubcategory || ""}
                        onChange={(e) => setNewSubcategory(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addSubcategory();
                          }
                        }}
                        style={{ padding: "8px 12px" }}
                      />
                      <button
                        type="button"
                        className="btn"
                        style={{
                          color: "#000000",
                          backgroundColor: "#ffffff",
                          borderColor: "#000000",
                        }}
                        onMouseOver={(e) => {
                          e.target.style.backgroundColor = "#f8f9fa";
                          e.target.style.borderColor = "#000000";
                        }}
                        onMouseOut={(e) => {
                          e.target.style.backgroundColor = "#ffffff";
                          e.target.style.borderColor = "#000000";
                        }}
                        onClick={addSubcategory}
                      >
                        Add
                      </button>
                    </div>
                    {categoryFormData.subcategories.length > 0 && (
                      <div className="list-group">
                        {categoryFormData.subcategories.map((subcat, index) => (
                          <div
                            key={index}
                            className="list-group-item d-flex justify-content-between align-items-center"
                          >
                            {subcat}
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => removeSubcategory(index)}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowCategoryModal(false);
                      setShowCategoryListModal(true);
                      setEditingCategory(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingCategory ? "Update" : "Add"} Category
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Category List Modal */}
      {showCategoryListModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="categoryListModalLabel">
                  Manage Categories
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowCategoryListModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <h6>Expense Categories</h6>
                    <div className="list-group">
                      {categories
                        .filter((cat) => cat.type === "expense")
                        .map((category) => (
                          <div
                            key={category._id}
                            className="list-group-item d-flex justify-content-between align-items-center"
                          >
                            <div>
                              <strong>{category.name}</strong>
                              {category.subcategories &&
                                category.subcategories.length > 0 && (
                                  <div className="small text-muted">
                                    {category.subcategories.join(", ")}
                                  </div>
                                )}
                            </div>
                            <div className="btn-group">
                              <button
                                type="button"
                                className="btn btn-sm"
                                style={{
                                  color: "#000000",
                                  backgroundColor: "#ffffff",
                                  borderColor: "#000000",
                                }}
                                onMouseOver={(e) => {
                                  e.target.style.backgroundColor = "#f8f9fa";
                                  e.target.style.borderColor = "#000000";
                                }}
                                onMouseOut={(e) => {
                                  e.target.style.backgroundColor = "#ffffff";
                                  e.target.style.borderColor = "#000000";
                                }}
                                onClick={() => handleEditCategory(category)}
                              >
                                <i className="bi bi-pencil"></i>
                              </button>
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-danger"
                                onClick={() =>
                                  handleDeleteCategory(category._id)
                                }
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <h6>Income Categories</h6>
                    <div className="list-group">
                      {categories
                        .filter((cat) => cat.type === "income")
                        .map((category) => (
                          <div
                            key={category._id}
                            className="list-group-item d-flex justify-content-between align-items-center"
                          >
                            <div>
                              <strong>{category.name}</strong>
                              {category.subcategories &&
                                category.subcategories.length > 0 && (
                                  <div className="small text-muted">
                                    {category.subcategories.join(", ")}
                                  </div>
                                )}
                            </div>
                            <div className="btn-group">
                              <button
                                type="button"
                                className="btn btn-sm"
                                style={{
                                  color: "#000000",
                                  backgroundColor: "#ffffff",
                                  borderColor: "#000000",
                                }}
                                onMouseOver={(e) => {
                                  e.target.style.backgroundColor = "#f8f9fa";
                                  e.target.style.borderColor = "#000000";
                                }}
                                onMouseOut={(e) => {
                                  e.target.style.backgroundColor = "#ffffff";
                                  e.target.style.borderColor = "#000000";
                                }}
                                onClick={() => handleEditCategory(category)}
                              >
                                <i className="bi bi-pencil"></i>
                              </button>
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-danger"
                                onClick={() =>
                                  handleDeleteCategory(category._id)
                                }
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn"
                  style={{
                    color: "#ffffff",
                    backgroundColor: "#000000",
                    borderColor: "#000000",
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = "#333333";
                    e.target.style.borderColor = "#333333";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = "#000000";
                    e.target.style.borderColor = "#000000";
                  }}
                  onClick={() => {
                    setShowCategoryListModal(false);
                    setShowCategoryModal(true);
                    setEditingCategory(null);
                    setCategoryFormData({
                      type: "expense",
                      name: "",
                      subcategories: [],
                    });
                  }}
                >
                  Add New Category
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowCategoryListModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

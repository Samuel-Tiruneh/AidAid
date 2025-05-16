import React, { useState, useMemo } from "react";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { saveAs } from "file-saver";
import { format, parseISO, isWithinInterval } from "date-fns";

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const Reports = ({ donorName = "Anonymous", donationsData = [] }) => {
  const sampleDonations = [
    { recipient: "Alemu Kebede", category: "Medical", amount: 150, date: "2023-06-15", type: "Person" },
    { recipient: "Local Food Bank", category: "Emergency Relief", amount: 200, date: "2023-06-10", type: "Institution" },
    { recipient: "Meron Alemayehu", category: "Education", amount: 100, date: "2023-05-28", type: "Person" },
    { recipient: "Animal Rescue Shelter", category: "Animal Welfare", amount: 75, date: "2023-05-15", type: "Institution" },
  ];

  const [filter, setFilter] = useState({ category: "All", type: "All" });
  const [dateRange, setDateRange] = useState({ from: "", to: "" });

  const dataToDisplay = donationsData.length > 0 ? donationsData : sampleDonations;

  const filteredData = useMemo(() => {
    return dataToDisplay.filter((donation) => {
      const matchesCategory = filter.category === "All" || donation.category === filter.category;
      const matchesType = filter.type === "All" || donation.type === filter.type;
      const inDateRange =
        !dateRange.from || !dateRange.to
          ? true
          : isWithinInterval(parseISO(donation.date), {
              start: parseISO(dateRange.from),
              end: parseISO(dateRange.to),
            });
      return matchesCategory && matchesType && inDateRange;
    });
  }, [dataToDisplay, filter, dateRange]);

  const totalDonations = filteredData.reduce((sum, d) => sum + d.amount, 0);
  const totalContributions = filteredData.length;

  const categories = [...new Set(filteredData.map((d) => d.category))];
  const months = [...new Set(filteredData.map((d) => format(parseISO(d.date), "MMMM yyyy")))];

  // Fixed color palette for Pie chart
  const colorPalette = [
    "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40",
  ];

  const pieChartData = {
    labels: categories,
    datasets: [
      {
        label: "Donations by Category",
        data: categories.map((cat) =>
          filteredData.filter((d) => d.category === cat).reduce((sum, d) => sum + d.amount, 0)
        ),
        backgroundColor: categories.map((_, i) => colorPalette[i % colorPalette.length]),
        borderColor: "#ffffff",
        borderWidth: 2,
      },
    ],
  };

  const barChartData = {
    labels: months,
    datasets: [
      {
        label: "Monthly Donations",
        data: months.map((month) =>
          filteredData
            .filter((d) => format(parseISO(d.date), "MMMM yyyy") === month)
            .reduce((sum, d) => sum + d.amount, 0)
        ),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
        borderRadius: 5,
        barThickness: 40,
      },
    ],
  };

  const exportCSV = () => {
    const csvContent = `Recipient,Category,Amount,Date,Type\n${filteredData
      .map((d) => `${d.recipient},${d.category},${d.amount},${d.date},${d.type}`)
      .join("\n")}`;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `${donorName}_Donations_Report.csv`);
  };

  return (
    <div className="bg-white  p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-pink-500 mb-6">Donation Reports</h2>

      {/* Summary */}
      <div className="mb-4 text-black">
        <p><strong>Total Donations:</strong> ${totalDonations.toFixed(2)}</p>
        <p><strong>Total Contributions:</strong> {totalContributions}</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          value={filter.category}
          onChange={(e) => setFilter({ ...filter, category: e.target.value })}
          className="p-2 border rounded-lg"
        >
          <option value="All">All Categories</option>
          {categories.map((cat, idx) => (
            <option key={idx} value={cat}>{cat}</option>
          ))}
        </select>
        <select
          value={filter.type}
          onChange={(e) => setFilter({ ...filter, type: e.target.value })}
          className="p-2 border rounded-lg"
        >
          <option value="All">All Types</option>
          <option value="Person">Persons</option>
          <option value="Institution">Institutions</option>
        </select>
        <input
          type="date"
          value={dateRange.from}
          onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
          className="p-2 border rounded-lg"
        />
        <input
          type="date"
          value={dateRange.to}
          onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
          className="p-2 border rounded-lg"
        />
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-50 dark:bg-gray-200 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-pink-600 mb-2">Donations by Category</h3>
          <Pie data={pieChartData} />
        </div>
        <div className="bg-gray-50 dark:bg-gray-200 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-pink-600  mb-2">Monthly Donations</h3>
          <Bar data={barChartData} />
        </div>
      </div>

      {/* Export Button */}
      <button
        onClick={exportCSV}
        className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2  mb-2 rounded-lg transition"
      >
        Download CSV Report
      </button>
    </div>
  );
};

export default Reports;

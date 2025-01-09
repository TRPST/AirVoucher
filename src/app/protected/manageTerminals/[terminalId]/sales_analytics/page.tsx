"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import { getSalesAnalyticsAction } from "../../../../ott_actions";
import { useRouter } from "next/navigation";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

// Register necessary components for chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
);

const SalesAnalytics = () => {
  const { terminalId } = useParams();
  const [totalSales, setTotalSales] = useState<number>(0);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [salesTrends, setSalesTrends] = useState<any>(null);
  const [salesHistory, setSalesHistory] = useState<any[]>([]);
  const [salesCounts, setSalesCounts] = useState<any>(null); // For the bar graph
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedGraph, setSelectedGraph] = useState<string>("line"); // Dropdown state
  const router = useRouter();

  // Navigate back to Terminal Management
  const navigateToTerminalManagement = () => {
    router.push("/protected/manageTerminals");
  };

  useEffect(() => {
    // Fetch sales analytics data
    const fetchAnalytics = async () => {
      try {
        const result = await getSalesAnalyticsAction(terminalId);

        setTotalSales(result.totalSales);
        setTotalRevenue(result.totalRevenue);
        setSalesTrends(result.salesTrends);
        setSalesHistory(result.salesHistory || []);
        setSalesCounts(result.salesCounts || null); // Number of sales per day
      } catch (error) {
        console.error("Error fetching sales analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [terminalId]);

  if (loading) {
    return (
      <DefaultLayout>
        <div className="container mx-auto p-6">
          <p>Loading sales analytics...</p>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      {/* Back Button */}
      <div className="mt-6">
        <button
          onClick={navigateToTerminalManagement}
          className="rounded bg-gray-600 px-4 py-2 font-semibold text-white transition duration-200 hover:bg-gray-700"
        >
          Back to Terminal Management
        </button>
      </div>
      <div className="container mx-auto p-6">
        <h2 className="mb-6 text-3xl font-bold text-gray-800 dark:text-white">
          Sales Analytics - Terminal {terminalId}
        </h2>

        {/* Sales History */}
        <div className="mb-6">
          <h3 className="mb-4 text-xl font-bold">Sales History</h3>
          <div className="max-h-64 overflow-y-auto rounded-lg border bg-gray-50 p-4 dark:bg-gray-800">
            {salesHistory.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {salesHistory.map((sale, index) => (
                  <li key={index} className="py-2">
                    <span className="font-semibold">
                      R {sale.amount.toFixed(2)}
                    </span>{" "}
                    -{" "}
                    <span className="text-gray-600">
                      {new Date(sale.issued_at).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No sales history available.</p>
            )}
          </div>
        </div>

        {/* Total Sales and Revenue */}
        <div className="mb-6 grid grid-cols-2 gap-4">
          <div className="rounded bg-blue-500 p-4 text-white">
            <h3 className="text-xl font-bold">Total Sales</h3>
            <p className="text-2xl">{totalSales}</p>
          </div>
          <div className="rounded bg-green-500 p-4 text-white">
            <h3 className="text-xl font-bold">Total Revenue</h3>
            <p className="text-2xl">R {totalRevenue.toFixed(2)}</p>
          </div>
        </div>

        {/* Chart Dropdown */}
        <div className="mb-6">
          <label
            htmlFor="chart-select"
            className="mb-2 block text-lg font-bold"
          >
            Select Graph:
          </label>
          <select
            id="chart-select"
            value={selectedGraph}
            onChange={(e) => setSelectedGraph(e.target.value)}
            className="block w-full rounded-lg border p-2"
          >
            <option value="line">Sales Trends (Line Graph)</option>
            <option value="bar">Sales Count (Bar Graph)</option>
          </select>
        </div>

        {/* Graphs */}
        {selectedGraph === "line" && salesTrends && (
          <div className="mb-6">
            <h3 className="mb-4 text-xl font-bold">
              Sales Trends (Last 30 Days)
            </h3>
            <Line
              data={{
                labels: salesTrends.dates || [],
                datasets: [
                  {
                    label: "Sales Amount (R)",
                    data: salesTrends.amounts || [],
                    backgroundColor: "rgba(75, 192, 192, 0.2)",
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 2,
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "top",
                  },
                  title: {
                    display: true,
                    text: "Sales Trends",
                  },
                },
                scales: {
                  x: {
                    title: {
                      display: true,
                      text: "Date",
                    },
                  },
                  y: {
                    title: {
                      display: true,
                      text: "Amount (R)",
                    },
                  },
                },
              }}
            />
          </div>
        )}

        {selectedGraph === "bar" && salesCounts && (
          <div className="mb-6">
            <h3 className="mb-4 text-xl font-bold">
              Sales Count (Last 30 Days)
            </h3>
            <Bar
              data={{
                labels: salesCounts.dates || [],
                datasets: [
                  {
                    label: "Number of Sales",
                    data: salesCounts.counts || [],
                    backgroundColor: "rgba(54, 162, 235, 0.6)",
                    borderColor: "rgba(54, 162, 235, 1)",
                    borderWidth: 1,
                    barThickness: 20, // Adjust bar width
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "top",
                  },
                  title: {
                    display: true,
                    text: "Sales Count",
                  },
                },
                scales: {
                  x: {
                    title: {
                      display: true,
                      text: "Date",
                    },
                  },
                  y: {
                    title: {
                      display: true,
                      text: "Number of Sales",
                    },
                    ticks: {
                      precision: 0, // Ensure y-axis has whole numbers
                    },
                  },
                },
              }}
            />
          </div>
        )}
      </div>
    </DefaultLayout>
  );
};

export default SalesAnalytics;

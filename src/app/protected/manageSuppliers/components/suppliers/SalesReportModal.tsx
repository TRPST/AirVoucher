import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Spinner,
  Select,
  SelectItem,
  Card,
  CardBody,
} from "@nextui-org/react";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/light.css";
import {
  Supplier,
  ReportPeriod,
  ReportFormat,
  SalesReportData,
} from "../../../../types/supplier";
import { useVoucherManagement } from "../../../../../../hooks/useVoucherManagement";

interface SalesReportModalProps {
  isOpen: boolean;
  supplier: Supplier;
  onClose: () => void;
}

const SalesReportModal: React.FC<SalesReportModalProps> = ({
  isOpen,
  supplier,
  onClose,
}) => {
  const [period, setPeriod] = useState<ReportPeriod>("daily");
  const [format, setFormat] = useState<ReportFormat>("csv");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [reportData, setReportData] = useState<SalesReportData | null>(null);

  const {
    isGeneratingReport,
    reportError,
    generateSalesReport,
    downloadSalesReport,
  } = useVoucherManagement();

  // Set default date range based on period
  useEffect(() => {
    const now = new Date();
    let start = new Date(now);

    switch (period) {
      case "daily":
        // Today
        start.setHours(0, 0, 0, 0);
        break;
      case "weekly":
        // Last 7 days
        start.setDate(now.getDate() - 6);
        start.setHours(0, 0, 0, 0);
        break;
      case "monthly":
        // Last 30 days
        start.setDate(now.getDate() - 29);
        start.setHours(0, 0, 0, 0);
        break;
    }

    setStartDate(start);
    setEndDate(now);
  }, [period]);

  // Generate report
  const handleGenerateReport = async () => {
    try {
      const data = await generateSalesReport(
        supplier.id,
        period,
        startDate,
        endDate,
      );
      setReportData(data);
    } catch (error) {
      console.error("Error generating report:", error);
    }
  };

  // Download report
  const handleDownloadReport = async () => {
    try {
      await downloadSalesReport(
        supplier.id,
        period,
        startDate,
        endDate,
        format,
      );
    } catch (error) {
      console.error("Error downloading report:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 dark:bg-gray-800">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-medium">
            Sales Report for {supplier.name}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>
        <p className="mb-4">
          This is a placeholder for the sales report modal. In a real
          implementation, this would show sales data and allow downloading
          reports.
        </p>
        <div className="flex justify-end">
          <button
            className="rounded bg-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-400"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SalesReportModal;

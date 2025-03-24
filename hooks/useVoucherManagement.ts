import { useState } from "react";
import axios from "axios";
import {
  Supplier,
  Voucher,
  SalesReportData,
  ReportPeriod,
  ReportFormat,
  VoucherUploadResponse,
} from "../src/app/types/supplier";

export const useVoucherManagement = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadPreview, setUploadPreview] = useState<Voucher[]>([]);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);

  // Parse voucher file (TXT format)
  const parseVoucherFile = async (
    file: File,
    supplierId: string,
  ): Promise<Voucher[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const lines = content
            .split("\n")
            .filter((line) => line.trim() !== "");

          const vouchers: Voucher[] = lines.map((line, index) => {
            // Assuming format: voucherCode,value
            const [code, valueStr] = line.split(",");
            const value = parseFloat(valueStr.trim());

            if (!code || isNaN(value)) {
              throw new Error(`Invalid voucher format at line ${index + 1}`);
            }

            return {
              id: `temp-${index}`,
              supplierId,
              code: code.trim(),
              value,
              status: "available",
              createdAt: new Date().toISOString(),
            };
          });

          resolve(vouchers);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => {
        reject(new Error("Failed to read file"));
      };

      reader.readAsText(file);
    });
  };

  // Upload vouchers to the system
  const uploadVouchers = async (
    supplierId: string,
    vouchers: Voucher[],
  ): Promise<VoucherUploadResponse> => {
    setIsUploading(true);
    setUploadError(null);

    try {
      const response = await axios.post("/api/vouchers/upload", {
        supplierId,
        vouchers,
      });

      return response.data;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to upload vouchers";
      setUploadError(message);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  // Handle file selection for voucher upload
  const handleFileSelect = async (file: File, supplierId: string) => {
    try {
      setUploadError(null);
      const vouchers = await parseVoucherFile(file, supplierId);
      setUploadPreview(vouchers);
      return vouchers;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to parse voucher file";
      setUploadError(message);
      setUploadPreview([]);
      throw error;
    }
  };

  // Clear upload preview
  const clearUploadPreview = () => {
    setUploadPreview([]);
    setUploadError(null);
  };

  // Generate sales report
  const generateSalesReport = async (
    supplierId: string,
    period: ReportPeriod,
    startDate: Date,
    endDate: Date,
  ): Promise<SalesReportData> => {
    setIsGeneratingReport(true);
    setReportError(null);

    try {
      const response = await axios.get("/api/reports/sales", {
        params: {
          supplierId,
          period,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
      });

      return response.data;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to generate report";
      setReportError(message);
      throw error;
    } finally {
      setIsGeneratingReport(false);
    }
  };

  // Download sales report
  const downloadSalesReport = async (
    supplierId: string,
    period: ReportPeriod,
    startDate: Date,
    endDate: Date,
    format: ReportFormat,
  ): Promise<void> => {
    try {
      const response = await axios.get("/api/reports/download", {
        params: {
          supplierId,
          period,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          format,
        },
        responseType: "blob",
      });

      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `sales-report-${supplierId}-${period}.${format}`,
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to download report";
      setReportError(message);
      throw error;
    }
  };

  return {
    isUploading,
    uploadError,
    uploadPreview,
    isGeneratingReport,
    reportError,
    handleFileSelect,
    uploadVouchers,
    clearUploadPreview,
    generateSalesReport,
    downloadSalesReport,
  };
};

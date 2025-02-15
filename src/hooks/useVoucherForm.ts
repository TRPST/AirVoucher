import { useState } from "react";
import { z } from "zod";
import { MobileDataVoucher } from "@/app/types/common";

const voucherSchema = z.object({
  name: z.string().min(1, "Voucher name is required"),
  vendorId: z.string().min(1, "Vendor ID is required"),
  amount: z.number().min(0, "Amount must be positive"),
  total_comm: z.number().min(0).max(1, "Commission must be between 0 and 1"),
  retailer_comm: z.number().min(0).max(1, "Commission must be between 0 and 1"),
  sales_agent_comm: z
    .number()
    .min(0)
    .max(1, "Commission must be between 0 and 1"),
  supplier_id: z.number().min(1, "Supplier is required"),
  supplier_name: z.string().min(1, "Supplier name is required"),
});

export const useVoucherForm = (initialState?: Partial<MobileDataVoucher>) => {
  const [voucher, setVoucher] = useState<MobileDataVoucher>({
    name: "",
    vendorId: "",
    amount: 0,
    total_comm: 0,
    retailer_comm: 0,
    sales_agent_comm: 0,
    supplier_id: 0,
    supplier_name: "",
    ...initialState,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDirty, setIsDirty] = useState(false);

  const validate = () => {
    try {
      voucherSchema.parse(voucher);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err: z.ZodIssue) => {
          if (err.path.length > 0) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleChange = (field: keyof MobileDataVoucher, value: any) => {
    setVoucher((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const reset = (newState?: Partial<MobileDataVoucher>) => {
    setVoucher({
      name: "",
      vendorId: "",
      amount: 0,
      total_comm: 0,
      retailer_comm: 0,
      sales_agent_comm: 0,
      supplier_id: 0,
      supplier_name: "",
      ...newState,
    });
    setErrors({});
    setIsDirty(false);
  };

  return {
    voucher,
    errors,
    isDirty,
    handleChange,
    validate,
    reset,
    setVoucher,
  };
};

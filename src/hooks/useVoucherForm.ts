import { useState, useEffect } from "react";
import { z } from "zod";
import { VoucherFormData, voucherFormSchema } from "@/app/types/vouchers";
import useLocalStorage from "@/hooks/useLocalStorage";

export const useVoucherForm = (initialState?: Partial<VoucherFormData>) => {
  const [formData, setFormData] = useState<VoucherFormData>({
    name: "",
    vendorId: "",
    amount: 0,
    networkProvider: "MTN",
    total_comm: 0,
    retailer_comm: 0,
    sales_agent_comm: 0,
    supplier_id: 0,
    supplier_name: "",
    ...initialState,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDirty, setIsDirty] = useState(false);

  // Auto-save draft functionality
  const [draftValue, setDraftValue] = useLocalStorage(
    `voucher-draft-${Date.now()}`,
    null,
  );

  useEffect(() => {
    if (isDirty) {
      setDraftValue(formData);
    }
  }, [formData, isDirty, setDraftValue]);

  const loadDraft = () => {
    if (draftValue) {
      try {
        setFormData(draftValue);
        return true;
      } catch (error) {
        console.error("Error loading draft:", error);
      }
    }
    return false;
  };

  const clearDraft = () => {
    setDraftValue(null);
  };

  const validate = () => {
    try {
      voucherFormSchema.parse(formData);
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

  const handleChange = (field: keyof VoucherFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const reset = (newState?: Partial<VoucherFormData>) => {
    setFormData({
      name: "",
      vendorId: "",
      amount: 0,
      networkProvider: "MTN",
      total_comm: 0,
      retailer_comm: 0,
      sales_agent_comm: 0,
      supplier_id: 0,
      supplier_name: "",
      ...newState,
    });
    setErrors({});
    setIsDirty(false);
    clearDraft();
  };

  return {
    formData,
    errors,
    isDirty,
    handleChange,
    validate,
    reset,
    setFormData,
    loadDraft,
    clearDraft,
  };
};

import React, { useEffect, useState } from "react";
import { Supplier, SupplierAPI } from "@/app/types/common";
import { getSuppliersAction, getSupplierApis } from "../../actions";
import SupplierSelect from "./SupplierSelect";
import SupplierApiSelect from "./SupplierApiSelect";

interface SupplierSectionProps {
  selectedSupplier: Supplier | undefined;
  setSelectedSupplier: (supplier: Supplier | undefined) => void;
  selectedSupplierApi: SupplierAPI | null;
  setSelectedSupplierApi: (api: SupplierAPI | null) => void;
}

const SupplierSection: React.FC<SupplierSectionProps> = ({
  selectedSupplier,
  setSelectedSupplier,
  selectedSupplierApi,
  setSelectedSupplierApi,
}) => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [supplierApis, setSupplierApis] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [supplierName, setSupplierName] = useState("");

  useEffect(() => {
    const fetchSuppliers = async () => {
      setLoading(true);
      const result = await getSuppliersAction();
      const suppliers = result?.suppliers || [];
      if (suppliers) {
        setSuppliers(suppliers);
      }
      setLoading(false);
    };
    fetchSuppliers();
  }, []);

  useEffect(() => {
    if (selectedSupplier) {
      fetchSupplierApis(selectedSupplier.supplier_name);
    }
  }, [selectedSupplier]);

  const fetchSupplierApis = async (supplierName: string) => {
    setLoading(true);
    try {
      const result = await getSupplierApis(supplierName);
      if (result.supplierApis) {
        setSupplierApis(result.supplierApis);
      }
    } catch (error) {
      console.error("Error fetching supplier APIs:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SupplierSelect
        suppliers={suppliers}
        selectedSupplier={selectedSupplier}
        onSupplierSelect={setSelectedSupplier}
        loading={loading}
        setSupplierName={setSupplierName}
      />

      {selectedSupplier && (
        <SupplierApiSelect
          supplierApis={supplierApis}
          selectedSupplierApi={selectedSupplierApi}
          onApiSelect={setSelectedSupplierApi}
        />
      )}
    </>
  );
};

export default SupplierSection;

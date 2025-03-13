const getAvailableVouchers = () => {
  const ensureId = (voucher: MobileDataVoucher) => ({
    ...voucher,
    networkProvider: (voucher.vendorId?.toUpperCase() || "MTN") as
      | "CELLC"
      | "MTN"
      | "TELKOM"
      | "VODACOM",
    id: voucher.id || `${voucher.name}-${voucher.vendorId}`,
    disabled:
      selectedVouchers.some(
        (selected) =>
          selected.name === voucher.name &&
          selected.vendorId === voucher.vendorId,
      ) ||
      (existingVouchers?.some(
        (existing) =>
          existing.name === voucher.name &&
          existing.vendorId === voucher.vendorId &&
          existing.supplier_name === selectedSupplier?.supplier_name,
      ) ??
        false),
  });

  if (selectedSupplier?.supplier_name === "OTT") {
    return [ensureId(ottVoucher)];
  }

  if (selectedSupplierApi?.name === "Mobile Data") {
    return mobileDataVouchers.map(ensureId);
  }

  if (selectedSupplierApi?.name === "Mobile Airtime") {
    return mobileAirtimeVouchers.map(ensureId);
  }

  if (selectedSupplier?.supplier_name === "Ringa") {
    // Show the current voucher if it's a Ringa batch
    if (currentVoucher?.metadata?.voucherCount) {
      return [
        {
          ...currentVoucher,
          name: `${currentVoucher.name} (${currentVoucher.metadata.voucherCount} vouchers)`,
          disabled: false,
        },
      ];
    }
  }

  return [];
};

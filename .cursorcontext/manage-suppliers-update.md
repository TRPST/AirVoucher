### AI Prompt for Cursor AI: Updating the Manage Suppliers Screen with Voucher Management and Sales Reports

#### **Objective:**

Enhance the **Manage Suppliers screen** in our Next.js application to allow manual uploading of voucher files (TXT format), real-time voucher inventory management, and comprehensive sales reporting (daily, weekly, monthly). The manual uploading should use the same functionality as the existing manual voucher upload process in the @addsuppliermodal file

#### **Key Improvements:**

1. **Supplier Table Enhancements:**

   - Add a new **Voucher Inventory** column displaying remaining vouchers per supplier.
   - Add **Actions** column with buttons for:
     - **Upload Vouchers** (only enabled for Ringa, Hollywoodbets, Easyload)
     - **View/Download Sales Report** (Daily, Weekly, Monthly)

2. **Voucher Upload Modal:**

   - Allow selection of supplier (**limited to Ringa, Hollywoodbets, Easyload**).
   - Support manual uploads of vouchers via **TXT files**.
   - Provide a **preview** of uploaded vouchers before confirming upload.
   - Include clear validation and error messaging for upload errors.

3. **Voucher Inventory Management:**

   - Display a real-time count of **remaining vouchers** for each supplier.
   - Allow manual addition of missing vouchers directly in the inventory overview.

4. **Sales Report Functionality:**

   - Provide detailed sales reports showing:
     - **Initial Voucher Count**
     - **Vouchers Remaining**
     - **Vouchers Sold**
   - Allow report generation for flexible date ranges:
     - **Daily, Weekly, Monthly**
   - Support downloads in **CSV or PDF formats**.

5. **UI and UX Considerations:**
   - Ensure elements are responsive and accessible.
   - Provide intuitive interactions with clear instructions and confirmation dialogues.

#### **Expected Outcome:**

A robust and user-friendly supplier management interface that facilitates efficient voucher management and comprehensive sales reporting.

---

**Generate the Next.js components, including:**

1. `SupplierTable.tsx` – Enhanced table with voucher inventory and action buttons.
2. `VoucherUploadModal.tsx` – Modal for uploading vouchers from **TXT files**.
3. `VoucherInventory.tsx` – Real-time voucher inventory management interface.
4. `SalesReportModal.tsx` – Modal for viewing and downloading detailed sales reports.
5. `useVoucherManagement.ts` – Custom React hook for managing voucher inventory and uploads.

Ensure all components follow Next.js best practices with TypeScript support.

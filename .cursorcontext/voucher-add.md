### AI Prompt for Cursor AI: Improving the "Add Vouchers" UI in Next.js

#### **Objective:**

Enhance the "Add Vouchers" UI in our Next.js application to improve usability, scalability, and security, based on feedback from our fintech advisory team.

#### **Key Improvements:**

1. **Searchable & Grouped Dropdowns**

   - Implement dynamically filtered, searchable dropdowns for:
     - Supplier selection
     - Supplier API selection
     - Voucher selection, now **grouped by network provider (CELLC, MTN, Telkom, Vodacom)**
   - Ensure dropdowns support large datasets and provide clear options.

2. **Voucher Selection Enhancements**

   - Enable **multi-select checkboxes** to allow users to pick multiple vouchers at once.
   - Group vouchers by **network provider** (_CELLC, MTN, Telkom, Vodacom_), with expandable/collapsible sections.
   - Add **filters** for narrowing down results (e.g., price range, vendor, commission percentage).
   - Introduce a **recently selected vouchers section** for quick access.

3. **Commission Breakdown Clarity**

   - Add **tooltips or inline descriptions** explaining each commission field.
   - Use clear visual separation for different commission fields.

4. **Role-Based Access & Visibility**

   - Restrict commission field edits based on user role (e.g., cashiers shouldn't edit commissions).
   - Implement conditional rendering for elements based on the logged-in user's role.

5. **Bulk Actions for Efficiency**

   - Enable batch addition of multiple vouchers via **CSV upload**.
   - Introduce a "Duplicate Previous Entry" feature for repeated voucher setups.

6. **Selected Voucher Table Enhancements**

   - **Inline editing** for commission values directly in the table.
   - **Sortable and filterable columns** (by amount, profit, or supplier).
   - **Bulk actions** (select multiple vouchers for deletion or modification).
   - **Sticky headers** to keep column names visible while scrolling.
   - **Color-coded commission values** for quick visual differentiation.

7. **Error Handling & Offline Support**
   - Implement **inline error validation** for incorrect commission inputs.
   - Add **auto-save drafts** in case of API failure or internet disconnection.

#### **Technical Requirements:**

- Built with **Next.js 14** and **React 18**.
- Uses **Tailwind CSS** for styling.
- Dropdowns powered by **Headless UI or React-Select**.
- Implement client-side form validation with **Zod or Yup**.
- Ensure API calls are optimized for performance and scalability.

#### **Expected Outcome:**

A more **intuitive, scalable, and secure** UI for adding vouchers to commission groups, with clear role-based access and optimized dropdown selection.

---

**Generate the Next.js components, including:**

1. `VoucherForm.tsx` – Main form UI with updated fields and validation.
2. `VoucherDropdown.tsx` – Searchable, dynamically filtered dropdown component, **grouped by network provider**.
3. `BulkUpload.tsx` – Component for CSV bulk voucher uploads.
4. `useVoucherForm.ts` – Custom React hook to manage form state and validation.

Ensure all components follow Next.js best practices with TypeScript support.

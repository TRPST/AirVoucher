### AI Prompt for Cursor AI: Improving the "Add Vouchers" UI in Next.js

#### **Objective:**

Enhance the "Add Vouchers" UI in our Next.js application to improve usability, scalability, and security, based on feedback from our fintech advisory team.

#### **Key Improvements:**

1. **Searchable Dropdowns**

   - Implement dynamically filtered, searchable dropdowns for:
     - Supplier selection
     - Supplier API selection
     - Voucher selection
   - Ensure dropdowns support large datasets and provide clear options.

2. **Commission Breakdown Clarity**

   - Add **tooltips or inline descriptions** explaining each commission field.
   - Use clear visual separation for different commission fields.

3. **Bulk Actions for Efficiency**

   - Enable batch addition of multiple vouchers via **CSV upload**.
   - Introduce a "Duplicate Previous Entry" feature for repeated voucher setups - or just gray out the already selected voucher in the dropdown.

4. **Error Handling & Offline Support**
   - Implement **inline error validation** for incorrect commission inputs.
   - Add **auto-save drafts** in case of API failure or internet disconnection.

#### **Technical Requirements:**

- Built with **Next.js 14** and **React 18**.
- Uses **Tailwind CSS** for styling.
- Dropdowns powered by **Headless UI or React-Select**.
- Implement client-side form validation with **Zod or Yup**.
- Ensure API calls are optimized for performance and scalability.

#### **Expected Outcome:**

A more **intuitive, scalable, and secure** UI for adding vouchers to commission groups, with clear and optimized dropdown selection.

---

**Generate the Next.js components, including:**

1. `VoucherForm.tsx` – Main form UI with updated fields and validation.
2. `VoucherDropdown.tsx` – Searchable, dynamically filtered dropdown component.
3. `BulkUpload.tsx` – Component for CSV bulk voucher uploads.
4. `useVoucherForm.ts` – Custom React hook to manage form state and validation.

Ensure all components follow Next.js best practices with TypeScript support.

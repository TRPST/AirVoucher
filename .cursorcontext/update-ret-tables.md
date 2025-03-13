### AI Prompt for Cursor AI: Enhancing the Retailers Table with Terminals List Modal

#### **Objective:**

Update the **Retailers table** in the Manage Commission Group page to include a **Terminals column**. Clicking on a retailer’s terminals should open a **modal listing all associated terminals** with relevant details and actions.

#### **Key Improvements:**

1. **Retailers Table Update**

   - Add a **new ‘Terminals’ column** displaying a clickable button that opens a modal.
   - Ensure the column is **sortable and searchable**.

2. **Terminals List Modal**

   - Display a **scrollable list** of terminals associated with the selected retailer.
   - Include a **search/filter field** within the modal for quick navigation.
   - The following details should be shown:
     - **Terminal ID** (Clickable, redirects to the Terminal Dashboard)
     - **Cashier Name** (Shows 'Unassigned' if none)
     - **Active Status** (Yes/No indicator)
   - Sort terminals **by Active/Inactive status** by default.
   - Add a **‘View Full Terminal List’ button** at the bottom for deeper exploration.

3. **Navigation & Actions**
   - **Clicking the Terminal ID redirects to its Dashboard**.
   - Ensure the modal loads **instantly and is lightweight** for large retailers.
   - Include a **close button and smooth transitions** for usability.

#### **Expected Outcome:**

A **more informative and action-driven** Retailers table with **quick access** to terminal data, ensuring better management of retailer-terminal relationships.

---

**Generate the Next.js components, including:**

1. `RetailersTable.tsx` – Updated table with a new ‘Terminals’ column.
2. `TerminalsModal.tsx` – Modal displaying the retailer’s terminals list.
3. `useTerminalList.ts` – Custom React hook for fetching and filtering terminal data.
4. `TerminalLink.tsx` – Component to handle clickable links to terminal dashboards.

Ensure all components follow Next.js best practices with TypeScript support.

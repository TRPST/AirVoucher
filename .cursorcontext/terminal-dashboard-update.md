### AI Prompt for Cursor AI: Enhancing the Terminal Dashboard UI

#### **Objective:**

Redesign the Terminal Dashboard in our Next.js application to provide a clearer, more informative layout. The new design should prominently display three monetary balances (Balance, Credit, Balance Due) and improve the header layout while keeping the voucher selection grid intact.

#### **Key Improvements:**

1. **Monetary Balances Section**

   - Place three **color-coded balance cards** at the top of the dashboard:
     - 🟢 **Balance:** Main available funds (Green).
     - 🔵 **Credit:** Available credit (Blue).
     - 🔴 **Balance Due:** Pending payments (Red).
   - Ensure the balances are **large, bold, and easily readable**.
   - Add **tooltips** explaining each balance type.
   - Implement a **manual refresh button** next to the balances.
   - Display a **live sync indicator** to show when balances last updated.

2. **Header Redesign**

   - The header should be **split into two sections:**
     - **Row 1:** Terminal ID, Last Sync Status, Refresh Icon.
     - **Row 2:** Search Bar, Analytics Button, Additional Actions.
   - Keep the header **compact but informative**, ensuring it works well on all screen sizes.
   - Add **subtle animations for better user interaction**.

3. **Voucher Grid (No Major Changes)**

   - The current voucher selection UI should remain **as is**, ensuring consistency.

4. **Additional UX Enhancements**
   - Ensure all elements are fully **responsive**.
   - Provide a **quick access button** to view **transaction history**.

#### **Expected Outcome:**

A more **structured, scalable, and user-friendly** Terminal Dashboard with clear financial visibility and a well-organized header.

---

**Generate the Next.js components, including:**

1. `TerminalBalances.tsx` – Displays the three balance cards with color coding, tooltips, and a refresh button.
2. `TerminalHeader.tsx` – Redesigned header with two-row structure for better usability.
3. `SyncIndicator.tsx` – Displays last sync time and updates dynamically.
4. `TransactionHistoryButton.tsx` – Quick access button to view transaction history.

Ensure all components follow Next.js best practices with TypeScript support.

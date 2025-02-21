### AI Prompt for Cursor AI: Enhancing Commission Groups with Retailer Assignment

#### **Objective:**

Expand the "Manage Commission Groups" functionality in our Next.js application to include a **Retailers tab**, allowing users to assign retailers to commission groups. This ensures that retailer terminals display only the vouchers assigned to their respective groups.

#### **Key Improvements:**

1. **Tab View for Commission Groups**

   - Implement a **tabbed layout** within each commission group:
     - **Tab 1: Vouchers** – Displays the selected vouchers (existing functionality).
     - **Tab 2: Retailers** – Displays assigned retailers and provides management actions.
   - Ensure the tab view is responsive and intuitive.
   - **Enhance tab selection feedback** with a **bold underline and color change** for the active tab.
   - Implement a **smooth animation effect** when switching between tabs.

2. **Retailer Assignment Functionality**

   - Add a **Retailer List View** displaying all retailers assigned to a commission group.
   - Implement an **“Add Retailers” button** to assign retailers to a group.
   - Support **bulk assignment/removal** of retailers.
   - Add a **search bar and filters** (filter by Name, Location, Terminal ID, and Status: Active/Inactive).
   - Display an **Active/Inactive toggle** to enable or disable retailer access to the group.
   - Implement **pagination or infinite scroll** to handle long retailer lists efficiently.
   - Add an **“Export Retailers” button** to download retailer lists as a CSV file for reporting.

3. **Permissions & Role-Based Access**

   - Restrict retailer assignments to specific roles (e.g., only Super Admins or Sub-Admins can modify assignments).
   - Ensure retailers **cannot be assigned to multiple groups** unless explicitly allowed.

4. **Terminal Synchronization Logic**

   - Once a retailer is assigned to a commission group, their terminals should **only display vouchers from that group**.
   - Ensure **instant updates** when a retailer is added or removed.
   - Implement an **audit log** to track retailer assignment changes.

5. **Confirmation & Error Handling**
   - Add a **confirmation modal** before removing a retailer from a group.
   - Implement **inline validation** to prevent duplicate or conflicting assignments.

#### **Expected Outcome:**

A more **structured, scalable, and efficient** way to manage **commission groups** by allowing **retailers to be assigned** and ensuring their terminals display the correct vouchers.

---

**Generate the Next.js components, including:**

1. `CommissionGroupTabs.tsx` – Component handling tab layout for vouchers and retailers with **bold underline, color change, and animation for active tab**.
2. `RetailersList.tsx` – Displays assigned retailers with **search, filters, and bulk actions**.
3. `AssignRetailersModal.tsx` – Modal for assigning new retailers.
4. `useRetailerAssignment.ts` – Custom React hook for managing retailer assignments.
5. `RetailerExport.tsx` – Component for **exporting retailer lists as CSV**.

Ensure all components follow Next.js best practices with TypeScript support.

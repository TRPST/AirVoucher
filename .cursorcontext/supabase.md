# Supabase Public Schema - Table Descriptions and Relationships

This schema outlines the relationships between users, suppliers, retailers, terminals, and various types of vouchers and sales, providing a comprehensive view of your data structure.

## users

**Primary Key:** `id`

**Description:** Stores user information including email, role, and contact details.

---

## suppliers

**Primary Key:** `id`

**Description:** Contains details about suppliers, including their name and APIs.

---

## retailers

**Primary Key:** `id`

**Description:** Holds information about retailers, including contact details and assigned terminals.

---

## terminals

**Primary Key:** `id`

**Foreign Keys:**

- `assigned_retailer` references `retailers(id)`
- `assigned_cashier` references `users(id)`
- `comm_group_id` references `commission_groups(id)`

**Description:** Represents terminals assigned to retailers and cashiers.

---

## commission_groups

**Primary Key:** `id`

**Description:** Defines groups for commission calculations.

---

## commission_group_suppliers

**Primary Key:** Composite key (`commission_group_id`, `supplier_id`)

**Foreign Keys:**

- `commission_group_id` references `commission_groups(id)`
- `supplier_id` references `suppliers(id)`

**Description:** Links suppliers to commission groups.

---

## commissions

**Primary Key:** `id`

**Description:** Stores commission details related to vouchers, including total and agent commissions.

---

## mobile_data_vouchers

**Primary Key:** `id`

**Foreign Key:** `supplier_id` references `suppliers(id)`

**Description:** Contains information about mobile data vouchers, including amounts and supplier details.

---

## voucher_groups

**Primary Key:** `id`

**Foreign Key:** `main_voucher_group_id` references `main_voucher_groups(id)`

**Description:** Groups vouchers together for easier management.

---

## vouchers

**Primary Key:** `id`

**Foreign Key:** `voucher_group_id` references `voucher_groups(id)`

**Description:** Represents individual vouchers with details like name and amount.

---

## voucher_sales

**Primary Key:** `id`

**Foreign Keys:**

- `supplier_id` references `suppliers(id)`
- `retailer_id` references `retailers(id)`
- `terminal_id` references `terminals(id)`
- `voucher_group_id` references `voucher_groups(id)`

**Description:** Records sales transactions for vouchers, including amounts and commissions.

---

## ott_sales

**Primary Key:** `voucher_id`

**Foreign Key:** `product_id` references `products(id)`

**Description:** Tracks sales of vouchers, including product details and amounts.

---

## products

**Primary Key:** `id`

**Description:** Contains product information, including name, description, and price.

---

## main_voucher_groups

**Primary Key:** `id`

**Description:** Represents main groups for organizing vouchers.

---

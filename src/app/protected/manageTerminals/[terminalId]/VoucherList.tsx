// app/protected/manageTerminals/[terminalID]/VoucherList.tsx
import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

const VoucherList = ({ vouchers, onSelect }) => (
  <div className="mt-6 grid grid-cols-3 gap-4">
    {vouchers.map((voucher) => (
      <Card
        key={voucher.id}
        sx={{ minWidth: 200, textAlign: "center", cursor: "pointer" }}
        onClick={() => onSelect(voucher)}
      >
        <CardContent>
          <Typography variant="h6">{voucher.name}</Typography>
          <Typography>Mobile {voucher.category}</Typography>
          <Typography variant="body2" color="text.secondary">
            R{(voucher.amount / 100).toFixed(2)}
          </Typography>
        </CardContent>
      </Card>
    ))}
  </div>
);

export default VoucherList;

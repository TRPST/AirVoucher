import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";

export const metadata: Metadata = {
  title: "AIRVoucher",
  description: "New AirVoucher System",
};

export default function Products() {
  return (
    <>
      <div className="mt-50 flex h-screen justify-center">
        <p className="text-center text-2xl font-semibold">
          Products Management
          <br />
          Coming Soon
        </p>
      </div>
    </>
  );
}

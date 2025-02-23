"use client";
import "jsvectormap/dist/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import React, { useEffect, useState, Suspense } from "react";
import Loader from "@/components/common/Loader";
import { usePathname } from "next/navigation";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Loading from "./loading";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);

  const pathname = usePathname();
  const isProtectedRoute = pathname?.startsWith("/protected");

  console.log("isProtectedRoute", isProtectedRoute);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <TooltipProvider>
          <Suspense fallback={<Loading />}>
            {loading ? (
              <Loader />
            ) : isProtectedRoute ? (
              <DefaultLayout>{children}</DefaultLayout>
            ) : (
              children
            )}
          </Suspense>
        </TooltipProvider>
      </body>
    </html>
  );
}

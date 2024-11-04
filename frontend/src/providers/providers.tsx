"use client";
import React from "react";
import { AuthProvider } from "./auth-provider";
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AuthProvider>{children}</AuthProvider>
    </>
  );
}

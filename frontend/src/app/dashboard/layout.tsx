"use client";

import Sidebar from "@/components/side-bar";
import TopBar from "@/components/tob-bar";
import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push("/login");
      }
    }
  }, [isAuthenticated, loading, router]);
  if (loading)
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        Loading...
      </div>
    );
  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />
      <div className="flex-1 flex overflow-hidden">
        <aside className="w-64 flex-shrink-0 hidden md:block sticky top-0 h-screen">
          <Sidebar />
        </aside>
        <main className="flex-1 bg-gray-50 p-6">{children}</main>
      </div>
    </div>
  );
}

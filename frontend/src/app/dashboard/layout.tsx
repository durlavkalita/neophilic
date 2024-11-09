"use client";

import Sidebar from "@/components/side-bar";
import TopBar from "@/components/tob-bar";

export default function Layout({ children }: { children: React.ReactNode }) {
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

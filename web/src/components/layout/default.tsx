"use client";

import { ReactNode } from "react";
import Sidebar from "../partials/sidebar";

interface RootLayoutProps {
  children: ReactNode;
}

export default function LayoutDefault({ children }: RootLayoutProps) {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-8 ml-64">
          <div className="min-h-screen bg-white">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

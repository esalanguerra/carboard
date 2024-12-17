"use client";

import { ReactNode } from "react";
import Sidebar from "./sidebar";
import { CarIcon, Sparkles } from "lucide-react";

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
            <section className="relative py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white rounded-3xl shadow-2xl animate-fade-in">
              <div className="relative">
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
                <div className="container mx-auto px-4 relative">
                  <div className="max-w-3xl mx-auto text-center">
                    <div className="flex items-center justify-center mb-6 animate-bounce-slow">
                      <CarIcon className="w-12 h-12 text-blue-400 mr-3" />
                      <Sparkles className="w-8 h-8 text-yellow-400" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-white animate-text-gradient">
                      Find the best cars for your business
                    </h1>
                    <p className="text-xl text-blue-100 mb-8 animate-fade-in-up">
                      Locate opportunities and negotiate efficiently with just a few clicks
                    </p>
                  </div>
                </div>
              </div>
            </section>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

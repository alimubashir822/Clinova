"use client";

import { useState } from "react";
import DoctorSidebar from "@/components/doctor-sidebar";
import VoiceCommandBar from "@/components/voice-command-bar";
import { Menu, Calendar, Clock } from "lucide-react";

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const formattedDate = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar Navigation (Toggleable Drawer on mobile, Sticky on desktop) */}
      <DoctorSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-16 border-b border-border bg-card/50 backdrop-blur-md px-4 sm:px-6 lg:px-8 flex items-center justify-between z-10 shrink-0 gap-4">
          
          <div className="flex items-center gap-3 shrink-0">
            {/* Hamburger Mobile Menu Toggle Button */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition shrink-0"
              title="Open Sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent"></span>
            </span>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest hidden xl:inline">
              Live Clinical Workspace
            </span>
          </div>

          {/* AI Voice & Text Command Console */}
          <VoiceCommandBar />

          <div className="flex items-center gap-4 sm:gap-6 shrink-0">
            {/* Clock & Date Widget */}
            <div className="hidden md:flex items-center gap-2 text-xs font-medium text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-full border border-border/40">
              <Calendar className="w-3.5 h-3.5 text-accent" />
              <span>{formattedDate}</span>
              <span className="text-border">|</span>
              <Clock className="w-3.5 h-3.5 text-accent animate-pulse" />
              <span>15:08</span>
            </div>

            {/* HIPAA Status Badge */}
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              HIPAA SECURE
            </div>
          </div>
        </header>

        {/* Dynamic Route Pages (Responsive margins p-4 on Mobile, p-6 on Tablet, p-8 on Desktop) */}
        <main className="flex-1 overflow-y-auto bg-background p-4 md:p-6 lg:p-8 flex flex-col justify-between">
          <div className="max-w-7xl mx-auto space-y-6 md:space-y-8 w-full flex-1 pb-8">
            {children}
          </div>

          <footer className="max-w-7xl mx-auto w-full text-center text-[10px] text-muted-foreground shrink-0 mt-8 border-t border-border/40 pt-4 flex flex-col md:flex-row justify-between items-center gap-2">
            <p>© 2026 Clinova AI Inc. All rights reserved. • <a href="https://www.medclinicx.com/" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition font-semibold">Healthcare system by Med Clinic X</a></p>
            <p className="flex items-center gap-2">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Encrypted HIPAA Session
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}

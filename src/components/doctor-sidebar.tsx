"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Mic, 
  Users, 
  FileText, 
  FileSpreadsheet, 
  Settings, 
  ShieldAlert, 
  LogOut,
  Stethoscope,
  ShoppingBag,
  GitBranch,
  X
} from "lucide-react";

interface DoctorSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function DoctorSidebar({ isOpen = false, onClose }: DoctorSidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/doctor/dashboard", icon: LayoutDashboard },
    { name: "AI Scribe", href: "/doctor/scribe", icon: Mic },
    { name: "Patients", href: "/doctor/patients", icon: Users },
    { name: "Reports Archive", href: "/doctor/reports", icon: FileSpreadsheet },
    { name: "Specialty Templates", href: "/doctor/templates", icon: FileText },
    { name: "AI Marketplace", href: "/doctor/marketplace", icon: ShoppingBag },
    { name: "AI Workflows", href: "/doctor/workflows", icon: GitBranch },
    { name: "Admin Dashboard", href: "/admin", icon: ShieldAlert },
    { name: "AI Settings", href: "/doctor/settings", icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
        />
      )}

      {/* Sidebar Drawer */}
      <aside className={`w-64 border-r border-border bg-card flex flex-col h-screen fixed lg:sticky top-0 left-0 z-50 shrink-0 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full lg:transform-none"
      }`}>
        {/* Brand Logo Header */}
        <div className="p-6 border-b border-border flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/15 flex items-center justify-center text-accent ring-2 ring-accent/20">
              <Stethoscope className="w-6 h-6 animate-pulse-ring" />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight bg-gradient-to-r from-foreground via-accent to-accent bg-clip-text text-transparent">
                Clinova AI
              </h1>
              <p className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">
                Clinical OS
              </p>
            </div>
          </div>
          
          {/* Mobile Close Button */}
          {onClose && (
            <button 
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition"
              title="Close Menu"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose} // Auto-close drawer on mobile navigation
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-accent text-accent-foreground shadow-sm shadow-accent/20"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-accent-foreground" : "text-muted-foreground"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Session Box */}
        <div className="p-4 border-t border-border bg-secondary/30">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm ring-2 ring-primary/10">
              SJ
            </div>
            <div className="overflow-hidden">
              <h4 className="text-xs font-semibold text-foreground truncate">
                Dr. Sarah Jenkins
              </h4>
              <p className="text-[10px] text-muted-foreground truncate">
                Cardiology / Gen Med
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link
              href="/"
              onClick={onClose}
              className="flex-1 flex items-center justify-center gap-2 py-1.5 px-3 rounded-md bg-secondary text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-border transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              Switch User
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}

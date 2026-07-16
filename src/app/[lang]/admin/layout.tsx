"use client";
import React, { useState, useEffect } from "react";
import { usePathname, useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Inbox, Settings, LogOut, Bell, Menu, X, Sparkles, BookOpen, CheckCircle2, AlertCircle, Trophy, Newspaper, GitPullRequestCreate, Users, Tag, Mailbox } from "lucide-react";
import { ToastProvider, useToast } from "@/components/ui/toast"
import { removeToken } from "@/lib/auth";
import { useGetProfileQuery } from "@/redux/features/auth/auth.api";


export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </ToastProvider>
  );
}

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const lang = params?.lang || "en";
  const { data: profile } = useGetProfileQuery();


  // Sidebar states
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Notification states
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      title: "New submission approval request",
      desc: "Marcus Vance submitted 'Mbappé shines in Champions League'",
      time: "5m ago",
      type: "submission",
      read: false,
    },
    {
      id: "2",
      title: "AI Generation Success",
      desc: "Article draft on F1 British Grand Prix completed",
      time: "20m ago",
      type: "ai",
      read: false,
    },
    {
      id: "3",
      title: "System Status Alert",
      desc: "Web scraper successfully indexed 14 new feeds",
      time: "1h ago",
      type: "system",
      read: true,
    },
  ]);

  // Profile dropdown state
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  // Close dropdowns on route changes
  useEffect(() => {
    setShowNotifications(false);
    setShowProfileDropdown(false);
    setIsMobileOpen(false);
  }, [pathname]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast("All notifications marked as read", "success");
  };

  const clearNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    toast("Notification dismissed");
  };

  const handleLogout = async () => {
    try {
      await removeToken();
      toast("Successfully logged out", "success");
      setTimeout(() => {
        router.push(`/${lang}/auth/sign-in`);
      }, 800);
    } catch (error) {
      toast("Failed to log out", "error");
    }
  };

  // Nav items configuration
  const navItems = [
    {
      name: "Dashboard",
      href: `/${lang}/admin`,
      icon: LayoutDashboard,
      match: (path: string) => path === `/${lang}/admin` || path === `/admin`,
    },
    {
      name: "Article Management",
      href: `/${lang}/admin/article-management`,
      icon: Newspaper,
      match: (path: string) => path.includes("/article-management"),
    },
    {
      name: "Generate Article",
      href: `/${lang}/admin/generate-article`,
      icon: Sparkles,
      match: (path: string) => path.includes("/generate-article"),
    },
    {
      name: "Requested Articles",
      href: `/${lang}/admin/requested-articles`,
      icon: GitPullRequestCreate,
      match: (path: string) => path.includes("/requested-articles"),
    },
    {
      name: "Sports Categories",
      href: `/${lang}/admin/sports-categories`,
      icon: Trophy,
      match: (path: string) => path.includes("/sports-categories"),
    },
    {
      name: "Sports Tags",
      href: `/${lang}/admin/sports-tags`,
      icon: Tag,
      match: (path: string) => path.includes("/sports-tags"),
    },
    {
      name: "User Management",
      href: `/${lang}/admin/user-management`,
      icon: Users,
      match: (path: string) => path.includes("/user-management"),
    },
    {
      name: "NewsLetter",
      href: `/${lang}/admin/newsletter`,
      icon: Mailbox,
      match: (path: string) => path.includes("/newsletter"),
    },
    {
      name: "Settings",
      href: `/${lang}/admin/settings`,
      icon: Settings,
      match: (path: string) => path.includes("/settings"),
    },
  ];

  // Breadcrumbs builder
  const getBreadcrumbs = () => {
    const segments = pathname.split("/").filter((s) => s && s !== lang);
    return segments.map((seg, idx) => {
      const href = "/" + segments.slice(0, idx + 1).join("/");
      const label = seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, " ");
      return { label, href, isLast: idx === segments.length - 1 };
    });
  };

  const breadcrumbs = getBreadcrumbs();


  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white overflow-x-hidden">
      {/* Background Decorative Glows */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />

      {/* Sidebar: Desktop */}
      <aside
        className={`hidden md:flex flex-col border-r border-slate-800/60 bg-slate-900/60 backdrop-blur-xl transition-all duration-300 shrink-0 sticky top-0 h-screen ${isCollapsed ? "w-20" : "w-64"
          }`}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800/40">
          <Link href={`/${lang}/admin`} className="flex items-center gap-3 overflow-hidden">
            <div className="p-2 rounded-xl bg-linear-to-tr from-indigo-600 to-indigo-400 text-white shadow-lg shadow-indigo-500/20 shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            {!isCollapsed && (
              <span className="font-bold text-lg bg-clip-text text-transparent bg-linear-to-r from-white via-slate-100 to-slate-400 tracking-tight whitespace-nowrap">
                SportNews Admin
              </span>
            )}
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = item.match(pathname);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${active
                  ? "bg-indigo-600/15 border border-indigo-500/30 text-indigo-300 font-medium"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/40 border border-transparent"
                  }`}
              >
                <Icon className={`w-5 h-5 transition-transform duration-200 group-hover:scale-105 ${active ? "text-indigo-400" : "text-slate-400"}`} />
                {!isCollapsed && <span className="text-sm">{item.name}</span>}
                {isCollapsed && (
                  <div className="absolute left-full ml-3 px-2 py-1 rounded bg-slate-950 border border-slate-800 text-xs text-slate-200 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 whitespace-nowrap z-50">
                    {item.name}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800/40 bg-slate-950/20">
          {!isCollapsed ? (
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/30 border border-slate-800/30">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center font-bold text-indigo-300 shrink-0 shadow-inner overflow-hidden">
                  {profile?.avatar ? (
                    <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
                  ) : (
                    profile?.name?.substring(0, 2).toUpperCase() || "AM"
                  )}
                </div>
                <div className="min-w-0 leading-tight">
                  <p className="text-xs font-semibold text-slate-200 truncate">{profile?.name || "Alex Mercer"}</p>
                  <p className="text-[10px] text-slate-500 truncate">{profile?.role || "Super Admin"}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex justify-center">
              <button
                onClick={handleLogout}
                className="p-3 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Off-canvas Sidebar */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileOpen(false)} />
          <aside className="relative flex flex-col w-72 bg-slate-900 border-r border-slate-800/80 h-full p-6 animate-slide-in-right z-10">
            <button
              onClick={() => setIsMobileOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <Link href={`/${lang}/admin`} className="flex items-center gap-3 mb-8" onClick={() => setIsMobileOpen(false)}>
              <div className="p-2 rounded-xl bg-linear-to-tr from-indigo-600 to-indigo-400 text-white shadow-lg shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg text-white tracking-tight">SportNews Admin</span>
            </Link>

            <nav className="flex-1 space-y-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = item.match(pathname);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${active
                      ? "bg-indigo-600/15 border border-indigo-500/30 text-indigo-300 font-medium"
                      : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/40 border border-transparent"
                      }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm">{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center font-bold text-indigo-300 shadow-inner overflow-hidden">
                  {profile?.avatar ? (
                    <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
                  ) : (
                    profile?.name?.substring(0, 2).toUpperCase() || "AM"
                  )}
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-200">{profile?.name || "Alex Mercer"}</p>
                  <p className="text-[10px] text-slate-500">{profile?.role || "Super Admin"}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Navbar */}
        <header className="py-3 flex items-center justify-between px-4 md:px-8 border-b border-slate-800/40 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-40">
          <div className="flex items-center gap-4">
            {/* Collapse Sidebar Button (Desktop) */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden md:flex p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 rounded-xl border border-slate-800/40 transition-colors"
            >
              <Menu className="w-4 h-4" />
            </button>
            {/* Hamburger (Mobile) */}
            <button
              onClick={() => setIsMobileOpen(true)}
              className="md:hidden p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 rounded-xl border border-slate-800/40 transition-colors"
            >
              <Menu className="w-4 h-4" />
            </button>

            {/* Page Title */}
            <h2 className="hidden sm:block text-sm font-semibold text-slate-200">
              {breadcrumbs[breadcrumbs.length - 1]?.label || "Dashboard"}
            </h2>
          </div>

          <div className="flex items-center gap-3">


            {/* Profile Avatar Panel */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowProfileDropdown(!showProfileDropdown);
                  setShowNotifications(false);
                }}
                className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center font-bold text-xs text-indigo-300 hover:ring-2 hover:ring-indigo-500/30 transition-all overflow-hidden"
              >
                {profile?.avatar ? (
                  <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
                ) : (
                  profile?.name?.substring(0, 2).toUpperCase() || "AM"
                )}
              </button>

              {showProfileDropdown && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowProfileDropdown(false)} />
                  <div className="absolute right-0 mt-3 w-56 bg-slate-900 border border-slate-800/80 shadow-2xl rounded-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-3 py-2.5 border-b border-slate-800/60 mb-1.5">
                      <p className="text-xs font-semibold text-slate-200">{profile?.name || "Alex Mercer"}</p>
                      <p className="text-[10px] text-slate-500">{profile?.email || "alex.mercer@sportnews.com"}</p>
                    </div>
                    <div className="space-y-0.5">
                      <Link
                        href={`/${lang}/admin/settings`}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-300 hover:bg-slate-800/60 hover:text-slate-100 transition-colors"
                      >
                        <Settings className="w-4 h-4 text-slate-400" />
                        Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto pb-16">
          {children}
        </main>
      </div>
    </div>
  );
}

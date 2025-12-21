import { BookOpen, Headphones, PenTool, Trophy, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useExamStore } from "@/store/examStore";
import { useUserStore } from "@/store/userStore";
import { useState } from "react";

const navItems = [
  { id: "reading" as const, label: "Reading", icon: BookOpen },
  { id: "listening" as const, label: "Listening", icon: Headphones },
  { id: "writing" as const, label: "Writing", icon: PenTool },
];

export const ExamSidebar = () => {
  const { currentSection, setSection, isSubmitted } = useExamStore();
  const { isAdmin, logout } = useUserStore();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      id="app-sidebar"
      className={cn(
        "bg-sidebar text-sidebar-foreground flex flex-col transition-all duration-300 border-r border-sidebar-border",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className={cn("flex items-center", isCollapsed ? "justify-center" : "justify-between")}>
          {!isCollapsed && (
            <div className="animate-fade-in">
              <h1 className="text-lg font-bold">Exam Portal</h1>
              <p className="text-xs text-sidebar-foreground/70">Academic Assessment</p>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-sidebar-accent transition-colors"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        <div className={cn("text-xs uppercase tracking-wider mb-3 px-3", isCollapsed && "hidden")}>
          Sections
        </div>
        {navItems.map((item, index) => (
          <button
            key={item.id}
            onClick={() => setSection(item.id)}
            disabled={isSubmitted}
            className={cn(
              "sidebar-nav-item w-full text-left",
              currentSection === item.id && "sidebar-nav-item-active",
              isSubmitted && "opacity-50 cursor-not-allowed",
              isCollapsed && "justify-center"
            )}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <item.icon className={cn("h-5 w-5 flex-shrink-0", currentSection === item.id && "text-sidebar-primary")} />
            {!isCollapsed && <span className="animate-fade-in">{item.label}</span>}
          </button>
        ))}

        {isSubmitted && (
          <>
            <div className={cn("border-t border-sidebar-border my-4", isCollapsed && "mx-2")} />
            <button
              onClick={() => setSection("results")}
              className={cn(
                "sidebar-nav-item w-full text-left",
                currentSection === "results" && "sidebar-nav-item-active",
                isCollapsed && "justify-center"
              )}
            >
              <Trophy className={cn("h-5 w-5 flex-shrink-0", currentSection === "results" && "text-sidebar-primary")} />
              {!isCollapsed && <span className="animate-fade-in">Results</span>}
            </button>
          </>
        )}
      </nav>

      {/* Footer */}
      <div className={cn("p-4 border-t border-sidebar-border", isCollapsed && "hidden")}>
        <div className="text-xs text-sidebar-foreground/60">
          <p>Copyright &copy; 2025<br />Developed by Jay Vagadiya</p>
          {isAdmin && (
            <button
              onClick={() => setSection("admin")}
              className="mt-4 text-[10px] w-full text-left font-bold text-primary hover:text-primary/80 transition-colors"
            >
              Admin Panel
            </button>
          )}
          <button
            onClick={logout}
            className="mt-2 text-[10px] w-full text-left hover:text-destructive transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
};

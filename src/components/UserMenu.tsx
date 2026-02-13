import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { LogIn, LogOut, User, Crown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export const UserMenu = () => {
  const { user, signOut, subscription } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate("/auth")}
        className="gap-2 text-muted-foreground hover:text-foreground"
      >
        <LogIn className="w-4 h-4" />
        Sign In
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          {subscription.subscribed && <Crown className="w-3.5 h-3.5 text-amber-400" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="glass-panel border-white/10 w-48">
        <div className="px-3 py-2">
          <p className="text-sm font-medium text-foreground truncate">{user.email}</p>
          <p className="text-xs text-muted-foreground">
            {subscription.subscribed ? "Premium Member" : "Free Plan"}
          </p>
        </div>
        <DropdownMenuSeparator className="bg-white/10" />
        <DropdownMenuItem onClick={() => signOut()} className="text-destructive focus:text-destructive cursor-pointer">
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

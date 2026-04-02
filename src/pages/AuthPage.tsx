import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { UserRole } from "@/types";
import { BackButton } from "@/components/BackButton";
import { Mail, Lock, User } from "lucide-react";

export default function AuthPage() {
  const { role } = useParams<{ role: string }>();
  const userRole = (role || "user") as UserRole;
  const { login, register } = useApp();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const redirectPath = userRole === "user" ? "/customer/search" :
    userRole === "owner" ? "/owner/dashboard" : "/admin/dashboard";

  const roleLabel = userRole === "user" ? "Customer" : userRole === "owner" ? "Owner (Admin)" : "Super Admin";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password || (!isLogin && !name)) {
      setError("Please fill all fields");
      return;
    }
    if (isLogin) {
      const success = login(email, password, userRole);
      if (success) navigate(redirectPath);
      else setError("Invalid credentials");
    } else {
      const success = register(name, email, password, userRole);
      if (success) navigate(redirectPath);
      else setError("Email already exists");
    }
  };

  return (
    <div className="page-container gradient-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-scale-in">
        <div className="mb-4">
          <BackButton />
        </div>
        <div className="glass-card p-8">
          <h2 className="text-2xl font-bold text-center mb-1 gradient-text">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-center text-muted-foreground mb-6 text-sm">
            {roleLabel}
          </p>
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm text-center">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text" placeholder="Full Name" value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted border border-border focus:border-primary focus:ring-2 focus:ring-ring/20 outline-none transition-all text-foreground"
                />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="email" placeholder="Email" value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted border border-border focus:border-primary focus:ring-2 focus:ring-ring/20 outline-none transition-all text-foreground"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="password" placeholder="Password" value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted border border-border focus:border-primary focus:ring-2 focus:ring-ring/20 outline-none transition-all text-foreground"
              />
            </div>
            <button type="submit" className="w-full gradient-btn text-center">
              {isLogin ? "Login" : "Register"}
            </button>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-4">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button onClick={() => { setIsLogin(!isLogin); setError(""); }} className="text-primary font-semibold hover:underline">
              {isLogin ? "Register" : "Login"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

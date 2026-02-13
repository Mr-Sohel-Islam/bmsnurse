import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Stethoscope, Eye, EyeOff, Mail, Lock, Loader2, ShieldCheck, Activity, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuthContext } from "@/contexts/AuthContext";

export default function LoginPage() {
  const { login, isAuthenticated, isLoading: authLoading } = useAuthContext();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-lg animate-pulse">
            <Stethoscope className="h-9 w-9 text-primary-foreground" />
          </div>
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setIsSubmitting(true);
    try {
      await login({ email, password });
    } catch {
      // Error handled by AuthContext toast
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDemo = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding panel */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] bg-sidebar relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-primary blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-accent blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
              <Stethoscope className="h-7 w-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-sidebar-foreground">MediCare</h1>
              <p className="text-xs text-sidebar-foreground/60">Patient Monitor System</p>
            </div>
          </div>

          {/* Hero content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl xl:text-5xl font-bold text-sidebar-foreground leading-tight">
                Smart Patient<br />
                <span className="text-primary">Monitoring</span><br />
                Made Simple.
              </h2>
              <p className="text-sidebar-foreground/70 mt-4 text-lg max-w-md">
                Real-time vitals tracking, intelligent alerts, and seamless team coordination — all in one place.
              </p>
            </div>

            {/* Feature highlights */}
            <div className="grid grid-cols-3 gap-4 max-w-lg">
              <div className="bg-sidebar-accent rounded-xl p-4">
                <Activity className="h-6 w-6 text-primary mb-2" />
                <p className="text-sm font-medium text-sidebar-foreground">Live Vitals</p>
                <p className="text-xs text-sidebar-foreground/60 mt-1">Real-time monitoring</p>
              </div>
              <div className="bg-sidebar-accent rounded-xl p-4">
                <ShieldCheck className="h-6 w-6 text-accent mb-2" />
                <p className="text-sm font-medium text-sidebar-foreground">Smart Alerts</p>
                <p className="text-xs text-sidebar-foreground/60 mt-1">Critical notifications</p>
              </div>
              <div className="bg-sidebar-accent rounded-xl p-4">
                <Users className="h-6 w-6 text-primary mb-2" />
                <p className="text-sm font-medium text-sidebar-foreground">Team Sync</p>
                <p className="text-xs text-sidebar-foreground/60 mt-1">Shift coordination</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <p className="text-xs text-sidebar-foreground/40">
            © 2026 MediCare Health Systems. Secure & HIPAA Compliant.
          </p>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center justify-center gap-3 mb-8 lg:hidden">
            <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
              <Stethoscope className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">MediCare</h1>
              <p className="text-sm text-muted-foreground">Patient Monitor System</p>
            </div>
          </div>

          <Card className="shadow-xl border bg-card">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl">Welcome Back</CardTitle>
              <CardDescription>Sign in to access your dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="nurse@medicare.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      disabled={isSubmitting}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                      disabled={isSubmitting}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    />
                    <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
                      Remember me
                    </Label>
                  </div>
                  <Button variant="link" className="px-0 text-sm h-auto">
                    Forgot password?
                  </Button>
                </div>

                <Button type="submit" className="w-full h-11 text-base" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>

                {/* Demo credentials */}
                <div className="rounded-lg bg-muted/50 p-4 space-y-2">
                  <p className="font-medium text-xs text-muted-foreground">Quick Demo Access:</p>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-xs h-8"
                      onClick={() => fillDemo("admin@hospital.com", "admin123")}
                    >
                      Admin
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-xs h-8"
                      onClick={() => fillDemo("sarah@hospital.com", "nurse123")}
                    >
                      Nurse
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          <p className="text-center text-xs text-muted-foreground mt-6">
            Need help? Contact{" "}
            <Button variant="link" className="px-0 h-auto text-xs">
              IT Support
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}

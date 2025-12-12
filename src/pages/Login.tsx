// src/pages/Login.tsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button"; // adjust imports to your setup
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation() as any;

  // Where to send them after login
  const from = location.state?.from?.pathname || "/patients";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Login error:", error);
      setErrorMsg("Invalid email or password. Please try again.");
      setSubmitting(false);
      return;
    }

    console.log("Login success:", data);
    setSubmitting(false);
    navigate(from, { replace: true });
  };

  const [resetEmail, setResetEmail] = useState("");
  const [resetting, setResetting] = useState(false);

  const handleResetPassword = async () => {
    try {
      if (!email) return alert("Enter your email first.");
      setResetting(true);

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      alert("Password reset email sent. Check inbox (and spam).");
    } catch (e: any) {
      console.error(e);
      alert(e.message || "Error sending reset email.");
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-center">
            Staff Login – MCFC
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {errorMsg && (
              <p className="text-red-500 text-sm mt-1">{errorMsg}</p>
            )}

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          {/* 🔐 Password reset */}
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={handleResetPassword}
              className="text-sm text-blue-600 hover:underline"
              disabled={submitting}
            >
              Forgot password?
            </button>
          </div>

          <p className="text-xs text-muted-foreground mt-4 text-center">
            For clinic staff use only.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;

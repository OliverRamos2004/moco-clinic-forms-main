import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const handleUpdatePassword = async () => {
    try {
      setSaving(true);
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      alert("Password updated. Please log in.");
      navigate("/login");
    } catch (e: any) {
      console.error(e);
      alert(e.message || "Error updating password.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Reset Password</h1>
      <Input
        type="password"
        placeholder="New password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button onClick={handleUpdatePassword} disabled={saving}>
        {saving ? "Saving..." : "Update password"}
      </Button>
    </div>
  );
}

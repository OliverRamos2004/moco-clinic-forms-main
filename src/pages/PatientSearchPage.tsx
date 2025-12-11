// src/pages/PatientSearchPage.tsx

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

type PersonRow = {
  person_id: number;
  legal_first_name: string | null;
  legal_last_name: string | null;
  preferred_name: string | null;
  date_of_birth: string | null;
  phone: string | null;
};

const PatientSearchPage: React.FC = () => {
  const [nameQuery, setNameQuery] = useState("");
  const [patients, setPatients] = useState<PersonRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPatients = async (search: string) => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from("person")
        .select(
          "person_id, legal_first_name, legal_last_name, preferred_name, date_of_birth, phone"
        )
        .order("legal_last_name", { ascending: true })
        .limit(50);

      const trimmed = search.trim();
      if (trimmed) {
        query = query.or(
          `legal_first_name.ilike.%${trimmed}%,legal_last_name.ilike.%${trimmed}%,preferred_name.ilike.%${trimmed}%`
        );
      }

      const { data, error } = await query;

      if (error) {
        console.error("❌ Error loading patients:", error);
        setError(error.message);
        setPatients([]);
      } else {
        setPatients((data || []) as PersonRow[]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Load initial list
  useEffect(() => {
    fetchPatients("");
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPatients(nameQuery);
  };

  /* -------------------------------------------------------------------------- */
  /*               ⭐ EXPORT ALL PATIENTS — FULL CSV EXPORT LOGIC                */
  /* -------------------------------------------------------------------------- */

  const handleExportAllPatients = async () => {
    try {
      setExporting(true);

      const { data, error } = await supabase
        .from("person")
        .select(`
          person_id,
          legal_first_name,
          legal_last_name,
          preferred_name,
          date_of_birth,
          phone,

          address:address!address_person_id_fkey (
            street,
            city,
            zip
          ),

          application (
            has_health_insurance,
            montgomery_resident,
            last4_ssn
          )
        `)
        .order("person_id", { ascending: true });

      if (error) throw error;

      const rows = data || [];

      const csvRows = rows.map((p) => ({
        person_id: p.person_id,
        legal_first_name: p.legal_first_name || "",
        legal_last_name: p.legal_last_name || "",
        preferred_name: p.preferred_name || "",
        date_of_birth: p.date_of_birth || "",
        phone: p.phone || "",

        street: p.address?.[0]?.street || "",
        city: p.address?.[0]?.city || "",
        zip: p.address?.[0]?.zip || "",

        has_health_insurance:
          p.application?.[0]?.has_health_insurance ? "Yes" : "No",

        montgomery_resident:
          p.application?.[0]?.montgomery_resident ? "Yes" : "No",

        last4_ssn: p.application?.[0]?.last4_ssn || "",
      }));

      const headers = Object.keys(csvRows[0] || {}).join(",");
      const body = csvRows
        .map((row) =>
          Object.values(row)
            .map((val) => `"${String(val).replace(/"/g, '""')}"`)
            .join(",")
        )
        .join("\n");

      const csvText = headers + "\n" + body;

      const blob = new Blob([csvText], { type: "text/csv" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "patients_export.csv";
      a.click();

      URL.revokeObjectURL(url);

      toast.success("Exported all patients!");
    } catch (err) {
      console.error("❌ Export failed:", err);
      toast.error("Failed to export patients.");
    } finally {
      setExporting(false);
    }
  };

  /* -------------------------------------------------------------------------- */

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Search Patients</h1>

          <div className="flex gap-2">
            {/* ⭐ NEW EXPORT BUTTON */}
            <Button
              variant="secondary"
              size="sm"
              onClick={handleExportAllPatients}
              disabled={exporting}
            >
              {exporting ? "Exporting..." : "Export All Patients"}
            </Button>

            {/* Existing New Intake */}
            <Button asChild variant="outline" size="sm">
              <Link to="/">New Intake</Link>
            </Button>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row gap-3 mb-6"
        >
          <Input
            placeholder="Search by first, last, or preferred name..."
            value={nameQuery}
            onChange={(e) => setNameQuery(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </Button>
        </form>

        {error && (
          <p className="text-sm text-red-500 mb-4">
            Error loading patients: {error}
          </p>
        )}

        {!loading && !error && patients.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No patients found. Try a different name.
          </p>
        )}

        <div className="space-y-3">
          {patients.map((p) => (
            <Card
              key={p.person_id}
              className="hover:bg-muted/50 transition-colors"
            >
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-base">
                  <span>
                    {p.legal_last_name}, {p.legal_first_name}
                    {p.preferred_name && (
                      <span className="text-xs text-muted-foreground ml-2">
                        ({p.preferred_name})
                      </span>
                    )}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ID: {p.person_id}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex justify-between items-center pt-0 pb-3">
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>DOB: {p.date_of_birth || "—"}</div>
                  <div>Phone: {p.phone || "—"}</div>
                </div>
                <Button asChild size="sm" variant="outline">
                  <Link to={`/patients/${p.person_id}`}>View details</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default PatientSearchPage;

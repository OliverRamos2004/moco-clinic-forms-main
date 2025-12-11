// src/pages/PatientSearchPage.tsx  (adjust path if needed)

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StaffNavbar } from "@/components//PatientForm/StaffNavbar";

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
        // Search by first OR last OR preferred name (case-insensitive)
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

  // Load initial list (last 50 patients) on mount
  useEffect(() => {
    fetchPatients("");
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPatients(nameQuery);
  };

  return (
    <div className="min-h-screen bg-background">
      <StaffNavbar />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Search Patients</h1>
          <Button asChild variant="outline" size="sm">
            <Link to="/">New Intake</Link>
          </Button>
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

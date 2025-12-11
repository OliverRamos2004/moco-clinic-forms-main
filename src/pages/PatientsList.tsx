import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface Address {
  street: string;
  city: string;
  zip: string;
}

interface Application {
  has_health_insurance: boolean;
  montgomery_resident: boolean;
  last4_ssn: string;
}

interface Person {
  person_id: number;
  legal_first_name: string;
  legal_last_name: string;
  date_of_birth: string;
  phone: string;
  email?: string;
  address?: Address[];
  application?: Application[];
}

export const PatientsList = () => {
  const [patients, setPatients] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Person | null>(null);
  const [exporting, setExporting] = useState(false); // ⭐ NEW

  // FETCH PATIENTS
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const { data, error } = await supabase
          .from("person")
          .select(
            `
          person_id,
          legal_first_name,
          legal_last_name,
          date_of_birth,
          phone,
          email,

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
        `
          )
          .order("person_id", { ascending: false });

      if (error) throw error;

      console.log("✅ Patients fetched:", data);
      setPatients(data || []);
    } catch (err) {
      console.error("❌ Fetch failed:", err);
      setError("Failed to fetch patients");
      toast.error("Failed to load patients");
    } finally {
      setLoading(false);
    }
  };

  fetchPatients();
}, []);



/* -------------------------------------------------------------------------- */
/*                ⭐ NEW — EXPORT ALL PATIENTS AS CSV FUNCTION                */
/* -------------------------------------------------------------------------- */

const handleExportAllPatients = async () => {
  try {
    setExporting(true);

    // 1️⃣ Fetch from Supabase
    const { data, error } = await supabase
      .from("person")
      .select(
        `
        person_id,
        legal_first_name,
        legal_last_name,
        date_of_birth,
        phone,
        email,

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
      `
      )
      .order("person_id", { ascending: true });

    if (error) throw error;

    const rows = data || [];

    // 2️⃣ Flatten each row into a CSV row
    const csvRows = rows.map((p) => ({
      person_id: p.person_id,
      legal_first_name: p.legal_first_name,
      legal_last_name: p.legal_last_name,
      date_of_birth: p.date_of_birth,
      phone: p.phone,
      email: p.email ?? "",

      street: p.address?.[0]?.street ?? "",
      city: p.address?.[0]?.city ?? "",
      zip: p.address?.[0]?.zip ?? "",

      has_health_insurance:
        p.application?.[0]?.has_health_insurance ? "Yes" : "No",

      montgomery_resident:
        p.application?.[0]?.montgomery_resident ? "Yes" : "No",

      last4_ssn: p.application?.[0]?.last4_ssn ?? "",
    }));

    // 3️⃣ Build CSV text
    const headers = Object.keys(csvRows[0] || {}).join(",");
    const body = csvRows
      .map((row) =>
        Object.values(row)
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const csvContent = headers + "\n" + body;

    // 4️⃣ Download CSV
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "patients_export.csv";
    a.style.display = "none";

    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(url);

    toast.success("Exported all patients!");
  } catch (err) {
    console.error("❌ CSV Export failed:", err);
    toast.error("Failed to export patients.");
  } finally {
    setExporting(false);
  }
};



/* -------------------------------------------------------------------------- */
/*                              UI RENDER START                                */
/* -------------------------------------------------------------------------- */

if (loading) return <p className="text-center py-10">Loading patients...</p>;
if (error) return <p className="text-center py-10 text-red-500">{error}</p>;

return (
  <div className="min-h-screen bg-background p-6">
    <Card className="max-w-6xl mx-auto p-6 shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Patient Records</h1>

        {/* ⭐ NEW — EXPORT ALL PATIENTS BUTTON */}
        <Button onClick={handleExportAllPatients} disabled={exporting}>
          {exporting ? "Exporting..." : "Export All Patients"}
        </Button>
      </div>

      {patients.length === 0 ? (
        <p className="text-gray-500 text-center">No patient records found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-2 border-b">First Name</th>
                <th className="p-2 border-b">Last Name</th>
                <th className="p-2 border-b">Date of Birth</th>
                <th className="p-2 border-b">Phone</th>
                <th className="p-2 border-b">Address</th>
                <th className="p-2 border-b">Has Insurance</th>
                <th className="p-2 border-b">Actions</th>
              </tr>
            </thead>

            <tbody>
              {patients.map((p) => (
                <tr key={p.person_id} className="hover:bg-gray-50">
                  <td className="p-2 border-b">{p.legal_first_name}</td>
                  <td className="p-2 border-b">{p.legal_last_name}</td>
                  <td className="p-2 border-b">{p.date_of_birth}</td>
                  <td className="p-2 border-b">{p.phone}</td>

                  {/* Address */}
                  <td className="p-2 border-b">
                    {p.address?.[0]
                      ? `${p.address[0].street}, ${p.address[0].city}`
                      : "—"}
                  </td>

                  {/* Has Insurance */}
                  <td className="p-2 border-b">
                    {p.application?.[0]?.has_health_insurance ? "Yes" : "No"}
                  </td>

                  {/* View Button */}
                  <td className="p-2 border-b text-center">
                    <Button
                      onClick={() => {
                        window.location.href = `/patients/${p.person_id}`;
                      }}
                    >
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6 text-center">
        <Button onClick={() => window.location.reload()}>Refresh</Button>
      </div>
    </Card>

    {/* Patient Details Modal */}
    <Dialog
      open={!!selectedPatient}
      onOpenChange={() => setSelectedPatient(null)}
    >
      <DialogContent className="max-w-2xl p-6">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-semibold">
            {selectedPatient
              ? `${selectedPatient.legal_first_name} ${selectedPatient.legal_last_name}`
              : "Patient Details"}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Patient ID: {selectedPatient?.person_id}
          </p>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  </div>
);
};

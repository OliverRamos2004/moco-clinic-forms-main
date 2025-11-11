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
            address:address!address_person_id_fkey(street, city, zip),
            application:application!application_applicant_id_fkey(has_health_insurance, montgomery_resident, last4_ssn)
          `
          )
          .order("person_id", { ascending: false });

        if (error) throw error;

        console.log("✅ Patients fetched:", data);
        setPatients(data || []);
      } catch (err: any) {
        console.error("❌ Fetch failed:", err);
        setError("Failed to fetch patients");
        toast.error("Failed to load patients");
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  if (loading) return <p className="text-center py-10">Loading patients...</p>;
  if (error) return <p className="text-center py-10 text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-background p-6">
      <Card className="max-w-6xl mx-auto p-6 shadow-lg">
        <h1 className="text-2xl font-bold mb-6">Patient Records</h1>

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
                    <td className="p-2 border-b">
                      {p.address?.[0]
                        ? `${p.address[0].street}, ${p.address[0].city}`
                        : "—"}
                    </td>
                    <td className="p-2 border-b">
                      {p.application?.[0]?.has_health_insurance ? "Yes" : "No"}
                    </td>
                    <td className="p-2 border-b text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedPatient(p)}
                      >
                        View Details
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

      {/* 🧩 Patient Details Modal */}
      <Dialog
        open={!!selectedPatient}
        onOpenChange={() => setSelectedPatient(null)}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {selectedPatient
                ? `${selectedPatient.legal_first_name} ${selectedPatient.legal_last_name}`
                : "Patient Details"}
            </DialogTitle>
          </DialogHeader>

          {selectedPatient && (
            <div className="space-y-2 text-sm">
              <p>
                <strong>Date of Birth:</strong> {selectedPatient.date_of_birth}
              </p>
              <p>
                <strong>Phone:</strong> {selectedPatient.phone}
              </p>
              <p>
                <strong>Email:</strong> {selectedPatient.email || "—"}
              </p>
              <p>
                <strong>Address:</strong>{" "}
                {selectedPatient.address?.[0]
                  ? `${selectedPatient.address[0].street}, ${selectedPatient.address[0].city}, ${selectedPatient.address[0].zip}`
                  : "No address on file"}
              </p>
              <p>
                <strong>Has Insurance:</strong>{" "}
                {selectedPatient.application?.[0]?.has_health_insurance
                  ? "Yes"
                  : "No"}
              </p>
              <p>
                <strong>Montgomery Resident:</strong>{" "}
                {selectedPatient.application?.[0]?.montgomery_resident
                  ? "Yes"
                  : "No"}
              </p>
              <p>
                <strong>Last 4 of SSN:</strong>{" "}
                {selectedPatient.application?.[0]?.last4_ssn || "—"}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

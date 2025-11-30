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

  // JOIN

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
            has_health_insurance
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

      {/* 🧩 Patient Details Modal */}
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

          {selectedPatient && (
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
              {/* LEFT COLUMN */}
              <div>
                <h3 className="text-md font-semibold mb-2 border-b pb-1">
                  Personal Information
                </h3>
                <p>
                  <span className="font-medium">First Name:</span>{" "}
                  {selectedPatient.legal_first_name}
                </p>
                <p>
                  <span className="font-medium">Last Name:</span>{" "}
                  {selectedPatient.legal_last_name}
                </p>
                <p>
                  <span className="font-medium">Date of Birth:</span>{" "}
                  {selectedPatient.date_of_birth}
                </p>
                <p>
                  <span className="font-medium">Phone:</span>{" "}
                  {selectedPatient.phone}
                </p>
                <p>
                  <span className="font-medium">Email:</span>{" "}
                  {selectedPatient.email || "—"}
                </p>
              </div>

              {/* RIGHT COLUMN */}
              <div>
                <h3 className="text-md font-semibold mb-2 border-b pb-1">
                  Address
                </h3>
                {selectedPatient.address?.[0] ? (
                  <>
                    <p>
                      <span className="font-medium">Street:</span>{" "}
                      {selectedPatient.address[0].street}
                    </p>
                    <p>
                      <span className="font-medium">City:</span>{" "}
                      {selectedPatient.address[0].city}
                    </p>
                    <p>
                      <span className="font-medium">Zip:</span>{" "}
                      {selectedPatient.address[0].zip}
                    </p>
                  </>
                ) : (
                  <p>No address on file</p>
                )}
              </div>

              {/* FULL-WIDTH SECTION */}
              <div className="col-span-2 mt-4">
                <h3 className="text-md font-semibold mb-2 border-b pb-1">
                  Application Information
                </h3>
                {selectedPatient.application?.[0] ? (
                  <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                    <p>
                      <span className="font-semibold">Has Insurance:</span>{" "}
                      {selectedPatient.application[0].has_health_insurance
                        ? "Yes"
                        : "No"}
                    </p>
                    <p>
                      <span className="font-semibold">
                        Montgomery Resident:
                      </span>{" "}
                      {selectedPatient.application[0].montgomery_resident
                        ? "Yes"
                        : "No"}
                    </p>
                    <p>
                      <span className="font-semibold">Last 4 SSN:</span>{" "}
                      {selectedPatient.application[0].last4_ssn || "—"}
                    </p>
                  </div>
                ) : (
                  <p>No application information available</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

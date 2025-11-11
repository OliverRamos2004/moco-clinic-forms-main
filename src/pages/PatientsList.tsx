import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Person {
  person_id: string;
  legal_first_name: string;
  legal_last_name: string;
  date_of_birth: string;
  phone: string;
  email?: string;
}

export const PatientsList = () => {
  const [patients, setPatients] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    address(street, city, zip),
    application(has_health_insurance, montgomery_resident, last4_ssn)
  `
          )
          .order("created_at", { ascending: false });

        if (error) throw error;

        setPatients(data || []);
      } catch (err: any) {
        console.error(err);
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
      <Card className="max-w-5xl mx-auto p-6 shadow-lg">
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
                  <th className="p-2 border-b">Email</th>
                </tr>
              </thead>
              <tbody>
                <tbody>
                  {patients.map((p) => (
                    <tr key={p.person_id} className="hover:bg-gray-50">
                      <td className="p-2 border-b">{p.legal_first_name}</td>
                      <td className="p-2 border-b">{p.legal_last_name}</td>
                      <td className="p-2 border-b">{p.date_of_birth}</td>
                      <td className="p-2 border-b">{p.phone}</td>

                      {/* 🏠 Address (joined) */}
                      <td className="p-2 border-b">
                        {p.address?.[0]?.street || "—"},{" "}
                        {p.address?.[0]?.city || ""}
                      </td>

                      {/* 💊 Application info (joined) */}
                      <td className="p-2 border-b">
                        {p.application?.[0]?.has_health_insurance
                          ? "Yes"
                          : "No"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </tbody>
            </table>
          </div>
        )}
        <div className="mt-6 text-center">
          <Button onClick={() => window.location.reload()}>Refresh</Button>
        </div>
      </Card>
    </div>
  );
};

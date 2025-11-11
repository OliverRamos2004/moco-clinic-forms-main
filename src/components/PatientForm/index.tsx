import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Header } from "./Header";
import { BasicInfoTab } from "./BasicInfoTab";
import { HealthHistoryTab } from "./HealthHistoryTab";
import { MedicalHistoryTab } from "./MedicalHistoryTab";
import { FamilyHistoryTab } from "./FamilyHistoryTab";
import { LifestyleTab } from "./LifestyleTab";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";

export const PatientForm = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({});
  const [activeTab, setActiveTab] = useState("basic");
  const [isSubmitting, setIsSubmitting] = useState(false); // ✅ NEW

  const updateFormData = (newData: any) => {
    setFormData({ ...formData, ...newData });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // ✅ prevent double clicks
    setIsSubmitting(true);
    toast.info("Submitting application...");

    try {
      // 1️⃣ Basic validation
      if (!formData.legalName || !formData.dob) {
        throw new Error("Missing required fields: name or date of birth");
      }

      // Split full name safely
      const [firstName = "", lastName = ""] = (formData.legalName || "").split(
        " "
      );

      // 2️⃣ Insert into person
      const { data: personData, error: personError } = await supabase
        .from("person")
        .insert([
          {
            legal_first_name: firstName.trim(),
            legal_last_name: lastName.trim(),
            preferred_name: formData.preferredName || null,
            date_of_birth: formData.dob || null,
            sex_at_birth: formData.gender || null,
            phone: formData.phone || null,
            email: formData.email || null,
          },
        ])
        .select("person_id")
        .single();

      if (personError) throw personError;
      const person_id = personData.person_id;

      // 3️⃣ Insert address
      const { error: addressError } = await supabase.from("address").insert([
        {
          street: formData.street || null,
          city: formData.city || null,
          zip: formData.zip || null,
          person_id,
        },
      ]);
      if (addressError) throw addressError;

      // 4️⃣ Insert application (insurance/residency)
      const { error: appError } = await supabase.from("application").insert([
        {
          applicant_id: person_id,
          has_health_insurance: formData.hasInsurance === "yes",
          montgomery_resident: formData.isResident === "yes",
          last4_ssn: formData.ssn || null,
          signature_name: `${firstName} ${lastName}`,
          signature_date: new Date().toISOString(),
        },
      ]);
      if (appError) throw appError;

      // ✅ Success
      toast.success("✅ Application submitted successfully!");
      console.log("Inserted records:", { person_id });
    } catch (error: any) {
      console.error("Submission failed:", error.message || error);
      toast.error(`Failed to submit: ${error.message || "Unknown error"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <form onSubmit={handleSubmit}>
          <Card className="shadow-lg">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto">
                <TabsTrigger value="basic" className="text-xs md:text-sm py-2">
                  {t("tabs.basic")}
                </TabsTrigger>
                <TabsTrigger value="health" className="text-xs md:text-sm py-2">
                  {t("tabs.health")}
                </TabsTrigger>
                <TabsTrigger
                  value="medical"
                  className="text-xs md:text-sm py-2"
                >
                  {t("tabs.medical")}
                </TabsTrigger>
                <TabsTrigger value="family" className="text-xs md:text-sm py-2">
                  {t("tabs.family")}
                </TabsTrigger>
                <TabsTrigger
                  value="lifestyle"
                  className="text-xs md:text-sm py-2"
                >
                  {t("tabs.lifestyle")}
                </TabsTrigger>
              </TabsList>

              <div className="p-6">
                <TabsContent value="basic">
                  <BasicInfoTab
                    formData={formData}
                    updateFormData={updateFormData}
                  />
                </TabsContent>

                <TabsContent value="health">
                  <HealthHistoryTab
                    formData={formData}
                    updateFormData={updateFormData}
                  />
                </TabsContent>

                <TabsContent value="medical">
                  <MedicalHistoryTab
                    formData={formData}
                    updateFormData={updateFormData}
                  />
                </TabsContent>

                <TabsContent value="family">
                  <FamilyHistoryTab
                    formData={formData}
                    updateFormData={updateFormData}
                  />
                </TabsContent>

                <TabsContent value="lifestyle">
                  <LifestyleTab
                    formData={formData}
                    updateFormData={updateFormData}
                  />
                </TabsContent>
              </div>
            </Tabs>
          </Card>

          <div className="flex justify-between mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                const tabs = [
                  "basic",
                  "health",
                  "medical",
                  "family",
                  "lifestyle",
                ];
                const currentIndex = tabs.indexOf(activeTab);
                if (currentIndex > 0) {
                  setActiveTab(tabs[currentIndex - 1]);
                }
              }}
              disabled={activeTab === "basic"}
            >
              {t("buttons.previous")}
            </Button>

            {activeTab === "lifestyle" ? (
              <Button
                type="submit"
                className="bg-primary"
                disabled={isSubmitting} // ✅ Disable while submitting
              >
                {isSubmitting ? "Submitting..." : t("buttons.submit")}{" "}
                {/* ✅ Dynamic label */}
              </Button>
            ) : (
              <Button
                type="button"
                onClick={() => {
                  const tabs = [
                    "basic",
                    "health",
                    "medical",
                    "family",
                    "lifestyle",
                  ];
                  const currentIndex = tabs.indexOf(activeTab);
                  if (currentIndex < tabs.length - 1) {
                    setActiveTab(tabs[currentIndex + 1]);
                  }
                }}
              >
                {t("buttons.next")}
              </Button>
            )}
          </div>
        </form>
      </main>
    </div>
  );
};

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

// Helper to safely convert form values to integers for Supabase
const safeInt = (value: any) => {
  if (!value) return null; // empty string, undefined, null → NULL in DB
  const n = parseInt(value);
  return isNaN(n) ? null : n; // "60 oz" → null
};

export const PatientForm = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    // BASIC INFO — MUST MATCH DATABASE
    legal_first_name: "",
    legal_last_name: "",
    date_of_birth: "",
    phone: "",
    email: "",
    street: "",
    city: "",
    zip: "",
    last4_ssn: "",
    has_health_insurance: null, // boolean
    montgomery_resident: null, // boolean

    // INTAKE INFO (if collected in other tabs)
    main_reason_for_visit: "",
    other_concerns: "",
    preferred_pharmacy: "",
    pharmacy_phone: "",
    immunizations_current: "",

    // LIFESTYLE & NUTRITION (already added)
    caffeine: "",
    cups_per_day: "",
    alcohol_use: "",
    drinks_beer: "",
    drinks_wine: "",
    drinks_liquor: "",
    cutDown: "",
    annoyed: "",
    guilty: "",
    morning: "",
    tobacco_use: "",
    smoking_start_age: "",
    smoking_years: "",
    cigarettes: "",
    cigars: "",
    chew: "",
    quit_tobacco: "",
    years_since_quit: "",
    drug_use: "",
    drug_list: "",
    salt_intake: "",
    sugar_intake: "",
    fruit_servings_per_day: "",
    vegetable_servings_per_day: "",
    meals_per_day: "",
    water_per_day: "",
    other_fluids: "",
    food_intolerances_allergies: "",
    additional_notes: "",
    protein_sources: "",
    dieting: "",
    weight_stability: "",
    signature_name: "",
    signature_date: "",
  });

  const [activeTab, setActiveTab] = useState("basic");
  const [isSubmitting, setIsSubmitting] = useState(false); // ✅ NEW

  const updateFormData = (newData: any) => {
    setFormData({ ...formData, ...newData });
  };

  console.log("FORM DATA BEFORE SUBMIT:", formData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log("FORM DATA BEFORE SUBMIT:", formData);

      // ---------------------------
      // 1️⃣ Insert into PERSON
      // ---------------------------
      const { data: personData, error: personError } = await supabase
        .from("person")
        .insert([
          {
            legal_first_name: formData.legal_first_name || "N/A",
            legal_last_name: formData.legal_last_name || "N/A",
            date_of_birth: formData.date_of_birth || null,
            phone: formData.phone || null,
            email: formData.email || null,
          },
        ])
        .select("person_id")
        .single();

      if (personError) throw personError;
      const person_id = personData.person_id;

      // ---------------------------
      // 2️⃣ Insert ADDRESS
      // ---------------------------
      const { error: addressError } = await supabase.from("address").insert([
        {
          person_id,
          street: formData.street || "N/A",
          city: formData.city || "N/A",
          zip: formData.zip || "00000",
        },
      ]);

      if (addressError) throw addressError;

      // ---------------------------
      // 3️⃣ Insert APPLICATION
      // ---------------------------
      const { data: appData, error: appError } = await supabase
        .from("application")
        .insert([
          {
            applicant_id: person_id,
            has_health_insurance:
              formData.has_health_insurance === true ? true : false,
            montgomery_resident:
              formData.montgomery_resident === true ? true : false,
            last4_ssn: formData.last4_ssn || null,
          },
        ])
        .select("application_id")
        .single();

      if (appError) throw appError;
      const application_id = appData.application_id;

      // ---------------------------
      // 4️⃣ SAFE INTAKE PAYLOAD
      // ---------------------------
      const intakePayload = {
        application_id,
        main_reason_for_visit: formData.main_reason_for_visit || "N/A",
        other_concerns: formData.other_concerns || null,
        preferred_pharmacy: formData.preferred_pharmacy || null,
        pharmacy_phone: formData.pharmacy_phone || null,

        // MUST be "yes" | "no" | "dont_know"
        immunizations_current: formData.immunizations_current || "dont_know",
      };

      // 4️⃣ Insert into INTAKE
      const { data: intakeData, error: intakeError } = await supabase
        .from("intake")
        .insert([intakePayload])
        .select("intake_id")
        .single();

      if (intakeError) throw intakeError;
      const intake_id = intakeData.intake_id;

      // ---------------------------
      // 5️⃣ SAFE NUTRITION PAYLOAD
      // ---------------------------
      const nutritionPayload = {
        intake_id,
        dieting: formData.dieting || null,
        salt_intake: formData.salt_intake || null,

        // numeric → convert safely
        fruit_servings_per_day: safeInt(formData.fruit_servings_per_day),
        vegetable_servings_per_day: safeInt(
          formData.vegetable_servings_per_day
        ),
        meals_per_day: safeInt(formData.meals_per_day),
        water_per_day: safeInt(formData.water_per_day),

        protein_sources: formData.protein_sources || null,
        sugar_intake: formData.sugar_intake || null,
        weight_stability: formData.weight_stability || null,
        food_intolerances_allergies:
          formData.food_intolerances_allergies || null,
        other_fluids: formData.other_fluids || null,
        additional_notes: formData.additional_notes || null,
      };

      // 5️⃣ Insert into NUTRITION HISTORY
      const { error: nutritionError } = await supabase
        .from("nutrition_history")
        .insert([nutritionPayload]);

      if (nutritionError) throw nutritionError;

      // ------------------------------
      // 6️⃣ SOCIAL HISTORY PAYLOAD
      // ------------------------------
      const socialHistoryPayload = {
        intake_id,
        caffeine_level: formData.caffeine || null,
        caffeine_cups_per_day: formData.cups_per_day || null,

        alcohol_use: formData.alcohol_use || null,
        drinks_per_week_beer: formData.drinks_beer || null,
        drinks_per_week_wine: formData.drinks_wine || null,
        drinks_per_week_liquor: formData.drinks_liquor || null,

        cage_cut_down:
          formData.cutDown === "yes"
            ? true
            : formData.cutDown === "no"
            ? false
            : null,
        cage_annoyed:
          formData.annoyed === "yes"
            ? true
            : formData.annoyed === "no"
            ? false
            : null,
        cage_guilty:
          formData.guilty === "yes"
            ? true
            : formData.guilty === "no"
            ? false
            : null,
        cage_eye_opener:
          formData.morning === "yes"
            ? true
            : formData.morning === "no"
            ? false
            : null,

        tobacco_current:
          formData.tobacco_use === "yes"
            ? true
            : formData.tobacco_use === "no"
            ? false
            : null,
        tobacco_started_age: formData.smoking_start_age || null,
        tobacco_ever:
          formData.quit_tobacco === "yes"
            ? true
            : formData.quit_tobacco === "no"
            ? false
            : null,
        tobacco_quit_years_ago: formData.years_since_quit || null,

        drugs_current:
          formData.drug_use === "yes"
            ? true
            : formData.drug_use === "no"
            ? false
            : null,
        drugs_list_amounts: formData.drug_list || null,
      };

      // Insert Social History
      const { error: socialError } = await supabase
        .from("social_history")
        .insert([socialHistoryPayload]);

      if (socialError) throw socialError;

      // ---------------------------
      // 🎉 SUCCESS
      // ---------------------------
      toast.success("Application submitted successfully!");

      console.log("Full submission:", {
        person_id,
        application_id,
        intake_id,
        nutrition_history: "ok",
      });
    } catch (error) {
      console.error("❌ Error submitting form:", error);
      toast.error("Submission error. Please try again.");
    }

    setIsSubmitting(false);
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

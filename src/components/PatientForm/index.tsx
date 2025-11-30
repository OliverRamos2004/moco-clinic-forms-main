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

const yesNoToBool = (value?: string | null) =>
  value === "yes" ? true : value === "no" ? false : null;

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
    allergies: [],
    medications: [],
  });

  const [activeTab, setActiveTab] = useState("basic");
  const [isSubmitting, setIsSubmitting] = useState(false); // ✅ NEW

  const updateFormData = (newData: any) => {
    setFormData({ ...formData, ...newData });
  };

  console.log("FORM DATA BEFORE SUBMIT:", formData);

  // Handle form submission

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
          state: formData.state || null, // 👈 adjust key if your BasicInfoTab uses a different name
          zip: formData.zip || "00000",
        },
      ]);

      if (addressError) throw addressError;

      // ---------------------------
      // EMERGENCY CONTACTS (optional)
      // ---------------------------

      const emergencyContactsPayload = [
        {
          name: formData.emergency1_name?.trim(),
          relationship: formData.emergency1_relationship?.trim(),
          phone: formData.emergency1_phone?.trim(),
        },
        {
          name: formData.emergency2_name?.trim(),
          relationship: formData.emergency2_relationship?.trim(),
          phone: formData.emergency2_phone?.trim(),
        },
      ]
        // keep only contacts that have at least one field filled
        .filter((c) => c.name || c.relationship || c.phone)
        // attach person_id + null defaults
        .map((c) => ({
          person_id,
          name: c.name || null,
          relationship: c.relationship || null,
          phone: c.phone || null,
        }));

      if (emergencyContactsPayload.length > 0) {
        const { error: emergencyError } = await supabase
          .from("emergency_contact")
          .insert(emergencyContactsPayload);

        if (emergencyError) throw emergencyError;
      }

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

      // Insert Medications
      // Insert Medications (bulk insert)
      if (formData.medications && formData.medications.length > 0) {
        const medicationPayload = formData.medications.map((med: any) => ({
          intake_id,
          drug_name: med.drug_name || null,
          strength: med.strength || null,
          frequency: med.frequency || null,
        }));

        const { error: medicationError } = await supabase
          .from("medication")
          .insert(medicationPayload);

        if (medicationError) throw medicationError;
      }

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
      console.log("🍎 Nutrition payload about to insert:", nutritionPayload);

      const { data: nutritionRows, error: nutritionError } = await supabase
        .from("nutrition_history")
        .insert([nutritionPayload])
        .select("*");

      if (nutritionError) {
        console.error("❌ Nutrition insert error:", {
          message: nutritionError.message,
          details: nutritionError.details,
          hint: nutritionError.hint,
          code: nutritionError.code,
        });
        throw nutritionError;
      }

      console.log("🍎 Nutrition insert result:", nutritionRows);

      // ------------------------------
      // 6️⃣ SOCIAL HISTORY PAYLOAD
      // ------------------------------
      const socialHistoryPayload = {
        intake_id,

        // Caffeine
        caffeine_level: formData.caffeine || null,
        caffeine_cups_per_day: safeInt(formData.cups_per_day),

        // Alcohol
        alcohol_use: formData.alcohol_use || null,
        drinks_per_week_beer: safeInt(formData.drinks_beer),
        drinks_per_week_wine: safeInt(formData.drinks_wine),
        drinks_per_week_liquor: safeInt(formData.drinks_liquor),

        // CAGE questionnaire
        cage_cut_down: yesNoToBool(formData.cutDown),
        cage_annoyed: yesNoToBool(formData.annoyed),
        cage_guilty: yesNoToBool(formData.guilty),
        cage_eye_opener: yesNoToBool(formData.morning),

        // Tobacco
        tobacco_current: yesNoToBool(formData.tobacco_use),
        cigarettes_packs_per_day: safeInt(formData.cigarettes),
        cigars_per_day: safeInt(formData.cigars),
        chew_per_day: safeInt(formData.chew),
        // (you have vape_per_day in the schema, but no UI field yet, so we leave it null)
        vape_per_day: null,

        tobacco_started_age: safeInt(formData.smoking_start_age),
        tobacco_ever: yesNoToBool(formData.quit_tobacco),
        tobacco_quit_years_ago: safeInt(formData.years_since_quit),

        // Drugs
        drugs_current: yesNoToBool(formData.drug_use),
        drugs_list_amounts: formData.drug_list || null,
      };

      // Insert Social History
      console.log("🧉 Social payload about to insert:", socialHistoryPayload);

      const { data: socialRows, error: socialError } = await supabase
        .from("social_history")
        .insert([socialHistoryPayload])
        .select("*");

      console.log("🧉 Social insert result:", { socialRows, socialError });

      if (socialError) throw socialError;

      // 6️⃣ Insert ALLERGIES (uses intake_id)
      if (formData.allergies && formData.allergies.length > 0) {
        const allergyPayload = formData.allergies.map((a) => ({
          intake_id,
          allergen: a.allergen || null,
          reaction: a.reaction || null,
        }));

        const { error: allergyError } = await supabase
          .from("allergy")
          .insert(allergyPayload);

        if (allergyError) throw allergyError;
      }

      // ------------------------------
      // 7️⃣ TB SCREENING
      // ------------------------------
      const tbPayload = {
        intake_id,
        active_tb: yesNoToBool(formData.tuberculosis),
        cough_gt_3_weeks: yesNoToBool(formData.persistentCough),
        cough_produces_blood: yesNoToBool(formData.bloodyMucus),
        exposed_to_tb: yesNoToBool(formData.exposedTB),
        traveled_outside_usa_past_12m: yesNoToBool(formData.traveledUSA),
      };

      const { error: tbError } = await supabase
        .from("tb_screening")
        .insert([tbPayload]);

      if (tbError) throw tbError;

      // ------------------------------
      // 8️⃣ SEXUAL HISTORY
      // ------------------------------
      const sexualHistoryPayload = {
        intake_id,
        uses_condom: yesNoToBool(formData.useCondoms),
        number_of_sex_partners_total: safeInt(formData.sex_partners_total),
        current_partner_gender: formData.current_partner_gender || null,
        screened_for_sti: yesNoToBool(formData.screenedSTI),
        // mark interested if at least one STI is selected
        interested_in_sti_screen:
          Array.isArray(formData.sti_interest) &&
          formData.sti_interest.length > 0
            ? true
            : null,
      };

      const { error: sexualError } = await supabase
        .from("sexual_history")
        .insert([sexualHistoryPayload]);

      if (sexualError) throw sexualError;

      // 9️⃣ STI INTEREST (MULTI-ROW)
      if (
        Array.isArray(formData.sti_interest) &&
        formData.sti_interest.length > 0
      ) {
        const stiRows = formData.sti_interest.map((sti: string) => ({
          intake_id,
          sti,
        }));

        const { error: stiError } = await supabase
          .from("sti_interest")
          .insert(stiRows);

        if (stiError) throw stiError;
      }

      // ---------------------------
      // 🔟 DENTAL HISTORY
      // ---------------------------
      const dentalPayload = {
        intake_id,
        regular_checkups: yesNoToBool(formData.regularCheckup),
        gums_bleed: yesNoToBool(formData.gumsBleed),
        periodontal_disease: yesNoToBool(formData.periodontal),
        grind_teeth: yesNoToBool(formData.grindTeeth),
        wore_braces: yesNoToBool(formData.wornBraces),
        current_mouth_pain: yesNoToBool(formData.mouthPain),

        brushing_per_day: safeInt(formData.brushFrequency),

        // Not collected yet in UI (safe to leave null for now)
        floss: null,
        floss_how_often: null,
        face_mouth_trauma: null,
        trauma_when: null,
        dentures_partials: null,
        dentures_age: null,

        last_exam_cleaning: formData.lastCleaning || null,
      };

      const { error: dentalError } = await supabase
        .from("dental_history")
        .insert([dentalPayload]);

      if (dentalError) throw dentalError;

      // ---------------------------
      // 1️⃣1️⃣ PAST MEDICAL HISTORY EVENTS
      // ---------------------------
      if (
        Array.isArray(formData.past_med_history_events) &&
        formData.past_med_history_events.length > 0
      ) {
        const pmhPayload = formData.past_med_history_events.map((ev: any) => ({
          intake_id,
          type: ev.type || null,
          description: null, // not collected in UI yet
          year: safeInt(ev.year),
          hospital: ev.hospital || null,
        }));

        const { error: pmhError } = await supabase
          .from("past_med_history_event")
          .insert(pmhPayload);

        if (pmhError) throw pmhError;
      }

      // ️⃣ MALE HISTORY (optional)
      const hasAnyMaleHistory = [
        formData.male_penile_discharge,
        formData.male_penile_lesions,
        formData.male_erection_difficulty,
        formData.male_trouble_urinating,
        formData.male_waking_at_night_to_urinate,
      ].some((v) => v === true);

      if (hasAnyMaleHistory) {
        const malePayload = {
          intake_id,
          penile_discharge:
            formData.male_penile_discharge === true ? true : null,
          penile_lesions: formData.male_penile_lesions === true ? true : null,
          erection_difficulty:
            formData.male_erection_difficulty === true ? true : null,
          trouble_urinating:
            formData.male_trouble_urinating === true ? true : null,
          waking_at_night_to_urinate:
            formData.male_waking_at_night_to_urinate === true ? true : null,
        };

        const { error: maleError } = await supabase
          .from("male_history")
          .insert([malePayload]);

        if (maleError) throw maleError;
      }

      // ️12 FEMALE HISTORY (optional)
      const hasAnyFemaleHistory = [
        formData.female_last_pap_date,
        formData.female_last_mammogram_date,
        formData.female_age_first_menstrual_period,
        formData.female_date_last_menstrual_period,
        formData.female_pregnancies,
        formData.female_births,
        formData.female_abortions,
        formData.female_miscarriages,
        formData.female_cesarean_count,
        formData.female_heavy_periods,
        formData.female_bleeding_between_periods,
        formData.female_extreme_menstrual_pain,
        formData.female_breast_lump_or_nipple_discharge,
        formData.female_painful_intercourse,
        formData.female_urine_leak,
        formData.female_hot_flashes,
        formData.female_partner_uses_condom,
        formData.female_other_birth_control_method,
      ].some((v) => v !== undefined && v !== null && v !== "");

      if (hasAnyFemaleHistory) {
        const femalePayload = {
          intake_id,

          last_pap_date: formData.female_last_pap_date || null,
          pap_abnormal:
            formData.female_pap_abnormal === true
              ? true
              : formData.female_pap_abnormal === false
              ? false
              : null,

          last_mammogram_date: formData.female_last_mammogram_date || null,
          mammogram_abnormal:
            formData.female_mammogram_abnormal === true
              ? true
              : formData.female_mammogram_abnormal === false
              ? false
              : null,

          age_first_menstrual_period: safeInt(
            formData.female_age_first_menstrual_period
          ),

          date_last_menstrual_period:
            formData.female_date_last_menstrual_period || null,

          pregnancies: safeInt(formData.female_pregnancies),
          births: safeInt(formData.female_births),
          abortions: safeInt(formData.female_abortions),
          miscarriages: safeInt(formData.female_miscarriages),
          cesarean_count: safeInt(formData.female_cesarean_count),

          heavy_periods: formData.female_heavy_periods === true ? true : null,
          bleeding_between_periods:
            formData.female_bleeding_between_periods === true ? true : null,
          extreme_menstrual_pain:
            formData.female_extreme_menstrual_pain === true ? true : null,
          vaginal_itching_burning_discharge:
            formData.female_vaginal_itching_burning_discharge === true
              ? true
              : null,
          urine_leak: formData.female_urine_leak === true ? true : null,
          hot_flashes: formData.female_hot_flashes === true ? true : null,
          menopause:
            formData.female_menopause === true
              ? true
              : formData.female_menopause === false
              ? false
              : null,
          breast_lump_or_nipple_discharge:
            formData.female_breast_lump_or_nipple_discharge === true
              ? true
              : null,
          painful_intercourse:
            formData.female_painful_intercourse === true ? true : null,
          partner_uses_condom:
            formData.female_partner_uses_condom === true
              ? true
              : formData.female_partner_uses_condom === false
              ? false
              : null,
          other_birth_control_method:
            formData.female_other_birth_control_method || null,
          waking_at_night_to_urinate:
            formData.female_waking_at_night_to_urinate === true ? true : null,
        };

        const { error: femaleError } = await supabase
          .from("female_history")
          .insert([femalePayload]);

        if (femaleError) throw femaleError;
      }

      // ------------------------------------
      // 🧬  FAMILY HISTORY + PROBLEMS
      // ------------------------------------
      const familyEntries: any[] = Array.isArray(formData.familyHistoryEntries)
        ? formData.familyHistoryEntries
        : [];

      if (familyEntries.length > 0) {
        // 1️⃣ Get family problem lookup table once
        const { data: problemLookup, error: problemLookupError } =
          await supabase
            .from("family_problem_lookup")
            .select("problem_id, name");

        if (problemLookupError) throw problemLookupError;

        const normalize = (s: string) => (s ? s.trim().toLowerCase() : "");

        const lookupByName = new Map<string, number>(
          (problemLookup || []).map((row: any) => [
            normalize(row.name),
            row.problem_id,
          ])
        );

        // 2️⃣ Insert one family_history row per entry
        for (const entry of familyEntries) {
          const relation = entry.relation?.trim();
          const ageStr = entry.age?.toString().trim();
          const problems: string[] = Array.isArray(entry.problems)
            ? entry.problems
            : [];

          // Skip totally empty rows
          if (!relation && !ageStr && problems.length === 0) {
            continue;
          }

          const aliveValue =
            entry.alive === "yes" ? true : entry.alive === "no" ? false : null;

          const ageInt =
            ageStr && !Number.isNaN(Number(ageStr)) ? Number(ageStr) : null;

          const { data: famHistRow, error: famHistError } = await supabase
            .from("family_history")
            .insert([
              {
                intake_id,
                relation: relation || null,
                alive: aliveValue,
                age: ageInt,
              },
            ])
            .select("fam_hist_id")
            .single();

          if (famHistError) throw famHistError;

          const fam_hist_id = famHistRow?.fam_hist_id;
          if (!fam_hist_id) continue;

          // 3️⃣ Build problem rows for this family member
          const problemRows: { fam_hist_id: number; problem_id: number }[] = [];

          for (const key of problems) {
            // keys from UI: "cancer", "diabetes", "heart", "stroke", etc.
            // Try several name variants to match lookup.name
            const variants = [
              key,
              key.replace(/_/g, " "),
              key === "heart" ? "heart disease" : key, // common special-case
            ].map(normalize);

            let problemId: number | undefined;

            for (const v of variants) {
              const id = lookupByName.get(v);
              if (id) {
                problemId = id;
                break;
              }
            }

            if (!problemId) {
              console.warn(
                "⚠️ No family_problem_lookup match for problem key:",
                key
              );
              continue;
            }

            problemRows.push({
              fam_hist_id,
              problem_id: problemId,
            });
          }

          if (problemRows.length > 0) {
            const { error: famProbError } = await supabase
              .from("family_history_problem")
              .insert(problemRows);

            if (famProbError) throw famProbError;
          }
        }
      }

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

import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function buildPatientRow(
  patient: any,
  address: any | null,
  nutrition: any | null,
  social: any | null
) {
  // --- Helper: always use the latest application + intake ---
  const applicationArr = Array.isArray(patient.application)
    ? patient.application
    : patient.application
    ? [patient.application]
    : [];

  const application =
    applicationArr.length > 0
      ? applicationArr[applicationArr.length - 1]
      : null;

  const intakeArr =
    application?.intake && Array.isArray(application.intake)
      ? application.intake
      : application?.intake
      ? [application.intake]
      : [];

  const intake = intakeArr.length > 0 ? intakeArr[intakeArr.length - 1] : null;

  // --- Allergies summary ---
  const allergies: any[] = Array.isArray(intake?.allergies)
    ? intake.allergies
    : [];

  const allergies_summary = allergies
    .map((a) => {
      if (!a) return "";
      const allergen = a.allergen ?? "";
      const reaction = a.reaction ?? "";
      if (!allergen && !reaction) return "";
      return reaction ? `${allergen} (${reaction})` : allergen;
    })
    .filter(Boolean)
    .join("; ");

  // --- Medications summary ---
  const medications: any[] = Array.isArray(intake?.medications)
    ? intake.medications
    : [];

  const medications_summary = medications
    .map((m) => {
      if (!m) return "";
      const name = m.drug_name ?? "";
      const strength = m.strength ?? "";
      const freq = m.frequency ?? "";
      const core = strength ? `${name} ${strength}` : name;
      if (!core && !freq) return "";
      return freq ? `${core} - ${freq}` : core;
    })
    .filter(Boolean)
    .join("; ");

  // --- Past Medical History summary ---
  const pastEvents: any[] = Array.isArray(intake?.past_medical_history)
    ? intake.past_medical_history
    : [];

  const past_medical_history_summary = pastEvents
    .map((e) => {
      if (!e) return "";
      const type = e.type ?? "";
      const year = e.year ?? "";
      const desc = e.description ?? "";
      const hosp = e.hospital ?? "";
      const parts = [type, year, desc, hosp].filter(Boolean);
      return parts.join(" - ");
    })
    .filter(Boolean)
    .join(" | ");

  // --- Family History summary ---
  const familyArr: any[] = Array.isArray(intake?.family_history)
    ? intake.family_history
    : [];

  const family_history_summary = familyArr
    .map((fh) => {
      if (!fh) return "";
      const relation = fh.relation ?? "Relative";
      const problemNames = Array.isArray(fh.problems)
        ? fh.problems
            .map(
              (p: any) =>
                p?.problem?.name ??
                p?.problem?.Name ?? // just in case
                ""
            )
            .filter(Boolean)
        : [];
      if (problemNames.length === 0) {
        return relation;
      }
      return `${relation}: ${problemNames.join(", ")}`;
    })
    .filter(Boolean)
    .join(" | ");

  // --- Dental History (flatten a few key fields) ---
  const dentalArr: any[] = Array.isArray(intake?.dental_history)
    ? intake.dental_history
    : intake?.dental_history
    ? [intake.dental_history]
    : [];
  const dental = dentalArr[0] ?? null;

  // --- TB Screening (flatten booleans) ---
  const tbArr: any[] = Array.isArray(intake?.tb_screening)
    ? intake.tb_screening
    : intake?.tb_screening
    ? [intake.tb_screening]
    : [];
  const tb = tbArr[0] ?? null;

  // --- Male / Female History ---
  const male = intake?.male_history ?? null;
  const female = intake?.female_history ?? null;

  // --- Sexual history + STI interest ---
  const sexual = intake?.sexual_history ?? null;
  const stiInterestArr: any[] = Array.isArray(intake?.sti_interest)
    ? intake.sti_interest
    : [];

  const sti_interest_list = stiInterestArr
    .map((s) => s?.sti ?? "")
    .filter(Boolean)
    .join(", ");

  // --- Build flat row object ---
  return {
    // ===== Basic identity =====
    person_id: patient.person_id,
    legal_first_name: patient.legal_first_name ?? "",
    legal_last_name: patient.legal_last_name ?? "",
    preferred_name: patient.preferred_name ?? "",
    date_of_birth: patient.date_of_birth ?? "",
    sex_at_birth: patient.sex_at_birth ?? "",
    phone: patient.phone ?? "",
    email: patient.email ?? "",

    // ===== Address (use the address we already resolved in the component) =====
    street: address?.street ?? "",
    city: address?.city ?? "",
    state: address?.state ?? "",
    zip: address?.zip ?? "",

    // ===== Application =====
    application_id: application?.application_id ?? "",
    montgomery_resident: application?.montgomery_resident ?? "",
    has_health_insurance: application?.has_health_insurance ?? "",
    last4_ssn: application?.last4_ssn ?? "",
    signature_name: application?.signature_name ?? "",
    signature_date: application?.signature_date ?? "",

    // ===== Intake basics =====
    intake_id: intake?.intake_id ?? "",
    main_reason_for_visit: intake?.main_reason_for_visit ?? "",
    other_concerns: intake?.other_concerns ?? "",
    preferred_pharmacy: intake?.preferred_pharmacy ?? "",
    pharmacy_phone: intake?.pharmacy_phone ?? "",
    immunizations_current: intake?.immunizations_current ?? "",

    // ===== Nutrition (use the nutrition row passed in from component) =====
    nutrition_dieting: nutrition?.dieting ?? "",
    nutrition_meals_per_day: nutrition?.meals_per_day ?? "",
    nutrition_fruit_servings_per_day: nutrition?.fruit_servings_per_day ?? "",
    nutrition_vegetable_servings_per_day:
      nutrition?.vegetable_servings_per_day ?? "",
    nutrition_water_per_day: nutrition?.water_per_day ?? "",
    nutrition_protein_sources: nutrition?.protein_sources ?? "",
    nutrition_sugar_intake: nutrition?.sugar_intake ?? "",
    nutrition_salt_intake: nutrition?.salt_intake ?? "",
    nutrition_food_intolerances_allergies:
      nutrition?.food_intolerances_allergies ?? "",
    nutrition_additional_notes: nutrition?.additional_notes ?? "",

    // ===== Social History (use the social row passed in) =====
    social_caffeine_level: social?.caffeine_level ?? "",
    social_caffeine_cups_per_day: social?.caffeine_cups_per_day ?? "",
    social_alcohol_use: social?.alcohol_use ?? "",
    social_drinks_per_week_beer: social?.drinks_per_week_beer ?? "",
    social_drinks_per_week_wine: social?.drinks_per_week_wine ?? "",
    social_drinks_per_week_liquor: social?.drinks_per_week_liquor ?? "",
    social_cage_cut_down: social?.cage_cut_down ?? "",
    social_cage_annoyed: social?.cage_annoyed ?? "",
    social_cage_guilty: social?.cage_guilty ?? "",
    social_cage_eye_opener: social?.cage_eye_opener ?? "",
    social_tobacco_current: social?.tobacco_current ?? "",
    social_tobacco_started_age: social?.tobacco_started_age ?? "",
    social_tobacco_ever: social?.tobacco_ever ?? "",
    social_tobacco_quit_years_ago: social?.tobacco_quit_years_ago ?? "",
    social_drugs_current: social?.drugs_current ?? "",
    social_drugs_list_amounts: social?.drugs_list_amounts ?? "",

    // ===== Allergies / Medications / Past History / Family =====
    allergies_summary,
    medications_summary,
    past_medical_history_summary,
    family_history_summary,

    // ===== Dental History =====
    dental_regular_checkups: dental?.regular_checkups ?? "",
    dental_gums_bleed: dental?.gums_bleed ?? "",
    dental_periodontal_disease: dental?.periodontal_disease ?? "",
    dental_current_mouth_pain: dental?.current_mouth_pain ?? "",
    dental_brushing_per_day: dental?.brushing_per_day ?? "",
    dental_floss: dental?.floss ?? "",
    dental_floss_how_often: dental?.floss_how_often ?? "",
    dental_last_exam_cleaning: dental?.last_exam_cleaning ?? "",

    // ===== TB Screening =====
    tb_active_tb: tb?.active_tb ?? "",
    tb_cough_gt_3_weeks: tb?.cough_gt_3_weeks ?? "",
    tb_cough_produces_blood: tb?.cough_produces_blood ?? "",
    tb_exposed_to_tb: tb?.exposed_to_tb ?? "",
    tb_traveled_outside_usa_past_12m: tb?.traveled_outside_usa_past_12m ?? "",

    // ===== Male History =====
    male_penile_discharge: male?.penile_discharge ?? "",
    male_penile_lesions: male?.penile_lesions ?? "",
    male_erection_difficulty: male?.erection_difficulty ?? "",
    male_trouble_urinating: male?.trouble_urinating ?? "",
    male_waking_at_night_to_urinate: male?.waking_at_night_to_urinate ?? "",

    // ===== Female History =====
    female_last_pap_date: female?.last_pap_date ?? "",
    female_pap_abnormal: female?.pap_abnormal ?? "",
    female_last_mammogram_date: female?.last_mammogram_date ?? "",
    female_mammogram_abnormal: female?.mammogram_abnormal ?? "",
    female_age_first_menstrual_period: female?.age_first_menstrual_period ?? "",
    female_date_last_menstrual_period: female?.date_last_menstrual_period ?? "",
    female_pregnancies: female?.pregnancies ?? "",
    female_births: female?.births ?? "",
    female_abortions: female?.abortions ?? "",
    female_miscarriages: female?.miscarriages ?? "",
    female_cesarean_count: female?.cesarean_count ?? "",
    female_heavy_periods: female?.heavy_periods ?? "",
    female_bleeding_between_periods: female?.bleeding_between_periods ?? "",
    female_extreme_menstrual_pain: female?.extreme_menstrual_pain ?? "",
    female_vaginal_itching_burning_discharge:
      female?.vaginal_itching_burning_discharge ?? "",
    female_urine_leak: female?.urine_leak ?? "",
    female_hot_flashes: female?.hot_flashes ?? "",
    female_menopause: female?.menopause ?? "",
    female_breast_lump_or_nipple_discharge:
      female?.breast_lump_or_nipple_discharge ?? "",
    female_painful_intercourse: female?.painful_intercourse ?? "",
    female_partner_uses_condom: female?.partner_uses_condom ?? "",
    female_other_birth_control_method: female?.other_birth_control_method ?? "",
    female_waking_at_night_to_urinate: female?.waking_at_night_to_urinate ?? "",

    // ===== Sexual History + STI Interest =====
    sexual_uses_condom: sexual?.uses_condom ?? "",
    sexual_number_of_sex_partners_total:
      sexual?.number_of_sex_partners_total ?? "",
    sexual_current_partner_gender: sexual?.current_partner_gender ?? "",
    sexual_screened_for_sti: sexual?.screened_for_sti ?? "",
    sexual_interested_in_sti_screen: sexual?.interested_in_sti_screen ?? "",
    sti_interest_list,
  };
}

function downloadCsv(filename: string, row: Record<string, any>) {
  const headers = Object.keys(row);
  const values = headers.map((h) => {
    const v = row[h];
    if (v === null || v === undefined) return "";
    // Escape quotes and surround with quotes so commas are safe
    return `"${String(v).replace(/"/g, '""')}"`;
  });

  const csv = headers.join(",") + "\n" + values.join(",");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export const PatientDetails = () => {
  const { person_id } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nutrition, setNutrition] = useState<any | null>(null);
  const [social, setSocial] = useState<any | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      setNutrition(null);
      setSocial(null);

      // 1) Fetch person + applications + intakes + other nested stuff
      const { data, error } = await supabase
        .from("person")
        .select(
          `
        person_id,
        legal_first_name,
        legal_last_name,
        preferred_name,
        date_of_birth,
        sex_at_birth,
        phone,
        email,

        address:address!address_person_id_fkey (
          street,
          city,
          state,
          zip
        ),

        emergency_contacts:emergency_contact!emergency_contact_person_id_fkey (
          name,
          relationship,
          phone
        ),

        application:application!application_applicant_id_fkey (
          application_id,
          montgomery_resident,
          has_health_insurance,
          last4_ssn,
          signature_name,
          signature_date,

          intake:intake!intake_application_id_fkey (
            intake_id,
            main_reason_for_visit,
            other_concerns,
            preferred_pharmacy,
            pharmacy_phone,
            immunizations_current,

            allergies:allergy!allergy_intake_id_fkey (
              allergen,
              reaction
            ),

            medications:medication!medication_intake_id_fkey (
              drug_name,
              strength,
              frequency
            ),

            past_medical_history:past_med_history_event!past_med_history_event_intake_id_fkey (
              type,
              description,
              year,
              hospital
            ),

            family_history:family_history!family_history_intake_id_fkey (
              fam_hist_id,
              relation,
              age,
              alive,

              problems:family_history_problem!family_history_problem_fam_hist_id_fkey (
                problem:family_problem_lookup!family_history_problem_problem_id_fkey (
                  name
                )
              )
            ),

            dental_history:dental_history!dental_history_intake_id_fkey (
              regular_checkups,
              gums_bleed,
              periodontal_disease,
              grind_teeth,
              wore_braces,
              current_mouth_pain,
              brushing_per_day,
              floss,
              floss_how_often,
              face_mouth_trauma,
              trauma_when,
              dentures_partials,
              dentures_age,
              last_exam_cleaning
            ),

            tb_screening:tb_screening!tb_screening_intake_id_fkey (
              active_tb,
              cough_gt_3_weeks,
              cough_produces_blood,
              exposed_to_tb,
              traveled_outside_usa_past_12m
            ),

            male_history:male_history!male_history_intake_id_fkey (
              penile_discharge,
              penile_lesions,
              erection_difficulty,
              trouble_urinating,
              waking_at_night_to_urinate
            ),

            female_history:female_history!female_history_intake_id_fkey (
              last_pap_date,
              pap_abnormal,
              last_mammogram_date,
              mammogram_abnormal,
              age_first_menstrual_period,
              date_last_menstrual_period,
              pregnancies,
              births,
              abortions,
              miscarriages,
              cesarean_count,
              heavy_periods,
              bleeding_between_periods,
              extreme_menstrual_pain,
              vaginal_itching_burning_discharge,
              urine_leak,
              hot_flashes,
              menopause,
              breast_lump_or_nipple_discharge,
              painful_intercourse,
              partner_uses_condom,
              other_birth_control_method,
              waking_at_night_to_urinate
            ),

            sexual_history:sexual_history!sexual_history_intake_id_fkey (
              uses_condom,
              number_of_sex_partners_total,
              current_partner_gender,
              screened_for_sti,
              interested_in_sti_screen
            ),

            sti_interest:sti_interest!sti_interest_intake_id_fkey (
              sti
            )
          )
        )
        `
        )
        .eq("person_id", Number(person_id))
        .maybeSingle();

      if (error || !data) {
        console.error("❌ Failed to load details:", error);
        setError(error?.message || "Failed to load patient");
        setLoading(false);
        return;
      }

      console.log("🔥 Loaded:", data);

      // 2) Figure out the latest application + intake for this person
      const applications = Array.isArray(data.application)
        ? data.application
        : [];
      const sortedApps = applications
        .slice()
        .sort(
          (a: any, b: any) => (b.application_id ?? 0) - (a.application_id ?? 0)
        );
      const latestApp = sortedApps[0] || null;

      const intakes = Array.isArray(latestApp?.intake) ? latestApp.intake : [];
      const sortedIntakes = intakes
        .slice()
        .sort((a: any, b: any) => (b.intake_id ?? 0) - (a.intake_id ?? 0));
      const latestIntake = sortedIntakes[0] || null;

      let nutritionRow: any | null = null;
      let socialRow: any | null = null;

      // 3) If we have an intake_id, fetch nutrition + social directly
      if (latestIntake?.intake_id) {
        const intakeId = latestIntake.intake_id;

        const [
          { data: nutritionData, error: nutritionError },
          { data: socialData, error: socialError },
        ] = await Promise.all([
          supabase
            .from("nutrition_history")
            .select(
              `
            fruit_servings_per_day,
            vegetable_servings_per_day,
            water_per_day,
            meals_per_day,
            protein_sources,
            sugar_intake,
            salt_intake,
            food_intolerances_allergies,
            additional_notes
            `
            )
            .eq("intake_id", intakeId)
            .maybeSingle(),
          supabase
            .from("social_history")
            .select(
              `
            caffeine_level,
            caffeine_cups_per_day,
            alcohol_use,
            drinks_per_week_beer,
            drinks_per_week_wine,
            drinks_per_week_liquor,
            cage_cut_down,
            cage_annoyed,
            cage_guilty,
            cage_eye_opener,
            tobacco_current,
            tobacco_started_age,
            tobacco_ever,
            tobacco_quit_years_ago,
            drugs_current,
            drugs_list_amounts
            `
            )
            .eq("intake_id", intakeId)
            .maybeSingle(),
        ]);

        if (nutritionError) {
          console.error("❌ Nutrition fetch error:", nutritionError);
        }
        if (socialError) {
          console.error("❌ Social history fetch error:", socialError);
        }

        nutritionRow = nutritionData || null;
        socialRow = socialData || null;
      }

      setData(data);
      setNutrition(nutritionRow);
      setSocial(socialRow);
      setLoading(false);
    };

    fetchDetails();
  }, [person_id]);

  if (loading) return <p className="p-6">Loading…</p>;
  if (!data) return <p className="p-6">No patient data found.</p>;

  const handleExportToCsv = () => {
    if (!data) return;

    const row = buildPatientRow(data, address, nutrition, social);
    downloadCsv(`patient_${data.person_id}.csv`, row);
  };

  // STEP 2: Extract nested data

  // Pick the *latest* application and intake rather than the first one
  // STEP 2: Extract nested data (always use the *latest* application + intake)

  // 1) Latest application
  // STEP 2: Extract nested data (for everything except nutrition + social)

  const applications = Array.isArray(data.application) ? data.application : [];
  const sortedApps = applications
    .slice()
    .sort(
      (a: any, b: any) => (b.application_id ?? 0) - (a.application_id ?? 0)
    );
  const app = sortedApps[0] || null;

  const intakes = Array.isArray(app?.intake) ? app.intake : [];
  const sortedIntakes = intakes
    .slice()
    .sort((a: any, b: any) => (b.intake_id ?? 0) - (a.intake_id ?? 0));
  const intake = sortedIntakes[0] || null;

  const allergies = intake?.allergies || [];
  const medications = intake?.medications || [];
  const pastMedHistory = intake?.past_medical_history || [];
  const familyHistory = intake?.family_history || [];
  const dentalHistory = intake?.dental_history || null;
  const tbScreening = intake?.tb_screening || null;
  const tb = intake?.tb_screening;
  const maleHistory = intake?.male_history || null;
  const femaleHistory = intake?.female_history || null;
  const sexualHistory = intake?.sexual_history || null;
  const stiInterest = intake?.sti_interest || [];
  const emergencyContacts = data?.emergency_contacts || [];
  const address =
    Array.isArray(data.address) && data.address.length > 0
      ? data.address[0]
      : data.address || null;

  console.log("📍 Address in PatientDetails:", address);

  console.log("👀 Intake, nutrition, social in PatientDetails:", {
    intake,
    nutrition,
    social,
  });

  // STEP 3: Render the UI

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Top header row: title + export button */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Patient Details</h1>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleExportToCsv}
        >
          Export to Excel (CSV)
        </Button>
      </div>

      {/* Back link */}
      <Link
        to="/patients"
        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 mb-4"
      >
        ← Back to Patients
      </Link>

      {/* BASIC INFO */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>
            <strong>Name:</strong> {data.legal_first_name}{" "}
            {data.legal_last_name}
          </p>
          <p>
            <strong>Preferred Name:</strong> {data.preferred_name || "—"}
          </p>
          <p>
            <strong>DOB:</strong> {data.date_of_birth}
          </p>
          <p>
            <strong>Sex at Birth:</strong> {data.sex_at_birth || "—"}
          </p>
          <p>
            <strong>Phone:</strong> {data.phone || "—"}
          </p>
          <p>
            <strong>Email:</strong> {data.email || "—"}
          </p>
        </CardContent>
      </Card>

      {/* ADDRESS */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Address</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>
            <strong>Street:</strong> {address?.street || "—"}
          </p>
          <p>
            <strong>City:</strong> {address?.city || "—"}
          </p>
          <p>
            <strong>State:</strong> {address?.state || "—"}
          </p>
          <p>
            <strong>Zip:</strong> {address?.zip || "—"}
          </p>
        </CardContent>
      </Card>

      {/* APPLICATION */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Application Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>
            <strong>Resident:</strong> {app?.montgomery_resident ? "Yes" : "No"}
          </p>
          <p>
            <strong>Health Insurance:</strong>{" "}
            {app?.has_health_insurance ? "Yes" : "No"}
          </p>
          <p>
            <strong>Last 4 SSN:</strong> {app?.last4_ssn || "—"}
          </p>
          <p>
            <strong>Signature:</strong> {app?.signature_name || "—"}
          </p>
          <p>
            <strong>Date Signed:</strong> {app?.signature_date || "—"}
          </p>
        </CardContent>
      </Card>

      {/* INTAKE */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Intake</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>
            <strong>Main Reason:</strong> {intake?.main_reason_for_visit || "—"}
          </p>
          <p>
            <strong>Other Concerns:</strong> {intake?.other_concerns || "—"}
          </p>
          <p>
            <strong>Preferred Pharmacy:</strong>{" "}
            {intake?.preferred_pharmacy || "—"}
          </p>
          <p>
            <strong>Pharmacy Phone:</strong> {intake?.pharmacy_phone || "—"}
          </p>
          <p>
            <strong>Immunizations Current:</strong>{" "}
            {intake?.immunizations_current || "—"}
          </p>
        </CardContent>
      </Card>

      {/* NUTRITION */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Nutrition</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>
            <strong>Fruit/day:</strong>{" "}
            {nutrition?.fruit_servings_per_day || "—"}
          </p>
          <p>
            <strong>Vegetables/day:</strong>{" "}
            {nutrition?.vegetable_servings_per_day || "—"}
          </p>
          <p>
            <strong>Meals/day:</strong> {nutrition?.meals_per_day || "—"}
          </p>
          <p>
            <strong>Water/day:</strong> {nutrition?.water_per_day || "—"}
          </p>
          <p>
            <strong>Protein Sources:</strong>{" "}
            {nutrition?.protein_sources || "—"}
          </p>
          <p>
            <strong>Sugar Intake:</strong> {nutrition?.sugar_intake || "—"}
          </p>
          <p>
            <strong>Salt Intake:</strong> {nutrition?.salt_intake || "—"}
          </p>
          <p>
            <strong>Food Intolerances:</strong>{" "}
            {nutrition?.food_intolerances_allergies || "—"}
          </p>
          <p>
            <strong>Additional Notes:</strong>{" "}
            {nutrition?.additional_notes || "—"}
          </p>
        </CardContent>
      </Card>

      {/* SOCIAL HISTORY */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Social History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>
            <strong>Caffeine:</strong> {social?.caffeine_level || "—"}
          </p>
          <p>
            <strong>Cups/day:</strong> {social?.caffeine_cups_per_day || "—"}
          </p>
          <p>
            <strong>Alcohol:</strong> {social?.alcohol_use || "—"}
          </p>
          <p>
            <strong>Beer:</strong> {social?.drinks_per_week_beer || "—"}
          </p>
          <p>
            <strong>Wine:</strong> {social?.drinks_per_week_wine || "—"}
          </p>
          <p>
            <strong>Liquor:</strong> {social?.drinks_per_week_liquor || "—"}
          </p>
          <p>
            <strong>CAGE Cut Down:</strong>{" "}
            {social?.cage_cut_down ? "Yes" : "No"}
          </p>
          <p>
            <strong>CAGE Annoyed:</strong> {social?.cage_annoyed ? "Yes" : "No"}
          </p>
          <p>
            <strong>CAGE Guilty:</strong> {social?.cage_guilty ? "Yes" : "No"}
          </p>
          <p>
            <strong>CAGE Eye Opener:</strong>{" "}
            {social?.cage_eye_opener ? "Yes" : "No"}
          </p>
          <p>
            <strong>Tobacco Current:</strong>{" "}
            {social?.tobacco_current ? "Yes" : "No"}
          </p>
          <p>
            <strong>Started Age:</strong> {social?.tobacco_started_age || "—"}
          </p>
          <p>
            <strong>Tobacco Ever:</strong> {social?.tobacco_ever ? "Yes" : "No"}
          </p>
          <p>
            <strong>Quit Years Ago:</strong>{" "}
            {social?.tobacco_quit_years_ago || "—"}
          </p>
          <p>
            <strong>Drugs:</strong> {social?.drugs_current ? "Yes" : "No"}
          </p>
          <p>
            <strong>Drug List:</strong> {social?.drugs_list_amounts || "—"}
          </p>
        </CardContent>
      </Card>

      {/* ALLERGIES */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Allergies</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {allergies.length === 0 ? (
            <p>No allergies reported.</p>
          ) : (
            allergies.map((a: any, i: number) => (
              <div
                key={i}
                className="border rounded-md p-3 bg-gray-50 flex flex-col gap-1"
              >
                <p>
                  <strong>Allergen:</strong> {a.allergen || "—"}
                </p>
                <p>
                  <strong>Reaction:</strong> {a.reaction || "—"}
                </p>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* MEDICATIONS */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Current Medications</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          {medications.length === 0 ? (
            <p>No medications reported.</p>
          ) : (
            medications.map((m, i) => (
              <div
                key={i}
                className="border rounded-md p-4 bg-gray-50 space-y-1"
              >
                <p>
                  <strong>Name:</strong> {m.drug_name || "—"}
                </p>
                <p>
                  <strong>Strength:</strong> {m.strength || "—"}
                </p>
                <p>
                  <strong>Frequency:</strong> {m.frequency || "—"}
                </p>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* PAST MEDICAL HISTORY */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Past Medical History</CardTitle>
        </CardHeader>

        <CardContent className="space-y-2">
          {pastMedHistory.length === 0 ? (
            <p>No past medical history reported.</p>
          ) : (
            pastMedHistory.map((ev: any, i: number) => (
              <div
                key={i}
                className="border rounded-md p-3 bg-gray-50 flex flex-col gap-1"
              >
                <p>
                  <strong>Type:</strong> {ev.type || "—"}
                </p>
                <p>
                  <strong>Description:</strong> {ev.description || "—"}
                </p>
                <p>
                  <strong>Year:</strong> {ev.year || "—"}
                </p>
                <p>
                  <strong>Hospital:</strong> {ev.hospital || "—"}
                </p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
      {/* FAMILY HISTORY */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Family History</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          {familyHistory.length === 0 ? (
            <p>No family history recorded.</p>
          ) : (
            familyHistory.map((fm: any, i: number) => (
              <div
                key={i}
                className="border rounded-md p-4 bg-gray-50 space-y-1"
              >
                <p>
                  <strong>Relation:</strong> {fm.relation || "—"}
                </p>
                <p>
                  <strong>Age:</strong> {fm.age || "—"}
                </p>
                <p>
                  <strong>Alive:</strong> {fm.alive ? "Yes" : "No"}
                </p>

                <div>
                  <strong>Health Problems:</strong>
                  <ul className="list-disc ml-6">
                    {fm.problems?.length > 0 ? (
                      fm.problems.map((p: any, idx: number) => (
                        <li key={idx}>{p.problem?.name || "Unknown"}</li>
                      ))
                    ) : (
                      <li>None reported</li>
                    )}
                  </ul>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* DENTAL HISTORY */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Dental History</CardTitle>
        </CardHeader>

        <CardContent className="space-y-2">
          {!dentalHistory ? (
            <p>No dental history recorded.</p>
          ) : (
            <div className="space-y-1">
              <p>
                <strong>Regular Checkups:</strong>{" "}
                {dentalHistory.regular_checkups ? "Yes" : "No"}
              </p>
              <p>
                <strong>Gums Bleed:</strong>{" "}
                {dentalHistory.gums_bleed ? "Yes" : "No"}
              </p>
              <p>
                <strong>Periodontal Disease:</strong>{" "}
                {dentalHistory.periodontal_disease ? "Yes" : "No"}
              </p>
              <p>
                <strong>Grind Teeth:</strong>{" "}
                {dentalHistory.grind_teeth ? "Yes" : "No"}
              </p>
              <p>
                <strong>Wore Braces:</strong>{" "}
                {dentalHistory.wore_braces ? "Yes" : "No"}
              </p>
              <p>
                <strong>Current Mouth Pain:</strong>{" "}
                {dentalHistory.current_mouth_pain ? "Yes" : "No"}
              </p>
              <p>
                <strong>Brushing Per Day:</strong>{" "}
                {dentalHistory.brushing_per_day || "—"}
              </p>
              <p>
                <strong>Floss:</strong> {dentalHistory.floss ? "Yes" : "No"}
              </p>
              <p>
                <strong>How Often (Floss):</strong>{" "}
                {dentalHistory.floss_how_often || "—"}
              </p>
              <p>
                <strong>Face/Mouth Trauma:</strong>{" "}
                {dentalHistory.face_mouth_trauma ? "Yes" : "No"}
              </p>
              <p>
                <strong>Trauma When:</strong> {dentalHistory.trauma_when || "—"}
              </p>
              <p>
                <strong>Dentures/Partials:</strong>{" "}
                {dentalHistory.dentures_partials ? "Yes" : "No"}
              </p>
              <p>
                <strong>Age for Dentures:</strong>{" "}
                {dentalHistory.dentures_age || "—"}
              </p>
              <p>
                <strong>Last Exam/Cleaning:</strong>{" "}
                {dentalHistory.last_exam_cleaning || "—"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* TB SCREENING */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>TB Screening</CardTitle>
        </CardHeader>

        <CardContent className="space-y-2">
          {!tb ? (
            <p>No TB screening recorded.</p>
          ) : (
            <div className="space-y-1">
              <p>
                <strong>Active TB:</strong> {tb.active_tb ? "Yes" : "No"}
              </p>
              <p>
                <strong>Cough {">"} 3 weeks:</strong>{" "}
                {tb.cough_gt_3_weeks ? "Yes" : "No"}
              </p>
              <p>
                <strong>Cough produces blood:</strong>{" "}
                {tb.cough_produces_blood ? "Yes" : "No"}
              </p>
              <p>
                <strong>Exposed to TB:</strong>{" "}
                {tb.exposed_to_tb ? "Yes" : "No"}
              </p>
              <p>
                <strong>Traveled outside USA (past 12 months):</strong>{" "}
                {tb.traveled_outside_usa_past_12m ? "Yes" : "No"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* MALE HISTORY */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Male History</CardTitle>
        </CardHeader>

        <CardContent className="space-y-2">
          {!maleHistory ? (
            <p>No male history recorded.</p>
          ) : (
            <div className="space-y-1">
              <p>
                <strong>Penile Discharge:</strong>{" "}
                {maleHistory.penile_discharge ? "Yes" : "No"}
              </p>
              <p>
                <strong>Penile Lesions:</strong>{" "}
                {maleHistory.penile_lesions ? "Yes" : "No"}
              </p>
              <p>
                <strong>Erection Difficulty:</strong>{" "}
                {maleHistory.erection_difficulty ? "Yes" : "No"}
              </p>
              <p>
                <strong>Trouble Urinating:</strong>{" "}
                {maleHistory.trouble_urinating ? "Yes" : "No"}
              </p>
              <p>
                <strong>Waking at Night to Urinate:</strong>{" "}
                {maleHistory.waking_at_night_to_urinate ? "Yes" : "No"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* FEMALE HISTORY */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Female History</CardTitle>
        </CardHeader>

        <CardContent className="space-y-2">
          {!femaleHistory ? (
            <p>No female history recorded.</p>
          ) : (
            <div className="space-y-1">
              <p>
                <strong>Last Pap Date:</strong>{" "}
                {femaleHistory.last_pap_date || "—"}
              </p>
              <p>
                <strong>Pap Abnormal:</strong>{" "}
                {femaleHistory.pap_abnormal ? "Yes" : "No"}
              </p>
              <p>
                <strong>Last Mammogram Date:</strong>{" "}
                {femaleHistory.last_mammogram_date || "—"}
              </p>
              <p>
                <strong>Mammogram Abnormal:</strong>{" "}
                {femaleHistory.mammogram_abnormal ? "Yes" : "No"}
              </p>
              <p>
                <strong>Age at First Menstrual Period:</strong>{" "}
                {femaleHistory.age_first_menstrual_period || "—"}
              </p>
              <p>
                <strong>Date of Last Menstrual Period:</strong>{" "}
                {femaleHistory.date_last_menstrual_period || "—"}
              </p>
              <p>
                <strong>Pregnancies:</strong> {femaleHistory.pregnancies ?? "—"}
              </p>
              <p>
                <strong>Births:</strong> {femaleHistory.births ?? "—"}
              </p>
              <p>
                <strong>Abortions:</strong> {femaleHistory.abortions ?? "—"}
              </p>
              <p>
                <strong>Miscarriages:</strong>{" "}
                {femaleHistory.miscarriages ?? "—"}
              </p>
              <p>
                <strong>Cesareans:</strong>{" "}
                {femaleHistory.cesarean_count ?? "—"}
              </p>
              <p>
                <strong>Heavy Periods:</strong>{" "}
                {femaleHistory.heavy_periods ? "Yes" : "No"}
              </p>
              <p>
                <strong>Bleeding Between Periods:</strong>{" "}
                {femaleHistory.bleeding_between_periods ? "Yes" : "No"}
              </p>
              <p>
                <strong>Extreme Menstrual Pain:</strong>{" "}
                {femaleHistory.extreme_menstrual_pain ? "Yes" : "No"}
              </p>
              <p>
                <strong>Vaginal Itching/Burning/Discharge:</strong>{" "}
                {femaleHistory.vaginal_itching_burning_discharge ? "Yes" : "No"}
              </p>
              <p>
                <strong>Urine Leak:</strong>{" "}
                {femaleHistory.urine_leak ? "Yes" : "No"}
              </p>
              <p>
                <strong>Hot Flashes:</strong>{" "}
                {femaleHistory.hot_flashes ? "Yes" : "No"}
              </p>
              <p>
                <strong>Menopause:</strong>{" "}
                {femaleHistory.menopause ? "Yes" : "No"}
              </p>
              <p>
                <strong>Breast Lump or Nipple Discharge:</strong>{" "}
                {femaleHistory.breast_lump_or_nipple_discharge ? "Yes" : "No"}
              </p>
              <p>
                <strong>Painful Intercourse:</strong>{" "}
                {femaleHistory.painful_intercourse ? "Yes" : "No"}
              </p>
              <p>
                <strong>Partner Uses Condom:</strong>{" "}
                {femaleHistory.partner_uses_condom ? "Yes" : "No"}
              </p>
              <p>
                <strong>Other Birth Control Method:</strong>{" "}
                {femaleHistory.other_birth_control_method || "—"}
              </p>
              <p>
                <strong>Waking at Night to Urinate:</strong>{" "}
                {femaleHistory.waking_at_night_to_urinate ? "Yes" : "No"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* EMERGENCY CONTACTS */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Emergency Contacts</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          {emergencyContacts.length === 0 ? (
            <p>No emergency contacts listed.</p>
          ) : (
            emergencyContacts.map((c: any, idx: number) => (
              <div
                key={idx}
                className="border rounded-md p-4 bg-gray-50 space-y-1"
              >
                <p>
                  <strong>Name:</strong> {c.name || "—"}
                </p>
                <p>
                  <strong>Relationship:</strong> {c.relationship || "—"}
                </p>
                <p>
                  <strong>Phone:</strong> {c.phone || "—"}
                </p>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* SEXUAL HISTORY */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Sexual History</CardTitle>
        </CardHeader>

        <CardContent className="space-y-2">
          {!sexualHistory ? (
            <p>No sexual history information recorded.</p>
          ) : (
            <div className="space-y-1">
              <p>
                <strong>Uses Condom:</strong>{" "}
                {sexualHistory.uses_condom ? "Yes" : "No"}
              </p>

              <p>
                <strong>Number of Lifetime Partners:</strong>{" "}
                {sexualHistory.number_of_sex_partners_total || "—"}
              </p>

              <p>
                <strong>Current Partner Gender:</strong>{" "}
                {sexualHistory.current_partner_gender || "—"}
              </p>

              <p>
                <strong>Screened for STI Before:</strong>{" "}
                {sexualHistory.screened_for_sti ? "Yes" : "No"}
              </p>

              <p>
                <strong>Interested in STI Screen:</strong>{" "}
                {sexualHistory.interested_in_sti_screen ? "Yes" : "No"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* STI Interest */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>STI Screening Interest</CardTitle>
        </CardHeader>

        <CardContent className="space-y-2">
          {stiInterest.length === 0 ? (
            <p>No STI screening preferences recorded.</p>
          ) : (
            <ul className="list-disc ml-6">
              {stiInterest.map((item: any, idx: number) => (
                <li key={idx}>{item.sti || "Unspecified"}</li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus, X } from "lucide-react";
import { useState } from "react";

const medicalConditions = [
  "Anxiety disorder",
  "Diverticulitis",
  "Kidney Disease",
  "Arthritis",
  "Fibromyalgia",
  "Kidney Stones",
  "Asthma",
  "Gout",
  "Leg/Foot Ulcers",
  "Bleeding Disorder",
  "Has Pacemaker",
  "Liver Disease",
  "Blood Clots (or DVT)",
  "Heart Attack",
  "Osteoporosis",
  "Cancer",
  "Heart Murmur",
  "Polio",
  "Coronary Artery Disease",
  "Hiatal Hernia or Reflux Disease",
  "Pulmonary Embolism",
  "Glaucoma",
  "HIV or AIDS",
  "Reflux or Ulcers",
  "Diabetes - Insulin",
  "High Cholesterol",
  "Stroke",
  "Diabetes - No Insulin",
  "High Blood Pressure",
  "Tuberculosis",
  "Dialysis",
  "Overactive Thyroid",
  "Other",
  "Blood Transfusion",
  "Recent Weight Changes",
];

export const MedicalHistoryTab = ({ formData, updateFormData }: any) => {
  const { t } = useTranslation();

  // Helper: use translation if it exists, otherwise use a readable fallback
  const tt = (key: string, fallback: string) => {
    const translated = t(key);
    return translated && translated !== key ? translated : fallback;
  };

  // Past medical history now lives in formData so it can be saved
  const pastHistory = formData.past_med_history_events || [];

  // ER visits still local for now (we’re not saving them yet)
  const [erVisits, setErVisits] = useState<any[]>([]);

  const addPastHistory = () => {
    const newItem = {
      id: crypto.randomUUID?.() ?? Date.now().toString(),
      type: "",
      year: "",
      hospital: "",
    };

    updateFormData({
      past_med_history_events: [...pastHistory, newItem],
    });
  };

  const updatePastHistory = (
    id: string,
    field: "type" | "year" | "hospital",
    value: string
  ) => {
    const updated = pastHistory.map((item: any) =>
      item.id === id ? { ...item, [field]: value } : item
    );

    updateFormData({
      past_med_history_events: updated,
    });
  };

  const removePastHistory = (id: string) => {
    const filtered = pastHistory.filter((item: any) => item.id !== id);

    updateFormData({
      past_med_history_events: filtered,
    });
  };

  const addErVisit = () => {
    setErVisits([...erVisits, { id: Date.now().toString() }]);
  };

  const removeErVisit = (id: string) => {
    setErVisits(erVisits.filter((e) => e.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Past Medical History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">{t("medical.past")}</CardTitle>
          <CardDescription>{t("medical.pastNote")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {pastHistory.map((item: any) => (
            <div
              key={item.id}
              className="p-4 border border-border rounded-lg space-y-3"
            >
              <div className="flex justify-between items-center">
                <Label className="font-semibold">{t("medical.past")}</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removePastHistory(item.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Input
                  placeholder={t("medical.reason")}
                  value={item.type || ""}
                  onChange={(e) =>
                    updatePastHistory(item.id, "type", e.target.value)
                  }
                />
                <Input
                  placeholder={t("medical.year")}
                  type="number"
                  value={item.year || ""}
                  onChange={(e) =>
                    updatePastHistory(item.id, "year", e.target.value)
                  }
                />
                <Input
                  placeholder={t("medical.hospital")}
                  value={item.hospital || ""}
                  onChange={(e) =>
                    updatePastHistory(item.id, "hospital", e.target.value)
                  }
                />
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={addPastHistory}
            className="w-full"
          >
            + {<label>{t("medical.addEntry")}</label>}
          </Button>
        </CardContent>
      </Card>

      {/* Emergency Room Visits */}
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">
            {t("medical.erVisits")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {erVisits.map((item) => (
            <div
              key={item.id}
              className="p-4 border border-border rounded-lg space-y-3"
            >
              <div className="flex justify-between items-center">
                <Label className="font-semibold">
                  {t("medical.visitReason")}
                </Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeErVisit(item.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Input placeholder={t("medical.visitReason")} />
                <Input placeholder={t("medical.dateYear")} />
                <Input placeholder={t("medical.hospital")} />
              </div>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={addErVisit}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            {t("medical.addEntry")}
          </Button>
        </CardContent>
      </Card>

      {/* Health Questions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">
            {t("medical.questions")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: "tuberculosis", label: t("medical.tuberculosis") },
            { key: "persistentCough", label: t("medical.persistentCough") },
            { key: "bloodyMucus", label: t("medical.bloodyMucus") },
            { key: "exposedTB", label: t("medical.exposedTB") },
            { key: "traveledUSA", label: t("medical.traveledUSA") },
          ].map(({ key, label }) => (
            <div key={key}>
              <Label className="text-base">{label}</Label>
              <RadioGroup
                value={formData[key] || ""}
                onValueChange={(value) => updateFormData({ [key]: value })}
                className="flex gap-4 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id={`${key}-yes`} />
                  <Label htmlFor={`${key}-yes`} className="font-normal">
                    {t("insurance.yes")}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id={`${key}-no`} />
                  <Label htmlFor={`${key}-no`} className="font-normal">
                    {t("insurance.no")}
                  </Label>
                </div>
              </RadioGroup>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Medical Conditions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">
            {t("medical.conditions")}
          </CardTitle>
          <CardDescription>{t("medical.conditionsNote")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {medicalConditions.map((condition) => (
              <div key={condition} className="flex items-center space-x-2">
                <Checkbox id={condition} />
                <label
                  htmlFor={condition}
                  className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {condition}
                </label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* GENDER-SPECIFIC SECTIONS */}

      {/* MALE HISTORY */}
      {/* MALE HISTORY */}
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">
            {tt("genderSpecific.maleOnly", "Male Only")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              {
                key: "male_penile_discharge",
                label: tt("genderSpecific.penileDischarge", "Penile discharge"),
              },
              {
                key: "male_penile_lesions",
                label: tt("genderSpecific.penileLesions", "Penile lesions"),
              },
              {
                key: "male_erection_difficulty",
                label: tt(
                  "genderSpecific.erectileDifficulty",
                  "Erection difficulty"
                ),
              },
              {
                key: "male_trouble_urinating",
                label: tt(
                  "genderSpecific.troubleUrinating",
                  "Trouble urinating"
                ),
              },
              {
                key: "male_waking_at_night_to_urinate",
                label: tt(
                  "genderSpecific.wakeAtNight",
                  "Waking at night to urinate"
                ),
              },
            ].map(({ key, label }) => (
              <div key={key} className="flex items-center space-x-2">
                <Checkbox
                  id={key}
                  checked={!!formData[key]}
                  onCheckedChange={(checked) =>
                    updateFormData({ [key]: !!checked })
                  }
                />
                <label htmlFor={key} className="text-sm font-normal">
                  {label}
                </label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* FEMALE HISTORY */}
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">
            {t("genderSpecific.femaleOnly")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Dates of PAP / Mammogram */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>{t("genderSpecific.lastPAP")}</Label>
              <Input
                type="date"
                value={formData.female_last_pap_date || ""}
                onChange={(e) =>
                  updateFormData({ female_last_pap_date: e.target.value })
                }
              />
            </div>
            <div>
              <Label>{t("genderSpecific.lastMammogram")}</Label>
              <Input
                type="date"
                value={formData.female_last_mammogram_date || ""}
                onChange={(e) =>
                  updateFormData({
                    female_last_mammogram_date: e.target.value,
                  })
                }
              />
            </div>
          </div>

          {/* Abnormal PAP / mammogram + menopause */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                key: "female_pap_abnormal",
                label: tt("genderSpecific.papAbnormal", "PAP abnormal?"),
              },
              {
                key: "female_mammogram_abnormal",
                label: tt(
                  "genderSpecific.mammogramAbnormal",
                  "Mammogram abnormal?"
                ),
              },
              {
                key: "female_menopause",
                label: tt("genderSpecific.menopause", "Menopause?"),
              },
            ].map(({ key, label }) => (
              <div key={key}>
                <Label className="text-xs text-muted-foreground">{label}</Label>
                <RadioGroup
                  value={
                    formData[key] === true
                      ? "yes"
                      : formData[key] === false
                      ? "no"
                      : ""
                  }
                  onValueChange={(value) =>
                    updateFormData({
                      [key]:
                        value === "yes" ? true : value === "no" ? false : null,
                    })
                  }
                  className="flex gap-4 mt-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id={`${key}-yes`} />
                    <Label
                      htmlFor={`${key}-yes`}
                      className="font-normal text-sm"
                    >
                      {t("insurance.yes")}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id={`${key}-no`} />
                    <Label
                      htmlFor={`${key}-no`}
                      className="font-normal text-sm"
                    >
                      {t("insurance.no")}
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            ))}
          </div>

          {/* Age first / last period */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>{t("genderSpecific.ageFirstPeriod")}</Label>
              <Input
                type="number"
                value={formData.female_age_first_menstrual_period || ""}
                onChange={(e) =>
                  updateFormData({
                    female_age_first_menstrual_period: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label>{t("genderSpecific.ageLastPeriod")}</Label>
              <Input
                type="date"
                value={formData.female_date_last_menstrual_period || ""}
                onChange={(e) =>
                  updateFormData({
                    female_date_last_menstrual_period: e.target.value,
                  })
                }
              />
            </div>
          </div>

          {/* Pregnancies / births / abortions / miscarriages / C-sections */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <div>
              <Label>
                {tt("genderSpecific.pregnancies", "Number of pregnancies")}
              </Label>
              <Input
                type="number"
                value={formData.female_pregnancies || ""}
                onChange={(e) =>
                  updateFormData({ female_pregnancies: e.target.value })
                }
              />
            </div>

            <div>
              <Label>{tt("genderSpecific.births", "Births")}</Label>
              <Input
                type="number"
                value={formData.female_births || ""}
                onChange={(e) =>
                  updateFormData({ female_births: e.target.value })
                }
              />
            </div>

            <div>
              <Label>{tt("genderSpecific.abortions", "Abortions")}</Label>
              <Input
                type="number"
                value={formData.female_abortions || ""}
                onChange={(e) =>
                  updateFormData({ female_abortions: e.target.value })
                }
              />
            </div>

            <div>
              <Label>{tt("genderSpecific.miscarriages", "Miscarriages")}</Label>
              <Input
                type="number"
                value={formData.female_miscarriages || ""}
                onChange={(e) =>
                  updateFormData({ female_miscarriages: e.target.value })
                }
              />
            </div>

            <div>
              <Label>
                {tt(
                  "genderSpecific.cesarean",
                  "Cesarean deliveries (how many?)"
                )}
              </Label>
              <Input
                type="number"
                value={formData.female_cesarean_count || ""}
                onChange={(e) =>
                  updateFormData({ female_cesarean_count: e.target.value })
                }
              />
            </div>
          </div>

          {/* Symptom checkboxes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {[
              {
                key: "female_bleeding_between_periods",
                label: tt(
                  "genderSpecific.bleeding",
                  "Bleeding between periods"
                ),
              },
              {
                key: "female_heavy_periods",
                label: tt("genderSpecific.heavyPeriods", "Heavy periods"),
              },
              {
                key: "female_extreme_menstrual_pain",
                label: tt(
                  "genderSpecific.menstrualPain",
                  "Extreme menstrual pain"
                ),
              },
              {
                key: "female_breast_lump_or_nipple_discharge",
                label: tt(
                  "genderSpecific.breastLump",
                  "Breast lump or nipple discharge"
                ),
              },
              {
                key: "female_painful_intercourse",
                label: tt(
                  "genderSpecific.painfulIntercourse",
                  "Painful intercourse"
                ),
              },
              {
                key: "female_urine_leak",
                label: tt(
                  "genderSpecific.urineLeak",
                  "Do you ever have urine leak?"
                ),
              },
              {
                key: "female_hot_flashes",
                label: tt(
                  "genderSpecific.hotFlashes",
                  "Do you have hot flashes?"
                ),
              },
            ].map(({ key, label }) => (
              <div key={key} className="flex items-center space-x-2">
                <Checkbox
                  id={key}
                  checked={!!formData[key]}
                  onCheckedChange={(checked) =>
                    updateFormData({ [key]: !!checked })
                  }
                />
                <label htmlFor={key} className="text-sm font-normal">
                  {label}
                </label>
              </div>
            ))}
          </div>

          {/* Condom use / birth control */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <Label>
                {tt(
                  "genderSpecific.partnerUsesCondoms",
                  "Does your partner use condoms?"
                )}
              </Label>
              <RadioGroup
                value={
                  formData.female_partner_uses_condom === true
                    ? "yes"
                    : formData.female_partner_uses_condom === false
                    ? "no"
                    : ""
                }
                onValueChange={(value) =>
                  updateFormData({
                    female_partner_uses_condom:
                      value === "yes" ? true : value === "no" ? false : null,
                  })
                }
                className="flex gap-4 mt-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="partner-condom-yes" />
                  <Label
                    htmlFor="partner-condom-yes"
                    className="font-normal text-sm"
                  >
                    {t("insurance.yes")}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="partner-condom-no" />
                  <Label
                    htmlFor="partner-condom-no"
                    className="font-normal text-sm"
                  >
                    {t("insurance.no")}
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label>
                {tt(
                  "genderSpecific.birthControl",
                  "Other birth control method (if any)"
                )}
              </Label>
              <Input
                value={formData.female_other_birth_control_method || ""}
                onChange={(e) =>
                  updateFormData({
                    female_other_birth_control_method: e.target.value,
                  })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus, X } from "lucide-react";
import { useState } from "react";

const relations = [
  "children",
  "grandfather_paternal",
  "grandfather_maternal",
  "grandmother_paternal",
  "grandmother_maternal",
  "father",
  "mother",
  "sibling",
];
const normalizeRelation = (rel: string) => {
  const r = (rel || "").trim().toLowerCase();

  const map: Record<string, string> = {
    children: "children",
    father: "father",
    mother: "mother",
    sibling: "sibling",
    "brother/sister": "sibling",
    "brother / sister": "sibling",

    "grandfather (paternal)": "grandfather_paternal",
    "grandfather (maternal)": "grandfather_maternal",
    "grandmother (paternal)": "grandmother_paternal",
    "grandmother (maternal)": "grandmother_maternal",

    // allow already-correct keys
    grandfather_paternal: "grandfather_paternal",
    grandfather_maternal: "grandfather_maternal",
    grandmother_paternal: "grandmother_paternal",
    grandmother_maternal: "grandmother_maternal",
  };

  return map[r] ?? rel;
};

const isDefaultRelation = (rel: string) =>
  relations.includes(normalizeRelation(rel));

const healthProblems = [
  "addictions",
  "arthritis",
  "depression",
  "cancer",
  "diabetes",
  "heart",
  "hypertension",
  "osteoporosis",
  "stroke",
  "suicide",
];

type FamilyEntry = {
  id: string;
  relation: string;
  alive?: "yes" | "no" | "";
  age?: string;
  problems: string[];
};

export const FamilyHistoryTab = ({ formData, updateFormData }: any) => {
  const { t } = useTranslation();

  // Initialize entries from formData or from default relations
  const initialEntries: FamilyEntry[] =
    Array.isArray(formData.familyHistoryEntries) &&
    formData.familyHistoryEntries.length > 0
      ? formData.familyHistoryEntries.map((e: FamilyEntry) => {
          const normalized = normalizeRelation(e.relation);
          return {
            ...e,
            relation: normalized,
            // if it's a default relation, force a stable id (prevents duplicates/weird grouping)
            id: relations.includes(normalized) ? normalized : e.id,
          };
        })
      : relations.map((rel) => ({
          id: rel,
          relation: rel,
          alive: "",
          age: "",
          problems: [],
        }));

  const [entries, setEntries] = useState<FamilyEntry[]>(initialEntries);

  const syncEntries = (updated: FamilyEntry[]) => {
    setEntries(updated);
    updateFormData({ familyHistoryEntries: updated });
  };

  const handleAliveChange = (id: string, value: "yes" | "no") => {
    const updated = entries.map((e) =>
      e.id === id ? { ...e, alive: value } : e
    );
    syncEntries(updated);
  };

  const handleAgeChange = (id: string, value: string) => {
    const updated = entries.map((e) =>
      e.id === id ? { ...e, age: value } : e
    );
    syncEntries(updated);
  };

  const toggleProblem = (
    id: string,
    problem: string,
    checked: boolean | "indeterminate"
  ) => {
    const isChecked = checked === true;
    const updated = entries.map((e) => {
      if (e.id !== id) return e;
      const current = e.problems || [];
      const next = isChecked
        ? Array.from(new Set([...current, problem]))
        : current.filter((p) => p !== problem);
      return { ...e, problems: next };
    });
    syncEntries(updated);
  };

  const addFamilyMember = () => {
    const newEntry: FamilyEntry = {
      id: `${Date.now().toString()}-${Math.random().toString(36).slice(2)}`,
      relation: "",
      alive: "",
      age: "",
      problems: [],
    };
    syncEntries([...entries, newEntry]);
  };

  const removeFamilyMember = (id: string) => {
    const updated = entries.filter((e) => e.id !== id);
    syncEntries(updated);
  };

  const defaultEntries = entries.filter((e) => isDefaultRelation(e.relation));
  const extraEntries = entries.filter((e) => !isDefaultRelation(e.relation));

  const stiOptions = [
    "gonorrhea",
    "chlamydia",
    "herpes",
    "genitalWarts",
    "hiv",
    "hepBC",
    "syphilis",
  ];

  const stiInterest: string[] = Array.isArray(formData.sti_interest)
    ? formData.sti_interest
    : [];

  const toggleSti = (sti: string, checked: boolean | "indeterminate") => {
    const isChecked = checked === true;
    const current = stiInterest;
    let next = current;

    if (isChecked && !current.includes(sti)) {
      next = [...current, sti];
    } else if (!isChecked && current.includes(sti)) {
      next = current.filter((s) => s !== sti);
    }

    updateFormData({ sti_interest: next });
  };

  console.log("familyHistoryEntries (raw):", formData.familyHistoryEntries);

  return (
    <div className="space-y-6">
      {/* FAMILY HISTORY */}
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">
            {t("family.title") || "Family History"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Default family relations */}
          {defaultEntries.map((entry) => (
            <div
              key={entry.id}
              className="p-4 border border-border rounded-lg space-y-3"
            >
              <Label className="font-semibold">
                {t(`family.relations.${normalizeRelation(entry.relation)}`)}
              </Label>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
                {/* Alive radio */}
                <div>
                  <Label className="text-xs text-muted-foreground">
                    {t("family.alive") || "Alive"}
                  </Label>
                  <RadioGroup
                    className="flex gap-4 mt-1"
                    value={entry.alive || ""}
                    onValueChange={(value) =>
                      handleAliveChange(entry.id, value as "yes" | "no")
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="yes"
                        id={`${entry.id}-alive-yes`}
                      />
                      <Label
                        htmlFor={`${entry.id}-alive-yes`}
                        className="font-normal text-sm"
                      >
                        {t("family.y")}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id={`${entry.id}-alive-no`} />
                      <Label
                        htmlFor={`${entry.id}-alive-no`}
                        className="font-normal text-sm"
                      >
                        {t("family.n")}
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Age */}
                <div>
                  <Label className="text-xs text-muted-foreground">
                    {t("family.age") || "Age (or age at death)"}
                  </Label>
                  <Input
                    type="number"
                    className="mt-1"
                    value={entry.age || ""}
                    onChange={(e) => handleAgeChange(entry.id, e.target.value)}
                  />
                </div>

                {/* Problems */}
                <div className="md:col-span-2">
                  <Label className="text-xs text-muted-foreground">
                    {t("family.problems") || "Health problems"}
                  </Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {healthProblems.map((problemKey) => {
                      const checkboxId = `${entry.id}-${problemKey}`;
                      const checked = entry.problems?.includes(problemKey);
                      return (
                        <div
                          key={problemKey}
                          className="flex items-center space-x-1"
                        >
                          <Checkbox
                            id={checkboxId}
                            checked={!!checked}
                            onCheckedChange={(checkedValue) =>
                              toggleProblem(entry.id, problemKey, checkedValue)
                            }
                          />
                          <label
                            htmlFor={checkboxId}
                            className="text-xs font-normal capitalize"
                          >
                            {t(`family.${problemKey}`) || problemKey}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Additional family members */}
          {extraEntries.map((entry) => (
            <div
              key={entry.id}
              className="p-4 border border-border rounded-lg space-y-3"
            >
              <div className="flex justify-between items-center">
                <Label className="font-semibold">{t("family.member")}</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFamilyMember(entry.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
                {/* Relation editable */}
                <div>
                  <Label className="text-xs text-muted-foreground">
                    {t("family.relation") || "Relation"}
                  </Label>
                  <Input
                    className="mt-1"
                    placeholder={t("family.relation") || "Relation"}
                    value={entry.relation}
                    onChange={(e) => {
                      const updated = entries.map((e2) =>
                        e2.id === entry.id
                          ? { ...e2, relation: e.target.value }
                          : e2
                      );
                      syncEntries(updated);
                    }}
                  />
                </div>

                {/* Alive */}
                <div>
                  <Label className="text-xs text-muted-foreground">
                    {t("family.alive")}
                  </Label>
                  <RadioGroup
                    className="flex gap-4 mt-1"
                    value={entry.alive || ""}
                    onValueChange={(value) =>
                      handleAliveChange(entry.id, value as "yes" | "no")
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="yes"
                        id={`member-${entry.id}-alive-yes`}
                      />
                      <Label
                        htmlFor={`member-${entry.id}-alive-yes`}
                        className="font-normal text-sm"
                      >
                        {t("family.y")}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="no"
                        id={`member-${entry.id}-alive-no`}
                      />
                      <Label
                        htmlFor={`member-${entry.id}-alive-no`}
                        className="font-normal text-sm"
                      >
                        {t("family.n")}
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Age */}
                <div>
                  <Label className="text-xs text-muted-foreground">
                    {t("family.age") || "Age (or age at death)"}
                  </Label>
                  <Input
                    type="number"
                    className="mt-1"
                    value={entry.age || ""}
                    onChange={(e) => handleAgeChange(entry.id, e.target.value)}
                  />
                </div>

                {/* Problems */}
                <div className="md:col-span-1">
                  <Label className="text-xs text-muted-foreground">
                    {t("family.problems") || "Health problems"}
                  </Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {healthProblems.map((problemKey) => {
                      const checkboxId = `member-${entry.id}-${problemKey}`;
                      const checked = entry.problems?.includes(problemKey);
                      return (
                        <div
                          key={problemKey}
                          className="flex items-center space-x-1"
                        >
                          <Checkbox
                            id={checkboxId}
                            checked={!!checked}
                            onCheckedChange={(checkedValue) =>
                              toggleProblem(entry.id, problemKey, checkedValue)
                            }
                          />
                          <label
                            htmlFor={checkboxId}
                            className="text-xs font-normal capitalize"
                          >
                            {t(`family.${problemKey}`) || problemKey}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={addFamilyMember}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            {t("family.addMember") || "Add Family Member"}
          </Button>
        </CardContent>
      </Card>

      {/* Dental History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">{t("dental.title")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: "regularCheckup", label: t("dental.regularCheckup") },
            { key: "gumsBleed", label: t("dental.gumsBleed") },
            { key: "periodontal", label: t("dental.periodontal") },
            { key: "grindTeeth", label: t("dental.grindTeeth") },
            { key: "wornBraces", label: t("dental.wornBraces") },
            { key: "mouthPain", label: t("dental.mouthPain") },
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <Label>{t("dental.brushFrequency")}</Label>
              <Input
                type="number"
                min="0"
                max="10"
                value={formData.brushFrequency || ""}
                onChange={(e) =>
                  updateFormData({ brushFrequency: e.target.value })
                }
              />
            </div>
            <div>
              <Label>{t("dental.lastCleaning")}</Label>
              <Input
                type="date"
                value={formData.lastCleaning || ""}
                onChange={(e) =>
                  updateFormData({ lastCleaning: e.target.value })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sexual History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">{t("sexual.title")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Yes/No questions */}
          {[
            { key: "useCondoms", label: t("sexual.useCondoms") },
            { key: "sexuallyActive", label: t("sexual.sexuallyActive") },
            { key: "screenedSTI", label: t("sexual.screenedSTI") },
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

          {/* Partners + current partner gender */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>{t("sexual.partners")}</Label>
              <Input
                type="number"
                value={formData.sex_partners_total || ""}
                onChange={(e) =>
                  updateFormData({ sex_partners_total: e.target.value })
                }
              />
            </div>
            <div>
              <Label>{t("sexual.currentPartner")}</Label>
              <RadioGroup
                value={formData.current_partner_gender || ""}
                onValueChange={(value) =>
                  updateFormData({ current_partner_gender: value })
                }
                className="flex gap-2 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="partner-male" />
                  <Label htmlFor="partner-male" className="font-normal text-sm">
                    {t("sexual.maleOnly")}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="partner-female" />
                  <Label
                    htmlFor="partner-female"
                    className="font-normal text-sm"
                  >
                    {t("sexual.femaleOnly")}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="both" id="partner-both" />
                  <Label htmlFor="partner-both" className="font-normal text-sm">
                    {t("sexual.both")}
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* STI screening interest */}
          <div className="pt-2">
            <Label className="text-sm font-semibold">
              {t("sexual.interestedScreening")}
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
              {stiOptions.map((sti) => (
                <div key={sti} className="flex items-center space-x-2">
                  <Checkbox
                    id={sti}
                    checked={stiInterest.includes(sti)}
                    onCheckedChange={(checked) => toggleSti(sti, checked)}
                  />
                  <label htmlFor={sti} className="text-sm font-normal">
                    {t(`sexual.${sti}`)}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

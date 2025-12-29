import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus, X } from "lucide-react";

type Allergy = {
  id: string;
  allergen: string;
  reaction: string;
};

type Medication = {
  id: string;
  drug_name: string;
  strength: string;
  frequency: string;
};

interface HealthHistoryTabProps {
  formData: any;
  updateFormData: (patch: any) => void;
}

export const HealthHistoryTab = ({
  formData,
  updateFormData,
}: HealthHistoryTabProps) => {
  const { t } = useTranslation();

  const allergies: Allergy[] = formData.allergies || [];
  const medications: Medication[] = formData.medications || [];

  // ------- ALLERGIES -------

  const addAllergy = () => {
    const newAllergy: Allergy = {
      id: crypto.randomUUID?.() ?? Date.now().toString(),
      allergen: "",
      reaction: "",
    };
    updateFormData({ allergies: [...allergies, newAllergy] });
  };

  const updateAllergy = (id: string, field: keyof Allergy, value: string) => {
    updateFormData({
      allergies: allergies.map((a) =>
        a.id === id ? { ...a, [field]: value } : a
      ),
    });
  };

  const removeAllergy = (id: string) => {
    updateFormData({
      allergies: allergies.filter((a) => a.id !== id),
    });
  };

  // ------- MEDICATIONS -------

  const addMedication = () => {
    const newMed: Medication = {
      id: crypto.randomUUID?.() ?? Date.now().toString(),
      drug_name: "",
      strength: "",
      frequency: "",
    };
    updateFormData({ medications: [...medications, newMed] });
  };

  const updateMedication = (
    id: string,
    field: keyof Medication,
    value: string
  ) => {
    updateFormData({
      medications: medications.map((m) =>
        m.id === id ? { ...m, [field]: value } : m
      ),
    });
  };

  const removeMedication = (id: string) => {
    updateFormData({
      medications: medications.filter((m) => m.id !== id),
    });
  };

  return (
    <div className="space-y-6">
      {/* Main Reason for Visit */}
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">
            {t("health.mainReason")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={formData.main_reason_for_visit || ""}
            onChange={(e) =>
              updateFormData({ main_reason_for_visit: e.target.value })
            }
            rows={3}
            required
          />
          <div>
            <Label htmlFor="otherConcerns">{t("health.otherConcerns")}</Label>
            <Textarea
              id="otherConcerns"
              value={formData.other_concerns || ""}
              onChange={(e) =>
                updateFormData({ other_concerns: e.target.value })
              }
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* ALLERGIES */}
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">
            {t("health.allergies")}
          </CardTitle>
          <CardDescription>{t("health.allergiesNote")}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {allergies.map((allergy) => (
            <div
              key={allergy.id}
              className="p-4 border border-border rounded-lg space-y-3"
            >
              <div className="flex justify-between items-center">
                <Label className="font-semibold">
                  {t("health.allergyName")}
                </Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeAllergy(allergy.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  value={allergy.allergen}
                  onChange={(e) =>
                    updateAllergy(allergy.id, "allergen", e.target.value)
                  }
                  placeholder={t("health.allergyName")}
                />

                <Input
                  value={allergy.reaction}
                  onChange={(e) =>
                    updateAllergy(allergy.id, "reaction", e.target.value)
                  }
                  placeholder={t("health.reaction")}
                />
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={addAllergy}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            {t("health.addAllergy")}
          </Button>
        </CardContent>
      </Card>

      {/* Current Medications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">
            {t("health.medications")}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {medications.map((med) => (
            <div
              key={med.id}
              className="p-4 border rounded-lg bg-gray-50 space-y-2"
            >
              <div className="flex justify-between items-center">
                <Label className="font-semibold">{t("health.drug")}</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeMedication(med.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Input
                  placeholder={t("health.drug")}
                  value={med.drug_name}
                  onChange={(e) =>
                    updateMedication(med.id, "drug_name", e.target.value)
                  }
                />

                <Input
                  placeholder={t("health.strength")}
                  value={med.strength}
                  onChange={(e) =>
                    updateMedication(med.id, "strength", e.target.value)
                  }
                />

                <Input
                  placeholder={t("health.frequency")}
                  value={med.frequency}
                  onChange={(e) =>
                    updateMedication(med.id, "frequency", e.target.value)
                  }
                />
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={addMedication}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            {t("health.addMedication")}
          </Button>
        </CardContent>
      </Card>

      {/* Pharmacy + Immunizations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">{t("health.pharmacy")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="pharmacy">{t("health.pharmacy")}</Label>
              <Input
                id="pharmacy"
                value={formData.preferred_pharmacy || ""}
                onChange={(e) =>
                  updateFormData({ preferred_pharmacy: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="pharmacyPhone">{t("health.pharmacyPhone")}</Label>
              <Input
                id="pharmacyPhone"
                type="tel"
                value={formData.pharmacy_phone || ""}
                onChange={(e) =>
                  updateFormData({ pharmacy_phone: e.target.value })
                }
              />
            </div>
          </div>

          <div className="pt-4">
            <Label className="text-base font-semibold">
              {t("health.immunizations")}
            </Label>
            <RadioGroup
              value={formData.immunizations_current || "dont_know"}
              onValueChange={(value) =>
                updateFormData({ immunizations_current: value })
              }
              className="flex gap-4 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="immunizations-yes" />
                <Label htmlFor="immunizations-yes" className="font-normal">
                  {t("insurance.yes")}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="immunizations-no" />
                <Label htmlFor="immunizations-no" className="font-normal">
                  {t("insurance.no")}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dont_know" id="immunizations-unknown" />
                <Label htmlFor="immunizations-unknown" className="font-normal">
                  {t("health.dontKnow")}
                </Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

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
import { useState, useEffect } from "react";

interface ListItem {
  id: string;
  name: string;
  detail: string;
  additional?: string;
}

export const HealthHistoryTab = ({ formData, updateFormData }: any) => {
  const { t } = useTranslation();
  const [medications, setMedications] = useState(formData.medications || []);
  const [allergies, setAllergies] = useState(formData.allergies || []);

  useEffect(() => {
    setMedications(formData.medications || []);
  }, [formData.medications]);

  useEffect(() => {
    setAllergies(formData.allergies || []);
  }, [formData.allergies]);

  // Add allergy row
  const addAllergy = () => {
    const newEntry = {
      id: Date.now().toString(),
      allergen: "",
      reaction: "",
    };

    const updated = [...allergies, newEntry];

    setAllergies(updated);
    updateFormData({ allergies: updated });
  };

  // Remove allergy row
  const removeAllergy = (id: string) => {
    const updated = allergies.filter((a) => a.id !== id);

    setAllergies(updated);
    updateFormData({ allergies: updated });
  };

  // Add medication row
  const addMedication = () => {
    updateFormData({
      medications: [
        ...(formData.medications || []),
        {
          id: Date.now().toString(),
          drug_name: "",
          strength: "",
          frequency: "",
        },
      ],
    });
  };

  const removeMedication = (id: string) => {
    updateFormData({
      medications: formData.medications.filter((m) => m.id !== id),
    });
  };

  const handleMedicationChange = (id: string, field: string, value: string) => {
    updateFormData({
      medications: formData.medications.map((m) =>
        m.id === id ? { ...m, [field]: value } : m
      ),
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
          {formData.allergies.map((allergy, index) => (
            <div
              key={allergy.id}
              className="p-4 border border-border rounded-lg space-y-3"
            >
              {/* Remove Button */}
              <div className="flex justify-between items-center">
                <Label className="font-semibold">
                  {t("health.allergyName")}
                </Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const updated = allergies.filter(
                      (a) => a.id !== allergy.id
                    );
                    setAllergies(updated);
                    updateFormData({ allergies: updated });
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Allergen */}
                <Input
                  value={allergy.allergen}
                  onChange={(e) => {
                    const updated = allergies.map((a) =>
                      a.id === allergy.id
                        ? { ...a, allergen: e.target.value }
                        : a
                    );
                    setAllergies(updated);
                    updateFormData({ allergies: updated });
                  }}
                  placeholder={t("health.allergyName")}
                />

                <Input
                  value={allergy.reaction}
                  onChange={(e) => {
                    const updated = allergies.map((a) =>
                      a.id === allergy.id
                        ? { ...a, reaction: e.target.value }
                        : a
                    );
                    setAllergies(updated);
                    updateFormData({ allergies: updated });
                  }}
                  placeholder={t("health.reaction")}
                />
              </div>
            </div>
          ))}

          {/* Add Allergy */}
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              const newAllergy = {
                id: Date.now(),
                allergen: "",
                reaction: "",
              };
              updateFormData({
                allergies: [...formData.allergies, newAllergy],
              });
            }}
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
          <CardTitle className="text-primary">Current Medications</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {medications.map((med) => (
            <div
              key={med.id}
              className="p-4 border rounded-lg bg-gray-50 space-y-2"
            >
              <div className="flex justify-between items-center">
                <Label className="font-semibold">Medication</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeMedication(med.id)}
                >
                  ×
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Input
                  placeholder="Name"
                  value={med.drug_name}
                  onChange={(e) => {
                    const updated = medications.map((m) =>
                      m.id === med.id ? { ...m, drug_name: e.target.value } : m
                    );
                    setMedications(updated);
                    updateFormData({ medications: updated });
                  }}
                />

                <Input
                  placeholder="Strength"
                  value={med.strength}
                  onChange={(e) => {
                    const updated = medications.map((m) =>
                      m.id === med.id ? { ...m, strength: e.target.value } : m
                    );
                    setMedications(updated);
                    updateFormData({ medications: updated });
                  }}
                />

                <Input
                  placeholder="Frequency"
                  value={med.frequency}
                  onChange={(e) => {
                    const updated = medications.map((m) =>
                      m.id === med.id ? { ...m, frequency: e.target.value } : m
                    );
                    setMedications(updated);
                    updateFormData({ medications: updated });
                  }}
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
            + Add Medication
          </Button>
        </CardContent>
      </Card>

      {/* Pharmacy Info */}
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
                value={formData.pharmacy || ""}
                onChange={(e) => updateFormData({ pharmacy: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="pharmacyPhone">{t("health.pharmacyPhone")}</Label>
              <Input
                id="pharmacyPhone"
                type="tel"
                value={formData.pharmacyPhone || ""}
                onChange={(e) =>
                  updateFormData({ pharmacyPhone: e.target.value })
                }
              />
            </div>
          </div>

          <div className="pt-4">
            <Label className="text-base font-semibold">
              {t("health.immunizations")}
            </Label>
            <RadioGroup
              value={formData.immunizations || ""}
              onValueChange={(value) =>
                updateFormData({ immunizations: value })
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
                <RadioGroupItem value="unknown" id="immunizations-unknown" />
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

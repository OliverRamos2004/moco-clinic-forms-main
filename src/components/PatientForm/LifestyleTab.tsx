import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

export const LifestyleTab = ({ formData, updateFormData }: any) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      {/* SOCIAL HISTORY — CAFFEINE */}
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">{t("social.caffeine")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup
            value={formData.caffeine || ""}
            onValueChange={(value) => updateFormData({ caffeine: value })}
            className="flex flex-wrap gap-4"
          >
            {["none", "occasionally", "moderate", "heavy"].map((level) => (
              <div key={level} className="flex items-center space-x-2">
                <RadioGroupItem value={level} id={`caffeine-${level}`} />
                <Label
                  htmlFor={`caffeine-${level}`}
                  className="font-normal capitalize"
                >
                  {t(`social.${level}`)}
                </Label>
              </div>
            ))}
          </RadioGroup>

          <div>
            <Label>{t("social.cupsPerDay")}</Label>
            <Input
              type="number"
              min="0"
              value={formData.cups_per_day || ""}
              onChange={(e) => updateFormData({ cups_per_day: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      {/* SOCIAL HISTORY — ALCOHOL */}
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">{t("social.alcohol")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Drink alcohol? */}
          <div>
            <Label className="text-base">{t("social.drinkAlcohol")}</Label>
            <RadioGroup
              value={formData.alcohol_use || ""}
              onValueChange={(value) => updateFormData({ alcohol_use: value })}
              className="flex flex-wrap gap-4 mt-2"
            >
              {["never", "occasionally", "lessThan3", "moreThan3"].map(
                (freq) => (
                  <div key={freq} className="flex items-center space-x-2">
                    <RadioGroupItem value={freq} id={`alcohol-${freq}`} />
                    <Label
                      htmlFor={`alcohol-${freq}`}
                      className="font-normal text-sm"
                    >
                      {t(`social.${freq}`)}
                    </Label>
                  </div>
                )
              )}
            </RadioGroup>
          </div>

          {/* Drinks per week */}
          <div>
            <Label>{t("social.drinksPerWeek")}</Label>
            <div className="grid grid-cols-3 gap-3 mt-2">
              <Input
                placeholder={t("social.beer")}
                type="number"
                value={formData.drinks_beer || ""}
                onChange={(e) =>
                  updateFormData({ drinks_beer: e.target.value })
                }
              />
              <Input
                placeholder={t("social.wine")}
                type="number"
                value={formData.drinks_wine || ""}
                onChange={(e) =>
                  updateFormData({ drinks_wine: e.target.value })
                }
              />
              <Input
                placeholder={t("social.hardLiquor")}
                type="number"
                value={formData.drinks_liquor || ""}
                onChange={(e) =>
                  updateFormData({ drinks_liquor: e.target.value })
                }
              />
            </div>
          </div>

          {/* CAGE Questionnaire */}
          <div className="space-y-3 pt-2">
            {[
              { key: "cutDown", label: t("social.cutDown") },
              { key: "annoyed", label: t("social.annoyed") },
              { key: "guilty", label: t("social.guilty") },
              { key: "morning", label: t("social.morning") },
            ].map(({ key, label }) => (
              <div key={key}>
                <Label className="text-sm">{label}</Label>
                <RadioGroup
                  value={formData[key] || ""}
                  onValueChange={(value) => updateFormData({ [key]: value })}
                  className="flex gap-4 mt-1"
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
          </div>
        </CardContent>
      </Card>

      {/* SOCIAL HISTORY — TOBACCO */}
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">{t("social.tobacco")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Tobacco use */}
          <div>
            <Label className="text-base">{t("social.useTobacco")}</Label>
            <RadioGroup
              value={formData.tobacco_use || ""}
              onValueChange={(value) => updateFormData({ tobacco_use: value })}
              className="flex gap-4 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="tobacco-yes" />
                <Label htmlFor="tobacco-yes" className="font-normal">
                  {t("insurance.yes")}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="tobacco-no" />
                <Label htmlFor="tobacco-no" className="font-normal">
                  {t("insurance.no")}
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Tobacco details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>{t("social.howOld")}</Label>
              <Input
                type="number"
                value={formData.smoking_start_age || ""}
                onChange={(e) =>
                  updateFormData({ smoking_start_age: e.target.value })
                }
              />
            </div>
            <div>
              <Label>{t("social.years")}</Label>
              <Input
                type="number"
                value={formData.smoking_years || ""}
                onChange={(e) =>
                  updateFormData({ smoking_years: e.target.value })
                }
              />
            </div>
          </div>

          {/* Types */}
          <div>
            <Label className="text-sm font-semibold">Type:</Label>
            <div className="grid grid-cols-3 gap-3 mt-2">
              <Input
                placeholder={t("social.cigarettes")}
                value={formData.cigarettes || ""}
                onChange={(e) => updateFormData({ cigarettes: e.target.value })}
              />
              <Input
                placeholder={t("social.cigars")}
                value={formData.cigars || ""}
                onChange={(e) => updateFormData({ cigars: e.target.value })}
              />
              <Input
                placeholder={t("social.chew")}
                value={formData.chew || ""}
                onChange={(e) => updateFormData({ chew: e.target.value })}
              />
            </div>
          </div>

          {/* Quit info */}
          <div>
            <Label className="text-base">{t("social.quitTobacco")}</Label>
            <RadioGroup
              value={formData.quit_tobacco || ""}
              onValueChange={(value) => updateFormData({ quit_tobacco: value })}
              className="flex gap-4 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="quit-yes" />
                <Label htmlFor="quit-yes" className="font-normal">
                  {t("insurance.yes")}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="quit-no" />
                <Label htmlFor="quit-no" className="font-normal">
                  {t("insurance.no")}
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label>{t("social.yearsAgoQuit")}</Label>
            <Input
              type="number"
              value={formData.years_since_quit || ""}
              onChange={(e) =>
                updateFormData({ years_since_quit: e.target.value })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* SOCIAL HISTORY — DRUGS */}
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">{t("social.drugs")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-base">{t("social.useRecreational")}</Label>
            <RadioGroup
              value={formData.drug_use || ""}
              onValueChange={(value) => updateFormData({ drug_use: value })}
              className="flex gap-4 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="drugs-yes" />
                <Label htmlFor="drugs-yes" className="font-normal">
                  {t("insurance.yes")}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="drugs-no" />
                <Label htmlFor="drugs-no" className="font-normal">
                  {t("insurance.no")}
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label>{t("social.listDrugs")}</Label>
            <Textarea
              rows={3}
              value={formData.drug_list || ""}
              onChange={(e) => updateFormData({ drug_list: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      {/* NUTRITION HISTORY */}
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">{t("nutrition.title")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Salt + Sugar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>{t("nutrition.saltIntake")}</Label>
              <RadioGroup
                value={formData.salt_intake || ""}
                onValueChange={(value) =>
                  updateFormData({ salt_intake: value })
                }
                className="flex gap-4 mt-2"
              >
                {["low", "medium", "high"].map((level) => (
                  <div key={level} className="flex items-center space-x-2">
                    <RadioGroupItem value={level} id={`salt-${level}`} />
                    <Label
                      htmlFor={`salt-${level}`}
                      className="font-normal capitalize"
                    >
                      {t(`nutrition.${level}`)}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div>
              <Label>{t("nutrition.sugarIntake")}</Label>
              <RadioGroup
                value={formData.sugar_intake || ""}
                onValueChange={(value) =>
                  updateFormData({ sugar_intake: value })
                }
                className="flex gap-4 mt-2"
              >
                {["low", "medium", "high"].map((level) => (
                  <div key={level} className="flex items-center space-x-2">
                    <RadioGroupItem value={level} id={`sugar-${level}`} />
                    <Label
                      htmlFor={`sugar-${level}`}
                      className="font-normal capitalize"
                    >
                      {t(`nutrition.${level}`)}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>

          {/* Fruit/Veg */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>{t("nutrition.fruitVeg")}</Label>
              <Input
                type="number"
                min="0"
                value={formData.fruit_servings_per_day || ""}
                onChange={(e) =>
                  updateFormData({ fruit_servings_per_day: e.target.value })
                }
              />
            </div>

            <div>
              <Label>{t("nutrition.carbIntake")}</Label>
              <Input
                type="number"
                min="0"
                value={formData.vegetable_servings_per_day || ""}
                onChange={(e) =>
                  updateFormData({ vegetable_servings_per_day: e.target.value })
                }
              />
            </div>
          </div>

          {/* Meals + Water */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>{t("nutrition.mealsPerDay")}</Label>
              <Input
                type="number"
                min="0"
                value={formData.meals_per_day || ""}
                onChange={(e) =>
                  updateFormData({ meals_per_day: e.target.value })
                }
              />
            </div>

            <div>
              <Label>{t("nutrition.waterPerDay")}</Label>
              <Input
                value={formData.water_per_day || ""}
                onChange={(e) =>
                  updateFormData({ water_per_day: e.target.value })
                }
              />
            </div>
          </div>

          {/* Fluids */}
          <div>
            <Label>{t("nutrition.fluids")}</Label>
            <Input
              value={formData.other_fluids || ""}
              onChange={(e) => updateFormData({ other_fluids: e.target.value })}
            />
          </div>

          {/* Intolerances */}
          <div>
            <Label>{t("nutrition.intolerances")}</Label>
            <Textarea
              rows={2}
              value={formData.food_intolerances_allergies || ""}
              onChange={(e) =>
                updateFormData({ food_intolerances_allergies: e.target.value })
              }
            />
          </div>

          {/* Additional */}
          <div>
            <Label>{t("nutrition.additionalInfo")}</Label>
            <Textarea
              rows={4}
              value={formData.additional_notes || ""}
              onChange={(e) =>
                updateFormData({ additional_notes: e.target.value })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* SIGNATURE SECTION */}
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">
            {t("insurance.affirmation")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>{t("insurance.printName")}</Label>
              <Input
                value={formData.signature_name || ""}
                onChange={(e) =>
                  updateFormData({ signature_name: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label>{t("insurance.date")}</Label>
              <Input
                type="date"
                value={formData.signature_date || ""}
                onChange={(e) =>
                  updateFormData({ signature_date: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Checkbox
              id="signature_confirmed"
              checked={!!formData.signature_confirmed}
              onCheckedChange={(checked) =>
                updateFormData({ signature_confirmed: checked === true })
              }
            />
            <label htmlFor="signature_confirmed" className="text-sm leading-5">
              I affirm that the information provided in this application is true
              and accurate to the best of my knowledge. I understand this serves
              as my electronic signature.
            </label>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

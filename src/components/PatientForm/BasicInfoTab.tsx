import { useTranslation } from "react-i18next";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export const BasicInfoTab = ({ formData, updateFormData }: any) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">{t("basicInfo.adult")}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* FIRST NAME */}
          <div>
            <Label>{t("basicInfo.firstName")}</Label>
            <Input
              type="text"
              value={formData.legal_first_name || ""}
              onChange={(e) =>
                updateFormData({ legal_first_name: e.target.value })
              }
              required
            />
          </div>

          {/* LAST NAME */}
          <div>
            <Label>{t("basicInfo.lastName")}</Label>
            <Input
              type="text"
              value={formData.legal_last_name || ""}
              onChange={(e) =>
                updateFormData({ legal_last_name: e.target.value })
              }
              required
            />
          </div>

          {/* DATE OF BIRTH */}
          <div>
            <Label>{t("basicInfo.dob")}</Label>
            <Input
              type="text"
              placeholder="YYYY-MM-DD"
              pattern="\d{4}-\d{2}-\d{2}"
              value={formData.date_of_birth || ""}
              onChange={(e) =>
                updateFormData({ date_of_birth: e.target.value })
              }
              required
            />
          </div>

          {/* PHONE */}
          <div>
            <Label>{t("basicInfo.phone")}</Label>
            <Input
              type="text"
              value={formData.phone || ""}
              onChange={(e) => updateFormData({ phone: e.target.value })}
              required
            />
          </div>

          {/* EMAIL */}
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              value={formData.email || ""}
              onChange={(e) => updateFormData({ email: e.target.value })}
            />
          </div>

          {/* ADDRESS */}
          <div>
            <Label>{t("basicInfo.street")}</Label>
            <Input
              type="text"
              value={formData.street || ""}
              onChange={(e) => updateFormData({ street: e.target.value })}
              required
            />
          </div>

          <div>
            <Label>{t("basicInfo.city")}</Label>
            <Input
              type="text"
              value={formData.city || ""}
              onChange={(e) => updateFormData({ city: e.target.value })}
              required
            />
          </div>

          <div>
            <Label>State</Label>
            <Input
              type="text"
              value={formData.state || ""}
              onChange={(e) => updateFormData({ state: e.target.value })}
              required
            />
          </div>

          <div>
            <Label>{t("basicInfo.zip")}</Label>
            <Input
              type="text"
              value={formData.zip || ""}
              onChange={(e) => updateFormData({ zip: e.target.value })}
              required
            />
          </div>

          {/* LAST 4 SSN */}
          <div>
            <Label>{t("basicInfo.ssn")}</Label>
            <Input
              type="text"
              maxLength={4}
              value={formData.last4_ssn || ""}
              onChange={(e) => updateFormData({ last4_ssn: e.target.value })}
              required
            />
          </div>

          {/* HEALTH INSURANCE (YES/NO) */}
          <div>
            <Label className="text-base">{t("insurance.hasInsurance")}</Label>
            <RadioGroup
              value={
                formData.has_health_insurance === true
                  ? "yes"
                  : formData.has_health_insurance === false
                  ? "no"
                  : ""
              }
              onValueChange={(value) =>
                updateFormData({
                  has_health_insurance: value === "yes",
                })
              }
              className="flex gap-6 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="insurance-yes" />
                <Label htmlFor="insurance-yes">{t("insurance.yes")}</Label>
              </div>

              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="insurance-no" />
                <Label htmlFor="insurance-no">{t("insurance.no")}</Label>
              </div>
            </RadioGroup>
          </div>

          {/* COUNTY RESIDENT (YES/NO) */}
          <div>
            <Label className="text-base">{t("insurance.isResident")}</Label>
            <RadioGroup
              value={
                formData.montgomery_resident === true
                  ? "yes"
                  : formData.montgomery_resident === false
                  ? "no"
                  : ""
              }
              onValueChange={(value) =>
                updateFormData({
                  montgomery_resident: value === "yes",
                })
              }
              className="flex gap-6 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="resident-yes" />
                <Label htmlFor="resident-yes">{t("insurance.yes")}</Label>
              </div>

              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="resident-no" />
                <Label htmlFor="resident-no">{t("insurance.no")}</Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Emergency Contacts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="border rounded-md p-4 space-y-3 bg-muted/30"
            >
              <p className="font-semibold text-sm">Contact {i}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Name</Label>
                  <Input
                    value={formData[`emergency${i}_name`] || ""}
                    onChange={(e) =>
                      updateFormData({
                        [`emergency${i}_name`]: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Relationship</Label>
                  <Input
                    value={formData[`emergency${i}_relationship`] || ""}
                    onChange={(e) =>
                      updateFormData({
                        [`emergency${i}_relationship`]: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input
                    value={formData[`emergency${i}_phone`] || ""}
                    onChange={(e) =>
                      updateFormData({
                        [`emergency${i}_phone`]: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X } from 'lucide-react';
import { useState } from 'react';

interface Minor {
  id: string;
  name: string;
  dob: string;
  gender: string;
}

export const BasicInfoTab = ({ formData, updateFormData }: any) => {
  const { t } = useTranslation();
  const [minors, setMinors] = useState<Minor[]>([]);

  const addMinor = () => {
    if (minors.length < 4) {
      setMinors([...minors, { id: Date.now().toString(), name: '', dob: '', gender: '' }]);
    }
  };

  const removeMinor = (id: string) => {
    setMinors(minors.filter(m => m.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Adult Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">{t('basicInfo.adult')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="legalName">{t('basicInfo.legalName')}</Label>
              <Input
                id="legalName"
                value={formData.legalName || ''}
                onChange={(e) => updateFormData({ legalName: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="preferredName">{t('basicInfo.preferredName')}</Label>
              <Input
                id="preferredName"
                value={formData.preferredName || ''}
                onChange={(e) => updateFormData({ preferredName: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="street">{t('basicInfo.street')}</Label>
            <Input
              id="street"
              value={formData.street || ''}
              onChange={(e) => updateFormData({ street: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">{t('basicInfo.city')}</Label>
              <Input
                id="city"
                value={formData.city || ''}
                onChange={(e) => updateFormData({ city: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="zip">{t('basicInfo.zip')}</Label>
              <Input
                id="zip"
                value={formData.zip || ''}
                onChange={(e) => updateFormData({ zip: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="dob">{t('basicInfo.dob')}</Label>
              <Input
                id="dob"
                type="date"
                value={formData.dob || ''}
                onChange={(e) => updateFormData({ dob: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="ssn">{t('basicInfo.ssn')}</Label>
              <Input
                id="ssn"
                maxLength={4}
                value={formData.ssn || ''}
                onChange={(e) => updateFormData({ ssn: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="phone">{t('basicInfo.phone')}</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone || ''}
                onChange={(e) => updateFormData({ phone: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <Label>{t('basicInfo.gender')}</Label>
            <RadioGroup
              value={formData.gender || ''}
              onValueChange={(value) => updateFormData({ gender: value })}
              className="flex gap-4 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="M" id="male" />
                <Label htmlFor="male" className="font-normal">{t('basicInfo.male')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="F" id="female" />
                <Label htmlFor="female" className="font-normal">{t('basicInfo.female')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Other" id="other" />
                <Label htmlFor="other" className="font-normal">{t('basicInfo.other')}</Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      {/* Minors Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">{t('basicInfo.minors')}</CardTitle>
          <p className="text-sm text-muted-foreground">{t('basicInfo.minorsNote')}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {minors.map((minor, index) => (
            <div key={minor.id} className="p-4 border border-border rounded-lg space-y-3">
              <div className="flex justify-between items-center">
                <Label className="font-semibold">{t('basicInfo.childName')} {index + 1}</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeMinor(minor.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Input placeholder={t('basicInfo.childName')} />
                <Input type="date" placeholder={t('basicInfo.dob')} />
                <RadioGroup className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="M" id={`minor-m-${minor.id}`} />
                    <Label htmlFor={`minor-m-${minor.id}`} className="font-normal">{t('basicInfo.male')}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="F" id={`minor-f-${minor.id}`} />
                    <Label htmlFor={`minor-f-${minor.id}`} className="font-normal">{t('basicInfo.female')}</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          ))}
          {minors.length < 4 && (
            <Button
              type="button"
              variant="outline"
              onClick={addMinor}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              {t('basicInfo.addMinor')}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Emergency Contact */}
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">{t('basicInfo.emergency')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="emergencyName">{t('basicInfo.emergencyName')}</Label>
              <Input
                id="emergencyName"
                value={formData.emergencyName || ''}
                onChange={(e) => updateFormData({ emergencyName: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="emergencyRelationship">{t('basicInfo.relationship')}</Label>
              <Input
                id="emergencyRelationship"
                value={formData.emergencyRelationship || ''}
                onChange={(e) => updateFormData({ emergencyRelationship: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="emergencyPhone">{t('basicInfo.emergencyPhone')}</Label>
              <Input
                id="emergencyPhone"
                type="tel"
                value={formData.emergencyPhone || ''}
                onChange={(e) => updateFormData({ emergencyPhone: e.target.value })}
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Insurance & Residency */}
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">{t('insurance.hasInsurance')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup
            value={formData.hasInsurance || ''}
            onValueChange={(value) => updateFormData({ hasInsurance: value })}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="insurance-yes" />
              <Label htmlFor="insurance-yes" className="font-normal">{t('insurance.yes')}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="insurance-no" />
              <Label htmlFor="insurance-no" className="font-normal">{t('insurance.no')}</Label>
            </div>
          </RadioGroup>

          <div className="pt-4">
            <Label className="text-base font-semibold">{t('insurance.isResident')}</Label>
            <RadioGroup
              value={formData.isResident || ''}
              onValueChange={(value) => updateFormData({ isResident: value })}
              className="flex gap-4 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="resident-yes" />
                <Label htmlFor="resident-yes" className="font-normal">{t('insurance.yes')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="resident-no" />
                <Label htmlFor="resident-no" className="font-normal">{t('insurance.no')}</Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

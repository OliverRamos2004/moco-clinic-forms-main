import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Plus, X } from 'lucide-react';
import { useState } from 'react';

interface ListItem {
  id: string;
  name: string;
  detail: string;
  additional?: string;
}

export const HealthHistoryTab = ({ formData, updateFormData }: any) => {
  const { t } = useTranslation();
  const [allergies, setAllergies] = useState<ListItem[]>([]);
  const [medications, setMedications] = useState<ListItem[]>([]);

  const addAllergy = () => {
    setAllergies([...allergies, { id: Date.now().toString(), name: '', detail: '' }]);
  };

  const removeAllergy = (id: string) => {
    setAllergies(allergies.filter(a => a.id !== id));
  };

  const addMedication = () => {
    setMedications([...medications, { id: Date.now().toString(), name: '', detail: '', additional: '' }]);
  };

  const removeMedication = (id: string) => {
    setMedications(medications.filter(m => m.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Main Reason for Visit */}
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">{t('health.mainReason')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={formData.mainReason || ''}
            onChange={(e) => updateFormData({ mainReason: e.target.value })}
            rows={3}
            required
          />
          <div>
            <Label htmlFor="otherConcerns">{t('health.otherConcerns')}</Label>
            <Textarea
              id="otherConcerns"
              value={formData.otherConcerns || ''}
              onChange={(e) => updateFormData({ otherConcerns: e.target.value })}
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Allergies */}
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">{t('health.allergies')}</CardTitle>
          <CardDescription>{t('health.allergiesNote')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {allergies.map((allergy) => (
            <div key={allergy.id} className="p-4 border border-border rounded-lg space-y-3">
              <div className="flex justify-between items-center">
                <Label className="font-semibold">{t('health.allergyName')}</Label>
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
                <Input placeholder={t('health.allergyName')} />
                <Input placeholder={t('health.reaction')} />
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
            {t('health.addAllergy')}
          </Button>
        </CardContent>
      </Card>

      {/* Current Medications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">{t('health.medications')}</CardTitle>
          <CardDescription>{t('health.medicationsNote')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {medications.map((medication) => (
            <div key={medication.id} className="p-4 border border-border rounded-lg space-y-3">
              <div className="flex justify-between items-center">
                <Label className="font-semibold">{t('health.drug')}</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeMedication(medication.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Input placeholder={t('health.drug')} />
                <Input placeholder={t('health.strength')} />
                <Input placeholder={t('health.frequency')} />
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
            {t('health.addMedication')}
          </Button>
        </CardContent>
      </Card>

      {/* Pharmacy Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">{t('health.pharmacy')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="pharmacy">{t('health.pharmacy')}</Label>
              <Input
                id="pharmacy"
                value={formData.pharmacy || ''}
                onChange={(e) => updateFormData({ pharmacy: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="pharmacyPhone">{t('health.pharmacyPhone')}</Label>
              <Input
                id="pharmacyPhone"
                type="tel"
                value={formData.pharmacyPhone || ''}
                onChange={(e) => updateFormData({ pharmacyPhone: e.target.value })}
              />
            </div>
          </div>

          <div className="pt-4">
            <Label className="text-base font-semibold">{t('health.immunizations')}</Label>
            <RadioGroup
              value={formData.immunizations || ''}
              onValueChange={(value) => updateFormData({ immunizations: value })}
              className="flex gap-4 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="immunizations-yes" />
                <Label htmlFor="immunizations-yes" className="font-normal">{t('insurance.yes')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="immunizations-no" />
                <Label htmlFor="immunizations-no" className="font-normal">{t('insurance.no')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="unknown" id="immunizations-unknown" />
                <Label htmlFor="immunizations-unknown" className="font-normal">{t('health.dontKnow')}</Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

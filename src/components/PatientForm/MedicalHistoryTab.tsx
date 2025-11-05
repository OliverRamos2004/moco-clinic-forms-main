import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Plus, X } from 'lucide-react';
import { useState } from 'react';

const medicalConditions = [
  'Anxiety disorder', 'Diverticulitis', 'Kidney Disease',
  'Arthritis', 'Fibromyalgia', 'Kidney Stones',
  'Asthma', 'Gout', 'Leg/Foot Ulcers',
  'Bleeding Disorder', 'Has Pacemaker', 'Liver Disease',
  'Blood Clots (or DVT)', 'Heart Attack', 'Osteoporosis',
  'Cancer', 'Heart Murmur', 'Polio',
  'Coronary Artery Disease', 'Hiatal Hernia or Reflux Disease', 'Pulmonary Embolism',
  'Glaucophobia', 'HIV or AIDS', 'Reflux or Ulcers',
  'Diabetes - Insulin', 'High Cholesterol', 'Stroke',
  'Diabetes - No Insulin', 'High Blood Pressure', 'Tuberculosis',
  'Dialysis', 'Overactive Thyroid', 'Other',
  'Blood Transfusion', 'Recent Weight Changes'
];

export const MedicalHistoryTab = ({ formData, updateFormData }: any) => {
  const { t } = useTranslation();
  const [pastHistory, setPastHistory] = useState<any[]>([]);
  const [erVisits, setErVisits] = useState<any[]>([]);

  const addPastHistory = () => {
    setPastHistory([...pastHistory, { id: Date.now().toString() }]);
  };

  const removePastHistory = (id: string) => {
    setPastHistory(pastHistory.filter(p => p.id !== id));
  };

  const addErVisit = () => {
    setErVisits([...erVisits, { id: Date.now().toString() }]);
  };

  const removeErVisit = (id: string) => {
    setErVisits(erVisits.filter(e => e.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Past Medical History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">{t('medical.past')}</CardTitle>
          <CardDescription>{t('medical.pastNote')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {pastHistory.map((item) => (
            <div key={item.id} className="p-4 border border-border rounded-lg space-y-3">
              <div className="flex justify-between items-center">
                <Label className="font-semibold">Entry</Label>
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
                <Input placeholder={t('medical.reason')} />
                <Input placeholder={t('medical.year')} type="number" />
                <Input placeholder={t('medical.hospital')} />
              </div>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={addPastHistory}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            {t('medical.addEntry')}
          </Button>
        </CardContent>
      </Card>

      {/* Emergency Room Visits */}
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">{t('medical.erVisits')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {erVisits.map((item) => (
            <div key={item.id} className="p-4 border border-border rounded-lg space-y-3">
              <div className="flex justify-between items-center">
                <Label className="font-semibold">Visit</Label>
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
                <Input placeholder={t('medical.visitReason')} />
                <Input placeholder={t('medical.dateYear')} />
                <Input placeholder={t('medical.hospital')} />
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
            {t('medical.addEntry')}
          </Button>
        </CardContent>
      </Card>

      {/* Health Questions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">{t('medical.questions')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: 'tuberculosis', label: t('medical.tuberculosis') },
            { key: 'persistentCough', label: t('medical.persistentCough') },
            { key: 'bloodyMucus', label: t('medical.bloodyMucus') },
            { key: 'exposedTB', label: t('medical.exposedTB') },
            { key: 'traveledUSA', label: t('medical.traveledUSA') }
          ].map(({ key, label }) => (
            <div key={key}>
              <Label className="text-base">{label}</Label>
              <RadioGroup
                value={formData[key] || ''}
                onValueChange={(value) => updateFormData({ [key]: value })}
                className="flex gap-4 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id={`${key}-yes`} />
                  <Label htmlFor={`${key}-yes`} className="font-normal">{t('insurance.yes')}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id={`${key}-no`} />
                  <Label htmlFor={`${key}-no`} className="font-normal">{t('insurance.no')}</Label>
                </div>
              </RadioGroup>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Medical Conditions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">{t('medical.conditions')}</CardTitle>
          <CardDescription>{t('medical.conditionsNote')}</CardDescription>
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

      {/* Gender-Specific Sections */}
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">{t('genderSpecific.maleOnly')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              t('genderSpecific.penileLesions'),
              t('genderSpecific.erectileDifficulty'),
              t('genderSpecific.troubleUrinating'),
              t('genderSpecific.wakeAtNight')
            ].map((item) => (
              <div key={item} className="flex items-center space-x-2">
                <Checkbox id={item} />
                <label htmlFor={item} className="text-sm font-normal">{item}</label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-primary">{t('genderSpecific.femaleOnly')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>{t('genderSpecific.lastPAP')}</Label>
              <Input type="date" />
            </div>
            <div>
              <Label>{t('genderSpecific.lastMammogram')}</Label>
              <Input type="date" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>{t('genderSpecific.ageFirstPeriod')}</Label>
              <Input type="number" />
            </div>
            <div>
              <Label>{t('genderSpecific.ageLastPeriod')}</Label>
              <Input type="date" />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Input placeholder={t('genderSpecific.pregnancies')} type="number" />
            <Input placeholder={t('genderSpecific.miscarriages')} type="number" />
            <Input placeholder={t('genderSpecific.cesarean')} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {[
              t('genderSpecific.bleeding'),
              t('genderSpecific.heavyPeriods'),
              t('genderSpecific.menstrualPain'),
              t('genderSpecific.breastLump'),
              t('genderSpecific.painfulIntercourse'),
              t('genderSpecific.urineLeak'),
              t('genderSpecific.hotFlashes')
            ].map((item) => (
              <div key={item} className="flex items-center space-x-2">
                <Checkbox id={item} />
                <label htmlFor={item} className="text-sm font-normal">{item}</label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

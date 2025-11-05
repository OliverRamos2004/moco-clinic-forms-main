import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Plus, X } from 'lucide-react';
import { useState } from 'react';

const relations = [
  'Children', 'Grandfather (paternal)', 'Grandfather (maternal)',
  'Grandmother (paternal)', 'Grandmother (maternal)',
  'Father', 'Mother', 'Brother/Sister'
];

const healthProblems = [
  'addictions', 'arthritis', 'depression', 'cancer', 'diabetes',
  'heart', 'hypertension', 'osteoporosis', 'stroke', 'suicide'
];

export const FamilyHistoryTab = ({ formData, updateFormData }: any) => {
  const { t } = useTranslation();
  const [familyMembers, setFamilyMembers] = useState<any[]>([]);

  const addFamilyMember = () => {
    setFamilyMembers([...familyMembers, { id: Date.now().toString() }]);
  };

  const removeFamilyMember = (id: string) => {
    setFamilyMembers(familyMembers.filter(m => m.id !== id));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">{t('family.title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Default family relations */}
          {relations.map((relation) => (
            <div key={relation} className="p-4 border border-border rounded-lg space-y-3">
              <Label className="font-semibold">{relation}</Label>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
                <div>
                  <Label className="text-xs text-muted-foreground">{t('family.alive')}</Label>
                  <RadioGroup className="flex gap-4 mt-1">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id={`${relation}-yes`} />
                      <Label htmlFor={`${relation}-yes`} className="font-normal text-sm">Y</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id={`${relation}-no`} />
                      <Label htmlFor={`${relation}-no`} className="font-normal text-sm">N</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">{t('family.age')}</Label>
                  <Input type="number" className="mt-1" />
                </div>
                <div className="md:col-span-2">
                  <Label className="text-xs text-muted-foreground">{t('family.problems')}</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {healthProblems.map((problem) => (
                      <div key={problem} className="flex items-center space-x-1">
                        <Checkbox id={`${relation}-${problem}`} />
                        <label
                          htmlFor={`${relation}-${problem}`}
                          className="text-xs font-normal capitalize"
                        >
                          {t(`family.${problem}`)}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Additional family members */}
          {familyMembers.map((member) => (
            <div key={member.id} className="p-4 border border-border rounded-lg space-y-3">
              <div className="flex justify-between items-center">
                <Label className="font-semibold">Family Member</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFamilyMember(member.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <Input placeholder={t('family.relation')} />
                <RadioGroup className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id={`member-${member.id}-yes`} />
                    <Label htmlFor={`member-${member.id}-yes`} className="font-normal text-sm">Y</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id={`member-${member.id}-no`} />
                    <Label htmlFor={`member-${member.id}-no`} className="font-normal text-sm">N</Label>
                  </div>
                </RadioGroup>
                <Input placeholder={t('family.age')} type="number" />
                <Input placeholder={t('family.problems')} />
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
            {t('family.addMember')}
          </Button>
        </CardContent>
      </Card>

      {/* Dental History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">{t('dental.title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: 'regularCheckup', label: t('dental.regularCheckup') },
            { key: 'gumsBleed', label: t('dental.gumsBleed') },
            { key: 'periodontal', label: t('dental.periodontal') },
            { key: 'grindTeeth', label: t('dental.grindTeeth') },
            { key: 'wornBraces', label: t('dental.wornBraces') },
            { key: 'mouthPain', label: t('dental.mouthPain') }
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <Label>{t('dental.brushFrequency')}</Label>
              <Input type="number" min="0" max="10" />
            </div>
            <div>
              <Label>{t('dental.lastCleaning')}</Label>
              <Input type="date" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sexual History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">{t('sexual.title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: 'useCondoms', label: t('sexual.useCondoms') },
            { key: 'sexuallyActive', label: t('sexual.sexuallyActive') },
            { key: 'screenedSTI', label: t('sexual.screenedSTI') }
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>{t('sexual.partners')}</Label>
              <Input type="number" />
            </div>
            <div>
              <Label>{t('sexual.currentPartner')}</Label>
              <RadioGroup className="flex gap-2 mt-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="partner-male" />
                  <Label htmlFor="partner-male" className="font-normal text-sm">{t('sexual.maleOnly')}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="partner-female" />
                  <Label htmlFor="partner-female" className="font-normal text-sm">{t('sexual.femaleOnly')}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="both" id="partner-both" />
                  <Label htmlFor="partner-both" className="font-normal text-sm">{t('sexual.both')}</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <div className="pt-2">
            <Label className="text-sm font-semibold">{t('sexual.interestedScreening')}</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
              {['gonorrhea', 'chlamydia', 'herpes', 'genitalWarts', 'hiv', 'hepBC'].map((sti) => (
                <div key={sti} className="flex items-center space-x-2">
                  <Checkbox id={sti} />
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

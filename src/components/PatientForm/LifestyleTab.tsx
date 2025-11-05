import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export const LifestyleTab = ({ formData, updateFormData }: any) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      {/* Social History - Caffeine */}
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">{t('social.caffeine')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup
            value={formData.caffeine || ''}
            onValueChange={(value) => updateFormData({ caffeine: value })}
            className="flex flex-wrap gap-4"
          >
            {['none', 'occasionally', 'moderate', 'heavy'].map((level) => (
              <div key={level} className="flex items-center space-x-2">
                <RadioGroupItem value={level} id={`caffeine-${level}`} />
                <Label htmlFor={`caffeine-${level}`} className="font-normal capitalize">
                  {t(`social.${level}`)}
                </Label>
              </div>
            ))}
          </RadioGroup>
          <div>
            <Label>{t('social.cupsPerDay')}</Label>
            <Input type="number" min="0" />
          </div>
        </CardContent>
      </Card>

      {/* Social History - Alcohol */}
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">{t('social.alcohol')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-base">{t('social.drinkAlcohol')}</Label>
            <RadioGroup className="flex flex-wrap gap-4 mt-2">
              {['never', 'occasionally', 'lessThan3', 'moreThan3'].map((freq) => (
                <div key={freq} className="flex items-center space-x-2">
                  <RadioGroupItem value={freq} id={`alcohol-${freq}`} />
                  <Label htmlFor={`alcohol-${freq}`} className="font-normal text-sm">
                    {t(`social.${freq}`)}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div>
            <Label>{t('social.drinksPerWeek')}</Label>
            <div className="grid grid-cols-3 gap-3 mt-2">
              <Input placeholder={t('social.beer')} type="number" />
              <Input placeholder={t('social.wine')} type="number" />
              <Input placeholder={t('social.hardLiquor')} type="number" />
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {[
              { key: 'cutDown', label: t('social.cutDown') },
              { key: 'annoyed', label: t('social.annoyed') },
              { key: 'guilty', label: t('social.guilty') },
              { key: 'morning', label: t('social.morning') }
            ].map(({ key, label }) => (
              <div key={key}>
                <Label className="text-sm">{label}</Label>
                <RadioGroup className="flex gap-4 mt-1">
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
          </div>
        </CardContent>
      </Card>

      {/* Social History - Tobacco */}
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">{t('social.tobacco')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-base">{t('social.useTobacco')}</Label>
            <RadioGroup className="flex gap-4 mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="tobacco-yes" />
                <Label htmlFor="tobacco-yes" className="font-normal">{t('insurance.yes')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="tobacco-no" />
                <Label htmlFor="tobacco-no" className="font-normal">{t('insurance.no')}</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>{t('social.howOld')}</Label>
              <Input type="number" />
            </div>
            <div>
              <Label>{t('social.years')}</Label>
              <Input type="number" />
            </div>
          </div>

          <div>
            <Label className="text-sm font-semibold">Type:</Label>
            <div className="grid grid-cols-3 gap-3 mt-2">
              <Input placeholder={t('social.cigarettes')} />
              <Input placeholder={t('social.cigars')} />
              <Input placeholder={t('social.chew')} />
            </div>
          </div>

          <div>
            <Label className="text-base">{t('social.quitTobacco')}</Label>
            <RadioGroup className="flex gap-4 mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="quit-yes" />
                <Label htmlFor="quit-yes" className="font-normal">{t('insurance.yes')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="quit-no" />
                <Label htmlFor="quit-no" className="font-normal">{t('insurance.no')}</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label>{t('social.yearsAgoQuit')}</Label>
            <Input type="number" />
          </div>
        </CardContent>
      </Card>

      {/* Social History - Drugs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">{t('social.drugs')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-base">{t('social.useRecreational')}</Label>
            <RadioGroup className="flex gap-4 mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="drugs-yes" />
                <Label htmlFor="drugs-yes" className="font-normal">{t('insurance.yes')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="drugs-no" />
                <Label htmlFor="drugs-no" className="font-normal">{t('insurance.no')}</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label>{t('social.listDrugs')}</Label>
            <Textarea rows={3} />
          </div>
        </CardContent>
      </Card>

      {/* Nutrition History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">{t('nutrition.title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>{t('nutrition.saltIntake')}</Label>
              <RadioGroup className="flex gap-4 mt-2">
                {['low', 'medium', 'high'].map((level) => (
                  <div key={level} className="flex items-center space-x-2">
                    <RadioGroupItem value={level} id={`salt-${level}`} />
                    <Label htmlFor={`salt-${level}`} className="font-normal capitalize">
                      {t(`nutrition.${level}`)}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            <div>
              <Label>{t('nutrition.sugarIntake')}</Label>
              <RadioGroup className="flex gap-4 mt-2">
                {['low', 'medium', 'high'].map((level) => (
                  <div key={level} className="flex items-center space-x-2">
                    <RadioGroupItem value={level} id={`sugar-${level}`} />
                    <Label htmlFor={`sugar-${level}`} className="font-normal capitalize">
                      {t(`nutrition.${level}`)}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>{t('nutrition.fruitVeg')}</Label>
              <Input type="number" min="0" />
            </div>
            <div>
              <Label>{t('nutrition.carbIntake')}</Label>
              <Input type="number" min="0" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>{t('nutrition.mealsPerDay')}</Label>
              <Input type="number" min="0" />
            </div>
            <div>
              <Label>{t('nutrition.waterPerDay')}</Label>
              <Input placeholder="e.g., 8 glasses" />
            </div>
          </div>

          <div>
            <Label>{t('nutrition.fluids')}</Label>
            <Input placeholder="Coffee, tea, soda consumption" />
          </div>

          <div>
            <Label>{t('nutrition.intolerances')}</Label>
            <Textarea rows={2} />
          </div>

          <div>
            <Label>{t('nutrition.additionalInfo')}</Label>
            <Textarea rows={4} />
          </div>
        </CardContent>
      </Card>

      {/* Signature Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">{t('insurance.affirmation')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>{t('insurance.printName')}</Label>
              <Input required />
            </div>
            <div>
              <Label>{t('insurance.date')}</Label>
              <Input type="date" required />
            </div>
          </div>
          <div>
            <Label>{t('insurance.signature')}</Label>
            <div className="border border-border rounded-md p-4 bg-secondary/20 text-center text-sm text-muted-foreground">
              Digital signature area
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

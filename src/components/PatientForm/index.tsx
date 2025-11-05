import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Header } from './Header';
import { BasicInfoTab } from './BasicInfoTab';
import { HealthHistoryTab } from './HealthHistoryTab';
import { MedicalHistoryTab } from './MedicalHistoryTab';
import { FamilyHistoryTab } from './FamilyHistoryTab';
import { LifestyleTab } from './LifestyleTab';
import { toast } from 'sonner';

export const PatientForm = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({});
  const [activeTab, setActiveTab] = useState('basic');

  const updateFormData = (newData: any) => {
    setFormData({ ...formData, ...newData });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    toast.success('Application submitted successfully!', {
      description: 'Check console for form data.'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <form onSubmit={handleSubmit}>
          <Card className="shadow-lg">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto">
                <TabsTrigger value="basic" className="text-xs md:text-sm py-2">
                  {t('tabs.basic')}
                </TabsTrigger>
                <TabsTrigger value="health" className="text-xs md:text-sm py-2">
                  {t('tabs.health')}
                </TabsTrigger>
                <TabsTrigger value="medical" className="text-xs md:text-sm py-2">
                  {t('tabs.medical')}
                </TabsTrigger>
                <TabsTrigger value="family" className="text-xs md:text-sm py-2">
                  {t('tabs.family')}
                </TabsTrigger>
                <TabsTrigger value="lifestyle" className="text-xs md:text-sm py-2">
                  {t('tabs.lifestyle')}
                </TabsTrigger>
              </TabsList>

              <div className="p-6">
                <TabsContent value="basic">
                  <BasicInfoTab formData={formData} updateFormData={updateFormData} />
                </TabsContent>

                <TabsContent value="health">
                  <HealthHistoryTab formData={formData} updateFormData={updateFormData} />
                </TabsContent>

                <TabsContent value="medical">
                  <MedicalHistoryTab formData={formData} updateFormData={updateFormData} />
                </TabsContent>

                <TabsContent value="family">
                  <FamilyHistoryTab formData={formData} updateFormData={updateFormData} />
                </TabsContent>

                <TabsContent value="lifestyle">
                  <LifestyleTab formData={formData} updateFormData={updateFormData} />
                </TabsContent>
              </div>
            </Tabs>
          </Card>

          <div className="flex justify-between mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                const tabs = ['basic', 'health', 'medical', 'family', 'lifestyle'];
                const currentIndex = tabs.indexOf(activeTab);
                if (currentIndex > 0) {
                  setActiveTab(tabs[currentIndex - 1]);
                }
              }}
              disabled={activeTab === 'basic'}
            >
              {t('buttons.previous')}
            </Button>

            {activeTab === 'lifestyle' ? (
              <Button type="submit" className="bg-primary">
                {t('buttons.submit')}
              </Button>
            ) : (
              <Button
                type="button"
                onClick={() => {
                  const tabs = ['basic', 'health', 'medical', 'family', 'lifestyle'];
                  const currentIndex = tabs.indexOf(activeTab);
                  if (currentIndex < tabs.length - 1) {
                    setActiveTab(tabs[currentIndex + 1]);
                  }
                }}
              >
                {t('buttons.next')}
              </Button>
            )}
          </div>
        </form>
      </main>
    </div>
  );
};

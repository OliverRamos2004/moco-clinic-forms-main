import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';

export const Header = () => {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'es' : 'en');
  };

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          
          <div className="flex items-center gap-4">
            <img
              src="/MCFreeClinic_Logo_1x (2).png"
              alt="Montgomery County Free Clinic Logo"
              className="h-12 w-auto"
            />

            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {t('header.title')}
              </h1>
              <p className="text-sm text-muted-foreground">
                {t('header.subtitle')}
              </p>
            </div>
          </div>

          <Button
            onClick={toggleLanguage}
            variant="outline"
            size="sm"
            className="font-medium"
          >
            {t('header.language')}
          </Button>
        </div>
      </div>
    </header>
  );
};

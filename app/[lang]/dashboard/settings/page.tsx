"use client";
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { Box, Paper, List, ListItem, ListItemText, IconButton, Divider, Switch } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { getDictionary } from "@/lib/dictionary";
import { usePathname } from "next/navigation";
import { Locale } from "@/i18n.config";

// ⬇️ Importaciones dinámicas para evitar errores de SSR
const TitleHandler = dynamic(() => import('@/components/TitleHandler'), { ssr: false });
const Loading = dynamic(() => import('@/components/loading/LoadingBlack'), { ssr: false });

const Settings: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const lang: Locale = (pathname?.split("/")[1] as Locale) || "en";
  const [loading, setLoading] = useState(true);
  const [dictionary, setDictionary] = useState<any>(null);

  useEffect(() => {
    const loadDictionary = async () => {
      try {
        setLoading(true);
        const dict = await getDictionary(lang);
        setDictionary(dict.pages.settings);
      } catch (error) {
        console.error("Error loading dictionary:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDictionary();
  }, [lang]);

  const handleNavigation = (option: string) => {
    const routeMap: { [key: string]: string } = {
      [dictionary.admin.title]: 'settings/admin-account',
      // [dictionary.users.title]: 'settings/user-accounts', // Si decides usarlo en el futuro
      [dictionary.setup.title]: 'settings/setup-company-information',
      [dictionary.report.title]: 'settings/report-parameters',
      [dictionary.change.title]: 'settings/change-language',
      [dictionary.plan.title]: 'settings/upgrade-plan',
      [dictionary.tutorials.title]: 'settings/tutorials',
      [dictionary.glossary.title]: 'settings/glossary',
      [dictionary.faqs.title]: 'settings/faqs',
    };
  
    const route = routeMap[option];
    if (route) {
      router.push(route);
    }
  };
  

  const handleSwitchChange = () => {
    handleNavigation(dictionary.plan.title);
  };

  if (loading || !dictionary) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <Loading />
      </div>
    );
  }

  const options = [
    dictionary.admin.title,
    // dictionary.users.title, // Si decides usarlo en el futuro
    dictionary.setup.title,
    dictionary.report.title,
    dictionary.change.title,
    dictionary.plan.title,
  ];
  
  const supportOptions = [
    dictionary.tutorials.title,
    dictionary.glossary.title,
    dictionary.faqs.title,
  ];

  return (
    <div className='p-6 lg:ml-[205px] ml-0'>
       <TitleHandler title={dictionary.title} text={dictionary.subtitle} />
      <div className='w-full mt-8'>
        {/* Contenedor General */}
        <div className='rounded-[8px] shadow-custom lg:p-6 p-3 mb-10'>
          <h2 className='text-2xl font-bold text-neutral-800'>
            {dictionary.general}
          </h2>
          <p className='text-neutral-400 text-sm'>
            {dictionary.manage}
          </p>
          <List>
            {options.map((option, index) => (
              <React.Fragment key={index}>
                <ListItem sx={{ py: 1, pr: 2 }}>
                  <ListItemText primary={option} primaryTypographyProps={{ className: 'text-xl font-bold text-neutral-800 font-sans' }} />
                  {option === dictionary.plan.title ? (
                    <Switch edge="end" onChange={handleSwitchChange} />
                  ) : (
                    <IconButton edge="end" onClick={() => handleNavigation(option)}>
                      <ArrowForwardIosIcon />
                    </IconButton>
                  )}
                </ListItem>
                {index < options.length - 1 && (
                  <Divider sx={{ my: 1 }} />
                )}
              </React.Fragment>
            ))}
          </List>
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: '100%',
              textAlign: 'right',
              p: 2,
            }}
          >
            <Box
              sx={{
                width: 0,
                height: 0,
                borderLeft: '20px solid transparent',
                borderRight: '20px solid transparent',
                borderTop: '20px solid #fff',
                position: 'absolute',
                bottom: 0,
                right: 0,
              }}
            />
          </Box>
        </div>

        {/* Contenedor Support */}
        <div className='rounded-[8px] shadow-custom lg:p-6 p-3 mt-8'>
          <h2 className='text-2xl font-bold text-neutral-800'>
            {dictionary.support}
          </h2>
          <p className='text-neutral-400 text-sm'>
            {dictionary.extra}
          </p>
          <List>
            {supportOptions.map((option, index) => (
              <React.Fragment key={index}>
                <ListItem sx={{ py: 1, pr: 2 }}>
                  <ListItemText primary={option} primaryTypographyProps={{ className:'text-xl font-bold text-neutral-800 font-sans' }} />
                  {option !== dictionary.faqs.title ? (
                    <IconButton edge="end" onClick={() => handleNavigation(option)}>
                      <ArrowForwardIosIcon />
                    </IconButton>
                  ) : (
                    <IconButton edge="end" onClick={() => handleNavigation(option)}>
                      <ArrowForwardIosIcon />
                    </IconButton>
                  )}
                </ListItem>
                {index < supportOptions.length - 1 && (
                  <Divider sx={{ my: 1 }} />
                )}
              </React.Fragment>
            ))}
          </List>
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: '100%',
              textAlign: 'right',
              p: 2,
            }}
          >
            <Box
              sx={{
                width: 0,
                height: 0,
                borderLeft: '20px solid transparent',
                borderRight: '20px solid transparent',
                borderTop: '20px solid #fff',
                position: 'absolute',
                bottom: 0,
                right: 0,
              }}
            />
          </Box>
        </div>
      </div>
    </div>
  );
};

export default Settings;

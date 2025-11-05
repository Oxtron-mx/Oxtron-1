"use client";
import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Box, List, ListItem, ListItemText, IconButton, Divider, Switch } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { ArrowLeft } from 'lucide-react';
import { getDictionary } from "@/lib/dictionary";
import { Locale } from "@/i18n.config";

// ⬇️ Importaciones dinámicas para evitar errores de SSR
import dynamic from 'next/dynamic';

const TitleHandler = dynamic(() => import('@/components/TitleHandler'), { ssr: false });
const Loading = dynamic(() => import('@/components/loading/LoadingBlack'), { ssr: false });
const TutorialModal = dynamic(() => import('@/components/tutorials/Modal'), { ssr: false });

const Tutorials: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const lang: Locale = (pathname?.split("/")[1] as Locale) || "en";
  const [loading, setLoading] = useState(true);
  const [dictionary, setDictionary] = useState<any>(null);
  const [openModal, setOpenModal] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: '',
    sections: [] as Array<{ title?: string; text: string; route: string; buttonText?: string }>,
  });
  
  type ContentMapKey = 
  | typeof dictionary.written.title
  | typeof dictionary.features.title
  | typeof dictionary.faqs.title
  | typeof dictionary.resources.title
  | typeof dictionary.contact.title;

 const handleOpenModal = (option: ContentMapKey) => {
  const contentMap: Record<ContentMapKey, { title: string; sections: Array<{ title?: string; text: string; route: string; buttonText?: string }> }> = {
    [dictionary.written.title]: {
      title: dictionary.written.title,
      sections: [
        
          {
            title: dictionary.written.step,
            text: dictionary.written.detailed,
            route: '/pdf/HowToInputAndTrackEmissionsData.pdf',
            buttonText: dictionary.written.button1
          },
          {
            title: dictionary.written.input,
            text: dictionary.written.learn,
            route: '/pdf/HowToInputAndTrackEmissionsData.pdf',
            buttonText: dictionary.written.button2
          }
        ]
      },
      [dictionary.features.title]: {
        title: dictionary.features.title,
        sections: [
          {
            title: dictionary.features.metrics,
            text: dictionary.features.discover,
            route: '/pdf/HowToInputAndTrackEmissionsData.pdf',
            buttonText: dictionary.features.button1
          },
          {
            title: dictionary.features.other,
            text: dictionary.features.find,
            route: '/pdf/HowToInputAndTrackEmissionsData.pdf',
            buttonText: dictionary.features.button2
          }
        ]
      },
      [dictionary.faqs.title]: {
        title: dictionary.faqs.title,
        sections: [
          {
            title: dictionary.faqs.common,
            text: dictionary.faqs.list,
            route: 'faqs',
            buttonText: dictionary.faqs.button
          }
        ]
      },
      [dictionary.resources.title]: {
        title: dictionary.resources.title,
        sections: [
          {
            title: dictionary.resources.user,
            text: dictionary.resources.manual,
            route: '/pdf/SettingUpYourAccount.pdf',
            buttonText: dictionary.resources.button1
          },
          {
            title: dictionary.resources.forum,
            text: dictionary.resources.join,
            route: 'tutorials/community-forum',
            buttonText: dictionary.resources.button2
          }
        ],
      },
      [dictionary.contact.title]: {
        title: dictionary.contact.title,
        sections: [
          {
            title: dictionary.contact.help,
            text: dictionary.contact.mail,
            route: '', 
            buttonText: '' 
          }
        ]
      }
    };

    const content = contentMap[option];
    if (content) {
      setModalContent(content);
      setOpenModal(true);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleReadGuide = (route: string) => {
    if (route) {
      router.push(route);
    }
  };

  useEffect(() => {
    const loadDictionary = async () => {
      try {
        setLoading(true);
        const dict = await getDictionary(lang);
        setDictionary(dict.pages.settings.tutorials);
      } catch (error) {
        console.error("Error loading dictionary:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDictionary();
  }, [lang]);

  if (loading || !dictionary) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <Loading />
      </div>
    );
  }

  const options = [dictionary.written.title, dictionary.features.title, dictionary.faqs.title, dictionary.resources.title, dictionary.contact.title];

  return (
    <div className='p-6 ml-0 mt-6 lg:ml-[205px]'>
      <div className='flex items-center mb-4 gap-2'>
        <button onClick={() => router.back()} className='flex items-center gap-2 text-blue-600 hover:text-blue-800'>
          <ArrowLeft className='w-6 h-6' /> 
        </button>
        <TitleHandler title={dictionary.title} text={dictionary.master} />
      </div>
      <Box sx={{ width: '100%', p: 2 }}>
        <div className='rounded-2xl shadow-xl lg:p-6 p-3 mt-25'>
          <h2 className='text-2xl font-bold text-neutral-800'>
            {dictionary.getting}
          </h2>
          <p className='text-neutral-400 text-xs'>
            {dictionary.welcome}
          </p>
          <List>
            {options.map((option, index) => (
              <React.Fragment key={index}>
                <ListItem sx={{ py: 1, pr: 2 }}>
                  <ListItemText primary={option} primaryTypographyProps={{ className: 'text-xl font-bold text-neutral-800 font-sans' }} />
                  {option === 'Upgrade Plan' ? (
                    <Switch edge="end" />
                  ) : (
                    <IconButton edge="end" onClick={() => handleOpenModal(option)}>
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
        </div>
      </Box>

      <TutorialModal
        open={openModal}
        onClose={handleCloseModal}
        modalContent={modalContent}
        handleReadGuide={handleReadGuide}
      />
    </div>
  );
};

export default Tutorials;

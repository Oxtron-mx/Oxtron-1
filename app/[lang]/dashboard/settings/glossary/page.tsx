"use client"
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Box, List, ListItem, ListItemText, IconButton, Divider } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { ArrowLeft } from 'lucide-react';
import { getDictionary } from "@/lib/dictionary";
import { usePathname } from "next/navigation";
import { Locale } from "@/i18n.config";

// ⬇️ Importaciones dinámicas para evitar errores en SSR
import dynamic from 'next/dynamic';

const TitleHandler = dynamic(() => import('@/components/TitleHandler'), { ssr: false });
const ModalComponent = dynamic(() => import('@/components/glossary/Modal'), { ssr: false });
const Loading = dynamic(() => import('@/components/loading/LoadingBlack'), { ssr: false });


const options = ['1', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

const Glossary: React.FC = () => {
  const router = useRouter(); 
  const [openModal, setOpenModal] = useState(false);
  const pathname = usePathname();
  const lang: Locale = (pathname?.split("/")[1] as Locale) || "en";
  const [loading, setLoading] = useState(true);
  const [dictionary, setDictionary] = useState<any>(null);

  const handleNavigation = (option: string) => {
    const routeMap: { [key: string]: string } = {
      'A': 'glossary/a', 
      'B': 'glossary/b', 
      'C': 'glossary/c', 
      'D': 'glossary/d', 
      'E': 'glossary/e', 
      'F': 'glossary/f', 
      'G': 'glossary/g', 
      'I': 'glossary/i', 
      'L': 'glossary/l', 
      'N': 'glossary/n', 
      'P': 'glossary/p', 
      'R': 'glossary/r', 
      'S': 'glossary/s', 
      'V': 'glossary/v', 
      'T': 'glossary/t', 
      'U': 'glossary/u', 
    };

    const route = routeMap[option];
    if (route) {
      router.push(route);
    } else {
      setOpenModal(true);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  useEffect(() => {
    const loadDictionary = async () => {
      try {
        setLoading(true);
        const dict = await getDictionary(lang);
        setDictionary(dict.pages.settings.glossary);
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

  return (
    <div className='lg:ml-[205px] ml-0 p-6 md:ml-[205px]'>
      <div className='flex items-center mb-4 gap-2'>
        <button onClick={() => router.back()} className='flex items-center gap-2 text-blue-600 hover:text-blue-800'>
          <ArrowLeft className='w-6 h-6' /> 
        </button>
        <TitleHandler title={dictionary.title} text={dictionary.subtitle} />
      </div>
      <Box sx={{ width: '100%'}}>
        <div className='rounded-2xl shadow-xl md:p-6 p-3 mt-25'>
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
                  <ListItemText primary={option} primaryTypographyProps={{ className:'text-xl font-bold text-neutral-800 font-sans' }} />
                  <IconButton edge="end" onClick={() => handleNavigation(option)}>
                    <ArrowForwardIosIcon />
                  </IconButton>
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
      </Box>
      <ModalComponent
        open={openModal}
        onClose={handleCloseModal}
        message={dictionary.lost}
      />
    </div>
  );
};

export default Glossary;

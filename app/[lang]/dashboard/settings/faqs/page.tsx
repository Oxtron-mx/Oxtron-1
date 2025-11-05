"use client";

import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Box, Paper, List, ListItem, ListItemText, IconButton, Divider, TextField, InputAdornment, Collapse } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { ArrowLeft } from "lucide-react";
import { getDictionary } from "@/lib/dictionary";
import { Locale } from "@/i18n.config";

// ⬇️ Importaciones dinámicas para evitar errores de SSR (document is not defined)
const TitleHandler = dynamic(() => import("@/components/TitleHandler"), { ssr: false });
const Loading = dynamic(() => import("@/components/loading/LoadingBlack"), { ssr: false });


const Faqs: React.FC = () => {
  const router = useRouter();
  const [expanded, setExpanded] = useState<string | null>(null);
  const pathname = usePathname();
  const lang: Locale = (pathname?.split("/")[1] as Locale) || "en";
  const [loading, setLoading] = useState(true);
  const [dictionary, setDictionary] = useState<any>(null);

  const handleNavigation = (option: string) => {
    const routeMap: { [key: string]: string } = {
      'Admin Account': 'settings/admin-account',
      'User Accounts': 'settings/user-accounts',
      'Set Up Company Information': 'settings/setup-company-information',
      'Report Parameters': 'settings/report-parameters',
      'Change Language': 'settings/change-language',
      'Upgrade Plan': 'settings/upgrade-plan',
      'Tutorials': 'settings/tutorials',
      'Glossary': 'settings/glossary',
    };

    const route = routeMap[option];
    if (route) {
      router.push(route);
    }
  };

  const handleExpand = (option: string) => {
    setExpanded(expanded === option ? null : option);
  };

  useEffect(() => {
    const loadDictionary = async () => {
      try {
        setLoading(true);
        const dict = await getDictionary(lang);
        setDictionary(dict.pages.settings.faqs);
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

  const options = [
    dictionary.question1,
    dictionary.question2,
    dictionary.set,
    dictionary.question3,
    dictionary.question4,
    dictionary.tech,
    dictionary.question5,
    dictionary.question6,
    dictionary.bill,
    dictionary.question7,
    dictionary.question8,
    dictionary.security,
    dictionary.question9,
    dictionary.question10,
    dictionary.find,
    'Contact us info@oxtron.mx',
  ];
  
  const noArrowOptions = [dictionary.set, dictionary.tech, dictionary.bill, dictionary.security, dictionary.find, 'Contact us info@oxtron.mx'];

  return (
    <div className='mt-6 md:ml-[205px] p-6 lg:ml-[205px] ml-0'>

    <div className='flex items-center mb-4 gap-2'>
        <button onClick={() => router.back()} className='flex items-center gap-2 text-blue-600 hover:text-blue-800'>
          <ArrowLeft className='w-6 h-6' /> 
        </button>
        <TitleHandler title={dictionary.title} text={dictionary.subtitle} />
      </div>
      

      <Box sx={{ width: '100%', p: 2 }}>
        {/* Contenedor General */}
        <div className='rounded-2xl shadow-xl md:p-6 p-3 mt-25'>
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', md: 'row' }, 
              alignItems: 'center', 
              justifyContent: { md: 'space-between' }, 
              mb: 2 
            }}
          >
            <h2 className='text-2xl font-bold text-neutral-800'>
              {dictionary.general}
            </h2>
          </Box>
          <p className='text-neutral-400 text-sm'>
            {dictionary.welcome}
          </p>
          <List>
            {options.map((option, index) => (
              <React.Fragment key={index}>
                <ListItem
                  sx={{
                    py: 1,
                    pr: 2,
                    mt: noArrowOptions.includes(option) ? 6 : 0
                  }}
                >
                  <ListItemText
                    primary={
                      option === 'Contact us info@oxtron.mx' ? (
                        <a href="mailto:soporte@oxtron.mx" className="no-underline">
                          <React.Fragment>
                            <h2 className='text-lg font-bold text-neutral-800 cursor-pointer'>
                              {dictionary.contact}
                            </h2>
                            <p className='text-neutral-400 text-sm cursor-pointer'>
                              {dictionary.email}
                            </p>
                          </React.Fragment>
                        </a>
                      ) : (
                        option
                      )
                    }
                    primaryTypographyProps={{ 
                      className: `text-xl font-bold text-neutral-800 font-sans ${noArrowOptions.includes(option) ? 'text-2xl' : 'text-xl'}`,
                      style: { fontSize: noArrowOptions.includes(option) ? '1.25rem' : '1rem' }
                    }}
                  />
                  {option 
                  !== dictionary.question10 
                  && option !== 'Contact us info@oxtron.mx' 
                  && option !== dictionary.question1
                  && option !== dictionary.question2
                  && option !== dictionary.question3 
                  && option !== dictionary.question4 
                  && option !== dictionary.question5 
                  && option !== dictionary.question6
                  && option !== dictionary.question7
                  && option !== dictionary.question8 
                  && option !== dictionary.question9
                  && !noArrowOptions.includes(option) && (
                    <IconButton edge="end" onClick={() => handleNavigation(option)}>
                      <ArrowForwardIosIcon />
                    </IconButton>
                  )}

                  {option === dictionary.question10 && (
                    <IconButton edge="end" onClick={() => handleExpand(option)}>
                      {expanded === option ? <ArrowDropDownIcon /> : <ArrowForwardIosIcon />}
                    </IconButton>
                  )}
                  {option === dictionary.question1 && (
                    <IconButton edge="end" onClick={() => handleExpand(option)}>
                      {expanded === option ? <ArrowDropDownIcon /> : <ArrowForwardIosIcon />}
                    </IconButton>
                  )}
                  {option === dictionary.question2 && (
                    <IconButton edge="end" onClick={() => handleExpand(option)}>
                      {expanded === option ? <ArrowDropDownIcon /> : <ArrowForwardIosIcon />}
                    </IconButton>
                  )}
                  {option === dictionary.question3 && (
                    <IconButton edge="end" onClick={() => handleExpand(option)}>
                      {expanded === option ? <ArrowDropDownIcon /> : <ArrowForwardIosIcon />}
                    </IconButton>
                  )}
                  {option === dictionary.question4 && (
                    <IconButton edge="end" onClick={() => handleExpand(option)}>
                      {expanded === option ? <ArrowDropDownIcon /> : <ArrowForwardIosIcon />}
                    </IconButton>
                  )}
                  {option === dictionary.question5 && (
                    <IconButton edge="end" onClick={() => handleExpand(option)}>
                      {expanded === option ? <ArrowDropDownIcon /> : <ArrowForwardIosIcon />}
                    </IconButton>
                  )}
                  {option === dictionary.question6 && (
                    <IconButton edge="end" onClick={() => handleExpand(option)}>
                      {expanded === option ? <ArrowDropDownIcon /> : <ArrowForwardIosIcon />}
                    </IconButton>
                  )}
                  {option === dictionary.question7 && (
                    <IconButton edge="end" onClick={() => handleExpand(option)}>
                      {expanded === option ? <ArrowDropDownIcon /> : <ArrowForwardIosIcon />}
                    </IconButton>
                  )}
                  {option === dictionary.question8 && (
                    <IconButton edge="end" onClick={() => handleExpand(option)}>
                      {expanded === option ? <ArrowDropDownIcon /> : <ArrowForwardIosIcon />}
                    </IconButton>
                  )}
                  {option === dictionary.question9 && (
                    <IconButton edge="end" onClick={() => handleExpand(option)}>
                      {expanded === option ? <ArrowDropDownIcon /> : <ArrowForwardIosIcon />}
                    </IconButton>
                  )}

                </ListItem>

                {option === dictionary.question10 && (
                  <Collapse in={expanded === dictionary.question10}>
                    <Box sx={{ mt: 2, ml: 4 }}>
                    <p className='text-neutral-400 text-sm'>
                      {dictionary.answer10}
                    </p>
                    </Box>
                  </Collapse>
                )}
                {option === dictionary.question1 && (
                  <Collapse in={expanded === dictionary.question1}>
                    <Box sx={{ mt: 2, ml: 4 }}>
                    <p className='text-neutral-400 text-sm'>
                      {dictionary.answer1}
                    </p>
                    </Box>
                  </Collapse>
                )}
                {option === dictionary.question2 && (
                  <Collapse in={expanded === dictionary.question2}>
                    <Box sx={{ mt: 2, ml: 4 }}>
                    <p className='text-neutral-400 text-sm'>
                      {dictionary.answer2}
                    </p>
                    </Box>
                  </Collapse>
                )}
                {option === dictionary.question3 && (
                  <Collapse in={expanded === dictionary.question3}>
                    <Box sx={{ mt: 2, ml: 4 }}>
                    <p className='text-neutral-400 text-sm'>
                      {dictionary.answer3}
                    </p>
                    </Box>
                  </Collapse>
                )}
                {option === dictionary.question4 && (
                  <Collapse in={expanded === dictionary.question4}>
                    <Box sx={{ mt: 2, ml: 4 }}>
                    <p className='text-neutral-400 text-sm'>
                      {dictionary.answer4}
                    </p>
                    </Box>
                  </Collapse>
                )}
                {option === dictionary.question5 && (
                  <Collapse in={expanded === dictionary.question5}>
                    <Box sx={{ mt: 2, ml: 4 }}>
                    <p className='text-neutral-400 text-sm'>
                      {dictionary.answer5}
                    </p>
                    </Box>
                  </Collapse>
                )}
                {option === dictionary.question6 && (
                  <Collapse in={expanded === dictionary.question6}>
                    <Box sx={{ mt: 2, ml: 4 }}>
                    <p className='text-neutral-400 text-sm'>
                      {dictionary.answer6}
                    </p>
                    </Box>
                  </Collapse>
                )}
                {option === dictionary.question7 && (
                  <Collapse in={expanded === dictionary.question7}>
                    <Box sx={{ mt: 2, ml: 4 }}>
                    <p className='text-neutral-400 text-sm'>
                      {dictionary.answer7}
                    </p>
                    </Box>
                  </Collapse>
                )}
                {option === dictionary.question8 && (
                  <Collapse in={expanded === dictionary.question8}>
                    <Box sx={{ mt: 2, ml: 4 }}>
                    <p className='text-neutral-400 text-sm'>
                      {dictionary.answer8}
                    </p>
                    </Box>
                  </Collapse>
                )}
                {option === dictionary.question9 && (
                  <Collapse in={expanded === dictionary.question9}>
                    <Box sx={{ mt: 2, ml: 4 }}>
                    <p className='text-neutral-400 text-sm'>
                      {dictionary.answer9}
                    </p>
                    </Box>
                  </Collapse>
                )}


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
    </div>
  );
};

export default Faqs;

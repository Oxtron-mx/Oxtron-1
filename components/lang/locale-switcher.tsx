'use client';
import {useEffect, useState} from "react";
import {usePathname, useRouter} from 'next/navigation';
import i18next from "i18next";
import { Avatar, FormControl, MenuItem, Select, Stack } from "@mui/material";


export default function LocalSwitcher() {
    const [selectedLanguage, setSelectedLanguage] = useState(i18next.language || 'en');
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const language = pathname.split('/')[1];
        setSelectedLanguage(language);
        try {
            i18next.changeLanguage(selectedLanguage);
        } catch (e) {}
    }, [i18next.language]);

    const handleLanguageChange = (event: any) => {
        const newLanguage = event.target.value;
        const route = pathname.replace(`/${selectedLanguage}`, `/${newLanguage}`);

        setSelectedLanguage(newLanguage);

        try {
            i18next.changeLanguage(newLanguage);
        } catch (e) {
        }

        router.replace(route);
    };

    const options = [
        {
            value:"es",
            image: "/assets/images/mx.png",
        },
        {
            value:"en",
            image: "/assets/images/us.png",
        },
        {
            value:"fr",
            image: "/assets/images/fr.png",
        },
        {
            value:"hi",
            image: "/assets/images/hi.png",
        },
        {
            value:"ja",
            image: "/assets/images/ja.png",
        },
        {
            value:"de",
            image: "/assets/images/de.png",
        }
    ]

    return (
        <FormControl sx={{ minWidth: 64 }}>
            { selectedLanguage &&
                <Select
                disableUnderline
                value={selectedLanguage}
                onChange={handleLanguageChange}
                inputProps={{ "aria-label": "Without label" }}
                variant="standard"
                sx={{
                    color: "black",
                    "& .MuiSvgIcon-root": {
                    color: "inherit",
                    },
                    "& .MuiStack-root > .MuiTypography-root": {
                    display: {
                        xs: "none",
                        sm: "block",
                    },
                    },
                }}
                >
                    {options.map((item, index) => 
                        <MenuItem
                            selected={selectedLanguage === item.value}
                            key={index}
                            value={item.value}
                            >
                            <Stack
                                direction="row"
                                alignItems="center"
                                justifyContent="center"
                            >
                                <Avatar
                                sx={{
                                    width: "28px",
                                    height: "20px",
                                    marginRight: "5px",
                                    marginLeft:"5px",
                                    borderRadius:0
                                }}
                                src={item.image}
                                />
                            </Stack>
                        </MenuItem>
                    )}
                </Select>
            }
        </FormControl>
    );
}

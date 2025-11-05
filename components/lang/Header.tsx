//import Link from 'next/link';
import { Locale } from '@/i18n.config';
import { getDictionary } from '@/lib/dictionary';
import LocalSwitcher from './locale-switcher';

export default async function Header({ lang }: { lang: Locale }) {
    const dictionary = await getDictionary(lang);
    ///const dashboardTitle = dictionary.pages.dashboard.title;

    return (
        <header className='fixed top-7 left-20 lg:left-auto lg:right-[15rem] z-20'>
            <LocalSwitcher />
        </header>
    );
}

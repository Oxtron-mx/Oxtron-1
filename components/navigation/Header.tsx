"use client"

import { fetchHeader } from '@/actions/dashboard';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { HiUser } from 'react-icons/hi2';

interface HeaderProps {
  lang: "en" | "es" | "fr" | "de" | "ja" | "hi";
}

const Header: React.FC<HeaderProps> = ({ lang }) => {
  const [name, setName] = useState<string>('User');

  useEffect(() => {
    const loadData = async () => {
      try {
        const name = await fetchHeader()
        setName(name)
      } catch (error) {
        console.log(error)
      } 
    };
    loadData();
  }, []);

  return (
    <div>
      <div className='flex items-center gap-4'>
        <div className='hidden md:block md:absolute top-7 right-7'>
          <div className='flex items-center gap-4'>
            <Image
              src="/assets/images/notification.png"
              height={750}
              width={750}
              alt="notificacion"
              className="h-8 w-fit"
            />
            <div className='h-8 w-[2px] rounded bg-neutral-300'/>
            <div className='text-neutral-800 max-w-72'>
              { name === 'User' ? 
                <div className='flex gap-2 items-center'>
                  <Image
                    src="/assets/icons/loader.svg"
                    alt="loader"
                    width={24}
                    height={24}
                    className="animate-spin"
                  />
                  <p>Loading...</p>
                </div>
                : 
                <p>{name}</p>
              }
            </div>
            <div className='bg-neutral-800 h-8 w-8 rounded-full flex items-center justify-center'>
              <HiUser />
            </div>
          </div>
        </div>
        <div className='flex items-center gap-4 md:hidden'>
          <Image
            src="/assets/images/notification.png"
            height={750}
            width={750}
            alt="notificacion"
            className="h-8 w-fit"
          />
          <div className='h-8 w-[2px] rounded bg-neutral-300'/>
          <div className='text-neutral-800 max-w-72'>
            { name === 'User' ? 
              <div className='flex gap-2 items-center'>
                <Image
                  src="/assets/icons/loader.svg"
                  alt="loader"
                  width={24}
                  height={24}
                  className="animate-spin"
                />
                <p>Loading...</p>
              </div>
              : 
              <p>{name}</p>
            }
          </div>
          <div className='bg-neutral-800 h-8 w-8 rounded-full flex items-center justify-center'>
            <HiUser />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;

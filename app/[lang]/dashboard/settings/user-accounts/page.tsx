"use client";

import TitleHandler from "@/components/TitleHandler";
import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const User = () => {
  const [isLoading, setisLoading] = useState(false);
  const router = useRouter();

  return (
    <div className="p-6 lg:ml-[205px] ml-0 min-h-screen pb-10 mt-6 flex flex-col md:ml-[205px]">
      <div className="flex items-center mb-4 gap-2">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <TitleHandler
          title="Company Information"
          text="Manage your user and account information"
        />
      </div>

      <div className="flex flex-1 flex-col md:flex-row lg:flex-row gap-10 mt-4 w-full">
        {/* Contenedor 1 */}
        <div className="bg-white shadow-xl w-full md:w-1/2 lg:w-[45%] px-7 py-5 grid rounded-xl">
          <div className="flex flex-col md:flex-row gap-2 md:gap-4 mb-4 md:mb-2 items-center md:items-start">
            <img
              src="/assets/images/user6.png"
              alt="Company Logo"
              className="w-12 h-12 rounded-full"
            />
            <div className="flex flex-col">
              <p className="text-neutral-400 text-xs mb-1">Business Name</p>
              <h2 className="font-bold text-neutral-700 text-h1">Waystar Royco</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4 mb-8 md:mb-4">
            <div className="flex flex-col justify-center">
              <p className="text-neutral-400 text-xs mb-1">Country</p>
              <h2 className="font-bold text-neutral-700 text-h1">México</h2>
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-neutral-400 text-xs mb-1">City</p>
              <h2 className="font-bold text-neutral-700 text-h1">Monterrey</h2>
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-neutral-400 text-xs mb-1">State</p>
              <h2 className="font-bold text-neutral-700 text-h1">Nuevo León</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4 mb-20 md:mb-4">
            <div className="flex flex-col justify-center">
              <p className="text-neutral-400 text-xs mb-1">Subscription</p>
              <h2 className="font-bold text-neutral-700 text-h1">Pro</h2>
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-neutral-400 text-xs mb-1">Member Since</p>
              <h2 className="font-bold text-neutral-700 text-h1">14/8/2023</h2>
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-neutral-400 text-xs mb-1">Postal Code</p>
              <h2 className="font-bold text-neutral-700 text-h1">******</h2>
            </div>
          </div>
        </div>

        {/* Contenedor 2 */}
        <div className="bg-white shadow-xl w-full md:w-1/2 lg:w-[45%] px-7 py-5 grid rounded-xl">
          <div className="flex flex-col md:flex-row gap-4 md:gap-2 mb-2 md:mb-1 items-center md:items-start">
            <img
              src="/assets/images/user7.png"
              alt="Administrator"
              className="w-12 h-12 rounded-full"
            />
            <div className="flex flex-col">
              <p className="text-neutral-400 text-xs mb-1">Administrator Name</p>
              <h2 className="font-bold text-neutral-700 text-h1">Tom Wambsgans</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-4 mb-14 md:mb-4">
            <div className="flex flex-col">
              <p className="text-neutral-400 text-xs mb-1">Email Address</p>
              <h2 className="font-bold text-neutral-700 text-h1">t.wambsgans@waystar.com</h2>
            </div>
            <div className="flex flex-col">
              <p className="text-neutral-400 text-xs mb-1">Role</p>
              <h2 className="font-bold text-neutral-700 text-h1">Sustainability VP</h2>
            </div>
            <div className="flex flex-col md:hidden mb-10">
              <p className="text-neutral-400 text-xs mb-1">Password</p>
              <h2 className="font-bold text-neutral-700 text-h1">*************</h2>
            </div>
          </div>
          <div className="hidden md:flex flex-col mb-10 md:mb-4">
            <p className="text-neutral-400 text-xs mb-1">Password</p>
            <h2 className="font-bold text-neutral-700 text-h1">*************</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default User;

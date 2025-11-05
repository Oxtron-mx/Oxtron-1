import React from 'react';
import Lottie from 'lottie-react';
import animationData from '../../public/assets/lotties/loading.json';

const Loading = () => {
  return (
    <div className="lg:ml-[205px] flex flex-col items-center justify-center h-full">
      <Lottie
        loop
        animationData={animationData}
        className="w-full h-auto max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl"
      />
      <p className="text-xl text-center mt-4">Cargando...</p>
    </div>
  );
};

export default Loading;

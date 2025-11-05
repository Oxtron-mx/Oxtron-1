"use client";

import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { BarChartProps } from '@/constants/types';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

interface Translations {
  greenhouseGasEmissions: string;
  co2: string;
  ch4: string;
  n2o: string;
  biofuelCo2: string;
  gasEmissionsLabel: string;
}

interface BarChartComponentProps extends BarChartProps {
  translations: Translations;
}

const options = {
  responsive: true,
  barPercentage: 0.5,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: (context: any) => {
          let label = context.dataset.label || '';
          if (label) {
            label += ': ';
          }
          if (context.parsed.y !== null) {
            label += context.parsed.y;
          }
          return label;
        },
      }, 
    },
  },
  scales: {
    x: {
      display: false,
      grid: {
        display: false,
      },
    },
    y: {
      display: true,
      grid: {
        display: true,
      },
      border: {
        display: false
      }
    },
  },
  elements: {
    bar: {
      borderRadius: () => {
        return {
          topLeft: 0,
          topRight: 100,
          bottomLeft: 0,
          bottomRight: 0,
        };
      },
      borderSkipped: false,
    },
  },
};

const BarChart: React.FC<BarChartComponentProps> = ({ gasTons, gasPercentage, translations }) => {
  const [unit, setUnit] = useState('T')

  const data = {
    labels: [translations.co2, translations.ch4, translations.n2o, translations.biofuelCo2],
    datasets: [
      {
        label: translations.gasEmissionsLabel,
        data: unit === 'T'
          ? [gasTons?.ggE_CO2_T, gasTons?.ggE_CH4_T, gasTons?.ggE_N20_T, gasTons?.ggE_BCO2_T]
          : [gasPercentage?.ggE_CO2_P, gasPercentage?.ggE_CH4_P, gasPercentage?.ggE_N20_P, gasPercentage?.ggE_BCO2_P],
        backgroundColor: ['#B0D4FF', '#0065FF', '#03133A', '#000A14'],
      },
    ],
  };

  return (
    <div className="mx-auto rounded-[8px] shadow-custom md:p-6 p-4 max-h-[450px] md:max-w-[294px] w-full">
      <div className='mb-2 flex items-start gap-2'>
        <div className='flex flex-col gap-1'>
          <h2 className="text-xl font-bold text-neutral-800">{translations.greenhouseGasEmissions}</h2>
        </div>
        <div className='bg-bgContent flex flex-col rounded-[8px]'>
          <button
            className={`w-8 h-8 ${unit === 'P' && 'border-bgContent'} ${unit === 'T' && 'bg-white border-[1px] rounded-[8px] border-[#0065ff]'}`}
            onClick={() => setUnit('T')}
          >
            <p className={`${unit !== 'P' && 'gradient-unit'} text-white text-lg text-center font-bold`}>T</p>
          </button>
          <button
            className={`w-8 h-8 ${unit === 'T' && 'border-bgContent'} ${unit === 'P' && 'bg-white border-[1px] rounded-[8px] border-[#0065ff]'}`}
            onClick={() => setUnit('P')}
          >
            <p className={`${unit !== 'T' && 'gradient-unit'}  text-white text-lg text-center font-bold`}>%</p>
          </button>
        </div>
      </div>
      <div className='w-full'>
        <Bar data={data} options={options}/>
        <div className='flex flex-col gap-2 px-6 my-7'>
          <div className='flex justify-between items-center text-content font-light'>
            <div className='flex items-center gap-2'>
              <div className='w-5 h-5 bg-[#B0D4FF] rounded-full'/>
              <p>{translations.co2}</p>
            </div>
            <p>{unit === 'T' ? `${gasTons?.ggE_CO2_T || 0} T` : `${gasPercentage?.ggE_CO2_P || 0} %`}</p>
          </div>
          <div className='flex justify-between items-center text-content font-light'>
            <div className='flex items-center gap-2'>
              <div className='w-5 h-5 bg-[#0065FF] rounded-full'/>
              <p>{translations.ch4}</p>
            </div>
            <p>{unit === 'T' ? `${gasTons?.ggE_CH4_T || 0} T` : `${gasPercentage?.ggE_CH4_P || 0} %`}</p>
          </div>
          <div className='flex justify-between items-center text-content font-light'>
            <div className='flex items-center gap-2'>
              <div className='w-5 h-5 bg-[#03133A] rounded-full'/>
              <p>{translations.n2o}</p>
            </div>
            <p>{unit === 'T' ? `${gasTons?.ggE_N20_T || 0} T` : `${gasPercentage?.ggE_N20_P || 0} %`}</p>
          </div>
          <div className='flex justify-between items-center text-content font-light'>
            <div className='flex items-center gap-2'>
              <div className='w-5 h-5 bg-[#000A14] rounded-full'/>
              <p>{translations.biofuelCo2}</p>
            </div>
            <p>{unit === 'T' ? `${gasTons?.ggE_BCO2_T || 0} T` : `${gasPercentage?.ggE_BCO2_P || 0} %`}</p>
          </div>
        </div>
      </div>
    </div>
  )
};

export default BarChart;
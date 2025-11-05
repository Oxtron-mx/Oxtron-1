"use client";

import { CircleChartProps, EmissionPercentageProps, EmissionTonsProps } from '@/constants/types';
import React, { useState } from 'react'
import { Doughnut } from 'react-chartjs-2';

const options2 = {
    responsive: true,
    plugins: {
    legend: {
        display: false,
    },
    tooltip: {
        callbacks: {
        label: (context: any) => {
            let label = context.label || '';
            if (context.parsed !== null) {
            label += ': ' + context.parsed;
            }
            return label;
        },
        },
    },
    datalabels: {
        display: true,
        align: 'center',
        color: 'black',
        font: {
        weight: 'bold',
        size: 16,
        },
        formatter: (value: number, context: any) => {
        const total = context.dataset.data.reduce((acc: number, curr: number) => acc + curr, 0);
        const percentage = ((value / total) * 100).toFixed(2);
        return percentage + '%';
        },
    },
    },
    cutout: '70%',
    borderRadius: 10,
};

const CircleChart: React.FC<CircleChartProps> = ({ EmissionTons, EmissionPercentage, dictionary }) => {
  const [unit, setUnit] = useState('T');
  
  const doughnutData1 = {
    labels: [dictionary.circle1.stationary, dictionary.circle1.mobile, dictionary.circle1.refrigerants, dictionary.circle1.biogenic],
    datasets: [
    {
        label: 'Dataset 1',
        data: unit === 'T'
        ? [
            EmissionTons?.eD_Stationary_T,
            EmissionTons?.eD_Mobile_T,
            EmissionTons?.eD_Refrigerants_T,
            EmissionTons?.eD_Biogenic_T,
          ]
        : [
            EmissionPercentage?.eD_Stationary_P,
            EmissionPercentage?.eD_Mobile_P,
            EmissionPercentage?.eD_Refrigerants_P,
            EmissionPercentage?.eD_Biogenic_P,
          ],
        backgroundColor: ['#97C2F6', '#B0D4FF', '#C6E0FF'],
        borderColor: '#FFFFFF',
        borderWidth: 1,
    },
    ],
  };

  const doughnutData2 = {
      labels: [dictionary.circle2.location, dictionary.circle2.market, dictionary.circle2.heat],
      datasets: [
      {
          label: 'Dataset 2',
          data: unit === 'T'
          ? [
              EmissionTons?.eD_Location_T,
              EmissionTons?.eD_Market_T,
              EmissionTons?.eD_Heat_T
            ]
          : [
              EmissionPercentage?.eD_Location_P,
              EmissionPercentage?.eD_Market_P,
              EmissionPercentage?.eD_Heat_P
          ],
          backgroundColor: ['#0065FF', '#3883F6', '#5595F6'],
          borderColor: '#FFFFFF',
          borderWidth: 1,
      },
      ],
  };

  const doughnutData3 = {
      labels: [dictionary.circle3.transport, dictionary.circle3.bussiness, dictionary.circle3.employee, dictionary.circle3.biogenic],
      datasets: [
      {
          label: 'Dataset 3',
          data: unit === 'T'
          ? [
              EmissionTons?.eD_Transport_T,
              EmissionTons?.eD_Business_T,
              EmissionTons?.eD_Employee_T,
              EmissionTons?.eD_Biogenic2_T
            ]
          : [
              EmissionPercentage?.eD_Transport_P,
              EmissionPercentage?.eD_Business_P,
              EmissionPercentage?.eD_Employee_P,
              EmissionPercentage?.eD_Biogenic2_P
            ],
          backgroundColor: ['#848689', '#03133A', '#4D5360'],
          borderColor: '#FFFFFF',
          borderWidth: 1,
      },
      ],
  };

  const legendData = [
    [
      { color: '#97C2F6', label: dictionary.circle1.stationary, value: unit === 'T' ? EmissionTons?.eD_Stationary_T : EmissionPercentage?.eD_Stationary_P },
      { color: '#B0D4FF', label: dictionary.circle1.mobile, value: unit === 'T' ? EmissionTons?.eD_Mobile_T : EmissionPercentage?.eD_Mobile_P },
      { color: '#C6E0FF', label: dictionary.circle1.refrigerants, value: unit === 'T' ? EmissionTons?.eD_Refrigerants_T : EmissionPercentage?.eD_Refrigerants_P },
      { color: '#B0D4FF80', label: dictionary.circle1.biogenic, value: unit === 'T' ? EmissionTons?.eD_Biogenic_T : EmissionPercentage?.eD_Biogenic_P },
    ],
    [
      { color: '#0065FF', label: dictionary.circle2.location, value: unit === 'T' ? EmissionTons?.eD_Location_T : EmissionPercentage?.eD_Location_P },
      { color: '#3883F6', label: dictionary.circle2.market, value: unit === 'T' ? EmissionTons?.eD_Market_T : EmissionPercentage?.eD_Market_P },
      { color: '#0065FFBF', label: dictionary.circle2.heat, value: unit === 'T' ? EmissionTons?.eD_Heat_T : EmissionPercentage?.eD_Heat_P },
    ],
    [
      { color: '#03133A', label: dictionary.circle3.transport, value: unit === 'T' ? EmissionTons?.eD_Transport_T : EmissionPercentage?.eD_Transport_P },
      { color: '#4D5360', label: dictionary.circle3.bussiness, value: unit === 'T' ? EmissionTons?.eD_Business_T : EmissionPercentage?.eD_Business_P },
      { color: '#848689', label: dictionary.circle3.employee, value: unit === 'T' ? EmissionTons?.eD_Employee_T : EmissionPercentage?.eD_Employee_P },
      { color: '#03133A80', label: dictionary.circle3.biogenic, value: unit === 'T' ? EmissionTons?.eD_Biogenic2_T : EmissionPercentage?.eD_Biogenic2_P },
    ],
  ];

  return (
    <div className="mx-auto rounded-[8px] shadow-custom md:p-6 p-4 md:max-h-[450px] w-full">
      <div className='mb-2 flex items-start justify-between gap-2'>
        <div className='flex flex-col gap-1'>
          <h2 className='text-2xl font-bold text-neutral-800'>{dictionary.title}</h2>
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

      <div className='flex md:gap-2 gap-8 items-center justify-between flex-wrap md:flex-nowrap'>
        {[doughnutData1, doughnutData2, doughnutData3].map((data, index) => {
          return (
            <div className="md:w-[180px] w-full md:h-[150px] h-full flex flex-col items-center relative" key={index}>
              <Doughnut data={data} options={options2} />
              <div className='absolute top-0 md:mt-12 mt-28 right-0 left-0 text-center'>
                <p className='text-content font-light md:text-sm text-3xl'>{dictionary.scope} {index + 1}</p>
                <span className='text-content text-lg font-semibold'>{unit === 'T' ? EmissionTons?.total : EmissionPercentage?.total}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CircleChart;

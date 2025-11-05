"use client";

import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import { ChartOptions } from 'chart.js/auto';
import { getDictionary } from "@/lib/dictionary";
import { usePathname } from "next/navigation";
import { Locale } from "@/i18n.config";
import Loading from '@/components/loading/LoadingBlack';

const CarbonChart = () => {
    const pathname = usePathname();
    const lang: Locale = (pathname?.split("/")[1] as Locale) || "en";
    const [loading, setLoading] = useState(true);
    const [dictionary, setDictionary] = useState<any>(null);

    const mainLineData1 = Array.from({ length: 20 }, () => Math.random() * 50);
    const mainLineData2 = Array.from({ length: 20 }, () => Math.random() * 55);
    const randomPointData: number[] = [15];
    
    useEffect(() => {
        const loadDictionary = async () => {
          try {
            setLoading(true);
            const dict = await getDictionary(lang);
            setDictionary(dict.pages.capture);
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
      
    const data = {
        labels: Array.from({ length: 7 }, (_, i) => i.toString()),
        datasets: [
            {
                label: dictionary.carbon.label1,
                data: mainLineData1,
                borderColor: '#0D2A85',
                backgroundColor: 'rgba(13, 42, 133, 0.2)',
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 6,
                pointBackgroundColor: 'rgba(13, 42, 133, 1)',
            },
            {
                label: dictionary.carbon.label2,
                data: mainLineData2,
                borderColor: '#136AF6',
                backgroundColor: 'transparent',
                fill: false,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 6,
                pointBackgroundColor: '#ffffff',
            },
            {
                label: dictionary.carbon.label3,
                data: randomPointData,
                pointRadius: 7,
                pointHoverRadius: 12,
                borderColor: 'rgba(19, 106, 246, 1)',
                backgroundColor: 'rgba(19, 106, 246, 1)',
                pointBackgroundColor: 'rgba(19, 106, 246, 1)',
                showLine: false,
            },
        ],
    };
    
    const options: ChartOptions<'line'> = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                display: true,
                title: {
                    display: false,
                },
                grid: {
                    display: false,
                },
            },
            y: {
                display: true,
                title: {
                    display: false,
                },
                ticks: {
                    stepSize: 10,
                },
                suggestedMax: 60,
            },
        },
        plugins: {
            tooltip: {
                enabled: true,
            },
            legend: {
                align: 'end',
                labels: {
                    boxHeight: 1,
                    padding: 30,
                    filter: (legendItem) => {
                        return legendItem.text !== dictionary.carbon.label3;
                    },
                },
            },
        },
    };

    return (
        <div className='rounded-[8px] shadow-custom md:p-6 p-3 mt-15'>
            <h2 className='text-2xl font-bold text-neutral-800'>{dictionary.carbon.title}</h2>
            <p className='text-neutral-400 text-sm'>{dictionary.carbon.date}</p>
            <div className="h-[300px]">
                <Line data={data} options={options} />
            </div>
        </div>
    );
};

export default CarbonChart;
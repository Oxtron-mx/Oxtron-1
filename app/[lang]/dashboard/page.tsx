"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { AxiosError } from "axios";
import { ControlData, EmissionPercentageProps, EmissionTonsProps, GasPercentage, GasTons, TableDataProps } from "@/constants/types";
import { fetchDash } from "@/actions/dashboard";
import { getDictionary } from "@/lib/dictionary";
import { Locale } from "@/i18n.config";
import { usePathname } from "next/navigation";

// ⬇️ Importaciones dinámicas para evitar errores de SSR
const BarChart = dynamic(() => import("@/components/charts/barChart"), { ssr: false });
const DataStats = dynamic(() => import("@/components/charts/dataStats"), { ssr: false });
const EqualizerChart = dynamic(() => import("@/components/charts/equalizerChart"), { ssr: false });
const TitleHandler = dynamic(() => import("@/components/TitleHandler"), { ssr: false });
const CircleChart = dynamic(() => import("@/components/charts/circleChart"), { ssr: false });
const EnvironmentalTable = dynamic(() => import("@/components/charts/environmentalTable"), { ssr: false });
const CaptureEmissions = dynamic(() => import("@/components/charts/captureEmissions"), { ssr: false });
const Loading = dynamic(() => import("@/components/loading/LoadingBlack"), { ssr: false });
const ErrorPage = dynamic(() => import("@/components/loading/ErrorPageBlack"), { ssr: false });


const Home = () => {
  const pathname = usePathname();
  const lang: Locale = (pathname?.split("/")[1] as Locale) || "en"; 

  const [dictionary, setDictionary] = useState({
    title: "",
    description: "",
    totalEmissions: "",
    impactEquivalence: "",
    sectorComparison: "",
    progress: "",
    bottles: "",
    equalizerChart: {
      title: "",
      producedLabel: "",
      capturedLabel: ""
    },
    bar:{
      greenhouseGasEmissions: "",
      co2: "",
      ch4: "",
      n2o: "",
      biofuelCo2: "",
      gasEmissionsLabel: ""
    },
    circle: {
      title: "",
      scope: "",
      circle1: {
        stationary: "",
        mobile: "",
        refrigerants: "",
        biogenic: ""
        },
      circle2: {
        location: "",
        market: "",
        heat: ""
        },
      circle3: {
        transport: "",
        bussiness: "",
        employee: "",
        biogenic: ""
      }
    },
    table:{
      title: "",
      facility:"",
      scope1: "",
      scope2: "",
      scope3: "",
      total:"",
      progress:""
    },
    capture:{
      title:"",
      label1:"",
      label2:"",
      contact:""
    }
  });

  const [data, setData] = useState<ControlData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AxiosError | null>(null);
  // Green House Emissions
  const [gasTons, setGasTons] = useState<GasTons | null>(null);
  const [gasPercentage, setGasPercentage] = useState<GasPercentage | null>(null);
  // Emission Distribution
  const [emissionTons, setEmissionTons] = useState<EmissionTonsProps | null>(null);
  const [emissionPercentage, setEmissionPercentage] = useState<EmissionPercentageProps | null>(null);
  // Stats
  const [totalEmissions, setTotalEmissions] = useState<number | null>(null);
  const [impactEquivalence, setImpactEquivalence] = useState<number | null>(null);
  const [sectorComparison, setSectorComparison] = useState<number | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  // Contact
  const [capture, setCapture] = useState<number | null>(null);
  // Table Data
  const [tableData, setTableData] = useState<TableDataProps[]>([]);

  useEffect(() => {
    const loadDictionary = async () => {
      const dict = await getDictionary(lang);
      setDictionary({
        ...dict.pages.dashboard,
        equalizerChart: {
          title: dict.pages.dashboard.equalizer.title,
          producedLabel: dict.pages.dashboard.equalizer.label1,
          capturedLabel: dict.pages.dashboard.equalizer.label2
        },
        bar:{
          greenhouseGasEmissions: dict.pages.dashboard.bar.greenhouseGasEmissions,
          co2: dict.pages.dashboard.bar.co2,
          ch4: dict.pages.dashboard.bar.ch4,
          n2o: dict.pages.dashboard.bar.n2o,
          biofuelCo2: dict.pages.dashboard.bar.biofuelCo2,
          gasEmissionsLabel: dict.pages.dashboard.bar.gasEmissionsLabel,
        },
        circle:{
          title: dict.pages.dashboard.circle.title,
          scope: dict.pages.dashboard.circle.scope,
          circle1:{
            stationary: dict.pages.dashboard.circle.circle1.stationary,
            mobile: dict.pages.dashboard.circle.circle1.mobile,
            refrigerants: dict.pages.dashboard.circle.circle1.refrigerants,
            biogenic: dict.pages.dashboard.circle.circle1.biogenic,
          },
          circle2:{
            location: dict.pages.dashboard.circle.circle2.location,
            market: dict.pages.dashboard.circle.circle2.market,
            heat: dict.pages.dashboard.circle.circle2.heat,
          },
          circle3:{
            transport: dict.pages.dashboard.circle.circle3.transport,
            bussiness: dict.pages.dashboard.circle.circle3.bussiness,
            employee: dict.pages.dashboard.circle.circle3.employee,
            biogenic: dict.pages.dashboard.circle.circle3.biogenic,
          }
        },
        table:{
          title: dict.pages.dashboard.table.title,
          facility: dict.pages.dashboard.table.facility,
          scope1: dict.pages.dashboard.table.scope1,
          scope2: dict.pages.dashboard.table.scope2,
          scope3: dict.pages.dashboard.table.scope3,
          total: dict.pages.dashboard.table.total,
          progress: dict.pages.dashboard.table.progress,
        },
        capture:{
          title: dict.pages.dashboard.capture.title,
          label1: dict.pages.dashboard.capture.label1,
          label2: dict.pages.dashboard.capture.label2,
          contact: dict.pages.dashboard.capture.contact,
        }
      });
    };
    loadDictionary();
  }, [lang]);

   useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetchDash();
        setData(response);
      } catch (error) {
        setError(error as AxiosError);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Historic Emissions
  const cscData = data.map(item => item.csc);
  const producedData = data.map(item => item.produced);
  const capturedData = data.map(item => item.captured);

  // Green House Emissions
  useEffect(() => {
    if (data.length > 0) {
      const firstItem = data[0];

      // Greenhouse Emissions
      const gasTonsData: GasTons = {
        ggE_BCO2_T: firstItem.ggE_BCO2_T ?? 0,
        ggE_CH4_T: firstItem.ggE_CH4_T ?? 0,
        ggE_CO2_T: firstItem.ggE_CO2_T ?? 0,
        ggE_N20_T: firstItem.ggE_N20_T ?? 0,
      };

      const gasPercentageData: GasPercentage = {
        ggE_BCO2_P: firstItem.ggE_BCO2_P ?? 0,
        ggE_CH4_P: firstItem.ggE_CH4_P ?? 0,
        ggE_CO2_P: firstItem.ggE_CO2_P ?? 0,
        ggE_N20_P: firstItem.ggE_N20_P ?? 0,
      };

      setGasTons(gasTonsData);
      setGasPercentage(gasPercentageData);

      // Emission Distribution
      const emissionTonsData: EmissionTonsProps = {
        eD_Scope1_T: firstItem.eD_Scope1_T ?? 0,
        eD_Stationary_T: firstItem.eD_Stationary_T ?? 0,
        eD_Mobile_T: firstItem.eD_Mobile_T ?? 0,
        eD_Refrigerants_T: firstItem.eD_Refrigerants_T ?? 0,
        eD_Biogenic_T: firstItem.eD_Biogenic_T ?? 0,
        eD_Scope2_T: firstItem.eD_Scope2_T ?? 0,
        eD_Location_T: firstItem.eD_Location_T ?? 0,
        eD_Market_T: firstItem.eD_Market_T ?? 0,
        eD_Heat_T: firstItem.eD_Heat_T ?? 0,
        eD_Scope3_T: firstItem.eD_Scope3_T ?? 0,
        eD_Transport_T: firstItem.eD_Transport_T ?? 0,
        eD_Business_T: firstItem.eD_Business_T ?? 0,
        eD_Employee_T: firstItem.eD_Employee_T ?? 0,
        eD_Biogenic2_T: firstItem.eD_Biogenic2_T ?? 0,
        total: ''
      };

      const emissionPercentageData: EmissionPercentageProps = {
        eD_Scope1_P: firstItem.eD_Scope1_P ?? 0,
        eD_Stationary_P: firstItem.eD_Stationary_P ?? 0,
        eD_Mobile_P: firstItem.eD_Mobile_P ?? 0,
        eD_Refrigerants_P: firstItem.eD_Refrigerants_P ?? 0,
        eD_Biogenic_P: firstItem.eD_Biogenic_P ?? 0,
        eD_Scope2_P: firstItem.eD_Scope2_P ?? 0,
        eD_Location_P: firstItem.eD_Location_P ?? 0,
        eD_Market_P: firstItem.eD_Market_P ?? 0,
        eD_Heat_P: firstItem.eD_Heat_P ?? 0,
        eD_Scope3_P: firstItem.eD_Scope3_P ?? 0,
        eD_Transport_P: firstItem.eD_Transport_P ?? 0,
        eD_Business_P: firstItem.eD_Business_P ?? 0,
        eD_Employee_P: firstItem.eD_Employee_P ?? 0,
        eD_Biogenic2_P: firstItem.eD_Biogenic2_P ?? 0,
        total: ''
      };

      setEmissionTons(emissionTonsData);
      setEmissionPercentage(emissionPercentageData);

      // Stats
      setTotalEmissions(firstItem.eipF_TotalCO2e ?? 0);
      setImpactEquivalence(firstItem.impactEquivalence ?? 0);
      setSectorComparison(firstItem.sectorComparison ?? 0);
      setProgress(firstItem.eipF_Progress ?? 0);

      // Capture
      setCapture(firstItem.captureEmissions ?? 0);

      // Table Data
      const processedData = data
        .map(item => ({
          id: item.eipF_Facility_Id,
          alcance1: item.eipF_Scope1,
          alcance2: item.eipF_Scope2,
          alcance3: item.eipF_Scope3,
          totalCO2e: item.eipF_TotalCO2e,
          progreso: `${item.eipF_Progress}%`
        }))
        .filter(item => item.id && item.id !== '_'); 
      setTableData(processedData);
    }
  }, [data]);

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-full min-h-screen">
        <Loading /> 
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <ErrorPage />
      </div>
    );
  }

  
  return (
    <div className='min-h-screen overflow-hidden p-6 lg:ml-[205px] ml-0'>
      <TitleHandler title={dictionary.title} text={dictionary.description} />
      <div className='mt-2 flex flex-col gap-8'>
        <div className="w-full">
          <EqualizerChart csc={cscData} produced={producedData} captured={capturedData} translations={dictionary.equalizerChart}/>
        </div>
        <div className="w-full flex gap-8 flex-wrap lg:flex-nowrap">
          <BarChart gasPercentage={gasPercentage} gasTons={gasTons} translations={dictionary.bar}/>
          <CircleChart EmissionTons={emissionTons} EmissionPercentage={emissionPercentage} dictionary={dictionary.circle}/>
        </div>
        <div className='mt-4 flex flex-col lg:flex-row gap-10 justify-between flex-wrap'>
        <DataStats name={dictionary.totalEmissions} stats={totalEmissions} unit="CO2e"/>
        <DataStats name={dictionary.impactEquivalence} stats={impactEquivalence} unit={dictionary.bottles}/>
        <DataStats name={dictionary.sectorComparison} stats={sectorComparison} unit=""/>
        <DataStats name={dictionary.progress} stats={progress} unit="%"/>
        </div>
        <div className='w-full flex gap-10 lg:flex-nowrap flex-wrap'>
          <EnvironmentalTable data={tableData} translations={dictionary.table}/>
          <CaptureEmissions captureEmissions={capture} translations={dictionary.capture}/>
        </div>
      </div>
    </div>
  );
}

export default Home;

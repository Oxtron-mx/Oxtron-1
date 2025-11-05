import { Line } from "react-chartjs-2";
import "chart.js/auto";
import { ChartOptions } from "chart.js/auto";
import { HistoricEmissionProps } from "@/constants/types";

interface EqualizerChartProps extends HistoricEmissionProps {
  translations: {
    title: string;
    producedLabel: string;
    capturedLabel: string;
  };
}

const EqualizerChart = ({ csc, produced, captured, translations }: EqualizerChartProps) => {
  const highlightIndex = null;

  const data = {
    labels: csc,
    datasets: [
      {
        label: translations.producedLabel,
        data: produced,
        borderColor: "#0D2A85",
        backgroundColor: "rgba(13, 42, 133, 0.1)",
        fill: true,
        tension: 0.5,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointBackgroundColor: "rgba(19, 106, 246, 1)",
      },
      {
        label: translations.capturedLabel,
        data: captured,
        pointRadius: (context: any) => (context.dataIndex === highlightIndex ? 8 : 1),
        pointHoverRadius: 12,
        borderColor: "rgba(19, 106, 246, 1)",
        backgroundColor: "rgba(19, 106, 246, 1)",
        pointBackgroundColor: "rgba(19, 106, 246, 1)",
        showLine: false,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
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
        border: {
          display: false,
        },
        ticks: {
          stepSize: 20,
        },
      },
    },
    interaction: {
      mode: 'nearest',
      intersect: true,
    },
    plugins: {
      tooltip: {
        enabled: true,
      },
      legend: {
        align: "end",
        labels: {
          boxHeight: 1,
          padding: 20,
        },
      },
    },
  };

  return (
    <div className="rounded-[8px] shadow-custom p-3 md:p-6 overflow-hidden">
      <h2 className="text-lg md:text-2xl font-bold text-neutral-800">
        {translations.title}
      </h2>
      <div className="w-full h-[200px] md:h-[300px] p-1">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default EqualizerChart;

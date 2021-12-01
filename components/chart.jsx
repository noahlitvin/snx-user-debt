import useSynthetixQueries from "@synthetixio/queries";
import { Flex, Spinner, Button, Text } from "@chakra-ui/react";
import { DownloadIcon } from "@chakra-ui/icons";
import {
  Chart as ChartJS,
  LinearScale,
  TimeSeriesScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import "chartjs-adapter-date-fns";
import { CSVLink } from "react-csv";

ChartJS.register(
  TimeSeriesScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  animation: false,
  parsing: false,
  normalized: true,
  interaction: {
    mode: "index",
    intersect: false,
  },
  color: "#ffffff",
  stacked: false,
  scales: {
    x: {
      type: "time",
      ticks: {
        source: "auto",
        maxRotation: 0,
        autoSkip: true,
        color: "#ffffff",
      },
    },
    y: {
      type: "linear",
      display: true,
      position: "left",
      ticks: {
        color: "#ffffff",
        callback: function (value, index, values) {
          return "$" + value.toLocaleString();
        },
      },
    },
    y1: {
      type: "linear",
      display: true,
      position: "right",
      ticks: {
        color: "#ffffff",
        callback: function (value, index, values) {
          return value.toFixed(5) + "%";
        },
      },
    },
  },
  plugins: {
    decimation: {
      enabled: true,
    },
    legend: {
      position: "bottom",
      labels: {
        padding: 25,
      },
    },
    tooltip: {
      enabled: true,
      callbacks: {
        label: (context) => {
          let label = context.dataset.label || "";

          if (label) {
            label += ": ";
          }

          if (context.dataset.label == "Debt Amount") {
            label += new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(context.parsed.y);
          } else {
            label += context.parsed.y.toFixed(5) + "%";
          }
          return label;
        },
      },
    },
  },
};

export default function Chart({ address, network }) {
  const { useGetDebtTimeseries } = useSynthetixQueries();
  const getDebtTimeseriesQuery = useGetDebtTimeseries(address);

  const data = getDebtTimeseriesQuery.data && {
    labels: getDebtTimeseriesQuery.data.map(
      (d) => new Date(d.timestamp * 1000)
    ),
    datasets: [
      {
        label: "Amount of Debt",
        data: getDebtTimeseriesQuery.data.map((d) => parseFloat(d.debtAmount)),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        yAxisID: "y",
        parsing: {
          yAxisKey: "y",
        },
        pointRadius: 0,
        fontColor: "#ffffff",
      },
      {
        label: "Percentage of Total Debt",
        data: getDebtTimeseriesQuery.data.map((d) =>
          parseFloat(d.debtPercentage * 100)
        ),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        yAxisID: "y1",
        parsing: {
          yAxisKey: "y1",
        },
        pointRadius: 0,
        fontColor: "#ffffff",
      },
    ],
  };

  const csvReport = {
    data: getDebtTimeseriesQuery.data,
    filename: address + ".csv",
  };

  return (
    <div>
      {getDebtTimeseriesQuery.isLoading ? (
        <Flex py={28}>
          <Spinner mx="auto" />
        </Flex>
      ) : data && data.labels.length ? (
        <div>
          <Line options={options} data={data} />
          <Flex style={{ transform: "translateY(-30px)" }}>
            <Button ml="auto" size="xs" fontWeight="medium">
              <CSVLink {...csvReport}>
                <DownloadIcon style={{ transform: "translateY(-1px)" }} />{" "}
                Export to CSV
              </CSVLink>
            </Button>
          </Flex>
        </div>
      ) : (
        <Text fontSize="xl" py={28} align="center">
          {address.length
            ? `No data available for this address on ${network}`
            : "Enter an address above"}
        </Text>
      )}
    </div>
  );
}

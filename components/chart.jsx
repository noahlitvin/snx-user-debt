import { useState } from "react";
import useSynthetixQueries from "@synthetixio/queries";
import { Flex, Input, Spinner, Button } from "@chakra-ui/react";
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
  //parsing: false,
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
      },
    },
    y1: {
      type: "linear",
      display: true,
      position: "right",
      ticks: {
        color: "#ffffff",
      },
    },
  },
  plugins: {
    decimation: {
      enabled: true,
    },
  },
};

export default function Chart() {
  const [address, setAddress] = useState(
    "0x998b2f783b68d3d118b938172921e37e33821d71"
  );
  const { useGetDebtTimeseries } = useSynthetixQueries();
  const getDebtTimeseriesQuery = useGetDebtTimeseries(address);

  const data = getDebtTimeseriesQuery.data && {
    labels: getDebtTimeseriesQuery.data.map(
      (d) => new Date(d.timestamp * 1000)
    ),
    datasets: [
      {
        label: "Debt Amount",
        data: getDebtTimeseriesQuery.data.map((d) => d.debtAmount),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        yAxisID: "y",
        pointRadius: 0,
        fontColor: "#ffffff",
      },
      {
        label: "Debt Percentage",
        data: getDebtTimeseriesQuery.data.map((d) => d.debtPercentage),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        yAxisID: "y1",
        pointRadius: 0,
        fontColor: "#ffffff",
      },
    ],
  };

  const csvReport = {
    data: getDebtTimeseriesQuery.data,
    //headers: headers,
    filename: address + ".csv",
  };

  return (
    <div>
      <Input
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Enter wallet address here..."
        mb={4}
      />

      {getDebtTimeseriesQuery.isLoading ? (
        <Flex py={20}>
          <Spinner mx="auto" />
        </Flex>
      ) : (
        <div>
          <Line options={options} data={data} />
          <Flex my={4}>
            <Button ml="auto" size="xs" fontWeight="medium">
              <CSVLink {...csvReport}>
                <DownloadIcon style={{ transform: "translateY(-1px)" }} />{" "}
                Export to CSV
              </CSVLink>
            </Button>
          </Flex>
        </div>
      )}
    </div>
  );
}

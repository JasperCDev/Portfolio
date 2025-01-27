"use client";
import { Separator } from "@/components/ui/separator";
import { balanceHistory, balances } from "@/data";
import { PortfolioChart } from "./portfolio_chart";
import { Line, LineChart, YAxis } from "recharts";
import { Box } from "@/components/ui/box";

const minValueAll = Math.min(...balanceHistory.map((item) => item.all));
const minValueStocks = Math.min(...balanceHistory.map((item) => item.stocks));
const minValueRealEstate = Math.min(
  ...balanceHistory.map((item) => item.realEstate)
);

const balanceHistoryStocks = balanceHistory.map((b) => ({ value: b.stocks }));
const balanceHistoryRealEstate = balanceHistory.map((b) => ({
  value: b.realEstate,
}));

export default function Home() {
  return (
    <div className="grid grid-cols-1 px-8 py-2 w-full">
      <section>
        <h1 className="text-2xl font-extrabold">Portfolio Overview</h1>
        <Separator className="my-4" />
      </section>
      <section className="grid grid-cols-1 gap-8 w-full">
        <div className="flex flex-row items-center">
          <span>
            <span className="text-l font-bold">Portfolio Balance</span>
            <h3 className="text-6xl font-bold">${balances.all}</h3>
          </span>
          <LineChart width={168} height={84} data={balanceHistory}>
            <YAxis domain={[minValueAll, "auto"]} hide />
            <Line
              type="natural"
              stroke="purple"
              strokeWidth="4"
              dataKey="value"
              dot={false}
            />
          </LineChart>
        </div>
        <div className="flex flex-row flex-wrap gap-6">
          <Box className="w-[375px]">
            <h4 className="text-xl col-span-2 font-bold mb-4">Asset Mix</h4>
            <div className="flex flex-row gap-8">
              <PortfolioChart />
              <div className="flex flex-col gap-1 p-2">
                <div>
                  <div className="inline-block w-[10px] h-[10px] bg-chart-1"></div>{" "}
                  <span>Cash</span>
                </div>
                <div className="align-middle">
                  <div className="inline-block w-[10px] h-[10px] bg-chart-2"></div>{" "}
                  <span>Stocks</span>{" "}
                  <LineChart
                    width={50}
                    height={24}
                    data={balanceHistoryStocks}
                    className="inline-block"
                    margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
                  >
                    <YAxis domain={[minValueStocks, "auto"]} hide />
                    <Line
                      type="natural"
                      stroke="hsl(var(--chart-2))"
                      strokeWidth="2"
                      dataKey="value"
                      dot={false}
                    />
                  </LineChart>
                </div>
                <div className="align-middle">
                  <div className="inline-block w-[10px] h-[10px] bg-chart-3"></div>{" "}
                  <span>Real Estate</span>{" "}
                  <LineChart
                    width={50}
                    height={24}
                    data={balanceHistoryRealEstate}
                    className="inline-block"
                    margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
                  >
                    <YAxis domain={[minValueRealEstate, "auto"]} hide />
                    <Line
                      type="natural"
                      stroke="hsl(var(--chart-3))"
                      strokeWidth="2"
                      dataKey="value"
                      dot={false}
                    />
                  </LineChart>
                </div>
              </div>
            </div>
          </Box>
          <Box className="w-[375px]">
            <h4 className="text-xl col-span-2 font-bold mb-4">Real Estate</h4>
          </Box>
          <Box className="w-[375px]">
            <h4 className="text-xl col-span-2 font-bold mb-4">Stocks</h4>
          </Box>
        </div>
      </section>
    </div>
  );
}

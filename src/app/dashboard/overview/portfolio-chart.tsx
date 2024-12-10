"use client";

import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { balances } from "@/data";
import { LabelList, Pie, PieChart } from "recharts";

const chartData = [
  { name: "Cash", value: balances.cash, fill: "hsl(var(--chart-1))" },
  { name: "Stocks", value: balances.stocks, fill: "hsl(var(--chart-2))" },
  {
    name: "Real Estate",
    value: balances.realEstate,
    fill: "hsl(var(--chart-3))",
  },
];

const chartConfig = {
  cash: {
    label: "Cash",
    color: "hsl(var(--chart-1))",
  },
  stocks: {
    label: "Stocks",
    color: "hsl(var(--chart-2))",
  },
  realEstate: {
    label: "Real Estate",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

export function PortfolioChart() {
  return (
    <ChartContainer
      config={chartConfig}
      className="aspect-square h-[150px] w-[150px]"
    >
      <PieChart margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%" // Center horizontally
          cy="50%" // Center vertically
          outerRadius="100%" // Ensure it scales to fit the container
        ></Pie>
        <LabelList>
          
        </LabelList>
      </PieChart>
    </ChartContainer>
  );
}

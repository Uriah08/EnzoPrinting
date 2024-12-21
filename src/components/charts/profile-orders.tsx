"use client"

import * as React from "react"
import { Label, Pie, PieChart } from "recharts"
// import { Purchase } from "@/store/api"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"



const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
  firefox: {
    label: "Firefox",
    color: "hsl(var(--chart-3))",
  },
  edge: {
    label: "Edge",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig

type PurchaseStatus = {
  ToDo: number;
  InProgress: number;
  Finished: number;
  Cancelled: number;
}

export function PieCharts({ ToDo, InProgress, Finished, Cancelled }: PurchaseStatus) {
  
  const chartData = React.useMemo(() => {
    return [
      { status: "To Do", count: ToDo, fill: "#1A90F1" },
      { status: "In Progress", count: InProgress, fill: "#F9C301" },
      { status: "Finished", count: Finished, fill: "#DD127B" },
      { status: "Cancelled", count: Cancelled, fill: "#9c0202" },
    ];
  }, [ToDo, Finished, InProgress, Cancelled]);

  const totalVisitors = ToDo + InProgress + Finished + Cancelled

  return (
    <Card className="flex flex-col bg-[#f5f5f5] border-none shadow-none">
      <CardHeader className="items-center pb-0">
        <CardTitle>Your Orders</CardTitle>
        <CardDescription>Take a look</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="status"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Orders
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

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

const chartDataPerMonth = [
  { date: "Jan", desktop: 9507 },
  { date: "Feb", desktop: 0 },
  { date: "Mar", desktop: 0 },
  { date: "Apr", desktop: 9507 },
  { date: "May", desktop: 10123 },
  { date: "Jun", desktop: 9763 },
  { date: "Jul", desktop: 0 },
  { date: "Aug", desktop: 0 },
  { date: "Sep", desktop: 0 },
  { date: "Oct", desktop: 0 },
  { date: "Nov", desktop: 0 },
  { date: "Dec", desktop: 0 },
]

const chartConfig = {
  views: {
    label: "Page Views",
  },
  desktop: {
    label: "Total:",
    color: "#1A90F1",
  },
} satisfies ChartConfig

export function BarChartSticks() {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("desktop")

  const total = React.useMemo(
    () => ({
      desktop: chartDataPerMonth.reduce(
        (acc, curr) => acc + (curr.desktop > 0 ? curr.desktop : 0),
        0
      ),
    }),
    []
  )

  return (
    <Card className="bg-[#f5f5f5] border-none shadow-none">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Currently working on this</CardTitle>
          <CardDescription>
            Your whole year&apos;s sales page views at a glance
          </CardDescription>
        </div>
        <div className="flex">
          {["desktop"].map((key) => {
            const chart = key as keyof typeof chartConfig
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  {total[key as keyof typeof total].toLocaleString()}
                </span>
              </button>
            )
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartDataPerMonth}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => value} // Display the month abbreviation (e.g., Jan, Feb)
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => value} // No need to format the date further
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

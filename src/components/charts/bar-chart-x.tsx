"use client"

import { Bar, BarChart, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
  mug: {
    label: "Mug",
    color: "#1A90F1",
  },
  shirt: {
    label: "Shirt",
    color: "#F9C301", 
  },
  paper: {
    label: "Paper",
    color: "#DD127B", 
  },
  book: {
    label: "Book",
    color: "#9c0202", 
  },
  sticker: {
    label: "Sticker",
    color: "#0c8216",
  },
  keychain: {
    label: "Keychain",
    color: "#8A2BE2", 
  },
  ID: {
    label: "ID",
    color: "#FF6347",
  },
  bundle: {
    label: "Bundle",
    color: "#FF4500", 
  },
  other: {
    label: "Other",
    color: "#32CD32", 
  },
}


type PurchaseStatus = {
  bundle: number
  shirt: number
  paper: number
  book: number
  ID: number
  other: number
  keychain: number
  mug: number
  sticker: number
}
export function BarChartX({ bundle, shirt, paper, book, ID, other, keychain, mug, sticker }: PurchaseStatus) {
  
  const chartData = [
    { category: "mug", counts: mug, fill: chartConfig.mug.color },
    { category: "shirt", counts: shirt, fill: chartConfig.shirt.color },
    { category: "paper", counts: paper, fill: chartConfig.paper.color },
    { category: "book", counts: book, fill: chartConfig.book.color },
    { category: "sticker", counts: sticker, fill: chartConfig.sticker.color },
    { category: "keychain", counts: keychain, fill: chartConfig.keychain.color },
    { category: "ID", counts: ID, fill: chartConfig.ID.color },
    { category: "bundle", counts: bundle, fill: chartConfig.bundle.color },
    { category: "other", counts: other, fill: chartConfig.other.color },
  ]
  
  return (
    <Card className="bg-[#f5f5f5] border-none shadow-none">
      <CardHeader>
        <CardTitle className="text-center">Product Categoy Sales</CardTitle>
        <CardDescription className="text-center">Most Picked Products</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              left: 0,
            }}
          >
            <YAxis
              dataKey="category"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                chartConfig[value as keyof typeof chartConfig]?.label
              }
            />
            <XAxis dataKey="counts" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="counts" layout="vertical" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

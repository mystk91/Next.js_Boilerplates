"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import styles from "./page.module.css";
import dynamic from "next/dynamic";

const exampleData = [
  {
    name: "Jan",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Feb",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Mar",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Apr",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "May",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "June",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "July",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
  {
    name: "Aug",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Sept",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Oct",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Nov",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "Dec",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
];

const pieData = [
  { name: "Group A", value: 400 },
  { name: "Group B", value: 300 },
  { name: "Group C", value: 300 },
  { name: "Group D", value: 200 },
];

export default function Page() {
  const AreaChart = dynamic(
    () => import("@/app/ui/Data Visualization/Area Chart/areaChart"),
    { ssr: false }
  );
  const LineChart = dynamic(
    () => import("@/app/ui/Data Visualization/Line Chart/lineChart"),
    { ssr: false }
  );
  const BarChart = dynamic(
    () => import("@/app/ui/Data Visualization/Bar Chart/barChart"),
    { ssr: false }
  );
  const BarChartEach = dynamic(
    () => import("@/app/ui/Data Visualization/Bar Chart/barChartEach"),
    { ssr: false }
  );

  const PieChart = dynamic(
    () => import("@/app/ui/Data Visualization/Pie Chart/pieChart"),
    { ssr: false }
  );

  const DonutChart = dynamic(
    () => import("@/app/ui/Data Visualization/Pie Chart/donutChart"),
    { ssr: false }
  );

  return (
    <div className={styles.page}>
      <DonutChart data={pieData} />
      <BarChart data={exampleData} dataKey={"pv"} />
      <LineChart data={exampleData} />
      <PieChart data={pieData} />
      <BarChartEach data={exampleData} />
      <AreaChart data={exampleData} />
    </div>
  );
}

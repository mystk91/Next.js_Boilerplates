"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./lineChart.module.css";
import { TooltipProps } from "recharts";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const LINE_COLORS = [
  "#8884d8", // Soft Blue
  "#82ca9d", // Light Green
  "#ff7300", // Orange
  "#ff0000", // Red
  "#ffcc00", // Yellow
  "#ff69b4", // Pink
  "#a28dff", // Purple
  "#00c49f", // Teal
  "#0088fe", // Bright Blue
  "#6a737b", // Gray
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: { name: string; value: number }[];
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ border: "var(--smallBorder)" }}>
        {payload.map((entry, i) => {
          return (
            <div
              key={i}
              style={{
                padding: "0 0.2rem",
                backgroundColor: "var(--background)",
              }}
            >
              <p>{`${entry.name}: ${entry.value}`}</p>
            </div>
          );
        })}
      </div>
    );
  }
  return null;
};

interface ChartProps {
  data: any;
  interval?: number;
  height?: number;
  width?: number;
}

export default function Chart({
  data,
  interval = 1000,
  height = 480,
  width = 640,
}: ChartProps) {
  const tickInterval = interval;
  const values = data.flatMap(
    (d: { [s: string]: unknown } | ArrayLike<unknown>) =>
      Object.values(d).filter((value) => typeof value === "number")
  );
  // Finds the min/max across all parameters
  const minY = Math.floor(Math.min(...values) / tickInterval) * tickInterval;
  const maxY = Math.ceil(Math.max(...values) / tickInterval) * tickInterval;

  // Generates our tick values
  const ticks = [
    ...new Set([
      minY,
      ...Array.from(
        { length: Math.ceil((maxY - minY) / tickInterval) + 1 },
        (_, i) => Math.round(minY + i * tickInterval)
      ),
    ]),
  ];

  return (
    <div
      style={{
        width: "90%",
        display: "flex",
        justifyContent: "center",
        maxWidth: `${width}px`,
      }}
    >
      <ResponsiveContainer
        width="100%"
        height={height}
        style={{ display: "flex", justifyContent: "center" }}
      >
        <LineChart
          width={width}
          height={height}
          data={data}
          margin={{
            top: 5,
            right: 5,
            left: 5,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="6 2" />
          <XAxis
            dataKey="name"
            padding={{ left: 40, right: 40 }}
            fontSize={"1.6rem"}
          />
          <YAxis
            tickMargin={8}
            ticks={ticks}
            padding={{ top: 20, bottom: 20 }}
            domain={[minY, maxY]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {Object.keys(data[0])
            .filter((key) => key !== "name")
            .map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={LINE_COLORS[index % LINE_COLORS.length]}
                strokeWidth={4}
                activeDot={{ r: 6 }}
                isAnimationActive={false}
                dot={false}
              />
            ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

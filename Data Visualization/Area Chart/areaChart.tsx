"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./areaChart.module.css";
import { TooltipProps } from "recharts";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

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
                padding: "0.4rem",
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
        <AreaChart
          width={800}
          height={400}
          data={data}
          margin={{
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="6 2" />
          <XAxis dataKey="name" />
          <YAxis ticks={ticks} padding={{ top: 20 }} />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="linear"
            dataKey="uv"
            stroke="#8884d8"
            strokeWidth={4}
            fill="#8884d8"
            fillOpacity={0.3}
          />
          <Area type="linear" dataKey="pv" stroke="#82ca9d" fill="#82ca9d" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

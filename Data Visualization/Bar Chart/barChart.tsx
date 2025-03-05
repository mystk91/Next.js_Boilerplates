"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./barChart.module.css";
import {
  CartesianGrid,
  Cell,
  LabelList,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from "recharts";

import { BarChart, Bar, ResponsiveContainer } from "recharts";

const BAR_COLORS = [
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
  dataKey: string;
  interval?: number;
  height?: number;
  width?: number;
}

export default function Chart({
  data,
  dataKey,
  interval = 1000,
  height = 480,
  width = 720,
}: ChartProps) {
  return (
    <div
      style={{
        width: "100%",
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
        <BarChart
          data={data}
          layout="vertical"
          barCategoryGap={0}
          barGap={0}
          margin={{ right: 80 }}
        >
          <XAxis
            type="number"
            tick={{ fill: "var(--bw)" }}
            stroke="var(--bw)"
            tickMargin={6}
            tickCount={0}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={60}
            tickMargin={4}
            tick={{ fill: "var(--bw)" }}
            stroke="none"
          />
          <Tooltip content={<CustomTooltip />} cursor={false} />
          <Bar dataKey={dataKey} animationDuration={1500}>
            {data.map((entry: any, index: number) => (
              <Cell
                key={`cell-${index}`}
                fill={BAR_COLORS[index % BAR_COLORS.length]}
                className={styles.cell}
              />
            ))}
            <LabelList dataKey={dataKey} position="right" fill="var(--bw)" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

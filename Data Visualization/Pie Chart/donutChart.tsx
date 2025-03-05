"use client";
import React from "react";
import {
  PieChart,
  Pie,
  ResponsiveContainer,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = [
  "#8884d8", // Soft Blue
  "#ff0000", // Red
  "#82ca9d", // Light Green
  "#ff7300", // Orange
  "#ffcc00", // Yellow
  "#ff69b4", // Pink
  "#a28dff", // Purple
  "#00c49f", // Teal
  "#0088fe", // Bright Blue
  "#6a737b", // Gray
];

const RADIAN = Math.PI / 180;

interface DataEntry {
  name: string;
  value: number;
}

interface ChartProps {
  data: DataEntry[];
  height?: number;
  width?: number;
}

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
  payload,
}: {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  index: number;
  payload: DataEntry;
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 2.7;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="var(--foreground)"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize="1.6rem"
    >
      <tspan x={x} dy="-0.4em">
        {payload.name}
      </tspan>
      <tspan x={x} dy="1.2em">{`${(percent * 100).toFixed(0)}%`}</tspan>
    </text>
  );
};

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

export default function PieChartComponent({
  data,
  height = 400,
  width = height,
}: ChartProps) {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <ResponsiveContainer width={width} height={height}>
        <PieChart width={width} height={height}>
          <Pie
            data={data}
            cx={200}
            cy={200}
            innerRadius={80}
            outerRadius={100}
            fill="#8884d8"
            paddingAngle={10}
            dataKey="value"
            isAnimationActive={false}
            label={renderCustomizedLabel}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

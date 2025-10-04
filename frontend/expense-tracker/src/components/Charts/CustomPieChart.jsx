import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import CustomTooltip from "../Charts/CustomTooltip";
import CustomLegend from "../Charts/CustomLegend";

const CustomPieChart = ({
  data = [],
  label,
  totalAmount,
  colors = [],
  showTextAnchor,
  dataKey = "value", // Make dataKey configurable with default
  nameKey = "name",
}) => {
  // Add safety check for data
  const safeData = Array.isArray(data) ? data : [];
  const safeColors = Array.isArray(colors) ? colors : ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00'];

  return <ResponsiveContainer width="100%" height={380}>
    {/* // <ResponsiveContainer width="100%" height={380}> */}
      <PieChart>
        <Pie
          data={safeData}
          dataKey={dataKey}
          nameKey={nameKey}
          cx="50%"
          cy="50%"
          outerRadius={130}
          innerRadius={100}
          labelLine={false}
        >
          {safeData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={safeColors[index % safeColors.length]} />
          ))}
        </Pie>
        <Tooltip content={CustomTooltip} />
        <Legend content={CustomLegend}/>

        {showTextAnchor && (
          <>
            <text
              x="50%"
              y="50%"
              dy={-25}
              textAnchor="middle"
              fill="#666"
              fontSize="14px"
            >
              {label}
            </text>
            <text
              x="50%"
              y="50%"
              dy={8}
              textAnchor="middle"
              fill="#333"
              fontSize="24px"
              fontWeight="semi-bold"
            >
              {totalAmount}
            </text>
          </>
        )}
      </PieChart>
    </ResponsiveContainer>
  
};

export default CustomPieChart;

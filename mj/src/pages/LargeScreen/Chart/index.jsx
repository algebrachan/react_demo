import React from "react";
import ReactEcharts from "echarts-for-react";

export const EchartsBarChart = ({ chart_data = {} }) => {
  const option = {
    grid: {
      left: "5%",
      right: "5%",
      top: "10%",
      bottom: "5%",
      containLabel: true,
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow", // 阴影指示器
      },
      backgroundColor: "rgba(50,50,50,0.7)",
      borderColor: "#666",
      textStyle: {
        color: "#fff",
      },
    },
    xAxis: {
      type: "category",
      data: chart_data?.xdata || ["本日", "本周", "本月"],
      axisLabel: {
        color: "#fff", // 标签颜色
        fontSize: 16, // 字体大小
      },
    },
    yAxis: {
      type: "value",
      axisLabel: {
        color: "#fff",
        fontSize: 16,
      },
    },
    series: [
      {
        data: chart_data?.ydata || [30, 40, 50],
        type: "bar",
        barWidth: "30%",
        itemStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "#00F6D8", // 渐变起点颜色
              },
              {
                offset: 1,
                color: "#46C2FC", // 渐变终点颜色
              },
            ],
            globalCoord: false,
          },
        },
      },
    ],
  };

  return (
    <ReactEcharts option={option} style={{ width: "100%", height: 300 }} />
  );
};

export const EchartsLineChart = ({ chart_data = {} }) => {
  const option = {
    grid: {
      left: "2%",
      right: "2%",
      top: "10%",
      bottom: "5%",
      containLabel: true,
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
      },
      backgroundColor: "rgba(50,50,50,0.7)",
      textStyle: {
        color: "#fff",
        fontSize: 16,
      },
    },
    xAxis: {
      type: "category",
      data:
        chart_data?.xdata ||
        Array.from({ length: 5 }, (_, i) => `设备${i + 1}`),
      axisLabel: {
        color: "#fff",
        fontSize: 16,
      },
    },
    yAxis: {
      type: "value",
      min: 0,
      max: 100,
      axisLabel: {
        show: true, // 隐藏刻度标签
        color: "#fff",
        fontSize: 16,
        formatter: "{value}%",
      },
    },
    series: [
      {
        type: "line",
        data: chart_data?.ydata1 || [],
        itemStyle: {
          color: "#46C2FC",
        },
        lineStyle: {
          width: 3,
        },
        tooltip: {
          valueFormatter: (value) => value + "%",
        },
      },
    ],
  };
  return (
    <ReactEcharts option={option} style={{ width: "100%", height: 300 }} />
  );
};

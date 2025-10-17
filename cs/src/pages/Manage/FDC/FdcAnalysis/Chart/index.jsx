import React, { useEffect, useRef, useState } from "react";
import ReactECharts from "echarts-for-react";
const MemoizedChart = React.memo(ReactECharts);

export const LineChart = ({ chart_data = {} }) => {
  const [chart_opt, setChart_opt] = useState({});
  const initChart = () => {
    const {
      xdata = [],
      ydata1 = [],
      ydata2 = [],
      ydata3 = [],
      ydata_max = [],
      ydata_min = [],
      max_min1 = [],
      max_min2 = [],
      title = "",
      abnormal_point = [],
    } = chart_data;

    let xAxis = {
      type: "category",
      axisLabel: {
        fontSize: 14,
      },
      axisLine: {
        onZero: false,
      },
      name: "时间",
      nameLocation: "center",
      nameGap: 32,
      axisTick: {},
    };
    let yAxis = [
      {
        type: "value",
        axisLabel: {
          color: "#777777",
          fontSize: 14,
          margin: 2,
        },
        minInterval: 1,
        splitLine: {
          show: true,
        },
        axisLine: {
          show: false,
        },
        axisTick: {
          show: true,
          length: 0,
        },
        min: max_min1[0],
        max: max_min1[1],
      },
      {
        type: "value",
        axisLabel: {
          color: "#777777",
          fontSize: 14,
          margin: 2,
        },
        minInterval: 1,
        splitLine: {
          show: true,
        },
        axisLine: {
          show: false,
        },
        axisTick: {
          show: true,
          length: 0,
        },
        min: max_min2[0],
        max: max_min2[1],
      },
    ];
    let mark_point = [];
    abnormal_point.forEach((e) => {
      mark_point.push({
        xAxis: e[0],
        yAxis: e[1],
      });
    });
    let series = [
      {
        name: "实际值",
        data: xdata.map((e, _) => [e, ydata1[_]]),
        type: "line",
        symbol: "none",
      },
      {
        name: "设定值",
        data: xdata.map((e, _) => [e, ydata2[_]]),
        type: "line",
        symbol: "none",
        yAxisIndex: 1,
      },
      {
        name: "对比线",
        data: ydata3?.map((e, _) => [xdata[_], e]),
        type: "line",
        symbol: "none",
        yAxisIndex: 1,
      },
      {
        name: "最大值",
        data: xdata.map((e, _) => [e, ydata_max[_]]),
        type: "line",
        symbol: "none",
      },
      {
        name: "最小值",
        data: xdata.map((e, _) => [e, ydata_min[_]]),
        type: "line",
        symbol: "none",
      },
      {
        type: "line",
        markPoint: {
          symbol: "circle",
          symbolSize: 3,
          itemStyle: {
            color: "red",
          },
          data: mark_point,
        },
      },
    ];
    let options = {
      title: {
        text: title,
      },
      tooltip: {
        trigger: "axis",
      },
      legend: {
        data: ["实际值", "设定值", "最大值", "最小值", "对比线"],
        top: 20,
      },
      grid: {
        left: 70,
        right: 60,
        bottom: 50,
        top: 55,
      },
      textStyle: {
        fontSize: 14,
        color: "#777777",
      },
      xAxis,
      yAxis,
      series,
    };
    setChart_opt(options);
  };

  useEffect(() => {
    initChart();
  }, [chart_data]);
  return (
    <MemoizedChart
      option={chart_opt}
      style={{
        width: "100%",
        height: 300,
        padding: 10,
      }}
    />
  );
};

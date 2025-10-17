import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";

export const BarChart = ({ chart_data = {} }) => {
  const barRef = useRef(null);
  const myChartRef = useRef(null);
  const initChart = () => {
    myChartRef.current || (myChartRef.current = echarts.init(barRef.current));
    const { xData = [], yData = [] } = chart_data;
    let xAxis = {
      type: "category",
      data: xData,
    };
    let yAxis = {
      position: "bottom",
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
    };
    let series = [
      {
        name: "使用次数",
        data: yData,
        type: "bar",
        barWidth: "70%",
        color: "#6395FA",
        label: {
          show: true,
          position: "top",
          fontSize: 12,
        },
      },
    ];
    let options = {
      legend: {
        right: 10,
        data: ["使用次数"],
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        left: 50,
        right: 30,
        bottom: 30,
        top: 40,
      },
      textStyle: {
        fontSize: 14,
        color: "#777777",
      },
      xAxis,
      yAxis,
      series,
    };

    myChartRef.current && myChartRef.current.setOption({ ...options }, true);
  };
  const myObserver = new ResizeObserver(() => {
    myChartRef.current?.resize();
  });
  useEffect(() => {
    initChart();
    if (Object.keys(chart_data).length > 0) {
      initChart();
    } else {
      myChartRef.current?.setOption({}, true);
    }
    myObserver.observe(barRef.current);
    return () => {
      myObserver.disconnect();
      // myChartRef.current?.dispose();
    };
  }, [chart_data]);
  return (
    <div style={{ width: "100%", height: 260, padding: 10 }} ref={barRef}></div>
  );
};

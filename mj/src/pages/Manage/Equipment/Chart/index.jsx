import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";

export const DistChart = ({ chart_data = {} }) => {
  const distRef = useRef(null);
  const myChartRef = useRef(null);
  const initChart = () => {
    myChartRef.current || (myChartRef.current = echarts.init(distRef.current));
    const { distribution = [0.3, 0.8, 0.7], histogram = {} } = chart_data;
    const {
      bins = ["1", "2", "3"],
      counts = [10, 30, 20],
      title = "",
    } = histogram;
    let yAxis = {
      type: "category",
      data: bins,
      inverse: true,
    };
    let xAxis = [
      {
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
      },
      {
        type: "value",
        show: false,
      },
    ];
    let series = [
      {
        name: "频次",
        data: counts,
        type: "bar",
        barWidth: "70%",
        color: "#6395FA",
        label: {
          show: true,
          position: "right",
          color: "#6395FA",
          fontSize: 12,
        },
      },
      {
        name: "概率密度",
        type: "line",
        data: distribution,
        symbol: "circle",
        symbolSize: 8,
        xAxisIndex: 1,
        color: "#AB1ABB",
        smooth: true,
        label: {
          show: true,
          color: "#AB1ABB",
          fontSize: 12,
          position: "top",
        },
      },
    ];
    let options = {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      toolbox: {
        top: -5,
        feature: {
          dataZoom: {},
          restore: {},
          saveAsImage: {
            // name: getCurrentTime(),
          },
        },
      },
      title: {
        text: title,
        left: "center",
      },
      grid: {
        left: 30,
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
    if (Object.keys(chart_data).length > 0) {
      initChart();
    } else {
      myChartRef.current?.setOption({}, true);
    }
    myObserver.observe(distRef.current);
    return () => {
      myObserver.disconnect();
      // myChartRef.current?.dispose();
    };
  }, [chart_data]);
  return (
    <div
      style={{ width: "100%", height: 300, padding: 10 }}
      ref={distRef}
    ></div>
  );
};

export const LineChart = ({ chart_data = {} }) => {
  const lineRef = useRef(null);
  const myChartRef = useRef(null);
  const initChart = () => {
    myChartRef.current = echarts.init(lineRef.current);
    const { xData = [], yData = [] } = chart_data;

    let xAxis = {
      type: "category",
      data: xData,
      axisLabel: {
        fontSize: 14,
      },
      axisLine: {
        onZero: false,
      },
      name: "",
      nameLocation: "center",
      nameGap: 32,
      axisTick: {},
    };
    let yAxis = {
      type: "value",
      scale: true,
      name: "",
      axisLabel: {
        color: "#777777",
        fontSize: 14,
        margin: 2,
        onZero: false,
      },
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
        name: "数据",
        type: "line",
        data: yData,
        symbol: "none",
        symbolSize: 5,
        color: "#223BB9",
        // smooth: true,
        label: {
          show: false,
          color: "#223BB9",
          fontSize: 12,
          position: "top",
        },
      },
    ];
    let option = {
      tooltip: {
        trigger: "axis",
      },
      toolbox: {
        top: -5,
        feature: {
          dataZoom: {},
          restore: {},
          saveAsImage: {},
        },
      },
      title: {
        text: "",
        left: "center",
      },
      grid: {
        left: 40,
        right: 30,
        bottom: 30,
        top: 50,
      },
      xAxis,
      yAxis,
      series,
    };
    myChartRef.current && myChartRef.current.setOption(option, true);
  };
  const myObserver = new ResizeObserver(() => {
    myChartRef.current?.resize();
  });
  useEffect(() => {
    if (Object.keys(chart_data).length > 0) {
      initChart();
    } else {
      myChartRef.current?.setOption({}, true);
    }
    myObserver.observe(lineRef.current);
    return () => {
      myObserver.disconnect();
      // myChartRef.current?.dispose();
    };
  }, [chart_data]);

  return (
    <div
      style={{ width: "100%", height: 300, padding: 10 }}
      ref={lineRef}
    ></div>
  );
};

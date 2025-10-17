import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";

export const LineChart1 = ({ chart_data = {}, yLabel = "", xLabel = "" }) => {
  const lineRef = useRef(null);
  const myChartRef = useRef(null);
  const initChart = () => {
    myChartRef.current = echarts.init(lineRef.current);
    const { class0, class1, x_data } = chart_data;
    let series = [];
    Object.keys(class1).forEach((item) => {
      series.push({
        name: "class1",
        type: "line",
        symbol: "none",
        data: x_data.map((e, _) => [e, class1[item][_], item]),
      });
    });
    Object.keys(class0).forEach((item) => {
      series.push({
        name: "class0",
        type: "line",
        symbol: "none",
        data: x_data.map((e, _) => [e, class0[item][_], item]),
      });
    });
    Object.keys(chart_data["class-1"]).forEach((item) => {
      series.push({
        name: "class-1",
        type: "line",
        symbol: "none",
        data: x_data.map((e, _) => [e, chart_data["class-1"][item][_], item]),
      });
    });

    let option = {
      tooltip: {
        trigger: "axis",
        formatter: (params) => {
          // 自定义tooltips
          let str = params[0].data[0];
          //   let str = `经过时间:\t${params[0].axisValue}<br />`;
          params.forEach((item) => {
            str += `<div>${item.marker}${item.seriesName}-${item.data[2]}:<span style="margin-left:20px;font-weight:600;float:right">${item.data[1]}</span><div>`;
          });
          return str;
        },
      },
      legend: {
        data: ["class1", "class0", "class-1"],
        top: 5,
        type: "scroll",
        width: "70%",
      },
      grid: {
        left: 35,
        right: 30,
        bottom: 20,
        top: 35,
        containLabel: true,
      },
      toolbox: {
        feature: {
          dataZoom: {},
          restore: {},
        },
      },
      xAxis: {
        type: "value",
        min: "dataMin",
        max: "dataMax",
        name: xLabel,
        nameLocation: "center",
        nameGap: 25,
        axisLine: {
          onZero: false,
        },
      },
      yAxis: {
        type: "value",
        scale: true,
        name: yLabel,
        nameLocation: "center",
        nameGap: 40,
      },
      series,
    };
    myChartRef.current && myChartRef.current.setOption({ ...option }, true);
  };
  const myObserver = new ResizeObserver(() => {
    myChartRef.current?.resize();
  });
  useEffect(() => {
    if (Object.keys(chart_data).length > 0) {
      initChart();
    }
    myObserver.observe(lineRef.current);
    return () => {
      myObserver.disconnect();
      myChartRef.current?.dispose();
    };
  }, [chart_data]);

  return <div style={{ width: "100%", height: "100%" }} ref={lineRef}></div>;
};
export const LineChart2 = ({ chart_data = {}, yLabel = "", xLabel = "" }) => {
  const lineRef = useRef(null);
  const myChartRef = useRef(null);
  const initChart = () => {
    myChartRef.current = echarts.init(lineRef.current);
    const { class0, class1, x_data } = chart_data;
    let series = [
      {
        name: "class1",
        type: "line",
        symbol: "none",
        data: x_data.map((e, _) => [e, class1[_]]),
      },
      {
        name: "class0",
        type: "line",
        symbol: "none",
        data: x_data.map((e, _) => [e, class0[_]]),
      },
      {
        name: "class-1",
        type: "line",
        symbol: "none",
        data: x_data.map((e, _) => [e, chart_data["class-1"][_]]),
      },
    ];

    let option = {
      tooltip: {
        trigger: "axis",
        // formatter: (params) => {
        //   // 自定义tooltips
        //   let str = params[0].data[0];
        //   //   let str = `经过时间:\t${params[0].axisValue}<br />`;
        //   params.forEach((item) => {
        //     str += `<div>${item.marker}${item.seriesName}-${item.data[2]}:<span style="margin-left:20px;font-weight:600;float:right">${item.data[1]}</span><div>`;
        //   });
        //   return str;
        // },
      },
      legend: {
        data: ["class1", "class0", "class-1"],
        top: 5,
        type: "scroll",
        width: "70%",
      },
      grid: {
        left: 35,
        right: 30,
        bottom: 20,
        top: 35,
        containLabel: true,
      },
      toolbox: {
        feature: {
          dataZoom: {},
          restore: {},
        },
      },
      xAxis: {
        type: "value",
        min: "dataMin",
        max: "dataMax",
        name: xLabel,
        nameLocation: "center",
        nameGap: 25,
        axisLine: {
          onZero: false,
        },
      },
      yAxis: {
        type: "value",
        scale: true,
        name: yLabel,
        nameLocation: "center",
        nameGap: 40,
      },
      series,
    };
    myChartRef.current && myChartRef.current.setOption({ ...option }, true);
  };
  const myObserver = new ResizeObserver(() => {
    myChartRef.current?.resize();
  });
  useEffect(() => {
    if (Object.keys(chart_data).length > 0) {
      initChart();
    }
    myObserver.observe(lineRef.current);
    return () => {
      myObserver.disconnect();
      myChartRef.current?.dispose();
    };
  }, [chart_data]);

  return <div style={{ width: "100%", height: "100%" }} ref={lineRef}></div>;
};

import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";

export const CommonProgressChart = ({ chart_data = {} }) => {
  const lineRef = useRef(null);
  const myChartRef = useRef(null);
  const initChart = () => {
    myChartRef.current = echarts.init(lineRef.current);
    // 获取 chart_data 的key
    let key_list = Object.keys(chart_data);
    let temp_series = [];
    let temp_legend = [];
    key_list.forEach((x, _) => {
      temp_legend.push(x);
      temp_series.push({
        name: x,
        type: "line",
        symbol: "none",
        data: chart_data[x].map((item) => [item.x, item.y]),
      });
    });
    let option = {
      tooltip: {
        trigger: "axis",
        formatter: (params) => {
          // 自定义tooltips
          let str = `经过时间:\t${params[0].axisValue}<br />`;
          params.forEach((item) => {
            str += `<div>${item.marker}${item.seriesName}:<span style="margin-left:20px;font-weight:600;float:right">${item.data[1]}</span><div>`;
          });
          return str;
        },
      },
      legend: {
        data: temp_legend,
        top: 5,
        type: "scroll",
        width: "70%",
      },
      grid: {
        left: 37,
        right: 20,
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
        name: "经过时间/s",
        nameLocation: "center",
        nameGap: 20,
        min: "dataMin",
        max: "dataMax",
        axisLine: {
          onZero: false,
        },
      },
      yAxis: {
        type: "value",
        scale: true,
      },
      series: temp_series,
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

export const ScatterLineChart = ({ chart_data = {} }) => {
  const lineRef = useRef(null);
  const myChartRef = useRef(null);
  const initChart = () => {
    myChartRef.current = echarts.init(lineRef.current);
    const {
      density_center,
      line_x_data,
      lower_limit,
      scatter_data,
      upper_limit,
    } = chart_data;
    let series = [
      {
        name: "中线",
        type: "line",
        symbol: "none",
        data: line_x_data.map((x, _) => [x, density_center[_]]),
        color: "#768DD1",
      },
      {
        name: "下边界",
        type: "line",
        symbol: "none",
        data: line_x_data.map((x, _) => [x, lower_limit[_]]),
        color: "#A7D691",
      },
      {
        name: "上边界",
        type: "line",
        symbol: "none",
        data: line_x_data.map((x, _) => [x, upper_limit[_]]),
        color: "#F18585",
      },
      {
        name: "散点",
        type: "scatter",
        data: scatter_data,
        symbolSize: 5,
        tooltip: {
          trigger: "item",
          axisPointer: {
            type: "cross",
          },
          formatter: (param) => {
            const { data } = param;
            let str = `<div>${param.marker}${param.seriesName}:(${data[0]},${data[1]})</div>`;
            str += `<div>加工编号:<span style="margin-left:20px;font-weight:600;float:right">${data[3]}</span><div>`;
            return str;
          },
        },
      },
    ];
    let option = {
      toolbox: {
        feature: {
          dataZoom: {},
          restore: {},
        },
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross", // 开启十字准线指示器
        },
      },
      visualMap: {
        min: 0,
        max: 1,
        dimension: 2,
        itemWidth: 10,
        orient: "vertical",
        right: 5,
        top: "center",
        calculable: true,
        inRange: {
          color: ["#BD1212", "#E08F35", "#FFFDBB", "#68C2A6", "#564D96"],
        },
        seriesIndex: 3,
      },
      legend: {
        data: ["中线", "下边界", "上边界"],
        top: 5,
        type: "scroll",
        width: "90%",
      },
      grid: {
        left: 45,
        right: 50,
        bottom: 40,
        top: 35,
      },
      xAxis: {
        type: "value",
        name: "经过时间/s",
        nameLocation: "center",
        nameGap: 20,
        min: "dataMin",
        max: "dataMax",
        axisLine: {
          onZero: false,
        },
      },
      yAxis: {
        type: "value",
        scale: true,
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

import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { lerpColor } from "../../../../../utils/string";

// 过渡颜色 折线图
export const TransitionLineChart = ({ chart_data = {}, yLabel = "" }) => {
  const lineRef = useRef(null);
  const myChartRef = useRef(null);
  const initChart = () => {
    myChartRef.current = echarts.init(lineRef.current);
    const { x_data, y_data, colors } = chart_data;
    let temp_legend = [];
    let temp_series = [];
    Object.keys(y_data).forEach((y, _) => {
      temp_legend.push(y);
      temp_series.push({
        name: y,
        type: "line",
        symbol: "none",
        data: y_data[y].map((e, _) => [x_data[_], e, colors[y]]),
        visualMap: true,
        itemStyle: {
          color: lerpColor("#D7EDFF", "#2E6AEE", colors[y]),
        },
        lineStyle: {
          color: lerpColor("#D7EDFF", "#2E6AEE", colors[y]),
        },
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
      visualMap: {
        min: 0,
        max: 1,
        itemWidth: 10,
        orient: "vertical",
        right: 2,
        top: "center",
        dimension: 2,
        calculable: true,
        inRange: {
          color: ["#D7EDFF", "#2E6AEE"],
        },
      },
      legend: {
        data: temp_legend,
        top: 5,
        type: "scroll",
        width: "70%",
      },
      grid: {
        left: 35,
        right: 50,
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
        name: "经过时间/s",
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

export const TransitionLineChart2 = ({ chart_data = {}, xLabel = "" }) => {
  const lineRef = useRef(null);
  const myChartRef = useRef(null);
  const initChart = () => {
    myChartRef.current = echarts.init(lineRef.current);
    const { x_data, y_data, colors } = chart_data;
    let temp_legend = [];
    let temp_series = [];
    Object.keys(y_data).forEach((y, _) => {
      temp_legend.push(y);
      temp_series.push({
        name: y,
        type: "line",
        symbol: "none",
        data: y_data[y].map((e, _) => [x_data[_], e]),
        itemStyle: {
          color: lerpColor("#D7EDFF", "#2E6AEE", colors[y]),
        },
        lineStyle: {
          color: lerpColor("#D7EDFF", "#2E6AEE", colors[y]),
        },
      });
    });
    let option = {
      tooltip: {
        trigger: "axis",
        // formatter: (params) => {
        //   // 自定义tooltips
        //   let str = `经过时间:\t${params[0].axisValue}<br />`;
        //   params.forEach((item) => {
        //     str += `<div>${item.marker}${item.seriesName}:<span style="margin-left:20px;font-weight:600;float:right">${item.data[1]}</span><div>`;
        //   });
        //   return str;
        // },
      },
      legend: {
        data: temp_legend,
        top: 5,
        type: "scroll",
        width: "70%",
      },
      grid: {
        left: 30,
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
        min: "dataMin",
        max: "dataMax",
        name: xLabel,
        nameLocation: "center",
        nameGap: 25,
        axisLine: {
          onZero: false,
        },
        axisLabel: {
          formatter: (val) => val.toFixed(2),
        },
      },
      yAxis: {
        type: "value",
        scale: true,
        name: "密度",
        nameLocation: "center",
        nameGap: 40,
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

export const ScatterLineChart = ({ chart_data = {}, yLabel = "" }) => {
  const lineRef = useRef(null);
  const myChartRef = useRef(null);
  const initChart = () => {
    myChartRef.current = echarts.init(lineRef.current);
    const { line_x_data, line_y_data, marker, scatter_data } = chart_data;
    let series = [
      {
        name: "散点",
        type: "scatter",
        data: scatter_data,
        symbolSize: 3,
        tooltip: {
          trigger: "item",
          axisPointer: {
            type: "cross",
          },
          formatter: (param) => {
            const { data } = param;
            let str = `<div>${param.marker}${param.seriesName}:(${data[0]},${data[1]})</div>`;
            return str;
          },
        },
      },
      {
        name: "相关性",
        type: "line",
        symbol: "none",
        data: line_x_data.map((e, _) => [e, line_y_data[_]]),
        color: "#4C69FF",
        yAxisIndex: 1,
      },
      {
        name: "标记点",
        type: "bar",
        symbol: "none",
        yAxisIndex: 1,
        zlevel: 5,
        markPoint: {
          symbol: "circle",
          symbolSize: 10,
          itemStyle: {
            color: "green",
          },
          data: [
            {
              name: "某个坐标",
              coord: marker,
            },
          ],
        },
        tooltip: {
          trigger: "item",
          axisPointer: {
            type: "cross",
          },
        },
      },
    ];
    let option = {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross", // 开启十字准线指示器
        },
      },
      visualMap: {
        min: 0,
        max: 1,
        seriesIndex: 0,
        dimension: 2,
        itemWidth: 10,
        orient: "vertical",
        right: 5,
        top: "center",
        calculable: true,
        inRange: {
          color: ["#FFD7D7", "#CE1818"],
        },
      },
      grid: {
        left: 35,
        right: 50,
        bottom: 20,
        top: 35,
        containLabel: true,
      },
      xAxis: {
        type: "value",
        name: "经过时间/s",
        nameLocation: "center",
        nameGap: 25,
        min: "dataMin",
        max: "dataMax",
        axisLine: {
          onZero: false,
        },
        splitLine: {
          lineStyle: {
            type: "dashed",
          },
        },
      },
      yAxis: [
        {
          type: "value",
          scale: true,
          name: yLabel,
          nameLocation: "center",
          nameGap: 35,
          splitLine: {
            lineStyle: {
              type: "dashed",
            },
          },
        },
        {
          type: "value",
          scale: true,
          axisLabel: {
            color: "#4C69FF",
          },
          name: "皮尔逊相关系数r",
          nameLocation: "center",
          nameGap: 40,
          nameTextStyle: {
            color: "#4C69FF",
          },
          splitLine: {
            lineStyle: {
              type: "dashed",
            },
          },
        },
      ],
      //   legend: {
      //     data: ["相关性", "散点"],
      //     top: 5,
      //     type: "scroll",
      //     width: "70%",
      //   },
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

// 普通双折线图
export const LineChart = ({
  chart_data = {},
  过程参数 = "",
  质量参数 = "",
}) => {
  const lineRef = useRef(null);
  const myChartRef = useRef(null);
  const initChart = () => {
    myChartRef.current = echarts.init(lineRef.current);
    const { x_data, y_data1, y_data2, batch_ids } = chart_data;
    let series = [
      {
        name: 过程参数,
        type: "line",
        symbol: "none",
        data: x_data.map((e, _) => [e, y_data1[_], batch_ids[_]]),
      },
      {
        name: 质量参数,
        type: "line",
        symbol: "none",
        data: x_data.map((e, _) => [e, y_data2[_], batch_ids[_]]),
        yAxisIndex: 1,
      },
    ];
    let option = {
      tooltip: {
        trigger: "axis",
        formatter: (params) => {
          // 自定义tooltips
          let str = `<div>加工编号:<span style="margin-left:20px;font-weight:600;float:right">${params[0].data[2]}</span><div>`;
          params.forEach((item) => {
            str += `<div>${item.marker}${item.seriesName}:<span style="margin-left:20px;font-weight:600;float:right">${item.data[1]}</span><div>`;
          });
          return str;
        },
      },
      color: ["#FF782E", "#4C69FF"],
      legend: {
        data: [过程参数, 质量参数],
        top: 5,
        type: "scroll",
        width: "70%",
      },
      grid: {
        left: 30,
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
        name: "组别",
        nameLocation: "center",
        nameGap: 25,
        axisLine: {
          onZero: false,
        },
        minInterval: 1,
      },
      yAxis: [
        {
          type: "value",
          scale: true,
          name: 过程参数,
          nameLocation: "center",
          nameGap: 40,
          nameTextStyle: {
            color: "#FF782E",
          },
          axisLabel: {
            color: "#FF782E",
          },
        },
        {
          type: "value",
          scale: true,
          name: 质量参数,
          nameLocation: "center",
          nameGap: 40,
          nameTextStyle: {
            color: "#4C69FF",
          },
          axisLabel: {
            color: "#4C69FF",
          },
        },
      ],
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

export const ScatterLineChart2 = ({
  chart_data = {},
  过程参数 = "",
  质量参数 = "",
}) => {
  const lineRef = useRef(null);
  const myChartRef = useRef(null);
  const initChart = () => {
    myChartRef.current = echarts.init(lineRef.current);
    const { x_data, y_data, upper_limit, lower_limit, scatter_data } =
      chart_data;
    let series = [
      {
        name: "样本点",
        type: "scatter",
        data: scatter_data,
        symbolSize: 5,
        zlevel: 5,
        tooltip: {
          trigger: "item",
          axisPointer: {
            type: "cross",
          },
          formatter: (param) => {
            const { data } = param;
            let str = `<div>${param.marker}${param.seriesName}:(${data[0]},${data[1]})</div>`;
            return str;
          },
        },
      },
      {
        name: "拟合直线",
        type: "line",
        showSymbol: false,
        data: x_data.map((e, _) => [e, y_data[_]]),
        zlevel: 4,
      },
      {
        name: "95%预测区间",
        type: "line",
        symbol: "none",
        data: x_data.map((e, _) => [e, upper_limit[_]]),
        lineStyle: {
          opacity: 0,
        },
        areaStyle: {
          color: "rgb(240, 77, 77)",
          opacity: 0.1,
        },
        zlevel: 1,
        emphasis: {
          disabled: true,
        },
      },
      {
        name: "95%预测区间",
        type: "line",
        symbol: "none",
        data: x_data.map((e, _) => [e, lower_limit[_]]),
        lineStyle: {
          opacity: 0,
        },
        areaStyle: {
          color: "#fff",
          opacity: 1,
        },
        zlevel: 1,
        emphasis: {
          disabled: true,
        },
      },
    ];
    let option = {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross", // 开启十字准线指示器
        },
        formatter: (param) => {
          let str = `${param[0].axisValue}`;
          str += `<div>${param[0].marker}${param[0].seriesName}:<span style="margin-left:20px;font-weight:600;float:right">${param[0].data[1]}</span><div>`;
          return str;
        },
      },
      color: ["#4C69FF", "#F04D4D", "rgba(240, 77, 77, 0.10)"],
      grid: {
        left: 40,
        right: 10,
        bottom: 20,
        top: 35,
        containLabel: true,
      },
      xAxis: {
        type: "value",
        name: 过程参数,
        nameLocation: "center",
        nameGap: 25,
        min: "dataMin",
        max: "dataMax",
        zlevel: 2,
        show: true,
        axisLine: {
          onZero: false,
        },
        axisLabel: {
          formatter: (val) => val.toFixed(2),
        },
        splitLine: {
          lineStyle: {
            type: "dashed",
          },
        },
      },
      yAxis: {
        type: "value",
        scale: true,
        name: 质量参数,
        nameLocation: "center",
        nameGap: 40,
        splitLine: {
          lineStyle: {
            type: "dashed",
          },
        },
        zlevel: 2,
        show: true,
      },
      legend: {
        data: ["拟合直线", "样本点", "95%预测区间"],
        data: [
          {
            name: "拟合直线",
          },
          {
            name: "样本点",
          },
          {
            name: "95%预测区间",
            icon: "roundRect",
            itemStyle: { color: "rgba(240, 77, 77, 0.10)" },
          },
        ],
        top: 5,
        type: "scroll",
        width: "70%",
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

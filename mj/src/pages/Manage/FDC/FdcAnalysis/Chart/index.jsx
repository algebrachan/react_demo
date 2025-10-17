import React, { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import { Button } from "antd";
import { options } from "less";
import ReactECharts from "echarts-for-react";
const MemoizedChart = React.memo(ReactECharts);
export const LineChart = ({ chart_data = {} }) => {
  const lineRef = useRef(null);
  const myChartRef = useRef(null);
  const initChart = () => {
    myChartRef.current = echarts.init(lineRef.current);
    const {
      xdata = [],
      ydata = [],
      title = "",
      abnormal_point = [],
    } = chart_data;
    let xAxis = {
      type: "category",
      data: xdata,
      axisLabel: {
        fontSize: 14,
      },
      axisLine: {
        onZero: false,
      },
      name: "x轴",
      nameLocation: "center",
      nameGap: 32,
      axisTick: {},
    };
    let yAxis = {
      show: false,
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
    let mark_point = [];
    abnormal_point.forEach((e) => {
      mark_point.push({
        xAxis: e[0],
        yAxis: e[1],
      });
    });
    let options = {
      title: {
        text: title,
      },
      tooltip: {
        trigger: "axis",
      },
      legend: {
        data: [],
      },
      toolbox: {
        feature: {
          dataZoom: {},
          restore: {},
          saveAsImage: {},
        },
      },
      grid: {
        left: 60,
        right: 20,
        bottom: 50,
        top: 50,
        // containLabel: true,
      },
      textStyle: {
        fontSize: 14,
        color: "#777777",
      },
      xAxis,
      yAxis,
      series: [
        {
          name: "数值",
          data: ydata,
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
      ],
    };

    myChartRef.current && myChartRef.current.setOption({ ...options }, true);
  };

  useEffect(() => {
    // if (Object.keys(chart_data).length > 0) {
    console.log("更新图表");
    initChart();
    // }
  }, [chart_data]);

  const myObserver = new ResizeObserver(() => {
    myChartRef.current?.resize();
  });
  useEffect(() => {
    myObserver.observe(lineRef.current);
    return () => {
      myObserver.disconnect();
      myChartRef.current?.dispose();
    };
  }, []);
  return (
    <div
      ref={lineRef}
      style={{
        width: "100%",
        height: 300,
        padding: 10,
      }}
    ></div>
  );
};

export const MemoLineChart = ({ chart_data = {} }) => {
  const [chart_opt, setChart_opt] = useState({});
  const [showAbnormal, setShowAbnormal] = useState(false);
  const initChart = () => {
    const { title = "", xdata = [], abnormal_point = [] } = chart_data;
    const ydataList = Object.keys(chart_data).filter((key) =>
      key.startsWith("ydata")
    );
    const temp_series = [];
    const temp_legend = [];
    ydataList.forEach((key) => {
      const ydata = chart_data[key];
      const name = key.split("_")[1] || key;
      temp_series.push({
        name: name,
        data: ydata,
        type: "line",
        symbol: "none",
      });
      temp_legend.push(name);
    });
    let xAxis = {
      data: xdata,
      // boundaryGap: false,
      type: "category",
      axisLabel: {
        fontSize: 14,
      },
      axisLine: {
        onZero: false,
      },
      name: "时间",
      nameLocation: "center",
      nameGap: 25,
      axisTick: {},
    };
    let yAxis = {
      show: false,
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
    let mark_point = [];
    if (showAbnormal) {
      abnormal_point.forEach((e) => {
        mark_point.push({
          xAxis: e[0],
          yAxis: e[1],
        });
      });
    } else {
      mark_point = [];
    }
    let series = [
      ...temp_series,
      {
        type: "line",
        markPoint: {
          symbol: "circle",
          symbolSize: 5,
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
        type: "scroll",
        data: temp_legend,
        top: 25,
      },
      grid: {
        left: 30,
        right: 20,
        bottom: 45,
        top: 60,
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
    return () => {
      setChart_opt({});
    };
  }, [chart_data, showAbnormal]);
  return (
    <div style={{ position: "relative" }} className="chart-container">
      <div style={{ position: "absolute", right: 0, zIndex: 2 }}>
        <Button
          type={showAbnormal ? "primary" : "default"}
          onClick={() => setShowAbnormal(!showAbnormal)}
        >
          异常点
        </Button>
      </div>
      <MemoizedChart
        option={chart_opt}
        style={{
          width: "100%",
          height: 340,
          padding: 5,
          // border: "1px solid #ccc",
        }}
      />
    </div>
  );
};

export const MemoScatterLineChart = ({ chart_data = {}, title = "" }) => {
  // 直接使用useMemo来缓存图表配置，避免不必要的重新计算
  const chartOpt = React.useMemo(() => {
    if (!chart_data || Object.keys(chart_data).length === 0) {
      return { title: { text: title, top: 0, left: 10 } };
    }

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

    return {
      // toolbox: {
      //   feature: {
      //     dataZoom: {},
      //     restore: {},
      //   },
      // },
      title: { text: title, top: 0, left: 10 },
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
        top: 10,
        type: "scroll",
        width: "90%",
      },
      grid: {
        left: 45,
        right: 50,
        bottom: 40,
        top: 40,
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
  }, [chart_data, title]); // 只有在依赖项变化时才重新计算

  return (
    <div className="chart-container">
      <MemoizedChart
        option={chartOpt}
        style={{
          width: "100%",
          height: 350,
          padding: 5,
        }}
        notMerge={true}
        lazyUpdate={true}
      />
    </div>
  );
};

export const MemoMultiLineChart = ({ chart_data = {}, title = "" }) => {
  // 使用useMemo缓存图表配置，避免不必要的重新计算
  const chartOpt = React.useMemo(() => {
    if (!chart_data || Object.keys(chart_data).length === 0) {
      return { title: { text: title, top: 0, left: 10 } };
    }

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

    return {
      title: { text: title, top: 0, left: 10 },
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
        top: 15,
        type: "scroll",
        width: "90%",
      },
      grid: {
        left: 30,
        right: 30,
        bottom: 40,
        top: 40,
        // containLabel: true,
      },
      // toolbox: {
      //   feature: {
      //     dataZoom: {},
      //     restore: {},
      //   },
      // },
      xAxis: {
        type: "value",
        name: "经过时间/s",
        nameLocation: "center",
        nameGap: 15,
        min: "dataMin",
        max: "dataMax",
      },
      yAxis: {
        // show: false,
        type: "value",
        scale: true,
      },
      series: temp_series,
    };
  }, [chart_data, title]); // 只有在依赖项变化时才重新计算

  return (
    <div className="chart-container">
      <MemoizedChart
        option={chartOpt}
        style={{
          width: "100%",
          height: 360,
          padding: 5,
        }}
        notMerge={true}
        lazyUpdate={true}
      />
    </div>
  );
};

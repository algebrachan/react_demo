import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { getCurrentTime } from "../../../../../utils/string";
import { Button } from "antd";
import { useState } from "react";

const ERROR_COLOR = [
  "#cf1322",
  "#d4380d",
  "#d46b08",
  "#d48806",
  "#ff7875",
  "#ff9c6e",
  "#ffc069",
  "#ffd666",
  "#eb2f96",
];

export const SpcChart = ({ chart_data = {}, lotnumbers = [] }) => {
  // 使用 useMemo 缓存图表配置，仅当 chart_data 或 lotnumbers 变化时重新计算

  const chartOption = useMemo(() => {
    if (Object.keys(chart_data).length === 0) {
      return {};
    }

    const { plot } = chart_data;
    const {
      CL,
      LCL,
      LSL,
      UCL,
      USL,
      data = [],
      title = "",
      violations = [],
    } = plot;

    let max = Math.max(...data, UCL, USL);
    let min = Math.min(...data, LCL, LSL);
    let rules_vio = {};

    violations.forEach((item) => {
      if (item.rule in rules_vio) {
        let old = rules_vio[item.rule];
        rules_vio[item.rule] = old.concat(item.violation);
      } else {
        rules_vio[item.rule] = item.violation;
      }
    });

    let xAxis = {
      type: "category",
      data: lotnumbers,
      axisLabel: {
        fontSize: 8,
        rotate: -90, // 旋转-90度，实现竖向排列
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
      max: max,
      min: min,
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
        data: data,
        symbol: "none",
        symbolSize: 5,
        color: "#223BB9",
        label: {
          show: false,
          color: "#223BB9",
          fontSize: 12,
          position: "top",
        },
      },
    ];

    let mark_line = [];
    if (LCL !== null) {
      mark_line.push({
        name: "LCL",
        yAxis: LCL,
        lineStyle: { color: "#6323AA" },
        label: { color: "#777", fontSize: 14, position: "insideEndTop" },
      });
    }
    if (LSL !== null) {
      mark_line.push({
        name: "LSL",
        yAxis: LSL,
        lineStyle: { color: "#6323AA" },
        label: { color: "#777", fontSize: 14, position: "insideStartTop" },
      });
    }
    if (CL !== null) {
      mark_line.push({
        name: "CL",
        yAxis: CL,
        lineStyle: { color: "#1E8FEE" },
        label: { color: "#777", fontSize: 14, position: "insideEndTop" },
      });
    }
    if (UCL !== null) {
      mark_line.push({
        name: "UCL",
        yAxis: UCL,
        lineStyle: { color: "#E52525" },
        label: { color: "#777", fontSize: 14, position: "insideEndTop" },
      });
    }
    if (USL !== null) {
      mark_line.push({
        name: "USL",
        yAxis: USL,
        lineStyle: { color: "#E52525" },
        label: { color: "#777", fontSize: 14, position: "insideStartTop" },
      });
    }

    let mark_point = [];
    // 异常点
    Object.keys(rules_vio).forEach((item, _) => {
      rules_vio[item].forEach((e) => {
        mark_point.push({
          xAxis: e,
          yAxis: data[e],
          itemStyle: {
            color: ERROR_COLOR[_],
          },
        });
      });
    });

    let cl_line = {
      type: "line",
      markLine: {
        symbol: "none",
        label: {
          position: "end",
          formatter: (val) => {
            const { name } = val;
            return name;
          },
        },
        precision: 3,
        data: mark_line,
        lineStyle: {
          width: 2,
        },
      },
      markPoint: {
        symbol: "circle",
        symbolSize: 4,
        data: mark_point,
      },
    };

    series.push(cl_line);

    return {
      tooltip: {
        trigger: "axis",
        formatter: (params) => {
          // 自定义tooltips
          if (params.length > 0) {
            const { axisValue, dataIndex } = params[0];
            let str = `序号:\t${axisValue}<br />`;
            str += `lot_number:\t${
              dataIndex < lotnumbers.length ? lotnumbers[dataIndex] : dataIndex
            }<br />`;
            params.forEach((item) => {
              str += `<div>${item.marker}${
                item.seriesName
              }:<span style="margin-left:20px;font-weight:600;float:right">${item.data.toFixed(
                3
              )}</span><div>`;
            });
            return str;
          } else {
            return "";
          }
        },
      },
      toolbox: {
        top: -5,
        feature: {
          dataZoom: {},
          saveAsImage: {
            name: getCurrentTime(),
          },
        },
      },
      title: {
        text: title,
        left: "center",
      },
      grid: {
        left: 40,
        right: 30,
        bottom: 65,
        top: 50,
      },
      xAxis,
      yAxis,
      series,
    };
  }, [chart_data, lotnumbers]);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const handleDoubleClick = () => {
    console.log("双击图表");
    setIsFullScreen(true);
  };
  return (
    <div onDoubleClick={handleDoubleClick}>
      <ReactECharts
        option={chartOption}
        style={{ width: "100%", height: 300, padding: 10 }}
        notMerge={true}
        lazyUpdate={true}
      />
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "#fff",
          zIndex: 9999,
          display: isFullScreen ? "block" : "none",
          overflow: "hidden",
        }}
      >
        {isFullScreen && (
          <div>
            <Button danger onClick={() => setIsFullScreen(false)}>
              关闭全屏
            </Button>
            <ReactECharts
              option={chartOption}
              style={{ width: "100%", height: 800, padding: 10 }}
              notMerge={true}
              lazyUpdate={true}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export const DistChart = ({ chart_data = {} }) => {
  // 使用 useMemo 缓存图表配置，仅当 chart_data 变化时重新计算
  const chartOption = useMemo(() => {
    if (Object.keys(chart_data).length === 0) {
      return {};
    }

    const { distribution = [], histogram = {} } = chart_data;
    const { bins = [], counts = [], title = "" } = histogram;

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

    return {
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
          saveAsImage: {
            name: getCurrentTime(),
          },
        },
      },
      title: {
        text: title,
        left: "center",
      },
      grid: {
        left: 60,
        right: 20,
        bottom: 20,
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
  }, [chart_data]);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const handleDoubleClick = () => {
    console.log("双击图表");
    setIsFullScreen(true);
  };

  return (
    <div onDoubleClick={handleDoubleClick}>
      <ReactECharts
        option={chartOption}
        style={{ width: "100%", height: 300, padding: 10 }}
        notMerge={true}
        lazyUpdate={true}
      />
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "#fff",
          zIndex: 9999,
          display: isFullScreen ? "block" : "none",
          overflow: "hidden",
        }}
      >
        {isFullScreen && (
          <div>
            <Button danger onClick={() => setIsFullScreen(false)}>
              关闭全屏
            </Button>
            <ReactECharts
              option={chartOption}
              style={{ width: "100%", height: 800, padding: 10 }}
              notMerge={true}
              lazyUpdate={true}
            />
          </div>
        )}
      </div>
    </div> 
  );
};

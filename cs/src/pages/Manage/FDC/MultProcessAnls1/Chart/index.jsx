import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";

const defaultColors = ['#ff7f50', '#87cefa', '#da70d6', '#32cd32', '#6495ed', '#ff69b4', '#ba55d3', 
  '#cd5c5c', '#ffa500', '#40e0d0', '#1e90ff', '#ff6347', '#7b68ee', '#00fa9a', 
  '#ffd700', '#6699FF', '#ff6666', '#3cb371', '#b8860b', '#30e0e0'] 
// 过程曲线
export const LineChart1 = ({ chart_data = {} }) => {
  const lineRef = useRef(null);
  const myChartRef = useRef(null);
  const initChart = () => {
    myChartRef.current = echarts.init(lineRef.current);
    const {
      separation_line = [],
      xdata = [],
      ydata = {},
      abnormal_point = [],
    } = chart_data;
    let xAxis = {
      type: "category",
      name: "时间",
      nameLocation: "center",
      nameGap: 25,
    };
    let legend_temp = []
    let yAxis = []
    // let yAxis = {
    //   type: "value",
    //   scale: true,
    //   name: "数值",
    //   nameLocation: "center",
    //   nameGap: 40,
    // };
    let series = [
      // {
      //   name: "过程散点",
      //   type: "scatter",
      //   symbolSize: 2,
      //   data: xdata.map((x, _) => [x, ydata[_]]),
      // },
      {
        type: "line",
        name: "分割线",
        markLine: {
          symbol: "none",
          data: separation_line.map((e) => ({ xAxis: e })),
          lineStyle: {
            width: 2,
            color: "#ffc069",
          },
          label: {
            show: false,
          },
        },
      },
      {
        name: "异常点",
        type: "scatter",
        symbolSize: 5,
        data: abnormal_point,
        color: "#ff4d4f",
      },
    ];
    Object.keys(ydata).forEach((item, idx) => {
      // 使用 ECharts 默认颜色
      const color = defaultColors[idx % defaultColors.length]; 
      
      series.push({
        yAxisIndex: idx,
        name: item,
        type: "line",
        symbol: "none",
        data: ydata[item].map((e, _) => [xdata[_], e]),
        color: color // 设置系列颜色
      });
      
      yAxis.push({
        type: "value",
        scale: true,
        name: item,
        nameLocation: "center",
        offset: idx === 0 ? 0 : 35 * Math.min(idx - 1, 10),
        nameGap: 30,
        nameTextStyle: {
          color: color // 设置 y 轴名称颜色和系列颜色一致
        }
      });
      
      legend_temp.push(item);
    });


    let option = {
      legend: {
        data: legend_temp,
        type: "scroll",
        width: "90%",
      },
      tooltip: {
        trigger: "item",
        axisPointer: {
          type: "cross",
        },
        formatter: (params) => {
          // 自定义tooltips
          let str = `时间:\t${params[0].axisValue}<br />`;
          params.forEach((item) => {
            str += `<div>${item.marker}${item.seriesName}:<span style="margin-left:20px;font-weight:600;float:right">${item.data[1]}</span><div>`;
          });
          return str;
        },
      },
      toolbox: {
        top: -5,
        feature: {
          dataZoom: {},
          saveAsImage: {},
          restore: {},
        },
      },
      dataZoom: {
        show: true,
        realtime: true,
        start: 0,
        end: 20,
        xAxisIndex: [0, 1],
      },
      grid: {
        left: 60,
        right: 40 * Math.min(yAxis.length, 10),
        bottom: 80,
        top: 30,
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
// 堆叠过程曲线
export const LineChart2 = ({ chart_data = {} }) => {
  const lineRef = useRef(null);
  const myChartRef = useRef(null);
  const initChart = () => {
    myChartRef.current = echarts.init(lineRef.current);
    let key_list = Object.keys(chart_data);
    const { xdata } = chart_data;
    let temp_series = [];
    let temp_legend = [];
    key_list.forEach((x, _) => {
      if (x !== "xdata") {
        temp_legend.push(x);
        temp_series.push({
          name: x,
          type: "line",
          symbol: "none",
          data: chart_data[x].map((item, _) => [xdata[_], item]),
        });
      }
    });
    let xAxis = {
      type: "value",
      name: "样本点数",
      nameLocation: "center",
      nameGap: 20,
      min: "dataMin",
      max: "dataMax",
      axisLine: {
        onZero: false,
      },
    };
    let yAxis = {
      type: "value",
      scale: true,
      name: "数值",
      nameLocation: "center",
      nameGap: 30,
    };
    let option = {
      tooltip: {
        trigger: "axis",
        formatter: (params) => {
          // 自定义tooltips
          let str = `样本点数:\t${params[0].axisValue}<br />`;
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
      toolbox: {
        top: 0,
        feature: {
          dataZoom: {},
          saveAsImage: {},
          restore: {},
        },
      },
      grid: {
        left: 50,
        right: 30,
        bottom: 40,
        top: 30,
      },
      xAxis,
      yAxis,
      series: temp_series,
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
      style={{ width: "100%", height: 260, padding: 10 }}
      ref={lineRef}
    ></div>
  );
};
// 密度分布图
export const LineChart3 = ({ chart_data = {} }) => {
  const lineRef = useRef(null);
  const myChartRef = useRef(null);
  const initChart = () => {
    myChartRef.current = echarts.init(lineRef.current);
    let key_list = Object.keys(chart_data);
    let temp_series = [];
    let temp_legend = [];
    key_list.forEach((x, _) => {
      let { xdata = [], ydata = [] } = chart_data[x];
      temp_legend.push(x);
      temp_series.push({
        name: x,
        type: "line",
        symbol: "none",
        data: xdata.map((item, _) => [item, ydata[_]]),
      });
    });
    let xAxis = {
      type: "value",
      name: "数值",
      nameLocation: "center",
      nameGap: 25,
      min: "dataMin",
      max: "dataMax",
      axisLine: {
        onZero: false,
      },
    };
    let yAxis = {
      type: "value",
      scale: true,
      name: "密度",
      nameLocation: "center",
      nameGap: 30,
      axisLine: {
        onZero: false,
      },
    };
    let option = {
      tooltip: {
        trigger: "axis",
        formatter: (params) => {
          // 自定义tooltips
          let str = `数值:\t${params[0].axisValue}<br />`;
          params.forEach((item) => {
            str += `<div>${item.marker}${item.seriesName}:<span style="margin-left:20px;font-weight:600;float:right">${item.data[1]}</span><div>`;
          });
          return str;
        },
      },
      toolbox: {
        top: -5,
        feature: {
          dataZoom: {},
          saveAsImage: {},
          restore: {},
        },
      },
      legend: {
        data: temp_legend,
        right: 0,
        top: 30,
        orient: "vertical",
        type: "scroll",
      },
      grid: {
        left: 50,
        right: 100,
        bottom: 40,
        top: 30,
      },
      xAxis,
      yAxis,
      series: temp_series,
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
      style={{ width: "100%", height: 260, padding: 10 }}
      ref={lineRef}
    ></div>
  );
};
// 通道管控图
export const ScatterLineChart1 = ({ chart_data = {} }) => {
  const lineRef = useRef(null);
  const myChartRef = useRef(null);
  const initChart = () => {
    myChartRef.current = echarts.init(lineRef.current);
    const {
      xdata = [],
      上边界y = [],
      下边界y = [],
      中线y = [],
      散点 = [],
    } = chart_data;
    let series = [
      {
        name: "中线",
        type: "line",
        symbol: "none",
        data: xdata.map((x, _) => [x, 中线y[_]]),
        color: "#768DD1",
        lineStyle: {
          width: 1,
        },
      },
      {
        name: "下边界",
        type: "line",
        symbol: "none",
        data: xdata.map((x, _) => [x, 下边界y[_]]),
        color: "#A7D691",
        lineStyle: {
          type: "dashed",
          width: 1,
        },
      },
      {
        name: "上边界",
        type: "line",
        symbol: "none",
        data: xdata.map((x, _) => [x, 上边界y[_]]),
        color: "#F18585",
        lineStyle: {
          type: "dashed",
          width: 1,
        },
      },
      {
        name: "散点",
        type: "scatter",
        data: 散点,
        symbolSize: 2,
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
      // toolbox: {
      //   feature: {
      //     dataZoom: {},
      //     saveAsImage: {},
      //     restore: {},
      //   },
      // },
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
        name: "样本数量",
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
        axisLine: {
          onZero: false,
        },
      },
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
      style={{ width: "100%", height: 260, padding: 10 }}
      ref={lineRef}
    ></div>
  );
};
// 聚类分析
export const ScatterLineChart2 = ({ chart_data = {} }) => {
  const lineRef = useRef(null);
  const myChartRef = useRef(null);
  const initChart = () => {
    myChartRef.current = echarts.init(lineRef.current);
    const {
      x_data = [],
      y_data: { 类别1 = {}, 类别2 = {} },
      聚类中心: { 聚类中心1 = [], 聚类中心2 = [] },
    } = chart_data;

    let temp_legend = [];
    let temp_series = [];
    Object.keys(类别1).forEach((e, _) => {
      temp_legend.push(e);
      temp_series.push({
        name: e,
        type: "line",
        symbol: "none",
        smooth: true,
        data: 类别1[e].map((item, _) => [x_data[_], item]),
        color: "#ffa39e",
        lineStyle: {
          type: "dashed",
        },
      });
    });
    Object.keys(类别2).forEach((e, _) => {
      temp_legend.push(e);
      temp_series.push({
        name: e,
        type: "line",
        symbol: "none",
        smooth: true,
        data: 类别2[e].map((item, _) => [x_data[_], item]),
        color: "#b5f5ec",
        lineStyle: {
          type: "dashed",
        },
      });
    });
    temp_legend.push("聚类中心1");
    temp_series.push({
      name: "聚类中心1",
      type: "line",
      symbol: "none",
      smooth: true,
      data: 聚类中心1.map((item, _) => [x_data[_], item]),
      color: "#f5222d",
    });
    temp_legend.push("聚类中心2");
    temp_series.push({
      name: "聚类中心2",
      type: "line",
      symbol: "none",
      smooth: true,
      data: 聚类中心2.map((item, _) => [x_data[_], item]),
      color: "#0958d9",
    });
    let xAxis = {
      type: "value",
      name: "样本点数",
      nameLocation: "center",
      nameGap: 25,
      min: "dataMin",
      max: "dataMax",
      axisLine: {
        onZero: false,
      },
    };
    let yAxis = {
      type: "value",
      scale: true,
      axisLine: {
        onZero: false,
      },
    };
    let option = {
      tooltip: {
        trigger: "axis",
        formatter: (params) => {
          // 自定义tooltips
          let str = `样本点数:\t${params[0].axisValue}<br />`;
          params.forEach((item) => {
            str += `<div>${item.marker}${item.seriesName}:<span style="margin-left:20px;font-weight:600;float:right">${item.data[1]}</span><div>`;
          });
          return str;
        },
      },
      toolbox: {
        top: -5,
        feature: {
          dataZoom: {},
          saveAsImage: {},
          restore: {},
        },
      },
      legend: {
        data: temp_legend,
        right: 0,
        top: 30,
        orient: "vertical",
        type: "scroll",
      },
      grid: {
        left: 50,
        right: 120,
        bottom: 40,
        top: 30,
      },
      xAxis,
      yAxis,
      series: temp_series,
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
    };
  }, [chart_data]);

  return (
    <div
      style={{ width: "100%", height: 260, padding: 10 }}
      ref={lineRef}
    ></div>
  );
};

// 相似度矩阵
export const HeatChart = ({ chart_data = {} }) => {
  const heatRef = useRef(null);
  const myChartRef = useRef(null);
  const initChart = () => {
    myChartRef.current = echarts.init(heatRef.current);
    const {
      相似度矩阵: { x标签 = [], y标签 = [], 数据 = [] },
    } = chart_data;
    let temp_data = 数据.map((e) => e[2]);
    let min = Math.min(...temp_data);
    let max = Math.max(...temp_data);
    let option = {
      title: {
        text: `相似度矩阵`,
        show: true,
        left: "center",
      },
      tooltip: {
        position: "top",
      },
      textStyle: {
        fontSize: 14,
      },
      grid: {
        top: 30,
        letf: 50,
        right: 80,
        bottom: 25,
      },
      xAxis: {
        type: "category",
        data: x标签,
        splitArea: {
          show: true,
        },
      },
      yAxis: {
        type: "category",
        data: y标签,
        splitArea: {
          show: true,
        },
      },
      visualMap: {
        show: true,
        min,
        max,
        calculable: true,
        itemWidth: 15,
        // align: "left",
        right: 0,
        top: "center",
        color: ["#1d39c4", "#36cfc9", "#ffe58f"],
      },
      series: [
        {
          name: "相似度",
          type: "heatmap",
          data: 数据,
          label: {
            show: true,
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
    };
    myChartRef.current && myChartRef.current.setOption({ ...option }, true);
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
    myObserver.observe(heatRef.current);
    return () => {
      myObserver.disconnect();
    };
  }, [chart_data]);
  return (
    <div
      style={{ width: "100%", height: 260, padding: 10 }}
      ref={heatRef}
    ></div>
  );
};

// 相似度排序
export const BarChart = ({ chart_data = {} }) => {
  const barRef = useRef(null);
  const myChartRef = useRef(null);
  const initChart = () => {
    myChartRef.current = echarts.init(barRef.current);
    const { 相似度排序 = {} } = chart_data;
    let temp_data = Object.keys(相似度排序).map((e) => [相似度排序[e], e]);
    let xAxis = {
      type: "value",
    };
    let yAxis = {
      type: "category",
      name: "批次",
      nameLocation: "center",
      nameGap: 10,
      axisLabel: {
        show: false,
      },
    };
    let series = [
      {
        data: temp_data,
        type: "bar",
        label: {
          show: true,
          position: "insideLeft",
          formatter: (params) => {
            const { name, data } = params;
            return `${name}: ${data[0]}`;
          },
        },
      },
    ];
    let option = {
      tooltip: {
        trigger: "item",
      },
      color: "#91d5ff",
      toolbox: {
        top: -5,
        feature: {
          dataZoom: {},
          saveAsImage: {},
          restore: {},
        },
      },
      grid: {
        left: 40,
        right: 30,
        bottom: 30,
        top: 20,
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

// DTW路径图
export const LineChart4 = ({ chart_data = {} }) => {
  const lineRef = useRef(null);
  const myChartRef = useRef(null);
  const initChart = () => {
    myChartRef.current = echarts.init(lineRef.current);
    const { DTW路径 = {} } = chart_data;
    let temp_series = [];
    let temp_legend = [];
    Object.keys(DTW路径).forEach((x, _) => {
      let { xdata = [], ydata = [] } = DTW路径[x];
      temp_legend.push(x);
      temp_series.push({
        name: x,
        type: "line",
        symbol: "none",
        smooth: true,
        data: xdata.map((item, _) => [item, ydata[_]]),
      });
    });
    let xAxis = {
      type: "value",
      name: "样本点数",
      nameLocation: "center",
      nameGap: 25,
      min: "dataMin",
      max: "dataMax",
      axisLine: {
        onZero: false,
      },
    };
    let yAxis = {
      type: "value",
      scale: true,
      name: "样本点数",
      min: "dataMin",
      max: "dataMax",
      nameLocation: "center",
      nameGap: 40,
      axisLine: {
        onZero: false,
      },
    };
    let option = {
      tooltip: {
        trigger: "axis",
        formatter: (params) => {
          // 自定义tooltips
          let str = `样本点数:\t${params[0].axisValue}<br />`;
          params.forEach((item) => {
            str += `<div>${item.marker}${item.seriesName}:<span style="margin-left:20px;font-weight:600;float:right">${item.data[1]}</span><div>`;
          });
          return str;
        },
      },
      toolbox: {
        top: -5,
        feature: {
          dataZoom: {},
          saveAsImage: {},
          restore: {},
        },
      },
      grid: {
        left: 70,
        right: 100,
        bottom: 40,
        top: 30,
      },
      legend: {
        data: temp_legend,
        right: 0,
        top: 30,
        orient: "vertical",
        type: "scroll",
      },
      xAxis,
      yAxis,
      series: temp_series,
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
      style={{ width: "100%", height: 260, padding: 10 }}
      ref={lineRef}
    ></div>
  );
};

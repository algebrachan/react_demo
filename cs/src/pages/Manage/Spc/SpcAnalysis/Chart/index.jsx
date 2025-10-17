import React, { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import { Button, Empty, InputNumber, message, Space } from "antd";
import { Select } from "antd";
import { selectList2Option } from "../../../../../utils/string";
import ReactECharts from "echarts-for-react";

export const SpcChart = ({ chart_data = {}, outlier = [] }) => {
  const lineRef = useRef(null);
  const myChartRef = useRef(null);
  const [up, setUp] = useState(0);
  const [down, setDown] = useState(0);
  const initChart = () => {
    myChartRef.current = echarts.init(lineRef.current);
    const { LCL, LSL, Target, UCL, USL, dataList } = chart_data;

    let max = Math.max(UCL, USL, ...dataList.map((item) => item.value));
    let min = Math.min(LCL, LSL, ...dataList.map((item) => item.value));
    setDown(min);
    setUp(max);
    let xAxis = {
      type: "category",
      // data: xData,
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
        data: dataList.map((item) => [
          item["statTime"],
          item["value"],
          item["furnace"] ? item["furnace"] : null,
        ]),
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
    if (Target !== null) {
      mark_line.push({
        name: "Target",
        yAxis: Target,
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
    outlier.forEach((e, _) => {
      let idx = e;
      mark_point.push({
        xAxis: dataList[idx]?.["statTime"],
        yAxis: dataList[idx]?.["value"],
      });
    });
    let cl_line = {
      type: "line",
      markLine: {
        symbol: "none",
        label: {
          position: "end",
          formatter: (val) => {
            const { name, value } = val;
            return name;
            // return `${name} : ${value}`;
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
        symbolSize: 5,
        itemStyle: {
          color: "#f5222d",
        },
        data: mark_point,
      },
    };
    series.push(cl_line);
    let option = {
      tooltip: {
        trigger: "axis",
        formatter: (params) => {
          // 自定义tooltips
          const { axisValue, dataIndex } = params[0];
          let str = `时间: ${axisValue}<br />`;
          params.forEach((item) => {
            if (item.data[2] !== null) {
              str += `<div>炉次号:<span style="margin-left:20px;font-weight:600;float:right">${item.data[2]}</span><div>`;
            }
            str += `<div>${item.marker}${item.seriesName}:<span style="margin-left:20px;font-weight:600;float:right">${item.data[1]}</span><div>`;
          });
          return str;
        },
      },
      // toolbox: {
      //   top:-5,
      //   feature: {
      //     dataZoom: {
      //       yAxisIndex: 'none'
      //     },
      //     restore: {},
      //   }
      // },
      // dataZoom: [
      //   // Y轴滑块dataZoom
      //   {
      //     type: 'slider',
      //     orient: 'vertical',
      //     yAxisIndex: 0,
      //     start: 0,
      //     end: 100,
      //     zoomLock: false,
      //     filterMode: 'filter',
      //     left:0,
      //     width:30,
      //   },
      //   // 可选：X轴缩放（如需要）
      // ],
      grid: {
        left: 30,
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
  const handleUpDown = () => {
    if (down === null || up === null) {
      message.warning("请输入正确的上下限");
      return;
    }
    if (down >= up) {
      message.warning("上限必须大于下限");
      return;
    }
    // 应用更新
    myChartRef.current?.setOption({
      yAxis: [
        {
          min: down,
          max: up,
        },
      ],
    });
  };
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
    <div style={{ position: "relative" }}>
      <Space style={{ position: "absolute", top: -37, right: 10 }}>
        <InputNumber placeholder="请输入下限" value={down} onChange={setDown} />
        <div>-</div>
        <InputNumber placeholder="请输入上限" value={up} onChange={setUp} />
        <Button type="primary" onClick={handleUpDown}>
          确认
        </Button>
      </Space>
      <div
        style={{ width: "100%", height: 260, padding: 10 }}
        ref={lineRef}
      ></div>
    </div>
  );
};

export const DistChart = ({ chart_data = {} }) => {
  const distRef = useRef(null);
  const myChartRef = useRef(null);
  const initChart = () => {
    myChartRef.current || (myChartRef.current = echarts.init(distRef.current));
    const { distribution = [], histogram = {} } = chart_data;
    const { bins = [], counts = [] } = histogram;
    let yAxis = {
      type: "category",
      data: bins,
      inverse: true,
    };
    let xAxis = [
      {
        position: "top",
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
      grid: {
        left: 40,
        right: 20,
        bottom: 20,
        top: 20,
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
      style={{ width: "100%", height: 260, padding: 10 }}
      ref={distRef}
    ></div>
  );
};

const MemoizedChart = React.memo(ReactECharts);
export const ProcessSpcChart = ({ chart_data = {} }) => {
  const [chart_opt, setChartOpt] = useState({});
  const [dev_list, setDevList] = useState([]);
  const [dev, setDev] = useState("");

  const initChart = () => {
    const chart_obj = chart_data[dev];
    if (chart_obj) {
      const legend_list = [];
      const series = [];
      Object.keys(chart_obj)
        .filter((key) => key !== "x_data")
        .forEach((key) => {
          // 处理每个非x_data的键
          legend_list.push(key);
          series.push({
            name: key,
            type: "line",
            data: chart_obj[key].map((item, index) => [
              chart_obj["x_data"][index],
              item,
            ]),
            symbol: "circle",
            symbolSize: 5,
          });
        });

      const options = {
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: legend_list,
          top: 10,
          type: "scroll",
        },
        grid: {
          left: 40,
          right: 30,
          bottom: 50,
          top: 50,
          containLabel: true,
        },
        xAxis: {
          type: "category",
          name: "片号",
          nameLocation: "center",
          nameGap: 32,
          axisLabel: {
            fontSize: 14,
          },
          axisLine: {
            onZero: false,
          },
        },
        yAxis: {
          type: "value",
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
        },
        series,
      };
      setChartOpt(options);
    } else {
      setChartOpt({});
    }
  };

  useEffect(() => {
    if (dev) {
      initChart();
    } else {
      setChartOpt({});
    }
  }, [dev]);

  useEffect(() => {
    const d_list = Object.keys(chart_data);
    if (d_list.length > 0) {
      setDevList(d_list);
      setDev(d_list[0]);
    } else {
      setDevList();
      setDev("");
    }
  }, [chart_data]);

  return (
    <div style={{ position: "relative" }}>
      <Space style={{ position: "absolute", top: -37, right: 10 }}>
        <Select
          style={{ width: 120 }}
          options={selectList2Option(dev_list)}
          value={dev}
          onChange={(val) => setDev(val)}
        />
      </Space>
      {dev ? (
        <MemoizedChart
          option={chart_opt}
          style={{ height: 300, width: "100%" }}
        />
      ) : (
        <Empty style={{ height: 300, width: "100%" }} />
      )}
    </div>
  );
};

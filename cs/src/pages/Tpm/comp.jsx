import React, { useEffect, useState } from "react";
import { ConfigProvider, Flex, Space, Table } from "antd";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";
import "echarts-gl";
import { readUsers } from "../../apis/auth_api";

const MemoizedChart = React.memo(ReactECharts);

export const StatusBar = ({ data = {} }) => {
  const [chart_opt, setChartOpt] = useState({});

  const generatePieChartOption = ({
    titleText,
    dataSource,
    seriesName,
    completedColor,
    uncompletedColor,
  }) => {
    const completed = dataSource["completedCount"] || 0;
    const total = dataSource["totalCount"] || 0;
    const percentage =
      ((dataSource["completeRate"] || 0) * 100).toFixed(2) + "%";
    const baseConfig = {
      textStyle: { color: "#fff" },
      title: {
        text: titleText,
        left: 0,
        top: 5,
        textStyle: {
          fontSize: 16,
          fontWeight: "normal",
          color: "#fff",
        },
      },
      tooltip: {
        trigger: "item",
        formatter: `{a} <br/>{b}: {c} ({d}%)`,
        backgroundColor: "rgba(17, 35, 61, 0.8)",
        textStyle: { color: "#fff" },
      },
      series: [
        {
          name: seriesName,
          type: "pie",
          radius: ["50%", "70%"],
          center: ["50%", "50%"],
          avoidLabelOverlap: false,
          label: {
            show: true,
            position: "center",
            formatter: `${completed}/${total}`,
            fontSize: 20,
            fontWeight: "bold",
            color: "#fff",
          },
          labelLine: { show: false },
          data: [
            {
              value: completed,
              name: "已完成",
              itemStyle: { color: completedColor },
            },
            {
              value: total - completed,
              name: "未完成",
              itemStyle: { color: uncompletedColor },
            },
          ],
        },
      ],
      graphic: {
        elements: [
          {
            type: "text",
            right: 0,
            bottom: 10,
            style: {
              text: percentage,
              fontSize: 18,
              fontWeight: "bold",
              fill: "#fff",
            },
          },
        ],
      },
    };
    return baseConfig;
  };

  const generateBarChartOption = (titleText, dataSource) => {
    // 数据处理（排序、提取name和value）
    const sortedData = dataSource.sort((a, b) => a.rank - b.rank);
    const names = sortedData.map((item) => item.name);
    const values = sortedData.map((item) => Number(item.value));

    return {
      textStyle: { color: "#fff" },
      title: {
        text: titleText,
        top: 10,
        left: "left",
        textStyle: { fontSize: 16, color: "#fff" },
      },
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        backgroundColor: "rgba(17, 35, 61, 0.8)",
        textStyle: { color: "#fff" },
      },
      grid: { top: 40, left: 100, right: 40, bottom: 20 },
      xAxis: {
        type: "value",
        splitLine: { show: false },
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { show: false },
      },
      yAxis: {
        type: "category",
        splitLine: { show: false },
        axisLine: { show: false },
        axisTick: { show: false },
        inverse: true,
        data: names,
        axisLabel: {
          margin: 2,
          rich: {
            a1: {
              color: "#fff",
              backgroundColor: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: "rgba(245, 10, 14, 1)" },
                { offset: 1, color: "rgba(25, 38, 60, 0)" },
              ]),
              width: 40,
              height: 30,
              align: "center",
              borderRadius: 2,
            },
            a2: {
              color: "#fff",
              backgroundColor: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: "rgba(255, 135, 28, 1)" },
                { offset: 1, color: "rgba(25, 38, 60, 0)" },
              ]),
              width: 40,
              height: 30,
              align: "center",
              borderRadius: 2,
            },
            a3: {
              color: "#fff",
              backgroundColor: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: "rgba(3, 255, 251, 1)" },
                { offset: 1, color: "rgba(25, 38, 60, 0)" },
              ]),
              width: 40,
              height: 30,
              align: "center",
              borderRadius: 2,
            },
          },
          formatter: function (params) {
            const matchedItem = sortedData.find((item) => item.name === params);
            let index = matchedItem ? matchedItem.rank : 0;
            const serialNumber = `NO.${index}`;
            return index <= 3
              ? [`{a${index}|${serialNumber}}{b|${params}}`].join("")
              : [`{default|${serialNumber}}{b|${params}}`].join("");
          },
        },
      },
      series: [
        {
          type: "bar",
          data: values,
          barWidth: 15,
          showBackground: true,
          backgroundStyle: {
            color: "rgba(180, 180, 180, 0.2)",
            borderRadius: [10, 10, 10, 10],
          },
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: "#818181" },
              { offset: 1, color: "#DCEFFF" },
            ]),
            borderRadius: [10, 10, 10, 10],
          },
          tooltip: { valueFormatter: (val) => val + " 个" },
          label: {
            show: true,
            position: [110, 2],
            valueAnimation: true,
            color: "#fff",
            formatter: "{num|{c}}{unit|个}",
            rich: {
              num: { color: "#ffff00", align: "right" },
              unit: { color: "#ffffff", align: "right" },
            },
          },
        },
      ],
    };
  };

  useEffect(() => {
    const {
      inspectCompletedInfo = {},
      maintainAchieveInfo = {},
      frequentRepairDevices = [],
      omitInspectDevices = [],
    } = data;

    const option1 = generatePieChartOption({
      titleText: "今日巡检完成率",
      dataSource: inspectCompletedInfo,
      seriesName: "巡检",
      completedColor: "#FB8700",
      uncompletedColor: "#6F6716",
    });

    const option2 = generatePieChartOption({
      titleText: "本月保养达成率",
      dataSource: maintainAchieveInfo,
      seriesName: "保养",
      completedColor: "#38D7FF",
      uncompletedColor: "#1C6F83",
      hasTextStyle: false,
    });

    const option3 = generateBarChartOption(
      "最近7天漏检设备Top3",
      omitInspectDevices
    );
    const option4 = generateBarChartOption(
      "高频故障设备Top3",
      frequentRepairDevices
    );
    setChartOpt({
      chart1: option1,
      chart2: option2,
      chart3: option3,
      chart4: option4,
    });
  }, [data]);

  return (
    <Flex justify="space-between">
      <Flex vertical gap={10}>
        <Flex className="box1" justify="space-between">
          <Flex vertical gap={5}>
            <div>待巡检数量</div>
            <div className="count1">
              {data?.inspectCompletedInfo?.pendingExecuteCount ?? 0}
            </div>
          </Flex>
          <div className="icon1" />
        </Flex>
        <div className="box2">
          <MemoizedChart
            option={chart_opt["chart1"] || {}}
            style={{ height: 200, width: "100%" }}
          />
        </div>
      </Flex>
      <Flex vertical gap={10}>
        <Flex className="box1" justify="space-between">
          <Flex vertical gap={5}>
            <div>待保养数量</div>
            <div className="count2">
              {data?.maintainAchieveInfo?.pendingExecuteCount ?? 0}
            </div>
          </Flex>
          <div className="icon2" />
        </Flex>
        <div className="box2">
          <MemoizedChart
            option={chart_opt["chart2"] || {}}
            style={{ height: 200, width: "100%" }}
          />
        </div>
      </Flex>
      <Flex vertical gap={10}>
        <Flex className="box1" justify="space-between">
          <Flex vertical gap={5}>
            <div>待维修数量</div>
            <div className="count3">{data?.uncompletedRepairCount ?? 0}</div>
          </Flex>
          <div className="icon3" />
        </Flex>
        <div className="box2">
          <MemoizedChart
            option={chart_opt["chart3"] || {}}
            style={{ height: 200, width: "100%" }}
          />
        </div>
      </Flex>
      <Flex vertical gap={10}>
        <Flex className="box1" justify="space-between">
          <Flex vertical gap={5}>
            <div>待验收数量</div>
            <div className="count4">
              {data?.uncompletedAcceptanceCount ?? 0}
            </div>
          </Flex>
          <div className="icon4" />
        </Flex>
        <div className="box2">
          <MemoizedChart
            option={chart_opt["chart4"] || {}}
            style={{ height: 200, width: "100%" }}
          />
        </div>
      </Flex>
    </Flex>
  );
};

function getParametricEquation(startRatio, endRatio, isSelected, isHovered, k) {
  // 计算
  let midRatio = (startRatio + endRatio) / 2;

  let startRadian = startRatio * Math.PI * 2;
  let endRadian = endRatio * Math.PI * 2;
  let midRadian = midRatio * Math.PI * 2;

  // 如果只有一个扇形，则不实现选中效果。
  if (startRatio === 0 && endRatio === 1) {
    isSelected = false;
  }

  // 通过扇形内径/外径的值，换算出辅助参数 k（默认值 1/3）
  k = typeof k !== "undefined" ? k : 1 / 3;

  // 计算选中效果分别在 x 轴、y 轴方向上的位移（未选中，则位移均为 0）
  let offsetX = isSelected ? Math.cos(midRadian) * 0.1 : 0;
  let offsetY = isSelected ? Math.sin(midRadian) * 0.1 : 0;

  // 计算高亮效果的放大比例（未高亮，则比例为 1）
  let hoverRate = isHovered ? 1.05 : 1;

  // 返回曲面参数方程
  return {
    u: {
      min: -Math.PI,
      max: Math.PI * 3,
      step: Math.PI / 32,
    },

    v: {
      min: 0,
      max: Math.PI * 2,
      step: Math.PI / 20,
    },

    x: function (u, v) {
      if (u < startRadian) {
        return (
          offsetX + Math.cos(startRadian) * (1 + Math.cos(v) * k) * hoverRate
        );
      }
      if (u > endRadian) {
        return (
          offsetX + Math.cos(endRadian) * (1 + Math.cos(v) * k) * hoverRate
        );
      }
      return offsetX + Math.cos(u) * (1 + Math.cos(v) * k) * hoverRate;
    },

    y: function (u, v) {
      if (u < startRadian) {
        return (
          offsetY + Math.sin(startRadian) * (1 + Math.cos(v) * k) * hoverRate
        );
      }
      if (u > endRadian) {
        return (
          offsetY + Math.sin(endRadian) * (1 + Math.cos(v) * k) * hoverRate
        );
      }
      return offsetY + Math.sin(u) * (1 + Math.cos(v) * k) * hoverRate;
    },

    z: function (u, v) {
      if (u < -Math.PI * 0.5) {
        return Math.sin(u);
      }
      if (u > Math.PI * 2.5) {
        return Math.sin(u);
      }
      return Math.sin(v) > 0 ? 2 : -2;
    },
  };
}
// 生成模拟 3D 饼图的配置项
function getPie3D(pieData, total, internalDiameterRatio) {
  let series = [];
  let sumValue = 0;
  let startValue = 0;
  let endValue = 0;
  let legendData = [];
  let k =
    typeof internalDiameterRatio !== "undefined"
      ? (1 - internalDiameterRatio) / (1 + internalDiameterRatio)
      : 1 / 3;

  // 为每一个饼图数据，生成一个 series-surface 配置
  for (let i = 0; i < pieData.length; i++) {
    sumValue += pieData[i].value;

    let seriesItem = {
      name:
        typeof pieData[i].name === "undefined" ? `series${i}` : pieData[i].name,
      type: "surface",
      parametric: true,
      wireframe: {
        show: false,
      },
      pieData: pieData[i],
      pieStatus: {
        selected: false,
        hovered: false,
        k: k,
      },
    };

    if (typeof pieData[i].itemStyle != "undefined") {
      let itemStyle = {};

      typeof pieData[i].itemStyle.color != "undefined"
        ? (itemStyle.color = pieData[i].itemStyle.color)
        : null;
      typeof pieData[i].itemStyle.opacity != "undefined"
        ? (itemStyle.opacity = pieData[i].itemStyle.opacity)
        : null;

      seriesItem.itemStyle = itemStyle;
    }
    series.push(seriesItem);
  }

  // 使用上一次遍历时，计算出的数据和 sumValue，调用 getParametricEquation 函数，
  // 向每个 series-surface 传入不同的参数方程 series-surface.parametricEquation，也就是实现每一个扇形。
  for (let i = 0; i < series.length; i++) {
    endValue = startValue + series[i].pieData.value;

    series[i].pieData.startRatio = startValue / sumValue;
    series[i].pieData.endRatio = endValue / sumValue;
    series[i].parametricEquation = getParametricEquation(
      series[i].pieData.startRatio,
      series[i].pieData.endRatio,
      true,
      false,
      1
    );

    startValue = endValue;

    legendData.push(series[i].name);
  }

  // 补充一个透明的圆环，用于支撑高亮功能的近似实现。
  series.push({
    name: "mouseoutSeries",
    type: "surface",
    parametric: true,
    center: ["20%", "50%"],
    wireframe: {
      show: false,
    },
    itemStyle: {
      opacity: 1,
      color: "rgba(18,236,252,0.5)",
    },
    parametricEquation: {
      u: {
        min: 0,
        max: Math.PI * 2,
        step: Math.PI / 20,
      },
      v: {
        min: 0,
        max: Math.PI,
        step: Math.PI / 1.4,
      },
      x: function (u, v) {
        return Math.sin(v) * Math.sin(u) + Math.sin(u);
      },
      y: function (u, v) {
        return Math.sin(v) * Math.cos(u) + Math.cos(u);
      },
      z: function (u, v) {
        return Math.cos(v) > 0 ? 0.1 : -0.1;
      },
    },
  });
  // 准备待返回的配置项，把准备好的 legendData、series 传入。
  let option = {
    title: {
      text: `设备总数:${total}`,
      left: "center",
      top: 10,
      textStyle: {
        fontSize: 20,
        color: "#fff",
      },
    },
    legend: {
      show: true,
      data: legendData,
      orient: "vertical",
      right: 0,
      itemWidth: 10,
      top: "center",
      textStyle: { color: "#fff" },
      formatter: function (name) {
        // 在pieData中查找当前名称对应的数值
        const item = pieData.find((data) => data.name === name);
        return `${name} ${item.value}`;
      },
    },
    tooltip: {
      backgroundColor: "rgba(17, 35, 61, 0.8)",
      textStyle: { color: "#fff" },
      formatter: (params) => {
        const item = pieData.find((data) => data.name === params.seriesName);
        if (params.seriesName !== "mouseoutSeries") {
          return `${params.seriesName}<br/><span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${params.color};"></span>${item.value}`;
        }
      },
    },
    xAxis3D: {
      min: -1.3,
      max: 1.3,
    },
    yAxis3D: {
      min: -1.3,
      max: 1.3,
    },
    zAxis3D: {
      min: -2,
      max: 2,
    },
    grid3D: {
      show: false,
      boxHeight: 10,
      left: -40,
      viewControl: {
        //3d效果可以放大、旋转等，请自己去查看官方配置
        alpha: 30,
        // beta: 40,
        rotateSensitivity: 0,
        zoomSensitivity: 0,
        panSensitivity: 0,
        autoRotate: false,
        //   autoRotateSpeed: 5,
        //   autoRotateAfterStill: 10
      },
    },
    series: series,
  };
  return option;
}
export const DevStatus = ({ data = {} }) => {
  const [chart_opt, setChartOpt] = useState({});
  const ColorDict = {
    待机: "#D5D5D5",
    封存: "#D738F7",
    维保: "#46C6FD",
    正常运行: "#46FDA2",
    停机: "#F79638",
  };
  useEffect(() => {
    const { deviceCount = 0, deviceStates = [] } = data;
    const pieData = deviceStates.map((item) => ({
      name: item.key,
      value: item.value,
      itemStyle: {
        color: ColorDict[item.key],
      },
    }));
    const option = getPie3D(pieData, deviceCount, 0.8);
    setChartOpt(option);
  }, [data]);
  return (
    <MemoizedChart option={chart_opt} style={{ height: 236, width: "100%" }} />
  );
};
export const TrendChart = ({ data = [], target = 90 }) => {
  const [chart_opt, setChartOpt] = useState({});
  useEffect(() => {
    const line = data.map((e) => {
      const value = e.data * 100;
      // 保留两位小数，整数时显示为整数
      const formattedValue =
        value % 1 === 0 ? Math.round(value) : Number(value.toFixed(2));
      return [e.xAxis, formattedValue];
    });
    const option = {
      tooltip: {
        trigger: "axis",
        formatter: "{c}%",
        backgroundColor: "rgba(17, 35, 61, 0.8)",
        textStyle: { color: "#fff" },
      },
      grid: {
        top: 30,
        left: 50,
        right: 20,
        bottom: 20,
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        axisLabel: {
          // 添加X轴标签白色字体
          textStyle: { color: "#fff" },
        },
      },
      yAxis: {
        type: "value",
        axisLabel: {
          formatter: "{value}%", // Y轴百分比显示
          textStyle: { color: "#fff" },
        },
        splitLine: {
          lineStyle: {
            color: "rgba(136, 136, 136, 0.5)", // 半透明灰色网格线
          },
        },
        min: 50,
        max: 100,
        splitNumber: 5,
      },
      series: [
        {
          name: "率",
          type: "line",
          data: line,
          // 显示折点
          symbol: "circle",
          symbolSize: 4,
          showSymbol: true,
          // 平滑折线
          smooth: true,
          // 面积渐变填充
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: "rgba(65, 121, 199, 0.90)" },
                { offset: 1, color: "rgba(65, 121, 199, 0)" },
              ],
            },
          },
          // 折线样式
          lineStyle: {
            width: 3,
            color: "#1AAAF7",
          },
          // 折点样式
          itemStyle: {
            color: "#ffffff",
            borderColor: "#1AAAF7",
            borderWidth: 3,
          },
          markLine: {
            symbol: ["none", "arrow"],
            data: [
              {
                name: "目标值",
                yAxis: target,
                lineStyle: {
                  type: "dashed",
                  color: "#FA1A17",
                },
                label: {
                  formatter: `目标值: ${target}%`,
                  position: "insideEndBottom",
                  textStyle: {
                    color: "#FA1A17",
                  },
                },
              },
            ],
          },
        },
      ],
    };
    setChartOpt(option);
  }, [data]);
  return (
    <MemoizedChart option={chart_opt} style={{ height: 236, width: "100%" }} />
  );
};

export const FaultBarChart = ({ data = [] }) => {
  const [chart_opt, setChartOpt] = useState({});
  useEffect(() => {
    const redGradient = {
      type: "linear",
      x: 0,
      y: 0,
      x2: 1,
      y2: 0,
      colorStops: [
        { offset: 0, color: "#D49C52" },
        { offset: 1, color: "#FB1515" },
      ],
    };
    const grayGradient = {
      type: "linear",
      x: 0,
      y: 0,
      x2: 1,
      y2: 0,
      colorStops: [
        { offset: 0, color: "#8E8F8F" },
        { offset: 1, color: "#CFEFFF" },
      ],
    };

    // 数据倒序排列
    const reversedData = [...data].sort((a, b) => b.data - a.data);
    const barData = reversedData.map((e) => [e.data, e.xAxis]);
    const option = {
      textStyle: {
        color: "#fff",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        backgroundColor: "rgba(17, 35, 61, 0.8)",
        textStyle: { color: "#fff" },
      },
      grid: { left: 80, right: 20, top: 10, bottom: 25 },
      xAxis: {
        type: "value",
        splitLine: { show: false },
        // 取消刻度标签显示
      },
      yAxis: {
        type: "category",
        inverse: true, // 确保Y轴也倒序显示
        axisTick: { show: false },
        axisLine: { show: false },
      },
      series: [
        {
          type: "bar",
          data: barData,
          itemStyle: {
            color: (params) => {
              // 前三项使用红色渐变，其余使用灰色渐变
              return params.dataIndex < 3 ? redGradient : grayGradient;
            },
            borderRadius: [0, 2, 2, 0], // 右侧圆角
          },
          barWidth: 15,
        },
      ],
    };
    setChartOpt(option);
  }, [data]);
  return (
    <MemoizedChart option={chart_opt} style={{ height: 236, width: "100%" }} />
  );
};

const reColorList = [
  new echarts.graphic.LinearGradient(0, 0, 0, 1, [
    { offset: 0, color: "#FB1515" },
    { offset: 1, color: "#D48452" },
  ]),
  new echarts.graphic.LinearGradient(0, 0, 0, 1, [
    { offset: 0, color: "#FF9F30" },
    { offset: 1, color: "#BB9300" },
  ]),
  new echarts.graphic.LinearGradient(0, 0, 0, 1, [
    { offset: 0, color: "#64C86F" },
    { offset: 1, color: "#84B589" },
  ]),
  new echarts.graphic.LinearGradient(0, 0, 0, 1, [
    { offset: 0, color: "#5290D4" },
    { offset: 1, color: "#15F6FB" },
  ]),
];

export const ReLifeBarChart = ({ data = {} }) => {
  const [chart_opt, setChartOpt] = useState({});
  const [btn_selt, setBtnSelt] = useState("设备"); // 元器件

  useEffect(() => {
    let chart_data = null;
    if (btn_selt === "设备") {
      chart_data = data["deviceRemainLifeData"];
    } else {
      chart_data = data["componentRemainLifeData"];
    }
    const barData = chart_data.map((e) => [e.xAxis, e.data]);

    const option = {
      textStyle: {
        color: "#fff",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        backgroundColor: "rgba(17, 35, 61, 0.8)",
        textStyle: { color: "#fff" },
      },
      grid: { left: 40, right: 20, top: 30, bottom: 30 },
      xAxis: {
        type: "category",
        // 取消刻度标签显示
        name: "剩余寿命(天)",
        nameLocation: "middle",
        nameGap: 20, // 标签与轴线的距离
        nameTextStyle: {
          fontSize: 12,
        },
      },
      yAxis: {
        type: "value",
        name: "设备数量(台)",
        nameLocation: "end",
        nameGap: 10, // 标签与轴线的距离
        nameTextStyle: {
          fontSize: 12,
        },
      },
      series: [
        {
          type: "bar",
          data: barData,
          barWidth: 20,
          itemStyle: {
            // 使用颜色列表，ECharts会循环使用这些颜色
            color: function (params) {
              return reColorList[params.dataIndex % reColorList.length];
            },
          },
        },
      ],
    };
    setChartOpt(option);
  }, [data, btn_selt]);
  return (
    <div style={{ height: 236, width: "100%" }}>
      <Flex gap={10} justify="end">
        <div
          onClick={() => setBtnSelt("设备")}
          className={btn_selt === "设备" ? "tpm_btn_selt" : "tpm_btn"}
        >
          设备
        </div>
        <div
          onClick={() => setBtnSelt("元器件")}
          className={btn_selt === "元器件" ? "tpm_btn_selt" : "tpm_btn"}
        >
          元器件
        </div>
      </Flex>
      <MemoizedChart
        option={chart_opt}
        style={{ height: 200, width: "100%" }}
      />
    </div>
  );
};

export const LineBarChart = ({ name_type = "频次", data = [] }) => {
  const [chart_opt, setChartOpt] = useState({});
  useEffect(() => {
    const xData = [];
    const barData = [];
    const lineData = [];
    data.forEach((item) => {
      xData.push(item?.xAxis ?? ""); // 安全获取xAxis，默认空字符串
      barData.push(Number(item?.data ?? 0)); // 转换为数字类型，默认0
    });

    // 计算data总和（处理可能的非数字值）
    const total = barData.reduce(
      (sum, value) => sum + (isNaN(value) ? 0 : value),
      0
    );

    // 计算每个data占总和的百分比并保留两位小数
    let cumulativeSum = 0;
    barData.forEach((value) => {
      cumulativeSum += value;
      const percentage =
        total > 0
          ? ((cumulativeSum / total) * Math.pow(10, 4)) / Math.pow(10, 2)
          : 0;
      lineData.push(Number(percentage.toFixed(2)));
    });
    const option = {
      title: {
        subtext: name_type,
        subtextStyle: {
          color: "#fff",
        },
        top: -10,
        left: 22,
      },
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        backgroundColor: "rgba(17, 35, 61, 0.8)",
        textStyle: { color: "#fff" },
      },
      grid: {
        left: 20,
        right: 10,
        bottom: 15,
        top: 40,
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: xData,
          axisLine: { lineStyle: { color: "rgba(255, 255, 255, 0.3)" } },
          axisLabel: {
            color: "#fff",
            // rotate: 30,
            // interval: 0,
          },
        },
      ],
      yAxis: [
        {
          type: "value",
          axisLine: { lineStyle: { color: "#40a9ff" } },
          axisLabel: { color: "#fff" },
          splitLine: { lineStyle: { color: "rgba(255, 255, 255, 0.1)" } },
        },
        {
          type: "value",
          show: false, // 隐藏第二个Y轴
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: { show: false },
          splitLine: { show: false },
        },
      ],
      series: [
        {
          name: name_type,
          type: "bar",
          data: barData,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "#5290D4" },
              { offset: 1, color: "#15F6FB" },
            ]),
            // borderRadius: [4, 4, 0, 0],
          },
          barWidth: 20,
        },
        {
          name: "概率",
          type: "line",
          yAxisIndex: 1, // 使用第二个Y轴
          data: lineData,
          symbol: "circle",
          symbolSize: 8,
          itemStyle: { color: "#D59750" },
          lineStyle: { width: 3, color: "#D59750" },
          label: {
            show: true,
            position: "top",
            formatter: "{c}%",
            textStyle: { color: "#fff", fontSize: 14 },
          },
          tooltip: {
            valueFormatter: (val) => val + "%",
          },
        },
      ],
    };
    setChartOpt(option);
  }, [data]);
  return (
    <MemoizedChart option={chart_opt} style={{ height: 236, width: "100%" }} />
  );
};

export const RepairTable = ({ data = [] }) => {
  const [tb_data, setTbData] = useState([]);
  const [user_obj, setUserObj] = useState({});
  const tableTheme = {
    token: {
      colorPrimary: "#1A2E4F", // 主色（影响选中态等）
      colorBgContainer: "transparent", // 背景色
      colorTextHeading: "#fff",
      colorText: "#fff",
      colorIcon: "#fff",
      colorTextDisabled: "#fff",
      colorTextPlaceholder: "#fff",
      colorBorder: "#fff",
      colorBgTextActive: "#fff",
      colorTextDescription: "#fff",
      opacityImage: 0.2,
    },
    components: {
      Table: {
        headerColor: "#C4CBEB",
        headerSplitColor: "transparent",
        headerBg: "transparent", // 表头背景
        footerBg: "transparent", // 表头背景
        borderColor: "transparent",
        footerColor: "#fff",
      },
    },
  };
  const columns = [
    {
      title: "序号",
      dataIndex: "key",
      key: "key",
      width: 40,
      render: (_, __, index) => index + 1,
    },
    {
      title: "报修单编号",
      dataIndex: "requestId",
      key: "RequestId",
      width: 120,
    },
    {
      title: "设备",
      dataIndex: "deviceName",
      key: "deviceName",
      width: 60,
    },
    {
      title: "设备类型",
      dataIndex: "deviceTypeName",
      key: "deviceTypeName",
      width: 80,
    },
    {
      title: "故障类型",
      dataIndex: "breakdownType",
      key: "breakdownType",
      width: 80,
    },
    {
      title: "故障描述",
      dataIndex: "breakdownDescription",
      key: "breakdownDescription",
      width: 200,
    },
    {
      title: "状态",
      dataIndex: "state",
      key: "state",
      width: 60,
    },
    {
      title: "报修时间",
      dataIndex: "requestTime",
      key: "requestTime",
      width: 160,
    },
    {
      title: "报修人",
      dataIndex: "user",
      key: "user",
      width: 80,
    },
  ];

  const getUser = () => {
    readUsers(
      { value: "" },
      (res) => {
        const { code, data } = res.data;
        if (code === 0) {
          const { user = [] } = data;
          const obj = {};
          user.forEach((e) => {
            obj[e.user_id] = e.nick_name;
          });
          setUserObj(obj);
        }
      },
      () => {}
    );
  };
  useEffect(() => {
    const newData = data.map((e) => ({
      ...e,
      user: user_obj[e.informant] || e.informant,
    }));
    setTbData(newData);
  }, [data, user_obj]);

  useEffect(() => {
    //获取 用户
    getUser();
  }, []);

  const rowBg =
    "linear-gradient( 270deg, rgba(61,159,255,0.02) 0%, rgba(0,59,159,0.2) 100%)";
  const rowBgCover =
    "linear-gradient( 270deg, rgba(61,159,255,0.02) 0%, rgba(42,121,255,0.2) 100%)";
  return (
    <div style={{ width: "100%", height: 236, overflowY: "auto" }}>
      <ConfigProvider theme={tableTheme}>
        <Table
          className="custom-scroll-table"
          rowKey="requestId"
          size="small"
          bordered={true}
          columns={columns}
          dataSource={tb_data || []}
          pagination={false}
          style={{}}
          scroll={{ y: 180 }}
          onRow={(record) => ({
            style: {
              background: rowBg,
              boxShadow: "inset -1px -1px 4px 0px rgba(110,220,255,0.2)",
              borderRadius: "2px",
              marginTop: "4px",
            },
            onMouseEnter: (e) => {
              e.currentTarget.style.background = rowBgCover;
            },
            onMouseLeave: (e) => {
              e.currentTarget.style.background = rowBg;
            },
          })}
          // onRow={() => ({
          //   style: {
          //     background:
          //       "linear-gradient( 270deg, rgba(61,159,255,0.2) 0%, rgba(0,59,159,0.4) 100%)",
          //   },
          // })}
        />
      </ConfigProvider>
    </div>
  );
};

import React, { useEffect, useRef, useState } from "react";
import { Spin } from "antd";
import { getCurrentTime } from "../../../../../../utils/string";
import * as echarts from "echarts";
import { GeneralCard } from "../../../../../../components/CommonCard";

export const LineChart = ({ title }) => {
  const [chart_load, setChartLoad] = useState(false);
  const [chart_data, setChartData] = useState({});
  const lineRef = useRef(null);
  const myChartRef = useRef(null);
  const requestData = () => {};
  const initChart = () => {
    myChartRef.current = echarts.init(lineRef.current);
    const { xData = [], yObj = { 测试数据: [] } } = chart_data;
    let xAxis = {
      type: "category",
      data: xData,
      axisLabel: {
        fontSize: 14,
      },
      axisLine: {
        onZero: false,
      },
      name: "经过时间/s",
      nameLocation: "center",
      nameGap: 32,
      axisTick: {},
    };
    let yAxis = {
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
    };
    let temp_legend = [];
    let series = [];
    let key_list = Object.keys(yObj);
    key_list.forEach((item, _) => {
      temp_legend.push(item);
      series.push({
        name: item,
        type: "line",
        data: yObj[item],
        symbol: "none",
        smooth: true,
        label: {
          show: false,
          fontSize: 12,
          position: "top",
        },
      });
    });

    let options = {
      tooltip: {
        trigger: "axis",
        formatter: (params) => {
          let str = `经过时间:\t${params[0].axisValue}<br />`;
          params.map((item) => {
            str += `<div>${item.marker}${item.seriesName}:<span style="margin-left:20px;font-weight:600;float:right">${item.data}</span><div>`;
          });
          return str;
        },
      },
      color: ["#4C69FF", "#FF9E4C", "#17D01D"],
      legend: {
        data: temp_legend,
      },
      toolbox: {
        feature: {
          dataZoom: {},
          // restore: {},
          saveAsImage: {
            name: getCurrentTime(),
          },
        },
      },
      grid: {
        left: 60,
        right: 20,
        bottom: 50,
        top: 40,
        // containLabel: true,
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

  useEffect(() => {
    if (Object.keys(chart_data).length > 0) {
      initChart();
    }
  }, [chart_data]);
  useEffect(() => {
    requestData();
  }, [title]);
  useEffect(() => {}, []);

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
    <GeneralCard name={title}>
      <Spin spinning={chart_load}>
        <div
          ref={lineRef}
          style={{
            width: "100%",
            height: 280,
            padding: 5,
          }}
        ></div>
      </Spin>
    </GeneralCard>
  );
};

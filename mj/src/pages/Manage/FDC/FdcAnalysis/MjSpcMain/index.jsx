import React, { useState, useEffect, useRef, useCallback } from "react";
import * as echarts from "echarts";
import ReactECharts from "echarts-for-react";
import "./MjSpcMain.css";
import {
  Button,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Flex,
  Select,
} from "antd";
import { dateFormat, selectList2Option } from "../../../../../utils/string";
import dayjs from "dayjs";
import { postSpeDatasZz } from "../../../../../apis/fdc_api";
const { RangePicker } = DatePicker;

const MjSpcMain = () => {
  const [loading, setLoading] = useState(false);
  const [lotNumbers, setLotNumbers] = useState([]);
  const [chartData, setChartData] = useState({});
  const [viewMode, setViewMode] = useState("grid");
  const [currentChart, setCurrentChart] = useState("");
  const [form] = Form.useForm();
  const hasData = Object.keys(chartData).length > 0;

  // 计算Y轴范围，使数据波动更明显，并保留一位小数
  const calculateYAxisRange = useCallback((values, controlLines) => {
    const allValues = [...values, ...controlLines.map((line) => line.value)];
    const min = Math.min(...allValues);
    const max = Math.max(...allValues);

    // 添加一些边距，使图表看起来更舒适
    const range = max - min;
    const margin = range * 0.1; // 10%的边距

    // 保留一位小数
    return {
      min: parseFloat((min - margin).toFixed(1)),
      max: parseFloat((max + margin).toFixed(1)),
    };
  }, []);

  // 生成图表配置项
  const getChartOption = useCallback(
    (key) => {
      const values = chartData[key].values;
      const controlLines = chartData[key].controlLines;
      const redPoints = chartData[key].redPoints || [];

      // 计算合适的Y轴范围
      const yAxisRange = calculateYAxisRange(values, controlLines);

      // 准备数据系列 - 正常点
      const normalSeriesData = values.map((value, index) => ({
        value: value,
        itemStyle: {
          color: redPoints.includes(index) ? "#ff0000" : "#5470c6",
        },
      }));

      return {
        tooltip: {
          trigger: "axis",
          formatter: function (params) {
            return `批号: ${params[0].name}<br/>${key}: ${params[0].value}`;
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "10%",
          top: "15%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          data: lotNumbers,
          axisLabel: {
            rotate: 30,
          },
        },
        yAxis: {
          type: "value",
          name: key,
          min: yAxisRange.min,
          max: yAxisRange.max,
          axisLabel: {
            formatter: "{value}",
          },
        },
        series: [
          {
            // 主数据线
            name: key,
            data: normalSeriesData,
            type: "line",
            smooth: false, // 不使用平滑曲线
            symbol: "circle",
            symbolSize: 8,
            lineStyle: {
              width: 2,
              color: "#5470c6",
            },
          },
          // 添加控制线系列
          ...controlLines.map((line) => ({
            name: line.name,
            type: "line",
            markLine: {
              silent: true,
              symbol: "none",
              lineStyle: {
                color: "#ff0000",
                width: 1,
                type: "dashed",
              },
              label: {
                show: true,
                formatter: line.name,
                position: "end",
              },
              data: [
                {
                  yAxis: line.value,
                },
              ],
            },
          })),
        ],
        animation: true,
        animationDuration: 1500,
      };
    },
    [chartData, lotNumbers, calculateYAxisRange]
  );

  // 放大图表
  const expandChart = useCallback((key) => {
    setCurrentChart(key);
    setViewMode("fullscreen");
  }, []);

  // 切换视图模式
  const toggleViewMode = useCallback(() => {
    setViewMode((prevMode) => (prevMode === "grid" ? "fullscreen" : "grid"));
  }, []);

  const query = () => {
    const values = form.getFieldsValue();
    setLoading(true);
    postSpeDatasZz(
      values,
      (res) => {
        setLoading(false);
        const { code, msg, data } = res.data;
        if (code === 0 && data) {
          const { lot_numbers, datas } = data;
          setLotNumbers(lot_numbers);
          setChartData(datas);
        } else {
          setLotNumbers([]);
          setChartData({});
        }
      },
      () => {
        setLoading(false);
        setLotNumbers([]);
        setChartData({});
      }
    );
  };

  useEffect(() => {
    // 添加ESC键监听
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && viewMode === "fullscreen") {
        toggleViewMode();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // 清理函数
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [viewMode, toggleViewMode]);

  return (
    <div id="app">
      <div></div>
      <Flex vertical gap={16}>
        <Form
          layout="inline"
          form={form}
          initialValues={{
            图号: "",
            机台号: ["11", "12", "13", "14", "15"],
            点数: 100,
            时间: [
              dayjs().subtract(1, "day").format(dateFormat),
              dayjs().format(dateFormat),
            ],
          }}
        >
          <Form.Item label="图号" name="图号">
            <Input />
          </Form.Item>
          <Form.Item label="机台号" name="机台号">
            <Select
              mode="multiple"
              style={{ width: 200 }}
              options={selectList2Option(["11", "12", "13", "14", "15"])}
              maxTagCount="responsive"
            />
          </Form.Item>
          <Form.Item label="点数" name="点数">
            <InputNumber />
          </Form.Item>
          <Form.Item
            label="时间"
            name="时间"
            getValueProps={(value) => {
              return {
                value: value && value.map((e) => dayjs(e)),
              };
            }}
            normalize={(value) =>
              value && value.map((e) => dayjs(e).format(dateFormat))
            }
          >
            <RangePicker allowClear={false} />
          </Form.Item>
          <Button type="primary" onClick={query}>
            查询
          </Button>
        </Form>
        {loading ? (
          <div className="loading">
            <div className="spinner">
              <p>正在从后端获取数据...</p>
              <p>请稍候</p>
            </div>
          </div>
        ) : !hasData ? (
          <div className="loading">
            <p>暂无数据，请点击"查询"按钮</p>
          </div>
        ) : (
          <div>
            {viewMode === "grid" && (
              <div className="charts-grid">
                {Object.entries(chartData).map(([key]) => (
                  <div
                    key={key}
                    className="chart-container"
                    onDoubleClick={() => expandChart(key)}
                  >
                    <div className="chart-title">{key} - 产品属性趋势</div>
                    <div className="chart">
                      <ReactECharts
                        option={getChartOption(key)}
                        style={{ width: "100%", height: "300px" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
            {viewMode === "fullscreen" && (
              <div className="fullscreen-chart">
                <div className="fullscreen-header">
                  <h2 className="fullscreen-title">
                    {currentChart} - 趋势分析
                  </h2>
                  <button className="close-btn" onClick={toggleViewMode}>
                    关闭全屏 (ESC)
                  </button>
                </div>
                <div className="chart">
                  <ReactECharts
                    option={getChartOption(currentChart)}
                    style={{ width: "100%", height: "80vh" }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </Flex>
    </div>
  );
};

export default MjSpcMain;

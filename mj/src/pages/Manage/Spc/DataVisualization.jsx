import React, { useState, useEffect, useRef, useCallback } from "react";
import * as echarts from "echarts";
import {
  Form,
  Input,
  DatePicker,
  Button,
  Row,
  Col,
  message,
  Modal,
  Card,
  Divider,
  Spin,
  Flex,
} from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  CloseOutlined,
  ExpandOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { base_url } from "../../../apis/instance";

const { RangePicker } = DatePicker;

const DataVisualization = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentChartKey, setCurrentChartKey] = useState("");
  const chartInstances = useRef({});
  const modalChartInstance = useRef(null);
  const chartContainersReady = useRef(false);
  const API_BASE = `${base_url}/api/mjm_spot_router`;
  // 模拟后端API调用
  const fetchDataFromBackend = async (formData) => {
    setLoading(true);

    try {
      // 实际应用中，这里应该是真实的API调用
      const response = await fetch(API_BASE + "/api/meltspotdata", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      console.log(data);
      setChartData(data);
    } catch (err) {
      message.error("获取数据失败，请稍后重试");
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const onFinish = (values) => {
    const formData = {
      startTime: values.dateRange
        ? values.dateRange[0].format("YYYY-MM-DD HH:mm:ss")
        : null,
      endTime: values.dateRange
        ? values.dateRange[1].format("YYYY-MM-DD HH:mm:ss")
        : null,
      nDays: values.nDays,
    };

    fetchDataFromBackend(formData);
  };

  // 生成图表配置
  const getChartOption = (data, isModal = false) => {
    return {
      tooltip: {
        trigger: "axis",
        formatter: function (params) {
          let result = `<div style="font-weight:bold;">${params[0].name}</div>`;
          params.forEach((param) => {
            const seriesName = param.seriesName;
            const value = param.value;
            if (seriesName === "UCL" || seriesName === "LCL") {
              result += `<div style="color:${param.color}">${seriesName}: ${
                data[seriesName.toLowerCase()]
              }</div>`;
            } else {
              result += `<div style="color:${param.color}">${seriesName}: ${value}</div>`;
            }
          });
          return result;
        },
      },
      legend: {
        data: ["数据值", "UCL", "LCL"],
        top: isModal ? 10 : 30,
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        top: isModal ? "20%" : "15%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: data.times,
      },
      yAxis: {
        type: "value",
        name: "数值",
      },
      series: [
        {
          name: "数据值",
          type: "line",
          data: data.datas,
          smooth: false,
          lineStyle: {
            width: 2,
          },
          itemStyle: {
            color: "#1890ff",
          },
          symbol: "circle",
          symbolSize: 6,
        },
        {
          name: "UCL",
          type: "line",
          data: data.times.map(() => data.ucl),
          lineStyle: {
            color: "#ff4d4f",
            type: "dashed",
            width: 2,
          },
          itemStyle: {
            color: "#ff4d4f",
          },
          symbol: "none",
        },
        {
          name: "LCL",
          type: "line",
          data: data.times.map(() => data.lcl),
          lineStyle: {
            color: "#52c41a",
            type: "dashed",
            width: 2,
          },
          itemStyle: {
            color: "#52c41a",
          },
          symbol: "none",
        },
      ],
    };
  };

  // 初始化图表
  const renderChart = useCallback(
    (key, containerId, isModal = false) => {
      const chartDom = document.getElementById(containerId);
      if (!chartDom) {
        console.warn(`图表容器 ${containerId} 未找到`);
        return null;
      }

      // 如果已有实例，先销毁
      let chart;
      if (isModal) {
        if (modalChartInstance.current) {
          modalChartInstance.current.dispose();
        }
        chart = echarts.init(chartDom);
        modalChartInstance.current = chart;
      } else {
        if (chartInstances.current[containerId]) {
          chartInstances.current[containerId].dispose();
        }
        chart = echarts.init(chartDom);
        chartInstances.current[containerId] = chart;
      }

      const option = getChartOption(chartData[key], isModal);
      chart.setOption(option);

      // 添加双击事件监听
      chart.getZr().on("dblclick", (params) => {
        // 检查是否点击在空白区域
        const pointInPixel = [params.offsetX, params.offsetY];
        if (chart.containPixel("grid", pointInPixel)) {
          const [xIndex] = chart.convertFromPixel(
            { seriesIndex: 0 },
            pointInPixel
          );

          // 如果xIndex不是有效的数据点索引，说明点击在空白处
          if (
            xIndex === null ||
            xIndex === undefined ||
            !Number.isInteger(xIndex) ||
            xIndex < 0 ||
            xIndex >= chartData[key].datas.length
          ) {
            handleExpandChart(key);
          }
        }
      });

      return chart;
    },
    [chartData]
  );

  // 渲染所有图表
  const renderAllCharts = useCallback(() => {
    if (!chartData) return;

    // 确保DOM已经更新
    setTimeout(() => {
      Object.keys(chartData).forEach((key) => {
        const containerId = `chart-${key}`;
        renderChart(key, containerId);
      });
      chartContainersReady.current = true;
    }, 100);
  }, [chartData, renderChart]);

  // 放大图表
  const handleExpandChart = useCallback(
    (key) => {
      setCurrentChartKey(key);
      setIsModalVisible(true);

      // 确保模态框DOM已经渲染
      setTimeout(() => {
        renderChart(key, "modal-chart", true);
      }, 300);
    },
    [renderChart]
  );

  // 关闭模态框
  const handleCloseModal = useCallback(() => {
    setIsModalVisible(false);
    setCurrentChartKey("");

    if (modalChartInstance.current) {
      modalChartInstance.current.dispose();
      modalChartInstance.current = null;
    }

    // 重新渲染小图
    setTimeout(() => {
      renderAllCharts();
    }, 100);
  }, [renderAllCharts]);

  // 监听chartData变化，自动渲染图表
  useEffect(() => {
    if (chartData && !loading) {
      renderAllCharts();
    }
  }, [chartData, loading, renderAllCharts]);

  // 监听窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      // 调整普通图表
      Object.values(chartInstances.current).forEach((instance) => {
        if (instance && !instance.isDisposed()) {
          instance.resize();
        }
      });

      // 调整模态框中的图表
      if (
        modalChartInstance.current &&
        !modalChartInstance.current.isDisposed()
      ) {
        modalChartInstance.current.resize();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // ESC键监听和清理
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isModalVisible) {
        handleCloseModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);

      // 清理所有图表实例
      Object.values(chartInstances.current).forEach((instance) => {
        if (instance && !instance.isDisposed()) {
          instance.dispose();
        }
      });

      if (
        modalChartInstance.current &&
        !modalChartInstance.current.isDisposed()
      ) {
        modalChartInstance.current.dispose();
      }
    };
  }, [isModalVisible, handleCloseModal]);

  return (
    <div className="data-visualization-container">
      <Card className="form-card">
        <Form
          form={form}
          onFinish={onFinish}
          initialValues={{
            nDays: "7",
          }}
        >
          <Flex gap={20}>
            <Form.Item label="时间范围" name="dateRange">
              <RangePicker
                showTime
                style={{ width: "100%" }}
                ranges={{
                  今天: [dayjs().startOf("day"), dayjs().endOf("day")],
                  本周: [dayjs().startOf("week"), dayjs().endOf("week")],
                  本月: [dayjs().startOf("month"), dayjs().endOf("month")],
                }}
              />
            </Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SearchOutlined />}
              loading={loading}
            >
              查询数据
            </Button>
            <Button
              onClick={() => {
                form.resetFields();
                setChartData(null);
              }}
              style={{ marginLeft: 8 }}
            >
              重置
            </Button>
          </Flex>
        </Form>
      </Card>

      {loading && (
        <div className="loading-container">
          <Spin size="large" tip="数据加载中..." />
        </div>
      )}

      {chartData && !loading && (
        <div className="charts-container">
          <Divider orientation="left">监控数据图表</Divider>
          <Row gutter={[16, 16]}>
            {Object.keys(chartData).map((key) => (
              <Col xs={24} lg={12} xl={8} key={key}>
                <Card
                  className="chart-card"
                  title={
                    <div className="chart-title">
                      {chartData[key].title}
                      <ExpandOutlined
                        className="expand-icon"
                        onClick={() => handleExpandChart(key)}
                        title="最大化查看"
                      />
                    </div>
                  }
                >
                  <div
                    id={`chart-${key}`}
                    className="chart-content"
                    style={{ height: "300px" }}
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}

      {!chartData && !loading && (
        <div className="empty-state">
          <div className="empty-content">
            <h3>暂无数据</h3>
            <p>请选择时间范围或输入天数查询数据</p>
          </div>
        </div>
      )}

      {/* 全屏模态框 */}
      <Modal
        title={
          <div className="modal-header">
            <span>
              {currentChartKey && chartData
                ? chartData[currentChartKey].title
                : ""}
            </span>
            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={handleCloseModal}
              className="close-btn"
            >
              关闭 (ESC)
            </Button>
          </div>
        }
        open={isModalVisible}
        onCancel={handleCloseModal}
        footer={null}
        width="95%"
        style={{ top: 20 }}
        bodyStyle={{
          height: "calc(100vh - 120px)",
          padding: "16px 0",
        }}
        destroyOnHidden={true}
      >
        <div
          id="modal-chart"
          className="modal-chart-content"
          style={{ height: "100%", width: "100%" }}
        />
      </Modal>

      <style jsx>{`
        .data-visualization-container {
          padding: 24px;
          margin: 0 auto;
          background-color: #f5f5f5;
        }

        .page-header {
          text-align: center;
          margin-bottom: 24px;
        }

        .page-header h1 {
          color: #1890ff;
          margin-bottom: 8px;
          font-size: 28px;
        }

        .page-header p {
          color: #666;
          font-size: 16px;
        }

        .form-card {
          margin-bottom: 24px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .charts-container {
          margin-top: 24px;
        }

        .chart-card {
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: all 0.3s;
        }

        .chart-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          transform: translateY(-2px);
        }

        .chart-title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 16px;
          font-weight: bold;
          margin: 0;
        }

        .expand-icon {
          color: #1890ff;
          cursor: pointer;
          font-size: 16px;
        }

        .expand-icon:hover {
          color: #40a9ff;
        }

        .chart-content {
          width: 100%;
        }

        .loading-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 300px;
        }

        .empty-state {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 400px;
          text-align: center;
        }

        .empty-content h3 {
          color: #999;
          margin-bottom: 8px;
        }

        .empty-content p {
          color: #ccc;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }

        .close-btn {
          color: #999;
        }

        .modal-chart-content {
          width: 100%;
          height: 100%;
          min-height: 500px;
        }

        /* 响应式调整 */
        @media (max-width: 768px) {
          .data-visualization-container {
            padding: 16px;
          }

          .page-header h1 {
            font-size: 24px;
          }

          .page-header p {
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
};

export default DataVisualization;

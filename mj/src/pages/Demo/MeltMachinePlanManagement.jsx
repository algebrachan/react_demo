import React, { useState, useEffect, useRef } from "react";
import {
  Table,
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  Space,
  Modal,
  Card,
  Row,
  Col,
  Divider,
  message,
  Tag,
  Tabs,
  InputNumber,
  Slider,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SaveOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import dayjs from 'dayjs';
import * as echarts from "echarts";

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

// 模拟数据 - 熔融机方案表
const mockPlanData = [
  {
    id: 1,
    planCode: "P-2023001",
    drawingNumber: "DWG-001",
    version: "V1.0",
    inch: "12英寸",
    createdBy: "张三",
    createdAt: "2023-01-15 10:30:25",
    updatedBy: "李四",
    updatedAt: "2023-02-20 14:25:36",
    status: "启用",
  },
  {
    id: 2,
    planCode: "P-2023002",
    drawingNumber: "DWG-002",
    version: "V1.1",
    inch: "10英寸",
    createdBy: "王五",
    createdAt: "2023-02-10 09:15:20",
    updatedBy: "王五",
    updatedAt: "2023-03-05 16:40:12",
    status: "停用",
  },
];

// 模拟数据 - 熔融机方案参数表
const mockParameterData = {
  1: {
    singleParams: {
      vacuumTime: 120,
      secondVacuumEnable: 1,
      secondVacuumDelay: 30,
      moldSpeed: 1500,
      electrodeLiftSpeed: 10,
      electrodeOpenCloseSpeed: 8,
      autoArcBreakTime: 5,
    },
    fixedArrays: {
      bigBlowOn: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
      bigBlowOff: [5, 15, 25, 35, 45, 55, 65, 75, 85, 95],
      vacuumPumpFrequency: [20, 25, 30, 35, 40, 45, 50, 55, 60, 65],
      vacuumPumpTime: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000],
      insulationPlateTime: [50, 100, 150, 200, 250, 300, 350],
      insulationPlatePosition: [10, 20, 30, 40, 50, 60, 70],
    },
    dynamicArrays: {
      electrodeLiftCurve1: [
        { time: 0, value: 0 },
        { time: 600, value: 50 },
        { time: 1200, value: 100 },
        { time: 1800, value: 80 },
        { time: 2400, value: 0 },
      ],
      electrodeLiftCurve2: [
        { time: 0, value: 0 },
        { time: 800, value: 70 },
        { time: 1600, value: 90 },
        { time: 2400, value: 0 },
      ],
      electrodeLiftCurve3: [
        { time: 0, value: 0 },
        { time: 400, value: 40 },
        { time: 1200, value: 80 },
        { time: 2000, value: 60 },
        { time: 2400, value: 0 },
      ],
      electrodeLiftCurve4: [
        { time: 0, value: 0 },
        { time: 1000, value: 60 },
        { time: 2400, value: 0 },
      ],
      currentSettingCurve: [
        { time: 0, value: 0 },
        { time: 500, value: 30 },
        { time: 1000, value: 70 },
        { time: 1500, value: 100 },
        { time: 2000, value: 80 },
        { time: 2400, value: 0 },
      ],
      electrodeOpenCloseCurve1: [
        { time: 0, value: 0 },
        { time: 800, value: 60 },
        { time: 1600, value: 90 },
        { time: 2400, value: 0 },
      ],
      electrodeOpenCloseCurve2: [
        { time: 0, value: 0 },
        { time: 600, value: 50 },
        { time: 1200, value: 80 },
        { time: 1800, value: 70 },
        { time: 2400, value: 0 },
      ],
      electrodeOpenCloseCurve3: [
        { time: 0, value: 0 },
        { time: 400, value: 40 },
        { time: 1200, value: 70 },
        { time: 2000, value: 60 },
        { time: 2400, value: 0 },
      ],
      electrodeOpenCloseCurve4: [
        { time: 0, value: 0 },
        { time: 1000, value: 60 },
        { time: 2400, value: 0 },
      ],
    },
  },
  2: {
    singleParams: {
      vacuumTime: 100,
      secondVacuumEnable: 0,
      secondVacuumDelay: 20,
      moldSpeed: 1400,
      electrodeLiftSpeed: 8,
      electrodeOpenCloseSpeed: 6,
      autoArcBreakTime: 4,
    },
    fixedArrays: {
      bigBlowOn: [15, 25, 35, 45, 55, 65, 75, 85, 95, 105],
      bigBlowOff: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
      vacuumPumpFrequency: [25, 30, 35, 40, 45, 50, 55, 60, 65, 70],
      vacuumPumpTime: [150, 250, 350, 450, 550, 650, 750, 850, 950, 1050],
      insulationPlateTime: [60, 110, 160, 210, 260, 310, 360],
      insulationPlatePosition: [15, 25, 35, 45, 55, 65, 75],
    },
    dynamicArrays: {
      electrodeLiftCurve1: [
        { time: 0, value: 0 },
        { time: 500, value: 40 },
        { time: 1100, value: 90 },
        { time: 1700, value: 70 },
        { time: 2400, value: 0 },
      ],
      electrodeLiftCurve2: [
        { time: 0, value: 0 },
        { time: 700, value: 60 },
        { time: 1500, value: 80 },
        { time: 2400, value: 0 },
      ],
      electrodeLiftCurve3: [
        { time: 0, value: 0 },
        { time: 300, value: 30 },
        { time: 1100, value: 70 },
        { time: 1900, value: 50 },
        { time: 2400, value: 0 },
      ],
      electrodeLiftCurve4: [
        { time: 0, value: 0 },
        { time: 900, value: 50 },
        { time: 2400, value: 0 },
      ],
      currentSettingCurve: [
        { time: 0, value: 0 },
        { time: 400, value: 20 },
        { time: 900, value: 60 },
        { time: 1400, value: 90 },
        { time: 1900, value: 70 },
        { time: 2400, value: 0 },
      ],
      electrodeOpenCloseCurve1: [
        { time: 0, value: 0 },
        { time: 700, value: 50 },
        { time: 1500, value: 80 },
        { time: 2400, value: 0 },
      ],
      electrodeOpenCloseCurve2: [
        { time: 0, value: 0 },
        { time: 500, value: 40 },
        { time: 1100, value: 70 },
        { time: 1700, value: 60 },
        { time: 2400, value: 0 },
      ],
      electrodeOpenCloseCurve3: [
        { time: 0, value: 0 },
        { time: 300, value: 30 },
        { time: 1100, value: 60 },
        { time: 1900, value: 50 },
        { time: 2400, value: 0 },
      ],
      electrodeOpenCloseCurve4: [
        { time: 0, value: 0 },
        { time: 900, value: 50 },
        { time: 2400, value: 0 },
      ],
    },
  },
};

// 曲线编辑器组件
const CurveEditor = ({ data, onChange, disabled }) => {
  const chartRef = useRef(null);
  const [chart, setChart] = useState(null);

  useEffect(() => {
    if (chartRef.current) {
      const newChart = echarts.init(chartRef.current);
      setChart(newChart);

      // 响应窗口大小变化
      const resizeHandler = () => newChart.resize();
      window.addEventListener("resize", resizeHandler);

      return () => {
        window.removeEventListener("resize", resizeHandler);
        newChart.dispose();
      };
    }
  }, []);

  // 更新图表
  useEffect(() => {
    if (chart && data) {
      const chartData = getChartData();
      chart.setOption({
        title: {
          text: "时间-数值关系图",
          left: "center",
        },
        tooltip: {
          trigger: "axis",
          formatter: (params) => {
            return `时间: ${params[0].axisValue}<br/>数值: ${params[0].data}`;
          },
        },
        xAxis: {
          type: "value",
          name: "时间",
          min: 0,
          max: 2400,
          interval: 200,
        },
        yAxis: {
          type: "value",
          name: "数值",
        },
        series: [
          {
            type: "line",
            smooth: false,
            symbol: "circle",
            symbolSize: 8,
            lineStyle: {
              width: 2,
            },
            data: chartData,
          },
        ],
      });
    }
  }, [chart, data]);

  // 将数据转换成ECharts可用的格式
  const getChartData = () => {
    if (!data || data.length < 2) return [];

    const chartData = [];
    for (let i = 0; i < data.length - 1; i++) {
      chartData.push([data[i].time, data[i].value]);
      chartData.push([data[i].time, data[i + 1].value]);
    }
    chartData.push([data[data.length - 1].time, data[data.length - 1].value]);

    return chartData;
  };

  // 获取前一个时间点
  const getPreviousTime = (index) => {
    if (index === 0) return 0;
    return data[index - 1].time;
  };

  // 验证时间输入
  const validateTime = (time, index) => {
    let newTime = time;

    // 验证是否为5的倍数
    if (newTime % 5 !== 0) {
      newTime = Math.round(newTime / 5) * 5;
      message.warning("时间点必须是5的倍数，已自动调整");
    }

    // 验证是否在有效范围内
    if (newTime < 0) {
      newTime = 0;
      message.warning("时间点不能小于0，已自动调整");
    } else if (newTime > 2400) {
      newTime = 2400;
      message.warning("时间点不能大于2400，已自动调整");
    }

    // 验证是否大于前一个时间点
    if (index > 0 && newTime <= getPreviousTime(index)) {
      newTime = getPreviousTime(index) + 5;
      message.warning("时间点必须大于前一个时间点，已自动调整");
    }

    // 验证是否小于后一个时间点
    if (index < data.length - 1 && newTime >= data[index + 1].time) {
      newTime = data[index + 1].time - 5;
      message.warning("时间点必须小于后一个时间点，已自动调整");
    }

    return newTime;
  };

  // 添加新行
  const addRow = (index) => {
    if (disabled) return;

    const midValue = Math.floor((data[index].time + data[index + 1].time) / 2);
    const roundedValue = Math.round(midValue / 5) * 5;
    const newTime = Math.max(
      data[index].time + 5,
      Math.min(data[index + 1].time - 5, roundedValue)
    );

    const newData = [...data];
    newData.splice(index + 1, 0, { time: newTime, value: 0 });

    onChange(newData);
  };

  // 删除行
  const removeRow = (index) => {
    if (disabled || data[index].fixed) return;

    const newData = [...data];
    newData.splice(index, 1);
    onChange(newData);
  };

  // 更新时间
  const updateTime = (index, time) => {
    if (disabled || data[index].fixed) return;

    const validatedTime = validateTime(time, index);
    const newData = [...data];
    newData[index].time = validatedTime;
    onChange(newData);
  };

  // 更新数值
  const updateValue = (index, value) => {
    if (disabled || index === 0) return;

    const newData = [...data];
    newData[index].value = value;
    onChange(newData);
  };

  return (
    <div>
      <div className="curve-editor">
        <div className="curve-header">
          <div className="header-time">时间节点</div>
          <div className="header-value">数值</div>
          <div className="header-slider">时间点位置 (0-2400)</div>
          <div className="header-action">操作</div>
        </div>

        <div className="time-input-container">
          {data.map((row, index) => (
            <div key={index} className={`time-row ${row.fixed ? "fixed" : ""}`}>
              <div className="input-group">
                <InputNumber
                  className="time-input"
                  value={row.time}
                  disabled={disabled || row.fixed}
                  onChange={(value) => updateTime(index, value)}
                  min={index > 0 ? data[index - 1].time + 5 : 0}
                  max={
                    index < data.length - 1 ? data[index + 1].time - 5 : 2400
                  }
                />
                <InputNumber
                  className="value-input"
                  value={row.value}
                  disabled={disabled || index === 0}
                  onChange={(value) => updateValue(index, value)}
                />
              </div>

              <div className="slider-container">
                <div className="slider-wrapper">
                  <div className="slider-mark"></div>
                  {index > 0 && (
                    <div
                      className="slider-range"
                      style={{
                        left: `${(getPreviousTime(index) / 2400) * 100}%`,
                        width: `${
                          ((row.time - getPreviousTime(index)) / 2400) * 100
                        }%`,
                      }}
                    ></div>
                  )}
                  <div
                    className={`slider-handle ${row.fixed ? "fixed" : ""}`}
                    style={{ left: `${(row.time / 2400) * 100}%` }}
                  ></div>
                  <div
                    className="slider-value"
                    style={{ left: `${(row.time / 2400) * 100}%` }}
                  >
                    {row.time}
                  </div>
                </div>

                <div className="slider-labels">
                  <div className="slider-label" style={{ left: "0%" }}>
                    0
                  </div>
                  <div className="slider-label" style={{ left: "25%" }}>
                    600
                  </div>
                  <div className="slider-label" style={{ left: "50%" }}>
                    1200
                  </div>
                  <div className="slider-label" style={{ left: "75%" }}>
                    1800
                  </div>
                  <div className="slider-label" style={{ left: "100%" }}>
                    2400
                  </div>
                </div>

                {index > 0 && (
                  <div className="time-display">
                    时间区间: {getPreviousTime(index)} - {row.time}
                    (长度: {row.time - getPreviousTime(index)})
                  </div>
                )}
              </div>

              <div className="button-group">
                <Button
                  icon={<PlusOutlined />}
                  shape="circle"
                  size="small"
                  onClick={() => addRow(index)}
                  disabled={disabled || index === data.length - 1}
                />
                <Button
                  icon={<DeleteOutlined />}
                  shape="circle"
                  size="small"
                  onClick={() => removeRow(index)}
                  disabled={disabled || row.fixed}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="chart-container">
        <div ref={chartRef} style={{ width: "100%", height: "300px" }}></div>
      </div>

      <div className="instructions">
        <ul>
          <li>第一行和最后一行是固定数据，不可修改或删除</li>
          <li>
            点击"+"按钮在当前行下方添加新行; 点击"-"按钮删除当前行（固定行除外）
          </li>
          <li>
            时间点必须是5的倍数，且必须在0到2400之间;
            时间点必须严格大于前一时间点，小于后一时间点
          </li>
        </ul>
      </div>
    </div>
  );
};

const MeltMachinePlanManagement = () => {
  const [plans, setPlans] = useState(mockPlanData);
  const [parameters, setParameters] = useState(mockParameterData);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [activeTab, setActiveTab] = useState("single");
  const [searchForm] = Form.useForm();
  const [planForm] = Form.useForm();
  const [paramForms, setParamForms] = useState({});

  // 加载数据（这里模拟API调用）
  useEffect(() => {
    setPlans(mockPlanData);
    setParameters(mockParameterData);
  }, []);

  // 初始化或重置参数表单
  const initParamForms = (planId = null) => {
    const planParams = planId
      ? parameters[planId]
      : {
          singleParams: {
            vacuumTime: 0,
            secondVacuumEnable: 0,
            secondVacuumDelay: 0,
            moldSpeed: 0,
            electrodeLiftSpeed: 0,
            electrodeOpenCloseSpeed: 0,
            autoArcBreakTime: 0,
          },
          fixedArrays: {
            bigBlowOn: Array(10).fill(0),
            bigBlowOff: Array(10).fill(0),
            vacuumPumpFrequency: Array(10).fill(0),
            vacuumPumpTime: Array(10).fill(0),
            insulationPlateTime: Array(7).fill(0),
            insulationPlatePosition: Array(7).fill(0),
          },
          dynamicArrays: {
            electrodeLiftCurve1: [
              { time: 0, value: 0, fixed: true },
              { time: 2400, value: 0, fixed: true },
            ],
            electrodeLiftCurve2: [
              { time: 0, value: 0, fixed: true },
              { time: 2400, value: 0, fixed: true },
            ],
            electrodeLiftCurve3: [
              { time: 0, value: 0, fixed: true },
              { time: 2400, value: 0, fixed: true },
            ],
            electrodeLiftCurve4: [
              { time: 0, value: 0, fixed: true },
              { time: 2400, value: 0, fixed: true },
            ],
            currentSettingCurve: [
              { time: 0, value: 0, fixed: true },
              { time: 2400, value: 0, fixed: true },
            ],
            electrodeOpenCloseCurve1: [
              { time: 0, value: 0, fixed: true },
              { time: 2400, value: 0, fixed: true },
            ],
            electrodeOpenCloseCurve2: [
              { time: 0, value: 0, fixed: true },
              { time: 2400, value: 0, fixed: true },
            ],
            electrodeOpenCloseCurve3: [
              { time: 0, value: 0, fixed: true },
              { time: 2400, value: 0, fixed: true },
            ],
            electrodeOpenCloseCurve4: [
              { time: 0, value: 0, fixed: true },
              { time: 2400, value: 0, fixed: true },
            ],
          },
        };

    setParamForms(planParams);
  };

  // 处理搜索
  const handleSearch = (values) => {
    console.log("搜索条件:", values);
    message.info("执行搜索操作");
  };

  // 重置搜索条件
  const resetSearch = () => {
    searchForm.resetFields();
  };

  // 打开新增模态框
  const showAddModal = () => {
    setSelectedPlan(null);
    setViewMode(false);
    planForm.resetFields();
    initParamForms();
    setIsModalVisible(true);
  };

  // 打开编辑模态框
  const showEditModal = (record) => {
    setSelectedPlan(record);
    setViewMode(false);
    planForm.setFieldsValue(record);
    initParamForms(record.id);
    setIsModalVisible(true);
  };

  // 打开查看模态框
  const showViewModal = (record) => {
    setSelectedPlan(record);
    setViewMode(true);
    planForm.setFieldsValue(record);
    initParamForms(record.id);
    setIsModalVisible(true);
  };

  // 处理删除
  const handleDelete = (record) => {
    Modal.confirm({
      title: "确认删除",
      content: `确定要删除方案 ${record.planCode} 吗？`,
      onOk: () => {
        setPlans(plans.filter((p) => p.id !== record.id));
        setParameters((prev) => {
          const newParams = { ...prev };
          delete newParams[record.id];
          return newParams;
        });
        message.success("删除成功");
      },
    });
  };

  // 保存方案和参数
  const handleSave = () => {
    planForm.validateFields().then((planValues) => {
      const newPlan = {
        ...planValues,
        id: selectedPlan ? selectedPlan.id : Date.now(),
        createdAt: selectedPlan
          ? selectedPlan.createdAt
          : dayjs().format("YYYY-MM-DD HH:mm:ss"),
        createdBy: selectedPlan ? selectedPlan.createdBy : "当前用户",
        updatedAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
        updatedBy: "当前用户",
      };

      if (selectedPlan) {
        setPlans(plans.map((p) => (p.id === selectedPlan.id ? newPlan : p)));
        setParameters((prev) => ({
          ...prev,
          [selectedPlan.id]: paramForms,
        }));
      } else {
        setPlans([...plans, newPlan]);
        setParameters((prev) => ({
          ...prev,
          [newPlan.id]: paramForms,
        }));
      }

      setIsModalVisible(false);
      message.success(selectedPlan ? "更新成功" : "添加成功");
    });
  };

  // 更新参数表单字段
  const updateParamField = (category, field, value) => {
    setParamForms((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value,
      },
    }));
  };

  // 更新曲线数据
  const updateCurveData = (curveName, data) => {
    setParamForms((prev) => ({
      ...prev,
      dynamicArrays: {
        ...prev.dynamicArrays,
        [curveName]: data,
      },
    }));
  };

  // 渲染单个参数表单
  const renderSingleParams = () => {
    const singleParams = paramForms.singleParams || {};

    return (
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item label="真空时间">
            <InputNumber
              value={singleParams.vacuumTime}
              onChange={(value) =>
                updateParamField("singleParams", "vacuumTime", value)
              }
              disabled={viewMode}
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="二次真空启用设定">
            <Select
              value={singleParams.secondVacuumEnable}
              onChange={(value) =>
                updateParamField("singleParams", "secondVacuumEnable", value)
              }
              disabled={viewMode}
            >
              <Option value={0}>禁用</Option>
              <Option value={1}>启用</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="二次真空延迟">
            <InputNumber
              value={singleParams.secondVacuumDelay}
              onChange={(value) =>
                updateParamField("singleParams", "secondVacuumDelay", value)
              }
              disabled={viewMode}
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="模具转速">
            <InputNumber
              value={singleParams.moldSpeed}
              onChange={(value) =>
                updateParamField("singleParams", "moldSpeed", value)
              }
              disabled={viewMode}
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="电极升降速度设定">
            <InputNumber
              value={singleParams.electrodeLiftSpeed}
              onChange={(value) =>
                updateParamField("singleParams", "electrodeLiftSpeed", value)
              }
              disabled={viewMode}
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="电极开闭速度设定">
            <InputNumber
              value={singleParams.electrodeOpenCloseSpeed}
              onChange={(value) =>
                updateParamField(
                  "singleParams",
                  "electrodeOpenCloseSpeed",
                  value
                )
              }
              disabled={viewMode}
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="自动断弧时间设定">
            <InputNumber
              value={singleParams.autoArcBreakTime}
              onChange={(value) =>
                updateParamField("singleParams", "autoArcBreakTime", value)
              }
              disabled={viewMode}
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>
      </Row>
    );
  };

  // 渲染固定数组参数表单
  const renderFixedArrayParams = () => {
    const fixedArrays = paramForms.fixedArrays || {};

    return (
      <div>
        <h3>大吹气开关时间设定</h3>
        <Row gutter={16}>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((index) => (
            <Col span={6} key={`bigBlowOn-${index}`}>
              <Form.Item label={`大吹气开 ${index + 1}`}>
                <InputNumber
                  value={
                    fixedArrays.bigBlowOn ? fixedArrays.bigBlowOn[index] : 0
                  }
                  onChange={(value) => {
                    const newArray = [
                      ...(fixedArrays.bigBlowOn || Array(10).fill(0)),
                    ];
                    newArray[index] = value;
                    updateParamField("fixedArrays", "bigBlowOn", newArray);
                  }}
                  disabled={viewMode}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
          ))}
        </Row>

        <Row gutter={16}>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((index) => (
            <Col span={6} key={`bigBlowOff-${index}`}>
              <Form.Item label={`大吹气关 ${index + 1}`}>
                <InputNumber
                  value={
                    fixedArrays.bigBlowOff ? fixedArrays.bigBlowOff[index] : 0
                  }
                  onChange={(value) => {
                    const newArray = [
                      ...(fixedArrays.bigBlowOff || Array(10).fill(0)),
                    ];
                    newArray[index] = value;
                    updateParamField("fixedArrays", "bigBlowOff", newArray);
                  }}
                  disabled={viewMode}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
          ))}
        </Row>

        <h3>真空泵自动变频设定</h3>
        <Row gutter={16}>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((index) => (
            <Col span={6} key={`vacuumPumpFrequency-${index}`}>
              <Form.Item label={`频率 ${index + 1}`}>
                <InputNumber
                  value={
                    fixedArrays.vacuumPumpFrequency
                      ? fixedArrays.vacuumPumpFrequency[index]
                      : 0
                  }
                  onChange={(value) => {
                    const newArray = [
                      ...(fixedArrays.vacuumPumpFrequency || Array(10).fill(0)),
                    ];
                    newArray[index] = value;
                    updateParamField(
                      "fixedArrays",
                      "vacuumPumpFrequency",
                      newArray
                    );
                  }}
                  disabled={viewMode}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
          ))}
        </Row>

        <Row gutter={16}>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((index) => (
            <Col span={6} key={`vacuumPumpTime-${index}`}>
              <Form.Item label={`时间 ${index + 1}`}>
                <InputNumber
                  value={
                    fixedArrays.vacuumPumpTime
                      ? fixedArrays.vacuumPumpTime[index]
                      : 0
                  }
                  onChange={(value) => {
                    const newArray = [
                      ...(fixedArrays.vacuumPumpTime || Array(10).fill(0)),
                    ];
                    newArray[index] = value;
                    updateParamField("fixedArrays", "vacuumPumpTime", newArray);
                  }}
                  disabled={viewMode}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
          ))}
        </Row>

        <h3>下隔热板升降设定</h3>
        <Row gutter={16}>
          {[0, 1, 2, 3, 4, 5, 6].map((index) => (
            <Col span={6} key={`insulationPlateTime-${index}`}>
              <Form.Item label={`时间 ${index + 1}`}>
                <InputNumber
                  value={
                    fixedArrays.insulationPlateTime
                      ? fixedArrays.insulationPlateTime[index]
                      : 0
                  }
                  onChange={(value) => {
                    const newArray = [
                      ...(fixedArrays.insulationPlateTime || Array(7).fill(0)),
                    ];
                    newArray[index] = value;
                    updateParamField(
                      "fixedArrays",
                      "insulationPlateTime",
                      newArray
                    );
                  }}
                  disabled={viewMode}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
          ))}
        </Row>

        <Row gutter={16}>
          {[0, 1, 2, 3, 4, 5, 6].map((index) => (
            <Col span={6} key={`insulationPlatePosition-${index}`}>
              <Form.Item label={`位置 ${index + 1}`}>
                <InputNumber
                  value={
                    fixedArrays.insulationPlatePosition
                      ? fixedArrays.insulationPlatePosition[index]
                      : 0
                  }
                  onChange={(value) => {
                    const newArray = [
                      ...(fixedArrays.insulationPlatePosition ||
                        Array(7).fill(0)),
                    ];
                    newArray[index] = value;
                    updateParamField(
                      "fixedArrays",
                      "insulationPlatePosition",
                      newArray
                    );
                  }}
                  disabled={viewMode}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
          ))}
        </Row>
      </div>
    );
  };

  // 渲染动态数组参数表单
  const renderDynamicArrayParams = () => {
    const dynamicArrays = paramForms.dynamicArrays || {};

    return (
      <Tabs type="card">
        <TabPane tab="电极升降曲线1" key="electrodeLiftCurve1">
          <CurveEditor
            data={dynamicArrays.electrodeLiftCurve1 || []}
            onChange={(data) => updateCurveData("electrodeLiftCurve1", data)}
            disabled={viewMode}
          />
        </TabPane>
        <TabPane tab="电极升降曲线2" key="electrodeLiftCurve2">
          <CurveEditor
            data={dynamicArrays.electrodeLiftCurve2 || []}
            onChange={(data) => updateCurveData("electrodeLiftCurve2", data)}
            disabled={viewMode}
          />
        </TabPane>
        <TabPane tab="电极升降曲线3" key="electrodeLiftCurve3">
          <CurveEditor
            data={dynamicArrays.electrodeLiftCurve3 || []}
            onChange={(data) => updateCurveData("electrodeLiftCurve3", data)}
            disabled={viewMode}
          />
        </TabPane>
        <TabPane tab="电极升降曲线4" key="electrodeLiftCurve4">
          <CurveEditor
            data={dynamicArrays.electrodeLiftCurve4 || []}
            onChange={(data) => updateCurveData("electrodeLiftCurve4", data)}
            disabled={viewMode}
          />
        </TabPane>
        <TabPane tab="电流设定曲线" key="currentSettingCurve">
          <CurveEditor
            data={dynamicArrays.currentSettingCurve || []}
            onChange={(data) => updateCurveData("currentSettingCurve", data)}
            disabled={viewMode}
          />
        </TabPane>
        <TabPane tab="电极开闭曲线1" key="electrodeOpenCloseCurve1">
          <CurveEditor
            data={dynamicArrays.electrodeOpenCloseCurve1 || []}
            onChange={(data) =>
              updateCurveData("electrodeOpenCloseCurve1", data)
            }
            disabled={viewMode}
          />
        </TabPane>
        <TabPane tab="电极开闭曲线2" key="electrodeOpenCloseCurve2">
          <CurveEditor
            data={dynamicArrays.electrodeOpenCloseCurve2 || []}
            onChange={(data) =>
              updateCurveData("electrodeOpenCloseCurve2", data)
            }
            disabled={viewMode}
          />
        </TabPane>
        <TabPane tab="电极开闭曲线3" key="electrodeOpenCloseCurve3">
          <CurveEditor
            data={dynamicArrays.electrodeOpenCloseCurve3 || []}
            onChange={(data) =>
              updateCurveData("electrodeOpenCloseCurve3", data)
            }
            disabled={viewMode}
          />
        </TabPane>
        <TabPane tab="电极开闭曲线4" key="electrodeOpenCloseCurve4">
          <CurveEditor
            data={dynamicArrays.electrodeOpenCloseCurve4 || []}
            onChange={(data) =>
              updateCurveData("electrodeOpenCloseCurve4", data)
            }
            disabled={viewMode}
          />
        </TabPane>
      </Tabs>
    );
  };

  // 方案表格列定义
  const planColumns = [
    {
      title: "序号",
      key: "index",
      width: 60,
      render: (text, record, index) => index + 1,
    },
    {
      title: "方案编号",
      dataIndex: "planCode",
      key: "planCode",
      width: 120,
    },
    {
      title: "图号",
      dataIndex: "drawingNumber",
      key: "drawingNumber",
      width: 120,
    },
    {
      title: "版本",
      dataIndex: "version",
      key: "version",
      width: 80,
    },
    {
      title: "英寸",
      dataIndex: "inch",
      key: "inch",
      width: 80,
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 80,
      render: (status) => (
        <Tag color={status === "启用" ? "green" : "red"}>{status}</Tag>
      ),
    },
    {
      title: "制定人",
      dataIndex: "createdBy",
      key: "createdBy",
      width: 100,
    },
    {
      title: "制定时间",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
    },
    {
      title: "修改人",
      dataIndex: "updatedBy",
      key: "updatedBy",
      width: 100,
    },
    {
      title: "修改时间",
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: 150,
    },
    {
      title: "操作",
      key: "action",
      width: 200,
      fixed: "right",
      render: (text, record) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => showViewModal(record)}
          >
            查看
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => showEditModal(record)}
          >
            编辑
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px", minHeight: "800px" }}>
      <Card title="熔融机方案管理系统" style={{ marginBottom: 24 }}>
        {/* 搜索区域 */}
        <Form
          form={searchForm}
          layout="inline"
          onFinish={handleSearch}
          style={{ marginBottom: 16 }}
        >
          <Row gutter={16} style={{ width: "100%" }}>
            <Col span={6}>
              <Form.Item name="planCode" label="方案编号">
                <Input placeholder="请输入方案编号" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="drawingNumber" label="图号">
                <Input placeholder="请输入图号" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="status" label="状态">
                <Select placeholder="请选择状态">
                  <Option value="启用">启用</Option>
                  <Option value="停用">停用</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="createdRange" label="制定时间">
                <RangePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="updatedRange" label="修改时间">
                <RangePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item>
                <Space>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<SearchOutlined />}
                  >
                    搜索
                  </Button>
                  <Button onClick={resetSearch} icon={<CloseOutlined />}>
                    重置
                  </Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>

        <Divider />

        {/* 操作按钮 */}
        <div style={{ marginBottom: 16 }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal}>
            新增方案
          </Button>
        </div>

        {/* 方案表格 */}
        <Table
          columns={planColumns}
          dataSource={plans}
          rowKey="id"
          scroll={{ x: 1500 }}
          bordered
          size="middle"
        />
      </Card>

      {/* 新增/编辑/查看模态框 */}
      <Modal
        title={`${
          viewMode ? "查看" : selectedPlan ? "编辑" : "新增"
        }熔融机方案`}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        width={1200}
        style={{ top: 20 }}
        footer={
          viewMode
            ? [
                <Button key="close" onClick={() => setIsModalVisible(false)}>
                  关闭
                </Button>,
              ]
            : [
                <Button key="cancel" onClick={() => setIsModalVisible(false)}>
                  取消
                </Button>,
                <Button
                  key="save"
                  type="primary"
                  icon={<SaveOutlined />}
                  onClick={handleSave}
                >
                  保存
                </Button>,
              ]
        }
      >
        <Form form={planForm} layout="vertical" style={{ marginTop: 24 }}>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="planCode"
                label="方案编号"
                rules={[{ required: true, message: "请输入方案编号" }]}
              >
                <Input disabled={viewMode} placeholder="请输入方案编号" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="drawingNumber"
                label="图号"
                rules={[{ required: true, message: "请输入图号" }]}
              >
                <Input disabled={viewMode} placeholder="请输入图号" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="version"
                label="版本"
                rules={[{ required: true, message: "请输入版本" }]}
              >
                <Input disabled={viewMode} placeholder="请输入版本" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="inch"
                label="英寸"
                rules={[{ required: true, message: "请输入英寸" }]}
              >
                <Input disabled={viewMode} placeholder="请输入英寸" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="status"
                label="状态"
                rules={[{ required: true, message: "请选择状态" }]}
              >
                <Select disabled={viewMode} placeholder="请选择状态">
                  <Option value="启用">启用</Option>
                  <Option value="停用">停用</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>

        <Divider>方案参数</Divider>

        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="单个参数" key="single">
            {renderSingleParams()}
          </TabPane>
          <TabPane tab="固定数组参数" key="fixed">
            {renderFixedArrayParams()}
          </TabPane>
          <TabPane tab="曲线参数" key="dynamic">
            {renderDynamicArrayParams()}
          </TabPane>
        </Tabs>
      </Modal>

      <style jsx>{`
        .curve-editor {
          border: 1px solid #d9d9d9;
          border-radius: 4px;
          padding: 16px;
          margin-bottom: 16px;
        }

        .curve-header {
          display: flex;
          margin-bottom: 16px;
          font-weight: bold;
        }

        .header-time,
        .header-value {
          width: 100px;
        }

        .header-slider {
          flex: 1;
        }

        .header-action {
          width: 80px;
        }

        .time-input-container {
          margin-bottom: 16px;
        }

        .time-row {
          display: flex;
          align-items: center;
          margin-bottom: 16px;
        }

        .time-row.fixed {
          opacity: 0.7;
        }

        .input-group {
          display: flex;
          width: 200px;
        }

        .time-input,
        .value-input {
          width: 100px;
          margin-right: 8px;
        }

        .slider-container {
          flex: 1;
          margin: 0 16px;
          position: relative;
        }

        .slider-wrapper {
          position: relative;
          height: 30px;
          background: #f5f5f5;
          border-radius: 4px;
          margin-bottom: 30px;
        }

        .slider-mark {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: #1890ff;
          top: 13px;
        }

        .slider-range {
          position: absolute;
          height: 4px;
          background: #52c41a;
          top: 13px;
        }

        .slider-handle {
          position: absolute;
          width: 12px;
          height: 12px;
          background: #1890ff;
          border-radius: 50%;
          top: 9px;
          margin-left: -6px;
          cursor: pointer;
        }

        .slider-handle.fixed {
          background: #52c41a;
        }

        .slider-value {
          position: absolute;
          top: -20px;
          margin-left: -10px;
          font-size: 12px;
        }

        .slider-labels {
          position: relative;
          height: 20px;
        }

        .slider-label {
          position: absolute;
          font-size: 12px;
          transform: translateX(-50%);
        }

        .time-display {
          font-size: 12px;
          margin-top: 8px;
        }

        .button-group {
          width: 80px;
        }

        .chart-container {
          margin-top: 24px;
          border: 1px solid #d9d9d9;
          border-radius: 4px;
          padding: 16px;
        }

        .instructions {
          margin-top: 16px;
          padding: 16px;
          background: #f9f9f9;
          border-radius: 4px;
        }

        .instructions ul {
          margin: 0;
          padding-left: 16px;
        }

        .instructions li {
          margin-bottom: 8px;
          font-size: 12px;
          color: #666;
        }
      `}</style>
    </div>
  );
};

export default MeltMachinePlanManagement;

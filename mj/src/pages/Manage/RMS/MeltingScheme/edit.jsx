import React, { useEffect, useState } from "react";
import { MyBreadcrumb } from "../../../../components/CommonCard";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  Col,
  Divider,
  Flex,
  Form,
  Input,
  InputNumber,
  message,
  Row,
  Select,
  Spin,
  Tabs,
  Typography,
} from "antd";
import { selectList2Option } from "../../../../utils/string";
import {
  ArrowLeftOutlined,
  FileTextTwoTone,
  SaveOutlined,
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { ComputeFormCol, GenerateFormItem } from "../../../../utils/obj";
import ReactECharts from "echarts-for-react";
import {
  rmsGetMeltRecipeParams,
  rmsInsertMeltRecipe,
  rmsSaveMeltRecipe,
} from "../../../../apis/data_api";
const MemoizedChart = React.memo(ReactECharts);
const { Title } = Typography;

const CurveEditor = ({ data, onChange, disabled }) => {
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

  // 图表配置选项
  const chartOpt = React.useMemo(() => {
    if (!data || data.length < 2) return {};

    const chartData = getChartData();

    return {
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
      grid: {
        left: 40,
        right: 30,
        bottom: 50,
        top: 40,
      },
      xAxis: {
        type: "value",
        name: "时间",
        min: 0,
        max: 2400,
        interval: 200,
        nameLocation: "center",
        nameGap: 30,
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
    };
  }, [data]);

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col span={16}>
          <div className="curve-editor">
            <div className="curve-header">
              <div className="header-time">时间节点</div>
              <div className="header-value">数值</div>
              <div className="header-slider">时间点位置 (0-2400)</div>
              <div className="header-action">操作</div>
            </div>

            <div className="time-input-container">
              {data.map((row, index) => (
                <div
                  key={index}
                  className={`time-row ${row.fixed ? "fixed" : ""}`}
                >
                  <div className="input-group">
                    <InputNumber
                      className="time-input"
                      value={row.time}
                      disabled={disabled || row.fixed}
                      onChange={(value) => updateTime(index, value)}
                      min={index > 0 ? data[index - 1].time + 5 : 0}
                      max={
                        index < data.length - 1
                          ? data[index + 1].time - 5
                          : 2400
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
          <div className="instructions">
            <ul>
              <li>第一行和最后一行是固定数据，不可修改或删除</li>
              <li>
                点击"+"按钮在当前行下方添加新行;
                点击"-"按钮删除当前行（固定行除外）
              </li>
              <li>
                时间点必须是5的倍数，且必须在0到2400之间;
                时间点必须严格大于前一时间点，小于后一时间点
              </li>
            </ul>
          </div>
        </Col>
        <Col span={8}>
          <div className="chart-container">
            {data && data.length >= 2 && (
              <MemoizedChart
                option={chartOpt}
                style={{ width: "100%", height: 320 }}
                notMerge={true}
                lazyUpdate={true}
              />
            )}
          </div>
        </Col>
      </Row>

      <style jsx="true">{`
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
          border: 1px solid #d9d9d9;
          border-radius: 4px;
          padding: 10px;
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
const default_line_data = {
  电极升降曲线1: [
    { time: 0, value: 0, fixed: true },
    { time: 2400, value: 0, fixed: true },
  ],
  电极升降曲线2: [
    { time: 0, value: 0, fixed: true },
    { time: 2400, value: 0, fixed: true },
  ],
  电极升降曲线3: [
    { time: 0, value: 0, fixed: true },
    { time: 2400, value: 0, fixed: true },
  ],
  电极升降曲线4: [
    { time: 0, value: 0, fixed: true },
    { time: 2400, value: 0, fixed: true },
  ],
  电流设定曲线: [
    { time: 0, value: 0, fixed: true },
    { time: 2400, value: 0, fixed: true },
  ],
  电极开闭曲线1: [
    { time: 0, value: 0, fixed: true },
    { time: 2400, value: 0, fixed: true },
  ],
  电极开闭曲线2: [
    { time: 0, value: 0, fixed: true },
    { time: 2400, value: 0, fixed: true },
  ],
  电极开闭曲线3: [
    { time: 0, value: 0, fixed: true },
    { time: 2400, value: 0, fixed: true },
  ],
  电极开闭曲线4: [
    { time: 0, value: 0, fixed: true },
    { time: 2400, value: 0, fixed: true },
  ],
};
function MeltSchemeEditPage() {
  const [page, setPage] = useState("新增"); // 新增，编辑，查看
  const [load, setLoad] = useState(false);

  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [form_param] = Form.useForm();
  const [id, setId] = useState("");
  const { state = {} } = useLocation();
  const [line_data, setLineData] = useState(default_line_data);
  const [param_data, setParamData] = useState({});
  const updateCurveData = (curveName, data) => {
    setLineData((prev) => ({
      ...prev,
      [curveName]: data,
    }));
  };
  const query = () => {
    setLoad(true);
    rmsGetMeltRecipeParams(
      { id },
      (res) => {
        setLoad(false);
        const { code, data, msg } = res.data;
        if (code === 0) {
          message.success("查询成功");
          form.setFieldsValue(data.基础信息);
          form_param.setFieldsValue(data.参数);
          setParamData(data.参数);
          setLineData(data.曲线);
        } else {
          message.error(msg);
        }
      },
      () => {
        setLoad(false);
        message.error("查询失败");
      }
    );
  };
  const submit = async () => {
    const values1 = await form
      .validateFields()
      .then((res) => res)
      .catch((err) => {
        const { errorFields } = err;
        let err_list = errorFields.map((e) => e.errors);
        message.warning(err_list.join("\n"));
        return false;
      });

    if (!values1) return;
    const values2 = form_param.getFieldsValue();
    const param = {
      基础信息: values1,
      参数: { ...default_param_form_data, ...param_data, ...values2 },
      曲线: line_data,
    };
    setLoad(true);
    if (page === "编辑") {
      param["id"] = id;
    }
    rmsSaveMeltRecipe(
      param,
      (res) => {
        setLoad(false);
        const { code, msg, data } = res.data;
        if (code === 0) {
          message.success("保存成功");
          navigate("/mng/rms/melting_scheme");
        } else {
          message.error(msg);
        }
      },
      () => {
        setLoad(false);
        message.error("保存失败");
      }
    );
  };
  const default_param_form_data = {
    真空时间: 0,
    二次真空启用设定: "禁用",
    二次真空延迟: 0,
    模具转速: 0,
    电极升降速度设定: 0,
    电极开闭速度设定: 0,
    自动断弧时间设定: 0,
    下隔热板自动升降设定: [
      { 时间: 0, 位置: 0 },
      { 时间: 0, 位置: 0 },
      { 时间: 0, 位置: 0 },
      { 时间: 0, 位置: 0 },
      { 时间: 0, 位置: 0 },
      { 时间: 0, 位置: 0 },
      { 时间: 0, 位置: 0 },
    ],
    真空泵自动变频设定: [
      { 时间: 0, 频率: 0 },
      { 时间: 0, 频率: 0 },
      { 时间: 0, 频率: 0 },
      { 时间: 0, 频率: 0 },
      { 时间: 0, 频率: 0 },
      { 时间: 0, 频率: 0 },
      { 时间: 0, 频率: 0 },
      { 时间: 0, 频率: 0 },
      { 时间: 0, 频率: 0 },
      { 时间: 0, 频率: 0 },
    ],
    大气吹开关时间设定: [
      { 开: 0, 关: 0 },
      { 开: 0, 关: 0 },
      { 开: 0, 关: 0 },
      { 开: 0, 关: 0 },
      { 开: 0, 关: 0 },
      { 开: 0, 关: 0 },
      { 开: 0, 关: 0 },
      { 开: 0, 关: 0 },
      { 开: 0, 关: 0 },
      { 开: 0, 关: 0 },
    ],
    小气吹开关时间设定: [
      { 开: 0, 关: 0 },
      { 开: 0, 关: 0 },
      { 开: 0, 关: 0 },
      { 开: 0, 关: 0 },
      { 开: 0, 关: 0 },
      { 开: 0, 关: 0 },
      { 开: 0, 关: 0 },
      { 开: 0, 关: 0 },
      { 开: 0, 关: 0 },
      { 开: 0, 关: 0 },
    ],
  };
  const SigleFormDataItems = [
    { name: "真空时间", type: "input_number" },
    {
      name: "二次真空启用设定",
      type: "select",
      opt: ["禁用", "启用"],
    },
    {
      name: "二次真空延迟",
      type: "input_number",
    },
    {
      name: "模具转速",
      type: "input_number",
    },
    {
      name: "电极升降速度设定",
      type: "input_number",
    },
    {
      name: "电极开闭速度设定",
      type: "input_number",
    },
    {
      name: "自动断弧时间设定",
      type: "input_number",
    },
  ];
  const renderSingleParams = () => (
    <Row gutter={[16, 16]}>
      {SigleFormDataItems.map((item, _) => (
        <Col span={6} key={_}>
          <GenerateFormItem item={item} />
        </Col>
      ))}
    </Row>
  );
  const multiFormList = ({ title = "", itemNames = [] }) => {
    const widthP =
      itemNames.length === 0
        ? "100%"
        : `${Math.floor(100 / itemNames.length)}%`;

    return (
      <Flex
        vertical
        gap={10}
        style={{
          border: "1px solid #d9d9d9",
          padding: "16px",
          borderRadius: "4px",
        }}
      >
        <Title level={5}>{title}</Title>
        <Form.List name={title} {...ComputeFormCol(10)}>
          {(fields, {}) => (
            <Flex vertical gap={10} style={{ width: "100%" }}>
              {fields.map(({ key, name }, index) => (
                <Flex key={key} gap={16}>
                  {itemNames.map((iName, _) => (
                    <Form.Item
                      key={iName + _}
                      label={`${iName} ${index + 1}`}
                      name={[name, iName]}
                      style={{ width: widthP }}
                    >
                      <InputNumber style={{ width: "100%" }} />
                    </Form.Item>
                  ))}
                </Flex>
              ))}
            </Flex>
          )}
        </Form.List>
      </Flex>
    );
  };
  const renderFixedArrayParams = () => (
    <Row gutter={[16, 16]}>
      <Col span={6}>
        {multiFormList({
          title: "大气吹开关时间设定",
          itemNames: ["开", "关"],
        })}
      </Col>
      <Col span={6}>
        {multiFormList({
          title: "小气吹开关时间设定",
          itemNames: ["开", "关"],
        })}
      </Col>
      <Col span={6}>
        {multiFormList({
          title: "真空泵自动变频设定",
          itemNames: ["时间", "频率"],
        })}
      </Col>
      <Col span={6}>
        {multiFormList({
          title: "下隔热板自动升降设定",
          itemNames: ["时间", "位置"],
        })}
      </Col>
    </Row>
  );
  const line_tab_items = Object.keys(default_line_data).map((name) => ({
    key: name,
    label: name,
    children: (
      <CurveEditor
        data={line_data[name] || []}
        onChange={(data) => updateCurveData(name, data)}
        disabled={page === "查看"}
      />
    ),
  }));
  const renderDynamicArrayParams = () => (
    <Tabs type="card" items={line_tab_items} destroyOnHidden={true} />
  );
  const tab_items = [
    {
      key: "single",
      label: "单个参数",
      children: renderSingleParams(),
    },
    { key: "fixed", label: "固定数组参数", children: renderFixedArrayParams() },
    { key: "dynamic", label: "曲线参数", children: renderDynamicArrayParams() },
  ];

  useEffect(() => {
    if (id) {
      query();
    }
  }, [id]);
  useEffect(() => {
    if (state) {
      const { opt, Id = "" } = state;
      setPage(opt || "新增");
      setId(Id);
    }
  }, [state]);
  return (
    <div>
      <MyBreadcrumb items={[window.sys_name, "RMS", "熔融方案管理", page]} />
      <div className="content_root">
        <Spin spinning={load}>
          <Flex vertical gap={10}>
            <Flex justify="space-between">
              <Title level={3}>
                <FileTextTwoTone />
                <span style={{ marginLeft: 10 }}>{`${page}熔融方案`}</span>
              </Title>
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate("/mng/rms/melting_scheme")}
              >
                返回上一页
              </Button>
            </Flex>
            <Form
              disabled={page !== "新增"}
              form={form}
              layout="inline"
              initialValues={{
                方案编号: "",
                图号: "",
                版本: "",
                英寸: "",
                状态: "启用",
              }}
            >
              <Form.Item name="方案编号" label="方案编号">
                <Input placeholder="自动生成" disabled style={{ width: 160 }} />
              </Form.Item>
              <Form.Item name="图号" label="图号" rules={[{ required: true }]}>
                <Input style={{ width: 160 }} />
              </Form.Item>
              <Form.Item name="版本" label="版本" rules={[{ required: true }]}>
                <Input style={{ width: 160 }} />
              </Form.Item>
              <Form.Item name="英寸" label="英寸" rules={[{ required: true }]}>
                <Input style={{ width: 160 }} />
              </Form.Item>
              <Form.Item label="状态" name="状态" rules={[{ required: true }]}>
                <Select
                  options={selectList2Option(["启用", "停用"])}
                  style={{ width: 160 }}
                />
              </Form.Item>
            </Form>
            <Divider>方案参数</Divider>
            <Form
              form={form_param}
              component={false}
              {...ComputeFormCol(8)}
              initialValues={default_param_form_data}
              disabled={page === "查看"}
            >
              <Tabs items={tab_items} />
            </Form>
            <Flex justify="end">
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={submit}
                disabled={page === "查看"}
              >
                保存
              </Button>
            </Flex>
          </Flex>
        </Spin>
      </div>
    </div>
  );
}

export default MeltSchemeEditPage;

import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Select,
  DatePicker,
  Table,
  Button,
  Modal,
  message,
  Card,
  Row,
  Col,
  Divider,
  Space,
  Popconfirm,
  Tabs,
  Tag,
  Statistic,
  InputNumber,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ExportOutlined,
  SearchOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);
import axios from "axios";
import * as XLSX from "xlsx";
import { MyBreadcrumb } from "../../../components/CommonCard";
import { base_url } from "../../../apis/instance";

const { Option } = Select;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

// API基础URL
const API_BASE_URL = `${base_url}/api/sms_router/api`;

// 班次选项
const SHIFT_OPTIONS = [
  { label: "早班", value: "morning" },
  { label: "中班", value: "noon" },
  { label: "晚班", value: "night" },
];

// 选项类型映射
const OPTION_TYPES = {
  DRAWING_NUMBER: "drawing_number",
  MACHINE: "machine",
  WEIGHER: "weigher",
  SAND_TYPE: "sand_type",
  BATCH_NUMBER: "batch_number",
  RECIPIENT: "recipient",
};

const SandManagementSystem = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [options, setOptions] = useState({
    [OPTION_TYPES.DRAWING_NUMBER]: [],
    [OPTION_TYPES.MACHINE]: [],
    [OPTION_TYPES.WEIGHER]: [],
    [OPTION_TYPES.SAND_TYPE]: [],
    [OPTION_TYPES.BATCH_NUMBER]: [],
    [OPTION_TYPES.RECIPIENT]: [],
  });
  const [activeTask, setActiveTask] = useState(null);
  const [isTaskModalVisible, setIsTaskModalVisible] = useState(false);
  const [isRecordModalVisible, setIsRecordModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("tasks");
  const [taskForm] = Form.useForm();
  const [recordForm] = Form.useForm();
  const [searchForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  // 搜索条件状态
  const [searchParams, setSearchParams] = useState({
    drawing_number: undefined,
    machine: undefined,
    dateRange: undefined,
  });

  // 初始化数据
  useEffect(() => {
    fetchTasks();
    fetchAllOptions();
  }, []);

  // 根据搜索条件过滤任务
  useEffect(() => {
    filterTasks();
  }, [tasks, searchParams]);

  // 获取所有任务
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/tasks`);
      // 解析每个任务的sand_types
      const tasksWithParsedSandTypes = response.data.map((task) => ({
        ...task,
        sand_types: JSON.parse(task.sand_types),
        records: task.records || [],
      }));
      setTasks(tasksWithParsedSandTypes);
    } catch (error) {
      message.error("获取任务列表失败");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 获取所有选项
  const fetchAllOptions = async () => {
    try {
      const types = Object.values(OPTION_TYPES);
      const promises = types.map((type) =>
        axios.get(`${API_BASE_URL}/options/${type}`)
      );

      const responses = await Promise.all(promises);
      const newOptions = {};

      types.forEach((type, index) => {
        newOptions[type] = responses[index].data;
      });

      setOptions(newOptions);
    } catch (error) {
      message.error("获取选项失败");
      console.error(error);
    }
  };

  // 根据搜索条件过滤任务
  const filterTasks = () => {
    let filtered = [...tasks];

    if (searchParams.drawing_number) {
      filtered = filtered.filter((task) =>
        task.drawing_number.includes(searchParams.drawing_number)
      );
    }

    if (searchParams.machine) {
      filtered = filtered.filter((task) =>
        task.machine.includes(searchParams.machine)
      );
    }

    if (searchParams.dateRange && searchParams.dateRange.length === 2) {
      const [startDate, endDate] = searchParams.dateRange;
      filtered = filtered.filter((task) => {
        const taskDate = dayjs(task.date);
        return taskDate.isBetween(startDate, endDate, "day", "[]");
      });
    }

    setFilteredTasks(filtered);
  };

  // 处理搜索
  const handleSearch = (values) => {
    setSearchParams({
      drawing_number: values.drawing_number,
      machine: values.machine,
      dateRange: values.dateRange,
    });
  };

  // 重置搜索
  const handleResetSearch = () => {
    searchForm.resetFields();
    setSearchParams({
      drawing_number: undefined,
      machine: undefined,
      dateRange: undefined,
    });
  };

  // 添加新选项
  const addOption = async (type, value) => {
    try {
      await axios.post(`${API_BASE_URL}/options/${type}`, { value });
      // 更新本地选项状态
      setOptions((prev) => ({
        ...prev,
        [type]: [...prev[type], value],
      }));
      return true;
    } catch (error) {
      message.error("添加选项失败");
      console.error(error);
      return false;
    }
  };

  // 处理任务提交
  const handleTaskSubmit = async (values) => {
    try {
      const taskData = {
        ...values,
        date: values.date.format("YYYY-MM-DD"),
        sand_types: JSON.stringify(values.sand_types),
      };

      const response = await axios.post(`${API_BASE_URL}/tasks`, taskData);
      console.log("Response data:", response);
      // 解析返回的任务的sand_types
      //   const newTask = {
      //     ...response.data,
      //     sand_types: JSON.parse(response.data.sand_types),
      //     records: [],
      //   };

      //   // 更新任务列表
      //   setTasks([...tasks, newTask]);

      // 关闭模态框并重置表单
      setIsTaskModalVisible(false);
      taskForm.resetFields();
      fetchTasks();
      filterTasks();
      message.success("任务创建成功");
    } catch (error) {
      message.error("创建任务失败");
      console.error(error);
    }
  };

  // 处理领用记录提交
  const handleRecordSubmit = async (values) => {
    if (!activeTask) {
      message.error("请先选择任务");
      return;
    }

    try {
      const details = activeTask.sand_types.map((type) => ({
        type,
        batch_number: values[`${type}-batch_number`],
        weight: values[`${type}-weight`] || 0,
      }));

      const recordData = {
        recipient: values.recipient,
        details: JSON.stringify(details),
      };

      const response = await axios.post(
        `${API_BASE_URL}/tasks/${activeTask.id}/records`,
        recordData
      );

      // 更新本地任务状态
      const updatedTasks = tasks.map((task) =>
        task.id === activeTask.id
          ? {
              ...task,
              records: [...(task.records || []), response.data],
            }
          : task
      );

      setTasks(updatedTasks);
      setActiveTask({
        ...activeTask,
        records: [...(activeTask.records || []), response.data],
      });
      setIsRecordModalVisible(false);
      recordForm.resetFields();
      message.success("领用记录添加成功");
    } catch (error) {
      message.error("添加领用记录失败");
      console.error(error);
    }
  };

  // 删除任务
  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/tasks/${id}`);

      // 更新任务列表
      const updatedTasks = tasks.filter((task) => task.id !== id);
      setTasks(updatedTasks);

      if (activeTask && activeTask.id === id) {
        setActiveTask(null);
      }

      message.success("任务删除成功");
    } catch (error) {
      message.error("删除任务失败");
      console.error(error);
    }
  };

  // 删除记录
  const handleDeleteRecord = async (taskId, recordId) => {
    try {
      await axios.delete(`${API_BASE_URL}/records/${recordId}`);

      // 更新任务列表
      const updatedTasks = tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              records: task.records.filter((record) => record.id !== recordId),
            }
          : task
      );
      setTasks(updatedTasks);

      if (activeTask && activeTask.id === taskId) {
        setActiveTask({
          ...activeTask,
          records: activeTask.records.filter(
            (record) => record.id !== recordId
          ),
        });
      }

      message.success("记录删除成功");
    } catch (error) {
      message.error("删除记录失败");
      console.error(error);
    }
  };

  // 计算各类砂子总重量
  const calculateTotalWeights = () => {
    if (!activeTask || !activeTask.records) return {};

    const totals = {};
    activeTask.sand_types.forEach((type) => {
      totals[type] = 0;
    });

    activeTask.records.forEach((record) => {
      try {
        const details = JSON.parse(record.details);
        details.forEach((detail) => {
          if (detail.weight) {
            totals[detail.type] = (totals[detail.type] || 0) + detail.weight;
          }
        });
      } catch (error) {
        console.error("解析记录详情失败:", error);
      }
    });

    return totals;
  };

  // 导出Excel (前端实现)
  const exportToExcel = () => {
    if (!activeTask) {
      message.error("请先选择任务");
      return;
    }

    // 准备任务信息数据
    const taskInfo = [
      ["任务信息"],
      ["图号", activeTask.drawing_number],
      ["领用机台", activeTask.machine],
      ["班次", SHIFT_OPTIONS.find((s) => s.value === activeTask.shift)?.label],
      ["日期", activeTask.date],
      ["称砂人员", activeTask.weigher],
      [], // 空行
    ];

    // 准备领用记录数据
    const recordsData = [
      ["领用记录"],
      [
        "领用时间",
        "领用人",
        ...activeTask.sand_types.flatMap((type) => [
          `${type}批号`,
          `${type}重量(kg)`,
        ]),
      ],
    ];

    activeTask.records.forEach((record) => {
      try {
        const details = JSON.parse(record.details);
        const row = [record.time, record.recipient];

        activeTask.sand_types.forEach((type) => {
          const detail = details.find((d) => d.type === type);
          row.push(detail ? detail.batch_number : "");
          row.push(detail ? detail.weight : "");
        });

        recordsData.push(row);
      } catch (error) {
        console.error("解析记录详情失败:", error);
      }
    });

    // 准备统计信息数据
    const totals = calculateTotalWeights();
    const statsData = [
      [], // 空行
      ["统计信息"],
      ["砂子类别", "总重量(kg)"],
      ...Object.entries(totals).map(([type, weight]) => [type, weight]),
      ["总计", Object.values(totals).reduce((sum, weight) => sum + weight, 0)],
    ];

    // 合并所有数据
    const allData = [...taskInfo, ...recordsData, ...statsData];

    // 创建工作簿和工作表
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(allData);

    // 添加工作表到工作簿
    XLSX.utils.book_append_sheet(wb, ws, "领用记录");

    // 生成Excel文件并下载
    XLSX.writeFile(
      wb,
      `砂子领用记录_${activeTask.drawing_number}_${activeTask.date}.xlsx`
    );
    message.success("导出成功");
  };

  // 生成领用记录表格的列
  const generateRecordColumns = (task) => {
    const baseColumns = [
      {
        title: "领用时间",
        dataIndex: "time",
        key: "time",
        width: 150,
        fixed: "left",
        render: (time) => dayjs(time).format("YYYY-MM-DD HH:mm:ss"),
      },
      {
        title: "领用人",
        dataIndex: "recipient",
        key: "recipient",
        width: 100,
        fixed: "left",
      },
    ];

    const sandColumns = task.sand_types
      .map((type) => [
        {
          title: `${type}批号`,
          dataIndex: ["details", type, "batch_number"],
          key: `${type}-batch_number`,
          width: 120,
          render: (text, record) => {
            try {
              const details = JSON.parse(record.details);
              const detail = details.find((d) => d.type === type);
              return detail ? detail.batch_number : "-";
            } catch (error) {
              console.error("解析记录详情失败:", error);
              return "-";
            }
          },
        },
        {
          title: `${type}重量 (kg)`,
          dataIndex: ["details", type, "weight"],
          key: `${type}-weight`,
          width: 120,
          render: (text, record) => {
            try {
              const details = JSON.parse(record.details);
              const detail = details.find((d) => d.type === type);
              return detail && detail.weight ? `${detail.weight} kg` : "-";
            } catch (error) {
              console.error("解析记录详情失败:", error);
              return "-";
            }
          },
        },
      ])
      .flat();

    const actionColumn = {
      title: "操作",
      key: "action",
      width: 100,
      fixed: "right",
      render: (_, record) => (
        <Popconfirm
          title="确定要删除这条记录吗?"
          onConfirm={() => handleDeleteRecord(task.id, record.id)}
          okText="是"
          cancelText="否"
        >
          <Button type="link" danger icon={<DeleteOutlined />}>
            删除
          </Button>
        </Popconfirm>
      ),
    };

    return [...baseColumns, ...sandColumns, actionColumn];
  };

  // 自定义选择器下拉渲染，支持添加新选项
  const customDropdownRender = (type, menu) => (
    <div>
      {menu}
      <Divider style={{ margin: "4px 0" }} />
      <div style={{ display: "flex", flexWrap: "nowrap", padding: 8 }}>
        <Input
          style={{ flex: "auto" }}
          id={`new-${type}`}
          placeholder={`输入新${getOptionLabel(type)}`}
        />
        <Button
          type="link"
          onClick={async () => {
            const input = document.getElementById(`new-${type}`);
            const value = input.value.trim();
            if (value && !options[type].includes(value)) {
              const success = await addOption(type, value);
              if (success) {
                input.value = "";
              }
            }
          }}
        >
          添加
        </Button>
      </div>
    </div>
  );

  // 获取选项类型的中文标签
  const getOptionLabel = (type) => {
    const labels = {
      [OPTION_TYPES.DRAWING_NUMBER]: "图号",
      [OPTION_TYPES.MACHINE]: "机台",
      [OPTION_TYPES.WEIGHER]: "称砂人员",
      [OPTION_TYPES.SAND_TYPE]: "砂子类别",
      [OPTION_TYPES.BATCH_NUMBER]: "批号",
      [OPTION_TYPES.RECIPIENT]: "领用人",
    };
    return labels[type] || "选项";
  };

  return (
    <div>
      <MyBreadcrumb items={[window.sys_name, "石英砂管理"]} />
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="任务管理" key="tasks">
          <Card>
            {/* 搜索表单 */}
            <Card size="small" style={{ marginBottom: 16 }}>
              <Form form={searchForm} layout="inline" onFinish={handleSearch}>
                <Form.Item name="drawing_number" label="图号">
                  <Input placeholder="请输入图号" />
                </Form.Item>

                <Form.Item name="machine" label="机台">
                  <Input placeholder="请输入机台" />
                </Form.Item>

                {/*<Form.Item name="dateRange" label="日期范围">*/}
                {/*    <RangePicker />*/}
                {/*</Form.Item>*/}
                {false && (
                  <Form.Item name="dateRange" label="日期范围">
                    <RangePicker />
                  </Form.Item>
                )}
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<SearchOutlined />}
                    onClick={fetchTasks}
                  >
                    搜索
                  </Button>
                </Form.Item>
                <Form.Item>
                  <Button onClick={handleResetSearch} icon={<ReloadOutlined />}>
                    重置
                  </Button>
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setIsTaskModalVisible(true)}
                  >
                    创建新任务
                  </Button>
                </Form.Item>
              </Form>
            </Card>

            <Table
              bordered
              dataSource={filteredTasks}
              rowKey="id"
              loading={loading}
              pagination={{ pageSize: 5 }}
              scroll={{ x: '"max-content"' }}
              columns={[
                {
                  title: "图号",
                  dataIndex: "drawing_number",
                  key: "drawing_number",
                  width: 120,
                },
                {
                  title: "领用机台",
                  dataIndex: "machine",
                  key: "machine",
                  width: 120,
                },
                {
                  title: "班次",
                  dataIndex: "shift",
                  key: "shift",
                  width: 80,
                  render: (shift) =>
                    SHIFT_OPTIONS.find((s) => s.value === shift)?.label,
                },
                {
                  title: "日期",
                  dataIndex: "date",
                  key: "date",
                  width: 120,
                },
                {
                  title: "称砂人员",
                  dataIndex: "weigher",
                  key: "weigher",
                  width: 100,
                },
                {
                  title: "砂子类别",
                  dataIndex: "sand_types",
                  key: "sand_types",
                  width: 600,
                  render: (types) => (
                    <span>
                      {types.map((type) => (
                        <Tag
                          key={type}
                          color="blue"
                          style={{ marginBottom: "4px" }}
                        >
                          {type}
                        </Tag>
                      ))}
                    </span>
                  ),
                },
                {
                  title: "记录数",
                  key: "record_count",
                  width: 80,
                  render: (_, task) => (task.records ? task.records.length : 0),
                },
                {
                  title: "操作",
                  key: "action",
                  width: 180,
                  fixed: "right",
                  render: (_, task) => (
                    <Space size="middle">
                      <Button
                        type="link"
                        icon={<EyeOutlined />}
                        onClick={() => {
                          setActiveTask(task);
                          setActiveTab("records");
                        }}
                      >
                        查看记录
                      </Button>
                      <Popconfirm
                        title="确定要删除这个任务吗?"
                        onConfirm={() => handleDeleteTask(task.id)}
                        okText="是"
                        cancelText="否"
                      >
                        <Button type="link" danger icon={<DeleteOutlined />}>
                          删除
                        </Button>
                      </Popconfirm>
                    </Space>
                  ),
                },
              ]}
            />
          </Card>
        </TabPane>

        <TabPane tab="领用记录" key="records" disabled={!activeTask}>
          {activeTask && (
            <Card
              title={`领用记录 - ${activeTask.drawing_number} (${activeTask.machine})`}
              extra={
                <Space>
                  <Button onClick={() => setActiveTab("tasks")}>
                    返回任务列表
                  </Button>
                  <Button icon={<ExportOutlined />} onClick={exportToExcel}>
                    导出Excel
                  </Button>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setIsRecordModalVisible(true)}
                  >
                    添加领用记录
                  </Button>
                </Space>
              }
            >
              <div style={{ marginBottom: 16 }}>
                <Row gutter={16}>
                  <Col span={4}>
                    <p>
                      <strong>图号:</strong> {activeTask.drawing_number}
                    </p>
                  </Col>
                  <Col span={4}>
                    <p>
                      <strong>领用机台:</strong> {activeTask.machine}
                    </p>
                  </Col>
                  <Col span={4}>
                    <p>
                      <strong>班次:</strong>{" "}
                      {
                        SHIFT_OPTIONS.find((s) => s.value === activeTask.shift)
                          ?.label
                      }
                    </p>
                  </Col>
                  <Col span={4}>
                    <p>
                      <strong>日期:</strong> {activeTask.date}
                    </p>
                  </Col>
                  <Col span={4}>
                    <p>
                      <strong>称砂人员:</strong> {activeTask.weigher}
                    </p>
                  </Col>
                </Row>
              </div>

              {/* 统计面板 */}
              <Card>
                <Row gutter={16}>
                  {Object.entries(calculateTotalWeights()).map(
                    ([type, weight]) => (
                      <Col span={3} key={type} style={{ marginBottom: 16 }}>
                        <Card size="small">
                          <Statistic
                            title={`${type}总重量`}
                            value={weight}
                            suffix="kg"
                          />
                        </Card>
                      </Col>
                    )
                  )}
                  <Col span={3}>
                    <Card size="small">
                      <Statistic
                        title="总领用次数"
                        value={
                          activeTask.records ? activeTask.records.length : 0
                        }
                        suffix="次"
                      />
                    </Card>
                  </Col>
                  {/*<Col span={6}>*/}
                  {/*    <Card size="small">*/}
                  {/*        <Statistic*/}
                  {/*            title="所有类别总重量"*/}
                  {/*            value={Object.values(calculateTotalWeights()).reduce((sum, weight) => sum + weight, 0)}*/}
                  {/*            suffix="kg"*/}
                  {/*        />*/}
                  {/*    </Card>*/}
                  {/*</Col>*/}
                </Row>
              </Card>

              {activeTask.records && activeTask.records.length > 0 ? (
                <Table
                  columns={generateRecordColumns(activeTask)}
                  dataSource={activeTask.records}
                  rowKey="id"
                  pagination={{ pageSize: 10 }}
                  scroll={{ x: 1800 }}
                />
              ) : (
                <div style={{ textAlign: "center", padding: "40px" }}>
                  <p>暂无领用记录</p>
                </div>
              )}
            </Card>
          )}
        </TabPane>
      </Tabs>

      {/* 创建任务模态框 */}
      <Modal
        title="创建新任务(创建成功后请刷新页面！)"
        open={isTaskModalVisible}
        onCancel={() => {
          setIsTaskModalVisible(false);
          taskForm.resetFields();
        }}
        footer={null}
        width={700}
      >
        <Form form={taskForm} layout="vertical" onFinish={handleTaskSubmit}>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                label="图号"
                name="drawing_number"
                rules={[{ required: true, message: "请输入图号" }]}
              >
                <Select
                  placeholder="请选择图号"
                  dropdownRender={(menu) =>
                    customDropdownRender(OPTION_TYPES.DRAWING_NUMBER, menu)
                  }
                  showSearch
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {options[OPTION_TYPES.DRAWING_NUMBER].map((value) => (
                    <Option key={value} value={value}>
                      {value}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="领用机台"
                name="machine"
                rules={[{ required: true, message: "请输入领用机台" }]}
              >
                <Select
                  placeholder="请选择领用机台"
                  dropdownRender={(menu) =>
                    customDropdownRender(OPTION_TYPES.MACHINE, menu)
                  }
                  showSearch
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {options[OPTION_TYPES.MACHINE].map((value) => (
                    <Option key={value} value={value}>
                      {value}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="班次"
                name="shift"
                rules={[{ required: true, message: "请选择班次" }]}
              >
                <Select placeholder="请选择班次">
                  {SHIFT_OPTIONS.map((option) => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="日期"
                name="date"
                rules={[{ required: true, message: "请选择日期" }]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="称砂人员"
                name="weigher"
                rules={[{ required: true, message: "请输入称砂人员" }]}
              >
                <Select
                  placeholder="请选择称砂人员"
                  dropdownRender={(menu) =>
                    customDropdownRender(OPTION_TYPES.WEIGHER, menu)
                  }
                  showSearch
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {options[OPTION_TYPES.WEIGHER].map((value) => (
                    <Option key={value} value={value}>
                      {value}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="砂子类别"
                name="sand_types"
                rules={[
                  { required: true, message: "请选择砂子类别", type: "array" },
                ]}
              >
                <Select
                  mode="multiple"
                  placeholder="请选择砂子类别"
                  dropdownRender={(menu) =>
                    customDropdownRender(OPTION_TYPES.SAND_TYPE, menu)
                  }
                  showSearch
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {options[OPTION_TYPES.SAND_TYPE].map((value) => (
                    <Option key={value} value={value}>
                      {value}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  创建任务
                </Button>
                <Button
                  style={{ marginLeft: 8 }}
                  onClick={() => {
                    setIsTaskModalVisible(false);
                    taskForm.resetFields();
                  }}
                >
                  取消
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* 添加领用记录模态框 */}
      <Modal
        title={`添加领用记录 - ${activeTask?.drawing_number} (${activeTask?.machine})`}
        open={isRecordModalVisible}
        onCancel={() => {
          setIsRecordModalVisible(false);
          recordForm.resetFields();
        }}
        footer={null}
        width={800}
        style={{ top: 20 }}
      >
        <Form form={recordForm} layout="vertical" onFinish={handleRecordSubmit}>
          <Form.Item
            label="领用人"
            name="recipient"
            rules={[{ required: true, message: "请输入领用人" }]}
            style={{ marginBottom: 24 }}
          >
            <Select
              placeholder="请选择领用人"
              dropdownRender={(menu) =>
                customDropdownRender(OPTION_TYPES.RECIPIENT, menu)
              }
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {options[OPTION_TYPES.RECIPIENT].map((value) => (
                <Option key={value} value={value}>
                  {value}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {activeTask?.sand_types.map((type) => (
            <div
              key={type}
              style={{
                marginBottom: 16,
                padding: "12px",
                border: "1px dashed #ddd",
                borderRadius: "4px",
              }}
            >
              <h4>{type}</h4>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="批号" name={`${type}-batch_number`}>
                    <Select
                      placeholder={`请选择${type}批号`}
                      dropdownRender={(menu) =>
                        customDropdownRender(OPTION_TYPES.BATCH_NUMBER, menu)
                      }
                      showSearch
                      filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {options[OPTION_TYPES.BATCH_NUMBER].map((value) => (
                        <Option key={value} value={value}>
                          {value}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="重量 (kg)"
                    name={`${type}-weight`}
                    rules={[
                      { pattern: /^\d+(\.\d+)?$/, message: "请输入有效的数字" },
                    ]}
                  >
                    <InputNumber
                      placeholder={`请输入${type}重量`}
                      addonAfter="kg"
                      style={{ width: "100%" }}
                      min={0}
                      precision={2}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </div>
          ))}

          <Form.Item>
            <Button type="primary" htmlType="submit">
              提交领用记录
            </Button>
            <Button
              style={{ marginLeft: 8 }}
              onClick={() => {
                setIsRecordModalVisible(false);
                recordForm.resetFields();
              }}
            >
              取消
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SandManagementSystem;

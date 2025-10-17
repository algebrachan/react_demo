// App.js
import React, { useState, useEffect } from "react";
import {
  Table,
  Form,
  Input,
  Button,
  Select,
  Card,
  Row,
  Col,
  Divider,
  message,
  Popconfirm,
  Space,
  DatePicker,
  Tag,
  Collapse,
  Checkbox,
  Statistic,
  Modal,
  Tabs,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  SearchOutlined,
  FilterOutlined,
  ExportOutlined,
  EyeOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { MyBreadcrumb } from "../../../components/CommonCard";
import { base_url } from "../../../apis/instance";
const { Option } = Select;
const { RangePicker } = DatePicker;
const { Panel } = Collapse;
const { TabPane } = Tabs;

const API_BASE = `${base_url}/api/sms_router`;

const SandManagement = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [records, setRecords] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [options, setOptions] = useState({
    weigher: [],
    receiver: [],
    machine_number: [],
    drawing_number: [],
    zs_batch: [],
    outer_batch: [],
    mid_outer_batch: [],
    mid_inner_batch: [],
    inner1_batch: [],
    inner2_batch: [],
    inner3_batch: [],
  });
  const [sandTypes, setSandTypes] = useState({});
  const [filterVisible, setFilterVisible] = useState(false);
  const [detailCollapsed, setDetailCollapsed] = useState(false);
  const [newOptionValues, setNewOptionValues] = useState({});
  // 在组件状态中添加
  const [selectedTasksForStats, setSelectedTasksForStats] = useState([]);

  // 新增状态
  const [selectedTaskIds, setSelectedTaskIds] = useState([]);
  const [queryResults, setQueryResults] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [statisticsModalVisible, setStatisticsModalVisible] = useState(false);
  const [queryLoading, setQueryLoading] = useState(false);

  const [taskForm] = Form.useForm();
  const [recordForm] = Form.useForm();
  const [filterForm] = Form.useForm();
  const [queryForm] = Form.useForm();

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      await Promise.all([
        loadTasks(),
        loadShifts(),
        loadSandTypes(),
        loadOptions("weigher"),
        loadOptions("receiver"),
        loadOptions("machine_number"),
        loadOptions("drawing_number"),
      ]);
    } catch (error) {
      message.error("数据加载失败");
    }
  };

  const loadTasks = async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.shift) params.append("shift", filters.shift);
    if (filters.date) params.append("date", filters.date);

    const response = await axios.get(`${API_BASE}/api/tasks?${params}`);
    setTasks(response.data);
  };

  const loadShifts = async () => {
    const response = await axios.get(`${API_BASE}/api/shifts`);
    setShifts(response.data);
  };

  const loadSandTypes = async () => {
    const response = await axios.get(`${API_BASE}/api/sand-types`);
    setSandTypes(response.data);
  };

  const loadOptions = async (category) => {
    try {
      const response = await axios.get(`${API_BASE}/api/options/${category}`);
      setOptions((prev) => ({
        ...prev,
        [category]: response.data,
      }));
    } catch (error) {
      console.error(`加载选项 ${category} 失败:`, error);
    }
  };

  const loadBatches = async (sandType) => {
    await loadOptions(`${sandType}_batch`);
  };

  const loadRecords = async (taskId) => {
    const response = await axios.get(`${API_BASE}/api/records/${taskId}`);
    setRecords(response.data);
  };
  // 查询任务
  const handleQueryTasks = async (values) => {
    setQueryLoading(true);
    try {
      const queryParams = {
        shift: values.shift,
        start_date: values.dateRange
          ? values.dateRange[0].format("YYYY-MM-DD")
          : null,
        end_date: values.dateRange
          ? values.dateRange[1].format("YYYY-MM-DD")
          : null,
        task_numbers: values.task_numbers
          ? values.task_numbers.split(",").map((t) => t.trim())
          : null,
      };

      const response = await axios.post(
        `${API_BASE}/api/tasks/query`,
        queryParams
      );
      setQueryResults(response.data);
      setSelectedTaskIds([]);
      message.success(`查询到 ${response.data.length} 条任务记录`);
    } catch (error) {
      message.error("查询失败");
    } finally {
      setQueryLoading(false);
    }
  };

  // 修改查看明细的函数，传递更多参数
  const handleViewDetails = async (taskIds) => {
    if (!taskIds || taskIds.length === 0) {
      message.warning("请先选择任务");
      return;
    }

    try {
      const [recordsResponse, statsResponse] = await Promise.all([
        axios.post(`${API_BASE}/api/records/batch`, taskIds),
        axios.post(`${API_BASE}/api/records/statistics`, taskIds),
      ]);

      const selectedTasks = queryResults.filter((task) =>
        taskIds.includes(task.id)
      );

      setRecords(recordsResponse.data);
      setStatistics(statsResponse.data);
      setSelectedTasksForStats(selectedTasks); // 新增状态来存储选中的任务
      setDetailModalVisible(true);
    } catch (error) {
      message.error("获取明细失败");
    }
  };

  // 查看统计
  const handleViewStatistics = async (taskIds) => {
    if (!taskIds || taskIds.length === 0) {
      message.warning("请先选择任务");
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE}/api/records/statistics`,
        taskIds
      );
      setStatistics(response.data);
      setStatisticsModalVisible(true);
    } catch (error) {
      message.error("获取统计失败");
    }
  };

  // 导出Excel
  const handleExportExcel = async (taskIds) => {
    if (!taskIds || taskIds.length === 0) {
      message.warning("请先选择任务");
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE}/api/export/excel`,
        { task_ids: taskIds },
        {
          responseType: "blob",
          timeout: 60000, // 增加超时时间
        }
      );

      // 创建下载链接
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      // 从响应头获取文件名
      const contentDisposition = response.headers["content-disposition"];
      let filename = "石英砂领用记录.xlsx";

      if (contentDisposition) {
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(contentDisposition);
        if (matches != null && matches[1]) {
          filename = matches[1].replace(/['"]/g, "");
          // 解码URL编码的文件名
          filename = decodeURIComponent(filename);
        }
      }

      // 创建下载链接
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();

      // 清理
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);

      message.success("导出成功");
    } catch (error) {
      console.error("导出错误:", error);
      if (error.response) {
        if (error.response.status === 500) {
          message.error("导出失败: 服务器内部错误");
        } else {
          message.error(
            `导出失败: ${error.response.status} ${error.response.statusText}`
          );
        }
      } else if (error.request) {
        message.error("导出失败: 网络错误，请检查网络连接");
      } else {
        message.error(`导出失败: ${error.message}`);
      }
    }
  };

  // 选择任务复选框
  const handleTaskSelect = (taskId, checked) => {
    if (checked) {
      setSelectedTaskIds((prev) => [...prev, taskId]);
    } else {
      setSelectedTaskIds((prev) => prev.filter((id) => id !== taskId));
    }
  };

  // 全选/全不选
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedTaskIds(queryResults.map((task) => task.id));
    } else {
      setSelectedTaskIds([]);
    }
  };

  // 任务查询表格列定义
  const taskQueryColumns = [
    {
      title: (
        <Checkbox
          indeterminate={
            selectedTaskIds.length > 0 &&
            selectedTaskIds.length < queryResults.length
          }
          checked={
            queryResults.length > 0 &&
            selectedTaskIds.length === queryResults.length
          }
          onChange={(e) => handleSelectAll(e.target.checked)}
        />
      ),
      key: "selection",
      width: 60,
      render: (_, record) => (
        <Checkbox
          checked={selectedTaskIds.includes(record.id)}
          onChange={(e) => handleTaskSelect(record.id, e.target.checked)}
        />
      ),
    },
    {
      title: "任务编号",
      dataIndex: "task_number",
      key: "task_number",
      width: 120,
    },
    {
      title: "班次",
      dataIndex: "shift",
      key: "shift",
      width: 80,
    },
    {
      title: "称砂人员",
      dataIndex: "weigher",
      key: "weigher",
      width: 100,
    },
    {
      title: "任务日期",
      dataIndex: "task_date",
      key: "task_date",
      width: 100,
    },
    {
      title: "创建时间",
      dataIndex: "created_at",
      key: "created_at",
      width: 150,
    },
    {
      title: "操作",
      key: "action",
      width: 120,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails([record.id])}
          >
            明细
          </Button>
          <Button
            type="link"
            size="small"
            icon={<BarChartOutlined />}
            onClick={() => handleViewStatistics([record.id])}
          >
            统计
          </Button>
        </Space>
      ),
    },
  ];

  // 创建任务
  const handleCreateTask = async (values) => {
    try {
      await axios.post(`${API_BASE}/api/tasks`, values);
      message.success("任务创建成功");
      taskForm.resetFields();
      loadTasks();
    } catch (error) {
      message.error("任务创建失败");
    }
  };

  // 删除任务
  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`${API_BASE}/api/tasks/${taskId}`);
      message.success("任务删除成功");
      if (selectedTask && selectedTask.id === taskId) {
        setSelectedTask(null);
        setRecords([]);
      }
      loadTasks();
    } catch (error) {
      message.error("任务删除失败");
    }
  };

  // 删除记录
  const handleDeleteRecord = async (recordId) => {
    try {
      await axios.delete(`${API_BASE}/api/records/${recordId}`);
      message.success("记录删除成功");
      if (selectedTask) {
        loadRecords(selectedTask.id);
      }
    } catch (error) {
      message.error("记录删除失败");
    }
  };

  // 添加记录
  const handleAddRecord = async (values) => {
    if (!selectedTask) {
      message.error("请先选择任务");
      return;
    }

    try {
      const recordData = {
        task_id: selectedTask.id,
        machine_number: values.machine_number,
        drawing_number: values.drawing_number,
        receiver: values.receiver,
      };

      const sandPrefixes = [
        "zs",
        "outer",
        "mid_outer",
        "mid_inner",
        "inner1",
        "inner2",
        "inner3",
      ];
      sandPrefixes.forEach((prefix) => {
        recordData[`${prefix}_type`] = values[`${prefix}_type`] || null;
        recordData[`${prefix}_batch`] = values[`${prefix}_batch`] || null;
        recordData[`${prefix}_weight`] = values[`${prefix}_weight`]
          ? parseFloat(values[`${prefix}_weight`])
          : null;
      });

      await axios.post(`${API_BASE}/api/records`, recordData);
      message.success("记录添加成功");
      recordForm.resetFields();
      loadRecords(selectedTask.id);
    } catch (error) {
      message.error(
        "记录添加失败: " + (error.response?.data?.detail || error.message)
      );
    }
  };

  // 筛选任务
  const handleFilterTasks = async (values) => {
    const filters = {};
    if (values.shift) filters.shift = values.shift;
    if (values.date) filters.date = values.date.format("YYYY-MM-DD");
    await loadTasks(filters);
  };

  // 重置筛选
  const handleResetFilter = () => {
    filterForm.resetFields();
    loadTasks();
  };

  // 添加选项
  const handleAddOption = async (category, sandType = null) => {
    const value = newOptionValues[category] || "";

    if (!value.trim()) {
      message.warning("请输入选项值");
      return;
    }

    try {
      const payload = {
        category: category,
        value: value.trim(),
      };

      if (sandType) {
        payload.sand_type = sandType;
      }

      await axios.post(`${API_BASE}/api/options`, payload);
      message.success("选项添加成功");

      setNewOptionValues((prev) => ({ ...prev, [category]: "" }));
      await loadOptions(category);

      return true;
    } catch (error) {
      message.error("选项添加失败");
      return false;
    }
  };

  // 删除选项
  const handleDeleteOption = async (category, optionId) => {
    try {
      await axios.delete(`${API_BASE}/api/options/${category}/${optionId}`);
      message.success("选项删除成功");
      await loadOptions(category);
      return true;
    } catch (error) {
      message.error("选项删除失败");
      return false;
    }
  };

  // 选择任务
  const handleSelectTask = (task) => {
    setSelectedTask(task);
    loadRecords(task.id);
    recordForm.resetFields();

    // 预加载所有砂子类型的批号
    Object.keys(sandTypes).forEach((sandType) => {
      loadBatches(sandType.toLowerCase());
    });
  };

  // 自定义下拉框渲染函数
  const customDropdownRender = (category, menu) => {
    const sandType = category.replace("_batch", "");

    return (
      <div>
        {menu}
        <Divider style={{ margin: "4px 0" }} />
        <div style={{ display: "flex", padding: 8 }}>
          <Input
            placeholder={`输入新${getCategoryLabel(category)}`}
            value={newOptionValues[category] || ""}
            onChange={(e) =>
              setNewOptionValues((prev) => ({
                ...prev,
                [category]: e.target.value,
              }))
            }
            onPressEnter={() =>
              handleAddOption(
                category,
                category.endsWith("_batch") ? sandType : null
              )
            }
            style={{ flex: "auto" }}
            size="small"
          />
          <Button
            type="link"
            onClick={() =>
              handleAddOption(
                category,
                category.endsWith("_batch") ? sandType : null
              )
            }
            icon={<PlusOutlined />}
            size="small"
            style={{ flex: "none" }}
          >
            添加
          </Button>
        </div>
      </div>
    );
  };

  // 获取类别标签
  const getCategoryLabel = (category) => {
    const labels = {
      weigher: "称砂人员",
      receiver: "领用人",
      machine_number: "机台号",
      drawing_number: "图号",
      zs_batch: "ZS砂批号",
      outer_batch: "外层砂批号",
      mid_outer_batch: "中外层砂批号",
      mid_inner_batch: "中内层砂批号",
      inner1_batch: "内层1批号",
      inner2_batch: "内层2批号",
      inner3_batch: "内层3批号",
    };
    return labels[category] || category;
  };

  // 砂子输入组件
  const SandInputGroup = ({ prefix, label }) => {
    return (
      <Card size="small" title={label} style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item name={`${prefix}_type`} label="类型">
              <Select
                placeholder="选择类型"
                allowClear
                onChange={(value) => value && loadBatches(prefix)}
              >
                {sandTypes[prefix.toUpperCase()]?.map((type) => (
                  <Option key={type} value={type}>
                    {type}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name={`${prefix}_batch`} label="批号">
              <Select
                placeholder={`选择${label}批号`}
                dropdownRender={(menu) =>
                  customDropdownRender(`${prefix}_batch`, menu)
                }
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
                allowClear
              >
                {options[`${prefix}_batch`]?.map((opt) => (
                  <Option key={opt.id} value={opt.value}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span>{opt.value}</span>
                      <Popconfirm
                        title="确定删除这个批号吗？"
                        onConfirm={(e) => {
                          e.stopPropagation();
                          handleDeleteOption(`${prefix}_batch`, opt.id);
                        }}
                      >
                        <DeleteOutlined
                          style={{ color: "#ff4d4f", fontSize: "12px" }}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </Popconfirm>
                    </div>
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name={`${prefix}_weight`} label="重量(kg)">
              <Input type="number" placeholder="重量" step="0.01" />
            </Form.Item>
          </Col>
        </Row>
      </Card>
    );
  };

  // 记录表格列定义
  const recordColumns = [
    {
      title: "机台号",
      dataIndex: "machine_number",
      key: "machine_number",
      width: 80,
      fixed: "left",
    },
    {
      title: "图号",
      dataIndex: "drawing_number",
      key: "drawing_number",
      width: 100,
    },
    {
      title: "领用人",
      dataIndex: "receiver",
      key: "receiver",
      width: 80,
    },
    {
      title: "ZS类型",
      dataIndex: "zs_type",
      key: "zs_type",
      width: 80,
      render: (text) => text || "-",
    },
    {
      title: "ZS批号",
      dataIndex: "zs_batch",
      key: "zs_batch",
      width: 100,
      render: (text) => text || "-",
    },
    {
      title: "ZS重量",
      dataIndex: "zs_weight",
      key: "zs_weight",
      width: 80,
      render: (weight) => (weight ? `${weight}kg` : "-"),
    },
    {
      title: "外层类型",
      dataIndex: "outer_type",
      key: "outer_type",
      width: 80,
      render: (text) => text || "-",
    },
    {
      title: "外层批号",
      dataIndex: "outer_batch",
      key: "outer_batch",
      width: 100,
      render: (text) => text || "-",
    },
    {
      title: "外层重量",
      dataIndex: "outer_weight",
      key: "outer_weight",
      width: 80,
      render: (weight) => (weight ? `${weight}kg` : "-"),
    },
    {
      title: "中外层类型",
      dataIndex: "mid_outer_type",
      key: "mid_outer_type",
      width: 80,
      render: (text) => text || "-",
    },
    {
      title: "中外层批号",
      dataIndex: "mid_outer_batch",
      key: "mid_outer_batch",
      width: 100,
      render: (text) => text || "-",
    },
    {
      title: "中外层重量",
      dataIndex: "mid_outer_weight",
      key: "mid_outer_weight",
      width: 80,
      render: (weight) => (weight ? `${weight}kg` : "-"),
    },
    {
      title: "中内层类型",
      dataIndex: "mid_inner_type",
      key: "mid_inner_type",
      width: 80,
      render: (text) => text || "-",
    },
    {
      title: "中内层批号",
      dataIndex: "mid_inner_batch",
      key: "mid_inner_batch",
      width: 100,
      render: (text) => text || "-",
    },
    {
      title: "中内层重量",
      dataIndex: "mid_inner_weight",
      key: "mid_inner_weight",
      width: 80,
      render: (weight) => (weight ? `${weight}kg` : "-"),
    },
    {
      title: "内层1类型",
      dataIndex: "inner1_type",
      key: "inner1_type",
      width: 80,
      render: (text) => text || "-",
    },
    {
      title: "内层1批号",
      dataIndex: "inner1_batch",
      key: "inner1_batch",
      width: 100,
      render: (text) => text || "-",
    },
    {
      title: "内层1重量",
      dataIndex: "inner1_weight",
      key: "inner1_weight",
      width: 80,
      render: (weight) => (weight ? `${weight}kg` : "-"),
    },
    {
      title: "内层2类型",
      dataIndex: "inner2_type",
      key: "inner2_type",
      width: 80,
      render: (text) => text || "-",
    },
    {
      title: "内层2批号",
      dataIndex: "inner2_batch",
      key: "inner2_batch",
      width: 100,
      render: (text) => text || "-",
    },
    {
      title: "内层2重量",
      dataIndex: "inner2_weight",
      key: "inner2_weight",
      width: 80,
      render: (weight) => (weight ? `${weight}kg` : "-"),
    },
    {
      title: "内层3类型",
      dataIndex: "inner3_type",
      key: "inner3_type",
      width: 80,
      render: (text) => text || "-",
    },
    {
      title: "内层3批号",
      dataIndex: "inner3_batch",
      key: "inner3_batch",
      width: 100,
      render: (text) => text || "-",
    },
    {
      title: "内层3重量",
      dataIndex: "inner3_weight",
      key: "inner3_weight",
      width: 80,
      render: (weight) => (weight ? `${weight}kg` : "-"),
    },
    {
      title: "领用时间",
      dataIndex: "receive_time",
      key: "receive_time",
      width: 120,
    },
    {
      title: "操作",
      key: "action",
      width: 60,
      fixed: "right",
      render: (_, record) => (
        <Popconfirm
          title="确定删除这条记录吗？"
          onConfirm={() => handleDeleteRecord(record.id)}
        >
          <Button type="link" danger size="small">
            删除
          </Button>
        </Popconfirm>
      ),
    },
  ];

  // 砂子配置分组
  const sandConfigs = [
    [
      { prefix: "zs", label: "ZS砂" },
      { prefix: "outer", label: "外层砂" },
      { prefix: "mid_outer", label: "中外层砂" },
      { prefix: "mid_inner", label: "中内层砂" },
    ],
    [
      { prefix: "inner1", label: "内层1" },
      { prefix: "inner2", label: "内层2" },
      { prefix: "inner3", label: "内层3" },
    ],
  ];

  const StatisticsPanel = ({ statistics, records, selectedTasks }) => {
    // 砂子类型标签映射
    const SAND_LABELS = {
      ZS: "ZS砂",
      OUTER: "外层砂",
      MID_OUTER: "中外层砂",
      MID_INNER: "中内层砂",
      INNER1: "内层1",
      INNER2: "内层2",
      INNER3: "内层3",
    };

    // 收集所有出现过的砂子具体种类
    const sandVarieties = {};

    // 从记录中提取所有砂子种类和重量
    records.forEach((record) => {
      // ZS砂
      if (record.zs_type && record.zs_weight) {
        const variety = record.zs_type;
        if (!sandVarieties[variety]) {
          sandVarieties[variety] = {
            category: "ZS",
            totalWeight: 0,
            categoryLabel: SAND_LABELS["ZS"] || "ZS砂",
            recordCount: 0,
          };
        }
        sandVarieties[variety].totalWeight += parseFloat(record.zs_weight) || 0;
        sandVarieties[variety].recordCount += 1;
      }

      // 外层砂
      if (record.outer_type && record.outer_weight) {
        const variety = record.outer_type;
        if (!sandVarieties[variety]) {
          sandVarieties[variety] = {
            category: "OUTER",
            totalWeight: 0,
            categoryLabel: SAND_LABELS["OUTER"] || "外层砂",
            recordCount: 0,
          };
        }
        sandVarieties[variety].totalWeight +=
          parseFloat(record.outer_weight) || 0;
        sandVarieties[variety].recordCount += 1;
      }

      // 中外层砂
      if (record.mid_outer_type && record.mid_outer_weight) {
        const variety = record.mid_outer_type;
        if (!sandVarieties[variety]) {
          sandVarieties[variety] = {
            category: "MID_OUTER",
            totalWeight: 0,
            categoryLabel: SAND_LABELS["MID_OUTER"] || "中外层砂",
            recordCount: 0,
          };
        }
        sandVarieties[variety].totalWeight +=
          parseFloat(record.mid_outer_weight) || 0;
        sandVarieties[variety].recordCount += 1;
      }

      // 中内层砂
      if (record.mid_inner_type && record.mid_inner_weight) {
        const variety = record.mid_inner_type;
        if (!sandVarieties[variety]) {
          sandVarieties[variety] = {
            category: "MID_INNER",
            totalWeight: 0,
            categoryLabel: SAND_LABELS["MID_INNER"] || "中内层砂",
            recordCount: 0,
          };
        }
        sandVarieties[variety].totalWeight +=
          parseFloat(record.mid_inner_weight) || 0;
        sandVarieties[variety].recordCount += 1;
      }

      // 内层1
      if (record.inner1_type && record.inner1_weight) {
        const variety = record.inner1_type;
        if (!sandVarieties[variety]) {
          sandVarieties[variety] = {
            category: "INNER1",
            totalWeight: 0,
            categoryLabel: SAND_LABELS["INNER1"] || "内层1",
            recordCount: 0,
          };
        }
        sandVarieties[variety].totalWeight +=
          parseFloat(record.inner1_weight) || 0;
        sandVarieties[variety].recordCount += 1;
      }

      // 内层2
      if (record.inner2_type && record.inner2_weight) {
        const variety = record.inner2_type;
        if (!sandVarieties[variety]) {
          sandVarieties[variety] = {
            category: "INNER2",
            totalWeight: 0,
            categoryLabel: SAND_LABELS["INNER2"] || "内层2",
            recordCount: 0,
          };
        }
        sandVarieties[variety].totalWeight +=
          parseFloat(record.inner2_weight) || 0;
        sandVarieties[variety].recordCount += 1;
      }

      // 内层3
      if (record.inner3_type && record.inner3_weight) {
        const variety = record.inner3_type;
        if (!sandVarieties[variety]) {
          sandVarieties[variety] = {
            category: "INNER3",
            totalWeight: 0,
            categoryLabel: SAND_LABELS["INNER3"] || "内层3",
            recordCount: 0,
          };
        }
        sandVarieties[variety].totalWeight +=
          parseFloat(record.inner3_weight) || 0;
        sandVarieties[variety].recordCount += 1;
      }
    });

    // 按照砂子大类分组
    const categorizedVarieties = {};
    Object.values(sandVarieties).forEach((variety) => {
      if (!categorizedVarieties[variety.category]) {
        categorizedVarieties[variety.category] = [];
      }
      categorizedVarieties[variety.category].push({
        ...variety,
        varietyName: Object.keys(sandVarieties).find(
          (key) => sandVarieties[key] === variety
        ),
      });
    });

    // 如果没有数据，显示提示
    if (Object.keys(sandVarieties).length === 0) {
      return (
        <Card title="统计看板" style={{ marginBottom: 20 }}>
          <div style={{ textAlign: "center", padding: "40px", color: "#999" }}>
            暂无统计数据
          </div>
        </Card>
      );
    }
    return (
      <Card title="统计看板" style={{ marginBottom: 20 }}>
        {/* 砂子种类详细统计 */}
        <Row gutter={[16, 16]}>
          {Object.entries(categorizedVarieties).map(([category, varieties]) => (
            <Col span={6} key={category}>
              <Card
                size="small"
                title={
                  <span style={{ fontWeight: "bold", color: "#1890ff" }}>
                    {SAND_LABELS[category] || category} - 种类统计
                  </span>
                }
                style={{ marginBottom: 8 }}
              >
                <Row gutter={[8, 8]}>
                  {varieties.map((variety, index) => (
                    <Col span={24} key={index}>
                      <Card
                        size="small"
                        bordered={true}
                        bodyStyle={{
                          padding: "12px",
                          textAlign: "center",
                          backgroundColor: index % 2 === 0 ? "#fafafa" : "#fff",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "12px",
                            color: "#666",
                            marginBottom: "4px",
                          }}
                        >
                          {variety.categoryLabel}
                        </div>
                        <div
                          style={{
                            fontSize: "14px",
                            fontWeight: "bold",
                            color: "#333",
                            marginBottom: "4px",
                          }}
                        >
                          {variety.varietyName}
                        </div>
                        <div
                          style={{
                            fontSize: "16px",
                            fontWeight: "bold",
                            color: "#cf1322",
                            marginBottom: "4px",
                          }}
                        >
                          {variety.totalWeight.toFixed(1)} kg
                        </div>
                        <div
                          style={{
                            fontSize: "12px",
                            color: "#999",
                          }}
                        >
                          {variety.recordCount} 条记录
                        </div>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Card>
            </Col>
          ))}
        </Row>

        {/* 总体统计信息 */}
        <Divider />
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <Card size="small">
              <Statistic
                title="总记录数"
                value={records.length}
                valueStyle={{ color: "#3f8600" }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Statistic
                title="涉及任务数"
                value={selectedTasks.length}
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Statistic
                title="砂子种类数"
                value={Object.keys(sandVarieties).length}
                valueStyle={{ color: "#722ed1" }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Statistic
                title="总重量"
                value={Object.values(sandVarieties)
                  .reduce((sum, variety) => sum + variety.totalWeight, 0)
                  .toFixed(1)}
                suffix="kg"
                valueStyle={{ color: "#cf1322" }}
              />
            </Card>
          </Col>
        </Row>
      </Card>
    );
  };

  return (
    <div>
      <MyBreadcrumb items={[window.sys_name, "石英砂管理"]} />
      <Tabs defaultActiveKey="query">
        <TabPane tab="统计" key="query">
          <Card title="任务查询" style={{ marginBottom: 16 }}>
            <Form form={queryForm} onFinish={handleQueryTasks} layout="inline">
              <Form.Item name="shift" label="班次">
                <Select placeholder="选择班次" style={{ width: 120 }}>
                  <Option value="">全部</Option>
                  {shifts.map((shift) => (
                    <Option key={shift.id} value={shift.value}>
                      {shift.value}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item name="dateRange" label="任务日期">
                <RangePicker />
              </Form.Item>

              <Form.Item name="task_numbers" label="任务编号">
                <Input
                  placeholder="多个编号用逗号分隔"
                  style={{ width: 200 }}
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SearchOutlined />}
                  loading={queryLoading}
                >
                  查询
                </Button>
              </Form.Item>
            </Form>
          </Card>

          {queryResults.length > 0 && (
            <div>
              <Card
                title={`查询结果 (${queryResults.length} 条)`}
                extra={
                  <Space>
                    <span>已选择 {selectedTaskIds.length} 条</span>
                    <Button
                      type="primary"
                      icon={<EyeOutlined />}
                      onClick={() => handleViewDetails(selectedTaskIds)}
                      disabled={selectedTaskIds.length === 0}
                    >
                      查看明细
                    </Button>
                    <Button
                      icon={<BarChartOutlined />}
                      onClick={() => handleViewStatistics(selectedTaskIds)}
                      disabled={selectedTaskIds.length === 0}
                    >
                      查看统计
                    </Button>
                    <Button
                      type="primary"
                      icon={<ExportOutlined />}
                      onClick={() => handleExportExcel(selectedTaskIds)}
                      disabled={selectedTaskIds.length === 0}
                    >
                      导出Excel
                    </Button>
                  </Space>
                }
              >
                <Table
                  columns={taskQueryColumns}
                  dataSource={queryResults}
                  rowKey="id"
                  pagination={{ pageSize: 10 }}
                  scroll={{ x: 800 }}
                  size="small"
                />
              </Card>
            </div>
          )}
        </TabPane>

        <TabPane tab="任务管理" key="management">
          <Row gutter={16}>
            {/* 左侧：任务管理 */}
            <Col span={6}>
              <Card
                title="石英砂领用任务"
                style={{ marginBottom: 16 }}
                size="small"
              >
                <Form
                  form={taskForm}
                  onFinish={handleCreateTask}
                  layout="vertical"
                >
                  <Form.Item
                    name="shift"
                    label="班次"
                    rules={[{ required: true }]}
                  >
                    <Select placeholder="选择班次" size="small">
                      {shifts.map((shift) => (
                        <Option key={shift.id} value={shift.value}>
                          {shift.value}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name="weigher"
                    label="称砂人员"
                    rules={[{ required: true }]}
                  >
                    <Select
                      placeholder="请选择称砂人员"
                      dropdownRender={(menu) =>
                        customDropdownRender("weigher", menu)
                      }
                      showSearch
                      filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                      size="small"
                    >
                      {options.weigher?.map((opt) => (
                        <Option key={opt.id} value={opt.value}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <span>{opt.value}</span>
                            <Popconfirm
                              title="确定删除这个选项吗？"
                              onConfirm={(e) => {
                                e.stopPropagation();
                                handleDeleteOption("weigher", opt.id);
                              }}
                            >
                              <DeleteOutlined
                                style={{ color: "#ff4d4f", fontSize: "12px" }}
                                onClick={(e) => e.stopPropagation()}
                              />
                            </Popconfirm>
                          </div>
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item>
                    <Button type="primary" htmlType="submit" block size="small">
                      创建新任务
                    </Button>
                  </Form.Item>
                </Form>
              </Card>

              <Card
                title={
                  <Space>
                    <span>任务列表</span>
                    <Button
                      type="text"
                      icon={<FilterOutlined />}
                      size="small"
                      onClick={() => setFilterVisible(!filterVisible)}
                    >
                      筛选
                    </Button>
                  </Space>
                }
                size="small"
              >
                {filterVisible && (
                  <Form
                    form={filterForm}
                    onFinish={handleFilterTasks}
                    layout="vertical"
                    style={{ marginBottom: 16 }}
                  >
                    <Form.Item name="shift" label="班次">
                      <Select placeholder="选择班次" size="small">
                        <Option value="">全部</Option>
                        {shifts.map((shift) => (
                          <Option key={shift.id} value={shift.value}>
                            {shift.value}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item name="date" label="日期">
                      <DatePicker style={{ width: "100%" }} size="small" />
                    </Form.Item>
                    <Space>
                      <Button
                        type="primary"
                        htmlType="submit"
                        size="small"
                        icon={<SearchOutlined />}
                      >
                        筛选
                      </Button>
                      <Button onClick={handleResetFilter} size="small">
                        重置
                      </Button>
                    </Space>
                  </Form>
                )}

                <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                  {tasks.map((task) => (
                    <Card
                      key={task.id}
                      size="small"
                      style={{
                        marginBottom: 8,
                        cursor: "pointer",
                        border:
                          selectedTask?.id === task.id
                            ? "2px solid #1890ff"
                            : "1px solid #d9d9d9",
                      }}
                      onClick={() => handleSelectTask(task)}
                      actions={[
                        <Popconfirm
                          title="确定删除这个任务吗？"
                          onConfirm={(e) => {
                            e.stopPropagation();
                            handleDeleteTask(task.id);
                          }}
                        >
                          <DeleteOutlined
                            key="delete"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </Popconfirm>,
                      ]}
                    >
                      <div>
                        <Tag color="blue">{task.task_number}</Tag>
                        <div style={{ fontSize: "12px", marginTop: 4 }}>
                          <div>班次: {task.shift}</div>
                          <div>人员: {task.weigher}</div>
                          <div>日期: {task.task_date}</div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>
            </Col>

            {/* 右侧：记录管理 */}
            <Col span={18}>
              {selectedTask ? (
                <>
                  <Card
                    title={
                      <Space>
                        <span>领用记录 - {selectedTask.task_number}</span>
                        <Tag color="blue">{selectedTask.shift}</Tag>
                        <Tag>称砂人员: {selectedTask.weigher}</Tag>
                      </Space>
                    }
                    style={{ marginBottom: 16 }}
                    extra={
                      <Button
                        type="link"
                        onClick={() => setDetailCollapsed(!detailCollapsed)}
                      >
                        {detailCollapsed ? "展开" : "收起"}录入表单
                      </Button>
                    }
                  >
                    <Collapse activeKey={detailCollapsed ? [] : ["1"]}>
                      <Panel header="石英砂领用明细" key="1">
                        <Form
                          form={recordForm}
                          onFinish={handleAddRecord}
                          layout="vertical"
                        >
                          <Row gutter={16}>
                            <Col span={6}>
                              <Form.Item
                                label="机台号"
                                name="machine_number"
                                rules={[{ required: true }]}
                              >
                                <Select
                                  placeholder="请选择机台号"
                                  dropdownRender={(menu) =>
                                    customDropdownRender("machine_number", menu)
                                  }
                                  showSearch
                                  filterOption={(input, option) =>
                                    option.children
                                      .toLowerCase()
                                      .indexOf(input.toLowerCase()) >= 0
                                  }
                                >
                                  {options.machine_number?.map((opt) => (
                                    <Option key={opt.id} value={opt.value}>
                                      <div
                                        style={{
                                          display: "flex",
                                          justifyContent: "space-between",
                                          alignItems: "center",
                                        }}
                                      >
                                        <span>{opt.value}</span>
                                        <Popconfirm
                                          title="确定删除这个选项吗？"
                                          onConfirm={(e) => {
                                            e.stopPropagation();
                                            handleDeleteOption(
                                              "machine_number",
                                              opt.id
                                            );
                                          }}
                                        >
                                          <DeleteOutlined
                                            style={{
                                              color: "#ff4d4f",
                                              fontSize: "12px",
                                            }}
                                            onClick={(e) => e.stopPropagation()}
                                          />
                                        </Popconfirm>
                                      </div>
                                    </Option>
                                  ))}
                                </Select>
                              </Form.Item>
                            </Col>

                            <Col span={6}>
                              <Form.Item
                                label="图号"
                                name="drawing_number"
                                rules={[{ required: true }]}
                              >
                                <Select
                                  placeholder="请选择图号"
                                  dropdownRender={(menu) =>
                                    customDropdownRender("drawing_number", menu)
                                  }
                                  showSearch
                                  filterOption={(input, option) =>
                                    option.children
                                      .toLowerCase()
                                      .indexOf(input.toLowerCase()) >= 0
                                  }
                                >
                                  {options.drawing_number?.map((opt) => (
                                    <Option key={opt.id} value={opt.value}>
                                      <div
                                        style={{
                                          display: "flex",
                                          justifyContent: "space-between",
                                          alignItems: "center",
                                        }}
                                      >
                                        <span>{opt.value}</span>
                                        <Popconfirm
                                          title="确定删除这个选项吗？"
                                          onConfirm={(e) => {
                                            e.stopPropagation();
                                            handleDeleteOption(
                                              "drawing_number",
                                              opt.id
                                            );
                                          }}
                                        >
                                          <DeleteOutlined
                                            style={{
                                              color: "#ff4d4f",
                                              fontSize: "12px",
                                            }}
                                            onClick={(e) => e.stopPropagation()}
                                          />
                                        </Popconfirm>
                                      </div>
                                    </Option>
                                  ))}
                                </Select>
                              </Form.Item>
                            </Col>

                            <Col span={6}>
                              <Form.Item
                                label="领用人"
                                name="receiver"
                                rules={[{ required: true }]}
                              >
                                <Select
                                  placeholder="请选择领用人"
                                  dropdownRender={(menu) =>
                                    customDropdownRender("receiver", menu)
                                  }
                                  showSearch
                                  filterOption={(input, option) =>
                                    option.children
                                      .toLowerCase()
                                      .indexOf(input.toLowerCase()) >= 0
                                  }
                                >
                                  {options.receiver?.map((opt) => (
                                    <Option key={opt.id} value={opt.value}>
                                      <div
                                        style={{
                                          display: "flex",
                                          justifyContent: "space-between",
                                          alignItems: "center",
                                        }}
                                      >
                                        <span>{opt.value}</span>
                                        <Popconfirm
                                          title="确定删除这个选项吗？"
                                          onConfirm={(e) => {
                                            e.stopPropagation();
                                            handleDeleteOption(
                                              "receiver",
                                              opt.id
                                            );
                                          }}
                                        >
                                          <DeleteOutlined
                                            style={{
                                              color: "#ff4d4f",
                                              fontSize: "12px",
                                            }}
                                            onClick={(e) => e.stopPropagation()}
                                          />
                                        </Popconfirm>
                                      </div>
                                    </Option>
                                  ))}
                                </Select>
                              </Form.Item>
                            </Col>
                          </Row>

                          <Divider orientation="left">石英砂信息</Divider>

                          {sandConfigs.map((group, index) => (
                            <div key={index} style={{ marginBottom: 16 }}>
                              <Row gutter={16}>
                                {group.map(({ prefix, label }) => (
                                  <Col span={6} key={prefix}>
                                    <Card
                                      size="small"
                                      title={label}
                                      style={{ height: "100%" }}
                                    >
                                      <Form.Item
                                        name={`${prefix}_type`}
                                        label="类型"
                                        style={{ marginBottom: 12 }}
                                      >
                                        <Select
                                          placeholder="选择类型"
                                          allowClear
                                          onChange={(value) =>
                                            value && loadBatches(prefix)
                                          }
                                        >
                                          {sandTypes[prefix.toUpperCase()]?.map(
                                            (type) => (
                                              <Option key={type} value={type}>
                                                {type}
                                              </Option>
                                            )
                                          )}
                                        </Select>
                                      </Form.Item>

                                      <Form.Item
                                        name={`${prefix}_batch`}
                                        label="批号"
                                        style={{ marginBottom: 12 }}
                                      >
                                        <Select
                                          placeholder={`选择${label}批号`}
                                          dropdownRender={(menu) =>
                                            customDropdownRender(
                                              `${prefix}_batch`,
                                              menu
                                            )
                                          }
                                          showSearch
                                          filterOption={(input, option) =>
                                            option.children
                                              .toLowerCase()
                                              .indexOf(input.toLowerCase()) >= 0
                                          }
                                          allowClear
                                        >
                                          {options[`${prefix}_batch`]?.map(
                                            (opt) => (
                                              <Option
                                                key={opt.id}
                                                value={opt.value}
                                              >
                                                <div
                                                  style={{
                                                    display: "flex",
                                                    justifyContent:
                                                      "space-between",
                                                    alignItems: "center",
                                                  }}
                                                >
                                                  <span>{opt.value}</span>
                                                  <Popconfirm
                                                    title="确定删除这个批号吗？"
                                                    onConfirm={(e) => {
                                                      e.stopPropagation();
                                                      handleDeleteOption(
                                                        `${prefix}_batch`,
                                                        opt.id
                                                      );
                                                    }}
                                                  >
                                                    <DeleteOutlined
                                                      style={{
                                                        color: "#ff4d4f",
                                                        fontSize: "12px",
                                                      }}
                                                      onClick={(e) =>
                                                        e.stopPropagation()
                                                      }
                                                    />
                                                  </Popconfirm>
                                                </div>
                                              </Option>
                                            )
                                          )}
                                        </Select>
                                      </Form.Item>

                                      <Form.Item
                                        name={`${prefix}_weight`}
                                        label="重量(kg)"
                                        style={{ marginBottom: 0 }}
                                      >
                                        <Input
                                          type="number"
                                          placeholder="重量"
                                          step="0.01"
                                        />
                                      </Form.Item>
                                    </Card>
                                  </Col>
                                ))}
                              </Row>
                            </div>
                          ))}

                          <Form.Item>
                            <Button
                              type="primary"
                              htmlType="submit"
                              size="large"
                            >
                              添加领用记录
                            </Button>
                          </Form.Item>
                        </Form>
                      </Panel>
                    </Collapse>
                  </Card>

                  <Card title="领用记录列表" size="small">
                    <Table
                      columns={recordColumns}
                      dataSource={records}
                      rowKey="id"
                      pagination={{ pageSize: 10 }}
                      scroll={{ x: 2000 }}
                      size="small"
                    />
                  </Card>
                </>
              ) : (
                <Card title="领用记录管理">
                  <div
                    style={{
                      textAlign: "center",
                      padding: "50px",
                      color: "#999",
                    }}
                  >
                    请先选择或创建一个任务
                  </div>
                </Card>
              )}
            </Col>
          </Row>
        </TabPane>
      </Tabs>
      {/* 明细弹窗 */}
      <Modal
        title={`领用记录明细 (${selectedTaskIds.length}个任务)`}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button
            key="export"
            type="primary"
            icon={<ExportOutlined />}
            onClick={() => handleExportExcel(selectedTaskIds)}
          >
            导出Excel
          </Button>,
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            关闭
          </Button>,
        ]}
        width={1400}
        style={{ top: 20 }}
      >
        <Tabs defaultActiveKey="statistics" type="card">
          <TabPane tab="统计看板" key="statistics">
            <StatisticsPanel
              statistics={statistics}
              records={records}
              selectedTasks={selectedTasksForStats}
            />
          </TabPane>
          <TabPane tab="领用记录" key="records">
            <Table
              columns={recordColumns}
              dataSource={records}
              rowKey="id"
              pagination={{ pageSize: 10 }}
              scroll={{ x: 1000 }}
              size="small"
            />
          </TabPane>
        </Tabs>
      </Modal>

      {/* 统计弹窗 */}
      <Modal
        title="石英砂重量统计"
        open={statisticsModalVisible}
        onCancel={() => setStatisticsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setStatisticsModalVisible(false)}>
            关闭
          </Button>,
        ]}
        width={800}
      >
        // 修改模态框中的统计面板调用
        <StatisticsPanel
          statistics={statistics}
          records={records}
          selectedTasks={selectedTasksForStats}
        />
      </Modal>
    </div>
  );
};

export default SandManagement;

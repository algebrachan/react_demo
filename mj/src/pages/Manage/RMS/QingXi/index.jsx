import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  InputNumber,
  Button,
  Table,
  Select,
  DatePicker,
  Modal,
  Card,
  Row,
  Col,
  Space,
  Divider,
  message,
  Typography,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { MyBreadcrumb, GeneralCard } from "../../../../components/CommonCard";
import {
  rms_options,
  create_recipe,
  delete_recipe,
  update_recipe,
  read_all_recipes,
} from "../../../../apis/mjRms.js";
const { Option } = Select;
const { RangePicker } = DatePicker;
const { Title } = Typography;

const WashingRecipe = () => {
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [viewingRecipe, setViewingRecipe] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  // 级联下拉数据
  const [options, setOptions] = useState({
    figureCodeOption: [],
    materialFormulaOptions: [],
    transparentSandOptions: [],
    schema: {},
  });
  const [filteredInchOptions, setFilteredInchOptions] = useState([]); // 根据图号过滤出的英寸
  const [filteredLineOptions, setFilteredLineOptions] = useState([]); // 根据图号/英寸过滤出的洗净线

  // 分页
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  // 同步表单初始值（编辑/新增弹窗打开时）
  useEffect(() => {
    if (isModalVisible && isEditing && editingRecipe) {
      form.setFieldsValue(editingRecipe);
    }
  }, [isModalVisible, editingRecipe, form]);

  // 新增态：Modal 打开后立刻清空表单，避免首次点击不生效的延迟
  useEffect(() => {
    if (isModalVisible && !isEditing) {
      form.resetFields();
    }
  }, [isModalVisible, isEditing, form]);

  // 初始化数据：获取下拉与列表
  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        const [optRes, listRes] = await Promise.all([
          rms_options(),
          read_all_recipes({
            CreaUser: "",
            CreateTime: [],
            FigureCode: "",
            Line: "",
            RecipeCategory: "清洗配方",
            RecipeName: "",
            UpdateTime: [],
            UpdateUser: "",
            page: 1,
            limit: 10,
          }),
        ]);

        //   rms_options 返回结构兼容处理
        const data = optRes?.data || optRes || {};
        const figureCodeOption = data.figureCodeOption || [];
        const materialFormulaOptions = data.materialFormulaOptions || [];
        const transparentSandOptions =
          data.transparentSandOptions || data.sandOptions || [];
        const schema = data.schema || {};
        setOptions({
          figureCodeOption,
          materialFormulaOptions,
          transparentSandOptions,
          schema,
        });
        const listData = listRes?.data || listRes || {};
        const rawItems = listData || [];
        const totalCount = listRes.length || 0;

        const items = rawItems.map((it) => {
          const statusText =
            it.Status === 0 || it.status === 0
              ? "启用"
              : it.Status === 1 || it.status === 1
              ? "停用"
              : it.status || it.Status || "启用";
          return {
            ...it,
            RecipeId: it.RecipeId ?? it.recipeId ?? it.id,
            id: it.RecipeId ?? it.id,
            recipeNumber: it.RecipeName ?? it.recipeNumber ?? "",
            figureCode: it.FigureCode ?? it.figureCode ?? "",
            version: it.Version ?? it.version ?? "",
            inches: it.Inch ?? it.inches ?? "",
            status: statusText,
            cleaningLine: it.Line ?? it.cleaningLine ?? "",
            createdBy: it.CreaUser ?? it.createdBy ?? "",
            creationTime: it.CreateTime ?? it.creationTime ?? "",
            modifiedBy: it.UpdateUser ?? it.modifiedBy ?? "",
            modificationTime: it.UpdateTime ?? it.modificationTime ?? "",
            parameters: Array.isArray(it.params)
              ? normalizeParams(it.params)
              : it.parameters || {
                  scanCode: "",
                  batchNumber: "",
                  autoFlow: 1,
                  diameterInch: "",
                  diameterMm: "",
                  height: "100",
                  preCleaningTotalTime: 0,
                  preCleaningHighPressureBeforeLowPressureTime: 0,
                  preCleaningHighPressureAfterLowPressureTime: 0,
                  picklingTime: 0,
                  preCleaningTimeBeforeHighPressure: 0,
                  highPressureCleaningTotalTime: 0,
                  lowPressureTimeBeforeHighPressure: 0,
                  lowPressureTimeAfterHighPressure: 0,
                  standingTimeAfterHighPressure: 0,
                  ultrasonicCleaningTime: 0,
                  highPressure2CleaningTotalTime: 0,
                  lowPressureTimeBeforeHighPressure2: 0,
                  lowPressureTimeAfterHighPressure2: 0,
                  standingTimeAfterHighPressure2: 0,
                  sprayMode: 0,
                  cleaningLineCode: "10",
                  remark: "",
                },
          };
        });

        setRecipes(items);
        setFilteredRecipes(items);
        setTotal(totalCount);
        setPage(1);
        setPageSize(10);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  // 拉取列表
  const fetchList = async (payload = {}) => {
    setLoading(true);
    try {
      const res = await read_all_recipes(payload);
      const listData = res?.data || res || {};
      const rawItems = listData || listData || listData || [];
      const totalCount = res?.length || 0;

      // 映射后端字段到页面使用字段，兼容展示与编辑
      const items = rawItems.map((it) => {
        const statusText =
          it.Status === 0 || it.status === 0
            ? "启用"
            : it.Status === 1 || it.status === 1
            ? "停用"
            : it.status || it.Status || "启用";
        return {
          // 保留原字段
          ...it,
          // 关键主键
          RecipeId: it.RecipeId ?? it.recipeId ?? it.id,
          id: it.RecipeId ?? it.id,
          // 页面展示字段
          recipeNumber: it.RecipeName ?? it.recipeNumber ?? "",
          figureCode: it.FigureCode ?? it.figureCode ?? "",
          version: it.Version ?? it.version ?? "",
          inches: it.Inch ?? it.inches ?? "",
          status: statusText,
          cleaningLine: it.Line ?? it.cleaningLine ?? "",
          createdBy: it.CreaUser ?? it.createdBy ?? "",
          creationTime: it.CreateTime ?? it.creationTime ?? "",
          modifiedBy: it.UpdateUser ?? it.modifiedBy ?? "",
          modificationTime: it.UpdateTime ?? it.modificationTime ?? "",
          // 参数（优先从后端 params 数组解析，若无则给默认对象，避免查看时访问报错）
          parameters: Array.isArray(it.params)
            ? normalizeParams(it.params)
            : it.parameters || {
                scanCode: "",
                batchNumber: "",
                autoFlow: 1,
                diameterInch: "",
                diameterMm: "",
                height: "100",
                preCleaningTotalTime: 0,
                preCleaningHighPressureBeforeLowPressureTime: 0,
                preCleaningHighPressureAfterLowPressureTime: 0,
                picklingTime: 0,
                preCleaningTimeBeforeHighPressure: 0,
                highPressureCleaningTotalTime: 0,
                lowPressureTimeBeforeHighPressure: 0,
                lowPressureTimeAfterHighPressure: 0,
                standingTimeAfterHighPressure: 0,
                ultrasonicCleaningTime: 0,
                highPressure2CleaningTotalTime: 0,
                lowPressureTimeBeforeHighPressure2: 0,
                lowPressureTimeAfterHighPressure2: 0,
                standingTimeAfterHighPressure2: 0,
                sprayMode: 0,
                cleaningLineCode: "10",
                remark: "",
              },
        };
      });

      setRecipes(items);
      setFilteredRecipes(items);
      setTotal(totalCount);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // 处理搜索 -> 后端查询
  const handleSearch = (values) => {
    const payload = {
      RecipeName: values.recipeNumber || "",
      RecipeCategory: "清洗配方",
      Status:
        values.status === "启用" ? 0 : values.status === "停用" ? 1 : undefined,
      FigureCode: values.figureCode || "",
      Line: values.cleaningLine || "",
      CreaUser: values.createdBy || "",
      CreateTime:
        values.creationTime && values.creationTime.length === 2
          ? [
              values.creationTime[0].format("YYYY-MM-DD HH:mm:ss"),
              values.creationTime[1].format("YYYY-MM-DD HH:mm:ss"),
            ]
          : [],
      UpdateUser: values.modifiedBy || "",
      UpdateTime:
        values.modificationTime && values.modificationTime.length === 2
          ? [
              values.modificationTime[0].format("YYYY-MM-DD HH:mm:ss"),
              values.modificationTime[1].format("YYYY-MM-DD HH:mm:ss"),
            ]
          : [],
      page,
      limit: pageSize,
    };
    fetchList(payload);
  };

  // 重置搜索
  const handleReset = () => {
    searchForm.resetFields();
    fetchList({ RecipeCategory: "清洗配方", page: 1, limit: pageSize });
    setPage(1);
  };

  // 添加新配方
  const handleAdd = () => {
    // 新增配方弹窗不带默认值，仅通过图号级联回填英寸/洗净线
    setEditingRecipe(null);
    setIsEditing(false);
    setFormKey((prev) => prev + 1);
    // 清空级联候选
    setFilteredInchOptions([]);
    setFilteredLineOptions([]);
    setIsModalVisible(true);
    form.resetFields();
  };

  // 编辑配方
  const handleEdit = (record) => {
    // 预计算级联可选项（英寸 value/label 都是 inch；洗净线 value=line_value, label=line_label）
    const figure = options.figureCodeOption.find(
      (i) => i.value === record.figureCode
    );
    const inchOpts = figure?.inch
      ? [{ value: figure.inch, label: figure.inch }]
      : [];
    const lineOpts =
      figure?.line_value && figure?.line_label
        ? [{ value: figure.line_value, label: figure.line_label }]
        : [];
    setFilteredInchOptions(inchOpts);
    setFilteredLineOptions(lineOpts);

    setEditingRecipe({ ...record });
    setIsEditing(true);
    setFormKey((prev) => prev + 1);
    setIsModalVisible(true);
    form.resetFields();
    // 编辑态下，将 cleaningLine 设为 line_value，避免 label 与 Select value 不匹配；同步洗净参数直径（英寸）与美晶洗净线编号
    form.setFieldsValue({
      ...record,
      inches: figure?.inch ?? record.inches,
      cleaningLine: figure?.line_value ?? record.cleaningLine,
      parameters: {
        ...(record.parameters || {}),
        diameterInch: figure?.inch ?? record.parameters?.diameterInch,
        cleaningLineCode:
          figure?.line_value ?? record.parameters?.cleaningLineCode,
      },
    });
  };

  // 查看配方
  const handleView = (record) => {
    setViewingRecipe(record);
    setIsViewModalVisible(true);
  };

  // 删除配方
  const handleDelete = (id) => {
    Modal.confirm({
      title: "确认删除",
      content: "确定要删除这个配方吗？此操作将同时删除关联的洗净参数。",
      async onOk() {
        try {
          const RecipeId = id;
          await delete_recipe({ RecipeId, RecipeCategory: "清洗配方" });
          message.success("删除成功");
          fetchList({ page, limit: pageSize });
        } catch (e) {
          // 已有全局拦截提示
        }
      },
    });
  };

  // 参数中文名映射，用于构建 [{ ParamName, ParamValue }]
  const paramLabelMap = {
    // 已是中文 key 的无需映射：'研磨上料线扫码'、'批号'
    autoFlow: "自动流向",
    diameterInch: "直径（英寸）",
    diameterMm: "直径（毫米）",
    height: "高度（毫米）",
    preCleaningTotalTime: "预清洗总时间（秒）",
    preCleaningHighPressureBeforeLowPressureTime: "预清洗高压前低压时间（秒）",
    preCleaningHighPressureAfterLowPressureTime: "预清洗高压后低压时间（秒）",
    aidCleaningTime: "酸洗时间（秒）",
    beforeHighPressureCleaningTime: "高压前预清洗时间（秒）",
    picklingTime: "酸洗时间（秒）",
    preCleaningTimeBeforeHighPressure: "高压前预清洗时间（秒）",
    highPressureCleaningTotalTime: "高压清洗总时间（秒）",
    lowPressureTimeBeforeHighPressure: "高压清洗高压前低压时间（秒）",
    lowPressureTimeAfterHighPressure: "高压清洗高压后低压时间（秒）",
    standingTimeAfterHighPressure: "高压后静置时间（秒）",
    ultrasonicCleaningTime: "超声清洗时间（秒）",
    highPressure2CleaningTotalTime: "高压2清洗总时间（秒）",
    lowPressureTimeBeforeHighPressure2: "高压2清洗高压前低压时间（秒）",
    lowPressureTimeAfterHighPressure2: "高压2清洗高压后低压时间（秒）",
    standingTimeAfterHighPressure2: "高压2后静置时间（秒）",
    cleaningLineCode: "美晶洗净线编号",
    remark: "备注",
  };
  // 将后端 params 数组转成前端表单所需的 parameters 对象（兼容重复中文名）
  const normalizeParams = (arr = []) => {
    if (!Array.isArray(arr)) return {};
    const obj = {};
    const counters = {};
    const pick = (name) => {
      switch (name) {
        case "研磨上料线扫码":
          return "研磨上料线扫码";
        case "批号":
          return "批号";
        case "自动流向":
          return "autoFlow";
        case "直径（英寸）":
          return "diameterInch";
        case "直径（毫米）":
          return "diameterMm";
        case "高度（毫米）":
          return "height";
        case "预清洗总时间（秒）":
          return "preCleaningTotalTime";
        case "预清洗高压前低压时间（秒）":
          return "preCleaningHighPressureBeforeLowPressureTime";
        case "预清洗高压后低压时间（秒）":
          return "preCleaningHighPressureAfterLowPressureTime";
        case "高压清洗总时间（秒）":
          return "highPressureCleaningTotalTime";
        case "高压清洗高压前低压时间（秒）":
          return "lowPressureTimeBeforeHighPressure";
        case "高压清洗高压后低压时间（秒）":
          return "lowPressureTimeAfterHighPressure";
        case "高压后静置时间（秒）":
          return "standingTimeAfterHighPressure";
        case "超声清洗时间（秒）":
          return "ultrasonicCleaningTime";
        case "高压2清洗总时间（秒）":
          return "highPressure2CleaningTotalTime";
        case "高压2清洗高压前低压时间（秒）":
          return "lowPressureTimeBeforeHighPressure2";
        case "高压2清洗高压后低压时间（秒）":
          return "lowPressureTimeAfterHighPressure2";
        case "高压2后静置时间（秒）":
          return "standingTimeAfterHighPressure2";
        case "美晶洗净线编号":
          return "cleaningLineCode";
        case "备注":
          return "remark";
        case "酸洗时间（秒）": {
          const n = (counters[name] = (counters[name] || 0) + 1);
          return n === 1 ? "aidCleaningTime" : "picklingTime";
        }
        case "高压前预清洗时间（秒）": {
          const n = (counters[name] = (counters[name] || 0) + 1);
          return n === 1
            ? "beforeHighPressureCleaningTime"
            : "preCleaningTimeBeforeHighPressure";
        }
        default:
          return name;
      }
    };
    arr.forEach(({ ParamName, ParamValue }) => {
      const key = pick(ParamName);
      obj[key] = ParamValue;
      if (ParamName === "研磨上料线扫码") obj.scanCode = ParamValue;
      if (ParamName === "批号") obj.batchNumber = ParamValue;
      // 关键修复：这两个中文名无论返回一次还是多次，都同时写入两组 key，保证编辑表单能回填
      if (ParamName === "酸洗时间（秒）") {
        obj.picklingTime = ParamValue;
        obj.aidCleaningTime = ParamValue;
      }
      if (ParamName === "高压前预清洗时间（秒）") {
        obj.preCleaningTimeBeforeHighPressure = ParamValue;
        obj.beforeHighPressureCleaningTime = ParamValue;
      }
    });
    return obj;
  };
  // 构建接口所需 params 结构（避免“研磨上料线扫码/批号”重复，保留酸洗/高压前预清洗的双项）
  const buildParams = (paramsObj = {}) => {
    const result = [];
    const pushOne = (name, val) => {
      result.push({
        ParamName: name,
        ParamValue: val === null || val === undefined ? "" : String(val),
      });
    };
    // 先处理“研磨上料线扫码/批号”两项，只推一次中文名
    if ("研磨上料线扫码" in paramsObj || "scanCode" in paramsObj) {
      pushOne(
        "研磨上料线扫码",
        paramsObj["研磨上料线扫码"] ?? paramsObj.scanCode ?? ""
      );
    }
    if ("批号" in paramsObj || "batchNumber" in paramsObj) {
      pushOne("批号", paramsObj["批号"] ?? paramsObj.batchNumber ?? "");
    }
    // 其他字段：按照映射或原始 key 入参；跳过已处理的 4 个键
    Object.keys(paramsObj).forEach((key) => {
      if (
        key === "scanCode" ||
        key === "batchNumber" ||
        key === "研磨上料线扫码" ||
        key === "批号"
      )
        return;
      const label = paramLabelMap[key] || key; // 若没有映射，直接用 key（兼容中文 key）
      const val = paramsObj[key];
      pushOne(label, val);
    });
    return result;
  };

  // 保存配方（新增/编辑）
  const handleSave = async (values) => {
    // 后端需传 line_value，不再转换为 line_label
    const currentLineValue = values.cleaningLine;

    // payload 适配接口格式
    const payload = {
      RecipeName: values.recipeNumber, // 清洗配方编号
      FigureCode: values.figureCode, // 图号
      Version: values.version, // 版本
      Status: values.status === "启用" ? 0 : 1, // 数值化
      Inch: values.inches, // 英寸
      Line: currentLineValue, // 洗净线传 line_value
      RecipeCategory: "清洗配方",
      params: buildParams(values.parameters || {}),
    };

    try {
      setLoading(true);
      if (editingRecipe && (editingRecipe.RecipeId || editingRecipe.id)) {
        // 编辑
        const RecipeId = editingRecipe.RecipeId || editingRecipe.id;
        await update_recipe({ RecipeId, ...payload });
        message.success("更新成功");
      } else {
        // 新增
        await create_recipe(payload);
        message.success("添加成功");
      }
      setIsModalVisible(false);
      setEditingRecipe(null);
      // 刷新列表，保持当前查询分页
      const searchValues = searchForm.getFieldsValue();
      handleSearch(searchValues);
    } catch (e) {
      // 全局拦截已提示
    } finally {
      setLoading(false);
    }
  };

  // 级联联动：图号变化
  const onFigureChange = (val) => {
    const item = options.figureCodeOption.find((i) => i.value === val);
    const inch = item?.inch;
    const lineValue = item?.line_value;
    const lineLabel = item?.line_label;
    // 根据当前选中图号，英寸/洗净线的候选
    setFilteredInchOptions(inch ? [{ value: inch, label: inch }] : []);
    setFilteredLineOptions(
      lineValue && lineLabel ? [{ value: lineValue, label: lineLabel }] : []
    );
    // 赋值（英寸为 inch；洗净线为 line_value，展示 label）；同步洗净参数直径（英寸）与美晶洗净线编号
    form.setFieldsValue({
      inches: inch,
      cleaningLine: lineValue,
      parameters: {
        ...(form.getFieldValue("parameters") || {}),
        diameterInch: inch,
        cleaningLineCode: lineValue,
      },
    });
  };

  // 英寸变化（此处数据来自图号唯一英寸，保持同步洗净线）
  const onInchChange = () => {
    const figure = form.getFieldValue("figureCode");
    const item = options.figureCodeOption.find((i) => i.value === figure);
    const lineValue = item?.line_value;
    const lineLabel = item?.line_label;
    setFilteredLineOptions(
      lineValue && lineLabel ? [{ value: lineValue, label: lineLabel }] : []
    );
    const inchVal = form.getFieldValue("inches");
    form.setFieldsValue({
      cleaningLine: lineValue,
      parameters: {
        ...(form.getFieldValue("parameters") || {}),
        diameterInch: inchVal,
        cleaningLineCode: lineValue,
      },
    });
  };

  // 表格列定义
  const columns = [
    {
      title: "序号",
      key: "index",
      width: 60,
      render: (text, record, index) => index + 1,
    },
    {
      title: "洗净配方编号",
      dataIndex: "recipeNumber",
      key: "recipeNumber",
      width: 100,
    },
    {
      title: "图号",
      dataIndex: "figureCode",
      key: "figureCode",
      width: 100,
    },
    {
      title: "版本",
      dataIndex: "version",
      key: "version",
      width: 80,
    },
    {
      title: "英寸",
      dataIndex: "inches",
      key: "inches",
      width: 80,
    },
    {
      title: "制定人",
      dataIndex: "createdBy",
      key: "createdBy",
      width: 100,
    },
    {
      title: "制定时间",
      dataIndex: "creationTime",
      key: "creationTime",
      width: 150,
    },
    {
      title: "修改人",
      dataIndex: "modifiedBy",
      key: "modifiedBy",
      width: 100,
    },
    {
      title: "修改时间",
      dataIndex: "modificationTime",
      key: "modificationTime",
      width: 150,
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 80,
    },
    {
      title: "洗净线",
      dataIndex: "cleaningLine",
      key: "cleaningLine",
      width: 120,
      render: (text, record) => {
        return text == "10" ? "天然线" : "合成线";
      },
    },
    {
      title: "操作",
      key: "action",
      width: 180,
      render: (text, record) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
          >
            查看
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.RecipeId || record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <MyBreadcrumb items={[window.sys_name, "RMS", "清洗配方"]} />
      <div style={{ marginTop: 16 }}>
        {/* 搜索表单 */}
        <GeneralCard name="清洗配方管理">
          <div style={{ padding: "16px" }}>
            <Form form={searchForm} layout="vertical" onFinish={handleSearch}>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item label="图号" name="figureCode">
                    <Select
                      placeholder="请输入图号"
                      allowClear
                      showSearch
                      optionFilterProp="label"
                      options={(options.figureCodeOption || []).map((i) => ({
                        value: i.value,
                        label: i.label,
                      }))}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item label="状态" name="status">
                    <Select placeholder="请选择状态" allowClear>
                      <Option value="启用">启用</Option>
                      <Option value="停用">停用</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item label="洗净线" name="cleaningLine">
                    <Select placeholder="请选择洗净线" allowClear>
                      <Option value="10">天然线</Option>
                      <Option value="20">合成线</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item label="添加人员" name="createdBy">
                    <Input placeholder="请输入添加人员" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={12}>
                  <Form.Item label="制定时间" name="creationTime">
                    <RangePicker
                      style={{ width: "100%" }}
                      placeholder={["开始时间", "结束时间"]}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item label="修改人员" name="modifiedBy">
                    <Input placeholder="请输入修改人员" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item label="修改时间" name="modificationTime">
                    <RangePicker
                      style={{ width: "100%" }}
                      placeholder={["开始时间", "结束时间"]}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Space>
                    <Button
                      type="primary"
                      htmlType="submit"
                      icon={<SearchOutlined />}
                    >
                      搜索
                    </Button>
                    <Button onClick={handleReset}>重置</Button>
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={handleAdd}
                      style={{
                        backgroundColor: "#52c41a",
                        borderColor: "#52c41a",
                      }}
                    >
                      新增配方
                    </Button>
                  </Space>
                </Col>
              </Row>
            </Form>
          </div>
          {/* 配方表格 */}
          <Card>
            <Table
              size="small"
              bordered
              columns={columns}
              dataSource={filteredRecipes}
              rowKey={(r) => r.RecipeId || r.id || r.recipeNumber}
              loading={loading}
              scroll={{ x: "max-content" }}
              pagination={{
                total: total,
                current: page,
                pageSize: pageSize,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (t, range) =>
                  `第 ${range[0]}-${range[1]} 条，共 ${t} 条记录`,
              }}
              onChange={(pagination) => {
                const { current, pageSize: ps } = pagination;
                setPage(current);
                setPageSize(ps);
                const values = searchForm.getFieldsValue();
                const payload = {
                  RecipeName: values.recipeNumber || "",
                  RecipeCategory: "清洗配方",
                  Status:
                    values.status === "启用"
                      ? 0
                      : values.status === "停用"
                      ? 1
                      : undefined,
                  FigureCode: values.figureCode || "",
                  Line: values.cleaningLine || "",
                  CreaUser: values.createdBy || "",
                  CreateTime:
                    values.creationTime && values.creationTime.length === 2
                      ? [
                          values.creationTime[0].format("YYYY-MM-DD HH:mm:ss"),
                          values.creationTime[1].format("YYYY-MM-DD HH:mm:ss"),
                        ]
                      : [],
                  UpdateUser: values.modifiedBy || "",
                  UpdateTime:
                    values.modificationTime &&
                    values.modificationTime.length === 2
                      ? [
                          values.modificationTime[0].format(
                            "YYYY-MM-DD HH:mm:ss"
                          ),
                          values.modificationTime[1].format(
                            "YYYY-MM-DD HH:mm:ss"
                          ),
                        ]
                      : [],
                  page: current,
                  limit: ps,
                };
                fetchList(payload);
              }}
            />
          </Card>
        </GeneralCard>
        {/* 新增/编辑配方模态框 */}
        <Modal
          title={editingRecipe?.id ? "编辑配方" : "新增配方"}
          open={isModalVisible}
          destroyOnClose
          onCancel={() => {
            setIsModalVisible(false);
            setEditingRecipe(null);
            setIsEditing(false);
            form.resetFields();
          }}
          footer={null}
          width={800}
          style={{ top: 20 }}
        >
          <Form
            key={formKey}
            form={form}
            layout="vertical"
            initialValues={isEditing ? editingRecipe : undefined}
            onFinish={handleSave}
            style={{ marginTop: 20 }}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="清洗配方编号" name="recipeNumber">
                  <Input placeholder="请输入清洗配方编号" disabled />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="图号"
                  name="figureCode"
                  rules={[{ required: true, message: "请输入图号" }]}
                >
                  <Select
                    placeholder="请输入图号"
                    showSearch
                    optionFilterProp="label"
                    onChange={onFigureChange}
                    options={(options.figureCodeOption || []).map((i) => ({
                      value: i.value,
                      label: i.label,
                    }))}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="版本"
                  name="version"
                  rules={[{ required: true, message: "请输入版本" }]}
                >
                  <Input placeholder="请输入版本" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="英寸"
                  name="inches"
                  rules={[{ required: true, message: "请输入英寸" }]}
                >
                  <Select
                    placeholder="请输入英寸"
                    onChange={onInchChange}
                    options={filteredInchOptions}
                    disabled={(filteredInchOptions || []).length === 0}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="状态"
                  name="status"
                  rules={[{ required: true, message: "请选择状态" }]}
                >
                  <Select placeholder="请选择状态">
                    <Option value="启用">启用</Option>
                    <Option value="停用">停用</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="洗净线"
                  name="cleaningLine"
                  rules={[{ required: true, message: "请选择洗净线" }]}
                >
                  <Select
                    placeholder="请选择洗净线"
                    options={filteredLineOptions}
                    disabled={(filteredLineOptions || []).length === 0}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Divider>洗净参数</Divider>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="研磨上料线扫码"
                  name={["parameters", "研磨上料线扫码"]}
                >
                  <Input
                    disabled
                    placeholder="十位对应桁架，个位对应线体位置"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="批号" name={["parameters", "批号"]}>
                  <Input disabled placeholder="请输入批号" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="自动线洗净位置的自动上报时间（分钟）"
                  name={["parameters", "自动线洗净位置的自动上报时间（分钟）"]}
                >
                  <Input
                    disabled
                    placeholder="请输入自动线洗净位置的自动上报时间（分钟）"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="自动流向"
                  name={["parameters", "autoFlow"]}
                  rules={[{ required: true, message: "请输入自动流向" }]}
                >
                  <Input placeholder="请输入自动流向" />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="直径（英寸）"
                  name={["parameters", "diameterInch"]}
                >
                  <Input placeholder="请输入直径（英寸）" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="直径（毫米）"
                  name={["parameters", "diameterMm"]}
                >
                  <Input placeholder="请输入直径（毫米）" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="高度（毫米）" name={["parameters", "height"]}>
                  <Input placeholder="请输入高度（毫米）" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="预清洗总时间（秒）"
                  name={["parameters", "preCleaningTotalTime"]}
                  rules={[{ required: true, message: "请输入预清洗总时间" }]}
                >
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="预清洗高压前低压时间（秒）"
                  name={[
                    "parameters",
                    "preCleaningHighPressureBeforeLowPressureTime",
                  ]}
                  rules={[
                    { required: true, message: "请输入预清洗高压前低压时间" },
                  ]}
                >
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="预清洗高压后低压时间（秒）"
                  name={[
                    "parameters",
                    "preCleaningHighPressureAfterLowPressureTime",
                  ]}
                  rules={[
                    { required: true, message: "请输入预清洗高压后低压时间" },
                  ]}
                >
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="酸洗时间（秒）"
                  name={["parameters", "picklingTime"]}
                  rules={[{ required: true, message: "请输入酸洗时间" }]}
                >
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="高压前预清洗时间（秒）"
                  name={["parameters", "preCleaningTimeBeforeHighPressure"]}
                  rules={[
                    { required: true, message: "请输入高压前预清洗时间" },
                  ]}
                >
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="高压清洗总时间（秒）"
                  name={["parameters", "highPressureCleaningTotalTime"]}
                  rules={[{ required: true, message: "请输入高压清洗总时间" }]}
                >
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="高压清洗高压前低压时间（秒）"
                  name={["parameters", "lowPressureTimeBeforeHighPressure"]}
                  rules={[
                    { required: true, message: "请输入高压清洗高压前低压时间" },
                  ]}
                >
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="高压清洗高压后低压时间（秒）"
                  name={["parameters", "lowPressureTimeAfterHighPressure"]}
                  rules={[
                    { required: true, message: "请输入高压清洗高压后低压时间" },
                  ]}
                >
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="高压后静置时间（秒）"
                  name={["parameters", "standingTimeAfterHighPressure"]}
                  rules={[{ required: true, message: "请输入高压后静置时间" }]}
                >
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="超声清洗时间（秒）"
                  name={["parameters", "ultrasonicCleaningTime"]}
                  rules={[{ required: true, message: "请输入超声清洗时间" }]}
                >
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="高压2清洗总时间（秒）"
                  name={["parameters", "highPressure2CleaningTotalTime"]}
                  rules={[{ required: true, message: "请输入高压2清洗总时间" }]}
                >
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="高压2清洗高压前低压时间（秒）"
                  name={["parameters", "lowPressureTimeBeforeHighPressure2"]}
                  rules={[
                    {
                      required: true,
                      message: "请输入高压2清洗高压前低压时间",
                    },
                  ]}
                >
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="高压2清洗高压后低压时间（秒）"
                  name={["parameters", "lowPressureTimeAfterHighPressure2"]}
                  rules={[
                    {
                      required: true,
                      message: "请输入高压2清洗高压后低压时间",
                    },
                  ]}
                >
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="高压2后静置时间（秒）"
                  name={["parameters", "standingTimeAfterHighPressure2"]}
                  rules={[{ required: true, message: "请输入高压2后静置时间" }]}
                >
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="美晶洗净线编号"
                  name={["parameters", "cleaningLineCode"]}
                >
                  <Select disabled placeholder="请选择美晶洗净线编号">
                    <Option value="10">天然洗净</Option>
                    <Option value="20">合成洗净</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="备注" name={["parameters", "remark"]}>
                  <Input.TextArea rows={3} placeholder="请输入备注" />
                </Form.Item>
              </Col>
            </Row>
            <div style={{ textAlign: "right", marginTop: 16 }}>
              <Button
                onClick={() => setIsModalVisible(false)}
                style={{ marginRight: 8 }}
              >
                取消
              </Button>
              <Button type="primary" htmlType="submit">
                保存
              </Button>
            </div>
          </Form>
        </Modal>

        {/* 查看配方模态框 */}
        <Modal
          title="查看配方详情"
          open={isViewModalVisible}
          onCancel={() => setIsViewModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setIsViewModalVisible(false)}>
              关闭
            </Button>,
          ]}
          width={800}
        >
          {viewingRecipe && (
            <div style={{ marginTop: 20 }}>
              <Title level={4}>基本信息</Title>
              <Row gutter={16}>
                <Col span={12}>
                  <p>
                    <strong>洗净配方编号：</strong>
                    {viewingRecipe.recipeNumber}
                  </p>
                </Col>
                <Col span={12}>
                  <p>
                    <strong>图号：</strong>
                    {viewingRecipe.figureCode}
                  </p>
                </Col>
                <Col span={12}>
                  <p>
                    <strong>版本：</strong>
                    {viewingRecipe.version}
                  </p>
                </Col>
                <Col span={12}>
                  <p>
                    <strong>英寸：</strong>
                    {viewingRecipe.inches}
                  </p>
                </Col>
                <Col span={12}>
                  <p>
                    <strong>状态：</strong>
                    {viewingRecipe.status}
                  </p>
                </Col>
                <Col span={12}>
                  <p>
                    <strong>洗净线：</strong>
                    {viewingRecipe.cleaningLine}
                  </p>
                </Col>
                <Col span={12}>
                  <p>
                    <strong>制定人：</strong>
                    {viewingRecipe.createdBy}
                  </p>
                </Col>
                <Col span={12}>
                  <p>
                    <strong>制定时间：</strong>
                    {viewingRecipe.creationTime}
                  </p>
                </Col>
                <Col span={12}>
                  <p>
                    <strong>修改人：</strong>
                    {viewingRecipe.modifiedBy}
                  </p>
                </Col>
                <Col span={12}>
                  <p>
                    <strong>修改时间：</strong>
                    {viewingRecipe.modificationTime}
                  </p>
                </Col>
              </Row>

              <Divider />

              <Title level={4}>洗净参数</Title>
              <Row gutter={16}>
                <Col span={12}>
                  <p>
                    <strong>研磨上料线扫码：</strong>
                    {viewingRecipe.parameters.scanCode}
                  </p>
                </Col>
                <Col span={12}>
                  <p>
                    <strong>批号：</strong>
                    {viewingRecipe.parameters.batchNumber}
                  </p>
                </Col>
                <Col span={12}>
                  <p>
                    <strong>自动流向：</strong>
                    {viewingRecipe.parameters.autoFlow === 0
                      ? "不喷涂"
                      : "喷涂"}
                  </p>
                </Col>
                <Col span={12}>
                  <p>
                    <strong>轨迹选择：</strong>
                    {viewingRecipe.parameters.trajectory}
                  </p>
                </Col>
                <Col span={12}>
                  <p>
                    <strong>直径（英寸）：</strong>
                    {viewingRecipe.parameters.diameterInch}
                  </p>
                </Col>
                <Col span={12}>
                  <p>
                    <strong>直径（毫米）：</strong>
                    {viewingRecipe.parameters.diameterMm}
                  </p>
                </Col>
                <Col span={12}>
                  <p>
                    <strong>高度（毫米）：</strong>
                    {viewingRecipe.parameters.height}
                  </p>
                </Col>
                <Col span={12}>
                  <p>
                    <strong>预清洗总时间（秒）：</strong>
                    {viewingRecipe.parameters.preCleaningTotalTime}
                  </p>
                </Col>
                <Col span={12}>
                  <p>
                    <strong>预清洗高压前低压时间（秒）：</strong>
                    {
                      viewingRecipe.parameters
                        .preCleaningHighPressureBeforeLowPressureTime
                    }
                  </p>
                </Col>
                <Col span={12}>
                  <p>
                    <strong>预清洗高压后低压时间（秒）：</strong>
                    {
                      viewingRecipe.parameters
                        .preCleaningHighPressureAfterLowPressureTime
                    }
                  </p>
                </Col>
                <Col span={12}>
                  <p>
                    <strong>酸洗时间（秒）：</strong>
                    {viewingRecipe.parameters.picklingTime}
                  </p>
                </Col>
                <Col span={12}>
                  <p>
                    <strong>高压前预清洗时间（秒）：</strong>
                    {viewingRecipe.parameters.preCleaningTimeBeforeHighPressure}
                  </p>
                </Col>
                <Col span={12}>
                  <p>
                    <strong>高压清洗总时间（秒）：</strong>
                    {viewingRecipe.parameters.highPressureCleaningTotalTime}
                  </p>
                </Col>
                <Col span={12}>
                  <p>
                    <strong>高压清洗高压前低压时间（秒）：</strong>
                    {viewingRecipe.parameters.lowPressureTimeBeforeHighPressure}
                  </p>
                </Col>
                <Col span={12}>
                  <p>
                    <strong>高压清洗高压后低压时间（秒）：</strong>
                    {viewingRecipe.parameters.lowPressureTimeAfterHighPressure}
                  </p>
                </Col>
                <Col span={12}>
                  <p>
                    <strong>高压后静置时间（秒）：</strong>
                    {viewingRecipe.parameters.standingTimeAfterHighPressure}
                  </p>
                </Col>
                <Col span={12}>
                  <p>
                    <strong>超声清洗时间（秒）：</strong>
                    {viewingRecipe.parameters.ultrasonicCleaningTime}
                  </p>
                </Col>
                <Col span={12}>
                  <p>
                    <strong>高压2清洗总时间（秒）：</strong>
                    {viewingRecipe.parameters.highPressure2CleaningTotalTime}
                  </p>
                </Col>
                <Col span={12}>
                  <p>
                    <strong>高压2清洗高压前低压时间（秒）：</strong>
                    {
                      viewingRecipe.parameters
                        .lowPressureTimeBeforeHighPressure2
                    }
                  </p>
                </Col>
                <Col span={12}>
                  <p>
                    <strong> 高压2清洗高压后低压时间（秒）：</strong>
                    {viewingRecipe.parameters.lowPressureTimeAfterHighPressure2}
                  </p>
                </Col>
                <Col span={12}>
                  <p>
                    <strong>高压2后静置时间（秒）：</strong>
                    {viewingRecipe.parameters.standingTimeAfterHighPressure2}
                  </p>
                </Col>
                <Col span={12}>
                  <p>
                    <strong>美晶洗净线编号：</strong>
                    {viewingRecipe.parameters.cleaningLineCode === "10"
                      ? "10天然洗净"
                      : "20合成洗净"}
                  </p>
                </Col>
                <Col span={24}>
                  <p>
                    <strong>备注：</strong>
                    {viewingRecipe.parameters.remark || "无"}
                  </p>
                </Col>
              </Row>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default WashingRecipe;

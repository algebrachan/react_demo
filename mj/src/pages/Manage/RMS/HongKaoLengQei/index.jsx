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
  message,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { GeneralCard, MyBreadcrumb } from "../../../../components/CommonCard";
import {
  rms_options,
  create_recipe,
  delete_recipe,
  update_recipe,
  read_all_recipes,
} from "../../../../apis/mjRms.js";

const { Option } = Select;
const { RangePicker } = DatePicker;
const HongKaoLengQeiRecipe = () => {
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [viewingRecipe, setViewingRecipe] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  // 级联下拉数据
  const [options, setOptions] = useState({
    figureCodeOption: [],
    schema: {},
  });
  const [filteredInchOptions, setFilteredInchOptions] = useState([]);
  const [filteredLineOptions, setFilteredLineOptions] = useState([]);
  // 分页
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

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
            RecipeCategory: "烘烤配方",
            RecipeName: "",
            UpdateTime: [],
            UpdateUser: "",
            page: 1,
            limit: 10,
          }),
        ]);
        const data = optRes?.data || optRes || {};
        const figureCodeOption = data.figureCodeOption || [];
        const schema = data.schema || {};
        setOptions({ figureCodeOption, schema });

        const listData = listRes?.data || listRes || [];
        const items = (listData || []).map((it) => {
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
              : it.parameters || {},
          };
        });
        setRecipes(items);
        setFilteredRecipes(items);
        setTotal(listRes?.length);
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

  // 拉取列表（接口）
  const fetchList = async (payload = {}) => {
    setLoading(true);
    try {
      const res = await read_all_recipes(payload);
      const listData = res?.data || res || [];
      const items = (listData || []).map((it) => {
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
            : it.parameters || {},
        };
      });
      setRecipes(items);
      setFilteredRecipes(items);
      setTotal(res.length || 0);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  // 处理搜索（接口）
  const handleSearch = (values) => {
    const payload = {
      RecipeName: values.recipeNumber || "",
      RecipeCategory: "烘烤配方",
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
    fetchList({ page: 1, limit: pageSize, RecipeCategory: "烘烤配方" });
    setPage(1);
  };

  // 添加新配方
  const handleAdd = () => {
    // 置空编辑对象，弹窗表单默认值为空
    setEditingRecipe(null);
    // 清空级联候选，避免历史残留
    setFilteredInchOptions([]);
    setFilteredLineOptions([]);
    setIsModalVisible(true);
    // 重置表单，确保不沿用上次编辑的状态
    form.resetFields();
  };

  // 图号联动
  const onFigureChange = (val) => {
    const item = (options.figureCodeOption || []).find((i) => i.value === val);
    const inch = item?.inch;
    const lineValue = item?.line_value;
    const lineLabel = item?.line_label;
    setFilteredInchOptions(inch ? [{ value: inch, label: inch }] : []);
    setFilteredLineOptions(
      lineValue && lineLabel ? [{ value: lineValue, label: lineLabel }] : []
    );
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
  // 洗净线联动（手动选择时同步基础参数中的美晶洗净线编号）
  const onCleaningLineChange = (val) => {
    form.setFieldsValue({
      parameters: {
        ...(form.getFieldValue("parameters") || {}),
        cleaningLineCode: val,
      },
    });
  };
  // 英寸联动
  const onInchChange = () => {
    const figure = form.getFieldValue("figureCode");
    const item = (options.figureCodeOption || []).find(
      (i) => i.value === figure
    );
    const lineValue = item?.line_value;
    const lineLabel = item?.line_label;
    setFilteredLineOptions(
      lineValue && lineLabel ? [{ value: lineValue, label: lineLabel }] : []
    );
    form.setFieldsValue({
      cleaningLine: lineValue,
      parameters: {
        ...(form.getFieldValue("parameters") || {}),
        diameterInch: form.getFieldValue("inches"),
        cleaningLineCode: lineValue,
      },
    });
  };
  // 编辑配方（联级）
  const handleEdit = (record) => {
    const figure = (options.figureCodeOption || []).find(
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
    setIsModalVisible(true);
    form.resetFields();
    form.setFieldsValue({
      ...record,
      inches: figure?.inch ?? record.inches,
      cleaningLine: figure?.line_value ?? record.cleaningLine,
      parameters: {
        ...(record.parameters || {}),
        diameterInch: figure?.inch ?? record.inches,
        cleaningLineCode: figure?.line_value ?? record.cleaningLine,
      },
    });
  };

  // 查看配方
  const handleView = (record) => {
    setViewingRecipe(record);
    setIsViewModalVisible(true);
  };

  // 删除配方（接口）
  const handleDelete = (id) => {
    Modal.confirm({
      title: "确认删除",
      content: "确定要删除这个配方吗？此操作将同时删除关联的洗净参数。",
      async onOk() {
        try {
          const RecipeId = id;
          await delete_recipe({ RecipeId, RecipeCategory: "烘烤配方" });
          message.success("删除成功");
          const res = await read_all_recipes({
            page: 1,
            limit: 10,
            RecipeCategory: "烘烤配方",
          });
          const listData = res?.data || res || [];
          const items = (listData || []).map((it) => ({
            ...it,
            RecipeId: it.RecipeId ?? it.recipeId ?? it.id,
            id: it.RecipeId ?? it.id,
            recipeNumber: it.RecipeName ?? it.recipeNumber ?? "",
            figureCode: it.FigureCode ?? it.figureCode ?? "",
            version: it.Version ?? it.version ?? "",
            inches: it.Inch ?? it.inches ?? "",
            status: it.Status === 0 || it.status === 0 ? "启用" : "停用",
            cleaningLine: it.Line ?? it.cleaningLine ?? "",
            createdBy: it.CreaUser ?? it.createdBy ?? "",
            creationTime: it.CreateTime ?? it.creationTime ?? "",
            modifiedBy: it.UpdateUser ?? it.modifiedBy ?? "",
            modificationTime: it.UpdateTime ?? it.modificationTime ?? "",
            parameters: Array.isArray(it.params)
              ? normalizeParams(it.params)
              : it.parameters || {},
          }));
          setRecipes(items);
          setFilteredRecipes(items);
        } catch (e) {
          // 已有全局拦截提示
        }
      },
    });
  };

  // 将后端 params 数组转成前端表单所需的 parameters 对象（兼容名称）
  const normalizeParams = (arr = []) => {
    if (!Array.isArray(arr)) return {};
    const obj = {};
    arr.forEach(({ ParamName, ParamValue }) => {
      switch (ParamName) {
        case "研磨上料线扫码":
          obj["scanCode"] = ParamValue;
          obj["研磨上料线扫码"] = ParamValue;
          break;
        case "批号":
          obj["batchNumber"] = ParamValue;
          obj["批号"] = ParamValue;
          break;
        case "自动流向":
          obj["autoFlow"] = ParamValue;
          break;
        case "直径（英寸）":
          obj["diameterInch"] = ParamValue;
          break;
        case "直径（毫米）":
          obj["diameterMm"] = ParamValue;
          break;
        case "高度（毫米）":
          obj["height"] = ParamValue;
          break;
        case "预清洗总时间（秒）":
          obj["preCleaningTotalTime"] = ParamValue;
          break;
        case "预清洗高压前低压时间（秒）":
          obj["preCleaningHighPressureBeforeLowPressureTime"] = ParamValue;
          break;
        case "预清洗高压后低压时间（秒）":
          obj["preCleaningHighPressureAfterLowPressureTime"] = ParamValue;
          break;
        case "酸洗时间（秒）":
          if (obj["picklingTime"] === undefined)
            obj["picklingTime"] = ParamValue;
          break;
        case "高压前预清洗时间（秒）":
          if (obj["preCleaningTimeBeforeHighPressure"] === undefined)
            obj["preCleaningTimeBeforeHighPressure"] = ParamValue;
          break;
        case "高压清洗总时间（秒）":
          obj["highPressureCleaningTotalTime"] = ParamValue;
          break;
        case "高压清洗高压前低压时间（秒）":
          obj["lowPressureTimeBeforeHighPressure"] = ParamValue;
          break;
        case "高压清洗高压后低压时间（秒）":
          obj["lowPressureTimeAfterHighPressure"] = ParamValue;
          break;
        case "高压后静置时间（秒）":
          obj["standingTimeAfterHighPressure"] = ParamValue;
          break;
        case "超声清洗时间（秒）":
          obj["ultrasonicCleaningTime"] = ParamValue;
          break;
        case "高压2清洗总时间（秒）":
          obj["highPressure2CleaningTotalTime"] = ParamValue;
          break;
        case "高压2清洗高压前低压时间（秒）":
          obj["lowPressureTimeBeforeHighPressure2"] = ParamValue;
          break;
        case "高压2清洗高压后低压时间（秒）":
          obj["lowPressureTimeAfterHighPressure2"] = ParamValue;
          break;
        case "高压2后静置时间（秒）":
          obj["standingTimeAfterHighPressure2"] = ParamValue;
          break;
        case "美晶洗净线编号":
          obj["cleaningLineCode"] = ParamValue;
          break;
        case "备注":
          obj["remark"] = ParamValue;
          break;
        case "烘烤时间（秒）":
          obj["bakingTime"] = ParamValue;
          break;
        case "烘烤温度（℃）":
          obj["bakingTemperature"] = ParamValue;
          break;
        case "烘烤2时间（秒）":
          obj["baking2Time"] = ParamValue;
          break;
        case "烘烤2温度（℃）":
          obj["baking2Temperature"] = ParamValue;
          break;
        case "冷却时间（秒）":
          obj["coolingTime"] = ParamValue;
          break;
        case "外喷钡量（毫升）":
          obj["externalBariumSprayVolume"] = ParamValue;
          break;
        case "内喷钡量（毫升）":
          obj["internalBariumSprayVolume"] = ParamValue;
          break;
        case "喷钡温度（℃）":
          obj["sprayBariumTemperature"] = ParamValue;
          break;
        case "喷涂模式":
          obj["sprayMode"] = ParamValue;
          break;
        case "外壁高度（100-300mm）":
          obj["externalSprayHeight"] = ParamValue;
          break;
        case "移动速度（20-100%）":
          obj["sprayMovingSpeed"] = ParamValue;
          break;
        case "轨迹选择":
          obj["trajectorySelection"] = ParamValue;
          break;
        case "外壁圆盘转速（RPM）":
          obj["externalSprayDiscRotationSpeed"] = ParamValue;
          break;
        case "内壁夹具转速（RPM）":
          obj["internalSprayFixtureRotationSpeed"] = ParamValue;
          break;
        default:
          obj[ParamName] = ParamValue;
          break;
      }
    });
    return obj;
  };
  // 构建接口所需 params 结构
  const buildParams = (paramsObj = {}) => {
    const map = {
      autoFlow: "自动流向",
      diameterInch: "直径（英寸）",
      diameterMm: "直径（毫米）",
      height: "高度（毫米）",
      preCleaningTotalTime: "预清洗总时间（秒）",
      preCleaningHighPressureBeforeLowPressureTime:
        "预清洗高压前低压时间（秒）",
      preCleaningHighPressureAfterLowPressureTime: "预清洗高压后低压时间（秒）",
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
      bakingTime: "烘烤时间（秒）",
      bakingTemperature: "烘烤温度（℃）",
      baking2Time: "烘烤2时间（秒）",
      baking2Temperature: "烘烤2温度（℃）",
      coolingTime: "冷却时间（秒）",
      externalBariumSprayVolume: "外喷钡量（毫升）",
      internalBariumSprayVolume: "内喷钡量（毫升）",
      sprayBariumTemperature: "喷钡温度（℃）",
      sprayMode: "喷涂模式",
      externalSprayHeight: "外壁高度（100-300mm）",
      sprayMovingSpeed: "移动速度（20-100%）",
      trajectorySelection: "轨迹选择",
      externalSprayDiscRotationSpeed: "外壁圆盘转速（RPM）",
      internalSprayFixtureRotationSpeed: "内壁夹具转速（RPM）",
    };
    const result = [];
    Object.keys(paramsObj).forEach((key) => {
      const label = map[key] || key;
      const val = paramsObj[key];
      if (key === "scanCode" || key === "研磨上料线扫码") {
        result.push({ ParamName: "研磨上料线扫码", ParamValue: val ?? "" });
      } else if (key === "batchNumber" || key === "批号") {
        result.push({ ParamName: "批号", ParamValue: val ?? "" });
      } else {
        result.push({
          ParamName: label,
          ParamValue: val === null || val === undefined ? "" : String(val),
        });
      }
    });
    return result;
  };
  // 保存配方（新增/编辑）
  const handleSave = async (values) => {
    const figureItem = (options.figureCodeOption || []).find(
      (i) => i.value === values.figureCode
    );
    const currentLineValue = values.cleaningLine;
    // 使用 line_value 直接作为后端的 Line

    const payload = {
      RecipeName: values.recipeNumber,
      FigureCode: values.figureCode,
      Version: values.version,
      Status: values.status === "启用" ? 0 : 1,
      Inch: values.inches,
      Line: currentLineValue,
      RecipeCategory: "烘烤配方",
      params: buildParams(values.parameters || {}),
    };

    try {
      setLoading(true);
      if (editingRecipe && (editingRecipe.RecipeId || editingRecipe.id)) {
        const RecipeId = editingRecipe.RecipeId || editingRecipe.id;
        await update_recipe({ RecipeId, ...payload });
        message.success("更新成功");
      } else {
        await create_recipe(payload);
        message.success("添加成功");
      }
      setIsModalVisible(false);
      setEditingRecipe(null);
      const res = await read_all_recipes({
        page: 1,
        limit: 10,
        RecipeCategory: "烘烤配方",
      });
      const listData = res?.data || res || [];
      const items = (listData || []).map((it) => ({
        ...it,
        RecipeId: it.RecipeId ?? it.recipeId ?? it.id,
        id: it.RecipeId ?? it.id,
        recipeNumber: it.RecipeName ?? it.recipeNumber ?? "",
        figureCode: it.FigureCode ?? it.figureCode ?? "",
        version: it.Version ?? it.version ?? "",
        inches: it.Inch ?? it.inches ?? "",
        status: it.Status === 0 || it.status === 0 ? "启用" : "停用",
        cleaningLine: it.Line ?? it.cleaningLine ?? "",
        createdBy: it.CreaUser ?? it.createdBy ?? "",
        creationTime: it.CreateTime ?? it.creationTime ?? "",
        modifiedBy: it.UpdateUser ?? it.modifiedBy ?? "",
        modificationTime: it.UpdateTime ?? it.modificationTime ?? "",
        parameters: Array.isArray(it.params)
          ? normalizeParams(it.params)
          : it.parameters || {},
      }));
      setRecipes(items);
      setFilteredRecipes(items);
    } catch (e) {
      // 全局拦截已提示
    } finally {
      setLoading(false);
    }
  };

  // 保存参数
  const handleSaveParameters = (values) => {
    if (editingRecipe) {
      setEditingRecipe({
        ...editingRecipe,
        parameters: { ...editingRecipe.parameters, ...values },
      });
    }
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
      title: "烘烤配方编号",
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
            onClick={() => handleDelete(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <MyBreadcrumb items={[window.sys_name, "RMS", "烘烤配方"]} />
      <div style={{ marginTop: 16 }}>
        <GeneralCard name="烘烤配方管理">
          {/* 搜索表单 */}
          <div style={{ padding: 16 }}>
            <Form form={searchForm} layout="vertical" onFinish={handleSearch}>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={8} lg={6} xl={4}>
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
                <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                  <Form.Item label="状态" name="status">
                    <Select placeholder="请选择状态" allowClear>
                      <Option value="启用">启用</Option>
                      <Option value="停用">停用</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                  <Form.Item label="洗净线" name="cleaningLine">
                    <Select placeholder="请选择洗净线" allowClear>
                      <Option value="10">天然线</Option>
                      <Option value="20">合成线</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                  <Form.Item label="制定人" name="createdBy">
                    <Input placeholder="请输入制定人" allowClear />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                  <Form.Item label="修改人" name="modifiedBy">
                    <Input placeholder="请输入修改人" allowClear />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={12} xl={8}>
                  <Form.Item label="制定时间" name="creationTime">
                    <RangePicker
                      style={{ width: "100%" }}
                      placeholder={["开始时间", "结束时间"]}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={12} xl={8}>
                  <Form.Item label=".">
                    <Space>
                      <Button
                        type="primary"
                        htmlType="submit"
                        icon={<SearchOutlined />}
                      >
                        查询
                      </Button>
                      <Button icon={<ReloadOutlined />} onClick={handleReset}>
                        重置
                      </Button>
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
                  </Form.Item>
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
              rowKey={(r) => r.RecipeId || r.id}
              loading={loading}
              scroll={{ x: "max-content" }}
              pagination={{
                total: total,
                current: page,
                pageSize: pageSize,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (t, range) =>
                  `显示 ${range[0]}-${range[1]} 条记录，共 ${t} 条`,
                pageSizeOptions: ["10", "20", "50", "100"],
              }}
              onChange={(pagination) => {
                const { current, pageSize: ps } = pagination;
                setPage(current);
                setPageSize(ps);
                const values = searchForm.getFieldsValue();
                const payload = {
                  RecipeName: values.recipeNumber || "",
                  RecipeCategory: "烘烤配方",
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
          title={editingRecipe?.RecipeId ? "编辑配方" : "新增配方"}
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
          width={900}
          style={{ top: 20 }}
        >
          <Form
            form={form}
            layout="vertical"
            initialValues={editingRecipe || {}}
            onFinish={handleSave}
            style={{ marginTop: 20 }}
          >
            {/* 基本信息 */}
            <Card
              title="基本信息"
              size="small"
              style={{ marginBottom: "16px" }}
            >
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item label="烘烤配方编号" name="recipeNumber">
                    <Input disabled placeholder="请输入烘烤配方编号" />
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
                  <Form.Item label="英寸" name="inches">
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
                      onChange={onCleaningLineChange}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            {/* 基础参数 */}
            <Card
              title="基础参数"
              size="small"
              style={{ marginBottom: "16px" }}
            >
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item
                    label="研磨上料线扫码"
                    name={["parameters", "scanCode"]}
                  >
                    <Input
                      disabled
                      placeholder="十位对应桁架，个位对应线体位置"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="批号" name={["parameters", "batchNumber"]}>
                    <Input disabled placeholder="请输入批号" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="自动流向"
                    name={["parameters", "autoFlow"]}
                    rules={[{ required: true, message: "请输入自动流向" }]}
                  >
                    <Input disabled placeholder="请输入自动流向" />
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
                <Col span={8}>
                  <Form.Item
                    label="直径（英寸）"
                    name={["parameters", "diameterInch"]}
                    rules={[{ required: true, message: "请输入直径（英寸）" }]}
                  >
                    <Input placeholder="请输入直径（英寸）" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="直径（毫米）"
                    name={["parameters", "diameterMm"]}
                    rules={[{ required: true, message: "请输入直径（毫米）" }]}
                  >
                    <Input placeholder="请输入直径（毫米）" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="高度（毫米）"
                    name={["parameters", "height"]}
                    rules={[{ required: true, message: "请输入高度（毫米）" }]}
                  >
                    <Input placeholder="请输入高度（毫米）" />
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            {/* 烘烤参数 */}
            <Card
              title="烘烤参数"
              size="small"
              style={{ marginBottom: "16px" }}
            >
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item
                    label="烘烤时间（秒）"
                    name={["parameters", "bakingTime"]}
                    rules={[{ required: true, message: "请输入烘烤时间" }]}
                  >
                    <InputNumber
                      min={0}
                      style={{ width: "100%" }}
                      placeholder="请输入烘烤时间"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="烘烤温度（℃）"
                    name={["parameters", "bakingTemperature"]}
                    rules={[{ required: true, message: "请输入烘烤温度" }]}
                  >
                    <InputNumber
                      min={0}
                      style={{ width: "100%" }}
                      placeholder="请输入烘烤温度"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="烘烤2时间（秒）"
                    name={["parameters", "baking2Time"]}
                    rules={[{ required: true, message: "请输入烘烤2时间" }]}
                  >
                    <InputNumber
                      min={0}
                      style={{ width: "100%" }}
                      placeholder="请输入烘烤2时间"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="烘烤2温度（℃）"
                    name={["parameters", "baking2Temperature"]}
                    rules={[{ required: true, message: "请输入烘烤2温度" }]}
                  >
                    <InputNumber
                      min={0}
                      style={{ width: "100%" }}
                      placeholder="请输入烘烤2温度"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="冷却时间（秒）"
                    name={["parameters", "coolingTime"]}
                    rules={[{ required: true, message: "请输入冷却时间" }]}
                  >
                    <InputNumber
                      min={0}
                      style={{ width: "100%" }}
                      placeholder="请输入冷却时间"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            {/* 喷涂参数 */}
            <Card
              title="喷涂参数"
              size="small"
              style={{ marginBottom: "16px" }}
            >
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item
                    label="外喷钡量（毫升）"
                    name={["parameters", "externalBariumSprayVolume"]}
                    rules={[{ required: true, message: "请输入外喷钡量" }]}
                  >
                    <InputNumber
                      min={0}
                      style={{ width: "100%" }}
                      placeholder="请输入外喷钡量"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="内喷钡量（毫升）"
                    name={["parameters", "internalBariumSprayVolume"]}
                    rules={[{ required: true, message: "请输入内喷钡量" }]}
                  >
                    <InputNumber
                      min={0}
                      style={{ width: "100%" }}
                      placeholder="请输入内喷钡量"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="喷钡温度（℃）"
                    name={["parameters", "sprayBariumTemperature"]}
                    rules={[{ required: true, message: "请输入喷钡温度" }]}
                  >
                    <InputNumber
                      min={0}
                      style={{ width: "100%" }}
                      placeholder="请输入喷钡温度"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="喷涂模式"
                    name={["parameters", "sprayMode"]}
                    rules={[{ required: true, message: "请输入喷涂模式" }]}
                  >
                    <Input
                      style={{ width: "100%" }}
                      placeholder="请输入喷涂模式"
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="外壁高度（100-300mm）"
                    name={["parameters", "externalSprayHeight"]}
                    rules={[{ required: true, message: "请输入喷钡外壁高度" }]}
                  >
                    <InputNumber
                      min={100}
                      max={300}
                      style={{ width: "100%" }}
                      placeholder="100-300"
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="移动速度（20-100%）"
                    name={["parameters", "sprayMovingSpeed"]}
                    rules={[{ required: true, message: "请输入喷钡移动速度" }]}
                  >
                    <InputNumber
                      min={20}
                      max={100}
                      style={{ width: "100%" }}
                      placeholder="20-100"
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="轨迹选择"
                    name={["parameters", "trajectorySelection"]}
                    rules={[{ required: true, message: "请输入轨迹选择" }]}
                  >
                    <Input
                      style={{ width: "100%" }}
                      placeholder="请输入轨迹选择"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="外壁圆盘转速（RPM）"
                    name={["parameters", "externalSprayDiscRotationSpeed"]}
                    rules={[
                      { required: true, message: "请输入喷外壁圆盘转速" },
                    ]}
                  >
                    <InputNumber
                      min={0}
                      style={{ width: "100%" }}
                      placeholder="请输入转速"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="内壁夹具转速（RPM）"
                    name={["parameters", "internalSprayFixtureRotationSpeed"]}
                    rules={[
                      { required: true, message: "请输入喷内壁夹具转速" },
                    ]}
                  >
                    <InputNumber
                      min={0}
                      style={{ width: "100%" }}
                      placeholder="请输入转速"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            {/* 备注 */}
            <Card title="备注信息" size="small">
              <Form.Item label="备注" name={["parameters", "remark"]}>
                <Input.TextArea
                  rows={3}
                  placeholder="请输入备注信息"
                  showCount
                  maxLength={200}
                />
              </Form.Item>
            </Card>

            <div
              style={{
                textAlign: "right",
                marginTop: 24,
                paddingTop: 16,
                borderTop: "1px solid #f0f0f0",
              }}
            >
              <Space>
                <Button onClick={() => setIsModalVisible(false)}>取消</Button>
                <Button type="primary" htmlType="submit">
                  保存
                </Button>
              </Space>
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
          width={900}
          style={{ top: 20 }}
        >
          {viewingRecipe && (
            <div style={{ marginTop: 20 }}>
              {/* 基本信息 */}
              <Card
                title="基本信息"
                size="small"
                style={{ marginBottom: "16px" }}
              >
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <div
                      style={{
                        padding: "8px 0",
                        borderBottom: "1px solid #f0f0f0",
                      }}
                    >
                      <span style={{ color: "#666", marginRight: "8px" }}>
                        烘烤配方编号：
                      </span>
                      <span style={{ fontWeight: 500 }}>
                        {viewingRecipe.recipeNumber}
                      </span>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div
                      style={{
                        padding: "8px 0",
                        borderBottom: "1px solid #f0f0f0",
                      }}
                    >
                      <span style={{ color: "#666", marginRight: "8px" }}>
                        图号：
                      </span>
                      <span style={{ fontWeight: 500 }}>
                        {viewingRecipe.figureCode}
                      </span>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div
                      style={{
                        padding: "8px 0",
                        borderBottom: "1px solid #f0f0f0",
                      }}
                    >
                      <span style={{ color: "#666", marginRight: "8px" }}>
                        版本：
                      </span>
                      <span style={{ fontWeight: 500 }}>
                        {viewingRecipe.version}
                      </span>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div
                      style={{
                        padding: "8px 0",
                        borderBottom: "1px solid #f0f0f0",
                      }}
                    >
                      <span style={{ color: "#666", marginRight: "8px" }}>
                        英寸：
                      </span>
                      <span style={{ fontWeight: 500 }}>
                        {viewingRecipe.inches}
                      </span>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div
                      style={{
                        padding: "8px 0",
                        borderBottom: "1px solid #f0f0f0",
                      }}
                    >
                      <span style={{ color: "#666", marginRight: "8px" }}>
                        状态：
                      </span>
                      <span
                        style={{
                          fontWeight: 500,
                          color:
                            viewingRecipe.status === "启用"
                              ? "#52c41a"
                              : "#ff4d4f",
                        }}
                      >
                        {viewingRecipe.status}
                      </span>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div
                      style={{
                        padding: "8px 0",
                        borderBottom: "1px solid #f0f0f0",
                      }}
                    >
                      <span style={{ color: "#666", marginRight: "8px" }}>
                        洗净线：
                      </span>
                      <span style={{ fontWeight: 500 }}>
                        {viewingRecipe.cleaningLine}
                      </span>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div
                      style={{
                        padding: "8px 0",
                        borderBottom: "1px solid #f0f0f0",
                      }}
                    >
                      <span style={{ color: "#666", marginRight: "8px" }}>
                        制定人：
                      </span>
                      <span style={{ fontWeight: 500 }}>
                        {viewingRecipe.createdBy}
                      </span>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div
                      style={{
                        padding: "8px 0",
                        borderBottom: "1px solid #f0f0f0",
                      }}
                    >
                      <span style={{ color: "#666", marginRight: "8px" }}>
                        制定时间：
                      </span>
                      <span style={{ fontWeight: 500 }}>
                        {viewingRecipe.creationTime}
                      </span>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div
                      style={{
                        padding: "8px 0",
                        borderBottom: "1px solid #f0f0f0",
                      }}
                    >
                      <span style={{ color: "#666", marginRight: "8px" }}>
                        修改人：
                      </span>
                      <span style={{ fontWeight: 500 }}>
                        {viewingRecipe.modifiedBy}
                      </span>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div
                      style={{
                        padding: "8px 0",
                        borderBottom: "1px solid #f0f0f0",
                      }}
                    >
                      <span style={{ color: "#666", marginRight: "8px" }}>
                        修改时间：
                      </span>
                      <span style={{ fontWeight: 500 }}>
                        {viewingRecipe.modificationTime}
                      </span>
                    </div>
                  </Col>
                </Row>
              </Card>

              {/* 基础参数 */}
              <Card
                title="基础参数"
                size="small"
                style={{ marginBottom: "16px" }}
              >
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <div
                      style={{
                        padding: "8px 0",
                        borderBottom: "1px solid #f0f0f0",
                      }}
                    >
                      <span style={{ color: "#666", marginRight: "8px" }}>
                        研磨上料线扫码：
                      </span>
                      <span style={{ fontWeight: 500 }}>
                        {viewingRecipe.parameters.scanCode}
                      </span>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div
                      style={{
                        padding: "8px 0",
                        borderBottom: "1px solid #f0f0f0",
                      }}
                    >
                      <span style={{ color: "#666", marginRight: "8px" }}>
                        批号：
                      </span>
                      <span style={{ fontWeight: 500 }}>
                        {viewingRecipe.parameters.batchNumber}
                      </span>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div
                      style={{
                        padding: "8px 0",
                        borderBottom: "1px solid #f0f0f0",
                      }}
                    >
                      <span style={{ color: "#666", marginRight: "8px" }}>
                        自动流向：
                      </span>
                      <span
                        style={{
                          fontWeight: 500,
                          color:
                            viewingRecipe.parameters.autoFlow === 1
                              ? "#52c41a"
                              : "#ff4d4f",
                        }}
                      >
                        {viewingRecipe.parameters.autoFlow === 0
                          ? "不喷涂"
                          : "喷涂"}
                      </span>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div
                      style={{
                        padding: "8px 0",
                        borderBottom: "1px solid #f0f0f0",
                      }}
                    >
                      <span style={{ color: "#666", marginRight: "8px" }}>
                        美晶洗净线编号：
                      </span>
                      <span style={{ fontWeight: 500 }}>
                        {viewingRecipe.parameters.cleaningLineCode === "10"
                          ? "10天然洗净"
                          : "20合成洗净"}
                      </span>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div
                      style={{
                        padding: "8px 0",
                        borderBottom: "1px solid #f0f0f0",
                      }}
                    >
                      <span style={{ color: "#666", marginRight: "8px" }}>
                        直径（英寸）：
                      </span>
                      <span style={{ fontWeight: 500 }}>
                        {viewingRecipe.parameters.diameterInch}
                      </span>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div
                      style={{
                        padding: "8px 0",
                        borderBottom: "1px solid #f0f0f0",
                      }}
                    >
                      <span style={{ color: "#666", marginRight: "8px" }}>
                        直径（毫米）：
                      </span>
                      <span style={{ fontWeight: 500 }}>
                        {viewingRecipe.parameters.diameterMm}
                      </span>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div
                      style={{
                        padding: "8px 0",
                        borderBottom: "1px solid #f0f0f0",
                      }}
                    >
                      <span style={{ color: "#666", marginRight: "8px" }}>
                        高度（毫米）：
                      </span>
                      <span style={{ fontWeight: 500 }}>
                        {viewingRecipe.parameters.height}
                      </span>
                    </div>
                  </Col>
                </Row>
              </Card>

              {/* 烘烤参数 */}
              <Card
                title="烘烤参数"
                size="small"
                style={{ marginBottom: "16px" }}
              >
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <div
                      style={{
                        padding: "8px 0",
                        borderBottom: "1px solid #f0f0f0",
                      }}
                    >
                      <span style={{ color: "#666", marginRight: "8px" }}>
                        烘烤时间（秒）：
                      </span>
                      <span style={{ fontWeight: 500 }}>
                        {viewingRecipe.parameters.bakingTime}
                      </span>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div
                      style={{
                        padding: "8px 0",
                        borderBottom: "1px solid #f0f0f0",
                      }}
                    >
                      <span style={{ color: "#666", marginRight: "8px" }}>
                        烘烤温度（℃）：
                      </span>
                      <span style={{ fontWeight: 500 }}>
                        {viewingRecipe.parameters.bakingTemperature}
                      </span>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div
                      style={{
                        padding: "8px 0",
                        borderBottom: "1px solid #f0f0f0",
                      }}
                    >
                      <span style={{ color: "#666", marginRight: "8px" }}>
                        烘烤2时间（秒）：
                      </span>
                      <span style={{ fontWeight: 500 }}>
                        {viewingRecipe.parameters.baking2Time}
                      </span>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div
                      style={{
                        padding: "8px 0",
                        borderBottom: "1px solid #f0f0f0",
                      }}
                    >
                      <span style={{ color: "#666", marginRight: "8px" }}>
                        烘烤2温度（℃）：
                      </span>
                      <span style={{ fontWeight: 500 }}>
                        {viewingRecipe.parameters.baking2Temperature}
                      </span>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div
                      style={{
                        padding: "8px 0",
                        borderBottom: "1px solid #f0f0f0",
                      }}
                    >
                      <span style={{ color: "#666", marginRight: "8px" }}>
                        冷却时间（秒）：
                      </span>
                      <span style={{ fontWeight: 500 }}>
                        {viewingRecipe.parameters.coolingTime}
                      </span>
                    </div>
                  </Col>
                </Row>
              </Card>

              {/* 喷涂参数 */}
              <Card
                title="喷涂参数"
                size="small"
                style={{ marginBottom: "16px" }}
              >
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <div
                      style={{
                        padding: "8px 0",
                        borderBottom: "1px solid #f0f0f0",
                      }}
                    >
                      <span style={{ color: "#666", marginRight: "8px" }}>
                        外喷钡量（毫升）：
                      </span>
                      <span style={{ fontWeight: 500 }}>
                        {viewingRecipe.parameters.externalBariumSprayVolume}
                      </span>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div
                      style={{
                        padding: "8px 0",
                        borderBottom: "1px solid #f0f0f0",
                      }}
                    >
                      <span style={{ color: "#666", marginRight: "8px" }}>
                        内喷钡量（毫升）：
                      </span>
                      <span style={{ fontWeight: 500 }}>
                        {viewingRecipe.parameters.internalBariumSprayVolume}
                      </span>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div
                      style={{
                        padding: "8px 0",
                        borderBottom: "1px solid #f0f0f0",
                      }}
                    >
                      <span style={{ color: "#666", marginRight: "8px" }}>
                        喷钡温度（℃）：
                      </span>
                      <span style={{ fontWeight: 500 }}>
                        {viewingRecipe.parameters.sprayBariumTemperature}
                      </span>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div
                      style={{
                        padding: "8px 0",
                        borderBottom: "1px solid #f0f0f0",
                      }}
                    >
                      <span style={{ color: "#666", marginRight: "8px" }}>
                        喷涂模式：
                      </span>
                      <span style={{ fontWeight: 500 }}>
                        {viewingRecipe.parameters.sprayMode}
                      </span>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div
                      style={{
                        padding: "8px 0",
                        borderBottom: "1px solid #f0f0f0",
                      }}
                    >
                      <span style={{ color: "#666", marginRight: "8px" }}>
                        外壁高度（mm）：
                      </span>
                      <span style={{ fontWeight: 500 }}>
                        {viewingRecipe.parameters.externalSprayHeight}
                      </span>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div
                      style={{
                        padding: "8px 0",
                        borderBottom: "1px solid #f0f0f0",
                      }}
                    >
                      <span style={{ color: "#666", marginRight: "8px" }}>
                        移动速度（%）：
                      </span>
                      <span style={{ fontWeight: 500 }}>
                        {viewingRecipe.parameters.sprayMovingSpeed}
                      </span>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div
                      style={{
                        padding: "8px 0",
                        borderBottom: "1px solid #f0f0f0",
                      }}
                    >
                      <span style={{ color: "#666", marginRight: "8px" }}>
                        轨迹选择：
                      </span>
                      <span style={{ fontWeight: 500 }}>
                        {viewingRecipe.parameters.trajectorySelection}
                      </span>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div
                      style={{
                        padding: "8px 0",
                        borderBottom: "1px solid #f0f0f0",
                      }}
                    >
                      <span style={{ color: "#666", marginRight: "8px" }}>
                        外壁圆盘转速（RPM）：
                      </span>
                      <span style={{ fontWeight: 500 }}>
                        {
                          viewingRecipe.parameters
                            .externalSprayDiscRotationSpeed
                        }
                      </span>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div
                      style={{
                        padding: "8px 0",
                        borderBottom: "1px solid #f0f0f0",
                      }}
                    >
                      <span style={{ color: "#666", marginRight: "8px" }}>
                        内壁夹具转速（RPM）：
                      </span>
                      <span style={{ fontWeight: 500 }}>
                        {
                          viewingRecipe.parameters
                            .internalSprayFixtureRotationSpeed
                        }
                      </span>
                    </div>
                  </Col>
                </Row>
              </Card>

              {/* 备注信息 */}
              <Card title="备注信息" size="small">
                <div
                  style={{
                    padding: "12px",
                    backgroundColor: "#fafafa",
                    borderRadius: "6px",
                    minHeight: "60px",
                  }}
                >
                  <span style={{ color: "#666" }}>
                    {viewingRecipe.parameters.remark || "暂无备注信息"}
                  </span>
                </div>
              </Card>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default HongKaoLengQeiRecipe;

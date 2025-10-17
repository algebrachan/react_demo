import React, { useEffect, useMemo, useState } from "react";
import {
  Table,
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  Space,
  Modal,
  Row,
  Col,
  Divider,
  message,
  Typography,
  Card,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { GeneralCard, MyBreadcrumb } from "../../../../components/CommonCard";
import {
  rms_options,
  delete_recipe,
  read_all_recipes,
} from "../../../../apis/mjRms.js";

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Title } = Typography;

const sandKeys = [
  "ZS砂",
  "外层",
  "中外层",
  "中内层",
  "内层粗粉",
  "内层细粉(W成型机)",
  "内层细粉(B扬砂)",
  "半自动砂",
];

function buildMatrixFromRecord(record = {}) {
  // 将后端 matrix 结构放回到可展示（只读查看）的对象，直接透传
  return record.matrix || {};
}

function normalizeParamsToObj(paramsArr = []) {
  // 将 [{ParamName, ParamValue}] 转成对象，键为 ParamName
  const obj = {};
  if (Array.isArray(paramsArr)) {
    paramsArr.forEach(({ ParamName, ParamValue }) => {
      obj[ParamName] = ParamValue;
    });
  }
  return obj;
}

const QuartzSandRecipeList = () => {
  const navigate = useNavigate();
  const [searchForm] = Form.useForm();
  const [data, setData] = useState([]);
  const [options, setOptions] = useState({
    figureCodeOption: [],
    materialFormulaOptions: [],
    transparentSandOptions: [],
    schema: {},
  });
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const [viewing, setViewing] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);

  // 初始化：获取下拉 + 列表
  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        const [optRes, listRes] = await Promise.all([
          rms_options(),
          read_all_recipes({
            RecipeCategory: "石英砂配方",
            CreaUser: "",
            CreateTime: [],
            FigureCode: "",
            Line: "",
            RecipeName: "",
            UpdateTime: [],
            UpdateUser: "",
            page: 1,
            limit: 10,
          }),
        ]);

        const opt = optRes?.data || optRes || {};
        setOptions({
          figureCodeOption: opt.figureCodeOption || [],
          materialFormulaOptions: opt.materialFormulaOptions || [],
          transparentSandOptions:
            opt.transparentSandOptions || opt.sandOptions || [],
          schema: opt.schema || {},
        });

        const list = listRes?.data || listRes || [];
        const mapped = (list || []).map((it) => ({
          ...it,
          RecipeId: it.RecipeId ?? it.recipeId ?? it.id,
          id: it.RecipeId ?? it.id,
          recipeNumber: it.RecipeName ?? it.recipeNumber ?? "",
          figureCode: it.FigureCode ?? it.figureCode ?? "",
          version: it.Version ?? it.version ?? "",
          inches: it.Inch ?? it.inches ?? "",
          status: it.Status === 0 || it.status === 0 ? "启用" : "停用",
          line: it.Line ?? it.line ?? "",
          createdBy: it.CreaUser ?? it.createdBy ?? "",
          creationTime: it.CreateTime ?? it.creationTime ?? "",
          modifiedBy: it.UpdateUser ?? it.modifiedBy ?? "",
          modificationTime: it.UpdateTime ?? it.modificationTime ?? "",
          matrix: buildMatrixFromRecord(it),
          layerParams: normalizeParamsToObj(it.params || []),
        }));
        setData(mapped);
        setTotal(Array.isArray(list) ? list.length : 0);
        setPage(1);
        setPageSize(10);
      } catch (e) {
        // 全局拦截提示
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const fetchList = async (payload) => {
    setLoading(true);
    try {
      const res = await read_all_recipes(payload);
      const list = res?.data || res || [];
      const mapped = (list || []).map((it) => ({
        ...it,
        RecipeId: it.RecipeId ?? it.recipeId ?? it.id,
        id: it.RecipeId ?? it.id,
        recipeNumber: it.RecipeName ?? it.recipeNumber ?? "",
        figureCode: it.FigureCode ?? it.figureCode ?? "",
        version: it.Version ?? it.version ?? "",
        inches: it.Inch ?? it.inches ?? "",
        status: it.Status === 0 || it.status === 0 ? "启用" : "停用",
        line: it.Line ?? it.line ?? "",
        createdBy: it.CreaUser ?? it.createdBy ?? "",
        creationTime: it.CreateTime ?? it.creationTime ?? "",
        modifiedBy: it.UpdateUser ?? it.modifiedBy ?? "",
        modificationTime: it.UpdateTime ?? it.modificationTime ?? "",
        matrix: buildMatrixFromRecord(it),
        layerParams: normalizeParamsToObj(it.params || []),
      }));
      setData(mapped);
      setTotal(Array.isArray(list) ? list.length : 0);
    } finally {
      setLoading(false);
    }
  };

  const onSearch = (values) => {
    const payload = {
      RecipeCategory: "石英砂配方",
      RecipeName: values.recipeNumber || "",
      CreaUser: values.createdBy || "",
      CreateTime:
        values.creationTime && values.creationTime.length === 2
          ? [
              values.creationTime[0].format("YYYY-MM-DD HH:mm:ss"),
              values.creationTime[1].format("YYYY-MM-DD HH:mm:ss"),
            ]
          : [],
      FigureCode: values.figureCode || "",
      Line: values.line || "",
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

  const onReset = () => {
    searchForm.resetFields();
    fetchList({
      RecipeCategory: "石英砂配方",
      CreaUser: "",
      CreateTime: [],
      FigureCode: "",
      Line: "",
      RecipeName: "",
      UpdateTime: [],
      UpdateUser: "",
      page: 1,
      limit: pageSize,
    });
    setPage(1);
  };

  const onAdd = () => {
    navigate("/mng/rms/crucible/quartz_sand_recipe_management/add");
  };

  const onEdit = (record) => {
    navigate(
      `/mng/rms/crucible/quartz_sand_recipe_management/edit/${
        record.RecipeId || record.id
      }`
    );
  };

  const onDelete = (record) => {
    Modal.confirm({
      title: "确认删除",
      content: "确定要删除该石英砂配方吗？",
      async onOk() {
        try {
          await delete_recipe({
            RecipeId: record.RecipeId || record.id,
            RecipeCategory: "石英砂配方",
          });
          message.success("删除成功");
          const values = searchForm.getFieldsValue();
          onSearch(values);
        } catch (e) {
          // 全局拦截已提示
        }
      },
    });
  };

  const columns = useMemo(
    () => [
      {
        title: "序号",
        key: "index",
        width: 60,
        render: (t, r, i) => i + 1,
      },
      {
        title: "石英砂配方编号",
        dataIndex: "recipeNumber",
        key: "recipeNumber",
        width: 140,
      },
      {
        title: "图号",
        dataIndex: "figureCode",
        key: "figureCode",
        width: 120,
      },
      {
        title: "版本",
        dataIndex: "version",
        key: "version",
        width: 60,
      },
      {
        title: "英寸",
        dataIndex: "inches",
        key: "inches",
        width: 80,
      },
      {
        title: "线体",
        dataIndex: "line",
        key: "line",
        width: 100,
        render: (text) =>
          text === "10" ? "天然线" : text === "20" ? "合成线" : text,
      },
      {
        title: "状态",
        dataIndex: "status",
        key: "status",
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
        width: 160,
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
        width: 160,
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
              onClick={() => {
                setViewing(record);
                setViewOpen(true);
              }}
            >
              查看
            </Button>
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
            >
              编辑
            </Button>
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              onClick={() => onDelete(record)}
            >
              删除
            </Button>
          </Space>
        ),
      },
    ],
    []
  );

  return (
    <div>
      <MyBreadcrumb items={[window.sys_name, "RMS", "石英砂配方管理"]} />
      <div style={{ marginTop: 16 }}>
        <GeneralCard name="石英砂配方管理">
          <div style={{ padding: 16 }}>
            <Form form={searchForm} layout="vertical" onFinish={onSearch}>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item label="图号" name="figureCode">
                    <Select
                      placeholder="请选择图号"
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
                  <Form.Item label="线体" name="line">
                    <Select placeholder="请选择线体" allowClear>
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
                <Col xs={24} sm={12} md={8} lg={6}>
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
                <Form.Item>
                  <Col xs={24} sm={12} md={8} lg={6}>
                    <Space style={{ marginTop: 30 }}>
                      <Button
                        type="primary"
                        htmlType="submit"
                        icon={<SearchOutlined />}
                      >
                        搜索
                      </Button>
                      <Button onClick={onReset}>重置</Button>
                      <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={onAdd}
                        style={{
                          background: "#52c41a",
                          borderColor: "#52c41a",
                        }}
                      >
                        新增配方
                      </Button>
                    </Space>
                  </Col>
                </Form.Item>
              </Row>
            </Form>
          </div>
          <Card>
            <Table
              size="small"
              bordered
              columns={columns}
              dataSource={data}
              rowKey={(r) => r.RecipeId || r.id || r.recipeNumber}
              loading={loading}
              scroll={{ x: "max-content" }}
              pagination={{
                total,
                current: page,
                pageSize,
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
                  RecipeCategory: "石英砂配方",
                  RecipeName: values.recipeNumber || "",
                  CreaUser: values.createdBy || "",
                  CreateTime:
                    values.creationTime && values.creationTime.length === 2
                      ? [
                          values.creationTime[0].format("YYYY-MM-DD HH:mm:ss"),
                          values.creationTime[1].format("YYYY-MM-DD HH:mm:ss"),
                        ]
                      : [],
                  FigureCode: values.figureCode || "",
                  Line: values.line || "",
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
      </div>

      <Modal
        title="查看石英砂配方"
        open={viewOpen}
        onCancel={() => setViewOpen(false)}
        footer={<Button onClick={() => setViewOpen(false)}>关闭</Button>}
        width={900}
      >
        {viewing && (
          <div style={{ marginTop: 8 }}>
            <Title level={4}>基本信息</Title>
            <Row gutter={16}>
              <Col span={12}>
                <p>
                  <strong>编号：</strong>
                  {viewing.recipeNumber}
                </p>
              </Col>
              <Col span={12}>
                <p>
                  <strong>图号：</strong>
                  {viewing.figureCode}
                </p>
              </Col>
              <Col span={12}>
                <p>
                  <strong>版本：</strong>
                  {viewing.version}
                </p>
              </Col>
              <Col span={12}>
                <p>
                  <strong>英寸：</strong>
                  {viewing.inches}
                </p>
              </Col>
              <Col span={12}>
                <p>
                  <strong>线体：</strong>
                  {viewing.line}
                </p>
              </Col>
              <Col span={12}>
                <p>
                  <strong>状态：</strong>
                  {viewing.status}
                </p>
              </Col>
              <Col span={12}>
                <p>
                  <strong>制定人：</strong>
                  {viewing.createdBy}
                </p>
              </Col>
              <Col span={12}>
                <p>
                  <strong>制定时间：</strong>
                  {viewing.creationTime}
                </p>
              </Col>
              <Col span={12}>
                <p>
                  <strong>修改人：</strong>
                  {viewing.modifiedBy}
                </p>
              </Col>
              <Col span={12}>
                <p>
                  <strong>修改时间：</strong>
                  {viewing.modificationTime}
                </p>
              </Col>
            </Row>

            <Divider />
            <Title level={4}>成型机参数</Title>
            <Row gutter={16}>
              {Object.keys(viewing.layerParams || {}).map((k) => (
                <Col span={12} key={k}>
                  <p>
                    <strong>{k}：</strong>
                    {viewing.layerParams[k]}
                  </p>
                </Col>
              ))}
            </Row>

            <Divider />
            <Title level={4}>石英砂参数（matrix）</Title>
            <Row gutter={16}>
              {sandKeys.map((k) => (
                <Col span={12} key={k}>
                  <Card size="small" title={k} style={{ marginBottom: 8 }}>
                    <p>
                      <strong>位置：</strong>
                      {viewing.matrix?.[k]?.["位置"] ?? ""}
                    </p>
                    <p>
                      <strong>料仓：</strong>
                      {viewing.matrix?.[k]?.["料仓"] ?? ""}
                    </p>
                    <p>
                      <strong>物料编码：</strong>
                      {viewing.matrix?.[k]?.["物料编码"] ?? ""}
                    </p>
                    <p>
                      <strong>图号：</strong>
                      {viewing.matrix?.[k]?.["图号"] ?? ""}
                    </p>
                    <p>
                      <strong>物料名称：</strong>
                      {viewing.matrix?.[k]?.["物料名称"] ?? ""}
                    </p>
                    <p>
                      <strong>耗用量：</strong>
                      {viewing.matrix?.[k]?.["耗用量"] ?? ""}
                    </p>
                    <p>
                      <strong>单位：</strong>
                      {viewing.matrix?.[k]?.["单位"] ?? ""}
                    </p>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default QuartzSandRecipeList;

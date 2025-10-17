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
  Table,
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
  UploadOutlined,
} from "@ant-design/icons";
import { ComputeFormCol, GenerateFormItem } from "../../../../utils/obj";
import ReactECharts from "echarts-for-react";
import {
  rmsGetManufacturingRecipeParams,
  rmsGetRecipeList,
  rmsImportRecipeParams,
  rmsSaveManufacturingConditionRecipe,
} from "../../../../apis/data_api";
const MemoizedChart = React.memo(ReactECharts);
const { Title } = Typography;

function ConditionEditPage() {
  const [page, setPage] = useState("新增"); // 新增，编辑，查看
  const [load, setLoad] = useState(false);
  const [recipe, setRecipe] = useState({});

  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [form_param] = Form.useForm();
  const [id, setId] = useState("");
  const { state = {} } = useLocation();
  const query = () => {
    setLoad(true);
    rmsGetManufacturingRecipeParams(
      { id },
      (res) => {
        setLoad(false);
        const { code, data, msg } = res.data;
        if (code === 0) {
          message.success("查询成功");
          const { 基础信息 = {}, ...rest } = data;
          form.setFieldsValue(基础信息);
          form_param.setFieldsValue(rest);
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
    const values2 = await form_param
      .validateFields()
      .then((res) => res)
      .catch((err) => {
        const { errorFields } = err;
        let err_list = errorFields.map((e) => e.errors);
        message.warning(err_list.join("\n"));
        return false;
      });
    if (!values2) return;

    const param = {
      基础信息: values1,
      ...default_param_form_data,
      ...values2,
    };
    setLoad(true);
    if (page === "编辑") {
      param["id"] = id;
    }
    rmsSaveManufacturingConditionRecipe(
      param,
      (res) => {
        setLoad(false);
        const { code, msg, data } = res.data;
        if (code === 0) {
          message.success("保存成功");
          navigate("/mng/rms/condition_table");
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
    制造条件参数: {
      "电极-位置": 0,
      "电极-物料编码": "",
      "电极-图号": "",
      电极类别: "",
      电极规格: "",
      "电极-耗用量": 0,
      "电极-单位": "",
      内层成型棒: "",
      中层成型棒: "",
      外层成型棒: "",
      成型板: "",
      "起弧位置-水套下方": "",
      最大电极开度: "",
      "内层成型棒-顶针高度": 0,
      "中层成型棒-顶针高度": 0,
      "外层成型棒-顶针高度": 0,
      水冷模具: "",
      钢模内胆: "",
      水冷板: "",
      水冷板直径: 0,
      "水冷板-模具距离1": 0,
      "水冷板-模具距离2": 0,
      "水冷板-模具距离3": 0,
      "水冷板-模具距离4": 0,
      注意事项: "",
      修改履历: "",
      英寸: 0,
      直径: 0,
      模具内高度: 0,
      模具外高度: 0,
    },
    石英砂参数: {
      透明层砂Code: "",
      ZS砂: {
        位置: "",
        料仓: "",
        物料编码: "",
        图号: "",
        物料名称: "",
        耗用量: 0,
        单位: "kg",
      },
      外层: {
        位置: "",
        料仓: "",
        物料编码: "",
        图号: "",
        物料名称: "",
        耗用量: 0,
        单位: "kg",
      },
      中外层: {
        位置: "",
        料仓: "",
        物料编码: "",
        图号: "",
        物料名称: "",
        耗用量: 0,
        单位: "kg",
      },
      中内层: {
        位置: "",
        料仓: "",
        物料编码: "",
        图号: "",
        物料名称: "",
        耗用量: 0,
        单位: "kg",
      },
      内层粗粉: {
        位置: "",
        料仓: "",
        物料编码: "",
        图号: "",
        物料名称: "",
        耗用量: 0,
        单位: "kg",
      },
      "内层细粉(W成型机)": {
        位置: "",
        料仓: "",
        物料编码: "",
        图号: "",
        物料名称: "",
        耗用量: 0,
        单位: "kg",
      },
      "内层细粉(B扬砂)": {
        位置: "",
        料仓: "",
        物料编码: "",
        图号: "",
        物料名称: "",
        耗用量: 0,
        单位: "kg",
      },
      半自动砂: {
        位置: "",
        料仓: "",
        物料编码: "",
        图号: "",
        物料名称: "",
        耗用量: 0,
        单位: "kg",
      },
    },
    熔融机参数: {
      真空时间: 0,
      自动断弧时间设定: 0,
      模具转速: 0,
      熔融时间上限: 0,
      熔融时间下限: 0,
    },
    清洗参数: {
      "酸洗时间（秒）": 0,
      美晶洗净线编号: "",
    },
    烘烤参数: {
      图层要求: "00",
      内层配比: 0,
      内层表面浓度: 0,
      外层配比: 0,
      外层表面浓度: 0,
      "内喷钡量（毫升）": 0,
      "外喷钡量（毫升）": 0,
      "喷钡温度（℃）": 0,
      外刷钡要求: "",
    },
  };

  const importRecipe = (id, type, then) => {
    rmsImportRecipeParams(
      { 类型: type, 配方id: id },
      (res) => {
        const { code, data, msg } = res.data;
        if (code === 0) {
          then(data);
        } else {
          message.error(msg);
        }
      },
      () => {
        message.error("网络异常");
      }
    );
  };

  const ConditionFormDataItems = [
    {
      name: ["制造条件参数", "电极-位置"],
      label: "电极-位置",
      type: "input_number",
    },
    {
      name: ["制造条件参数", "电极-物料编码"],
      label: "电极-物料编码",
      type: "input",
    },
    {
      name: ["制造条件参数", "电极-图号"],
      label: "电极-图号",
      type: "input",
    },
    {
      name: ["制造条件参数", "电极类别"],
      label: "电极类别",
      type: "input",
    },
    {
      name: ["制造条件参数", "电极规格"],
      label: "电极规格",
      type: "input",
    },
    {
      name: ["制造条件参数", "电极-耗用量"],
      label: "电极-耗用量",
      type: "input_number",
    },
    {
      name: ["制造条件参数", "电极-单位"],
      label: "电极-单位",
      type: "input",
    },
    {
      name: ["制造条件参数", "内层成型棒"],
      label: "内层成型棒",
      type: "input",
    },
    {
      name: ["制造条件参数", "中层成型棒"],
      label: "中层成型棒",
      type: "input",
    },
    {
      name: ["制造条件参数", "外层成型棒"],
      label: "外层成型棒",
      type: "input",
    },
    {
      name: ["制造条件参数", "成型板"],
      label: "成型板",
      type: "input",
    },
    {
      name: ["制造条件参数", "起弧位置-水套下方"],
      label: "起弧位置-水套下方",
      type: "input",
    },
    {
      name: ["制造条件参数", "最大电极开度"],
      label: "最大电极开度",
      type: "input",
    },
    {
      name: ["制造条件参数", "内层成型棒-顶针高度"],
      label: "内层成型棒-顶针高度",
      type: "input_number",
    },
    {
      name: ["制造条件参数", "中层成型棒-顶针高度"],
      label: "中层成型棒-顶针高度",
      type: "input_number",
    },
    {
      name: ["制造条件参数", "外层成型棒-顶针高度"],
      label: "外层成型棒-顶针高度",
      type: "input_number",
    },
    {
      name: ["制造条件参数", "水冷模具"],
      label: "水冷模具",
      type: "input",
    },
    {
      name: ["制造条件参数", "钢模内胆"],
      label: "钢模内胆",
      type: "input",
    },
    {
      name: ["制造条件参数", "水冷板"],
      label: "水冷板",
      type: "input",
    },
    {
      name: ["制造条件参数", "水冷板直径"],
      label: "水冷板直径",
      type: "input_number",
    },
    {
      name: ["制造条件参数", "水冷板-模具距离1"],
      label: "水冷板-模具距离1",
      type: "input_number",
    },
    {
      name: ["制造条件参数", "水冷板-模具距离2"],
      label: "水冷板-模具距离2",
      type: "input_number",
    },
    {
      name: ["制造条件参数", "水冷板-模具距离3"],
      label: "水冷板-模具距离3",
      type: "input_number",
    },
    {
      name: ["制造条件参数", "水冷板-模具距离4"],
      label: "水冷板-模具距离4",
      type: "input_number",
    },
    {
      name: ["制造条件参数", "注意事项"],
      label: "注意事项",
      type: "input",
    },
    {
      name: ["制造条件参数", "修改履历"],
      label: "修改履历",
      type: "input",
    },
    {
      name: ["制造条件参数", "英寸"],
      label: "英寸",
      type: "input_number",
    },
    {
      name: ["制造条件参数", "直径"],
      label: "直径",
      type: "input_number",
    },
    {
      name: ["制造条件参数", "模具内高度"],
      label: "模具内高度",
      type: "input_number",
    },
    {
      name: ["制造条件参数", "模具外高度"],
      label: "模具外高度",
      type: "input_number",
    },
  ];
  const renderConditionParam = () => {
    return (
      <Row gutter={[16, 16]}>
        {ConditionFormDataItems.map((item, _) => (
          <Col span={4} key={_}>
            <GenerateFormItem item={item} />
          </Col>
        ))}
      </Row>
    );
  };
  const getRecipeOptions = (recipeObj, recipeType) => {
    if (
      !recipeObj ||
      typeof recipeType !== "string" ||
      !recipeObj[recipeType] ||
      !Array.isArray(recipeObj[recipeType])
    ) {
      return [];
    }
    return recipeObj[recipeType].map((item) => ({
      value: item?.配方id || "",
      label: item?.配方名 || "",
    }));
  };
  const renderQuartzSandParam = () => {
    const [recipeId, setRecipeId] = useState("");
    const imp = () => {
      if (recipeId === "") {
        return message.warning("请选择配方");
      } else {
        importRecipe(recipeId, "石英砂参数", (param) => {
          console.log(param);
          form_param.setFieldsValue({ 石英砂参数: param });
          message.success("导入成功");
        });
      }
    };
    const columns = [
      {
        title: "砂类型",
        dataIndex: "砂类型",
        key: "砂类型",
        width: 200,
      },
      ...["位置", "料仓", "物料编码", "图号", "物料名称"].map((item, _) => ({
        title: item,
        key: item,
        width: 200,
        render: (record) => (
          <Form.Item
            name={["石英砂参数", record.砂类型, item]}
            {...ComputeFormCol(0)}
          >
            <Input disabled />
          </Form.Item>
        ),
      })),
      {
        title: "耗用量",
        key: "耗用量",
        width: 200,
        render: (record) => (
          <Form.Item
            name={["石英砂参数", record.砂类型, "耗用量"]}
            {...ComputeFormCol(0)}
          >
            <InputNumber style={{ width: "100%" }} disabled />
          </Form.Item>
        ),
      },
      {
        title: "单位",
        key: "单位",
        width: 200,
        render: (record) => (
          <Form.Item
            name={["石英砂参数", record.砂类型, "单位"]}
            {...ComputeFormCol(0)}
          >
            <Select options={selectList2Option(["g", "kg", "t"])} disabled />
          </Form.Item>
        ),
      },
    ];

    return (
      <Flex vertical gap={16}>
        <Flex justify="end" gap={16}>
          <Select
            options={getRecipeOptions(recipe, "石英砂配方")}
            showSearch
            optionFilterProp="label"
            style={{ width: 160 }}
            value={recipeId}
            onChange={setRecipeId}
          />
          <Button icon={<UploadOutlined />} onClick={imp}>
            导入
          </Button>
        </Flex>
        <Table
          size="small"
          bordered
          columns={columns}
          pagination={false}
          dataSource={[
            "ZS砂",
            "外层",
            "中外层",
            "中内层",
            "内层粗粉",
            "内层细粉(W成型机)",
            "内层细粉(B扬砂)",
            "半自动砂",
          ].map((x, _) => ({ 砂类型: x, key: _ }))}
        />

        <Form.Item
          label="透明层砂Code"
          name={["石英砂参数", "透明层砂Code"]}
          style={{ width: "16%" }}
        >
          <Input disabled />
        </Form.Item>
      </Flex>
    );
  };

  const MeltFormDataItems = [
    {
      name: ["熔融机参数", "真空时间"],
      label: "真空时间",
      type: "input_number",
      disabled: true,
    },
    {
      name: ["熔融机参数", "自动断弧时间设定"],
      label: "自动断弧时间设定",
      type: "input_number",
      disabled: true,
    },
    {
      name: ["熔融机参数", "模具转速"],
      label: "模具转速",
      type: "input_number",
      disabled: true,
    },
    {
      name: ["熔融机参数", "熔融时间上限"],
      label: "熔融时间上限",
      type: "input_number",
      required: true,
    },
    {
      name: ["熔融机参数", "熔融时间下限"],
      label: "熔融时间下限",
      type: "input_number",
      required: true,
    },
  ];

  const renderMeltingMachineParam = () => {
    const [recipeId, setRecipeId] = useState("");
    const imp = () => {
      if (recipeId === "") {
        return message.warning("请选择配方");
      } else {
        importRecipe(recipeId, "熔融机参数", (param) => {
          console.log(param);
          form_param.setFieldsValue({ 熔融机参数: param });
          message.success("导入成功");
        });
      }
    };
    return (
      <Flex vertical gap={16}>
        <Flex justify="end" gap={16}>
          <Select
            options={getRecipeOptions(recipe, "熔融机方案")}
            showSearch
            optionFilterProp="label"
            style={{ width: 160 }}
            value={recipeId}
            onChange={setRecipeId}
          />
          <Button icon={<UploadOutlined />} onClick={imp}>
            导入
          </Button>
        </Flex>
        <Row gutter={[16, 16]}>
          {MeltFormDataItems.map((item, _) => (
            <Col span={4} key={_}>
              <GenerateFormItem item={item} />
            </Col>
          ))}
        </Row>
      </Flex>
    );
  };

  const CleaningFormDataItems = [
    {
      name: ["清洗参数", "酸洗时间（秒）"],
      label: "酸洗时间（秒）",
      type: "input_number",
      disabled: true,
    },
    {
      name: ["清洗参数", "美晶洗净线编号"],
      label: "美晶洗净线编号",
      type: "input",
      disabled: true,
    },
  ];
  const renderCleaningParam = () => {
    const [recipeId, setRecipeId] = useState("");
    const imp = () => {
      if (recipeId === "") {
        return message.warning("请选择配方");
      } else {
        importRecipe(recipeId, "清洗参数", (param) => {
          console.log(param);
          form_param.setFieldsValue({ 清洗参数: param });
          message.success("导入成功");
        });
      }
    };
    return (
      <Flex vertical gap={16}>
        <Flex justify="end" gap={16}>
          <Select
            options={getRecipeOptions(recipe, "清洗配方")}
            showSearch
            style={{ width: 160 }}
            value={recipeId}
            onChange={setRecipeId}
          />
          <Button icon={<UploadOutlined />} onClick={imp}>
            导入
          </Button>
        </Flex>
        <Row gutter={[16, 16]}>
          {CleaningFormDataItems.map((item, _) => (
            <Col span={4} key={_}>
              <GenerateFormItem item={item} />
            </Col>
          ))}
        </Row>
      </Flex>
    );
  };
  const BakingFormDataItems = [
    {
      name: ["烘烤参数", "内层配比"],
      label: "内层配比",
      type: "input_number",
    },
    {
      name: ["烘烤参数", "内层表面浓度"],
      label: "内层表面浓度",
      type: "input_number",
    },
    {
      name: ["烘烤参数", "外层配比"],
      label: "外层配比",
      type: "input_number",
    },
    {
      name: ["烘烤参数", "外层表面浓度"],
      label: "外层表面浓度",
      type: "input_number",
    },
    {
      name: ["烘烤参数", "外刷钡要求"],
      label: "外刷钡要求",
      type: "input",
    },
    {
      name: ["烘烤参数", "内喷钡量（毫升）"],
      label: "内喷钡量（毫升）",
      type: "input_number",
      disabled: true,
    },
    {
      name: ["烘烤参数", "外喷钡量（毫升）"],
      label: "外喷钡量（毫升）",
      type: "input_number",
      disabled: true,
    },
    {
      name: ["烘烤参数", "喷钡温度（℃）"],
      label: "喷钡温度（℃）",
      type: "input_number",
      disabled: true,
    },
  ];
  const renderBakingParam = () => {
    const [recipeId, setRecipeId] = useState("");
    const imp = () => {
      if (recipeId === "") {
        return message.warning("请选择配方");
      } else {
        importRecipe(recipeId, "烘烤参数", (param) => {
          console.log(param);
          form_param.setFieldsValue({ 烘烤参数: param });
          message.success("导入成功");
        });
      }
    };
    return (
      <Flex vertical gap={16}>
        <Flex justify="end" gap={16}>
          <Select
            options={getRecipeOptions(recipe, "烘烤配方")}
            showSearch
            optionFilterProp="label"
            value={recipeId}
            onChange={setRecipeId}
            style={{ width: 160 }}
          />
          <Button icon={<UploadOutlined />} onClick={imp}>
            导入
          </Button>
        </Flex>
        <Row gutter={[16, 16]}>
          <Col span={4}>
            <Form.Item name={["烘烤参数", "图层要求"]} label="图层要求">
              <Select
                options={[
                  { label: "无", value: "00" },
                  { label: "外喷钡", value: "01" },
                  { label: "内喷钡", value: "10" },
                  { label: "内外喷钡", value: "11" },
                ]}
              />
            </Form.Item>
          </Col>
          {BakingFormDataItems.map((item, _) => (
            <Col span={4} key={_}>
              <GenerateFormItem item={item} />
            </Col>
          ))}
        </Row>
      </Flex>
    );
  };

  const tab_items = [
    {
      key: "1",
      label: "制造条件参数",
      children: renderConditionParam(),
    },
    {
      key: "2",
      label: "石英砂参数",
      children: renderQuartzSandParam(),
    },
    {
      key: "3",
      label: "熔融机参数",
      children: renderMeltingMachineParam(),
    },
    {
      key: "4",
      label: "清洗参数",
      children: renderCleaningParam(),
    },
    {
      key: "5",
      label: "烘烤参数",
      children: renderBakingParam(),
    },
  ];
  const initRecipeList = () => {
    rmsGetRecipeList(
      (res) => {
        const { code, data, msg } = res.data;
        if (code === 0) {
          setRecipe(data);
        }
      },
      () => {}
    );
  };

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
  useEffect(() => {
    initRecipeList();
  }, []);
  return (
    <div>
      <MyBreadcrumb items={[window.sys_name, "RMS", "制造条件", page]} />
      <div className="content_root">
        <Spin spinning={load}>
          <Flex vertical gap={10}>
            <Flex justify="space-between">
              <Title level={3}>
                <FileTextTwoTone />
                <span style={{ marginLeft: 10 }}>{`${page}制造条件`}</span>
              </Title>
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate("/mng/rms/condition_table")}
              >
                返回上一页
              </Button>
            </Flex>
            <Form
              disabled={page !== "新增"}
              form={form}
              layout="inline"
              initialValues={{
                配方编号: "",
                图号: "",
                版本: "",
                英寸: "",
                状态: "启用",
              }}
            >
              <Form.Item name="配方编号" label="配方编号">
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
            <Divider>制造条件参数</Divider>
            <Form
              form={form_param}
              component={false}
              {...ComputeFormCol(12)}
              initialValues={default_param_form_data}
              disabled={page === "查看"}
            >
              <Tabs items={tab_items} type="card" />
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

export default ConditionEditPage;

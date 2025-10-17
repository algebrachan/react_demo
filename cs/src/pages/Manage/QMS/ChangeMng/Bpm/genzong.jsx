import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Radio,
  Button,
  Table,
  Space,
  message,
  DatePicker,
  Select,
  Card,
  Spin,
  Divider,
  Typography,
} from "antd";
import { Flex } from "antd";
import { ComputeFormCol } from "@/utils/obj";
import { selectList2Option } from "@/utils/string";
import {
  getChangePlanTracking,
  postChangePlanTracking,
} from "@/apis/qms_router";
import dayjs from "dayjs";
import { PlusOutlined } from "@ant-design/icons";
import MultiSelect from "@/components/CustomSeries/MultiSelect.jsx";
import { Huiqian } from "./huiqian";

const { Title } = Typography;

const EditTable = ({
  title,
  isOperate = true,
  add_name = "添加",
  columns_text = [],
  dataSource = [],
  setTbData = () => {},
}) => {
  const handleTableChange = (value, field, index) => {
    const newData = [...dataSource];
    if (newData[index]) {
      newData[index][field] = value;
      setTbData(newData);
    }
  };
  const handleAddRow = () => {
    const newRow = { key: Date.now().toString() };
    columns_text.forEach((item) => {
      const { dataIndex, type } = item;
      newRow[dataIndex] =
        type === ("MultiSelect" || "DatePicker.RangePicker") ? [] : "";
    });
    setTbData([...dataSource, newRow]);
  };
  const handleDelete = (key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setTbData(newData);
  };
  const columns = [
    {
      title: "序号",
      dataIndex: "key",
      key: "key",
      width: 80,
      render: (_, __, index) => index + 1,
    },
    ...columns_text.map((item) => {
      const { dataIndex, title, width, type = "Input", props = {} } = item;
      return {
        title,
        dataIndex,
        width,
        key: dataIndex,
        render: (text, record, index) => {
          if (type === "Input") {
            return (
              <Input
                style={{ width: "100%" }}
                value={text}
                onChange={(e) =>
                  handleTableChange(e.target.value, dataIndex, index)
                }
                {...props}
              />
            );
          } else if (type === "Text") {
            return <span>{text}</span>;
          } else if (type === "TextArea") {
            return (
              <Input.TextArea
                style={{ width: "100%" }}
                value={text}
                onChange={(e) =>
                  handleTableChange(e.target.value, dataIndex, index)
                }
                {...props}
              />
            );
          } else if (type === "Select") {
            return (
              <Select
                style={{ width: "100%" }}
                value={text}
                onChange={(e) => handleTableChange(e, dataIndex, index)}
                {...props}
              />
            );
          } else if (type === "MultiSelect") {
            return (
              <MultiSelect
                showCheckAll
                style={{ width: "100%" }}
                value={text}
                onChange={(e) => handleTableChange(e, dataIndex, index)}
                {...props}
              />
            );
          } else if (type === "DatePicker") {
            return (
              <DatePicker
                showTime
                style={{ width: "100%" }}
                value={text ? dayjs(text) : null}
                onChange={(value, dateString) =>
                  handleTableChange(dateString, dataIndex, index)
                }
                {...props}
              />
            );
          } else if (type === "DatePicker.RangePicker") {
            return (
              <DatePicker.RangePicker
                showTime
                style={{ width: "100%" }}
                onChange={(value, dateString) =>
                  handleTableChange(dateString, dataIndex, index)
                }
                {...props}
              />
            );
          }
        },
      };
    }),
  ];
  isOperate &&
    columns.push({
      title: "操作",
      key: "action",
      width: 100,
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" danger onClick={() => handleDelete(record.key)}>
            删除
          </Button>
        </Space>
      ),
    });
  return (
    <Table
      title={title}
      size="small"
      columns={columns}
      dataSource={dataSource}
      bordered
      pagination={false}
      footer={() =>
        isOperate && (
          <Button onClick={handleAddRow} icon={<PlusOutlined />}>
            {add_name}
          </Button>
        )
      }
    />
  );
};

const GenZong = ({
  id = "",
  review_data = {},
  huiqian = {},
  disabled = false,
  reFresh = () => {},
}) => {
  const [form] = Form.useForm();
  const default_form_data = {
    product_name: "",
    charge_charge_person: "",
    change_notice_number: "",
    conclusion: "",
    conclusion_reason: "",
    QM_review: "",
    TDGM_review: "",
    tracking_person: "",
  };
  const [load, setLoad] = useState(false);
  const default_techTableData = [
    "产品规格书",
    "过程流程图",
    "PFMEA",
    "特殊特性清单",
    "控制计划",
  ].map((i) => ({
    project: i,
    key: i,
    plan_finish_time: "",
    charge_person: "",
    completion_progress: "",
    confirm_results: "",
    confirm_person: "",
  }));
  const [techTableData, setTechTableData] = useState([]);
  const [sopTableData, setSopTableData] = useState([]);
  const [sipTableData, setSipTableData] = useState([]);
  const [inventoryProduct, setInventoryProduct] = useState([]);
  const default_productCost = ["产品成本核算", "客户承担变更费用落实"].map(
    (i) => ({
      project: i,
      key: i,
      plan_finish_time: "",
      charge_person: "",
      completion_progress: "",
      confirm_results: "",
      confirm_person: "",
    })
  );
  const [productCost, setProductCost] = useState([]);
  const [equipmentAcceptance, setEquipmentAcceptance] = useState([]);
  const [facilityAcceptance, setFacilityAcceptance] = useState([]);
  const [fixtureAcceptance, setFixtureAcceptance] = useState([]);
  const [inspectionToolAcceptance, setInspectionToolAcceptance] = useState([]);
  const [other, setOther] = useState([]);
  const [changeProduct, setChangeProduct] = useState([]);
  const commonColumns = [
    { title: "项目", dataIndex: "project" },
    {
      title: "计划完成时间",
      dataIndex: "plan_finish_time",
      type: "DatePicker",
    },
    { title: "负责人", dataIndex: "charge_person" },
    { title: "完成进度", dataIndex: "completion_progress" },
    { title: "确认结果", dataIndex: "confirm_results" },
    { title: "确认人", dataIndex: "confirm_person" },
  ];
  const huiqianDept = [
    "研发技术部",
    "制造部",
    "运营部",
    "质量管理部",
    "人力资源部",
    "财务部",
    "信息部",
    "项目开发部",
    "销售部",
    "采购部",
    "设备动力科",
    "综合办",
    "安环部",
    "PMC",
    "原料合成车间",
    "坩埚车间",
    "长晶生产车间",
  ];
  const submit = async () => {
    const values = form.getFieldsValue();
    let param = {
      number: id,
      typeof: 1,
      product_name: values["product_name"],
      charge_charge_person: values["charge_charge_person"],
      change_notice_number: values["change_notice_number"],
      conclusion: values["conclusion"],
      conclusion_reason: values["conclusion_reason"],
      tracking_person: values["tracking_person"],
    };
    setLoad(true);
    postChangePlanTracking(
      param,
      (res) => {
        setLoad(false);
        const { code, msg, data } = res.data;
        if (code === 200) {
          message.success("提交成功");
          reFresh();
        }
      },
      (e) => {
        setLoad(false);
      }
    );
  };
  const postChange = async () => {
    const values = await form
      .validateFields()
      .then((res) => res)
      .catch((err) => {
        const { errorFields } = err;
        let err_list = errorFields.map((e) => e.errors);
        message.warning(err_list.join("\n"));
        return false;
      });
    if (!values) return;
    const param = {
      ...values,
      technical_documents: techTableData,
      SOP_working_instruction: sopTableData,
      SIP_working_instruction: sipTableData,
      inventory_product: inventoryProduct,
      product_cost: productCost,
      equipment_acceptance: equipmentAcceptance,
      facility_acceptance: facilityAcceptance,
      fixture_acceptance: fixtureAcceptance,
      inspection_tool_acceptance: inspectionToolAcceptance,
      other: other,
      change_product: changeProduct,
      number: id,
      typeof: 2,
    };
    setLoad(true);
    postChangePlanTracking(
      param,
      (res) => {
        setLoad(false);
        const { code, msg, data } = res.data;
        if (code === 200) {
          message.success("提交成功");
          reFresh();
        }
      },
      (e) => {
        setLoad(false);
      }
    );
  };
  const [huiqianData, setHuiqianData] = useState(
    huiqianDept.map((i) => ({ dept: i, key: i, value: "" }))
  );
  useEffect(() => {
    if (review_data) {
      form.setFieldsValue(review_data);
      setTechTableData(
        review_data["technical_documents"] || default_techTableData
      );
      setSopTableData(review_data["SOP_working_instruction"] || []);
      setSipTableData(review_data["SIP_working_instruction"] || []);
      setInventoryProduct(review_data["inventory_product"] || []);
      setProductCost(review_data["product_cost"] || default_productCost);
      setEquipmentAcceptance(review_data["equipment_acceptance"] || []);
      setFacilityAcceptance(review_data["facility_acceptance"] || []);
      setFixtureAcceptance(review_data["fixture_acceptance"] || []);
      setInspectionToolAcceptance(
        review_data["inspection_tool_acceptance"] || []
      );
      setOther(review_data["other"] || []);
      setChangeProduct(review_data["change_product"] || []);
    } else {
      form.resetFields();
    }
  }, [review_data]);
  return (
    <Flex vertical gap={16}>
      <div className="no_review_title">变更跟踪</div>
      <Card>
        <Spin spinning={load}>
          <Form
            form={form}
            {...ComputeFormCol(3)}
            initialValues={default_form_data}
            disabled={disabled}
          >
            <Flex vertical gap={16}>
              <Form.Item label="产品名称/规格" name="product_name">
                <Input />
              </Form.Item>
              <Form.Item label="变更负责人" name="charge_charge_person">
                <Input />
              </Form.Item>
              <Form.Item label="变更通知单号" name="change_notice_number">
                <Input />
              </Form.Item>
              <Form.Item label="结论" name="conclusion">
                <Radio.Group options={selectList2Option(["通过", "不通过"])} />
              </Form.Item>
              <Form.Item label="存在问题" name="conclusion_reason">
                <Input.TextArea />
              </Form.Item>
              <Form.Item label="跟踪负责人">
                <Flex gap={20}>
                  <Form.Item name="tracking_person">
                    <Input style={{ width: 200 }} placeholder="请签字" />
                  </Form.Item>
                  <Button type="primary" onClick={submit}>
                    提交
                  </Button>
                </Flex>
              </Form.Item>
              <Divider />
              <Form.Item
                getValueProps={(value) => ({
                  value: value && dayjs(value),
                })}
                normalize={(value) =>
                  value && dayjs(value).format("YYYY-MM-DD")
                }
                label="质量部长审核日期"
                name="QM_review"
              >
                <DatePicker />
              </Form.Item>
              <Form.Item
                getValueProps={(value) => ({
                  value: value && dayjs(value),
                })}
                normalize={(value) =>
                  value && dayjs(value).format("YYYY-MM-DD")
                }
                label="技术副总批准日期"
                name="TDGM_review"
              >
                <DatePicker />
              </Form.Item>
              <EditTable
                title={() => "技术文件/作业标准"}
                isOperate={false}
                dataSource={techTableData}
                columns_text={commonColumns.map((item) => {
                  const newItem = { ...item };
                  const { dataIndex } = newItem;
                  if (dataIndex === "project") newItem.type = "Text";
                  return newItem;
                })}
                setTbData={setTechTableData}
              />
              <EditTable
                title={() => "SOP作业指导书"}
                dataSource={sopTableData}
                columns_text={[...commonColumns]}
                setTbData={setSopTableData}
              />

              <EditTable
                title={() => "SIP作业指导书"}
                dataSource={sipTableData}
                columns_text={[...commonColumns]}
                setTbData={setSipTableData}
              />

              <EditTable
                title={() => "库存产品处理"}
                dataSource={inventoryProduct}
                columns_text={[...commonColumns]}
                setTbData={setInventoryProduct}
              />
              <EditTable
                title={() => "产品成本及变更费用"}
                isOperate={false}
                dataSource={productCost}
                columns_text={commonColumns.map((item) => {
                  const newItem = { ...item };
                  const { dataIndex } = newItem;
                  if (dataIndex === "project") newItem.type = "Text";
                  return newItem;
                })}
                setTbData={setProductCost}
              />
              <EditTable
                title={() => "设备验收"}
                dataSource={equipmentAcceptance}
                columns_text={[...commonColumns]}
                setTbData={setEquipmentAcceptance}
              />
              <EditTable
                title={() => "设施验收"}
                dataSource={facilityAcceptance}
                columns_text={[...commonColumns]}
                setTbData={setFacilityAcceptance}
              />
              <EditTable
                title={() => "工装验收"}
                dataSource={fixtureAcceptance}
                columns_text={[...commonColumns]}
                setTbData={setFixtureAcceptance}
              />
              <EditTable
                title={() => "检具验收"}
                dataSource={inspectionToolAcceptance}
                columns_text={[...commonColumns]}
                setTbData={setInspectionToolAcceptance}
              />
              <EditTable
                title={() => "其他"}
                dataSource={other}
                columns_text={[...commonColumns]}
                setTbData={setOther}
              />
              <EditTable
                title={() => "变更品前三批次"}
                dataSource={changeProduct}
                columns_text={[
                  { title: "生产时间/生产批次", dataIndex: "product_time" },
                  {
                    title: "发货时间",
                    dataIndex: "delivery_time",
                    type: "DatePicker",
                  },
                  {
                    title: "顾客端质量反馈",
                    dataIndex: "customer_quality_feedback",
                  },
                  { title: "确认人", dataIndex: "confirm_person" },
                ]}
                setTbData={setChangeProduct}
              />
              <Flex justify="end">
                <Button type="primary" onClick={postChange}>
                  提交
                </Button>
              </Flex>
            </Flex>
          </Form>
        </Spin>
      </Card>
    </Flex>
  );
};
export default GenZong;

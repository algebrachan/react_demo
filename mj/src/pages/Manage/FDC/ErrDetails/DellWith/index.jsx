import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  GeneralCard,
  MyBreadcrumb,
} from "../../../../../components/CommonCard";
import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Flex,
  Form,
  Input,
  Row,
  Select,
  Space,
  Table,
  Typography,
} from "antd";
import { ComputeFormCol } from "../../../../../utils/obj";
import { dateFormat, selectList2Option } from "../../../../../utils/string";
import { RollbackOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
const { Text } = Typography;
const { TextArea } = Input;

function DellWith() {
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = location.state;
  const [tb_data, setTbData] = useState([{ key: 1 }]);
  const [tb_load, setTbLoad] = useState(false);
  const default_form_data = {
    日期: "",
    图号: "",
    批号: "",
    特征: "",
    机台: "",
    判异规则: "",
    异常现象: "",
    异常原因: "",
    异常对策: "",
    责任部门: [],
    紧急程度: "",
    期限: "",
    制定人: "",
    邮箱上报: "",
    email: false,
  };
  const [form] = Form.useForm();
  const [query_form] = Form.useForm();
  const generateColumns = () => {
    let columns = [
      "工厂",
      "车间",
      "工序",
      "设备",
      "参数",
      "紧急程度",
      "值",
      "规则",
      "上限",
      "标准",
      "下限",
      "偏差",
      "状态",
      "报警时间",
    ].map((e, _) => {
      let col = {
        title: e,
        dataIndex: e,
        key: e,
      };
      return col;
    });
    columns.unshift({
      title: "序号",
      dataIndex: "key",
      key: "key",
      width: 50,
      render: (x) => x + 1,
    });
    return columns;
  };
  const pagination = () => {
    return {
      position: ["bottomCenter"],
      total: tb_data.length,
      showTotal: (total) => `共 ${total} 条`,
      showQuickJumper: true,
      showSizeChanger: true,
      defaultPageSize: 20,
    };
  };

  const submit = async () => {
    let val = await form.validateFields();
    val["id"] = data["id"];
    console.log(val);
  };
  const reSet = () => {
    form.resetFields();
    form.setFieldsValue(data);
  };
  const query = () => {
    const { 图号 = "", 批号 = "" } = data;
    let val = query_form.getFieldsValue();
    console.log(val);
    // setLoad(true);
  };
  useEffect(() => {
    reSet();
  }, [data]);

  return (
    <div>
      <MyBreadcrumb
        items={[window.sys_name, "FDC分析", "异常详情", "处理"]}
      />
      <div className="content_root">
        <Row gutter={[16, 16]}>
          <Col span={5}>
            <GeneralCard name="异常策略制定">
              <Flex vertical style={{ padding: 10 }} gap={16}>
                <Form
                  form={form}
                  initialValues={default_form_data}
                  {...ComputeFormCol(5)}
                  style={{
                    display: "flex",
                    rowGap: 10,
                    flexDirection: "column",
                    height: 620,
                  }}
                  className="of"
                >
                  {["日期", "图号", "批号", "特征", "机台", "判异规则"].map(
                    (e) => (
                      <Form.Item label={e} name={e} key={e}>
                        <Input disabled />
                      </Form.Item>
                    )
                  )}
                  {["异常现象", "异常原因", "异常对策"].map((e) => (
                    <Form.Item label={e} name={e} key={e}>
                      <TextArea autoSize placeholder="请输入" />
                    </Form.Item>
                  ))}
                  <Form.Item label="责任部门" name="责任部门">
                    <Checkbox.Group
                      options={selectList2Option([
                        "工艺",
                        "设备",
                        "品质",
                        "生产",
                      ])}
                    />
                  </Form.Item>
                  <Form.Item label="紧急程度" name="紧急程度">
                    <Select
                      options={selectList2Option(["紧急", "重要", "一般"])}
                    />
                  </Form.Item>
                  <Form.Item
                    label="期限"
                    name="期限"
                    getValueProps={(value) => {
                      return {
                        value: value && dayjs(value),
                      };
                    }}
                    normalize={(value) =>
                      value && dayjs(value).format(dateFormat)
                    }
                  >
                    <DatePicker style={{ width: "100%" }} />
                  </Form.Item>
                  <Form.Item label="制定人" name="制定人">
                    <Input placeholder="请输入" />
                  </Form.Item>
                  <Form.Item label="邮箱上报">
                    <Flex justify="space-between">
                      <Form.Item
                        name="email"
                        valuePropName="checked"
                        {...ComputeFormCol(0)}
                      >
                        <Checkbox></Checkbox>
                      </Form.Item>
                      <Form.Item name="邮箱上报" noStyle {...ComputeFormCol(0)}>
                        <Input
                          style={{ width: "90%" }}
                          placeholder="请输入邮箱"
                        />
                      </Form.Item>
                    </Flex>
                  </Form.Item>
                </Form>
                <Flex justify="end">
                  <Space>
                    <Button onClick={reSet}>重置</Button>
                    <Button type="primary">上报</Button>
                    <Button type="primary" onClick={submit}>
                      提交审核
                    </Button>
                  </Space>
                </Flex>
              </Flex>
            </GeneralCard>
          </Col>
          <Col span={19} style={{ position: "relative" }}>
            <Space style={{ position: "absolute", right: 15, top: 5 }}>
              <Button icon={<RollbackOutlined />} onClick={() => navigate(-1)}>
                返回
              </Button>
            </Space>
            <GeneralCard name="异常数据">
              <Flex vertical gap={16} style={{ padding: 10 }}>
                <Form
                  layout="inline"
                  initialValues={{
                    工厂: "",
                    车间: "",
                    设备: "",
                    参数: "",
                    紧急程度: "",
                    状态: "",
                  }}
                  form={query_form}
                >
                  <Form.Item label="工厂" name="工厂">
                    <Select
                      options={selectList2Option([])}
                      style={{ width: 120 }}
                    />
                  </Form.Item>
                  <Form.Item label="车间" name="车间">
                    <Select
                      options={selectList2Option([])}
                      style={{ width: 120 }}
                    />
                  </Form.Item>
                  <Form.Item label="设备" name="设备">
                    <Select
                      options={selectList2Option([])}
                      style={{ width: 120 }}
                    />
                  </Form.Item>
                  <Form.Item label="参数" name="参数">
                    <Select
                      options={selectList2Option([])}
                      style={{ width: 120 }}
                    />
                  </Form.Item>
                  <Form.Item label="紧急程度" name="紧急程度">
                    <Select
                      options={selectList2Option([])}
                      style={{ width: 120 }}
                    />
                  </Form.Item>
                  <Form.Item label="状态" name="状态">
                    <Select
                      options={selectList2Option([])}
                      style={{ width: 120 }}
                    />
                  </Form.Item>
                  <Button type="primary" onClick={query}>
                    筛选
                  </Button>
                </Form>
                <Table
                  loading={tb_load}
                  size="small"
                  columns={generateColumns()}
                  dataSource={tb_data}
                  bordered
                  scroll={{
                    x: "max-content",
                    y: 600,
                  }}
                  pagination={pagination()}
                />
              </Flex>
            </GeneralCard>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default DellWith;

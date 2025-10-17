import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  GeneralCard,
  MyBreadcrumb,
} from "../../../../../components/CommonCard";
import {
  Alert,
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
  Spin,
  Tabs,
  Typography,
  message,
} from "antd";
import { ComputeFormCol } from "../../../../../utils/obj";
import { dateFormat, selectList2Option } from "../../../../../utils/string";
import EngineerChecklist from "./EngineerChecklist";
import MeltingRecord from "./MeltingRecord";
import MeltingProcess from "./MeltingProcess";
import { RollbackOutlined } from "@ant-design/icons";
import { getRecordForm, submitStrategy } from "../../../../../apis/spc_api";
import dayjs from "dayjs";
const { Text } = Typography;
const { TextArea } = Input;

const ErrInfo = ({ data = {} }) => {
  return (
    <Flex gap={20}>
      <Text strong>异常信息:</Text>
      <Text>图号:{data["图号"]}</Text>
      <Text>日期:{data["日期"]}</Text>
      <Text>异常告警类型:{data["异常告警类型"]}</Text>
      <Text>异常告警批次型:{data["批号"]}</Text>
    </Flex>
  );
};

function Strategy() {
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = location.state;
  const [strg_data, setStrgData] = useState({});
  const [load, setLoad] = useState(false);
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
  const tabs_items = [
    {
      key: "1",
      label: "工程检查表",
      children: (
        <div style={{ height: 580 }} className="of">
          <EngineerChecklist tb_data={strg_data["工程检查表"]} />
        </div>
      ),
    },
    {
      key: "2",
      label: "熔融监控记录",
      children: (
        <div style={{ height: 580 }} className="of">
          <MeltingRecord tb_data={strg_data["熔融监控记录"]} />
        </div>
      ),
    },
    {
      key: "3",
      label: "熔融过程数据",
      children: (
        <div style={{ height: 580 }} className="of">
          <MeltingProcess chart_data={strg_data["熔融过程数据"]} />
        </div>
      ),
    },
  ];
  const submit = async () => {
    let val = await form.validateFields();
    val["id"] = data["id"];
    submitStrategy(
      val,
      (res) => {
        const { data, code, msg } = res.data;
        if (code === 0 && data) {
          message.success("提交成功");
          // reSet();
        } else {
          message.error(msg);
        }
      },
      () => {
        message.error("网络异常");
      }
    );
  };
  const reSet = () => {
    form.resetFields();
    form.setFieldsValue(data);
  };
  const initData = () => {
    const { 图号 = "", 批号 = "" } = data;
    setLoad(true);
    getRecordForm(
      { 图号, 批号 },
      (res) => {
        setLoad(false);
        const { code, data, msg } = res.data;
        if (code === 0 && data) {
          setStrgData(data);
        } else {
          setStrgData({});
        }
      },
      () => {
        setLoad(false);
        setStrgData({});
      }
    );
  };
  useEffect(() => {
    reSet();
    initData();
  }, [data]);

  return (
    <div>
      <MyBreadcrumb
        items={[window.sys_name, "SPC分析", "告警处理", "策略"]}
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
              <Flex vertical style={{ padding: 10 }} gap={16}>
                <Alert message={<ErrInfo data={data} />} type="error" />
                <Spin spinning={load}>
                  <Tabs defaultActiveKey="1" type="card" items={tabs_items} />
                </Spin>
              </Flex>
            </GeneralCard>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default Strategy;

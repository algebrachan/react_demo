import {
  AutoComplete,
  Button,
  Col,
  Divider,
  Flex,
  Modal,
  Radio,
  Row,
  Space,
} from "antd";
import { InputNumber } from "antd";
import { DatePicker } from "antd";
import { Input } from "antd";
import { Form } from "antd";
import dayjs from "dayjs";
import React, { useRef, useState } from "react";
import { useEffect } from "react";
import { ComputeFormCol } from "../../../../utils/obj";
import { Select } from "antd";
import { selectList2Option } from "../../../../utils/string";
import {
  addMonitorOptions,
  getTouliaoData,
  updateMeltMonitor,
  updateMeltMonitorRecord,
} from "../../../../apis/monitor_api";
import { message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { getSession } from "../../../../utils/storage";

export const chgObjVal2Upper = (obj) => {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(chgObjVal2Upper);
  }

  const result = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === "string") {
        result[key] = obj[key].toUpperCase();
      } else {
        result[key] = chgObjVal2Upper(obj[key]);
      }
    }
  }
  return result;
};

const default_data1 = {
  作业日期: "",
  班次: "白班",
  熔融机号: 0,
  确认人: "",
  主操: "",
  辅操: "",
  制造编号: "",
  产品图号: "",
  英寸: 0,
  生产规格: "",
  底座编号: "",
  上邦编号: "",
  内胆编号: "",
  外成型棒: "",
  内成型棒: "",
  再生砂: "",
  外层: "",
  中外: "",
  中内: "",
  内层: "",
  电极规格: "",
  生产数量: 0,
  模具内径: "",
  模具R角: "",
  抽真空时间: "",
  边料高度: "",
  作业时间1: "",
  作业时间2: "",
  备注: "",
};

const default_data2 = {
  监控id: "",
  坩埚lotNo: "",
  再生砂LotNo: "",
  再生砂重量: "",
  外层LotNo: "",
  外层重量: "",
  中外LotNo: "",
  中外重量: "",
  中内LotNo: "",
  中内重量: "",
  内层LotNo: "",
  内层重量: "",
  电极厂家: "",
  电极批次: "",
  电极结余: "",
  熔融时间分: "",
  熔融时间秒: "",
  真空极限压力: "",
  不良项目: "",
  改型: "",
  高度: "",
  重量: "",
  后道报废: "",
  后道报废原因: "",
  外观自检: "",
  外径D1: "",
  外径D2: "",
  外径D3: "",
  壁厚T1: "",
  壁厚T2: "",
  壁厚T3: "",
  TR: "",
  BR: "",
  TB: "",
  RG: "",
  BG: "",
  模具出水温度起弧前: "",
  模具出水温度断弧时: "",
  电极更换时结余: "",
  备注: "",
};
export const MeltModal = ({
  open = false,
  data = {},
  opt_obj = {},
  onCancel,
  requestData,
}) => {
  const [form] = Form.useForm();
  const handleOk = () => {
    let val = form.getFieldsValue();
    const up_val = chgObjVal2Upper(val);
    up_val["id"] = data["id"];
    updateMeltMonitor(
      up_val,
      (res) => {
        const { code, msg, data } = res.data;
        if (code === 0 && data) {
          message.success("修改成功");
          onCancel();
          requestData();
        } else {
          message.error(msg);
        }
      },
      () => {
        message.error("网络异常");
      }
    );
  };
  useEffect(() => {
    if (open) {
      form.setFieldsValue(data);
    }
  }, [open]);
  return (
    <Modal
      getContainer={false}
      title="编辑熔融监控"
      open={open}
      onCancel={onCancel}
      onOk={handleOk}
      destroyOnHidden={true}
      width={1000}
    >
      <Form form={form} {...ComputeFormCol(8)} initialValues={default_data1}>
        <Row gutter={[10, 10]}>
          <Col span={12}>
            <Form.Item
              label="作业日期"
              name="作业日期"
              getValueProps={(value) => {
                return {
                  value: value && dayjs(value),
                };
              }}
              normalize={(value) => value && dayjs(value).format("YYYY-MM-DD")}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="班次" name="班次">
              <Select options={selectList2Option(["白班", "中班", "夜班"])} />
            </Form.Item>
          </Col>
          {[
            "熔融机号",
            "确认人",
            "主操",
            "辅操",
            "制造编号",
            "产品图号",
            "英寸",
            "生产规格",
            "底座编号",
            "上邦编号",
            "内胆编号",
            "外成型棒",
            "内成型棒",
            "再生砂",
            "外层",
            "中外",
            "中内",
            "内层",
            "电极规格",
          ].map((e) => (
            <Col span={12} key={e}>
              <MyAutoComplete opt={opt_obj[e]} label={e} />
            </Col>
          ))}
          <Col span={12}>
            <Form.Item label="生产数量" name="生产数量">
              <InputNumber style={{ width: "100%" }} precision={0} />
            </Form.Item>
          </Col>
          {[
            "模具内径",
            "模具R角",
            "抽真空时间",
            "边料高度",
            "作业时间1",
            "作业时间2",
            "备注",
          ].map((e) => (
            <Col span={12} key={e}>
              <MyAutoComplete opt={opt_obj[e]} label={e} />
            </Col>
          ))}
        </Row>
      </Form>
    </Modal>
  );
};
export const MeltRecordModal = ({
  open = false,
  data = {},
  opt_obj = {},
  onCancel,
  requestData,
}) => {
  const [form] = Form.useForm();
  const handleOk = () => {
    let val = form.getFieldsValue();
    const up_val = chgObjVal2Upper(val);
    up_val["id"] = data["id"];
    updateMeltMonitorRecord(
      up_val,
      (res) => {
        const { code, msg, data } = res.data;
        if (code === 0 && data) {
          message.success("修改成功");
          onCancel();
          requestData();
        } else {
          message.error(msg);
        }
      },
      () => {
        message.error("网络异常");
      }
    );
  };
  useEffect(() => {
    if (open) {
      form.setFieldsValue(data);
    }
  }, [open]);
  return (
    <Modal
      getContainer={false}
      title="编辑熔融监控记录"
      open={open}
      onCancel={onCancel}
      onOk={handleOk}
      destroyOnHidden={true}
      width={1200}
    >
      <Form form={form} {...ComputeFormCol(10)} initialValues={default_data2}>
        <Row gutter={[10, 10]}>
          <Col span={12}>
            <Form.Item name="监控id" label="监控id">
              <Input disabled />
            </Form.Item>
          </Col>
          {[
            "坩埚lotNo",
            "再生砂LotNo",
            "再生砂重量",
            "外层LotNo",
            "外层重量",
            "中外LotNo",
            "中外重量",
            "中内LotNo",
            "中内重量",
            "内层LotNo",
            "内层重量",
          ].map((e) => (
            <Col span={12} key={e}>
              <Form.Item label={e} name={e}>
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
          ))}
          <Col span={12}>
            <Form.Item label="电极厂家" name="电极厂家">
              <AutoComplete
                placeholder="请输入"
                options={selectList2Option(opt_obj["电极厂家"])}
                filterOption={(inputValue, option) =>
                  option &&
                  option.value
                    .toUpperCase()
                    .indexOf(inputValue.toUpperCase()) !== -1
                }
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="电极使用次数" name="电极结余">
              <Input placeholder="请输入" />
            </Form.Item>
          </Col>
          {[
            "电极批次",
            "熔融时间分",
            "熔融时间秒",
            "真空极限压力",
            "不良项目",
            "改型",
            "高度",
            "重量",
            "后道报废",
            "后道报废原因",
            "外观自检",
            "外径D1",
            "外径D2",
            "外径D3",
            "壁厚T1",
            "壁厚T2",
            "壁厚T3",
            "TR",
            "BR",
            "TB",
            "RG",
            "BG",
            "模具出水温度起弧前",
            "模具出水温度断弧时",
            "电极更换时结余",
            "备注",
          ].map((e) => (
            <Col span={12} key={e}>
              <Form.Item label={e} name={e}>
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
          ))}
        </Row>
      </Form>
    </Modal>
  );
};

export const MyAutoComplete = ({ opt = [], label = "" }) => {
  const [options, setOptions] = useState([]);
  const [name, setName] = useState("");
  const onNameChange = (event) => {
    setName(event.target.value);
  };
  const addItem = (e) => {
    e.preventDefault();
    if (name === "") {
      return;
    }
    let str = name.toUpperCase();
    if (options.includes(str)) {
      message.warning("请勿添加重复元素");
      setName("");
    } else {
      // 请求后端
      addMonitorOptions(
        { name: label, value: str },
        (res) => {
          const { code, msg, data } = res.data;
          if (code === 0 && data) {
            setOptions([...options, str]);
            setName("");
            message.success("添加成功");
          } else {
            message.error(msg);
          }
        },
        () => {
          message.error("网络异常");
        }
      );
    }
  };
  useEffect(() => {
    if (opt && opt.length > 0) {
      setOptions(opt);
    }
  }, [opt]);
  return (
    <Form.Item label={label} name={label}>
      <AutoComplete
        placeholder="请输入"
        options={selectList2Option(options)}
        filterOption={(inputValue, option) =>
          option &&
          option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
        }
        dropdownRender={(menu) => (
          <>
            {menu}
            <Divider
              style={{
                margin: "8px 0",
              }}
            />
            <Space
              style={{
                padding: "0 8px 4px",
              }}
            >
              <Input
                placeholder="新增参数"
                value={name}
                onChange={onNameChange}
                onKeyDown={(e) => e.stopPropagation()}
              />
              <Button
                type="text"
                icon={<PlusOutlined />}
                style={{ padding: 5 }}
                onClick={addItem}
              >
                新增
              </Button>
            </Space>
          </>
        )}
      />
    </Form.Item>
  );
};

export const FeedRobotModal = ({ open = false, f_form, onCancel }) => {
  const { 坩埚lotNo = "" } = f_form.getFieldsValue();
  const { 熔融机号 = "", 产品图号 = "" } = JSON.parse(getSession("record"));
  const [form] = Form.useForm();

  const tuliao_list = [
    "再生砂LotNo",
    "再生砂重量",
    "外层LotNo",
    "外层重量",
    "中外LotNo",
    "中外重量",
    "中内LotNo",
    "中内重量",
    "内层LotNo",
    "内层重量",
  ];
  const requestData = () => {
    const { 第三层砂 = "" } = form.getFieldsValue();
    getTouliaoData({ 设备号: 熔融机号, 第三层砂 }, (res) => {
      const { code, msg, data } = res.data;
      if (code === 0 && data) {
        console.log(data);
        //  设置到form中
        form.setFieldsValue(data);
      } else {
        form.resetFields();
      }
    });
  };
  const handleOk = () => {
    const { 产品图号, 批号, 第三层砂, ...param } = form.getFieldsValue();
    f_form.setFieldsValue(param);
    onCancel();
  };
  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        产品图号: 产品图号,
        批号: 坩埚lotNo,
      });
      requestData();
    }
  }, [open]);
  return (
    <Modal
      title="投料机器人"
      open={open}
      onCancel={onCancel}
      onOk={handleOk}
      destroyOnHidden={true}
      width={800}
      footer={null}
    >
      <Form
        form={form}
        {...ComputeFormCol(6)}
        style={{ padding: 10 }}
        initialValues={{
          第三层砂: "中外",
          产品图号: "",
          批号: "",
        }}
      >
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Form.Item label="产品图号" name="产品图号">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="批号" name="批号">
              <Input disabled />
            </Form.Item>
          </Col>
          {tuliao_list.map((item, _) => (
            <Col span={12} key={_}>
              <Form.Item label={item} name={item}>
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
          ))}
          <Col span={12}>
            <Form.Item label="第三层砂" name="第三层砂">
              <Radio.Group
                options={selectList2Option(["中外", "中内", "中外、中内"])}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Flex justify="end" gap={20}>
              <Button onClick={requestData}>重置</Button>
              <Button type="primary" onClick={handleOk}>
                填入
              </Button>
            </Flex>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

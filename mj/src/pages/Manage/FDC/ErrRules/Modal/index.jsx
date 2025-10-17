import React, { useEffect } from "react";
import {
  Checkbox,
  Col,
  Form,
  Input,
  Modal,
  Radio,
  Row,
  Select,
  Switch,
} from "antd";
import { ComputeFormCol } from "../../../../../utils/obj";
import { selectList2Option } from "../../../../../utils/string";
import { InputNumber } from "antd";
import { useState } from "react";
import {
  createAbnormalRule,
  updateAbnormalRule,
} from "../../../../../apis/fdc_api";
import { message } from "antd";

export const RuleModal = ({
  open = false,
  data = {},
  onCancel,
  requestData,
  opt_obj = {},
}) => {
  const default_form_data = {
    工厂: "",
    车间: "",
    工序: "",
    设备: "",
    point_position_info_id: "",
    related_field_id: null,
    基准类型: "固定",
    限制类型: "百分比",
    规则名: "",
    上限: 0,
    基准: 0,
    下限: 0,
    报警等级: "一般",
    状态: 1,
  };
  const [form] = Form.useForm();
  const [process_list, setProcessList] = useState([]);
  const [dev_list, setDevList] = useState([]);
  const [param_list, setParamList] = useState([]);
  const handleOk = async () => {
    let val = await form.validateFields();
    if (data["name"] === "新增") {
      createAbnormalRule(
        val,
        (res) => {
          const { code, msg } = res.data;
          if (code === 200) {
            message.success("添加成功");
            onCancel();
            requestData();
          } else {
            message.error(msg);
          }
        },
        () => {
          message.error("网络错误");
        }
      );
    } else {
      const { id } = data["record"];
      val["id"] = id;
      updateAbnormalRule(
        val,
        (res) => {
          const { code, msg } = res.data;
          if (code === 200) {
            message.success("修改成功");
            onCancel();
            requestData();
          } else {
            message.error(msg);
          }
        },
        () => {
          message.error("网络错误");
        }
      );
    }
  };
  useEffect(() => {
    const { 工序 = [] } = opt_obj;
    let p = 工序.map((e) => e.name);
    setProcessList(p);
  }, [opt_obj]);
  useEffect(() => {
    if (open) {
      const { name = "新增", record = {} } = data;
      setDevList([]);
      setParamList([]);
      if (name === "新增") {
        form.resetFields();
      } else {
        form.setFieldsValue(record);
        // 把参数列表添加进去
        const { 工序 = "", 设备 = "" } = record;
        let temp = opt_obj["工序"].find((e) => e.name === 工序);
        const { dev_list = [] } = temp;
        let temp1 = dev_list.find((e) => e.设备 === 设备);
        const { 参数 = [], ids = [] } = temp1;
        let param_list = 参数.map((e, _) => ({
          label: e,
          value: ids[_],
        }));
        setParamList(param_list);
      }
    }
  }, [open]);
  return (
    <Modal
      title={`${data["name"]}异常规则`}
      open={open}
      onCancel={onCancel}
      getContainer={false}
      destroyOnHidden={true}
      onOk={handleOk}
      width={600}
    >
      <Form
        form={form}
        initialValues={default_form_data}
        {...ComputeFormCol(8)}
        style={{ marginTop: 20 }}
      >
        <Row gutter={[16, 16]}>
          {["工厂", "车间"].map((item) => (
            <Col span={12} key={item}>
              <Form.Item name={item} label={item} rules={[{ required: true }]}>
                <Select
                  options={selectList2Option(opt_obj[item])}
                  disabled={data["name"] === "编辑"}
                />
              </Form.Item>
            </Col>
          ))}
          <Col span={12}>
            <Form.Item name="工序" label="工序" rules={[{ required: true }]}>
              <Select
                options={selectList2Option(process_list)}
                onChange={(val) => {
                  const { 工序 = [] } = opt_obj;
                  setParamList([]);
                  let temp = 工序.find((e) => e.name === val);
                  if (temp) {
                    let d = temp["dev_list"].map((e) => e.设备);
                    setDevList(d);
                  } else {
                    setDevList([]);
                  }
                }}
                disabled={data["name"] === "编辑"}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="设备" label="设备" rules={[{ required: true }]}>
              <Select
                options={selectList2Option(dev_list)}
                onChange={(val) => {
                  const { 工序 = [] } = opt_obj;
                  form.setFieldsValue({
                    point_position_info_id: "",
                    related_field_id: null,
                  });
                  let craft = form.getFieldValue("工序");
                  let temp = 工序.find((e) => e.name === craft);
                  const { dev_list = [] } = temp;
                  let temp1 = dev_list.find((e) => e.设备 === val);
                  const { 参数 = [], ids = [] } = temp1;
                  let param_list = 参数.map((e, _) => ({
                    label: e,
                    value: ids[_],
                  }));
                  setParamList(param_list);
                }}
                disabled={data["name"] === "编辑"}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="point_position_info_id"
              label="参数"
              rules={[{ required: true }]}
            >
              <Select options={param_list} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="related_field_id" label="相关点位">
              <Select options={param_list} allowClear />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="基准类型" label="基准类型">
              <Radio.Group options={selectList2Option(["固定", "非固定"])} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="限制类型" label="限制类型">
              <Radio.Group
                options={selectList2Option(["百分比", "绝对值", "无"])}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="规则名"
              label="规则名"
              rules={[{ required: true }]}
            >
              <Input placeholder="请输入" />
            </Form.Item>
          </Col>
          {["上限", "基准", "下限"].map((item) => (
            <Col span={12} key={item}>
              <Form.Item name={item} label={item}>
                <InputNumber placeholder="请输入" style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          ))}
          <Col span={12}>
            <Form.Item name="报警等级" label="报警等级">
              <Select options={selectList2Option(opt_obj["报警等级"])} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="状态"
              label="状态"
              normalize={(value) => (value ? 1 : 0)}
            >
              <Switch />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

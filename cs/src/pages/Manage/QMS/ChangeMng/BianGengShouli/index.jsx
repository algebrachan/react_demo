import React, { useEffect, useState, useRef } from "react";
import {
  Button,
  Form,
  Input,
  Space,
  Checkbox,
  Radio,
  Select,
  Flex,
  message,
  Spin,
} from "antd";
import { ComputeFormCol } from "../../../../../utils/obj";
import { selectList2Option } from "../../../../../utils/string";
import {
  qmsGetAcceptance,
  qmsPostAcceptance,
  qmsPutAcceptance,
} from "../../../../../apis/qms_router";

function BianGengShouli({ activeKey }) {
  const init_form_data = {
    number: "",
    rationality: true,
    rationality_reason: "",
    level: "",
    changeHuiqian: [],
    charge_charge_person: "",
    GMOpinion: false,
    GMOpinionReason: "",
    recipient_approval: "",
  };
  const [load, setLoad] = useState(false);
  const [form] = Form.useForm();
  const query = () => {
    const { number } = form.getFieldsValue();
    setLoad(true);

    // 使用新的接口函数
    qmsGetAcceptance(
      { number },
      (res) => {
        setLoad(false);
        const { code, msg, data } = res.data;
        if (code === 200 && data) {
          // message.success(msg);
          form.setFieldsValue({ ...init_form_data, ...data, number });
        } else {
          form.setFieldsValue({ ...init_form_data, number });
        }
      },
      () => {
        setLoad(false);
        message.error("查询失败");
      }
    );
  };
  const post = async () => {
    const values = await form.validateFields();
    const param = {
      ...init_form_data,
      ...values,
    };
    qmsPostAcceptance(
      param,
      (res) => {
        const { code, msg, data } = res.data;
        if (code === 200) {
          message.success("提交成功");
        } else {
          message.error(msg);
        }
      },
      () => {
        message.error("提交失败");
      }
    );
  };
  const put = async () => {
    const values = await form.validateFields();
    const param = {
      ...init_form_data,
      ...values,
    };
    qmsPutAcceptance(
      param,
      (res) => {
        const { code, msg, data } = res.data;
        if (code === 200) {
          message.success("提交成功");
        } else {
          message.error(msg);
        }
      },
      () => {
        message.error("提交失败");
      }
    );
  };
  useEffect(() => {
    form.setFieldsValue({ number: activeKey });
    if (activeKey) {
      query();
    }
  }, [activeKey]);
  return (
    <Spin spinning={load}>
      <Form form={form} {...ComputeFormCol(2)} initialValues={init_form_data}>
        <Flex vertical gap={16}>
          <Form.Item
            label="变更单号"
            name="number"
            rules={[{ required: true, message: "请选择变更单号" }]}
          >
            <Input placeholder="请选择变更单号" disabled />
          </Form.Item>
          <Form.Item label="变更合理性" name="rationality">
            <Radio.Group
              options={[
                { label: "合理", value: true },
                { label: "不合理", value: false },
              ]}
            />
          </Form.Item>
          <Form.Item
            noStyle
            shouldUpdate={(prev, current) =>
              prev.rationality !== current.rationality
            }
          >
            {({ getFieldValue }) =>
              !getFieldValue("rationality") && (
                <Form.Item
                  label="不合理原因"
                  name="rationality_reason"
                  rules={[{ required: true }]}
                >
                  <Input.TextArea placeholder="不合理原因" />
                </Form.Item>
              )
            }
          </Form.Item>
          <Form.Item label="变更等级" name="level" rules={[{ required: true }]}>
            <Select
              options={selectList2Option(["A", "B", "C", "D", "E"])}
              style={{ width: 100 }}
            />
          </Form.Item>
          <Form.Item
            label="变更负责人"
            name="charge_charge_person"
            rules={[{ required: true, message: "请输入编号" }]}
          >
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item label="会签部门" name="changeHuiqian">
            <Checkbox.Group
              options={selectList2Option([
                "研发技术部",
                "长晶生产车间",
                "原料合成车间",
                "质量管理部",
                "销售部",
                "设备动力科",
                "人力资源部",
                "坩埚车间",
                "制造部",
                "采购部",
                "PMC",
                "安环部",
                "财务部",
                "计划部",
              ])}
            />
          </Form.Item>
          <Form.Item label="总经理审批" name="GMOpinion">
            <Radio.Group
              options={[
                { label: "是", value: true },
                { label: "否", value: false },
              ]}
            />
          </Form.Item>
          <Form.Item
            noStyle
            shouldUpdate={(prev, current) =>
              prev.GMOpinion !== current.GMOpinion
            }
          >
            {({ getFieldValue }) =>
              getFieldValue("GMOpinion") && (
                <Form.Item
                  label="原因"
                  name="GMOpinionReason"
                  rules={[{ required: true }]}
                >
                  <Input.TextArea placeholder="原因" />
                </Form.Item>
              )
            }
          </Form.Item>
          <Form.Item
            label="受理人审批"
            name="recipient_approval"
            rules={[{ required: true, message: "请输入" }]}
          >
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
            <Space size={20}>
              <Button type="primary" onClick={query}>
                查询
              </Button>
              <Button onClick={put}>修改</Button>
              <Button onClick={post}>提交</Button>
            </Space>
          </Form.Item>
        </Flex>
      </Form>
    </Spin>
  );
}

export default BianGengShouli;

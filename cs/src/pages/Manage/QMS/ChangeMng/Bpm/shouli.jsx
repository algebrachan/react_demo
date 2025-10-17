import React, { useEffect, useState, useRef } from "react";
import {
  Button,
  Form,
  Input,
  Card,
  Checkbox,
  Radio,
  Select,
  Flex,
  message,
  Spin,
  AutoComplete,
} from "antd";
import { ComputeFormCol } from "@/utils/obj";
import { selectList2Option } from "@/utils/string";
import { qmsPostAcceptance } from "@/apis/qms_router";
import { useSelector } from "react-redux";
import { DeparmentList } from "./common";

function Shouli({
  id = "",
  review_data = {},
  disabled = false,
  reFresh = () => {},
}) {
  const default_form_data = {
    rationality_reason: "",
    rationality: true,
    level: "",
    changeHuiqian: [],
    charge_charge_person: "",
    GMOpinion: false,
    GMOpinionReason: "",
    recipient_approval: "",
  };
  const { user_list } = useSelector((state) => state.mng.qms);
  const [load, setLoad] = useState(false);
  const [form] = Form.useForm();
  const heli = Form.useWatch("rationality", form);
  const post = async () => {
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
      ...default_form_data,
      ...values,
      number: id,
    };
    setLoad(true);
    qmsPostAcceptance(
      param,
      (res) => {
        setLoad(false);
        const { code, msg, data } = res.data;
        if (code === 200) {
          message.success("提交成功");
          reFresh();
        }
      },
      () => {
        setLoad(false);
      }
    );
  };
  useEffect(() => {
    if (review_data) {
      form.setFieldsValue(review_data);
    } else {
      form.resetFields();
    }
  }, [review_data]);
  return (
    <Flex vertical gap={16}>
      <div className="no_review_title">变更受理</div>
      <Card>
        <Spin spinning={load}>
          <Form
            form={form}
            {...ComputeFormCol(3)}
            initialValues={default_form_data}
            disabled={disabled}
          >
            <Flex vertical gap={16}>
              <Form.Item label="变更合理性" name="rationality">
                <Radio.Group
                  id="rationality"
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
                      <Input.TextArea
                        id="rationality_reason"
                        placeholder="不合理原因"
                      />
                    </Form.Item>
                  )
                }
              </Form.Item>
              <Form.Item label="变更等级" name="level">
                <Select
                  id="level"
                  options={selectList2Option(["A", "B", "C", "D", "E"])}
                  style={{ width: 100 }}
                />
              </Form.Item>
              <Form.Item
                label="变更负责人"
                name="charge_charge_person"
                rules={heli ? [{ required: true }] : []}
              >
                <Input id="charge_charge_person" placeholder="请输入" />
              </Form.Item>
              <Form.Item
                label="会签部门"
                name="changeHuiqian"
                rules={heli ? [{ required: true }] : []}
              >
                <Checkbox.Group
                  id="changeHuiqian"
                  options={selectList2Option(DeparmentList)}
                />
              </Form.Item>
              <Form.Item label="总经理审批" name="GMOpinion">
                <Radio.Group
                  id="GMOpinion"
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
                      rules={heli ? [{ required: true }] : []}
                    >
                      <Input.TextArea id="GMOpinionReason" placeholder="原因" />
                    </Form.Item>
                  )
                }
              </Form.Item>
              <Form.Item
                label="受理人审批"
                name="recipient_approval"
                rules={heli ? [{ required: true }] : []}
              >
                <AutoComplete options={selectList2Option(user_list)} />
              </Form.Item>
              <Flex justify="end">
                <Button type="primary" onClick={post}>
                  提交
                </Button>
              </Flex>
            </Flex>
          </Form>
        </Spin>
      </Card>
    </Flex>
  );
}

export default Shouli;

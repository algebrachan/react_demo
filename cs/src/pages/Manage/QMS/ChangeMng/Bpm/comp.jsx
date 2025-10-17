import React, { useEffect, useState } from "react";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import {
  Card,
  Flex,
  Form,
  Modal,
  Spin,
  Input,
  Space,
  Button,
  message,
} from "antd";
import { changeProcess } from "../../../../../apis/nc_review_router";

export const ApprovalTech = ({
  id = "",
  review_data = {},
  disabled = false,
  reFresh = () => {},
  node = "",
}) => {
  const [form] = Form.useForm();
  const [reject_form] = Form.useForm();
  const [load, setLoad] = useState(false);
  const [modal, contextHolder] = Modal.useModal();
  const submit = async (opt) => {
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
    if (opt === "驳回" && values["reason"] === "") {
      message.warning("请输入驳回原因");
      return;
    }
    values["number"] = id;
    values["status"] = opt;
    values["node"] = node;
    setLoad(true);
    changeProcess(
      values,
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
  // const handleReject = () => {
  //   reject_form.resetFields();
  //   modal.confirm({
  //     title: "驳回原因",
  //     icon: <ExclamationCircleOutlined />,
  //     content: (
  //       <Form form={reject_form}>
  //         <Form.Item
  //           name="rejectReason"
  //           rules={[{ required: true, message: "请输入驳回理由" }]}
  //         >
  //           <Input.TextArea placeholder="请详细描述驳回原因" rows={4} />
  //         </Form.Item>
  //       </Form>
  //     ),
  //     onOk: () => {
  //       reject_form
  //         .validateFields(["rejectReason"])
  //         .then((values) => {
  //           submit("驳回", values.rejectReason);
  //         })
  //         .catch((e) => message.error("请输入原因"));
  //     },
  //     okText: "确认驳回",
  //     cancelText: "取消",
  //     okButtonProps: { danger: true },
  //   });
  // };
  useEffect(() => {
    if (review_data) {
      form.setFieldsValue({ 签名: review_data[node] || "" });
    }
  }, [review_data]);

  return (
    <Flex vertical gap={16}>
      {contextHolder}
      <div className="no_review_title">{node}</div>
      <Card>
        <Spin spinning={load}>
          <Form
            form={form}
            initialValues={{
              签名: "",
              reason: "",
            }}
            disabled={disabled}
          >
            <Flex vertical gap={20}>
              <Form.Item label="原因" name="reason">
                <Input style={{ width: 200 }} />
              </Form.Item>
              <Form.Item label="签名" name="签名" rules={[{ required: true }]}>
                <Input style={{ width: 200 }} />
              </Form.Item>
              <Space>
                <Button type="primary" onClick={() => submit("通过")}>
                  通过
                </Button>
                <Button type="primary" onClick={() => submit("同意报总经理")}>
                  同意报总经理
                </Button>
                <Button type="primary" danger onClick={() => submit("驳回")}>
                  驳回
                </Button>
              </Space>
            </Flex>
          </Form>
        </Spin>
      </Card>
    </Flex>
  );
};

export const VpReview = ({
  id = "",
  review_data = {},
  disabled = false,
  reFresh = () => {},
  node = "",
  is_vp = false,
}) => {
  const [form] = Form.useForm();
  const [reject_form] = Form.useForm();
  const [load, setLoad] = useState(false);
  const [modal, contextHolder] = Modal.useModal();
  const submit = async (opt) => {
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
    if (opt === "驳回" && values["reason"] === "") {
      message.warning("请输入驳回原因");
      return;
    }
    values["number"] = id;
    values["status"] = opt;
    values["node"] = node;
    setLoad(true);
    changeProcess(
      values,
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
  // const handleReject = () => {
  //   reject_form.resetFields();
  //   modal.confirm({
  //     title: "驳回原因",
  //     icon: <ExclamationCircleOutlined />,
  //     content: (
  //       <Form form={reject_form}>
  //         <Form.Item
  //           name="rejectReason"
  //           rules={[{ required: true, message: "请输入驳回理由" }]}
  //         >
  //           <Input.TextArea placeholder="请详细描述驳回原因" rows={4} />
  //         </Form.Item>
  //       </Form>
  //     ),
  //     onOk: () => {
  //       reject_form
  //         .validateFields(["rejectReason"])
  //         .then((values) => {
  //           submit("驳回", values.rejectReason);
  //         })
  //         .catch((e) => message.error("请输入原因"));
  //     },
  //     okText: "确认驳回",
  //     cancelText: "取消",
  //     okButtonProps: { danger: true },
  //   });
  // };
  useEffect(() => {
    if (review_data) {
      form.setFieldsValue({ 签名: review_data[node] || "" });
    }
  }, [review_data]);
  return (
    <Flex vertical gap={16}>
      {contextHolder}
      <div className="no_review_title">{node}</div>
      <Card>
        <Spin spinning={load}>
          <Form
            form={form}
            initialValues={{
              签名: "",
              reason: "",
            }}
            disabled={disabled}
          >
            <Flex vertical gap={20}>
              <Form.Item label="原因" name="reason">
                <Input style={{ width: 200 }} />
              </Form.Item>
              {!is_vp && (
                <Form.Item
                  label="签名"
                  name="签名"
                  rules={[{ required: true }]}
                >
                  <Input style={{ width: 200 }} />
                </Form.Item>
              )}
              <Space>
                <Button type="primary" onClick={() => submit("通过")}>
                  通过
                </Button>
                <Button type="primary" danger onClick={() => submit("驳回")}>
                  驳回
                </Button>
              </Space>
            </Flex>
          </Form>
        </Spin>
      </Card>
    </Flex>
  );
};

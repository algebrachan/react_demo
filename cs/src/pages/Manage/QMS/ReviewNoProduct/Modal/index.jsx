import React, { useEffect } from "react";
import { Form, Modal, Row, Col, message } from "antd";
import { GenerateFormItem } from "@/utils/obj";
import { ComputeFormCol } from "@/utils/obj";
import { createReviews } from "../../../../../apis/qms_router";

export const CreatNoP = ({ open, onCancel, requestData }) => {
  const [form] = Form.useForm();
  const default_form_data = {
    编号: "",
    主题: "",
    产品名称: "",
    规格: "",
    物料编号: "",
    批次号: "",
    批次总数量: "",
    不合格数量: "",
    单位: "",
    检验员: "",
    检验日期: "",
  };
  const formItems = [
    {
      label: "编号",
      name: "编号",
      type: "input",
      disabled: true,
      placeholder: "编号自动生成",
    },
    {
      label: "主题",
      name: "主题",
      type: "input",
      required: true,
    },
    {
      label: "产品名称",
      name: "产品名称",
      type: "input",
      required: true,
    },
    {
      label: "规格",
      name: "规格",
      type: "input",
      required: true,
    },
    {
      label: "物料编号",
      name: "物料编号",
      type: "input",
      required: true,
    },
    {
      label: "批次号",
      name: "批次号",
      type: "input",
      required: true,
    },
    {
      label: "批次总数量",
      name: "批次总数量",
      type: "input_number",
      required: true,
    },
    {
      label: "不合格数量",
      name: "不合格数量",
      type: "input_number",
      required: true,
    },
    {
      label: "单位",
      name: "单位",
      type: "input",
      required: true,
    },
    {
      label: "检验员",
      name: "检验员",
      type: "input",
      required: true,
    },
    {
      label: "检验日期",
      name: "检验日期",
      type: "time",
      required: true,
    },
  ];

  const handleOk = async () => {
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
    createReviews(
      values,
      (res) => {
        const { code, data, msg } = res.data;
        if (code === 0) {
          message.success("提交成功");
          requestData();
          onCancel();
        } else {
          message.error(msg);
        }
      },
      () => {
        message.error("不合格评审，提交失败");
      }
    );
  };
  useEffect(() => {
    if (open) {
      form.resetFields();
    }
  }, [open]);
  return (
    <Modal
      title="手动发起不合格"
      open={open}
      onCancel={onCancel}
      onOk={handleOk}
      width={900}
    >
      <Form
        {...ComputeFormCol(6)}
        form={form}
        initialValues={default_form_data}
      >
        <Row gutter={[10, 10]}>
          {formItems.map((item) => (
            <Col span={12} key={item.name}>
              <GenerateFormItem item={item} />
            </Col>
          ))}
        </Row>
      </Form>
    </Modal>
  );
};

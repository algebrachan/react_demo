import React, { useEffect } from "react";
import { CommonCard } from "../../../../../../components/CommonCard";
import { Button, Checkbox, Flex, Form, Input, message, Radio } from "antd";
import { qmsStep2 } from "../../../../../../apis/qms_router";

function PhenomenonDesc({ id = "", data = null, refresh = () => {} }) {
  const [form] = Form.useForm();
  const submit = async () => {
    let val = await form.validateFields();

    qmsStep2(
      {
        review_id: id,
        description: {
          location: val["不合格品发生地"],
          description: val["现象描述"],
        },
      },
      (res) => {
        const { code, data, msg } = res.data;
        if (code === 0 && data) {
          message.success("提交成功");
          refresh();
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
    if (data) {
      form.setFieldsValue({
        不合格品发生地: data?.location,
        现象描述: data?.description,
      });
    }
  }, [data]);
  return (
    <CommonCard name="现象描述">
      <Form
        form={form}
        initialValues={{ 不合格品发生地: "", 现象描述: "" }}
        layout="vertical"
      >
        <Form.Item
          label="不合格品发生地"
          name="不合格品发生地"
          rules={[{ required: true }]}
        >
          <Radio.Group options={["来料", "生产工序", "出货", "仓库", "其他"]} />
        </Form.Item>
        <Form.Item
          label="现象描述"
          name="现象描述"
          rules={[{ required: true }]}
        >
          <Input.TextArea
            autoSize={{ minRows: 2, maxRows: 6 }}
            style={{ background: "rgb(250, 250, 250)" }}
          />
        </Form.Item>
        {/* <Flex justify="end" style={{ marginTop: 10 }}>
          <Button type="primary" onClick={submit}>
            确认
          </Button>
        </Flex> */}
      </Form>
    </CommonCard>
  );
}

export default PhenomenonDesc;

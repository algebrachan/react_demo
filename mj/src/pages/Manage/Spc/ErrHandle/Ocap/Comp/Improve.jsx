import React from "react";
import { CommonCard } from "../../../../../../components/CommonCard";
import { Button, Flex, Form, Input } from "antd";

function Improve({ id = "" }) {
  const [form] = Form.useForm();
  return (
    <CommonCard name="改善后首个批号">
      <Form form={form} component={false}>
        <Flex gap={20}>
        <Form.Item name="批号" label="批号">
          <Input placeholder="请输入" style={{ width: 200 }} />
        </Form.Item>
        <Button type="primary">提交</Button>
        </Flex>
      </Form>
    </CommonCard>
  );
}

export default Improve;

import { Button, Col, Flex, Form, Input, Modal, Row, Space, Table } from "antd";
import React from "react";
import { GeneralCard } from "../../../../../components/CommonCard";
import { ComputeFormCol } from "../../../../../utils/obj";

export const SpcModal = ({ open, onCancel }) => {
  const [form1] = Form.useForm();
  const [form2] = Form.useForm();
  const [form3] = Form.useForm();
  const form_label1 = [
    "数据库类型",
    "用户名",
    "密码",
    "地址",
    "端口号",
    "数据库源字符集",
    "数据库目标字符集",
    "最大连接数",
    "连接等待时间",
    "校验语句",
    "描述",
  ];
  return (
    <Modal
      title="筛选条件编辑"
      open={open}
      onCancel={onCancel}
      onOk={onCancel}
      destroyOnHidden={true}
      width={1200}
      style={{
        top: 20,
      }}
    >
      <Row gutter={[10, 16]}>
        <Col span={8}>
          <GeneralCard name="参数设置">
            <Form form={form1} {...ComputeFormCol(8)} style={{ padding: 8 }}>
              <Flex vertical gap={8}>
                {form_label1.map((item, _) => (
                  <Form.Item name={item} label={item} key={_} initialValue={""}>
                    <Input placeholder="请输入" />
                  </Form.Item>
                ))}
                <Flex justify="end">
                  <Space>
                    <Button type="primary" onClick={() => form1.resetFields()}>
                      重置
                    </Button>
                    <Button type="primary">连接数据源</Button>
                  </Space>
                </Flex>
              </Flex>
            </Form>
          </GeneralCard>
        </Col>
        <Col span={8}>
          <GeneralCard name="数据库/数据表绑定"></GeneralCard>
        </Col>
        <Col span={8}>
          <GeneralCard name="筛选内容编辑"></GeneralCard>
        </Col>
        <Col span={24}>
          <Table />
        </Col>
      </Row>
    </Modal>
  );
};

import { Button, Col, Descriptions, Flex, Form, Input, Modal, Row, Space, Table } from "antd";
import React, { Children, useEffect, useState } from "react";
import { GeneralCard } from "../../../../../components/CommonCard";
import { ComputeFormCol } from "../../../../../utils/obj";
import { detailedFurnaceInfo } from "../../../../../apis/anls_router";

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

export const InfoModal = ({ open, onCancel, fur }) => {
  const [context, setContext] = useState("");
  const [desc_out,setDescOut] =  useState([]);
  const [desc_in,setDescIn] =  useState([]);
  const requestData = () => {
    detailedFurnaceInfo({ 炉次号:fur }, (res) => {
      const { code, msg, data } = res.data;
      if (code === 0 && data) {
        const {内场数据=[{}],外场数据=[{}]} = data;
        let out_list = Object.keys(外场数据[0]).map((key,_) => ({key:_, label: key, children: 外场数据[0][key] }))
        let in_list = Object.keys(内场数据[0]).map((key,_) => ({ key:_,label: key, children: 内场数据[0][key] }))
        setDescOut(out_list);
        setDescIn(in_list);
      } else {
        setDescOut([]);
        setDescIn([]);
      }
    });
  };
  useEffect(() => {
    if (open) {
      requestData();
    }
  }, [open]);
  return (
    <Modal
      title="上下游数据"
      open={open}
      onCancel={onCancel}
      onOk={onCancel}
      destroyOnHidden={true}
      width={1600}
      footer={() => (
        <Button type="primary" onClick={onCancel}>
          确认
        </Button>
      )}
    >
      {/* <div
        style={{
          wordWrap: "break-word",
          whiteSpace: "pre-wrap",
          maxHeight: 600,
          overflowY: "auto",
        }}
      >
         {JSON.stringify(context, null, 2)}
      </div> */}
      <Flex gap={16} vertical>
      <Descriptions size="small" column={12} title="内场数据" layout="vertical" bordered items={desc_in} />
      <Descriptions size="small" column={12} title="外场数据" layout="vertical" bordered items={desc_out} />
      </Flex>
    </Modal>
  );
};

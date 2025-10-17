import React, { useEffect, useState } from "react";
import {
  Button,
  Descriptions,
  Flex,
  Form,
  Input,
  message,
  Modal,
  Select,
  Space,
  Table,
} from "antd";
import upgradeImg from "../../../../../../assets/ocap/upgrade.png";
import warnImg from "../../../../../../assets/ocap/warn.png";
import dealwithImg from "../../../../../../assets/ocap/dealwith.png";
import {
  handleLotnumber,
  lotnumberLevelUp,
} from "../../../../../../apis/ocap_api";
import "./comp.less";
import { ComputeFormCol } from "../../../../../../utils/obj";
import { selectList2Option } from "../../../../../../utils/string";
const { TextArea } = Input;

const UpgradeModal = ({ open = false, onCancel, requestData, data }) => {
  const [form] = Form.useForm();
  const handleOk = async () => {
    let val = await form.validateFields();
    const { 密码 = "" } = val;
    if (密码 !== "1234.com") {
      message.error("密码错误");
      return;
    }
    const param = { ...data, ...val };
    lotnumberLevelUp(
      param,
      (res) => {
        const { data, code, msg } = res.data;
        if (code === 0 && data) {
          message.success("操作成功");
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
      form.resetFields();
    }
  }, [open]);

  return (
    <Modal
      title="确认升级"
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      okText="确定"
      cancelText="取消"
      width={400}
    >
      <Flex vertical gap={10} style={{ padding: "10px 0" }}>
        <div style={{ color: "#777", fontSize: 16 }}>是否升级此异常?</div>
        <Form form={form} initialValues={{ 密码: "" }}>
          <Form.Item
            name="密码"
            label="密码验证"
            rules={[{ required: true, message: "请输入密码!" }]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Flex>
    </Modal>
  );
};
const DealwithModal = ({ open = false, onCancel, requestData, data = {} }) => {
  const [form] = Form.useForm();
  const items = [
    {
      key: "1",
      label: "异常批号",
      children: data["异常批号"],
    },
    {
      key: "2",
      label: "基础信息",
      children: data["基础信息"],
    },
    {
      key: "3",
      label: "超限值",
      children: data["超限值"],
    },
  ];
  const handleOk = async () => {
    let val = await form.validateFields();
    const { 密码 = "" } = val;
    if (密码 !== "1234.com") {
      message.error("密码错误");
      return;
    }
    const param = { ...data, ...val };
    handleLotnumber(
      param,
      (res) => {
        const { data, code, msg } = res.data;
        if (code === 0 && data) {
          message.success("操作成功");
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
      form.resetFields();
      form.setFieldsValue({ 处理方式: data["处理方式"] });
    }
  }, [open]);

  return (
    <Modal
      title="确认升级"
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      okText="确定"
      cancelText="取消"
      width={560}
    >
      <Form form={form} initialValues={{ 处理方式: "", 密码: "" }}>
        <Flex vertical gap={16} style={{ padding: "10px 0" }}>
          <Descriptions size="large" items={items} />
          <Form.Item
            name="处理方式"
            label="处理方式"
            rules={[{ required: true }]}
            {...ComputeFormCol(4)}
          >
            <Select
              options={selectList2Option(["特采", "改型", "返工"])}
              placeholder="请选择"
            />
          </Form.Item>
          <Form.Item
            name="处理意见"
            label="处理意见"
            {...ComputeFormCol(4)}
            rules={[{ required: true }]}
          >
            <TextArea
              autoSize={{ minRows: 2, maxRows: 6 }}
              placeholder="请输入"
            />
          </Form.Item>
          <Form.Item
            name="密码"
            label="密码验证"
            rules={[{ required: true, message: "请输入密码!" }]}
            {...ComputeFormCol(4)}
          >
            <Input.Password />
          </Form.Item>
        </Flex>
      </Form>
    </Modal>
  );
};

function ErrProduct({ err_list = [], queryErrList = () => {}, id = "" }) {
  const [cur_data, setCurData] = useState({});
  const [is_upgrade, setIsUpgrade] = useState(false);
  const [is_dealwith, setIsDealwith] = useState(false);

  const pagination = () => {
    return {
      position: ["bottomCenter"],
      total: err_list.length,
      showTotal: (total) => `共 ${total} 条`,
      showQuickJumper: true,
      showSizeChanger: true,
      defaultPageSize: 20,
    };
  };
  const columns = [
    {
      title: "编号",
      dataIndex: "key",
      key: "key",
      width: 100,
    },
    {
      title: "异常批号",
      dataIndex: "异常批号",
      key: "异常批号",
      width: 160,
    },
    {
      title: "基础信息",
      dataIndex: "基础信息",
      key: "基础信息",
      width: 160,
      render: (text) => (text ? text : <span>------</span>),
    },
    {
      title: "美晶内控上限",
      dataIndex: "美晶内控上限",
      key: "美晶内控上限",
      width: 160,
    },
    {
      title: "美晶内控下限",
      dataIndex: "美晶内控下限",
      key: "美晶内控下限",
      width: 160,
    },
    {
      title: "超限值",
      dataIndex: "超限值",
      key: "超限值",
      width: 160,
    },
    {
      title: "处理方式",
      dataIndex: "处理方式",
      key: "处理方式",
      width: 160,
      render: (text) => {
        switch (text) {
          case "":
            return "";
          case "待评审":
            return (
              <Flex className="dealwith_orange" align="center">
                <img src={warnImg} />
                <span>待评审</span>
              </Flex>
            );
          default:
            return (
              <Flex className="dealwith_green" align="center">
                <img src={dealwithImg} />
                <span>{text}</span>
              </Flex>
            );
        }
      },
    },
    {
      title: "处理意见",
      dataIndex: "处理意见",
      key: "处理意见",
      render: (text) =>
        text ? text : <span style={{ color: "#8E8E93" }}>待填写</span>,
    },

    {
      title: "操作",
      key: "opt",
      fixed: "right",
      width: 160,
      render: (record) => (
        <Space size={15}>
          <Button
            type="link"
            style={{ padding: 0, fontWeight: 600 }}
            onClick={() => {
              setCurData({ _id: id, ...record });
              setIsDealwith(true);
            }}
          >
            处理
          </Button>
          <Button
            type="link"
            danger
            style={{ padding: 0, fontWeight: 600 }}
            icon={<img src={upgradeImg} />}
            onClick={() => {
              let val = { _id: id, 异常批号: record.异常批号 };
              setCurData(val);
              setIsUpgrade(true);
            }}
          >
            升级
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Table
        bordered
        size="small"
        columns={columns}
        dataSource={err_list}
        scroll={{
          x: "max-content",
          y: 200,
        }}
        pagination={pagination()}
        className="ocap_err_table"
      />
      <UpgradeModal
        data={cur_data}
        open={is_upgrade}
        onCancel={() => setIsUpgrade(false)}
        requestData={queryErrList}
      />
      <DealwithModal
        data={cur_data}
        open={is_dealwith}
        onCancel={() => setIsDealwith(false)}
        requestData={queryErrList}
      />
    </>
  );
}

export default ErrProduct;

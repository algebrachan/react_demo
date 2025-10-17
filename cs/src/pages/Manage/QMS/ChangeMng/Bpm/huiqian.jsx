import React, { useState, useEffect } from "react";
import { Form, Card, Button, message, Input, Radio, Table, Space } from "antd";
import { Flex } from "antd";
import { CommonEditTable } from "../../../../../utils/obj";
import {
  qmsPostChangeCountersignature,
  qmsPutChangeCountersignature,
} from "@/apis/qms_router";
import { Spin } from "antd";
// 定义影响相关的选项
export const Huiqian = ({
  name = "",
  id = "",
  review_data = null,
  disabled = false,
  reFresh = () => {},
}) => {
  const huiqian_obj = {
    会签评估: 1,
    部门会签测试: 2,
    部门会签结案: 3,
    部门会签跟踪: 4,
  };
  const [form] = Form.useForm();
  const [load, setLoad] = useState(false);
  const [tb_data, setTbData] = useState([]);
  const columns = [
    {
      title: "序号",
      dataIndex: "key",
      key: "key",
      width: 100,
      render: (_, __, index) => index + 1,
    },
    {
      title: "部门",
      dataIndex: "部门",
      key: "部门",
      width: 160,
    },
    {
      title: "意见",
      dataIndex: "意见",
      key: "意见",
      width: 160,
      render: (text, record, index) => (
        <Input
          style={{ width: "100%" }}
          value={text}
          placeholder="请输入"
          onChange={(e) => handleTableChange(e.target.value, "意见", index)}
        />
      ),
    },
    {
      title: "是否同意",
      dataIndex: "是否同意",
      key: "是否同意",
      width: 160,
      render: (text, record, index) => (
        <Radio.Group
          value={text}
          onChange={(e) => handleTableChange(e.target.value, "是否同意", index)}
          options={["同意", "驳回"]}
        />
      ),
    },
    {
      title: "签名",
      dataIndex: "签名",
      key: "签名",
      width: 160,
      render: (text, record, index) => (
        <Input
          style={{ width: "100%" }}
          value={text}
          placeholder="请输入"
          onChange={(e) => handleTableChange(e.target.value, "签名", index)}
        />
      ),
    },
    {
      title: "操作",
      key: "opt",
      width: 160,
      render: (_, record) => (
        <Space>
          {record["status"] === 1 ? (
            <Button
              color="default"
              variant="filled"
              onClick={() => handleSubmit(record)}
            >
              保存意见
            </Button>
          ) : (
            <Button
              color="primary"
              variant="solid"
              onClick={() => handleSubmit(record)}
            >
              保存意见
            </Button>
          )}
          {record["是否同意"] === "驳回" && (
            <Button
              type="primary"
              danger
              onClick={() => handleSubmit(record, 0)}
            >
              驳回上一步
            </Button>
          )}
        </Space>
      ),
    },
  ];
  const handleTableChange = (value, field, index) => {
    const newData = [...tb_data];
    if (newData[index]) {
      newData[index][field] = value;
      setTbData(newData);
    }
  };
  const handleSubmit = (record, step_opinion = 1) => {
    const { 序号, 部门, 意见, 是否同意, 签名 = "" } = record;
    if (!签名) {
      message.warning("签名不能为空");
      return;
    }
    const param = {
      number: id,
      typeof: huiqian_obj[name],
      step_opinion,
      序号,
      部门,
      意见,
      是否同意,
      签名,
    };
    setLoad(true);
    qmsPostChangeCountersignature(
      param,
      (res) => {
        setLoad(false);
        const { code, msg, data } = res.data;
        if (code === 200) {
          message.success("操作成功");
          reFresh();
        }
      },
      () => {
        setLoad(false);
      }
    );
  };

  const finalSubmit = async (status = "同意") => {
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
      number: id,
      typeof: huiqian_obj[name],
      final_conclusion: values["最终结论"],
      status,
    };
    setLoad(true);
    qmsPutChangeCountersignature(
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
      const { bodyData = [], final_conclusion } = review_data;
      form.setFieldsValue({ 最终结论: final_conclusion });
      let new_tb = bodyData.map(({ 是否同意, ...rest }, _) => ({
        key: _,
        是否同意: 是否同意 || "同意",
        ...rest,
      }));
      setTbData(new_tb);
    } else {
      setTbData([]);
    }
  }, [review_data]);
  return (
    <Flex vertical gap={16}>
      <div className="no_review_title">{name}</div>
      <Card>
        <Spin spinning={load}>
          <Form
            disabled={disabled}
            initialValues={{ 最终结论: "" }}
            form={form}
          >
            <Flex vertical gap={16}>
              <Table
                bordered
                dataSource={tb_data}
                columns={columns}
                pagination={false}
              />
              <Form.Item
                label="最终结论"
                name="最终结论"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Flex justify="end" gap={20}>
                <Button
                  type="primary"
                  danger
                  onClick={() => finalSubmit("驳回")}
                >
                  驳回
                </Button>
                <Button type="primary" onClick={() => finalSubmit("同意")}>
                  同意
                </Button>
              </Flex>
            </Flex>
          </Form>
        </Spin>
      </Card>
    </Flex>
  );
};
export const Huiqian1 = ({
  id = "",
  review_data = null,
  disabled = false,
  reFresh = () => {},
}) => {
  const [load, setLoad] = useState(false);
  const [tb_data, setTbData] = useState([]);

  const postChangeCountersignature = async () => {
    setLoad(true);
    let new_tb = tb_data.map(({ key, ...rest }, _) => ({
      ...rest,
    }));
    qmsPostChangeCountersignature(
      { number: id, bodyData: new_tb, typeof: 1 },
      (res) => {
        setLoad(false);
        const { code, msg, data } = res.data;
        if (code === 200) {
          message.success("修改成功");
          reFresh();
        }
      },
      () => {
        setLoad(false);
      }
    );
  };

  const columnsItems = [
    { name: "部门", type: "text" },
    { name: "意见", type: "input" },
    { name: "是否同意", type: "radio", opt: ["同意", "驳回"] },
    { name: "签名", type: "input" },
  ];

  useEffect(() => {
    if (review_data) {
      const { bodyData = [] } = review_data;
      let new_tb = bodyData.map(({ 是否同意, ...rest }, _) => ({
        key: _,
        是否同意: 是否同意 || "同意",
        ...rest,
      }));
      setTbData(new_tb);
    } else {
      setTbData([]);
    }
  }, [review_data]);
  return (
    <Flex vertical gap={16}>
      <div className="no_review_title">会签评估</div>
      <Card>
        <Spin spinning={load}>
          <Form disabled={disabled}>
            <Flex vertical gap={16}>
              <CommonEditTable
                dataSource={tb_data}
                setTbData={setTbData}
                is_del={false}
                columnsItems={columnsItems}
              />
              <Flex justify="end">
                <Button type="primary" onClick={postChangeCountersignature}>
                  提交
                </Button>
              </Flex>
            </Flex>
          </Form>
        </Spin>
      </Card>
    </Flex>
  );
};
export const Huiqian2 = ({
  id = "",
  review_data = null,
  disabled = false,
  reFresh = () => {},
}) => {
  const [load, setLoad] = useState(false);
  const [tb_data, setTbData] = useState([]);

  const postChangeCountersignature = async () => {
    setLoad(true);
    let new_tb = tb_data.map(({ key, ...rest }, _) => ({
      ...rest,
    }));
    qmsPostChangeCountersignature(
      { number: id, bodyData: new_tb, typeof: 2 },
      (res) => {
        setLoad(false);
        const { code, msg, data } = res.data;
        if (code === 200) {
          message.success("修改成功");
          reFresh();
        }
      },
      () => {
        setLoad(false);
      }
    );
  };

  const columnsItems = [
    { name: "部门", type: "text" },
    { name: "意见", type: "input" },
    { name: "是否同意", type: "radio", opt: ["同意", "驳回"] },
    { name: "签名", type: "input" },
  ];

  useEffect(() => {
    if (review_data) {
      const { bodyData = [] } = review_data;
      let new_tb = bodyData.map(({ 是否同意, ...rest }, _) => ({
        key: _,
        是否同意: 是否同意 || "同意",
        ...rest,
      }));
      setTbData(new_tb);
    } else {
      setTbData([]);
    }
  }, [review_data]);
  return (
    <Flex vertical gap={16}>
      <div className="no_review_title">部门会签测试</div>
      <Card>
        <Spin spinning={load}>
          <Form disabled={disabled}>
            <Flex vertical gap={16}>
              <CommonEditTable
                dataSource={tb_data}
                setTbData={setTbData}
                is_del={false}
                columnsItems={columnsItems}
              />
              <Flex justify="end">
                <Button type="primary" onClick={postChangeCountersignature}>
                  提交
                </Button>
              </Flex>
            </Flex>
          </Form>
        </Spin>
      </Card>
    </Flex>
  );
};
export const Huiqian3 = ({
  id = "",
  review_data = null,
  disabled = false,
  reFresh = () => {},
}) => {
  const [load, setLoad] = useState(false);
  const [tb_data, setTbData] = useState([]);

  const postChangeCountersignature = async () => {
    setLoad(true);
    let new_tb = tb_data.map(({ key, ...rest }, _) => ({
      ...rest,
    }));
    qmsPostChangeCountersignature(
      { number: id, bodyData: new_tb, typeof: 3 },
      (res) => {
        setLoad(false);
        const { code, msg, data } = res.data;
        if (code === 200) {
          message.success("修改成功");
          reFresh();
        }
      },
      () => {
        setLoad(false);
      }
    );
  };

  const columnsItems = [
    { name: "部门", type: "text" },
    { name: "意见", type: "input" },
    { name: "是否同意", type: "radio", opt: ["同意", "驳回"] },
    { name: "签名", type: "input" },
  ];

  useEffect(() => {
    if (review_data) {
      const { bodyData = [] } = review_data;
      let new_tb = bodyData.map(({ 是否同意, ...rest }, _) => ({
        key: _,
        是否同意: 是否同意 || "同意",
        ...rest,
      }));
      setTbData(new_tb);
    } else {
      setTbData([]);
    }
  }, [review_data]);
  return (
    <Flex vertical gap={16}>
      <div className="no_review_title">部门会签结案</div>
      <Card>
        <Spin spinning={load}>
          <Form disabled={disabled}>
            <Flex vertical gap={16}>
              <CommonEditTable
                dataSource={tb_data}
                setTbData={setTbData}
                is_submit={true}
                is_del={false}
                columnsItems={columnsItems}
              />
              <Flex justify="end">
                <Button type="primary" onClick={postChangeCountersignature}>
                  提交
                </Button>
              </Flex>
            </Flex>
          </Form>
        </Spin>
      </Card>
    </Flex>
  );
};

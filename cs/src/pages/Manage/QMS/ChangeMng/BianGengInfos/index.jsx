import React, { useState, useEffect } from "react";
import {
  Button,
  Table,
  message,
  Flex,
  Space,
  Form,
  DatePicker,
  Popconfirm,
} from "antd";
import dayjs from "dayjs";
import { dateFormat, timeFormat } from "../../../../../utils/string";
import {
  qmsDelChangeNumber,
  qmsGetNumberInfo,
} from "../../../../../apis/qms_router";
import { DeleteOutlined } from "@ant-design/icons";

const BianGengInfos = ({ chgObj }) => {
  const [query_form] = Form.useForm();
  const [tb_data, setTbData] = useState([]);
  const [tb_load, setTbLoad] = useState(false);

  const columns = [
    {
      title: "序号",
      dataIndex: "序号",
      key: "序号",
      width: 80,
    },
    {
      title: "变更单号",
      dataIndex: "编号",
      key: "编号",
      width: 200,
      render: (text) => <a>{text}</a>,
      onCell: (record) => ({
        onClick: () => {
          chgObj(record);
        },
      }),
    },
    {
      title: "日期",
      dataIndex: "日期",
      key: "日期",
      render: (text) => text && dayjs(text).format(dateFormat),
      width: 100,
    },
    {
      title: "产品名称",
      dataIndex: "产品名称",
      key: "产品名称",
      width: 100,
    },
    {
      title: "产品规格",
      dataIndex: "产品规格",
      key: "产品规格",
      width: 100,
    },
    {
      title: "变更级别",
      dataIndex: "变更级别",
      key: "变更级别",
      width: 100,
    },
    {
      title: "变更类型",
      dataIndex: "变更类型",
      key: "变更类型",
      width: 200,
      render: (t) => t && t.join(","),
    },
    {
      title: "变更内容",
      dataIndex: "变更内容",
      key: "变更内容",
      width: 100,
    },
    {
      title: "计划完成时间",
      dataIndex: "计划完成时间",
      key: "计划完成时间",
      width: 120,
    },
    {
      title: "实际完成时间",
      dataIndex: "实际完成时间",
      key: "实际完成时间",
      width: 120,
    },
    {
      title: "申请人",
      dataIndex: "申请人",
      key: "申请人",
      width: 100,
    },
    {
      title: "申请进度",
      dataIndex: "申请进度",
      key: "申请进度",
      width: 120,
    },
    {
      title: "变更受理",
      dataIndex: "变更受理",
      key: "变更受理",
      width: 120,
    },
    {
      title: "可行性评估进度",
      dataIndex: "可行性评估进度",
      key: "可行性评估进度",
      width: 120,
    },
    {
      title: "会签进度",
      dataIndex: "会签进度",
      key: "会签进度",
      width: 120,
    },
    {
      title: "测试需求单进度",
      dataIndex: "测试需求单进度",
      key: "测试需求单进度",
      width: 120,
    },
    {
      title: "测试报告进度",
      dataIndex: "测试报告进度",
      key: "测试报告进度",
      width: 120,
    },
    {
      title: "变更结论",
      dataIndex: "变更结论",
      key: "变更结论",
      fixed: "right",
      width: 120,
    },
    {
      title: "目前状态",
      dataIndex: "目前状态",
      key: "目前状态",
      fixed: "right",
      width: 120,
    },
    {
      title: "操作",
      key: "opt",
      fixed: "right",
      render: (_, record) => (
        <Space>
          <Popconfirm
            title="警告"
            description="确认删除该条数据?"
            onConfirm={() => del(record)}
            okText="确认"
            cancelText="取消"
          >
            <Button
              icon={<DeleteOutlined />}
              style={{ padding: 0 }}
              type="link"
              danger
            >
              删除
            </Button>
          </Popconfirm>
          <Button
            type="link"
            style={{ padding: 0 }}
            // onClick={() =>
            // navigate("/mng/qms_reviewnoproduct/ocap", {
            //   state: { record },
            // })
            // }
          >
            详情
          </Button>
        </Space>
      ),
      width: 120,
    },
  ];
  const del = (record) => {
    qmsDelChangeNumber(
      { number: record.编号 },
      (res) => {
        const { code, msg, data } = res.data;
        if (code === 200) {
          message.success("删除成功");
          getNumbers();
        } else {
          message.error(msg);
        }
      },
      () => {
        message.error("网络异常");
      }
    );
  };

  const pagination = {
    position: ["bottomCenter"],
    showTotal: (total) => `共 ${total} 条`,
    showQuickJumper: true,
    showSizeChanger: true,
    defaultPageSize: 20,
  };
  const getNumbers = () => {
    const { 时间 } = query_form.getFieldsValue();
    setTbLoad(true);
    qmsGetNumberInfo(
      { start_time: 时间[0], end_time: 时间[1] },
      (res) => {
        const { code, msg, data } = res.data;
        setTbLoad(false);
        if (code === 200 && data.length > 0) {
          let temp = data.map((e, _) => ({ ...e, key: _ }));
          setTbData(temp);
        } else {
          message.error("没有数据");
          setTbData([]);
        }
      },
      () => {
        message.error("网络异常");
        setTbLoad(false);
        setTbData([]);
      }
    );
  };
  // 生成编号接口

  useEffect(() => {
    getNumbers();
  }, []);

  return (
    <Flex vertical gap={16}>
      <Form
        layout="inline"
        form={query_form}
        initialValues={{
          时间: [
            dayjs().subtract(7, "day").format(dateFormat),
            dayjs().format(dateFormat),
          ],
        }}
      >
        <Space>
          <Form.Item
            label="时间"
            name="时间"
            getValueProps={(value) => {
              return {
                value: value && value.map((e) => dayjs(e)),
              };
            }}
            normalize={(value) =>
              value && value.map((e) => dayjs(e).format(dateFormat))
            }
          >
            <DatePicker.RangePicker
              allowClear={false}
              format={dateFormat}
              style={{ width: 300 }}
              placeholder={["开始日期", "结束日期"]}
            />
          </Form.Item>
          <Button type="primary" onClick={getNumbers}>
            查询
          </Button>
        </Space>
      </Form>
      <Table
        loading={tb_load}
        columns={columns}
        dataSource={tb_data}
        // rowKey="序号"
        bordered
        size="small"
        pagination={pagination}
        scroll={{ x: "max-content", y: 300 }}
        style={{
          width: "100%",
        }}
      />
    </Flex>
  );
};

export default BianGengInfos;

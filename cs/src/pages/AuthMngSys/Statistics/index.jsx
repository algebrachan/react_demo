import React, { useEffect, useState } from "react";
import { Button, DatePicker, Flex, Form, Space, Spin, Table } from "antd";
import dayjs from "dayjs";
import { timeFormat } from "../../../utils/string";
import { GeneralCard } from "../../../components/CommonCard";
import { BarChart } from "./Chart";
import { userOperations } from "../../../apis/auth_api";
const { RangePicker } = DatePicker;

function Statistics() {
  const [form] = Form.useForm();
  const [tb_data, setTbData] = useState([]);
  const [chart_data, setChartData] = useState({});
  const [load, setLoad] = useState(false);
  const default_query_form = {
    时间范围: [
      dayjs().subtract(30, "day").format(timeFormat),
      dayjs().format(timeFormat),
    ],
  };
  const generateColumns = () => {
    let columns = [
      {
        title: "姓名",
        dataIndex: "nick_name",
        key: "nick_name",
      },
      {
        title: "工号",
        dataIndex: "username",
        key: "username",
      },
      {
        title: "登录量",
        dataIndex: "user_count",
        key: "user_count",
      },
      {
        title: "最后登录时间",
        dataIndex: "last_activity_time",
        key: "last_activity_time",
      },
    ];
    return columns;
  };
  const pagination = () => {
    return {
      position: ["bottomCenter"],
      total: tb_data.length,
      showTotal: (total) => `共 ${total} 条`,
      showQuickJumper: true,
      showSizeChanger: true,
      defaultPageSize: 10,
    };
  };
  const requestData = () => {
    const { 时间范围 } = form.getFieldsValue();
    let val = {
      start_time: 时间范围[0],
      end_time: 时间范围[1],
    };
    setLoad(true);
    userOperations(
      val,
      (res) => {
        const { code, msg, data } = res.data;
        if (code === 0 && data) {
          setLoad(false);
          const { paginated_data } = data;
          // 生成chart_data
          let xData = [];
          let yData = [];
          paginated_data.forEach((e) => {
            xData.push(e.nick_name);
            yData.push(e.user_count);
          });
          setChartData({ xData, yData });
          setTbData(paginated_data);
        } else {
          setTbData([]);
          setChartData({});
        }
      },
      () => {
        setLoad(false);
        setTbData([]);
        setChartData({});
      }
    );
  };
  useEffect(() => {
    requestData();
  }, []);
  return (
    <Flex vertical gap={20}>
      <Form layout="inline" initialValues={default_query_form} form={form}>
        <Form.Item
          label="时间范围"
          name="时间范围"
          getValueProps={(value) => {
            return {
              value: value && value.map((e) => dayjs(e)),
            };
          }}
          normalize={(value) =>
            value && value.map((e) => dayjs(e).format(timeFormat))
          }
        >
          <RangePicker showTime style={{ width: 400 }} allowClear={false} />
        </Form.Item>
        <Space>
          <Button type="primary" onClick={requestData}>
            查询
          </Button>
        </Space>
      </Form>
      <Spin spinning={load}>
        <GeneralCard name="使用统计表">
          <BarChart chart_data={chart_data} />
        </GeneralCard>
      </Spin>
      <Spin spinning={load}>
        <GeneralCard name="使用列表">
          <Table
            size="small"
            columns={generateColumns()}
            dataSource={tb_data}
            bordered
            scroll={{
              y: 600,
            }}
            pagination={pagination()}
            style={{ padding: 10 }}
          />
        </GeneralCard>
      </Spin>
    </Flex>
  );
}

export default Statistics;

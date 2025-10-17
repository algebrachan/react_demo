import React, { useEffect, useState } from "react";
import { GeneralCard, MyBreadcrumb } from "../../../components/CommonCard";
import {
  Flex,
  Form,
  Tabs,
  DatePicker,
  Select,
  Space,
  Button,
  Col,
  Row,
  Table,
  Progress,
  Typography,
} from "antd";
import { selectList2Option, timeFormat } from "../../../utils/string";
import { getSpcOptions } from "../../../apis/spc_api";
import dayjs from "dayjs";
import { DistChart, LineChart } from "./Chart";
const { Text } = Typography;
const { RangePicker } = DatePicker;

const SingleEquip = () => {
  const [form] = Form.useForm();
  const [query_opt, setQueryOpt] = useState({});
  const [target, setTarget] = useState("模具进出水流量差均值");
  const default_query_form = {
    时间: [
      dayjs().subtract(30, "day").format(timeFormat),
      dayjs().format(timeFormat),
    ],
    工厂: "",
    车间: "",
    工序: "",
    机台: "",
    图号: "",
  };
  const [tb_data, setTbData] = useState([{ key: 1 }]);
  const [tb_load, setTbLoad] = useState(false);
  const generateColumns = () => {
    let columns = [
      "加工时长",
      "最大真空压力",
      "到达最大真空压力耗时",
      "平均真空压力",
      "真空压力波动",
      "平均进出水流量差",
      "进出水流量波动",
      "平均进出水温度差",
      "进出水温度波动",
    ].map((e, _) => {
      let col = {
        title: e,
        dataIndex: e,
        key: e,
        width: 150,
        render: (x) => (
          <Flex justify="space-between">
            <Progress
              strokeLinecap="butt"
              percent={40}
              showInfo={false}
              style={{ width: 100 }}
              size={[100, 20]}
              strokeColor="#519AE2"
            />
            <Text>123</Text>
          </Flex>
        ),
      };
      return col;
    });
    columns.unshift({
      title: "炉次号",
      dataIndex: "炉次号",
      key: "炉次号",
      width: 200,
    });
    columns.unshift({
      title: "序号",
      dataIndex: "key",
      key: "key",
      width: 50,
      render: (x) => x + 1,
    });

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
    const val = form.getFieldsValue();
    console.log(val);
  };
  const initOpt = () => {
    getSpcOptions(
      (res) => {
        const { code, msg, data } = res.data;
        if (code === 0 && data) {
          let val = {};
          Object.keys(data).forEach((item) => {
            val[item] = data[item][0];
          });
          form.setFieldsValue(val);
          setQueryOpt(data);
        }
      },
      () => {}
    );
  };

  useEffect(() => {
    if (Object.keys(query_opt).length > 0) {
      requestData();
    }
  }, [query_opt]);

  useEffect(() => {
    initOpt();
  }, []);
  return (
    <Flex vertical gap={20}>
      <Form form={form} initialValues={default_query_form} layout="inline">
        <Form.Item
          label="时间"
          name="时间"
          getValueProps={(value) => {
            return {
              value: value && value.map((e) => dayjs(e)),
            };
          }}
          normalize={(value) =>
            value && value.map((e) => dayjs(e).format(timeFormat))
          }
        >
          <RangePicker showTime style={{ width: 360 }} allowClear={false} />
        </Form.Item>
        {["工厂", "车间", "工序", "机台", "图号"].map((e, _) => (
          <Form.Item label={e} name={e} key={_}>
            <Select
              options={selectList2Option(query_opt[e])}
              style={{ width: e === "图号" ? 150 : 100 }}
            />
          </Form.Item>
        ))}
        <Space>
          <Button type="primary" onClick={requestData}>
            检索
          </Button>
        </Space>
      </Form>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <GeneralCard name="性能监测指标">
            <Table
              loading={tb_load}
              size="small"
              columns={generateColumns()}
              dataSource={tb_data}
              bordered
              scroll={{
                y: 360,
                x: "max-content",
              }}
              pagination={pagination()}
              style={{ height: 400, padding: 10 }}
            />
          </GeneralCard>
        </Col>
        <Col span={18}>
          <GeneralCard name="指标趋势图">
            <div style={{ position: "relative" }}>
              <Space style={{ position: "absolute", top: -40, right: 5 }}>
                <Text>选择指标：</Text>
                <Select
                  value={target}
                  onChange={setTarget}
                  style={{ width: 200 }}
                  options={selectList2Option(["模具进出水流量差均值"])}
                />
              </Space>
              <LineChart
                chart_data={{
                  xData: ["1", "2", "3", "4"],
                  yData: [-4, 5, 7, 5],
                }}
              />
            </div>
          </GeneralCard>
        </Col>
        <Col span={6}>
          <GeneralCard name="能力直方图">
            <DistChart chart_data={{ data: 1 }} />
          </GeneralCard>
        </Col>
      </Row>
    </Flex>
  );
};
const MultiEquip = () => {};

function Equipment() {
  const tabs_items = [
    {
      key: "1",
      label: "单台设备评估",
      children: <SingleEquip />,
    },
    {
      key: "2",
      label: "多台设备对比",
      children: <MultiEquip />,
    },
  ];

  return (
    <div>
      <MyBreadcrumb items={[window.sys_name, "设备性能评估"]} />
      <div className="content_root">
        <Tabs defaultActiveKey="1" type="card" items={tabs_items} />
      </div>
    </div>
  );
}

export default Equipment;

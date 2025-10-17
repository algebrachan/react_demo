import React, { useEffect, useState } from "react";
import {
  DescriptionText,
  GeneralCard,
  MyBreadcrumb,
} from "../../../../components/CommonCard";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Space,
  Table,
} from "antd";
import dayjs from "dayjs";
import { selectList2Option } from "../../../../utils/string";
const { RangePicker } = DatePicker;

const default_query_form = {
  起止时间: [dayjs().subtract(7, "day"), dayjs()],
  工厂: "",
  车间: "",
  工序: "",
  机台: "",
  特征: "",
  控制图类型: "",
};

function Alarm() {
  const [query_form] = Form.useForm();
  const [key_word, setKeyWord] = useState("");
  const [query_opt, setQueryOpt] = useState({});
  const [tb_data1, setTbData1] = useState([]);
  const [tb_data2, setTbData2] = useState([]);
  const [cur_data, setCurData] = useState({}); //当前选中的入库单
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const columns1 = [
    {
      title: "异常流水号",
      key: "异常流水号",
      dataIndex: "异常流水号",
    },
    {
      title: "图号",
      key: "图号",
      dataIndex: "图号",
    },
    {
      title: "详细策略",
      key: "详细策略",
      dataIndex: "详细策略",
    },
  ];

  const columns2 = [
    {
      title: "序号",
      key: "key",
      dataIndex: "key",
    },
    {
      title: "异常机台",
      key: "异常机台",
      dataIndex: "异常机台",
    },
    {
      title: "坩埚编号",
      key: "坩埚编号",
      dataIndex: "坩埚编号",
    },
    {
      title: "异常类型",
      key: "异常类型",
      dataIndex: "异常类型",
    },
    {
      title: "异常原因",
      key: "异常原因",
      dataIndex: "异常原因",
    },
    {
      title: "筛查建议",
      key: "筛查建议",
      dataIndex: "筛查建议",
    },
  ];
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    type: "radio",
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const pagination = () => {
    return {
      position: ["bottomCenter"],
      total: tb_data2.length,
      showTotal: (total) => `共 ${total} 条`,
      showQuickJumper: true,
      showSizeChanger: true,
      defaultPageSize: 20,
    };
  };
  const requestData = () => {};
  useEffect(() => {
    if (selectedRowKeys.length > 0) {
      let list = tb_data1.filter((e) => selectedRowKeys.includes(e.key));
      if (list.length > 0) {
        setCurData(list[0]);
      }
    }
  }, [selectedRowKeys]);
  return (
    <div>
      <MyBreadcrumb items={["创盛长晶智能集控系统", "报警处理"]} />
      <div
        className="content_root"
        style={{
          display: "flex",
          rowGap: 20,
          flexDirection: "column",
        }}
      >
        <Form
          form={query_form}
          initialValues={default_query_form}
          layout="inline"
        >
          {Object.keys(default_query_form).map((e, _) => (
            <Form.Item name={e} label={e} key={_}>
              {e === "起止时间" ? (
                <RangePicker
                  showTime
                  style={{ width: 330 }}
                  allowClear={false}
                />
              ) : (
                <Select
                  options={selectList2Option(query_opt[e])}
                  style={{ width: 120 }}
                />
              )}
            </Form.Item>
          ))}
          <Button type="primary">查询</Button>
        </Form>
        <GeneralCard name="异常流水号列表">
          <Row className="ctt">
            <Col span={5}>
              <div className="sider_root of" style={{ height: 740 }}>
                <Space style={{ padding: 16 }}>
                  <Input
                    placeholder="请输入关键词搜索"
                    style={{ width: 200 }}
                    value={key_word}
                    onChange={(e) => setKeyWord(e.target.value)}
                  />
                  <Button type="primary" onClick={() => requestData()}>
                    查询
                  </Button>                 
                </Space>
                <Table
                  rowSelection={rowSelection}
                  size="small"
                  columns={columns1}
                  dataSource={tb_data1}
                  pagination={false}
                />
              </div>
            </Col>
            <Col span={19}>
              <div
                className="of"
                style={{
                  width: "100%",
                  height: 740,
                  display: "flex",
                  rowGap: 10,
                  flexDirection: "column",
                }}
              >
                <Space style={{ marginTop: 10 }}>
                  <DescriptionText label="审核人" value="李工" />
                  <DescriptionText label="操作人" value="李工" />
                </Space>
                <Table
                  bordered
                  size="small"
                  columns={columns2}
                  dataSource={tb_data2}
                  pagination={pagination()}
                  className="common_table_root"
                />
              </div>
            </Col>
          </Row>
        </GeneralCard>
      </div>
    </div>
  );
}

export default Alarm;

import React, { useEffect, useState } from "react";
import { GeneralCard, MyBreadcrumb } from "../../../../components/CommonCard";
import {
  Button,
  Col,
  DatePicker,
  Descriptions,
  Flex,
  Form,
  InputNumber,
  Checkbox,
  Row,
  Select,
  Space,
  Spin,
  Table,
  message,
} from "antd";
import dayjs from "dayjs";
import { selectList2Option, dateFormat } from "../../../../utils/string";
import { SpcModal } from "./SpcModal";
import { DistChart, SpcChart } from "./Chart";
import { getSrjcSpcOptions, getSrjcSpcResult } from "../../../../apis/spc_api";
const { RangePicker } = DatePicker;

const default_query_form = {
  时间: [
    dayjs().subtract(60, "day").format(dateFormat),
    dayjs().format(dateFormat),
  ],
  工厂: "",
  车间: "",
  石英砂类型: "",
  机台: [],
  图号: "",
  元素: "",
  改型图号: "",
  特征: [],
  规则: [],
  控制图类型: "",
  出货: false,
  返回点数: 100,
};

const default_desc_items_obj = {
  样本量: 0,
  最小值: 0,
  "25%分位": 0,
  中位值: 0,
  "75%分位": 0,
  "95%分位": 0,
  最大值: 0,
  均值: 0,
  极差: 0,
  方差: 0,
  标准差: 0,
  Cpk: 0,
  Ppk: 0,
};

function SpcShouruAnalysis() {
  const [query_form] = Form.useForm();

  const [query_opt, setQueryOpt] = useState({});
  const [desc_items_obj, setDescItemsObj] = useState(default_desc_items_obj);
  const [data, setData] = useState({});
  const [tb_data, setTbData] = useState([]);
  const [tb_data2, setTbData2] = useState([]);
  const [edit_modal, setEditModal] = useState(false);
  const [load, setLoad] = useState(false);

  const generateColumns = () => {
    let columns = [
      "坩埚编号",
      "I图异常",
      "MR图异常",
      "Li",
      "Na",
      "K",
      "Ca",
      "Fe",
      "Al",
      "Mg",
      "Cu",
      "Mn",
      "Cr",
      "Ni",
    ].map((e, _) => {
      let col = {
        width: e.length > 3 ? 80 : 40,
        title: e,
        dataIndex: e,
        key: e,
      };
      if (e === "I图异常" || e === "MR图异常") {
        col.render = (x) => x && x.join(",");
      }
      return col;
    });
    columns.unshift({
      width: 100,
      title: "时间",
      key: "时间",
      dataIndex: "时间",
    });
    columns.unshift({
      width: 50,
      title: "序号",
      key: "key",

      render: (_, record, index) => index + 1,
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
      defaultPageSize: 20,
    };
  };
  const requestData = () => {
    let val = query_form.getFieldsValue();
    setLoad(true);
    getSrjcSpcResult(
      val,
      (res) => {
        setLoad(false);
        const { code, msg, data } = res.data;
        if (code === 0 && data) {
          const {
            control_plot_1 = {},
            control_plot_2 = {},
            violations_overall = [],
            data_details = [],
            hist_plot = {},
            data_summary = {},
            lotnumbers = [],
            times = [],
          } = data;
          setTbData(data_details);
          setTbData2(violations_overall);
          setDescItemsObj(data_summary);
          setData({
            control_plot_1,
            control_plot_2,
            hist_plot,
            lotnumbers,
            times,
          });
        } else {
          message.error(msg);
          setTbData([]);
          setTbData2([]);
          setDescItemsObj(default_desc_items_obj);
          setData({
            control_plot_1: {},
            control_plot_2: {},
            hist_plot: {},
            lotnumbers: [],
          });
        }
      },
      () => {
        setLoad(false);
        setDescItemsObj(default_desc_items_obj);
        setData({});
      }
    );
  };

  const columns2 = [
    { title: "规则", key: "rule", dataIndex: "rule" },
    {
      title: "控制图名称",
      key: "control_plot_name",
      dataIndex: "control_plot_name",
    },
    {
      title: "异常序号",
      key: "violation",
      dataIndex: "violation",
      render: (x) => {
        const { lotnumbers = [] } = data;
        if (lotnumbers.length === 0) {
          return x && x.join(",");
        } else {
          let temp = x.map((e) => `${lotnumbers[e]}[${e}]`);
          return temp && temp.join("\r\n"); // 回车符
        }
      },
    },
  ];

  const initOpt = () => {
    // 传入时间
    const { 时间 = [] } = query_form.getFieldsValue();
    getSrjcSpcOptions(
      { 时间 },
      (res) => {
        const { code, msg, data } = res.data;
        if (code === 0 && data) {
          let val = {};
          Object.keys(data).forEach((item) => {
            if (item === "规则") {
              val["规则"] = ["0", "1", "2"];
            } else if (item === "机台") {
              val["机台"] = data[item] ? data[item] : [];
            } else if (item === "特征") {
              val[item] = data[item][0] ? [data[item][0]] : [];
            } else {
              val[item] = data[item][0] ? data[item][0] : "";
            }
          });
          query_form.setFieldsValue(val);
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
    <div>
      <MyBreadcrumb items={[window.sys_name, "SPC受入检查"]} />
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
          style={{
            display: "flex",
            rowGap: 10,
            flexDirection: "column",
          }}
        >
          <Flex>
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
              <RangePicker
                style={{ width: 240 }}
                allowClear={false}
                onChange={() => initOpt()}
              />
            </Form.Item>
            {["工厂", "车间", "石英砂类型"].map((e, _) => (
              <Form.Item label={e} name={e} key={_}>
                <Select
                  options={selectList2Option(query_opt[e])}
                  style={{ width: 120 }}
                />
              </Form.Item>
            ))}
            <Form.Item label="特征" name="特征">
              <Select
                options={selectList2Option(query_opt["特征"])}
                mode="multiple"
                maxTagCount="responsive"
                style={{ width: 160 }}
              />
            </Form.Item>
            {["元素", "控制图类型"].map((e, _) => (
              <Form.Item label={e} name={e} key={_}>
                <Select
                  options={selectList2Option(query_opt[e])}
                  style={{ width: 100 }}
                />
              </Form.Item>
            ))}
            <Form.Item label="机台" name="机台">
              <Select
                options={selectList2Option(query_opt["机台"])}
                mode="multiple"
                maxTagCount="responsive"
                style={{ width: 160 }}
              />
            </Form.Item>
            <Form.Item label="规则" name="规则">
              <Select
                options={selectList2Option(query_opt["规则"])}
                mode="multiple"
                maxTagCount="responsive"
                style={{ width: 200 }}
              />
            </Form.Item>
          </Flex>

          <Flex>
            {/* {tuhao ? (
              <Form.Item label="图号" name="图号">
                <Select
                  showSearch
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={selectList2Option(query_opt["图号"])}
                  style={{ width: 150 }}
                />
              </Form.Item>
            ) : (
              <Form.Item label="改型图号" name="改型图号">
                <Select
                  showSearch
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={selectList2Option(query_opt["改型图号"])}
                  style={{ width: 150 }}
                />
              </Form.Item>
            )} */}
            <Form.Item name="出货" valuePropName="checked">
              <Checkbox style={{ width: 60, marginLeft: 10 }}>出货</Checkbox>
            </Form.Item>
            <Form.Item label="返回点数" name="返回点数">
              <InputNumber precision={0} />
            </Form.Item>
            <Space size={20}>
              {/* <Button
                onClick={() => {
                  setTuhao(!tuhao);
                }}
              >
                切换图号类型
              </Button> */}
              <Button type="primary" onClick={requestData}>
                查看
              </Button>
            </Space>
          </Flex>
        </Form>
        <Spin spinning={load}>
          <Row gutter={[16, 16]}>
            <Col span={9}>
              <GeneralCard name="spc分析">
                <SpcChart
                  chart_data={data["control_plot_1"]}
                  lotnumbers={data["times"]}
                />
              </GeneralCard>
            </Col>
            <Col span={9}>
              <GeneralCard name="spc分析">
                <SpcChart
                  chart_data={data["control_plot_2"]}
                  lotnumbers={data["times"]}
                />
              </GeneralCard>
            </Col>
            <Col span={6}>
              <GeneralCard name="能力直方图">
                <DistChart chart_data={data["hist_plot"]} />
              </GeneralCard>
            </Col>
            <Col
              span={18}
              style={{
                display: "flex",
                rowGap: 16,
                flexDirection: "column",
              }}
            >
              <GeneralCard name="数据摘要">
                <div style={{ width: "100%", height: 180, padding: 10 }}>
                  <Descriptions
                    size="small"
                    column={7}
                    title=""
                    layout="vertical"
                    bordered
                    items={Object.keys(desc_items_obj).map((e, _) => ({
                      key: _,
                      label: (
                        <span style={{ color: "#333", fontWeight: 600 }}>
                          {e}
                        </span>
                      ),
                      children: desc_items_obj[e],
                    }))}
                  />
                </div>
              </GeneralCard>
              <GeneralCard name="数据详情">
                <div style={{ width: "100%", height: 340, padding: 10 }}>
                  <Table
                    size="small"
                    columns={generateColumns()}
                    dataSource={tb_data}
                    scroll={{
                      x: "max-content",
                      y: 200,
                    }}
                    pagination={pagination()}
                  />
                </div>
              </GeneralCard>
            </Col>
            <Col span={6}>
              <GeneralCard name="数据解析">
                <div
                  style={{
                    width: "100%",
                    height: 580,
                    padding: 10,
                    display: "flex",
                    rowGap: 16,
                    flexDirection: "column",
                  }}
                >
                  <Table
                    size="small"
                    columns={columns2}
                    dataSource={tb_data2}
                    scroll={{
                      y: 500,
                    }}
                    pagination={false}
                  />
                </div>
              </GeneralCard>
            </Col>
          </Row>
        </Spin>
      </div>
      <SpcModal open={edit_modal} onCancel={() => setEditModal(false)} />
    </div>
  );
}

export default SpcShouruAnalysis;

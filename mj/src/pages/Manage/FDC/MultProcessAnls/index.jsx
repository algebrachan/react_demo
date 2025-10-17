import React, { useEffect, useState } from "react";
import { GeneralCard, MyBreadcrumb } from "../../../../components/CommonCard";
import {
  Form,
  DatePicker,
  Select,
  Button,
  Space,
  Row,
  Col,
  Input,
  Checkbox,
  Flex,
  Table,
  message,
  Spin,
} from "antd";
import dayjs from "dayjs";
import { selectList2Option, timeFormat } from "../../../../utils/string";
import {
  BarChart,
  HeatChart,
  LineChart1,
  LineChart2,
  LineChart3,
  LineChart4,
  ScatterLineChart1,
  ScatterLineChart2,
} from "./Chart";
import { ComputeFormCol } from "../../../../utils/obj";
import {
  getProcessAnalysisData,
  getProcessData,
  getProcessDevice,
  getQueryCriteria,
} from "../../../../apis/fdc_api";
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const default_query_form = {
  时间: [
    dayjs().subtract(30, "day").format(timeFormat),
    dayjs().format(timeFormat),
  ],
  工厂: "",
  车间: "",
  工序: "",
  设备: "",
  参数: "",
};

const chgDev2Opt = (arr = []) => {
  if (Array.isArray(arr)) {
    return arr.map((e) => ({ label: e["name"], value: e["id"] }));
  } else {
    return [];
  }
};

function MultProcessAnls() {
  const [query_form] = Form.useForm();
  const [form] = Form.useForm();
  const [query_opt, setQueryOpt] = useState({});
  const [param_list, setParamList] = useState([]);
  const [load1, setLoad1] = useState(false);
  const [load2, setLoad2] = useState(false);
  const [chart_data1, setChartData1] = useState({});
  const [chart_data2, setChartData2] = useState({});
  const [tb_data, setTbData] = useState([]);
  const [work_list, setWorkList] = useState([]); // 产品加工编号
  const [ckb_work_list, setCkbWorkList] = useState([]); // input搜索出来的
  const [work_opt, setWorkOpt] = useState([]);
  const [ck_all, setCkAll] = useState(false);
  const generateColumns = () => {
    let columns = [
      "批次号",
      "样本数量",
      "均值",
      "标准差",
      "最大值",
      "最小值",
      "极差",
      "偏度",
      "峭度",
      "一阶差分",
      "变异系数",
      "四分位距",
    ].map((e, _) => {
      let col = {
        title: e,
        dataIndex: e,
        key: e,
      };
      if (e === "批次号") {
        col["width"] = 100;
      }
      return col;
    });
    return columns;
  };

  const handleFormChange = (changedValues, allValues) => {
    const { 工厂, 车间, 工序, 设备 } = changedValues;
    if (工厂 || 车间 || 工序 || 设备) {
      getParams();
    }
  };

  const checkAll = (checked) => {
    setCkAll(checked);
    if (checked && ckb_work_list.length > 0) {
      form.setFieldsValue({
        work: ckb_work_list,
        standard_unique: ckb_work_list[0],
      });
      setWorkOpt(ckb_work_list);
    } else {
      setWorkOpt([]);
      form.setFieldsValue({ work: [], standard_unique: "" });
    }
  };
  const clickInvert = () => {
    //
    let w = form.getFieldValue("work");
    let temp = ckb_work_list.filter((e) => !w.includes(e));
    form.setFieldsValue({
      work: temp,
      standard_unique: temp[0] ? temp[0] : "",
    });
    setWorkOpt(temp);
    if (w.length === 0) {
      setCkAll(true);
    } else {
      setCkAll(false);
    }
  };
  const searchWork = (e) => {
    const { work_ipt } = form.getFieldsValue();
    let new_list = work_list.filter((old_item, _) =>
      old_item.includes(work_ipt)
    );
    setCkbWorkList(new_list);
  };
  const query = () => {
    const { 时间, 设备, 参数 } = query_form.getFieldsValue();
    if (设备 === "" || 参数 === "") {
      message.warning("请选择设备和参数");
      return;
    }
    let val = {
      start_time: 时间[0],
      end_time: 时间[1],
      device_id: 设备,
      point_id: 参数,
    };
    form.resetFields();
    setLoad1(true);
    getProcessData(
      val,
      (res) => {
        setLoad1(false);
        const { code, msg, data } = res.data;
        if (code === 200 && data) {
          const {
            separation_line = [],
            unique_identifier = [],
            abnormal_point = [],
            xdata = [],
            ydata = [],
          } = data;

          setWorkList(unique_identifier);
          setCkbWorkList(unique_identifier);
          setChartData1({ separation_line, xdata, ydata, abnormal_point });
        } else {
          message.error(msg);
          setWorkList([]);
          setCkbWorkList([]);
          setChartData1({});
        }
      },
      () => {
        setLoad1(false);
        setWorkList([]);
        setCkbWorkList([]);
      }
    );
  };
  const requestData = () => {
    const { 时间, 设备, 参数 } = query_form.getFieldsValue();
    if (设备 === "" || 参数 === "") {
      message.warning("请选择设备和参数");
      return;
    }
    const { work, standard_unique } = form.getFieldsValue();
    if (work.length === 0 || standard_unique === "") {
      message.warning("请选择加工编号和标准批次");
      return;
    }
    let val = {
      start_time: 时间[0],
      end_time: 时间[1],
      device_id: 设备,
      point_id: 参数,
      unique_identifier: work,
      standard_unique: standard_unique,
    };
    setLoad2(true);
    getProcessAnalysisData(
      val,
      (res) => {
        setLoad2(false);
        const { code, msg, data } = res.data;
        if (code === 200 && data) {
          const { indicators = [] } = data;
          setTbData(indicators);
          setChartData2(data);
        } else {
          message.error(msg);
        }
      },
      () => {
        setLoad2(false);
      }
    );
  };
  const getParams = () => {
    let device_id = query_form.getFieldValue("设备");
    query_form.setFieldsValue({ 参数: "" });
    getProcessDevice(
      { device_id },
      (res) => {
        const { code, msg, data } = res.data;
        if (code === 200 && data) {
          setParamList(data);
        } else {
          setParamList([]);
        }
      },
      () => {
        setParamList([]);
      }
    );
  };
  const initOpt = () => {
    // 获取搜索条件
    getQueryCriteria(
      (res) => {
        const { code, msg, data } = res.data;
        if (code === 200 && data) {
          let val = {
            工厂: data["工厂"][0],
            车间: data["车间"][0],
            工序: data["工序"][0],
          };
          setQueryOpt(data);
          query_form.setFieldsValue(val);
        } else {
          setQueryOpt({});
          query_form.resetFields();
        }
      },
      () => {
        setQueryOpt({});
        query_form.resetFields();
      }
    );
  };
  useEffect(() => {
    if (Object.keys(chart_data2).length > 0) {
      const {
        band_chart: { 通道管控检测异常批次 },
        cluster_chart: { 聚类分析检测异常批次 },
        res_DTW: { 相似度度量检测异常批次 },
      } = chart_data2;
      form.setFieldsValue({
        通道管控检测异常批次,
        聚类分析检测异常批次,
        相似度度量检测异常批次,
      });
    } else {
      form.setFieldsValue({
        通道管控检测异常批次: "",
        聚类分析检测异常批次: "",
        相似度度量检测异常批次: "",
      });
    }
  }, [chart_data2]);
  useEffect(() => {
    initOpt();
  }, []);
  return (
    <div>
      <MyBreadcrumb items={[window.sys_name, "FDC", "多过程分析"]} />
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
          onValuesChange={handleFormChange}
        >
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
            <RangePicker showTime style={{ width: 330 }} allowClear={false} />
          </Form.Item>
          {["工厂", "车间", "工序"].map((e, _) => (
            <Form.Item label={e} name={e} key={_}>
              <Select
                showSearch
                options={selectList2Option(query_opt[e])}
                style={{ width: 120 }}
              />
            </Form.Item>
          ))}
          <Form.Item label="设备" name="设备">
            <Select
              showSearch
              options={chgDev2Opt(query_opt["设备"])}
              style={{ width: 120 }}
            />
          </Form.Item>
          <Form.Item label="参数" name="参数">
            <Select
              showSearch
              options={chgDev2Opt(param_list)}
              style={{ width: 120 }}
            />
          </Form.Item>
          <Space>
            <Button type="primary" onClick={query}>
              检索
            </Button>
          </Space>
        </Form>
        <Form
          component={false}
          form={form}
          initialValues={{
            work: [],
            work_ipt: "",
            standard_unique: "",
            通道管控检测异常批次: "",
            聚类分析检测异常批次: "",
            相似度度量检测异常批次: "",
          }}
        >
          <Row gutter={[16, 16]}>
            {/* <Col span={24}>
              <Spin spinning={load1}>
                <GeneralCard name="过程曲线随时间变化">
                  <LineChart1 chart_data={chart_data1} />
                </GeneralCard>
              </Spin>
            </Col> */}
            <Col span={4}>
              <Flex vertical gap={16}>
                <Spin spinning={load1}>
                  <GeneralCard name="产品加工记录编号列表">
                    <Form.Item name="work_ipt" {...ComputeFormCol(0)}>
                      <Input
                        placeholder="请输入搜索"
                        className="search_ipt"
                        onPressEnter={searchWork}
                      />
                    </Form.Item>
                    <Flex
                      className="search_ipt"
                      style={{ padding: 10 }}
                      justify="space-between"
                    >
                      <Checkbox
                        onChange={(e) => checkAll(e.target.checked)}
                        checked={ck_all}
                      >
                        全选
                      </Checkbox>
                      <Button size="small" type="primary" onClick={clickInvert}>
                        反选
                      </Button>
                      <Button size="small" type="primary" onClick={requestData}>
                        开始分析
                      </Button>
                    </Flex>
                    <div
                      className="of"
                      style={{ height: 600, width: "100%", marginTop: 2 }}
                    >
                      <Form.Item name="work" {...ComputeFormCol(0)}>
                        <Checkbox.Group
                          style={{ width: "100%" }}
                          onChange={(val) => {
                            setWorkOpt(val);
                            if (val.length > 0) {
                              form.setFieldsValue({ standard_unique: val[0] });
                            } else {
                              form.setFieldsValue({ standard_unique: "" });
                            }
                            // 默认设置第一个
                          }}
                        >
                          {ckb_work_list.map((x, _) => (
                            <Checkbox
                              value={x}
                              key={_}
                              className="check_box_item"
                            >
                              {x}
                            </Checkbox>
                          ))}
                        </Checkbox.Group>
                      </Form.Item>
                    </div>
                  </GeneralCard>
                </Spin>
                <Spin spinning={load2}>
                  <GeneralCard name="分析结果">
                    <Flex vertical gap={10} style={{ padding: 10 }}>
                      <Form.Item
                        name="通道管控检测异常批次"
                        label="通道管控检测异常批次"
                      >
                        <TextArea autoSize />
                      </Form.Item>
                      <Form.Item
                        name="聚类分析检测异常批次"
                        label="聚类分析检测异常批次"
                      >
                        <TextArea autoSize />
                      </Form.Item>
                      <Form.Item
                        name="相似度度量检测异常批次"
                        label="相似度度量检测异常批次"
                      >
                        <TextArea autoSize />
                      </Form.Item>
                    </Flex>
                  </GeneralCard>
                </Spin>
              </Flex>
            </Col>
            <Col span={20}>
              <Spin spinning={load2}>
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <GeneralCard name="堆叠过程曲线">
                      <LineChart2
                        chart_data={chart_data2["stacking_process_curve"]}
                      />
                    </GeneralCard>
                  </Col>
                  <Col span={8}>
                    <GeneralCard name="密度分布图">
                      <LineChart3 chart_data={chart_data2["density_chart"]} />
                    </GeneralCard>
                  </Col>
                  <Col span={16}>
                    <GeneralCard name="统计指标">
                      <Table
                        size="small"
                        columns={generateColumns()}
                        dataSource={tb_data}
                        bordered
                        scroll={{
                          // x: "max-content",
                          y: 210,
                        }}
                        pagination={false}
                      />
                    </GeneralCard>
                  </Col>
                  <Col span={12}>
                    <GeneralCard name="通道管控图">
                      <ScatterLineChart1
                        chart_data={chart_data2["band_chart"]}
                      />
                    </GeneralCard>
                  </Col>
                  <Col span={12}>
                    <GeneralCard name="聚类分析">
                      <ScatterLineChart2
                        chart_data={chart_data2["cluster_chart"]}
                      />
                    </GeneralCard>
                  </Col>
                  <Col span={24}>
                    <GeneralCard name="相似度分析(DTW)">
                      <Row gutter={[10, 10]} style={{ position: "relative" }}>
                        <Space
                          style={{
                            position: "absolute",
                            top: -35,
                            right: 15,
                            zIndex: 4,
                          }}
                          size={10}
                        >
                          <Form.Item
                            label="选择标准批次"
                            name="standard_unique"
                          >
                            <Select
                              style={{ width: 150 }}
                              options={selectList2Option(work_opt)}
                            />
                          </Form.Item>
                          <Button type="primary" onClick={requestData}>
                            确定
                          </Button>
                        </Space>
                        <Col span={11}>
                          <HeatChart chart_data={chart_data2["res_DTW"]} />
                        </Col>
                        <Col span={5}>
                          <BarChart chart_data={chart_data2["res_DTW"]} />
                        </Col>
                        <Col span={8}>
                          <LineChart4 chart_data={chart_data2["res_DTW"]} />
                        </Col>
                      </Row>
                    </GeneralCard>
                  </Col>
                </Row>
              </Spin>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  );
}

export default MultProcessAnls;

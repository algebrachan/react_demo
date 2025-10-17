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
  getProcessDevice,
  getQueryCriteria,
  getSearchPara,
  getProcessAnalysisData,
  getProcessWorkingSteps,
  getDeviceSearch,
  getProcessAnalysisRealData,
  getProcessRealData,
  getProcessSearchPara,
} from "../../../../apis/fdc_api";
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const default_query_form = {
  // 时间: [
  //   dayjs().subtract(30, "day").format(timeFormat),
  //   dayjs().format(timeFormat),
  // ],
  工厂: "",
  车间: "",
  工序: "",
  设备: "",
  参数: "",
};
function MultProcessAnls() {
  const [query_form] = Form.useForm();
  const [form] = Form.useForm();
  const [query_opt, setQueryOpt] = useState({});
  const [param_opt, setParamOpt] = useState({});
  const [param_load, setParamLoad] = useState(false);
  const [dev_list, setDevList] = useState([]);
  const [param_list, setParamList] = useState([]);
  const [step_list, setStepList] = useState([]);
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
    const { 时间, 设备, 参数, 车间 } = query_form.getFieldsValue();
    if (设备 === "" || 参数 === "") {
      message.warning("请选择设备和参数");
      return;
    }
    let val = {
      设备,
      参数,
      车间,
    };
    form.resetFields();
    setLoad1(true);
    getProcessWorkingSteps(
      { 车间, 设备 },
      (res) => {
        const { code, data } = res.data;
        if (code === 200 && data) {
          setStepList(data);
        } else {
          setStepList([]);
        }
      },
      () => {
        setStepList([]);
      }
    );
    getProcessRealData(
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
    const { 时间, 车间, 设备, 参数 } = query_form.getFieldsValue();
    if (设备 === "" || 参数 === "") {
      message.warning("请选择设备和参数");
      return;
    }
    const { work, working_steps = "" } = form.getFieldsValue();
    if (work.length === 0) {
      message.warning("请选择加工编号");
      return;
    }
    let val = {
      设备,
      参数,
      车间,
      unique_identifier: work,
      working_steps,
    };
    setLoad2(true);

    getProcessAnalysisRealData(
      val,
      (res) => {
        setLoad2(false);
        const { code, msg, data } = res.data;
        if (code === 200 && data) {
          // const { indicators = [] } = data;
          // setTbData(indicators);
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
  const initOpt = () => {
    getDeviceSearch(
      (res) => {
        const { code, msg, data } = res.data;
        if (code === 200 && data) {
          setQueryOpt(data);
        } else {
          setQueryOpt({});
        }
      },
      () => {
        setQueryOpt({});
      }
    );
  };
  const initParam = () => {
    const { 车间 = "", 工序 = "" } = query_form.getFieldsValue();
    setParamLoad(true);
    getProcessSearchPara(
      { 车间, 工序 },
      (res) => {
        setParamLoad(false);
        const { code, data } = res.data;
        if (code === 200 && data) {
          const { dev_list = [] } = data;
          let temp_list = dev_list.map((e) => e.设备);
          setDevList(temp_list);
          setParamOpt(data);
        } else {
          setDevList([]);
          setParamOpt({});
        }
      },
      () => {
        setParamLoad(false);
        setDevList([]);
        setParamOpt({});
      }
    );
  };
  // useEffect(() => {
  //   if (Object.keys(chart_data2).length > 0) {
  //     const {
  //       band_chart: { 通道管控检测异常批次 },
  //       cluster_chart: { 聚类分析检测异常批次 },
  //       res_DTW: { 相似度度量检测异常批次 },
  //     } = chart_data2;
  //     form.setFieldsValue({
  //       通道管控检测异常批次,
  //       聚类分析检测异常批次,
  //       相似度度量检测异常批次,
  //     });
  //   } else {
  //     form.setFieldsValue({
  //       通道管控检测异常批次: "",
  //       聚类分析检测异常批次: "",
  //       相似度度量检测异常批次: "",
  //     });
  //   }
  // }, [chart_data2]);
  useEffect(() => {
    if (Object.keys(query_opt).length > 0) {
      // 设置初始化数据
      const { 工厂 = [], 车间 = [], 工序 = {} } = query_opt;
      let val = {};
      if (工厂.length > 0) {
        val["工厂"] = 工厂[0];
      }
      if (车间.length > 0) {
        val["车间"] = 车间[0];
        val["工序"] = 工序[车间[0]];
      }
      query_form.setFieldsValue(val);
      initParam();
    }
  }, [query_opt]);
  useEffect(() => {
    initOpt();
  }, []);
  return (
    <div>
      <MyBreadcrumb items={[window.sys_name, "FDC", "数据对比"]} />
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
          {/* <Form.Item
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
          </Form.Item> */}
          <Form.Item label="工厂" name="工厂">
            <Select
              options={selectList2Option(query_opt["工厂"])}
              style={{ width: 120 }}
            />
          </Form.Item>
          <Form.Item label="车间" name="车间">
            <Select
              options={selectList2Option(query_opt["车间"])}
              style={{ width: 120 }}
              onChange={(val) => {
                query_form.setFieldsValue({
                  工序: query_opt["工序"][val],
                  设备: "",
                  参数: "",
                });
                initParam();
              }}
            />
          </Form.Item>
          <Form.Item label="工序" name="工序">
            <Select options={selectList2Option([])} style={{ width: 120 }} />
          </Form.Item>

          <Form.Item label="设备" name="设备">
            <Select
              showSearch
              options={selectList2Option(dev_list)}
              style={{ width: 160 }}
              loading={param_load}
              onChange={(val) => {
                query_form.setFieldsValue({
                  参数: "",
                });
                // 从设备列表中匹配对应的设备
                const { dev_list = [] } = param_opt;
                let dev = dev_list.find((e) => e.设备 === val);
                setParamList(dev?.参数 || []);
              }}
            />
          </Form.Item>
          <Form.Item label="参数" name="参数">
            <Select
              showSearch
              options={selectList2Option(param_list)}
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              loading={param_load}
              style={{ width: 180 }}
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
            working_steps: "",
            step: "",
            // standard_unique: "",
            // 通道管控检测异常批次: "",
            // 聚类分析检测异常批次: "",
            // 相似度度量检测异常批次: "",
          }}
        >
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Spin spinning={load1}>
                <GeneralCard name="过程曲线随时间变化">
                  <LineChart1 chart_data={chart_data1} />
                </GeneralCard>
              </Spin>
            </Col>
            <Col span={4}>
              <Flex vertical gap={16}>
                <Spin spinning={load1}>
                  <GeneralCard name="产品加工记录编号列表">
                    <Form.Item
                      label="工步"
                      name="working_steps"
                      style={{ padding: 10 }}
                    >
                      <Select showSearch options={selectList2Option(step_list)} />
                    </Form.Item>
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
                      style={{ height: 520, width: "100%", marginTop: 2 }}
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
                {/* <Spin spinning={load2}>
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
                </Spin> */}
              </Flex>
            </Col>
            <Col span={20}>
              <Spin spinning={load2}>
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <GeneralCard name="堆叠过程曲线">
                      <LineChart2
                        chart_data={chart_data2}
                      />
                    </GeneralCard>
                  </Col>
                  {/* <Col span={8}>
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
                  </Col> */}
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

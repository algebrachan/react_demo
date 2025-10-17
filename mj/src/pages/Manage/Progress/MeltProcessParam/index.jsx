import React, { useEffect, useRef, useState } from "react";
import { MyBreadcrumb, GeneralCard } from "../../../../components/CommonCard";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import {
  Button,
  Checkbox,
  Flex,
  Form,
  Input,
  Radio,
  Select,
  Space,
  Spin,
  Table,
  message,
} from "antd";
import {
  ClearPointModal,
  PanelResizeHandleStyle,
  PointModal,
  SearchFileModal,
} from "../../../../components/CommonModal";
import * as echarts from "echarts";
import { ComputeFormCol } from "../../../../utils/obj";
import {
  getCurrentTime,
  selectList2Option,
  timeFormat,
} from "../../../../utils/string";
import {
  getCrInspectionForm,
  getFeatureList,
  getFeatureStatLine,
  getFeatureStatLineMultipart,
  getLotId,
  getPprId,
  getSearchList,
} from "../../../../apis/anls_api";
import dayjs from "dayjs";
import { ProgressForm } from "../Form";
import ReactECharts from "echarts-for-react";
import { options } from "less";
const MemoizedChart = React.memo(ReactECharts);

const DEFAULT_COLOR = [
  "#5470c6",
  "#91cc75",
  "#fac858",
  "#ee6666",
  "#73c0de",
  "#3ba272",
  "#fc8452",
  "#9a60b4",
  "#ea7ccc",
];
const default_form_data = {
  work: [],
  param: [],
  work_ipt: "",
  param_ipt: "",
  时间: [
    dayjs().subtract(15, "day").format(timeFormat),
    dayjs().format(timeFormat),
  ],
  工厂: "",
  车间: "",
  工序: "",
  机台: "",
  图号: "",
  坩埚编号: "",
};

let point_list = [];

function MeltProcessParam() {
  const formRef = useRef(null);
  const [option_list, setOptionsList] = useState([]);
  const [chart_data, setChartData] = useState({});
  const [draw_spin, setDrawSpin] = useState(false);
  const [chart_spin, setChartSpin] = useState(false);
  const [isRecord, setIsRecord] = useState(false);
  const [work_list, setWorkList] = useState([]); // 坩埚编号
  const [ckb_work_list, setCkbWorkList] = useState([]); // input搜索出来的
  const [param_list, setParamList] = useState([]); // 参数列表
  const [ckb_param_list, setCkbParamList] = useState([]);
  const [tb_data, setTbData] = useState([]);
  const [tb_load, setTbLoad] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClearOpen, setIsClearOpen] = useState(false);
  const [points, setPoints] = useState(false);
  const [modal_point, setModalPoint] = useState([]);
  const [form] = Form.useForm();
  const [ck_all, setCkAll] = useState(false);
  const chgDraw = (lot_list = []) => {
    // 改变图号
    form.setFieldsValue({ work: [] });
    let fur_list = lot_list.map((_) => _.id);
    setWorkList(fur_list);
    setCkbWorkList(fur_list);
  };
  const checkAll = (checked) => {
    setCkAll(checked);
    if (checked) {
      form.setFieldsValue({ work: ckb_work_list });
    } else {
      form.setFieldsValue({ work: [] });
    }
  };
  const clickInvert = () => {
    //
    let w = form.getFieldValue("work");
    let temp = ckb_work_list.filter((e) => !w.includes(e));
    form.setFieldsValue({ work: temp });
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
  const searchParam = (e) => {
    const { param_ipt } = form.getFieldsValue();
    let new_list = param_list.filter((old_item, _) =>
      old_item.includes(param_ipt)
    );
    setCkbParamList(new_list);
  };

  const requestChart = () => {
    const { param, work } = form.getFieldsValue();
    if (param === "" || work.length === 0) {
      message.warning("请选择对应的参数");
      return;
    }
    const { 机台 = "" } = formRef.current.getFormData();
    let val = {
      机台: 机台,
      记录编号: work,
      特征参数: param,
    };
    setChartSpin(true);
    getFeatureStatLineMultipart(
      val,
      (res) => {
        setChartSpin(false);
        const { code, data, msg } = res.data;
        if (code === 0 && data) {
          console.log(data);
          setChartData(data);
        } else {
          setChartData({});
        }
      },
      () => {
        setChartSpin(false);
        setChartData({});
      }
    );
  };
  const reqeustTable = () => {
    const { work } = form.getFieldsValue();
    if (work.length === 0) {
      message.warning("请选择加工编号");
      return;
    }
    const { 机台 = "" } = formRef.current.getFormData();
    let val = {
      机台: 机台,
      记录编号: work,
    };
    setTbLoad(true);
    getCrInspectionForm(
      val,
      (res) => {
        setTbLoad(false);
        const { code, data, msg } = res.data;
        if (code === 0 && data) {
          const { data_list } = data;
          setTbData(data_list);
        } else {
          setTbData([]);
        }
      },
      () => {
        setTbLoad(false);
        setTbData([]);
      }
    );
  };
  const initFeature = () => {
    getFeatureList(
      (res) => {
        const { data, code, msg } = res.data;
        if (code === 0 && data) {
          const { feature_list } = data;
          setParamList(feature_list);
          setCkbParamList(feature_list);
        } else {
        }
      },
      () => {}
    );
  };
  const confirmPoints = (point, text) => {
    point_list.push({ x: point[0], y: point[1], t: text });
    setPoints(!points);
    setIsModalOpen(false);
  };
  const confirmClear = (point) => {
    setIsRecord(false);
    point_list = point;
    setPoints(!points);
    setIsClearOpen(false);
  };
  const columns = [
    {
      title: "序号",
      key: "key",
      dataIndex: "key",
      width: 60,
      render: (x) => x + 1,
    },
    {
      title: "产品加工编号",
      key: "产品加工编号",
      dataIndex: "产品加工编号",
      width: 120,
    },
    {
      title: "外径(mm)",
      children: [
        {
          title: "D1",
          key: "D1",
          dataIndex: "D1",
          width: 60,
        },
        {
          title: "D2",
          key: "D2",
          dataIndex: "D2",
          width: 60,
        },
        {
          title: "D3",
          key: "D3",
          dataIndex: "D3",
          width: 60,
        },
      ],
    },
    {
      title: "厚度(mm)",
      children: [
        {
          title: "T1",
          key: "T1",
          dataIndex: "T1",
          width: 60,
        },
        {
          title: "T2",
          key: "T2",
          dataIndex: "T2",
          width: 60,
        },
        {
          title: "T3",
          key: "T3",
          dataIndex: "T3",
          width: 60,
        },
        {
          title: "TR",
          key: "TR",
          dataIndex: "TR",
          width: 60,
        },
        {
          title: "B",
          key: "B",
          dataIndex: "B",
          width: 60,
        },
      ],
    },
    {
      title: "透明层厚",
      children: [
        {
          title: "TT1(mm)",
          key: "TT1(mm)",
          dataIndex: "TT1(mm)",
          width: 80,
        },
      ],
    },
    {
      title: "间隙",
      children: [
        {
          title: "BG(mm)",
          key: "BG(mm)",
          dataIndex: "BG(mm)",
          width: 80,
        },
        {
          title: "RG(mm)",
          key: "RG(mm)",
          dataIndex: "RG(mm)",
          width: 80,
        },
      ],
    },
    {
      title: "微气泡",
      children: [
        {
          title: "W0",
          key: "W0",
          dataIndex: "W0",
          width: 60,
        },
        {
          title: "R0",
          key: "R0",
          dataIndex: "R0",
          width: 60,
        },
      ],
    },
    {
      title: "判定",
      key: "判定",
      dataIndex: "判定",
      width: 60,
    },
    {
      title: "备注",
      key: "备注",
      dataIndex: "备注",
      width: 100,
    },
  ];
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
  useEffect(() => {
    const name_list = Object.keys(chart_data);
    if (name_list.length > 0) {
      // 设置图表数据
      const opt_list = [];
      name_list.forEach((name) => {
        let data = chart_data[name];
        let key_list = Object.keys(data);
        let temp_series = [];
        let temp_legend = [];
        key_list.forEach((x, _) => {
          temp_legend.push(x);
          temp_series.push({
            name: x,
            type: "line",
            symbol: "none",
            data: data[x].map((item) => [item.x, item.y]),
          });
        });
        let option = {
          title: { text: name, top: 0, left: "center" },
          tooltip: {
            trigger: "axis",
            formatter: (params) => {
              // 自定义tooltips
              let str = `经过时间:\t${params[0].axisValue}<br />`;
              params.forEach((item) => {
                str += `<div>${item.marker}${item.seriesName}:<span style="margin-left:20px;font-weight:600;float:right">${item.data[1]}</span><div>`;
              });
              return str;
            },
          },
          legend: {
            data: temp_legend,
            bottom: 5,
            type: "scroll",
            width: "90%",
          },
          // color: DEFAULT_COLOR,
          grid: {
            left: 37,
            right: 20,
            bottom: 60,
            top: 35,
            containLabel: true,
          },
          toolbox: {
            feature: {
              dataZoom: {},
              restore: {},
              saveAsImage: {},
            },
          },
          xAxis: {
            type: "value",
            name: "经过时间/s",
            nameLocation: "center",
            nameGap: 20,
            min: "dataMin",
            max: "dataMax",
          },
          yAxis: {
            show: false,
            type: "value",
            scale: true,
          },
          series: temp_series,
        };
        opt_list.push(option);
      });
      setOptionsList(opt_list);
    } else {
      setOptionsList([]);
    }
  }, [chart_data]);
  useEffect(() => {
    initFeature();
  }, []);

  return (
    <div>
      <MyBreadcrumb items={["熔融机过程分析", "熔融工艺参数"]} />
      <div className="content_root">
        <ProgressForm
          ref={formRef}
          query_btn={false}
          chgDraw={chgDraw}
          style={{ marginBottom: 16 }}
        />
        <Form component={false} form={form} initialValues={default_form_data}>
          <PanelGroup direction="horizontal">
            <Panel defaultSize={16} minSize={10}>
              <Spin spinning={draw_spin}>
                <div
                  style={{
                    width: "100%",
                    height: 928,
                    display: "block",
                    position: "relative",
                  }}
                >
                  <GeneralCard name="坩埚编号列表">
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
                      <Button size="small" onClick={clickInvert}>
                        反选
                      </Button>
                    </Flex>
                    <div
                      className="of"
                      style={{ height: 850, width: "100%", marginTop: 2 }}
                    >
                      <Form.Item name="work" {...ComputeFormCol(0)}>
                        <Checkbox.Group style={{ width: "100%" }}>
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
                </div>
              </Spin>
            </Panel>
            <PanelResizeHandle style={PanelResizeHandleStyle} />
            <Panel defaultSize={72} minSize={30}>
              <div style={{ width: "100%", height: 560, position: "relative" }}>
                <Space style={{ position: "absolute", top: 5, right: 5 }}>
                  <Button type="primary" onClick={requestChart}>
                    绘图
                  </Button>
                </Space>
                <GeneralCard name="多过程分析图">
                  <Spin spinning={chart_spin}>
                    <div
                      style={{
                        padding: 16,
                        width: "100%",
                        height: 520,
                        overflowY: "auto",
                      }}
                    >
                      {option_list.map((opt, _) => (
                        <MemoizedChart
                          key={_}
                          option={opt}
                          style={{
                            height: 300,
                            width: "100%",
                            border: "1px solid #ccc",
                            padding: 10,
                            marginBottom: 10,
                          }}
                        />
                      ))}
                    </div>
                  </Spin>
                </GeneralCard>
              </div>
              <div
                style={{
                  height: 358,
                  width: "100%",
                  marginTop: 10,
                  position: "relative",
                }}
              >
                <Space style={{ position: "absolute", right: 5, top: 5 }}>
                  <Button type="primary" onClick={reqeustTable}>
                    查询
                  </Button>
                </Space>
                <GeneralCard name="石英坩埚工程检查表">
                  <Table
                    size="small"
                    className="common_table_root of"
                    loading={tb_load}
                    columns={columns}
                    dataSource={tb_data}
                    bordered
                    scroll={{
                      x: "max-content",
                      y: 200,
                    }}
                    pagination={pagination()}
                  />
                </GeneralCard>
              </div>
            </Panel>
            <PanelResizeHandle style={PanelResizeHandleStyle} />
            <Panel defaultSize={12} minSize={5}>
              <div
                style={{
                  width: "100%",
                  height: 928,
                  display: "block",
                  position: "relative",
                }}
              >
                <GeneralCard name="参数列表">
                  <Form.Item name="param_ipt" {...ComputeFormCol(0)}>
                    <Input
                      placeholder="请输入搜索"
                      className="search_ipt"
                      onPressEnter={searchParam}
                    />
                  </Form.Item>
                  <div
                    className="of"
                    style={{ height: 850, width: "100%", marginTop: 2 }}
                  >
                    <Form.Item name="param" {...ComputeFormCol(0)}>
                      <Checkbox.Group style={{ width: "100%" }}>
                        {ckb_param_list.map((x, _) => (
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
              </div>
            </Panel>
          </PanelGroup>
          {/* <SearchFileModal
            open={isSearchOpen}
            option_obj={option_obj}
            onOk={getId}
            onCancel={() => setIsSearchOpen(false)}
          /> */}
        </Form>
      </div>
      <PointModal
        open={isModalOpen}
        point={modal_point}
        onOk={confirmPoints}
        onCancel={() => setIsModalOpen(false)}
      />
      <ClearPointModal
        open={isClearOpen}
        point={point_list}
        onOk={confirmClear}
        onCancel={() => setIsClearOpen(false)}
      />
    </div>
  );
}

export default MeltProcessParam;

import React, { useRef, useState } from "react";
import { GeneralCard, MyBreadcrumb } from "../../../../components/CommonCard";
import { ProgressForm } from "../Form";
import { PanelResizeHandleStyle } from "../../../../components/CommonModal";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Flex,
  Form,
  Input,
  Row,
  Space,
  Spin,
  message,
} from "antd";
import { ComputeFormCol } from "../../../../utils/obj";
import {
  getChannelCotrolLine,
  getFeatureStatLine,
  getPprId,
} from "../../../../apis/anls_api";
import { CommonProgressChart, ScatterLineChart } from "./Chart";
const { RangePicker } = DatePicker;
const { TextArea } = Input;


// 电流分析
function ProgressCurrent() {
  const formRef = useRef(null);
  const [form] = Form.useForm();
  const [work_list, setWorkList] = useState([]); // 产品加工编号
  const [ckb_work_list, setCkbWorkList] = useState([]); // input搜索出来的
  const [load1, setLoad1] = useState(false);
  const [chart_data1, setChartData1] = useState({});
  const [load2, setLoad2] = useState(false);
  const [chart_data2, setChartData2] = useState({}); // 起弧阶段图形
  const [chart_data3, setChartData3] = useState({}); // 起弧阶段管道
  const [load3, setLoad3] = useState(false);
  const [chart_data4, setChartData4] = useState({}); // 平稳阶段图形
  const [chart_data5, setChartData5] = useState({}); // 平稳阶段管道

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
  const requestData = () => {
    const { work } = form.getFieldsValue();
    const { 机台, 工厂, 车间, 工序, 图号 } = formRef.current.getFormData();
    if (work.length === 0) {
      message.warning("清选择加工记录编号");
      return;
    }
    // 请求A相电流
    let val1 = {
      机台,
      记录编号: work,
      特征参数: "A相电流",
    };
    setLoad1(true);
    getFeatureStatLine(
      val1,
      (res) => {
        setLoad1(false);
        const { code, data, msg } = res.data;
        if (code === 0 && data) {
          setChartData1(data);
          let val = Object.keys(data).map((e) => data[e][data[e].length - 1].x);
          if (val.length > 0) {
            let start = 0;
            let end = Math.max(...val);
            form.setFieldsValue({
              时间阶段: `${start}-${end}s`,
              图号: 图号,
              炉台号: "---",
            });
          }
        } else {
          setChartData1({});
        }
      },
      () => {
        setLoad1(false);
        setChartData1({});
      }
    );
    let val2 = {
      机台,
      工厂,
      车间,
      工序,
      图号,
      记录编号: work,
      特征参数: "A相电流",
    };
    setLoad2(true);
    getChannelCotrolLine(
      { ...val2, 阶段: "起弧" },
      (res) => {
        setLoad2(false);
        const { code, data, msg } = res.data;
        if (code === 0 && data) {
          const { 异常批次, 通道管控, 阶段数据 } = data;
          const { line_x_data } = 通道管控;
          let start = line_x_data[0];
          let end = line_x_data[line_x_data.length - 1];
          form.setFieldsValue({
            起弧阶段_异常批次编号: 异常批次.join("\n"),
            起弧阶段: `${start}-${end}s`,
          });
          setChartData2(阶段数据);
          setChartData3(通道管控);
        } else {
          form.setFieldsValue({
            起弧阶段_异常批次编号: "",
            起弧阶段: "",
          });
          setChartData2({});
          setChartData3({});
        }
      },
      () => {
        form.setFieldsValue({
          起弧阶段_异常批次编号: "",
          起弧阶段: "",
        });
        setLoad2(false);
        setChartData2({});
        setChartData3({});
      }
    );
    setLoad3(true);
    getChannelCotrolLine(
      { ...val2, 阶段: "平稳" },
      (res) => {
        setLoad3(false);
        const { code, data, msg } = res.data;
        if (code === 0 && data) {
          const { 异常批次, 通道管控, 阶段数据 } = data;
          const { line_x_data } = 通道管控;
          let start = line_x_data[0];
          let end = line_x_data[line_x_data.length - 1];
          form.setFieldsValue({
            平稳阶段_异常批次编号: 异常批次.join("\n"),
            平稳阶段: `${start}-${end}s`,
          });
          setChartData4(阶段数据);
          setChartData5(通道管控);
        } else {
          form.setFieldsValue({
            平稳阶段_异常批次编号: "",
            平稳阶段: "",
          });
          setChartData4({});
          setChartData5({});
        }
      },
      () => {
        form.setFieldsValue({
          平稳阶段_异常批次编号: "",
          平稳阶段: "",
        });
        setLoad3(false);
        setChartData4({});
        setChartData5({});
      }
    );
  };
  return (
    <div>
      <MyBreadcrumb items={["熔融机过程分析", "电流过程分析"]} />
      <div className="content_root">
        <ProgressForm
          chgDraw={chgDraw}
          requestData={requestData}
          ref={formRef}
          style={{ marginBottom: 16 }}
        />
        <Form
          component={false}
          form={form}
          initialValues={{ work: [], work_ipt: "" }}
        >
          <PanelGroup direction="horizontal">
            <Panel defaultSize={12} minSize={10}>
              <div
                style={{
                  width: "100%",
                  height: 898,
                  display: "block",
                  position: "relative",
                }}
              >
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
                    <Button size="small" onClick={clickInvert}>
                      反选
                    </Button>
                  </Flex>
                  <div
                    className="of"
                    style={{ height: 820, width: "100%", marginTop: 2 }}
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
            </Panel>
            <PanelResizeHandle style={PanelResizeHandleStyle} />
            <Panel defaultSize={88} minSize={70}>
              <Row gutter={[10, 10]}>
                <Col span={24}>
                  <Spin spinning={load1}>
                    <GeneralCard name="A相电流">
                      <div style={{ height: 270, width: "100%", padding: 10 }}>
                        <CommonProgressChart chart_data={chart_data1} />
                      </div>
                    </GeneralCard>
                  </Spin>
                </Col>
                <Col
                  span={8}
                  style={{ display: "flex", flexDirection: "column", gap: 10 }}
                >
                  <Spin spinning={load2}>
                    <GeneralCard name="起弧阶段">
                      <div style={{ height: 240, width: "100%", padding: 5 }}>
                        <CommonProgressChart chart_data={chart_data2} />
                      </div>
                    </GeneralCard>
                  </Spin>
                  <Spin spinning={load3}>
                    <GeneralCard name="平稳阶段">
                      <div style={{ height: 240, width: "100%", padding: 5 }}>
                        <CommonProgressChart chart_data={chart_data4} />
                      </div>
                    </GeneralCard>
                  </Spin>
                </Col>
                <Col
                  span={8}
                  style={{ display: "flex", flexDirection: "column", gap: 10 }}
                >
                  <Spin spinning={load2}>
                    <GeneralCard name="通道管控">
                      <div style={{ height: 240, width: "100%", padding: 5 }}>
                        <ScatterLineChart chart_data={chart_data3} />
                      </div>
                    </GeneralCard>
                  </Spin>
                  <Spin spinning={load3}>
                    <GeneralCard name="通道管控">
                      <div style={{ height: 240, width: "100%", padding: 5 }}>
                        <ScatterLineChart chart_data={chart_data5} />
                      </div>
                    </GeneralCard>
                  </Spin>
                </Col>
                <Col span={8}>
                  <GeneralCard name="批次异常监控">
                    <div
                      style={{ height: 530, width: "100%", padding: 10 }}
                      className="of"
                    >
                      <Row gutter={[0, 10]}>
                        <Col span={24}>
                          <Form.Item
                            name="时间阶段"
                            label="时间阶段"
                            {...ComputeFormCol(5)}
                          >
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            name="图号"
                            label="图号"
                            {...ComputeFormCol(10)}
                          >
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            name="炉台号"
                            label="炉台号"
                            {...ComputeFormCol(10)}
                          >
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col span={24}>
                          <Form.Item
                            name="起弧阶段"
                            label="起弧阶段"
                            {...ComputeFormCol(5)}
                          >
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col span={24}>
                          <Form.Item
                            name="起弧阶段_异常批次编号"
                            label="异常批次编号"
                            {...ComputeFormCol(5)}
                          >
                            <TextArea autoSize />
                          </Form.Item>
                        </Col>
                        <Col span={24}>
                          <Form.Item
                            name="平稳阶段"
                            label="平稳阶段"
                            {...ComputeFormCol(5)}
                          >
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col span={24}>
                          <Form.Item
                            name="平稳阶段_异常批次编号"
                            label="异常批次编号"
                            {...ComputeFormCol(5)}
                          >
                            <TextArea autoSize />
                          </Form.Item>
                        </Col>
                      </Row>
                    </div>
                  </GeneralCard>
                </Col>
              </Row>
            </Panel>
          </PanelGroup>
        </Form>
      </div>
    </div>
  );
}

export default ProgressCurrent;

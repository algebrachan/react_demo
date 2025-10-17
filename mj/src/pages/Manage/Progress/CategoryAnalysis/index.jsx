import React, { useEffect, useRef, useState } from "react";
import {
  DescriptionBox,
  GeneralCard,
  MyBreadcrumb,
} from "../../../../components/CommonCard";
import { ProgressForm } from "../Form";
import {
  Button,
  Checkbox,
  Col,
  Flex,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
  Spin,
  message,
} from "antd";
import {
  getCategoryAnlsLine,
  getFeatureList,
  getPprId,
  getQualityParamList,
} from "../../../../apis/anls_api";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { PanelResizeHandleStyle } from "../../../../components/CommonModal";
import { ComputeFormCol } from "../../../../utils/obj";
import { selectList2Option } from "../../../../utils/string";
import { LineChart1, LineChart2 } from "./Chart";
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  FileFilled,
} from "@ant-design/icons";

// 品类分析

function CategoryAnalysis() {
  const formRef = useRef(null);
  const [form] = Form.useForm();
  const [opt_feature, setOptFeature] = useState([]);
  const [opt_quality, setOptQuality] = useState([]);
  const [work_list, setWorkList] = useState([]); // 产品加工编号
  const [ckb_work_list, setCkbWorkList] = useState([]); // input搜索出来的
  const [ck_all, setCkAll] = useState(false);
  const [load, setLoad] = useState(false);
  const [chart_data, setChartData] = useState({});
  const [fq, setFq] = useState({});
  const chgDraw = (lot_list = []) => {
    // 改变图号
    form.setFieldsValue({ work: [] });
    setWorkList(lot_list);
    setCkbWorkList(lot_list);
  };
  const checkAll = (checked) => {
    setCkAll(checked);
    if (checked) {
      let temp = ckb_work_list.map((e) => e.id);
      form.setFieldsValue({ work: temp });
    } else {
      form.setFieldsValue({ work: [] });
    }
  };
  const clickInvert = () => {
    //
    let w = form.getFieldValue("work");
    let temp = ckb_work_list.filter((e) => !w.includes(e.id)).map((e) => e.id);
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
      old_item.id.includes(work_ipt)
    );
    setCkbWorkList(new_list);
  };
  const initOpt = () => {
    getFeatureList(
      (res) => {
        const { data, code, msg } = res.data;
        if (code === 0 && data) {
          const { feature_list } = data;
          setOptFeature(feature_list);
          form.setFieldsValue({ 过程参数: feature_list[0] });
        } else {
          form.setFieldsValue({ 过程参数: "" });
        }
      },
      () => {
        form.setFieldsValue({ 过程参数: "" });
      }
    );
    getQualityParamList(
      (res) => {
        const { data, code, msg } = res.data;
        if (code === 0 && data) {
          const { quality_param_list } = data;
          setOptQuality(quality_param_list);
          form.setFieldsValue({ 质量参数: quality_param_list[0] });
        } else {
          form.setFieldsValue({ 质量参数: "" });
        }
      },
      () => {
        form.setFieldsValue({ 质量参数: "" });
      }
    );
  };
  const requestData = () => {
    const { work, 过程参数, 质量参数, 规格上限, 规格下限 } =
      form.getFieldsValue();
    if (work.length === 0) {
      message.warning("请选择记录编号");
      return;
    }
    const { 机台, 工厂, 车间, 工序, 图号 } = formRef.current.getFormData();
    let val = {
      记录编号: work,
      过程参数,
      质量参数,
      规格上限,
      规格下限,
      机台,
      工厂,
      车间,
      工序,
      图号,
    };
    setLoad(true);
    getCategoryAnlsLine(
      val,
      (res) => {
        setLoad(false);
        const { code, data, msg } = res.data;
        if (code === 0 && data) {
          setChartData(data);
          setFq({ 过程参数, 质量参数 });
        } else {
          setFq({});
          message.error(msg);
        }
      },
      () => {
        setLoad(false);
        setFq({});
        message.error("服务异常");
      }
    );
  };
  useEffect(() => {
    initOpt();
  }, []);
  return (
    <div>
      <MyBreadcrumb items={["熔融机过程分析", "品类分析"]} />
      <div className="content_root">
        <ProgressForm
          ref={formRef}
          query_btn={false}
          chgDraw={chgDraw}
          style={{ marginBottom: 16 }}
        />
        <Form
          component={false}
          form={form}
          initialValues={{
            work: [],
            work_ipt: "",
            过程参数: "",
            质量参数: "",
            规格上限: 708,
            规格下限: 702,
          }}
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
                    style={{ height: 628, width: "100%", marginTop: 2 }}
                  >
                    <Form.Item name="work" {...ComputeFormCol(0)}>
                      <Checkbox.Group style={{ width: "100%" }}>
                        {ckb_work_list.map((x, _) => (
                          <Checkbox
                            value={x.id}
                            key={_}
                            className="check_box_item"
                          >
                            <Flex justify="space-between">
                              {x.id}
                              {x.noData ? (
                                <ExclamationCircleOutlined
                                  style={{ color: "red", marginLeft: 10 }}
                                />
                              ) : (
                                <CheckCircleOutlined
                                  style={{ color: "green", marginLeft: 10 }}
                                />
                              )}
                            </Flex>
                          </Checkbox>
                        ))}
                      </Checkbox.Group>
                    </Form.Item>
                  </div>
                  <Flex
                    style={{
                      height: 150,
                      width: "100%",
                      padding: 10,
                      background: "#F5F7FC",
                      border: "1px solid #DDDDDD",
                    }}
                    vertical
                    gap={10}
                  >
                    <Form.Item
                      label="过程参数"
                      name="过程参数"
                      {...ComputeFormCol(8)}
                    >
                      <Select
                        size="small"
                        options={selectList2Option(opt_feature)}
                      />
                    </Form.Item>
                    <Form.Item
                      label="质量参数"
                      name="质量参数"
                      {...ComputeFormCol(8)}
                    >
                      <Select
                        size="small"
                        options={selectList2Option(opt_quality)}
                      />
                    </Form.Item>
                    <Flex justify="end">
                      <Space>
                        <Button
                          type="primary"
                          size="small"
                          onClick={() =>
                            form.setFieldsValue({
                              过程参数:
                                opt_feature.length > 0 ? opt_feature[0] : "",
                              质量参数:
                                opt_quality.length > 0 ? opt_quality[0] : "",
                            })
                          }
                        >
                          重置选择
                        </Button>
                        <Button
                          type="primary"
                          size="small"
                          onClick={requestData}
                        >
                          开始分析
                        </Button>
                      </Space>
                    </Flex>
                  </Flex>
                </GeneralCard>
              </div>
            </Panel>
            <PanelResizeHandle style={PanelResizeHandleStyle} />
            <Panel defaultSize={88} minSize={80}>
              <div style={{ width: "100%", height: 898, position: "relative" }}>
                <Space style={{ position: "absolute", top: 4, right: 10 }}>
                  <Button type="primary">导出结果</Button>
                </Space>
                <GeneralCard name="分析结果">
                  <Spin spinning={load}>
                    <Row gutter={[16, 16]} style={{ padding: 16 }}>
                      <Col span={24}>
                        <Flex gap={16}>
                          <Form.Item
                            label="规格上限"
                            name="规格上限"
                            style={{ marginTop: 10 }}
                          >
                            <InputNumber />
                          </Form.Item>
                          <Form.Item
                            label="规格下限"
                            name="规格下限"
                            style={{ marginTop: 10 }}
                          >
                            <InputNumber />
                          </Form.Item>
                          {[
                            "Class1(超规格上限)",
                            "Class0(符合规格)",
                            "Class-1(超规格下限)",
                          ].map((e, _) => (
                            <DescriptionBox
                              key={_}
                              label={e}
                              value={chart_data[e]}
                            />
                          ))}
                        </Flex>
                      </Col>
                      <Col span={12}>
                        <GeneralCard name="趋势图">
                          <div
                            style={{ width: "100%", padding: 10, height: 340 }}
                          >
                            <LineChart1
                              chart_data={chart_data["趋势图"]}
                              xLabel={fq["过程参数"]}
                              yLabel="经过时间/s"
                            />
                          </div>
                        </GeneralCard>
                      </Col>
                      <Col span={12}>
                        <GeneralCard name="品类中心趋势图">
                          <div
                            style={{ width: "100%", padding: 10, height: 340 }}
                          >
                            <LineChart2
                              chart_data={chart_data["品类中心趋势图"]}
                              xLabel={fq["过程参数"]}
                              yLabel="经过时间/s"
                            />
                          </div>
                        </GeneralCard>
                      </Col>
                      <Col span={12}>
                        <GeneralCard name="分布图">
                          <div
                            style={{ width: "100%", padding: 10, height: 320 }}
                          >
                            <LineChart1
                              chart_data={chart_data["分布图"]}
                              xLabel={fq["过程参数"]}
                              yLabel="密度"
                            />
                          </div>
                        </GeneralCard>
                      </Col>
                      <Col span={12}>
                        <GeneralCard name="品类中心分布图">
                          <div
                            style={{ width: "100%", padding: 10, height: 320 }}
                          >
                            <LineChart2
                              chart_data={chart_data["品类中心分布图"]}
                              xLabel={fq["过程参数"]}
                              yLabel="密度"
                            />
                          </div>
                        </GeneralCard>
                      </Col>
                    </Row>
                  </Spin>
                </GeneralCard>
              </div>
            </Panel>
          </PanelGroup>
        </Form>
      </div>
    </div>
  );
}

export default CategoryAnalysis;

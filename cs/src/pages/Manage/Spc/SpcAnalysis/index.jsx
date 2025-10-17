import React, { useEffect, useState } from "react";
import { GeneralCard, MyBreadcrumb } from "../../../../components/CommonCard";
import {
  Button,
  Col,
  DatePicker,
  Descriptions,
  Flex,
  Form,
  Input,
  Row,
  Select,
  Space,
  Spin,
  Checkbox,
  Modal,
  AutoComplete,
} from "antd";
import dayjs from "dayjs";
import { selectList2Option, timeFormat } from "../../../../utils/string";
import { InfoModal, SpcModal } from "./SpcModal";
import { DistChart, ProcessSpcChart, SpcChart } from "./Chart";
import {
  getSpcAnalysis,
  getSpcOptions,
  reSpcaAnalysis,
  rprocessSpcAnalysis,
} from "../../../../apis/anls_router";
import "./spc.less";
import CommonTable from "../../../../components/CommonTable";
import { message } from "antd";
const { RangePicker } = DatePicker;

const TestPurpose = {
  到货检验: ["GDMS全元素检验", "D-SIMS"],
  月度抽检: ["GDMS全元素检验"],
  研发测试: ["ICPMS/MS", "GDMS部分元素检验"],
};

const default_query_form = {
  时间: [
    dayjs().subtract(3, "day").format(timeFormat),
    dayjs().format(timeFormat),
  ],
  工厂: "创盛",
  车间: "",
  工序: "",
  机台: "",
  检测目的: "",
  检测方法: "",
  供应商名称: "",
  特征: "",
  控制图类型: "I-MR控制图",
  聚合周期: "一天",
  参数分布: "正态分布",
  炉次号: "",
  设备号: "",
  tz: "",
  sj: "进入工艺时间",
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

const ChildContent = ({
  data: {
    Data1 = {},
    Data2 = {},
    Data3 = {},
    outlier1 = [],
    outlier2 = [],
    dataSummary = {},
  },
  chart_name = ["", ""],
}) => {
  return (
    <Row gutter={[10, 10]}>
      <Col span={9}>
        <GeneralCard name={chart_name[0]}>
          <SpcChart chart_data={Data1} />
        </GeneralCard>
      </Col>
      <Col span={9}>
        <GeneralCard name={chart_name[1]}>
          <SpcChart chart_data={Data2} />
        </GeneralCard>
      </Col>
      <Col span={6}>
        <GeneralCard name="能力直方图">
          <DistChart chart_data={Data3} />
        </GeneralCard>
      </Col>
      <Col span={24}>
        <GeneralCard name="数据摘要">
          <div style={{ width: "100%", height: 180, padding: 10 }}>
            <Descriptions
              size="small"
              column={7}
              title=""
              layout="vertical"
              bordered
              items={Object.keys(dataSummary).map((e, _) => ({
                key: _,
                label: (
                  <span style={{ color: "#333", fontWeight: 600 }}>{e}</span>
                ),
                children: dataSummary[e],
              }))}
            />
          </div>
        </GeneralCard>
      </Col>
    </Row>
  );
};

const PrccessContent = ({
  process_data = {},
  requestProcessSpc = () => {},
}) => {
  const [ipt, setIpt] = useState("");
  return (
    <Row gutter={[10, 10]}>
      <Col span={24}>
        <Flex align="center" gap={16}>
          <span style={{ fontSize: 16 }}>晶体:</span>
          <Input
            style={{ width: 100 }}
            value={ipt}
            onChange={(e) => setIpt(e.target.value)}
          />
          <Button type="primary" onClick={() => requestProcessSpc(ipt)}>
            加工SPC
          </Button>
        </Flex>
      </Col>
      <Col span={8}>
        <GeneralCard name="电阻率">
          <ProcessSpcChart chart_data={process_data["resistivity"] || {}} />
        </GeneralCard>
      </Col>
      <Col span={8}>
        <GeneralCard name="微管">
          <ProcessSpcChart chart_data={process_data["microtubule"] || {}} />
        </GeneralCard>
      </Col>
      <Col span={8}>
        <GeneralCard name="位错">
          <ProcessSpcChart chart_data={process_data["dislocation"] || {}} />
        </GeneralCard>
      </Col>
      <Col span={8}>
        <GeneralCard name="缺陷">
          <ProcessSpcChart chart_data={process_data["defect"] || {}} />
        </GeneralCard>
      </Col>
      <Col span={8}>
        <GeneralCard name="应力">
          <ProcessSpcChart chart_data={process_data["stress"] || {}} />
        </GeneralCard>
      </Col>
    </Row>
  );
};

function SpcAnalysis() {
  const [query_form] = Form.useForm();
  const gongxu = Form.useWatch("工序", query_form);
  const [query_opt, setQueryOpt] = useState({
    工厂: ["创盛"],
    车间: [],
    工序: [],
    特征: [],
    控制图类型: ["I-MR控制图", "Xbar-R控制图", "Xbar-S控制图"],
    参数分布: ["正态分布", "对数正态分布", "平方根正态分布"],
    参数: {},
    机台: {},
  });
  const [selectedProcess, setSelectedProcess] = useState("");
  const [feature_list, setFeatureList] = useState([]);
  const [dev_list, setDevList] = useState([]);
  const [load, setLoad] = useState(false);
  const [re_load, setReLoad] = useState(false);
  const [desc_items_obj, setDescItemsObj] = useState(default_desc_items_obj);
  const [chart_data1, setChartData1] = useState({});
  const [chart_data2, setChartData2] = useState({});
  const [chart_data3, setChartData3] = useState({});
  const [outlier1, setOutlier1] = useState([]);
  const [outlier2, setOutlier2] = useState([]);
  const [tb_header, setTbHeader] = useState([]);
  const [tb_columns, setTbColumns] = useState([]);
  const [tz_list, setTzList] = useState([]);
  const [tb_data, setTbData] = useState([]);
  const [edit_modal, setEditModal] = useState(false);
  // const [info_modal, setInfoModal] = useState(false);
  // const [cur_fur, setCurFur] = useState("");
  const [re_data, setReData] = useState({});
  const [chart_name, setChartName] = useState(["Xbar", "S"]);
  const [isColumnModalVisible, setIsColumnModalVisible] = useState(false);
  const [checkedList, setCheckedList] = useState([]);
  const [filter_data, setFilterData] = useState({});
  const [process_data, setProcessData] = useState({});
  const [process_load, setProcessLoad] = useState(false);
  const [testMethodOptions, setTestMethodOptions] = useState([]);

  // 添加检测目的变化处理函数
  const handleTestPurposeChange = (value) => {
    // 清空检测方法的值
    query_form.setFieldValue("检测方法", "");
    // 更新检测方法选项
    if (value) {
      setTestMethodOptions(
        TestPurpose[value].map((method) => ({
          label: method,
          value: method,
        }))
      );
    } else {
      setTestMethodOptions([]);
    }
  };
  const options = tb_header.map(({ key, title, zone }) => ({
    label: title,
    value: key,
    zone: zone,
  }));

  const GpDict = {
    1: "内场",
    2: "外场",
    3: "现场",
  };
  const groupedOptions = options.reduce((acc, opt) => {
    const groupKey = GpDict[opt.zone] || "未分组";
    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }
    acc[groupKey].push(opt);
    return acc;
  }, {});

  const requestData = () => {
    let val = query_form.getFieldsValue();
    let param = {
      机台: "",
      ...val,
    };
    setLoad(true);
    getSpcAnalysis(
      param,
      (res) => {
        setLoad(false);
        setFilterData({});
        const { code, msg, data } = res.data;
        if (code === 0 && data) {
          const {
            Data1,
            Data2,
            Data3,
            dataSummary,
            indexes = [],
            allData = [],
            header = [],
          } = data;
          setDescItemsObj(dataSummary || default_desc_items_obj);
          setChartData1(Data1);
          setChartData2(Data2);
          setChartData3(Data3);
          setOutlier1(indexes);
          setOutlier2([]);
          setTbData(allData);
          const floatNames = header
            .filter((item) => item.type === "float")
            .map((item) => item.name);
          setTzList(floatNames);
          let temp_header = header.map((e) => ({
            title: e.name,
            key: e.name,
            dataIndex: e.name,
            type: e.type,
            zone: e.zone,
          }));
          setTbHeader(temp_header);
          setTbColumns(temp_header);
        } else {
          setDescItemsObj({});
          setChartData1({});
          setChartData2({});
          setChartData3({});
          setOutlier1([]);
          setOutlier2([]);
          setTbData([]);
          setTzList([]);
        }
      },
      () => {
        setLoad(false);
        setDescItemsObj({});
        setChartData1({});
        setChartData2({});
        setChartData3({});
        setOutlier1([]);
        setOutlier2([]);
        setTbData([]);
        setTzList([]);
      }
    );
  };
  const onFilterChange = (val) => {
    setFilterData(val);
  };
  const requestReData = () => {
    let { 工序, tz, 控制图类型, 聚合周期, 参数分布, sj } =
      query_form.getFieldsValue();
    const { currentDataSource } = filter_data;
    let param = {
      时间: sj,
      工序,
      特征: tz,
      控制图类型,
      聚合周期,
      参数分布,
      data: currentDataSource || tb_data,
    };
    setReLoad(true);
    reSpcaAnalysis(
      param,
      (res) => {
        setReLoad(false);
        const { code, msg, data } = res.data;
        if (code === 0 && data) {
          setReData(data);
        } else {
          message.error(msg);
          setReData({});
        }
      },
      () => {
        setReLoad(false);
        setReData({});
      }
    );
  };
  const requestProcessSpc = (val) => {
    const { filters: { 炉次号 = [] } = {} } = filter_data;

    let crystals = val ? [val] : 炉次号;
    setProcessLoad(true);
    rprocessSpcAnalysis(
      { crystals },
      (res) => {
        setProcessLoad(false);
        const { code, msg, data } = res.data;
        if (code === 0 && data) {
          setProcessData(data);
        } else {
          message.error(msg);
          setProcessData({});
        }
      },
      () => {
        setProcessLoad(false);
        setProcessData({});
      }
    );
  };

  const initOpt = () => {
    getSpcOptions(
      (res) => {
        const { code, msg, data } = res.data;
        if (code === 0 && data) {
          const {
            车间 = [],
            工序 = [],
            参数 = {},
            机台 = {},
            time = {},
          } = data;
          let c = 车间?.[0] ?? "";
          let g = 工序?.[0] ?? "";
          let f = 参数?.[g]?.[0] ?? "";
          let t = time[g]?.[f] ?? dayjs().format(timeFormat);
          setSelectedProcess(g);
          query_form.setFieldsValue({
            车间: c,
            工序: g,
            特征: f,
            时间: [dayjs(t).subtract(3, "day").format(timeFormat), t],
          });
          setDevList(机台[车间?.[0]] ?? []);
          setFeatureList(参数?.[工序?.[0]] ?? []);
          setQueryOpt((prev) => ({
            ...prev,
            ...data,
          }));
        } else {
          message.error(msg);
        }
      },
      () => {}
    );
  };

  useEffect(() => {
    if (gongxu && gongxu === "质量") {
      query_form.setFieldsValue({ 聚合周期: "按截止日期前25组" });
    } else {
      query_form.setFieldsValue({ 聚合周期: "一天" });
    }
  }, [gongxu]);
  useEffect(() => {
    const defaultCheckedList = tb_header.map((item) => item.key);
    setCheckedList(defaultCheckedList);
  }, [tb_header]);
  useEffect(() => {
    if (query_opt["工序"].length > 0) {
      requestData();
    }
  }, [query_opt]);
  useEffect(() => {
    initOpt();
    requestProcessSpc();
  }, []);

  return (
    <div className="spc_root">
      <MyBreadcrumb items={["创盛长晶智能集控系统", "SPC分析"]} />
      <div className="content_root">
        <Form
          form={query_form}
          initialValues={default_query_form}
          layout="inline"
          component={false}
          style={{
            display: "flex",
            rowGap: 20,
            flexDirection: "column",
          }}
        >
          <Flex vertical gap={20}>
            <Flex gap={10}>
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
                <RangePicker
                  showTime
                  allowClear={false}
                  style={{ width: 330 }}
                />
              </Form.Item>
              <Form.Item label="工厂" name="工厂">
                <Select
                  options={selectList2Option(query_opt["工厂"])}
                  style={{ width: 120 }}
                />
              </Form.Item>
              <Form.Item label="车间" name="车间">
                <Select
                  onChange={(val) => {
                    query_form.setFieldsValue({ 机台: "" });
                    setDevList(query_opt["机台"]?.[val] ?? []);
                  }}
                  options={selectList2Option(query_opt["车间"])}
                  style={{ width: 120 }}
                />
              </Form.Item>
              <Form.Item label="工序" name="工序">
                <Select
                  onChange={(val) => {
                    setSelectedProcess(val);
                    let f_list = query_opt["参数"][val];
                    setFeatureList(f_list);
                    let f = f_list?.[0] ?? "";
                    let t =
                      query_opt["time"]?.[val]?.[f] ??
                      dayjs().format(timeFormat);
                    query_form.setFieldsValue({
                      特征: f,
                      时间: [dayjs(t).subtract(3, "day").format(timeFormat), t],
                    });
                  }}
                  options={selectList2Option(query_opt["工序"])}
                  style={{ width: 120 }}
                />
              </Form.Item>
              {gongxu === "生产" && (
                <Form.Item label="机台" name="机台">
                  <Select
                    showSearch
                    options={selectList2Option(dev_list)}
                    style={{ width: 120 }}
                  />
                </Form.Item>
              )}
              {gongxu === "质量" && (
                <>
                  <Form.Item label="检测目的" name="检测目的">
                    <Select
                      placeholder="请选择"
                      style={{ width: 120 }}
                      onChange={handleTestPurposeChange}
                      options={Object.keys(TestPurpose).map((purpose) => ({
                        label: purpose,
                        value: purpose,
                      }))}
                    />
                  </Form.Item>
                  <Form.Item label="检测方法" name="检测方法">
                    <Select
                      placeholder="请选择"
                      style={{ width: 140 }}
                      options={testMethodOptions}
                      disabled={testMethodOptions.length === 0}
                    />
                  </Form.Item>
                  <Form.Item label="供应商名称" name="供应商名称">
                    <AutoComplete
                      options={selectList2Option(query_opt["供应商"])}
                      style={{ width: 120 }}
                    />
                  </Form.Item>
                </>
              )}
              <Form.Item label="特征" name="特征">
                <Select
                  onChange={(val) => {
                    let g = query_form.getFieldValue("工序");
                    let t =
                      query_opt["time"]?.[g]?.[val] ??
                      dayjs().format(timeFormat);
                    query_form.setFieldsValue({
                      时间: [dayjs(t).subtract(3, "day").format(timeFormat), t],
                    });
                  }}
                  showSearch
                  options={selectList2Option(feature_list)}
                  style={{ width: 180 }}
                />
              </Form.Item>
            </Flex>
            <Flex gap={10}>
              <Form.Item label="聚合周期" name="聚合周期">
                <Select
                  options={selectList2Option(
                    gongxu === "质量"
                      ? ["按截止日期前25组", "按当前日期前25组"]
                      : ["一天", "一周"]
                  )}
                  style={{ width: 180 }}
                />
              </Form.Item>
              <Form.Item label="控制图类型" name="控制图类型">
                <Select
                  onChange={(val) => {
                    let str_list = val.replace("控制图", "").split("-");
                    setChartName(str_list);
                  }}
                  options={selectList2Option(query_opt["控制图类型"])}
                  style={{ width: 150 }}
                />
              </Form.Item>
              <Form.Item label="参数分布" name="参数分布">
                <Select
                  options={selectList2Option(query_opt["参数分布"])}
                  style={{ width: 150 }}
                />
              </Form.Item>
              <Space size={20}>
                <Button type="primary" onClick={requestData}>
                  查询
                </Button>
              </Space>
            </Flex>
            <Spin spinning={load}>
              <Row gutter={[16, 16]}>
                <Col span={9}>
                  <GeneralCard name={chart_name[0]}>
                    <SpcChart chart_data={chart_data1} outlier={outlier1} />
                  </GeneralCard>
                </Col>
                <Col span={9}>
                  <GeneralCard name={chart_name[1]}>
                    <SpcChart chart_data={chart_data2} outlier={outlier2} />
                  </GeneralCard>
                </Col>
                <Col span={6}>
                  <GeneralCard name="能力直方图">
                    <DistChart chart_data={chart_data3} />
                  </GeneralCard>
                </Col>
                <Col
                  span={24}
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
                    <div
                      style={{
                        width: "100%",
                        // height: 400,
                        padding: 10,
                        position: "relative",
                      }}
                    >
                      <Flex
                        style={{ position: "absolute", top: -38, left: 100 }}
                        gap={10}
                      >
                        <Space>
                          <Form.Item label="时间" name="sj">
                            <Select
                              id="sj"
                              style={{ width: 160 }}
                              options={selectList2Option([
                                "进入工艺时间",
                                "开炉日期",
                                "装埚时间",
                              ])}
                            />
                          </Form.Item>
                          <Form.Item label="特征" name="tz">
                            <Select
                              showSearch
                              style={{ width: 160 }}
                              options={selectList2Option(tz_list)}
                            />
                          </Form.Item>
                          <Button type="primary" onClick={requestReData}>
                            反向绘制
                          </Button>
                          <Button
                            type="primary"
                            onClick={() => setIsColumnModalVisible(true)}
                          >
                            表头筛选
                          </Button>
                        </Space>
                      </Flex>
                      <CommonTable
                        dataSource={tb_data}
                        columns={tb_columns}
                        onFilterChange={onFilterChange}
                      />
                    </div>
                  </GeneralCard>
                </Col>
              </Row>
            </Spin>
            <Spin spinning={re_load}>
              <ChildContent data={re_data} chart_name={chart_name} />
            </Spin>
            {["6寸", "6寸测试", "8寸", "8寸测试", "8改6"].includes(
              selectedProcess
            ) && (
              <Spin spinning={process_load}>
                <PrccessContent
                  process_data={process_data}
                  requestProcessSpc={requestProcessSpc}
                />
              </Spin>
            )}
          </Flex>
        </Form>
      </div>
      <SpcModal open={edit_modal} onCancel={() => setEditModal(false)} />
      <Modal
        title="表头筛选"
        open={isColumnModalVisible}
        onCancel={() => setIsColumnModalVisible(false)}
        footer={[
          <Button
            key="1"
            onClick={() => {
              // 获取所有表头的 key
              const allKeys = tb_header.map((item) => item.key);
              // 反选逻辑：当前选中的变为未选中，未选中的变为选中
              const newCheckedList = allKeys.filter(
                (key) => !checkedList.includes(key)
              );
              setCheckedList(newCheckedList);
            }}
          >
            反选
          </Button>,
          <Button
            key="2"
            onClick={() => {
              // 获取所有表头的 key
              const allKeys = tb_header.map((item) => item.key);
              setCheckedList(allKeys);
            }}
          >
            重置
          </Button>,
          <Button key="back" onClick={() => setIsColumnModalVisible(false)}>
            取消
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => {
              setIsColumnModalVisible(false);
              const newColumns = tb_header.map((item) =>
                Object.assign(Object.assign({}, item), {
                  hidden: !checkedList.includes(item.key),
                })
              );
              setTbColumns(newColumns);
            }}
          >
            确定
          </Button>,
        ]}
        width={900}
      >
        <Checkbox.Group
          value={checkedList}
          onChange={(value) => {
            setCheckedList(value);
          }}
          style={{ width: "100%" }}
          // options={options.map((opt) => ({
          //   ...opt,
          //   style: {
          //     minWidth: 180,
          //     marginRight: 24,
          //     whiteSpace: "nowrap",
          //   },
          // }))}
        >
          {Object.entries(groupedOptions).map(([groupName, items]) => (
            <div key={groupName} style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: "bold", marginBottom: 8 }}>
                {groupName}
              </div>
              {items.map((opt) => (
                <Checkbox
                  key={opt.value}
                  value={opt.value}
                  style={{
                    minWidth: 180,
                    marginRight: 24,
                    whiteSpace: "nowrap",
                  }}
                >
                  {opt.label}
                </Checkbox>
              ))}
            </div>
          ))}
        </Checkbox.Group>
      </Modal>
      {/* <InfoModal
        open={info_modal}
        onCancel={() => setInfoModal(false)}
        fur={cur_fur}
      /> */}
    </div>
  );
}

export default SpcAnalysis;

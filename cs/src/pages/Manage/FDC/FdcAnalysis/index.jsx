import React, {useEffect, useState} from "react";
import {GeneralCard, MyBreadcrumb} from "../../../../components/CommonCard";
import {
  Button,
  Col,
  Flex,
  Form,
  Row,
  Select,
  Space,
  Spin,
  Table,
  Tree,
  message,
} from "antd";
import {Panel, PanelGroup, PanelResizeHandle} from "react-resizable-panels";
import {PanelResizeHandleStyle} from "../../../../components/CommonModal";
import {ComputeFormCol} from "../../../../utils/obj";
import {selectList2Option} from "../../../../utils/string";
import {
  AuditOutlined,
  CloseCircleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import {LineChart} from "./Chart";
import useWebSocket from "../../../../utils/websocket";
import {
  getDeviceSearch,
  getFdcAbnormalData,
  getFdcDevice,
  getFdcDeviceCondition,
} from "../../../../apis/fdc_api";

// import { base_ws } from "../../../../apis/instance";
function FdcAnalysis() {
  const [webSocket, sendMessage, lastMessage, isConnected] = useWebSocket({
    url: `${import.meta.env.VITE_FDC_WS_API}/api/home_analysis/parameter_monitoring`, //这里放长链接
    onOpen: () => {
      //连接成功
      console.log("WebSocket connected");
    },
    onClose: () => {
      //连接关闭
      console.log("WebSocket disconnected");
    },
    onError: (event) => {
      //连接异常
      console.error("WebSocket error:", event);
    },
    onMessage: (val) => {
      //收到消息
      // console.log("WebSocket received message:", message);
      const {code, data, msg} = val;
      if (code === 200) {
        setChartLoad(false);
        setChartList(data);
      } else {
        setChartLoad(false);
        message.error(msg);
      }
    },
  });
  const [form] = Form.useForm();
  const [query_opt, setQueryOpt] = useState({});
  const [tree, setTree] = useState([]); //树状图
  const [tree_load, setTreeLoad] = useState(false);
  const [point_list, setPointList] = useState([]); //所有点位的列表
  const [dev_list, setDevList] = useState([]);
  const [param_list, setParamList] = useState([]);
  const [checked_dev, setCheckedDev] = useState([]);
  const [chart_load, setChartLoad] = useState(false);
  const [chart_list, setChartList] = useState([]);
  const [cur, setCur] = useState(1);
  const [page_size, setPageSize] = useState(10);
  const [tb_total, setTbTotal] = useState(0);
  const [tb_data, setTbData] = useState([]);
  const [tb_load, setTbLoad] = useState(false);
  const default_query_form = {
    工厂: "",
    车间: "",
    工序: "",
    device_id: "",
    point_id: "",
    alarm_grade: 0,
    status: 0,
  };
  const handleValuesChange = (changedValues, allValues) => {
    const {工厂, 车间, 工序} = changedValues;
    if (工厂 || 车间 || 工序) {
      // 请求设备
    }
  };
  const pagination = () => {
    return {
      current: cur,
      pageSize: page_size,
      position: ["bottomCenter"],
      total: tb_total,
      showTotal: (total) => `共 ${total} 条`,
      showQuickJumper: true,
      showSizeChanger: true,
      onChange: (page, pageSize) => {
        setCur(page);
        setPageSize(pageSize);
        requestData(page, pageSize);
        // 请求数据
      },
    };
  };
  const generateColumns = () => {
    let columns = [
      "设备",
      "参数",
      "紧急程度",
      "值",
      "规则",
      "上限",
      "下限",
      "偏差",
      "状态",
    ].map((e, _) => {
      let col = {
        title: e,
        dataIndex: e,
        key: e,
      };
      return col;
    });
    columns.unshift({
      title: "序号",
      dataIndex: "key",
      key: "key",
      width: 50,
    });
    columns.push({
      title: "操作",
      key: "opt",
      width: 100,
      render: (record) => (
        <Space>
          <Button style={{padding: 0}} type="link" icon={<EyeOutlined />}>
            查看
          </Button>
          <Button style={{padding: 0}} type="link" icon={<AuditOutlined />}>
            处理
          </Button>
          <Button
            style={{padding: 0}}
            type="link"
            danger
            icon={<CloseCircleOutlined />}
          >
            关闭
          </Button>
        </Space>
      ),
    });
    return columns;
  };
  const getDev = () => {
    const {工厂, 车间, 工序} = form.getFieldsValue();
    if (工厂 === "" || 车间 === "" || 工序 === "") {
      return;
    }
    let val = {
      factory: 工厂,
      workshop: 车间,
      process: 工序,
    };
    setCheckedDev([]);
    setTreeLoad(true);
    getFdcDevice(
      val,
      (res) => {
        setTreeLoad(false);
        const {data, code, msg} = res.data;
        if (code === 200 && data) {
          setTree(data);
        } else {
          setTree([]);
        }
      },
      () => {
        setTreeLoad(false);
        setTree([]);
      }
    );
  };
  const initOpt = () => {
    getDeviceSearch(
      (res) => {
        const {code, msg, data} = res.data;
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
  const requestData = (page, limit) => {
    const {device_id, point_id, alarm_grade, status} = form.getFieldsValue();
    let val = {
      page,
      limit,
      device_id,
      point_id,
      alarm_grade,
      status,
    };
    setTbLoad(true);
    getFdcAbnormalData(
      val,
      (res) => {
        setTbLoad(false);
        const {data, code, msg, length} = res.data;
        if (code === 200 && data) {
          setTbData(data);
          setTbTotal(length);
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
  const confirmParam = (checked_dev) => {
    if (checked_dev.length === 0) {
      sendMessage({device_infos: []});
      setChartList([]);
      return;
    }
    // 从point_list中过滤
    setChartLoad(true);
    let device_infos = point_list.filter((e) => checked_dev.includes(e.key));
    sendMessage({device_infos});
  };
  useEffect(() => {
    setParamList([]);
    if (tree.length > 0) {
      let point = [];
      let dev = [];
      tree.forEach((e) => {
        dev.push({label: e.device_name, value: e.device_id});
        e.children.forEach((x) => {
          point.push(x);
        });
      });
      setPointList(point);
      setDevList(dev);
    } else {
      setPointList([]);
      setDevList([]);
      form.setFieldsValue({
        device_id: "",
        point_id: "",
      });
    }
  }, [tree]);
  useEffect(() => {
    if (Object.keys(query_opt).length > 0) {
      // 设置初始化数据
      const {工厂 = [], 车间 = [], 工序 = {}} = query_opt;
      let val = {};
      if (工厂.length > 0) {
        val["工厂"] = 工厂[0];
      }
      if (车间.length > 0) {
        val["车间"] = 车间[0];
        val["工序"] = 工序[车间[0]];
      }
      form.setFieldsValue(val);
      getDev();
    }
  }, [query_opt]);
  useEffect(() => {
    initOpt();
  }, []);
  return (
    <div>
      <MyBreadcrumb items={[window.sys_name, "FDC分析"]} />
      <div className="content_root">
        <Form
          component={false}
          form={form}
          initialValues={default_query_form}
          // onValuesChange={handleValuesChange}
        >
          <PanelGroup direction="horizontal">
            <Panel defaultSize={12} minSize={10}>
              <div
                style={{
                  width: "100%",
                  height: 710,
                  display: "block",
                }}
              >
                <GeneralCard name="设备树">
                  <Spin spinning={tree_load}>
                    <div style={{width: "100%", height: 660}} className="of">
                      <Flex
                        style={{
                          // height: 150,
                          width: "100%",
                          padding: 15,
                          background: "#f5f7fc",
                          border: "1px solid #DDDDDD",
                        }}
                        vertical
                        gap={16}
                      >
                        <Form.Item
                          label="工厂"
                          name="工厂"
                          {...ComputeFormCol(6)}
                        >
                          <Select
                            options={selectList2Option(query_opt["工厂"])}
                          />
                        </Form.Item>
                        <Form.Item
                          label="车间"
                          name="车间"
                          {...ComputeFormCol(6)}
                        >
                          <Select
                            options={selectList2Option(query_opt["车间"])}
                            onChange={(val) => {
                              form.setFieldsValue({
                                工序: query_opt["工序"][val],
                              });
                              getDev();
                            }}
                          />
                        </Form.Item>
                        <Form.Item
                          label="工序"
                          name="工序"
                          {...ComputeFormCol(6)}
                        >
                          <Select options={selectList2Option([])} />
                        </Form.Item>
                      </Flex>
                      <Tree
                        multiple={true}
                        checkable
                        checkedKeys={checked_dev}
                        onCheck={(val) => {
                          // console.log(val);
                          setCheckedDev(val);
                          confirmParam(val);
                        }}
                        onSelect={(selectedKeys, e) => {
                          console.log(e);
                        }}
                        defaultExpandAll={true}
                        treeData={tree}
                        style={{marginTop: 20}}
                      />
                      {/* <Flex justify="end" style={{ padding: 10 }}>
                       <Button type="primary" onClick={confirmParam}>
                       确认
                       </Button>
                       </Flex> */}
                    </div>
                  </Spin>
                </GeneralCard>
              </div>
            </Panel>
            <PanelResizeHandle style={PanelResizeHandleStyle} />
            <Panel defaultSize={88} minSize={80}>
              <Flex vertical gap={16} style={{width: "100%", height: 710}}>
                <Spin spinning={chart_load}>
                  <GeneralCard name="实时曲线区域">
                    <div style={{width: "100%", height: 660}} className="of">
                      <Row gutter={[10, 10]}>
                        {chart_list.map((item, _) => (
                          <Col span={8} key={_}>
                            <LineChart chart_data={item} />
                          </Col>
                        ))}
                      </Row>
                    </div>
                  </GeneralCard>
                </Spin>
                {/* <GeneralCard name="异常列表">
                 <div
                 style={{ width: "100%", height: 290, position: "relative" }}
                 >
                 <Row
                 justify="end"
                 style={{
                 width: "100%",
                 position: "absolute",
                 right: 5,
                 top: -37,
                 }}
                 >
                 <Col span={3}>
                 <Form.Item
                 label="设备"
                 name="device_id"
                 {...ComputeFormCol(8)}
                 layout="inline"
                 >
                 <Select
                 options={dev_list}
                 onChange={(val) => {
                 let param = tree.find((e) => e.device_id === val);
                 let param_list = param.children.map((e) => ({
                 label: e.point_name,
                 value: e.point_id,
                 }));
                 setParamList(param_list);
                 form.setFieldsValue({ point_id: "" });
                 }}
                 />
                 </Form.Item>
                 </Col>
                 <Col span={3}>
                 <Form.Item
                 label="参数"
                 name="point_id"
                 {...ComputeFormCol(8)}
                 layout="inline"
                 >
                 <Select options={param_list} />
                 </Form.Item>
                 </Col>
                 <Col span={3}>
                 <Form.Item
                 label="紧急程度"
                 name="alarm_grade"
                 {...ComputeFormCol(8)}
                 layout="inline"
                 >
                 <Select
                 options={[
                 { label: "一般", value: 0 },
                 { label: "中等", value: 1 },
                 { label: "紧急", value: 2 },
                 ]}
                 />
                 </Form.Item>
                 </Col>
                 <Col span={3}>
                 <Form.Item
                 label="状态"
                 name="status"
                 {...ComputeFormCol(8)}
                 layout="inline"
                 >
                 <Select
                 options={[
                 { label: "待处理", value: 0 },
                 { label: "已处理", value: 1 },
                 { label: "已关闭", value: 2 },
                 ]}
                 />
                 </Form.Item>
                 </Col>
                 <Col span={2}>
                 <Button
                 type="primary"
                 style={{ marginLeft: 10 }}
                 onClick={() => requestData(cur, page_size)}
                 >
                 查询
                 </Button>
                 </Col>
                 </Row>
                 <Table
                 loading={tb_load}
                 size="small"
                 columns={generateColumns()}
                 dataSource={tb_data}
                 bordered
                 scroll={{
                 y: 200,
                 x: "max-content",
                 }}
                 pagination={pagination()}
                 style={{ padding: 10 }}
                 />
                 </div>
                 </GeneralCard> */}
              </Flex>
            </Panel>
          </PanelGroup>
        </Form>
      </div>
    </div>
  );
}

export default FdcAnalysis;

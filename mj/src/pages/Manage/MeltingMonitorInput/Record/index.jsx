import { Button, Col, Form, Row, Table } from "antd";
import { Flex } from "antd";
import React from "react";
import { Input } from "antd";
import { Space } from "antd";
import { ComputeFormCol } from "../../../../utils/obj";
import "./record.less";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { getSession } from "../../../../utils/storage";
import { useState } from "react";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import {
  addMeltMonitorRecord,
  deleteMeltMonitorRecord,
  getLatestMeltMonitorRecord,
  getMeltMonitorRecord,
  getMonitorOptions,
} from "../../../../apis/monitor_api";
import { message } from "antd";
import { Popconfirm } from "antd";
import {
  FeedRobotModal,
  MeltRecordModal,
  MyAutoComplete,
  chgObjVal2Upper,
} from "../Modal";
import { incrementStringAtPosition } from "../../../../utils/string";
import { OperationConfirmPassword } from "../../../../components/CommonModal";

const default_data2 = {
  监控id: "",
  坩埚lotNo: "",
  再生砂LotNo: "",
  再生砂重量: "",
  外层LotNo: "",
  外层重量: "",
  中外LotNo: "",
  中外重量: "",
  中内LotNo: "",
  中内重量: "",
  内层LotNo: "",
  内层重量: "",
  电极厂家: "",
  电极批次: "",
  电极结余: "",
  熔融时间分: "",
  熔融时间秒: "",
  真空极限压力: "",
  不良项目: "",
  改型: "",
  高度: "",
  重量: "",
  后道报废: "",
  后道报废原因: "",
  外观自检: "",
  外径D1: "",
  外径D2: "",
  外径D3: "",
  壁厚T1: "",
  壁厚T2: "",
  壁厚T3: "",
  TR: "",
  BR: "",
  TB: "",
  RG: "",
  BG: "",
  模具出水温度起弧前: "",
  模具出水温度断弧时: "",
  电极更换时结余: "",
  备注: "",
};

function MeltMonitorRecord() {
  const [form] = Form.useForm();
  const [searchParams, setSearchParams] = useSearchParams();
  const [tb_data1, setTbData1] = useState([]);
  const [tb_data2, setTbData2] = useState([]);
  const [melt_modal, setMeltModal] = useState(false);
  const [psw_modal, setPswModal] = useState(false);
  const [robot_modal, setRobotModal] = useState(false);
  const [cur_data, setCurData] = useState({});
  const [opt_obj, setOptObj] = useState({});
  const id = searchParams.get("id");
  const [cur_id, setCurId] = useState("");
  const generateColumns1 = () => {
    let columns = [];
    ["熔融机号", "作业日期", "班次", "确认人", "主操", "辅操"].forEach((e) => {
      columns.push({
        title: e,
        dataIndex: e,
        key: e,
        onCell: (record, index) => {
          return {
            style: { background: "#bae0ff" },
          };
        },
      });
    });
    ["作业时间1", "作业时间2", "生产数量"].forEach((e) => {
      columns.push({
        title: e,
        dataIndex: e,
        key: e,
        onCell: (record, index) => {
          return {
            style: { background: "#ffe7ba" },
          };
        },
      });
    });
    ["制造编号", "产品图号", "生产规格", "电极规格", "英寸"].forEach((e) => {
      columns.push({
        title: e,
        dataIndex: e,
        key: e,
        onCell: (record, index) => {
          return {
            style: { background: "#b5f5ec" },
          };
        },
      });
    });
    ["再生砂", "外层", "中外", "中内", "内层"].forEach((e) => {
      columns.push({
        title: e,
        dataIndex: e,
        key: e,
        onCell: (record, index) => {
          return {
            style: { background: "#fff1f0" },
          };
        },
      });
    });
    [
      "模具R角",
      "模具内径",
      "内成型棒",
      "外成型棒",
      "底座编号",
      "内胆编号",
      "抽真空时间",
      "边料高度",
      "上邦编号",
    ].forEach((e) => {
      columns.push({
        title: e,
        dataIndex: e,
        key: e,
        onCell: (record, index) => {
          return {
            style: { background: "#f4ffb8" },
          };
        },
      });
    });
    columns.push({
      title: "备注",
      dataIndex: "备注",
      key: "备注",
    });
    return columns;
  };
  const del = () => {
    deleteMeltMonitorRecord(
      { id: cur_id },
      (res) => {
        const { code, msg, data } = res.data;
        if (code === 0 && data) {
          message.success("删除成功");
          requestData();
        } else {
          message.error(msg);
        }
      },
      () => {
        message.error("网络异常");
      }
    );
  };
  const generateColumns2 = () => {
    let columns = [
      {
        title: "序号",
        dataIndex: "key",
        key: "key",
        width: 80,
      },
      {
        title: "监控id",
        dataIndex: "监控id",
        key: "监控id",
      },
    ];
    columns.push({
      title: "坩埚lotNo",
      dataIndex: "坩埚lotNo",
      key: "坩埚lotNo",
      onCell: (record, index) => {
        return {
          style: { background: "#bae0ff" },
        };
      },
      fixed: "left",
    });
    ["电极厂家", "电极批次"].forEach((e) => {
      columns.push({
        title: e,
        dataIndex: e,
        key: e,
        onCell: (record, index) => {
          return {
            style: { background: "#bae0ff" },
          };
        },
      });
    });
    columns.push({
      title: "电极使用次数",
      dataIndex: "电极结余",
      key: "电极结余",
      onCell: (record, index) => {
        return {
          style: { background: "#bae0ff" },
        };
      },
    });
    [
      "再生砂LotNo",
      "再生砂重量",
      "外层LotNo",
      "外层重量",
      "中外LotNo",
      "中外重量",
      "中内LotNo",
      "中内重量",
      "内层LotNo",
      "内层重量",
    ].forEach((e) => {
      columns.push({
        title: e,
        dataIndex: e,
        key: e,
        onCell: (record, index) => {
          return {
            style: { background: "#ffd8bf" },
          };
        },
      });
    });
    [
      "外径D1",
      "外径D2",
      "外径D3",
      "壁厚T1",
      "壁厚T2",
      "壁厚T3",
      "TR",
      "BR",
      "TB",
      "RG",
      "BG",
    ].forEach((e) => {
      columns.push({
        title: e,
        dataIndex: e,
        key: e,
        onCell: (record, index) => {
          return {
            style: { background: "#ffffb8" },
          };
        },
      });
    });
    [
      "熔融时间分",
      "熔融时间秒",
      "模具出水温度起弧前",
      "模具出水温度断弧时",
      "真空极限压力",
      "电极更换时结余",
      "备注",
    ].forEach((e) => {
      columns.push({
        title: e,
        dataIndex: e,
        key: e,
        onCell: (record, index) => {
          return {
            style: { background: "#fff0f6" },
          };
        },
      });
    });
    [
      "不良项目",
      "改型",
      "高度",
      "重量",
      "后道报废",
      "后道报废原因",
      "外观自检",
    ].forEach((e) => {
      columns.push({
        title: e,
        dataIndex: e,
        key: e,
        onCell: (record, index) => {
          return {
            style: { background: "#f0f0f0" },
          };
        },
      });
    });
    columns.push({
      title: "操作",
      key: "opt",
      fixed: "right",
      width: 100,
      render: (record) => (
        <Space>
          <Button
            style={{ padding: 0, fontSize: 14 }}
            type="link"
            icon={<EditOutlined />}
            onClick={() => {
              setMeltModal(true);
              setCurData(record);
            }}
          >
            修改
          </Button>
          <Popconfirm
            title="警告"
            description="确认删除该条数据?"
            onConfirm={() => {
              setCurId(record["id"]);
              setPswModal(true);
            }}
            okText="确认"
            cancelText="取消"
          >
            <Button
              icon={<DeleteOutlined />}
              style={{ padding: 0, fontSize: 14 }}
              type="link"
              danger
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    });
    return columns;
  };
  const pagination2 = () => {
    return {
      position: ["bottomCenter"],
      total: tb_data2.length,
      showTotal: (total) => `共 ${total} 条`,
      showQuickJumper: true,
      showSizeChanger: true,
      defaultPageSize: 10,
    };
  };
  const requestData = () => {
    getMeltMonitorRecord(
      { id },
      (res) => {
        const { code, msg, data } = res.data;
        if (code === 0 && data) {
          const { data_list } = data;
          setTbData2(data_list);
        } else {
          setTbData2([]);
        }
      },
      () => {
        setTbData2([]);
      }
    );
  };
  const initOpt = () => {
    getMonitorOptions(
      (res) => {
        const { code, msg, data } = res.data;
        if (code === 0 && data) {
          setOptObj(data);
        }
      },
      () => {}
    );
  };
  const submit = async () => {
    let val = await form.validateFields();
    const up_val = chgObjVal2Upper(val);
    addMeltMonitorRecord(
      up_val,
      (res) => {
        const { code, msg, data } = res.data;
        if (code === 0 && data) {
          form.resetFields();
          form.setFieldValue("监控id", id);
          message.success("添加成功");
          requestData();
        } else {
          message.error(msg);
        }
      },
      () => {
        message.error("网络异常");
      }
    );
  };
  const syncLast = () => {
    getLatestMeltMonitorRecord(
      { 监控id: id },
      (res) => {
        const { code, msg, data } = res.data;
        if (code === 0 && data) {
          const {
            坩埚lotNo,
            再生砂LotNo,
            再生砂重量,
            外层LotNo,
            外层重量,
            中外LotNo,
            中外重量,
            中内LotNo,
            中内重量,
            内层LotNo,
            内层重量,
            电极厂家,
            电极批次,
          } = data;
          // let ln = "";
          // if (坩埚lotNo.length > 6) {
          //   // id自增1
          //   ln = incrementStringAtPosition(坩埚lotNo, 5, 7);
          // } else {
          //   ln = 坩埚lotNo;
          // }
          form.setFieldsValue({
            坩埚lotNo,
            再生砂LotNo,
            再生砂重量,
            外层LotNo,
            外层重量,
            中外LotNo,
            中外重量,
            中内LotNo,
            中内重量,
            内层LotNo,
            内层重量,
            电极厂家,
            电极批次,
          });
        } else {
          message.warning(msg);
        }
      },
      () => {
        message.error("网络异常");
      }
    );
  };
  useEffect(() => {
    let record = getSession("record");
    if (record) {
      let tb_data = [JSON.parse(record)];
      setTbData1(tb_data);
    }
    form.setFieldValue("监控id", id);
    requestData();
  }, [id]);
  useEffect(() => {
    initOpt();
  }, []);
  return (
    <Flex vertical gap={20} className="record_form_body">
      <Flex justify="center">
        <div style={{ fontSize: 20 }}>熔融监控记录录入</div>
      </Flex>
      <Table
        size="small"
        columns={generateColumns1()}
        dataSource={tb_data1}
        bordered
        scroll={{
          x: "max-content",
        }}
        pagination={false}
      />
      <Table
        size="small"
        columns={generateColumns2()}
        dataSource={tb_data2}
        bordered
        scroll={{
          x: "max-content",
        }}
        pagination={pagination2()}
      />
      <Form form={form} {...ComputeFormCol(12)} initialValues={default_data2}>
        <Row gutter={[10, 10]}>
          <Col span={12}>
            <Form.Item name="监控id" label="监控id">
              <Input disabled />
            </Form.Item>
          </Col>
          {[
            "坩埚lotNo",
            "再生砂LotNo",
            "再生砂重量",
            "外层LotNo",
            "外层重量",
            "中外LotNo",
            "中外重量",
            "中内LotNo",
            "中内重量",
            "内层LotNo",
            "内层重量",
          ].map((e) => (
            <Col span={12} key={e}>
              <Form.Item label={e} name={e}>
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
          ))}
          <Col span={12}>
            <MyAutoComplete opt={opt_obj["电极厂家"]} label={"电极厂家"} />
          </Col>
          <Col span={12}>
            <Form.Item label="电极使用次数" name="电极结余">
              <Input placeholder="请输入" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="电极批次" name="电极批次">
              <Input placeholder="请输入" />
            </Form.Item>
          </Col>
          {[
            "熔融时间分",
            "熔融时间秒",
            "真空极限压力",
            "不良项目",
            "改型",
            "高度",
            "重量",
            "后道报废",
            "后道报废原因",
            "外观自检",
            "外径D1",
            "外径D2",
            "外径D3",
            "壁厚T1",
            "壁厚T2",
            "壁厚T3",
            "TR",
            "BR",
            "TB",
            "RG",
            "BG",
            "模具出水温度起弧前",
            "模具出水温度断弧时",
            "电极更换时结余",
            "备注",
          ].map((e) => (
            <Col span={12} key={e}>
              <Form.Item label={e} name={e}>
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
          ))}
        </Row>
      </Form>
      <Space size={50}>
        <Button
          onClick={() => {
            form.resetFields();
            form.setFieldValue("监控id", id);
          }}
        >
          重置
        </Button>
        <Button type="primary" onClick={syncLast}>
          同步最近记录
        </Button>
        <Button type="primary" onClick={() => setRobotModal(true)}>
          投料机器人
        </Button>
        <Button type="primary" onClick={submit}>
          提交
        </Button>
      </Space>
      <MeltRecordModal
        open={melt_modal}
        onCancel={() => setMeltModal(false)}
        requestData={() => requestData()}
        data={cur_data}
        opt_obj={opt_obj}
      />
      <OperationConfirmPassword
        open={psw_modal}
        onCancel={() => setPswModal(false)}
        onOk={del}
      />
      <FeedRobotModal
        open={robot_modal}
        onCancel={() => setRobotModal(false)}
        f_form={form}
      />
    </Flex>
  );
}

export default MeltMonitorRecord;

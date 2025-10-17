import React, { useState } from "react";
import {
  Button,
  Col,
  DatePicker,
  Flex,
  Form,
  Input,
  Modal,
  Popconfirm,
  Row,
  Space,
  Table,
  Tabs,
} from "antd";
import "./mmi.less";
import {
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { ComputeFormCol, downloadFile } from "../../../utils/obj";
import { InputNumber } from "antd";
import { Select } from "antd";
import { selectList2Option } from "../../../utils/string";
import dayjs from "dayjs";
import {
  addMeltMonitor,
  deleteMeltMonitor,
  getDataReport,
  getLatestMeltMonitor,
  getMeltMonitor,
  getMeltMonitorRecord,
  getMonitorOptions,
} from "../../../apis/monitor_api";
import { message } from "antd";
import { useEffect } from "react";
import { MeltModal, MyAutoComplete, chgObjVal2Upper } from "./Modal";
import { setSessionObj } from "../../../utils/storage";
import { OperationConfirmPassword } from "../../../components/CommonModal";
import { getSearchList } from "../../../apis/anls_api";
import { use } from "react";
import { AutoComplete } from "antd";
const { RangePicker } = DatePicker;

const default_data1 = {
  作业日期: dayjs().format("YYYY-MM-DD"),
  班次: "白班",
  熔融机号: "",
  确认人: "",
  主操: "",
  辅操: "",
  制造编号: "",
  产品图号: "",
  英寸: "",
  生产规格: "",
  底座编号: "",
  上邦编号: "",
  内胆编号: "",
  外成型棒: "",
  内成型棒: "",
  再生砂: "",
  外层: "",
  中外: "",
  中内: "",
  内层: "",
  电极规格: "",
  生产数量: 0,
  模具内径: "",
  模具R角: "",
  抽真空时间: "",
  边料高度: "",
  作业时间1: "",
  作业时间2: "",
  备注: "",
};
function MeltingMonitorInput() {
  const [query_form] = Form.useForm();
  const [data_form1] = Form.useForm();
  const [melt_modal, setMeltModal] = useState(false);
  const [psw_modal, setPswModal] = useState(false);
  const [tb_data, setTbData] = useState([]);
  const [tb_data2, setTbData2] = useState([]);
  const [tb_load, setTbLoad] = useState(false);
  const [cur, setCur] = useState(1);
  const [page_size, setPageSize] = useState(20);
  const [tb_total, setTbTotal] = useState(0);
  const [cur_data, setCurData] = useState({});
  const [opt_obj, setOptObj] = useState({});
  const [cur_id, setCurId] = useState("");
  const [search_obj, setSearchObj] = useState({});
  const del = () => {
    deleteMeltMonitor(
      { id: cur_id },
      (res) => {
        const { code, msg, data } = res.data;
        if (code === 0 && data) {
          message.success("删除成功");
          requestData(cur, page_size);
        } else {
          message.error(msg);
        }
      },
      () => {
        message.error("网络异常");
      }
    );
  };
  const downExcel = (id) => {
    getDataReport(
      { id },
      (res) => {
        const { code, msg, data } = res.data;
        if (code === 0 && data) {
          const { url } = data;
          downloadFile(url);
        } else {
          message.error(msg);
        }
      },
      () => {
        message.error("网络异常");
      }
    );
  };
  const generateColumns = () => {
    let columns = [
      {
        title: "序号",
        dataIndex: "key",
        key: "key",
        width: 80,
        onCell: (record, index) => {
          return {
            onClick: (e) => {
              requestRecord(String(record["id"]));
            },
          };
        },
      },
    ];
    ["熔融机号", "作业日期", "班次", "确认人", "主操", "辅操"].forEach((e) => {
      columns.push({
        title: e,
        dataIndex: e,
        key: e,
        onCell: (record, index) => {
          return {
            onClick: (e) => {
              requestRecord(String(record["id"]));
            },
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
            onClick: (e) => {
              requestRecord(String(record["id"]));
            },
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
            onClick: (e) => {
              requestRecord(String(record["id"]));
            },
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
            onClick: (e) => {
              requestRecord(String(record["id"]));
            },
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
            onClick: (e) => {
              requestRecord(String(record["id"]));
            },
            style: { background: "#f4ffb8" },
          };
        },
      });
    });
    columns.push({
      title: "备注",
      dataIndex: "备注",
      key: "备注",
      onCell: (record, index) => {
        return {
          onClick: (e) => {
            requestRecord(String(record["id"]));
          },
        };
      },
    });
    columns.push({
      title: "操作",
      key: "opt",
      fixed: "right",
      width: 100,
      render: (record) => (
        <Space>
          <Button
            type="link"
            style={{ padding: 0, fontSize: 14 }}
            onClick={() => {
              setSessionObj("record", record);
              window.open(
                `/melting_monitor_record?id=${record["id"]}`,
                "_blank"
              );
              setTbData2;
            }}
          >
            熔融监控记录
          </Button>

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
          <Button
            style={{ padding: 0, fontSize: 14 }}
            type="link"
            icon={<DownloadOutlined />}
            onClick={() => downExcel(record["id"])}
          >
            下载
          </Button>
          <Popconfirm
            title="警告"
            description="确认删除该条数据?"
            onConfirm={() => {
              setPswModal(true);
              setCurId(record["id"]);
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
      "模具出水温度差",
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
  const initSearchOpt = () => {
    getSearchList(
      (res) => {
        const { data, code, msg } = res.data;
        if (code === 0 && data) {
          // let val = {
          //   图号: 图号[0] ? 图号[0] : "",
          // };
          // query_form.setFieldsValue(val);
          setSearchObj(data);
        } else {
          setSearchObj({});
        }
      },
      () => {
        setSearchObj({});
      }
    );
  };
  const requestData = (page, size) => {
    let val = query_form.getFieldsValue();
    val["skip"] = page - 1;
    val["limit"] = size;
    setTbLoad(true);
    setTbData2([]);
    getMeltMonitor(
      val,
      (res) => {
        setTbLoad(false);
        const { code, msg, data } = res.data;
        if (code === 0 && data) {
          const { data_list, total } = data;
          setTbData(data_list);
          setTbTotal(total);
        } else {
          setTbData([]);
          setTbTotal(0);
        }
      },
      () => {
        setTbLoad(false);
        setTbData([]);
        setTbTotal(0);
      }
    );
  };
  const requestRecord = (id) => {
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
  const submit1 = async () => {
    let val = await data_form1.validateFields();
    // 把对象里面的值都转化成大写
    const up_val = chgObjVal2Upper(val);
    addMeltMonitor(
      up_val,
      (res) => {
        const { code, msg, data } = res.data;
        if (code === 0 && data) {
          data_form1.resetFields();
          message.success("添加成功");
          requestData(cur, page_size);
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
    const { 熔融机号, 产品图号 } = data_form1.getFieldsValue();

    getLatestMeltMonitor(
      { 熔融机号, 产品图号 },
      (res) => {
        const { code, msg, data } = res.data;
        if (code === 0 && data) {
          data_form1.setFieldsValue(data);
        } else {
          message.error(msg);
        }
      },
      () => {}
    );
  };
  const batchDownload = () => {
    const { 时间 } = query_form.getFieldsValue();
    let val = {
      start_time: 时间[0],
      end_time: 时间[1],
    };
    // 批量下载接口
    getDataReport(
      val,
      (res) => {
        const { code, msg, data } = res.data;
        if (code === 0 && data) {
          const { url } = data;
          downloadFile(url);
        } else {
          message.error(msg);
        }
      },
      () => {
        message.error("网络异常");
      }
    );
  };
  const tab_items = [
    {
      key: "1",
      label: <div style={{ fontSize: 18 }}>熔融监控查看</div>,
      children: (
        <Flex vertical gap={20}>
          <Form
            form={query_form}
            layout="inline"
            initialValues={{
              时间: [
                dayjs().format("YYYY-MM-DD"),
                dayjs().format("YYYY-MM-DD"),
              ],
              熔融机号: "",
              班次: "全部",
              图号: "",
            }}
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
                value && value.map((e) => dayjs(e).format("YYYY-MM-DD"))
              }
            >
              <RangePicker allowClear={false} style={{ width: 220 }} />
            </Form.Item>
            <Form.Item name="熔融机号" label="熔融机号">
              <Input placeholder="请输入关键词" style={{ width: 120 }} />
            </Form.Item>
            <Form.Item name="班次" label="班次">
              <Select
                options={selectList2Option(["全部", "白班", "中班", "夜班"])}
                style={{ width: 100 }}
              />
            </Form.Item>
            <Form.Item name="图号" label="图号">
              <AutoComplete
                options={selectList2Option(search_obj["图号"])}
                allowClear
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                style={{ width: 160 }}
              />
            </Form.Item>
            <Button
              type="primary"
              style={{ marginRight: 20 }}
              onClick={() => requestData(cur, page_size)}
            >
              查询
            </Button>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={batchDownload}
            >
              批量下载
            </Button>
          </Form>
          <Table
            size="small"
            loading={tb_load}
            columns={generateColumns()}
            dataSource={tb_data}
            bordered
            scroll={{
              x: "max-content",
            }}
            pagination={pagination()}
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
        </Flex>
      ),
    },
    {
      key: "2",
      label: <div style={{ fontSize: 18 }}>熔融监控录入</div>,
      children: (
        <Flex vertical gap={30} className="form_body">
          <Form
            form={data_form1}
            {...ComputeFormCol(12)}
            initialValues={default_data1}
          >
            <Row gutter={[10, 10]}>
              <Col span={12}>
                <Form.Item
                  label="作业日期"
                  name="作业日期"
                  getValueProps={(value) => {
                    return {
                      value: value && dayjs(value),
                    };
                  }}
                  normalize={(value) =>
                    value && dayjs(value).format("YYYY-MM-DD")
                  }
                >
                  <DatePicker style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="班次" name="班次">
                  <Select
                    options={selectList2Option(["白班", "中班", "夜班"])}
                  />
                </Form.Item>
              </Col>
              {[
                "熔融机号",
                "确认人",
                "主操",
                "辅操",
                "制造编号",
                "产品图号",
                "英寸",
                "生产规格",
                "底座编号",
                "上邦编号",
                "内胆编号",
                "外成型棒",
                "内成型棒",
                "再生砂",
                "外层",
                "中外",
                "中内",
                "内层",
                "电极规格",
              ].map((e) => (
                <Col span={12} key={e}>
                  <MyAutoComplete opt={opt_obj[e]} label={e} />
                </Col>
              ))}
              <Col span={12}>
                <Form.Item label="生产数量" name="生产数量">
                  <InputNumber style={{ width: "100%" }} precision={0} />
                </Form.Item>
              </Col>
              {[
                "模具内径",
                "模具R角",
                "抽真空时间",
                "边料高度",
                "作业时间1",
                "作业时间2",
                "备注",
              ].map((e) => (
                <Col span={12} key={e}>
                  <MyAutoComplete opt={opt_obj[e]} label={e} />
                </Col>
              ))}
            </Row>
          </Form>
          <Space size={50}>
            <Button onClick={() => data_form1.resetFields()}>重置</Button>
            <Button type="primary" onClick={syncLast}>
              同步最近记录
            </Button>
            <Button type="primary" onClick={submit1}>
              提交
            </Button>
          </Space>
        </Flex>
      ),
    },
  ];
  useEffect(() => {
    initSearchOpt();
    initOpt();
    requestData(cur, page_size);
  }, []);
  return (
    <div className="melting_monitor_input">
      <Tabs defaultActiveKey="1" items={tab_items} tabBarGutter={50} />
      <MeltModal
        open={melt_modal}
        opt_obj={opt_obj}
        onCancel={() => setMeltModal(false)}
        requestData={() => requestData(cur, page_size)}
        data={cur_data}
      />
      <OperationConfirmPassword
        open={psw_modal}
        onCancel={() => setPswModal(false)}
        onOk={del}
      />
    </div>
  );
}

export default MeltingMonitorInput;

import React, { useEffect, useState } from "react";
import { GeneralCard, MyBreadcrumb } from "../../../components/CommonCard";
import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Flex,
  Form,
  Image,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Table,
  message,
} from "antd";
import { ComputeFormCol } from "../../../utils/obj";
import { selectList2Option, timeFormat } from "../../../utils/string";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import ImgDev1 from "../../../assets/mng/work1.png";
import ImgDev2 from "../../../assets/mng/work2.png";
import ImgDev3 from "../../../assets/mng/work3.png";
import ImgDev4 from "../../../assets/mng/work4.png";
import "./dw.less";
import dayjs from "dayjs";
import {
  appointOneTask,
  closeOneTask,
  getOrderStatus,
  getTaskList,
} from "../../../apis/dispatch_api";
// import { WorkDescModal } from "./Modal";

const { TextArea } = Input;
const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};
const formItemLayoutWithOutLabel = {
  labelCol: {
    span: 0,
  },
  wrapperCol: {
    span: 19,
    offset: 5,
  },
};
const default_form_data = {
  编号: "",
  创建人: "熔融室-01",
  标题: "",
  指定责任人: "杨工",
  不指定: false,
  类型: "设备维保",
  优先级: "紧急",
  所属部门: "制造部",
  创建时间: "",
  指定时间: "",
  设备: "",
  工序: "熔融",
  说明: "",
  操作事项: [""],
};

function DispatchWork() {
  const [modal, contextHolder] = Modal.useModal();
  const [form] = Form.useForm();
  const [opt, setOpt] = useState({
    指定责任人: ["杨工", "李工", "王工"],
    优先级: ["紧急", "正常", "一般"],
    所属部门: ["制造部"],
    类型: ["设备维保", "环境打扫"],
    设备: ["11#", "12#", "13#", "14#"],
    工序: ["熔融", "酸洗", "喷钡", "打磨"],
  });
  const [work, setWork] = useState({});
  const [cur_code, setCurCode] = useState("");
  const [modal_desc, setModalDesc] = useState(false);
  const getDevStatClass = (stat) => {
    let cls = "bg_green";
    switch (stat) {
      case "待接收":
        cls = "bg_purple";
        break;
      case "处理中":
        cls = "bg_blue";
        break;
      case "已拒绝":
        cls = "bg_orange";
        break;
      case "已完成":
        cls = "bg_green";
        break;
      default:
        break;
    }

    return cls;
  };
  const getImgae = (stat) => {
    let img = "";
    switch (stat) {
      case "待接收":
        img = ImgDev1;
        break;
      case "处理中":
        img = ImgDev2;
        break;
      case "已拒绝":
        img = ImgDev3;
        break;
      case "已完成":
        img = ImgDev4;
        break;
      default:
        break;
    }
    return img;
  };
  const [tb_load, setTbLoad] = useState(false);
  const [tb_data, setTbData] = useState([]);
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

  const close = async (编号) => {
    const confirmed = await modal.confirm({
      title: `编号:${编号}`,
      content: <div>是否关闭工单?</div>,
      okText: "是",
      cancelText: "否",
    });
    if (confirmed) {
      closeOneTask(
        { 编号 },
        (res) => {
          const { code, data, msg } = res.data;
          if (code === 0 && data) {
            message.success("关闭成功");
            requestData();
          } else {
            message.error(msg);
          }
        },
        () => {
          message.error("网络异常");
        }
      );
    }
  };
  const handleCode = (code) => {
    setCurCode(code);
    setModalDesc(true);
  };
  const generateColumns = () => {
    let columns = [
      "编号",
      "标题",
      "状态",
      "责任人",
      "类型",
      "优先级",
      "设备",
      "操作事项",
      "指定时间",
      "更新时间",
    ].map((e, _) => {
      let col = {
        title: e,
        dataIndex: e,
        key: e,
      };
      if (e === "编号") {
        col.render = (x) => (
          <Button
            type="link"
            style={{ padding: 0 }}
            onClick={() => handleCode(x)}
          >
            {x}
          </Button>
        );
      }
      return col;
    });
    columns.unshift({
      title: "序号",
      dataIndex: "key",
      key: "key",
      render: (x) => x + 1,
    });
    columns.push({
      title: "操作",
      key: "opt",
      render: (record) => (
        <Space>
          <Button
            type="link"
            style={{ padding: 0 }}
            onClick={() => close(record.编号)}
          >
            关闭
          </Button>
        </Space>
      ),
    });
    return columns;
  };
  const checkZd = (e) => {
    if (e.target.checked) {
      form.setFieldsValue({ 指定责任人: "" });
    }
  };
  const apply = () => {
    let dev = form.getFieldValue("设备");
    if (dev === "") {
      message.warning("请选择设备");
      return;
    }
    let now = dayjs();
    let time_str = now.format("MMDDHHmm");
    let time = now.format(timeFormat);
    form.setFieldsValue({
      编号: `${dev}-GD-${time_str}`,
      创建时间: time,
    });
  };

  const submit = async () => {
    let val = await form.validateFields();
    appointOneTask(
      val,
      (res) => {
        const { code, data, msg } = res.data;
        if (code === 0 && data) {
          message.success("提交成功");
          form.resetFields();
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
  const requestData = () => {
    setTbLoad(true);
    getTaskList(
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
    getOrderStatus(
      (res) => {
        const { code, data, msg } = res.data;
        if (code === 0 && data) {
          setWork(data);
        } else {
          setWork({});
        }
      },
      () => {
        setWork({});
      }
    );
  };
  useEffect(() => {
    requestData();
  }, []);

  return (
    <div>
      {contextHolder}
      {/* 这个组件在git管理的时候意外删除了，后续需要重新开发 */}
      {/* <WorkDescModal
        open={modal_desc}
        onCancel={() => setModalDesc(false)}
        code={cur_code}
      /> */}
      <MyBreadcrumb items={[window.sys_name, "派工"]} />
      <div className="content_root">
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <GeneralCard name="工单派发">
              <div style={{ padding: 10 }}>
                <div className="of" style={{ width: "100%", height: 760 }}>
                  <Form
                    {...ComputeFormCol(5)}
                    initialValues={default_form_data}
                    form={form}
                  >
                    <Flex gap={10} vertical>
                      <Form.Item
                        label="设备"
                        name="设备"
                        rules={[{ required: true }]}
                      >
                        <Select options={selectList2Option(opt["设备"])} />
                      </Form.Item>
                      <Form.Item label="编号">
                        <Flex gap={10}>
                          <Form.Item
                            name="编号"
                            {...ComputeFormCol(0)}
                            noStyle
                            rules={[{ required: true }]}
                          >
                            <Input disabled />
                          </Form.Item>
                          <Button type="primary" onClick={apply}>
                            生成
                          </Button>
                        </Flex>
                      </Form.Item>
                      <Form.Item label="创建人" name="创建人">
                        <Input disabled />
                      </Form.Item>
                      <Form.Item label="标题" name="标题">
                        <Input />
                      </Form.Item>
                      <Form.Item label="指定责任人">
                        <Flex justify="space-between">
                          <Form.Item name="指定责任人" {...ComputeFormCol(0)}>
                            <Select
                              options={selectList2Option(opt["指定责任人"])}
                              style={{ width: 240 }}
                            />
                          </Form.Item>
                          <Form.Item
                            name="不指定"
                            {...ComputeFormCol(0)}
                            valuePropName="checked"
                          >
                            <Checkbox onChange={checkZd}>不指定</Checkbox>
                          </Form.Item>
                        </Flex>
                      </Form.Item>
                      <Form.Item label="类型" name="类型">
                        <Select options={selectList2Option(opt["类型"])} />
                      </Form.Item>
                      <Form.Item label="优先级" name="优先级">
                        <Select options={selectList2Option(opt["优先级"])} />
                      </Form.Item>
                      <Form.Item label="所属部门" name="所属部门">
                        <Select options={selectList2Option(opt["所属部门"])} />
                      </Form.Item>
                      <Form.Item
                        label="创建时间"
                        name="创建时间"
                        getValueProps={(value) => {
                          return {
                            value: value && dayjs(value),
                          };
                        }}
                        normalize={(value) =>
                          value && dayjs(value).format(timeFormat)
                        }
                      >
                        <DatePicker disabled style={{ width: "100%" }} />
                      </Form.Item>
                      <Form.Item
                        label="指定时间"
                        name="指定时间"
                        rules={[{ required: true }]}
                        getValueProps={(value) => {
                          return {
                            value: value && dayjs(value),
                          };
                        }}
                        normalize={(value) =>
                          value && dayjs(value).format(timeFormat)
                        }
                      >
                        <DatePicker showTime style={{ width: "100%" }} />
                      </Form.Item>

                      <Form.Item label="工序" name="工序">
                        <Select options={selectList2Option(opt["工序"])} />
                      </Form.Item>
                      <Form.Item label="说明" name="说明">
                        <TextArea />
                      </Form.Item>
                      <Form.List name="操作事项">
                        {(fields, { add, remove }, { errors }) => (
                          <>
                            {fields.map((field, index) => (
                              <Form.Item
                                key={field.key}
                                {...(index === 0
                                  ? formItemLayout
                                  : formItemLayoutWithOutLabel)}
                                label={index === 0 ? "操作事项" : ""}
                                required={false}
                              >
                                <Form.Item
                                  name={field.name}
                                  validateTrigger={["onChange", "onBlur"]}
                                  noStyle
                                >
                                  <TextArea
                                    placeholder="请输入"
                                    style={{
                                      width: "90%",
                                    }}
                                    autoSize
                                  />
                                </Form.Item>
                                {fields.length > 1 ? (
                                  <MinusCircleOutlined
                                    style={{
                                      marginLeft: 5,
                                      fontSize: 20,
                                      color: "#777777",
                                    }}
                                    onClick={() => remove(field.name)}
                                  />
                                ) : null}
                              </Form.Item>
                            ))}
                            <Form.Item {...formItemLayoutWithOutLabel}>
                              <Button
                                type="dashed"
                                onClick={() => add("")}
                                style={{
                                  width: "90%",
                                }}
                                icon={<PlusOutlined />}
                              >
                                新增事项
                              </Button>
                            </Form.Item>
                          </>
                        )}
                      </Form.List>
                    </Flex>
                  </Form>
                </div>
                <Flex justify="end" style={{ marginTop: 10 }}>
                  <Space size={20}>
                    <Button type="primary" onClick={() => form.resetFields()}>
                      重置
                    </Button>
                    <Button type="primary" onClick={submit}>
                      派工
                    </Button>
                  </Space>
                </Flex>
              </div>
            </GeneralCard>
          </Col>
          <Col span={18}>
            <Flex vertical gap={16}>
              <Flex justify="space-around" className="home_work">
                {["待接收", "处理中", "已拒绝", "已完成"].map((item, _) => (
                  <div
                    className={`work_total_item ${getDevStatClass(item)}`}
                    key={_}
                  >
                    <Image src={getImgae(item)} width={40} preview={false} />
                    <div className="label">{item}工单:</div>
                    <div className="num">{work[`${item}工单`]}</div>
                  </div>
                ))}
              </Flex>
              <div style={{ position: "relative" }}>
                <Space style={{ position: "absolute", right: 5, top: 5 }}>
                  <Button onClick={() => window.open(`/workshop`, "_blank")}>
                    熔融车间工单
                  </Button>
                  <Button type="primary" onClick={requestData}>
                    刷新
                  </Button>
                </Space>
                <GeneralCard name="工单列表">
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
                    style={{ padding: 10 }}
                  />
                </GeneralCard>
              </div>
            </Flex>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default DispatchWork;

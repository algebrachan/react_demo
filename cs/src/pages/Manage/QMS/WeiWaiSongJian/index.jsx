import React, { useEffect, useState } from "react";
import { MyBreadcrumb } from "../../../../components/CommonCard";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Select,
  Space,
  Table,
  Collapse,
  Row,
  Col,
  message,
  Modal,
  Upload,
} from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { selectList2Option, dateFormat } from "../../../../utils/string";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import {
  read_outsourced_inspection,
  create_outsourced_inspection,
  update_outsourced_inspection,
  outsourced_inspection_option,
} from "../../../../apis/qms_router";
const { RangePicker } = DatePicker;
const { Panel } = Collapse;
let id = "";
function LOP() {
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [addForm] = Form.useForm();
  const [cur, setCur] = useState(1);
  const [page_size, setPageSize] = useState(20);
  const [tb_total, setTbTotal] = useState(0);
  const [tb_data, setTbData] = useState([]);
  const [tb_load, setTbLoad] = useState(false);
  const [opData, setOpData] = useState({});
  const [optionData, setOptionData] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("add"); // 'add' 或 'edit'
  const [modalForm] = Form.useForm();
  const [fileList, setFileList] = useState([]);

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

  const columns = [
    {
      title: "送检日期",
      dataIndex: "inspection_time",
      key: "inspection_time",
      width: 120,
      render: (text) => (text ? dayjs(text).format("YYYY-MM-DD") : "-"),
    },
    {
      title: "物料",
      dataIndex: "material",
      key: "material",
      width: 120,
    },
    {
      title: "样品编号",
      dataIndex: "sample_number",
      key: "sample_number",
      width: 140,
    },
    {
      title: "检测项目",
      dataIndex: "inspection_item",
      key: "inspection_item",
      width: 120,
    },
    {
      title: "样品来源",
      dataIndex: "sample_source",
      key: "sample_source",
      width: 100,
    },
    {
      title: "检测目的",
      dataIndex: "inspection_purpose",
      key: "inspection_purpose",
      width: 100,
    },
    {
      title: "费用",
      dataIndex: "cost",
      key: "cost",
      width: 100,
    },
    {
      title: "备注",
      dataIndex: "remark",
      key: "remark",
      width: 150,
      render: (text) => text || "-",
    },
    {
      title: "送检人",
      dataIndex: "submitter",
      key: "submitter",
      width: 100,
    },
    {
      title: "申请部门",
      dataIndex: "department",
      key: "department",
      width: 120,
    },
    {
      title: "负责人",
      dataIndex: "responsible_person",
      key: "responsible_person",
      width: 100,
    },
    {
      title: "供应商",
      dataIndex: "supplier",
      key: "supplier",
      width: 150,
    },
    {
      title: "送检结果",
      dataIndex: "result",
      key: "result",
      width: 100,
      render: (text) => {
        const colorMap = {
          合格: "green",
          不合格: "red",
          待检: "orange",
        };
        return (
          <span style={{ color: colorMap[text] || "black" }}>
            {text || "-"}
          </span>
        );
      },
    },
    {
      title: "付款",
      dataIndex: "payment",
      key: "payment",
      width: 100,
      render: (text) => {
        const colorMap = {
          已付款: "green",
          未付款: "red",
          部分付款: "orange",
        };
        return (
          <span style={{ color: colorMap[text] || "black" }}>
            {text || "-"}
          </span>
        );
      },
    },
    {
      title: "上传报告",
      dataIndex: "upload_report",
      key: "upload_report",
      width: 100,
      render: (text, record) => {
        if (text && text !== "-") {
          return (
            <Button type="link" size="small" onClick={() => {}}>
              {text}
            </Button>
          );
        }
        return "-";
      },
    },
    {
      title: "操作",
      key: "opt",
      fixed: "right",
      width: 120,
      render: (record) => (
        <Space>
          <Button
            type="link"
            size="small"
            onClick={() => {
              setModalType("edit");
              setOpData(record);
              modalForm.setFieldsValue({
                ...record,
                inspection_time: record.inspection_time
                  ? dayjs(record.inspection_time)
                  : null,
                upload_report: record.upload_report ? [] : [],
              });
              setFileList(record.upload_report ? [] : []);
              setModalVisible(true);
            }}
          >
            编辑
          </Button>
          {/* <Button
                        type="link"
                        size="small"
                        danger
                        onClick={() => {
                            console.log('删除', record);
                        }}
                    >
                        删除
                    </Button> */}
        </Space>
      ),
    },
  ];
  const requestData = (page, pageSize) => {
    let val = form.getFieldsValue();
    setTbLoad(true);
    read_outsourced_inspection(
      val,
      (res) => {
        setTbLoad(false);
        if (res.data.code === 0 && res.data.data) {
          setTbData(res.data.data);
          setTbTotal(res.data.length);
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
  const intOption = () => {
    outsourced_inspection_option({}, (res) => {
      setOptionData(res.data.data);
      requestData();
    });
  };
  useEffect(() => {
    intOption();
  }, []);

  const add = () => {
    setModalType("add");
    setOpData({});
    modalForm.resetFields();
    setFileList([]);
    setModalVisible(true);
  };

  // 处理文件上传
  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  // 处理表单提交
  const handleModalSubmit = () => {
    modalForm
      .validateFields()
      .then((values) => {
        const formData = {
          ...values,
          inspection_time: values.inspection_time
            ? values.inspection_time.format("YYYY-MM-DD HH:mm:ss")
            : "",
          upload_report:
            fileList.length > 0
              ? fileList[0].url || fileList[0].response?.url || ""
              : "",
        };
        if (modalType === "add") {
          create_outsourced_inspection(formData, (res) => {
            if (res.data.code === 0) {
              message.success(res.data.msg);
              requestData();
            }
          });
        } else {
          update_outsourced_inspection(
            { ...formData, id: opData.id },
            (res) => {
              if (res.data.code === 0) {
                message.success(res.data.msg);
                requestData();
              }
            }
          );
        }

        setModalVisible(false);
        modalForm.resetFields();
        setFileList([]);
      })
      .catch((errorInfo) => {
        console.log("表单验证失败:", errorInfo);
      });
  };

  // 取消弹框
  const handleModalCancel = () => {
    setModalVisible(false);
    modalForm.resetFields();
    setFileList([]);
  };
  return (
    <div>
      <MyBreadcrumb items={[window.sys_name, "委外送检"]} />
      <div
        className="content_root"
        style={{
          display: "flex",
          rowGap: 20,
          flexDirection: "column",
        }}
      >
        <Form
          layout="inline"
          form={form}
          initialValues={{
            快捷检索: 1,
            inspection_time: [
              dayjs().subtract(1, "month").format(dateFormat),
              dayjs().format(dateFormat),
            ],
          }}
        >
          <Form.Item label="快捷检索" name="快捷检索">
            <Select
              style={{ width: 100 }}
              options={[
                { label: "一月", value: 1 },
                { label: "三月", value: 3 },
                { label: "半年", value: 6 },
                { label: "一年", value: 12 },
              ]}
              onChange={(val) => {
                form.setFieldsValue({
                  inspection_time: [
                    dayjs().subtract(val, "month").format(dateFormat),
                    dayjs().format(dateFormat),
                  ],
                });
              }}
            />
          </Form.Item>
          <Form.Item
            label="时间"
            name="inspection_time"
            getValueProps={(value) => {
              return {
                value: value && value.map((e) => dayjs(e)),
              };
            }}
            normalize={(value) =>
              value && value.map((e) => dayjs(e).format(dateFormat))
            }
          >
            <RangePicker style={{ width: 240 }} allowClear={false} />
          </Form.Item>
          <Form.Item label="物料" name="material">
            <Input style={{ width: 160 }} />
          </Form.Item>
          <Form.Item label="送检人" name="submitter">
            <Input style={{ width: 160 }} />
          </Form.Item>
          <Form.Item label="负责人" name="responsible_person">
            <Input style={{ width: 160 }} />
          </Form.Item>
          <Form.Item label="供应商" name="supplier">
            <Input style={{ width: 160 }} />
          </Form.Item>
          <Space>
            <Button type="primary" onClick={() => requestData(cur, page_size)}>
              查询
            </Button>
          </Space>
          <Space>
            <Button
              type="primary"
              onClick={() => add()}
              style={{ marginLeft: 10 }}
            >
              新增
            </Button>
          </Space>
        </Form>

        <Table
          rowKey="id"
          bordered
          loading={tb_load}
          size="small"
          columns={columns}
          dataSource={tb_data}
          scroll={{
            x: "max-content",
          }}
          // pagination={pagination()}
        />

        <Modal
          title={modalType === "add" ? "新增委外送检" : "编辑委外送检"}
          open={modalVisible}
          onOk={handleModalSubmit}
          onCancel={handleModalCancel}
          width={800}
          okText="提交"
          cancelText="取消"
        >
          <Form
            form={modalForm}
            layout="vertical"
            style={{ maxHeight: "60vh", overflowY: "auto", padding: "0 10px" }}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="送检日期"
                  name="inspection_time"
                  rules={[{ required: true, message: "请选择送检日期" }]}
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="物料"
                  name="material"
                  rules={[{ required: true, message: "请输入物料" }]}
                >
                  <Input placeholder="请输入物料" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="样品编号"
                  name="sample_number"
                  rules={[{ required: true, message: "请输入样品编号" }]}
                >
                  <Input placeholder="请输入样品编号" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="检测项目"
                  name="inspection_item"
                  rules={[{ required: true, message: "请输入检测项目" }]}
                >
                  <Select
                    options={selectList2Option(optionData["检验项目"] || [])}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="样品来源"
                  name="sample_source"
                  rules={[{ required: true, message: "请输入样品来源" }]}
                >
                  <Select
                    options={selectList2Option(optionData["样品来源"] || [])}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="检测目的"
                  name="inspection_purpose"
                  rules={[{ required: true, message: "请输入检测目的" }]}
                >
                  <Select
                    options={selectList2Option(optionData["检测目的"] || [])}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="费用"
                  name="cost"
                  rules={[{ required: true, message: "请输入费用" }]}
                >
                  <Input placeholder="请输入费用" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="送检人"
                  name="submitter"
                  rules={[{ required: true, message: "请输入送检人" }]}
                >
                  <Input placeholder="请输入送检人" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="申请部门"
                  name="department"
                  rules={[{ required: true, message: "请输入申请部门" }]}
                >
                  <Select
                    options={selectList2Option(optionData["申请部门"] || [])}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="负责人"
                  name="responsible_person"
                  rules={[{ required: true, message: "请输入负责人" }]}
                >
                  <Input placeholder="请输入负责人" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="供应商"
                  name="supplier"
                  rules={[{ required: true, message: "请输入供应商" }]}
                >
                  <Input placeholder="请输入供应商" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="送检结果" name="result">
                  <Select
                    options={selectList2Option(optionData["送检结果"] || [])}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="付款" name="payment">
                  <Select placeholder="请选择付款状态">
                    <Select.Option value="未付款">未付款</Select.Option>
                    <Select.Option value="部分付款">部分付款</Select.Option>
                    <Select.Option value="已付款">已付款</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="备注" name="remark">
                  <Input.TextArea placeholder="请输入备注" rows={2} />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item label="上传报告" name="upload_report">
              <Upload.Dragger
                fileList={fileList}
                onChange={handleUploadChange}
                beforeUpload={() => false}
                disabled
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  把文件拖入指定区域，完成上传，同样支持点击上传
                </p>
                <p className="ant-upload-hint">
                  支持单个文件上传，支持格式：PDF、Word、图片
                </p>
              </Upload.Dragger>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
}

export default LOP;

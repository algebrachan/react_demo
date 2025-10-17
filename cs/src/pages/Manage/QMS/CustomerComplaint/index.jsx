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
  InputNumber,
  Modal,
  Upload,
} from "antd";
import {
  selectList2Option,
  dateFormat,
  timeFormat,
} from "../../../../utils/string";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import {
  get_customer_complaint,
  customer_complaint,
  get_search_data,
  customer_complaint_put,
  customer_complaint_delete,
  initiate_nonconformity,
} from "../../../../apis/qms_router";
import { UploadOutlined } from "@ant-design/icons";
const { RangePicker } = DatePicker;
const { Panel } = Collapse;
let id = "";
function CustomerComplaint() {
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [addForm] = Form.useForm();
  const [cur, setCur] = useState(1);
  const [page_size, setPageSize] = useState(20);
  const [tb_total, setTbTotal] = useState(0);
  const [tb_data, setTbData] = useState([]);
  const [tb_load, setTbLoad] = useState(false);
  const [opData, setOpData] = useState({});
  const navigate = useNavigate();
  const [editRecord, setEditRecord] = useState(null);
  const [activeKey, setActiveKey] = useState(null);
  const [collapseVisible, setCollapseVisible] = useState(false);
  const [currentPanel, setCurrentPanel] = useState("");
  const [panelForm] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const default_form_data = {
    actual_completion_time: "",
    batch_quantity: 0,
    corrective_measures: "",
    corrective_responsible_person: "",
    customer_issue_description: "",
    customer_name: "",
    defect_type: "",
    defective_quantity: 0,
    feedback_position: "",
    feedback_provider: "",
    improvement_effectiveness: "",
    internal_issue_confirmation: null,
    is_official_complaint: 1,
    batch_number: "",
    issue_category: "",
    issue_image_number: "",
    issue_location: "",
    occurrence_date: dayjs(),
    occurrence_process: "",
    occurrence_responsible_department: "",
    occurrence_responsible_person: "",
    outflow_responsible_department: "",
    outflow_responsible_person: "",
    planned_completion_time: "",
    product_drawing_number: "",
    product_grade: "",
    production_cause: "",
    quality_handling_result: "",
    returned_quantity: 0,
    temporary_measures: "",
    issue_frequency: 0,
    handling_process: "",
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
  const initOpt = () => {
    get_search_data(
      {},
      (res) => {
        setOpData(res.data.data);
        form.setFieldsValue({
          产品名称: res.data.data.产品名称[0] || "",
          产品图号: res.data.data.产品图号[0] || "",
          客户名称: res.data.data.客户名称[0] || "",
          时间: [
            dayjs().subtract(14, "day").format(dateFormat),
            dayjs().format(dateFormat),
          ],
        });
        requestData(1, 20);
      },
      () => {
        console.log("请求失败");
      }
    );
  };
  const columns = [
    {
      title: "编号",
      dataIndex: "number",
      key: "number",
      width: 120,
    },
    {
      title: "客户名称",
      dataIndex: "customer_name",
      key: "customer_name",
      width: 120,
    },
    {
      title: "投诉日期",
      dataIndex: "occurrence_date",
      key: "occurrence_date",
      width: 120,
    },
    {
      title: "反馈人职位",
      dataIndex: "feedback_position",
      key: "feedback_position",
      width: 120,
    },
    {
      title: "反馈人",
      dataIndex: "feedback_provider",
      key: "feedback_provider",
      width: 120,
    },
    {
      title: "正式投诉",
      dataIndex: "is_official_complaint",
      key: "is_official_complaint",
      width: 120,
      render: (text) => {
        return text === 1 ? "是" : "否";
      },
    },
    {
      title: "是否确认",
      dataIndex: "customer_complaint_confirmation",
      key: "customer_complaint_confirmation",
      width: 120,
      render: (text) => {
        return text === 1 ? "是" : "否";
      },
    },
    {
      title: "是否发起不合格",
      dataIndex: "initiate_nonconformity",
      key: "initiate_nonconformity",
      width: 120,
      render: (text) => {
        return text === 1 ? "是" : "否";
      },
    },
    {
      title: "问题发生地",
      dataIndex: "issue_location",
      key: "issue_location",
      width: 120,
    },
    {
      title: "产品名称",
      dataIndex: "product_name",
      key: "product_name",
      width: 120,
    },
    {
      title: "产品图号",
      dataIndex: "product_drawing_number",
      key: "product_drawing_number",
      width: 120,
    },
    {
      title: "问题图片储存",
      dataIndex: "issue_image_number",
      key: "issue_image_number",
      width: 120,
    },
    {
      title: "当前流程",
      dataIndex: "current_process",
      key: "current_process",
      width: 120,
    },
    {
      title: "不良类型",
      dataIndex: "defect_type",
      key: "defect_type",
      width: 120,
    },
    {
      title: "发生工序",
      dataIndex: "occurrence_process",
      key: "occurrence_process",
      width: 120,
    },
    {
      title: "发货批次",
      dataIndex: "batch_number",
      key: "batch_number",
      width: 120,
    },
    {
      title: "批次数量",
      dataIndex: "batch_quantity",
      key: "batch_quantity",
      width: 120,
    },
    {
      title: "不良数量",
      dataIndex: "defective_quantity",
      key: "defective_quantity",
      width: 120,
    },
    {
      title: "问题频次",
      dataIndex: "issue_frequency",
      key: "issue_frequency",
      width: 120,
    },
    {
      title: "客户问题描述",
      dataIndex: "customer_issue_description",
      key: "customer_issue_description_2",
      width: 120,
    },
    {
      title: "内部问题确认",
      dataIndex: "internal_issue_confirmation",
      key: "internal_issue_confirmation",
      width: 120,
      render: (text) => {
        return text === 1 ? "是" : "否";
      },
    },
    {
      title: "确认人",
      dataIndex: "confirmed_by",
      key: "confirmed_by",
      width: 120,
    },
    {
      title: "问题分类",
      dataIndex: "issue_category",
      key: "issue_category",
      width: 120,
    },
    {
      title: "产生原因",
      dataIndex: "production_cause",
      key: "production_cause",
      width: 120,
    },
    {
      title: "纠正措施",
      dataIndex: "corrective_measures",
      key: "corrective_measures",
      width: 120,
    },
    {
      title: "纠正负责人",
      dataIndex: "corrective_responsible_person",
      key: "corrective_responsible_person",
      width: 120,
    },
    {
      title: "计划完成时间",
      dataIndex: "planned_completion_time",
      key: "planned_completion_time",
      width: 120,
    },
    {
      title: "实际完成时间",
      dataIndex: "actual_completion_time",
      key: "actual_completion_time",
      width: 120,
    },
    {
      title: "改善对策有效性验证",
      dataIndex: "improvement_effectiveness",
      key: "improvement_effectiveness",
      width: 150,
    },
    {
      title: "是否关闭",
      dataIndex: "is_closed",
      key: "is_closed",
      width: 120,
      render: (text) => {
        return text === 1 ? "是" : "否";
      },
    },
    {
      title: "退回数量",
      dataIndex: "returned_quantity",
      key: "returned_quantity",
      width: 120,
    },
    {
      title: "产品处理结果",
      dataIndex: "quality_handling_result",
      key: "quality_handling_result",
      width: 120,
    },
    {
      title: "流出责任部门",
      dataIndex: "outflow_responsible_department",
      key: "outflow_responsible_department",
      width: 120,
    },
    {
      title: "流出责任人",
      dataIndex: "outflow_responsible_person",
      key: "outflow_responsible_person",
      width: 120,
    },
    {
      title: "发生责任人",
      dataIndex: "occurrence_responsible_person",
      key: "occurrence_responsible_person",
      width: 120,
    },
    {
      title: "发生责任部门",
      dataIndex: "occurrence_responsible_department",
      key: "occurrence_responsible_department",
      width: 120,
    },
    {
      title: "处理过程",
      dataIndex: "handling_process",
      key: "handling_process",
      width: 120,
    },
    {
      title: "操作",
      key: "opt",
      fixed: "right",
      width: 60,
      render: (record) => (
        <Space>
          <Button
            type="link"
            style={{ padding: 0 }}
            onClick={() => {
              handleButtonClick("confirm", record);
            }}
          >
            确认
          </Button>
          {"|"}
          <Button
            type="link"
            style={{ padding: 0 }}
            onClick={() => {
              handleButtonClick("process", record);
            }}
          >
            处理
          </Button>
          {"|"}
          <Button
            type="link"
            style={{ padding: 0 }}
            onClick={() => {
              handleButtonClick("close", record);
            }}
          >
            关闭
          </Button>
          {"|"}
          <Button
            type="link"
            style={{ padding: 0 }}
            danger
            onClick={() => {
              Modal.confirm({
                title: "确认删除",
                content: "您确定要删除这条客户投诉记录吗？此操作不可撤销。",
                okText: "确定",
                cancelText: "取消",
                onOk: () => {
                  customer_complaint_delete({ id: record.id }, (res) => {
                    if (res.data.code === 200) {
                      message.success("删除成功");
                      requestData();
                    } else {
                      message.error(res.data.msg);
                    }
                  });
                },
              });
            }}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];
  const requestData = (page = 1, pageSize = 10) => {
    let val = form.getFieldsValue();
    setTbLoad(true);
    get_customer_complaint(
      {
        limit: pageSize,
        page: page,
        customer_name: val.客户名称,
        product_drawing_number: val.产品图号,
        product_name: val.产品名称,
        occurrence_start_date: val.时间[0],
        occurrence_end_date: val.时间[1],
      },
      (res) => {
        setTbLoad(false);
        if (res.data.code === 200 && res.data.data) {
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

  useEffect(() => {
    initOpt();
  }, []);

  // 处理按钮点击
  const handleButtonClick = (panelType, record = null) => {
    setCurrentPanel(panelType);
    setCollapseVisible(true);
    setActiveKey(["1"]);
    if (panelType === "register" || !record) {
      panelForm.setFieldsValue({
        ...default_form_data,
        occurrence_date: dayjs(),
      });
      setFileList([]); // 重置文件列表
    } else {
      // 需要转为 dayjs 对象的日期字段
      const fillData = { ...record };
      if (fillData.occurrence_date) {
        fillData.occurrence_date = dayjs(fillData.occurrence_date);
      }
      if (fillData.planned_completion_time) {
        fillData.planned_completion_time = dayjs(
          fillData.planned_completion_time
        );
      }
      if (fillData.actual_completion_time) {
        fillData.actual_completion_time = dayjs(
          fillData.actual_completion_time
        );
      }
      panelForm.setFieldsValue(fillData);
      id = record.id;
      // 处理已有文件的回填
      if (record.attachment_name && record.attachment_path) {
        const fileNames = record.attachment_name.split(",");
        const filePaths = record.attachment_path.split(",");

        const fileListData = fileNames.map((name, index) => ({
          uid: `file-${index}`,
          name: name.trim(),
          status: "done",
          url: filePaths[index]?.trim(),
        }));

        setFileList(fileListData);
      } else {
        setFileList([]);
      }
    }
  };

  // 关闭折叠面板
  const handleCollapseChange = (key) => {
    setActiveKey(key);
    if (key.length === 0) {
      setCollapseVisible(false);
      setFileList([]); // 重置文件列表
    }
  };

  // 获取面板标题
  const getPanelTitle = () => {
    const titles = {
      register: "客户登记",
      confirm: "客户确认",
      process: "客户处理",
      close: "客户关闭",
    };
    return titles[currentPanel] || "";
  };
  const handleButtonSend = (panelType) => {
    let val = panelForm.getFieldsValue();
    val.occurrence_date = val.occurrence_date.format(dateFormat);

    // 处理带时间的日期字段
    if (
      val.planned_completion_time &&
      dayjs.isDayjs(val.planned_completion_time)
    ) {
      val.planned_completion_time =
        val.planned_completion_time.format(timeFormat);
    }
    if (
      val.actual_completion_time &&
      dayjs.isDayjs(val.actual_completion_time)
    ) {
      val.actual_completion_time =
        val.actual_completion_time.format(timeFormat);
    }

    // 处理文件上传
    const formData = new FormData();
    const fileBlobs = [];
    fileList.forEach((fileItem, index) => {
      // 只处理新上传的文件，忽略回填的旧文件
      if (fileItem.originFileObj) {
        fileBlobs.push(fileItem.originFileObj);
        formData.append("file", fileItem.originFileObj, fileItem.name);
      }
    });
    const uploadFileData = fileBlobs.length > 0 ? fileBlobs[0] : null;

    if (panelType === "register") {
      customer_complaint(
        { customer_complaint: JSON.stringify(val), file: uploadFileData },
        (res) => {
          if (res.data.code === 200) {
            message.success(res.data.msg || "客户登记成功");
            setCollapseVisible(false);
            requestData();
          } else {
            message.error(res.data.msg || "客户登记失败");
          }
        }
      );
    } else if (panelType === "confirm") {
      let data = { ...val, id, customer_complaint_confirmation: 1 };
      customer_complaint_put(
        { customer_complaint: JSON.stringify(data), file: uploadFileData },
        (res) => {
          if (res.data.code === 200) {
            message.success(res.data.msg || "客户确认成功");
            setCollapseVisible(false);
            requestData();
          } else {
            message.error(res.data.msg || "客户确认失败");
          }
        }
      );
    } else if (panelType === "process") {
      let data = { ...val, id, initiate_nonconformity: 1 };
      initiate_nonconformity(
        { customer_complaint: JSON.stringify(data), file: uploadFileData },
        (res) => {
          if (res.data.code === 200) {
            message.success(res.data.msg || "发起不合格成功");
            setCollapseVisible(false);
            requestData();
          } else {
            message.error(res.data.msg || "发起不合格失败");
          }
        }
      );
    } else if (panelType === "close") {
      let data = { ...val, id, is_closed: 1 };
      customer_complaint_put(
        { customer_complaint: JSON.stringify(data), file: uploadFileData },
        (res) => {
          if (res.data.code === 200) {
            message.success(res.data.msg || "关闭成功");
            setCollapseVisible(false);
            requestData();
          } else {
            message.error(res.data.msg || "关闭失败");
          }
        }
      );
    }
  };
  // 渲染表单内容
  const renderFormContent = () => {
    // 根据面板类型判断字段是否可编辑
    const isRegisterOrConfirm =
      currentPanel === "register" || currentPanel === "confirm";
    const isProcess = currentPanel === "process";
    const isClose = currentPanel === "close";

    return (
      <Form
        form={panelForm}
        initialValues={default_form_data}
        layout="vertical"
      >
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item
              label="发生日期"
              name="occurrence_date"
              rules={[{ required: true, message: "请选择发生日期" }]}
            >
              <DatePicker style={{ width: "100%" }} defaultValue={dayjs()} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="客户名称" name="customer_name">
              <Input placeholder="请选择客户" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="反馈人职位" name="feedback_position">
              <Input placeholder="输入反馈人职位" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="反馈人" name="feedback_provider">
              <Input placeholder="输入反馈人" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={6}>
            <Form.Item label="正式投诉" name="is_official_complaint">
              <Select defaultValue={1} style={{ width: "100%" }}>
                <Select.Option value={1}>是</Select.Option>
                <Select.Option value={0}>否</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="不良类型" name="defect_type">
              <Input />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="产品名称" name="product_name">
              <Select
                options={selectList2Option(
                  opData.产品名称.filter((item) => {
                    if (item != "全部") {
                      return item;
                    }
                  }) || []
                )}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="编号" name="number">
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={6}>
            <Form.Item label="问题发生地" name="issue_location">
              <Input />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="产品图号" name="product_drawing_number">
              <Input />
            </Form.Item>
          </Col>
          <Col span={6}>
            <div>
              <label
                style={{
                  marginBottom: 8,
                  display: "block",
                  fontWeight: "bold",
                }}
              >
                上传附件
              </label>
              <Upload
                fileList={fileList}
                onChange={handleUploadChange}
                beforeUpload={() => false}
                maxCount={1}
                multiple={false}
              >
                <Button icon={<UploadOutlined />} style={{ width: "100%" }}>
                  附件形式
                </Button>
              </Upload>
            </div>
          </Col>
          <Col span={6}>{/* 空列用于布局对齐 */}</Col>
        </Row>

        <Row gutter={16}>
          <Col span={6}>
            <Form.Item label="发生工序" name="occurrence_process">
              <Input />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="发货批次" name="batch_number">
              <Input />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="批次数量" name="batch_quantity">
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="不良数量" name="defective_quantity">
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={6}>
            <Form.Item label="客户问题描述" name="customer_issue_description">
              <Input.TextArea rows={2} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="问题频次" name="issue_frequency">
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="退回数量" name="returned_quantity">
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="产品处理结果" name="quality_handling_result">
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label="临时措施" name="temporary_measures">
              <Input.TextArea rows={2} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={6}>
            <Form.Item
              label="流出责任部门"
              name="outflow_responsible_department"
            >
              <Input disabled={isRegisterOrConfirm} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="流出责任人" name="outflow_responsible_person">
              <Input disabled={isRegisterOrConfirm} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="发生责任部门"
              name="occurrence_responsible_department"
            >
              <Input disabled={isRegisterOrConfirm} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="发生责任人" name="occurrence_responsible_person">
              <Input disabled={isRegisterOrConfirm} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={6}>
            <Form.Item label="内部问题确认" name="internal_issue_confirmation">
              <Select
                defaultValue={1}
                style={{ width: "100%" }}
                disabled={isRegisterOrConfirm}
              >
                <Select.Option value={1}>是</Select.Option>
                <Select.Option value={0}>否</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="问题分类" name="issue_category">
              <Input disabled={isRegisterOrConfirm} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="产生原因" name="production_cause">
              <Input disabled={isRegisterOrConfirm} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={6}>
            <Form.Item label="纠正措施" name="corrective_measures">
              <Input disabled={isRegisterOrConfirm} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="纠正负责人" name="corrective_responsible_person">
              <Input disabled={isRegisterOrConfirm} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="计划完成时间" name="planned_completion_time">
              <DatePicker
                style={{ width: "100%" }}
                showTime
                defaultValue={dayjs("2025-05-02")}
                format={"YYYY-MM-DD HH:mm:ss"}
                disabled={isRegisterOrConfirm}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="实际完成时间" name="actual_completion_time">
              <DatePicker
                style={{ width: "100%" }}
                showTime
                defaultValue={dayjs("2025-05-02")}
                format={"YYYY-MM-DD HH:mm:ss"}
                disabled={isRegisterOrConfirm}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="改善对策有效性验证"
              name="improvement_effectiveness"
            >
              <Input.TextArea
                rows={2}
                disabled={isRegisterOrConfirm || isProcess}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="处理过程" name="handling_process">
              <Input.TextArea
                rows={2}
                disabled={isRegisterOrConfirm || isProcess}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row justify="end" style={{ marginTop: 16 }}>
          <Space>
            {currentPanel === "register" && (
              <Button
                type="primary"
                onClick={() => {
                  handleButtonSend("register");
                }}
              >
                客诉登记
              </Button>
            )}
            {currentPanel === "confirm" && (
              <Button
                type="primary"
                onClick={() => {
                  handleButtonSend("confirm");
                }}
              >
                客诉确认
              </Button>
            )}
            {currentPanel === "process" && (
              <>
                <Button
                  type="primary"
                  onClick={() => {
                    handleButtonSend("process");
                  }}
                >
                  发起不合格
                </Button>
              </>
            )}
            {currentPanel === "close" && (
              <>
                <Button
                  type="primary"
                  onClick={() => {
                    handleButtonSend("close");
                  }}
                >
                  关闭
                </Button>
              </>
            )}
            <Button onClick={() => setCollapseVisible(false)}>取消</Button>
          </Space>
        </Row>
      </Form>
    );
  };

  // 处理文件上传
  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  return (
    <div>
      <MyBreadcrumb items={[window.sys_name, "客诉管理"]} />
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
            时间: [
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
                  时间: [
                    dayjs().subtract(val, "month").format(dateFormat),
                    dayjs().format(dateFormat),
                  ],
                });
              }}
            />
          </Form.Item>
          <Form.Item
            label="时间"
            name="时间"
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
          <Form.Item label="客户名称" name="客户名称">
            <Select
              options={selectList2Option(opData.客户名称 || [])}
              style={{ width: 160 }}
            />
          </Form.Item>
          <Form.Item label="产品图号" name="产品图号">
            <Select
              options={selectList2Option(opData.产品图号 || [])}
              style={{ width: 160 }}
            />
          </Form.Item>
          <Form.Item label="产品名称" name="产品名称">
            <Select
              options={selectList2Option(opData.产品名称 || [])}
              style={{ width: 160 }}
            />
          </Form.Item>
          <Space>
            <Button type="primary" onClick={() => requestData(cur, page_size)}>
              查询
            </Button>
          </Space>
          <Space>
            <Button
              style={{ marginLeft: 10 }}
              onClick={() => handleButtonClick("register")}
            >
              客户登记
            </Button>
          </Space>
          <Space>
            <Button
              style={{ marginLeft: 10 }}
              onClick={() => navigate("/mng/qms_customer_complaint_settings")}
            >
              参数设置
            </Button>
          </Space>
        </Form>

        {collapseVisible && (
          <Collapse
            activeKey={activeKey}
            onChange={handleCollapseChange}
            style={{ marginBottom: 20 }}
          >
            <Panel header={getPanelTitle()} key="1">
              {renderFormContent()}
            </Panel>
          </Collapse>
        )}

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
          pagination={pagination()}
        />
      </div>
    </div>
  );
}

export default CustomerComplaint;

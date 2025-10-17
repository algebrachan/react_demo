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
  Flex,
} from "antd";
import {
  dateFormat,
  selectList2Option,
  timeFormat,
} from "../../../../utils/string";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import {
  read_lop,
  lop_options,
  update_lop,
  create_lop,
  delete_lop,
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
  const navigate = useNavigate();
  const [editRecord, setEditRecord] = useState(null);
  const [activeKey, setActiveKey] = useState(null);
  const default_form_data = {
    问题类型: "",
    主键: "",
    主键编码: "",
    问题描述: "",
    发现日期: dayjs(),
    责任部门: "",
    优先级: "",
    严重程度: "",
    计划完成时间: "",
    提醒时间: "",
    实际完成时间: "",
    当前状态: "",
    备注: "",
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
    lop_options(
      {},
      (res) => {
        setOpData(res.data.data);
        form.setFieldsValue({
          问题类型: res.data.data.问题类型[0] || "",
          当前状态: res.data.data.当前状态[0] || "",
        });
      },
      () => {
        console.log("请求失败");
      }
    );
  };
  const columns = [
    {
      title: "id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "问题类型",
      dataIndex: "问题类型",
      key: "问题类型",
      width: 120,
    },
    {
      title: "主键",
      dataIndex: "主键",
      key: "主键",
      width: 120,
    },
    {
      title: "主键编码",
      dataIndex: "主键编码",
      key: "主键编码",
      width: 120,
    },
    {
      title: "问题描述",
      dataIndex: "问题描述",
      key: "问题描述",
      width: 120,
    },
    {
      title: "发现日期",
      dataIndex: "发现日期",
      key: "发现日期",
    },
    {
      title: "责任部门/人",
      dataIndex: "责任部门",
      key: "责任部门",
      width: 120,
    },
    {
      title: "优先级",
      dataIndex: "优先级",
      key: "优先级",
      width: 120,
    },
    {
      title: "严重程度",
      dataIndex: "严重程度",
      key: "严重程度",
      width: 120,
    },
    {
      title: "计划完成时间",
      dataIndex: "计划完成时间",
      key: "计划完成时间",
      width: 180,
    },
    {
      title: "提醒日期",
      dataIndex: "提醒日期",
      key: "提醒日期",
      width: 120,
    },
    {
      title: "实际完成时间",
      dataIndex: "实际完成时间",
      key: "实际完成时间",
      width: 180,
    },
    {
      title: "当前状态",
      dataIndex: "当前状态",
      key: "当前状态",
      width: 120,
    },
    {
      title: "备注",
      dataIndex: "备注",
      key: "备注",
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
              if (record.问题类型 == "变更") {
                navigate("/mng/qms_change", {
                  state: { record },
                });
              } else if (record.问题类型 == "不合格评审") {
                navigate("/mng/qms_reviewnoproduct", {
                  state: { record },
                });
              } else {
                // message.error("当前状态为已处理，无法处理");
              }
            }}
          >
            处理
          </Button>
          {"|"}
          <Button
            type="link"
            style={{ padding: 0 }}
            onClick={() => showEditPanel(record)}
          >
            编辑
          </Button>
          {"|"}
          <Button
            type="link"
            style={{ padding: 0 }}
            danger
            onClick={() => {
              delete_lop({ id: record.id }, (res) => {
                if (res.data.code === 0) {
                  message.success("删除成功");
                  requestData(cur, page_size);
                } else {
                  message.error(res.data.msg);
                }
              });
            }}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];
  const requestData = (page, pageSize) => {
    let val = form.getFieldsValue();
    setTbLoad(true);
    read_lop(
      {
        limit: pageSize,
        page: page,
        问题类型: val.问题类型,
        当前状态: val.当前状态,
        开始日期: val.时间[0],
        结束日期: val.时间[1],
      },
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

  // 编辑表单提交
  const handleEditSubmit = () => {
    editForm.validateFields().then((values) => {
      // 转换日期为字符串格式
      const formData = {
        ...values,
        id: id,
        发现日期: values.发现日期 ? values.发现日期.format(timeFormat) : null,
        计划完成时间: values.计划完成时间
          ? values.计划完成时间.format(timeFormat)
          : null,
        提醒日期: values.提醒日期 ? values.提醒日期.format(timeFormat) : null,
        实际完成时间: values.实际完成时间
          ? values.实际完成时间.format(timeFormat)
          : null,
      };
      // 这里可以调用接口保存数据
      update_lop(formData, (res) => {
        if (res.data.code === 0) {
          message.success("修改成功");
          setActiveKey(null);
          requestData(cur, page_size);
        } else {
          message.error(res.data.msg);
        }
      });
    });
  };

  // 新增表单提交
  const handleAddSubmit = () => {
    addForm.validateFields().then((values) => {
      // 转换日期为字符串格式
      const formData = {
        ...values,
        发现日期: values.发现日期 ? values.发现日期.format(timeFormat) : "",
        计划完成时间: values.计划完成时间
          ? values.计划完成时间.format(timeFormat)
          : "",
        提醒日期: values.提醒日期 ? values.提醒日期.format(timeFormat) : "",
        实际完成时间: values.实际完成时间
          ? values.实际完成时间.format(timeFormat)
          : "",
      };
      // 这里可以调用接口保存数据
      create_lop(formData, (res) => {
        if (res.data.code === 0) {
          message.success("新增成功");
          setActiveKey(null);
          addForm.resetFields();
          requestData(cur, page_size);
        } else {
          message.error(res.data.msg);
        }
      });
    });
  };

  // 显示编辑面板
  const showEditPanel = (record) => {
    setEditRecord(record);
    setActiveKey("edit");
    id = record.id;
    setTimeout(() => {
      const formValues = {
        ...record,
        发现日期: record.发现日期 ? dayjs(record.发现日期) : null,
        计划完成时间: record.计划完成时间 ? dayjs(record.计划完成时间) : null,
        提醒日期: record.提醒日期 ? dayjs(record.提醒日期) : null,
        实际完成时间: record.实际完成时间 ? dayjs(record.实际完成时间) : null,
      };
      editForm.setFieldsValue(formValues);
    }, 0);
  };

  // 显示新增面板
  const add = () => {
    setActiveKey("add");
    addForm.resetFields();
    // 为必填字段设置默认值
    setTimeout(() => {
      const defaultValues = {
        发现日期: dayjs(),
        优先级: "中",
        问题类型: opData.问题类型?.[0] || "",
        当前状态: opData.当前状态?.[0] || "",
      };
      addForm.setFieldsValue(defaultValues);
    }, 0);
  };

  // 渲染表单字段
  const renderFormItems = (form) => (
    <Row gutter={24}>
      <Col span={8}>
        <Form.Item
          label="发生日期"
          name="发现日期"
          rules={[{ required: true, message: "请选择发生日期" }]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          label="当前状态"
          name="当前状态"
          rules={[{ required: true, message: "请选择当前状态" }]}
        >
          <Select
            disabled={form == editForm}
            options={selectList2Option(opData.当前状态 || [])}
            allowClear
          />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          label="问题类型"
          name="问题类型"
          rules={[{ required: true, message: "请选择问题类型" }]}
        >
          <Select
            disabled={form == editForm}
            options={selectList2Option(opData.问题类型 || [])}
            allowClear
          />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item label="严重程度" name="严重程度">
          <Select
            disabled={form == editForm}
            options={selectList2Option(["一般", "严重", "致命"])}
            allowClear
          />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item label="责任部门/人" name="责任部门">
          <Input placeholder="输入姓名" />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          label="优先级"
          name="优先级"
          rules={[{ required: true, message: "请选择优先级" }]}
        >
          <Select options={selectList2Option(["高", "中", "低"])} allowClear />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item label="计划完成时间" name="计划完成时间">
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item label="提醒时间" name="提醒日期">
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item label="实际完成时间" name="实际完成时间">
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item label="主键" name="主键">
          <Select
            disabled={form == editForm}
            options={selectList2Option(["主键1", "主键2", "主键3"])}
            allowClear
          />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item label="主键编码" name="主键编码">
          <Input disabled={form == editForm} />
        </Form.Item>
      </Col>

      <Col span={24}>
        <Form.Item label="问题描述" name="问题描述">
          <Input.TextArea rows={2} placeholder="请输入问题描述" />
        </Form.Item>
      </Col>
      <Col span={24}>
        <Form.Item label="备注" name="备注">
          <Input.TextArea rows={2} placeholder="请输入备注" />
        </Form.Item>
      </Col>
      <Col span={24}>
        <Form.Item>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Space style={{ marginTop: 10 }}>
              <Button
                type="primary"
                onClick={form === editForm ? handleEditSubmit : handleAddSubmit}
              >
                提交
              </Button>
              <Button onClick={() => setActiveKey(null)}>取消</Button>
            </Space>
          </div>
        </Form.Item>
      </Col>
    </Row>
  );

  useEffect(() => {
    if (Object.keys(opData).length > 0) {
      requestData(cur, page_size);
    }
  }, [opData]);
  useEffect(() => {
    initOpt();
  }, []);

  return (
    <div>
      <MyBreadcrumb items={[window.sys_name, "LOP"]} />
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
          <Flex gap={16}>
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
            <Form.Item label="问题类型" name="问题类型">
              <Select
                options={selectList2Option(opData.问题类型 || [])}
                style={{ width: 160 }}
              />
            </Form.Item>
            <Form.Item label="当前状态" name="当前状态">
              <Select
                options={selectList2Option(opData.当前状态 || [])}
                style={{ width: 160 }}
              />
            </Form.Item>
            <Button type="primary" onClick={() => requestData(cur, page_size)}>
              查询
            </Button>
            <Button type="primary" onClick={() => add()}>
              新增
            </Button>
          </Flex>
        </Form>

        {activeKey === "add" && (
          <Collapse activeKey={activeKey} onChange={setActiveKey}>
            <Panel header="新增" key="add">
              <Form
                form={addForm}
                layout="vertical"
                initialValues={default_form_data}
              >
                {renderFormItems(addForm)}
              </Form>
            </Panel>
          </Collapse>
        )}

        {activeKey === "edit" && (
          <Collapse activeKey={activeKey} onChange={setActiveKey}>
            <Panel header="编辑" key="edit">
              <Form form={editForm} layout="vertical">
                {renderFormItems(editForm)}
              </Form>
            </Panel>
          </Collapse>
        )}

        <Table
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

export default LOP;

import React, { useEffect, useState } from "react";
import { MyBreadcrumb } from "../../../../components/CommonCard";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Space,
  Table,
  Collapse,
  Modal,
  message,
  Popconfirm,
  Select,
  InputNumber,
} from "antd";
import { dateFormat } from "../../../../utils/string";
import dayjs from "dayjs";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import "./index.less";
import {
  read_quality_cost,
  create_quality_cost,
  update_quality_cost,
} from "../../../../apis/qms_router";
const { RangePicker } = DatePicker;
const { Panel } = Collapse;

function ChengBenZhiLiang() {
  const [form] = Form.useForm();
  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [tb_data, setTbData] = useState({});
  const [tb_load, setTbLoad] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  // 表格列定义
  const columns = [
    {
      title: "成本类别",
      dataIndex: "cost_category",
      key: "cost_category",
      width: 120,
    },
    {
      title: "成本项目",
      dataIndex: "cost_item",
      key: "cost_item",
      width: 150,
    },
    {
      title: "数据来源",
      dataIndex: "data_source",
      key: "data_source",
      width: 120,
    },
    {
      title: "目标成本 (文字描述)",
      dataIndex: "target_cost_text",
      key: "target_cost_text",
    },
    {
      title: "实际成本 (文字描述)",
      dataIndex: "actual_cost_text",
      key: "actual_cost_text",
    },
    {
      title: "目标成本损失",
      dataIndex: "target_cost_amount",
      key: "target_cost_amount",
      width: 120,
      render: (value) => (
        <span className="amount-display">¥{value?.toFixed(2) || "0.00"}</span>
      ),
    },
    {
      title: "实际成本损失",
      dataIndex: "actual_cost_amount",
      key: "actual_cost_amount",
      width: 120,
      render: (value) => (
        <span className="amount-text">¥{value?.toFixed(2) || "0.00"}</span>
      ),
    },
    {
      title: "操作",
      key: "opt",
      fixed: "right",
      width: 50,
      render: (record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
            className="edit-button"
          ></Button>
          {/* <Popconfirm
                        title="确定要删除这条记录吗？"
                        onConfirm={() => handleDelete(record.id)}
                        okText="确定"
                        cancelText="取消"
                    >
                        <Button 
                            danger 
                            type="link" 
                            icon={<DeleteOutlined />}
                            size="small"
                            className="delete-button"
                        >
                        </Button>
                    </Popconfirm> */}
        </Space>
      ),
    },
  ];
  // 查询数据
  const requestData = () => {
    let val = form.getFieldsValue();
    setTbLoad(true);
    read_quality_cost(val, (res) => {
      if (res.data.code === 0) {
        setTbData(res.data.data);
      } else {
        message.error(res.data.msg);
      }
      setTbLoad(false);
    });
  };
  // 删除记录
  const handleDelete = (id) => {
    console.log("删除记录ID:", id);
    // 这里应该调用删除接口
    message.success("删除成功");
    // 重新查询数据
    requestData();
  };

  // 添加新记录
  const handleAdd = () => {
    setAddModalVisible(true);
  };
  // 提交新增
  const handleAddSubmit = () => {
    addForm
      .validateFields()
      .then((values) => {
        create_quality_cost(values, (res) => {
          if (res.data.code === 0) {
            message.success("添加成功");
            requestData();
            setAddModalVisible(false);
          } else {
            message.error(res.data.msg);
          }
        });
        addForm.resetFields();
      })
      .catch((err) => {
        console.log("表单验证失败:", err);
      });
  };

  // 编辑记录
  const handleEdit = (record) => {
    setEditingRecord(record);
    editForm.setFieldsValue({
      target_cost_text: record.target_cost_text,
      actual_cost_text: record.actual_cost_text,
    });
    setEditModalVisible(true);
  };

  // 提交编辑
  const handleEditSubmit = () => {
    editForm
      .validateFields()
      .then((values) => {
        const updatedRecord = {
          ...editingRecord,
          target_cost_text: values.target_cost_text,
          actual_cost_text: values.actual_cost_text,
        };
        update_quality_cost(updatedRecord, (res) => {
          if (res.data.code === 0) {
            message.success("编辑成功");
            editForm.resetFields();
            setEditModalVisible(false);
            // 重新查询数据
            requestData();
          } else {
            message.error(res.data.msg);
          }
        });
        setEditingRecord(null);
      })
      .catch((err) => {
        console.log("表单验证失败:", err);
      });
  };

  // 渲染分类表格
  const renderCategoryTable = (categoryName, data) => {
    if (!data || data.length === 0) {
      return null;
    }

    // 根据类别名称添加对应的CSS类
    const getCategoryClass = (name) => {
      switch (name) {
        case "预防成本":
          return "prevention-cost";
        case "检验-检定成本":
          return "inspection-cost";
        case "内部失败成本":
          return "internal-failure";
        case "外部失败成本":
          return "external-failure";
        default:
          return "";
      }
    };

    return (
      <Panel
        header={`${categoryName} (${data.length}个项目)`}
        key={categoryName}
        className={getCategoryClass(categoryName)}
      >
        <div className="cost-table">
          <Table
            bordered
            size="small"
            columns={columns}
            dataSource={data}
            rowKey="id"
            pagination={false}
            scroll={{
              x: "max-content",
            }}
          />
        </div>
      </Panel>
    );
  };

  useEffect(() => {
    requestData();
  }, []);

  return (
    <div className="cost-quality-container">
      <MyBreadcrumb items={[window.sys_name, "质量成本"]} />
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
          className="search-form"
          initialValues={{
            cost_item: "",
            快捷检索: 1,
            time: [
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
                  time: [
                    dayjs().subtract(val, "month").format(dateFormat),
                    dayjs().format(dateFormat),
                  ],
                });
              }}
            />
          </Form.Item>
          <Form.Item
            label="时间"
            name="time"
            getValueProps={(value) => {
              return {
                value: value && value.map((e) => dayjs(e)),
              };
            }}
            normalize={(value) =>
              value && value.map((e) => dayjs(e).format(dateFormat))
            }
          >
            <RangePicker style={{ width: 300 }} allowClear={false} />
          </Form.Item>
          <Form.Item label="成本项目" name="cost_item">
            <Input placeholder="请输入成本项目" style={{ width: 160 }} />
          </Form.Item>
          <Space>
            <Button type="primary" onClick={requestData}>
              查询
            </Button>
            <Button type="primary" onClick={handleAdd}>
              添加项目
            </Button>
          </Space>
        </Form>

        <Collapse
          className="collapse-container"
          defaultActiveKey={[
            "预防成本",
            "检验-检定成本",
            "内部失败成本",
            "外部失败成本",
          ]}
          loading={tb_load}
        >
          {Object.entries(tb_data).map(([categoryName, data]) =>
            renderCategoryTable(categoryName, data)
          )}
        </Collapse>
      </div>

      {/* 新增弹窗 */}
      <Modal
        title="添加成本项目"
        open={addModalVisible}
        onOk={handleAddSubmit}
        onCancel={() => {
          setAddModalVisible(false);
          addForm.resetFields();
        }}
        width={600}
        okText="提交"
        cancelText="取消"
        className="custom-modal"
      >
        <Form form={addForm} layout="vertical" className="custom-form">
          <Form.Item
            label="成本类别"
            name="cost_category"
            rules={[{ required: true, message: "请选择成本类别" }]}
          >
            <Select placeholder="请选择成本类别">
              <Select.Option value="预防成本">预防成本</Select.Option>
              <Select.Option value="检验-检定成本">检验-检定成本</Select.Option>
              <Select.Option value="内部失败成本">内部失败成本</Select.Option>
              <Select.Option value="外部失败成本">外部失败成本</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="成本项目"
            name="cost_item"
            rules={[{ required: true, message: "请输入成本项目" }]}
          >
            <Input placeholder="请输入成本项目名称" />
          </Form.Item>
          <Form.Item
            label="数据来源"
            name="data_source"
            rules={[{ required: true, message: "请输入数据来源" }]}
          >
            <Input placeholder="请输入数据来源" />
          </Form.Item>
          <Form.Item
            label="目标成本 (文字描述)"
            name="target_cost_text"
            rules={[{ required: true, message: "请输入目标成本描述" }]}
          >
            <Input.TextArea placeholder="请输入目标成本的详细描述" rows={3} />
          </Form.Item>
          <Form.Item
            label="实际成本 (文字描述)"
            name="actual_cost_text"
          >
            <Input.TextArea placeholder="请输入实际成本的详细描述" rows={3} />
          </Form.Item>
             <Form.Item
            label="批次编号"
            name="batch_number"
          >
            <Input placeholder="请输入批次编号" />
          </Form.Item>
          <Form.Item
            label="目标成本 (金额)"
            name="target_cost_amount"
          >
            <InputNumber
              placeholder="请输入目标成本金额"
              addonBefore="¥"
              step={0.01}
              min={0}
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item
            label="实际成本 (金额)"
            name="actual_cost_amount"
          
          >
            <InputNumber
              placeholder="请输入实际成本金额"
              addonBefore="¥"
              step={0.01}
              min={0}
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* 编辑弹窗 */}
      <Modal
        title="编辑成本项目"
        open={editModalVisible}
        onOk={handleEditSubmit}
        onCancel={() => {
          setEditModalVisible(false);
          editForm.resetFields();
          setEditingRecord(null);
        }}
        width={600}
        okText="提交"
        cancelText="取消"
        className="custom-modal"
      >
        <Form form={editForm} layout="vertical" className="custom-form">
          {editingRecord && (
            <>
              <Form.Item label="成本类别">
                <Input value={editingRecord.cost_category} disabled />
              </Form.Item>
              <Form.Item label="成本项目">
                <Input value={editingRecord.cost_item} disabled />
              </Form.Item>
              <Form.Item label="数据来源">
                <Input value={editingRecord.data_source} disabled />
              </Form.Item>
              <Form.Item
                label="目标成本 (文字描述)"
                name="target_cost_text"
                rules={[{ required: true, message: "请输入目标成本描述" }]}
              >
                <Input.TextArea
                  placeholder="请输入目标成本的详细描述"
                  rows={3}
                />
              </Form.Item>
              <Form.Item
                label="实际成本 (文字描述)"
                name="actual_cost_text"
                rules={[{ required: true, message: "请输入实际成本描述" }]}
              >
                <Input.TextArea
                  placeholder="请输入实际成本的详细描述"
                  rows={3}
                />
              </Form.Item>
                   <Form.Item
            label="批次编号"
            name="batch_number"
          >
            <Input placeholder="请输入批次编号" />
          </Form.Item>
              <Form.Item label="目标成本 (金额)">
                <InputNumber
                  value={editingRecord.target_cost_amount}
                  addonBefore="¥"
                  disabled
                  style={{ width: "100%" }}
                />
              </Form.Item>
              <Form.Item label="实际成本 (金额)">
                <InputNumber
                  value={editingRecord.actual_cost_amount}
                  addonBefore="¥"
                  disabled
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
    </div>
  );
}
export default ChengBenZhiLiang;

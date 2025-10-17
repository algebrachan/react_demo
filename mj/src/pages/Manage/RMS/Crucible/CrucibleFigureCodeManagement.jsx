// 1. 首先在导入部分添加Spin组件
import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Table,
  Modal,
  Select,
  DatePicker,
  message,
  Row,
  Col,
  Space,
  Tag,
  Spin,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ReloadOutlined,
  FileTextOutlined,
  ExportOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { MyBreadcrumb } from "../../../../components/CommonCard";
import { Flex } from "antd";
import { dateFormat, selectList2Option } from "../../../../utils/string";
import { Popconfirm } from "antd";
import { ComputeFormCol, downloadFileBlob } from "../../../../utils/obj";
import {
  rmsGetFigureOptional,
  rmsFilterFigureData,
  rmsAddFigureData,
  rmsDeleteFigureData,
  rmsUpdateFigureData,
  rmsExportFigureCsv,
} from "../../../../apis/anls_api";

const { RangePicker } = DatePicker;

// 2. 在状态管理部分添加submitLoading状态
const CrucibleFigureCodeManagement = () => {
  // 状态管理
  const [tb_data, setTbData] = useState([]);
  const [tb_load, setTbLoad] = useState(false);
  const [editingDrawing, setEditingDrawing] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  // 新增分页状态
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  // 新增选项状态
  const [query_opt, setQueryOpt] = useState({
    用途: ["实验室使用", "工业生产", "科研项目", "教学演示", "其他用途"],
    启用状态: [],
    型号: [],
  });
  // 添加提交加载状态
  const [submitLoading, setSubmitLoading] = useState(false);
  // 添加导出加载状态
  const [exportLoading, setExportLoading] = useState(false);
  const default_form_data = {
    图号: "",
    型号: "",
    用途: "",
    状态: "",
    添加人员: "",
    添加日期范围: [],
    修改人员: "",
    修改日期范围: [],
  };

  // 处理删除
  const del = (record) => {
    rmsDeleteFigureData(
      { id: record.id },
      (res) => {
        const { code, data, msg } = res.data;
        if (code === 0 && data) {
          message.success("删除成功");
          query();
        } else {
          message.error(msg);
        }
      },
      () => {
        message.error("删除失败");
      }
    );
  };

  // 表格列定义
  const columns = [
    {
      title: "序号",
      dataIndex: "key",
      key: "key",
      width: 60,
      render: (_, __, index) => index + 1,
    },
    ...[
      "图号",
      "型号",
      "英寸",
      "英寸(mm)",
      "用途",
      "添加人员",
      "添加时间",
      "修改人员",
      "修改时间",
    ].map((item) => ({
      title: item,
      dataIndex: item,
      key: item,
    })),
    {
      title: "启用状态",
      dataIndex: "启用状态",
      key: "启用状态",
      width: 100,
      render: (status) =>
        (status === "已启用" && <Tag color="green">已启用</Tag>) || (
          <Tag color="red">已禁用</Tag>
        ),
    },
    {
      title: "产品备注",
      dataIndex: "产品备注",
      key: "产品备注",
      ellipsis: true,
    },
    {
      title: "操作",
      key: "action",
      width: 120,
      fixed: "right",
      render: (text, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            style={{ padding: 0 }}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="警告"
            description="确认删除该条数据?"
            onConfirm={() => del(record)}
            okText="确认"
            cancelText="取消"
          >
            <Button
              icon={<DeleteOutlined />}
              style={{ padding: 0 }}
              type="link"
              danger
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 修改query函数，添加分页参数
  const query = async () => {
    const values = form.getFieldsValue();
    // 合并分页参数到查询条件中
    const params = {
      ...values,
      page: pagination.current,
      limit: pagination.pageSize,
    };
    setTbLoad(true);
    rmsFilterFigureData(
      params,
      (res) => {
        setTbLoad(false);
        const { data, code, msg } = res.data;
        if (code === 0 && data) {
          const { data_list = [], total = 0 } = data;
          setTbData(data_list);
          // 更新总条数
          setPagination((prev) => ({
            ...prev,
            total,
          }));
        } else {
          message.error(msg);
          setTbData([]);
          setPagination((prev) => ({ ...prev, total: 0 }));
        }
      },
      () => {
        setTbLoad(false);
        setTbData([]);
        setPagination((prev) => ({ ...prev, total: 0 }));
      }
    );
  };

  // 处理表单提交
  const handleFormSubmit = async () => {
    const values = await editForm
      .validateFields()
      .then((res) => res)
      .catch((err) => {
        const { errorFields } = err;
        let err_list = errorFields.map((e) => e.errors);
        message.warning(err_list.join("\n"));
        return false;
      });

    if (!values) return;

    // 设置提交中状态
    setSubmitLoading(true);

    if (editingDrawing) {
      // 更新现有记录
      values["id"] = editingDrawing["id"];
      rmsUpdateFigureData(
        values,
        (res) => {
          // 请求结束后重置加载状态
          setSubmitLoading(false);
          const { data, code, msg } = res.data;
          if (code === 0 && data) {
            message.success("修改成功");
            setIsModalVisible(false);
            query();
          } else {
            message.error(msg);
          }
        },
        () => {
          // 错误情况下也需要重置加载状态
          setSubmitLoading(false);
          message.error("请求失败");
        }
      );
    } else {
      // 添加新记录
      rmsAddFigureData(
        values,
        (res) => {
          // 请求结束后重置加载状态
          setSubmitLoading(false);
          const { data, code, msg } = res.data;
          if (code === 0 && data) {
            message.success("添加成功");
            setIsModalVisible(false);
            query();
          } else {
            message.error(msg);
          }
        },
        () => {
          // 错误情况下也需要重置加载状态
          setSubmitLoading(false);
          message.error("请求失败");
        }
      );
    }
  };

  const handleExport = () => {
    const values = form.getFieldsValue();
    setExportLoading(true);
    rmsExportFigureCsv(
      values,
      (res) => {
        downloadFileBlob(res);
        setExportLoading(false);
      },
      () => {
        message.error("导出失败");
        setExportLoading(false);
      }
    );
  };

  // 重置搜索
  const handleReset = () => {
    form.resetFields();
    setPagination((prev) => ({
      ...prev,
      current: 1,
    }));
  };

  // 显示添加模态框
  const showAddModal = () => {
    setEditingDrawing(null);
    editForm.resetFields();
    setIsModalVisible(true);
  };

  // 处理编辑
  const handleEdit = (record) => {
    setEditingDrawing(record);
    editForm.setFieldsValue(record);
    setIsModalVisible(true);
  };

  // 添加分页变化处理函数
  const handlePageChange = (current, pageSize) => {
    setPagination((prev) => ({
      ...prev,
      current,
      pageSize: pageSize || prev.pageSize,
    }));
  };

  const handleSizeChange = (current, pageSize) => {
    setPagination((prev) => ({
      ...prev,
      current: 1,
      pageSize,
    }));
  };

  // 初始化选项数据
  const initOpt = () => {
    rmsGetFigureOptional((res) => {
      const { code, data, msg } = res.data;
      if (code === 0) {
        setQueryOpt(data);
      }
    });
  };

  // 添加初始化数据和分页联动查询
  useEffect(() => {
    initOpt();
  }, []);

  useEffect(() => {
    query();
  }, [pagination.current, pagination.pageSize]);

  return (
    <div>
      <MyBreadcrumb items={[window.sys_name, "RMS", "坩埚图号管理模块"]} />
      <div className="content_root">
        <Flex vertical gap={16}>
          <Form form={form} layout="inline" initialValues={default_form_data}>
            <Flex gap={16} wrap="wrap">
              <Form.Item label="图号" name="图号">
                <Input placeholder="输入图号" style={{ width: 160 }} />
              </Form.Item>
              <Form.Item label="型号" name="型号">
                <Select
                  allowClear
                  showSearch
                  options={selectList2Option(query_opt["型号"])}
                  style={{ width: 160 }}
                />
              </Form.Item>
              <Form.Item label="用途" name="用途">
                <Select
                  allowClear
                  options={selectList2Option(query_opt["用途"])}
                  style={{ width: 160 }}
                />
              </Form.Item>
              <Form.Item label="启用状态" name="启用状态">
                <Select
                  allowClear
                  options={selectList2Option(query_opt["启用状态"])}
                  style={{ width: 160 }}
                />
              </Form.Item>
              <Form.Item label="添加人员" name="添加人员">
                <Input placeholder="输入添加人员" style={{ width: 160 }} />
              </Form.Item>
              <Form.Item
                label="添加日期范围"
                name="添加日期范围"
                getValueProps={(value) => {
                  return {
                    value: value && value.map((e) => dayjs(e)),
                  };
                }}
                normalize={(value) =>
                  value && value.map((e) => dayjs(e).format(dateFormat))
                }
              >
                <RangePicker style={{ width: 240 }} />
              </Form.Item>

              <Form.Item label="修改人员" name="修改人员">
                <Input placeholder="输入修改人员" style={{ width: 160 }} />
              </Form.Item>

              <Form.Item
                label="修改日期范围"
                name="修改日期范围"
                getValueProps={(value) => {
                  return {
                    value: value && value.map((e) => dayjs(e)),
                  };
                }}
                normalize={(value) =>
                  value && value.map((e) => dayjs(e).format(dateFormat))
                }
              >
                <RangePicker style={{ width: 240 }} />
              </Form.Item>
              <Button type="primary" icon={<SearchOutlined />} onClick={query}>
                搜索
              </Button>
              <Button onClick={handleReset} icon={<ReloadOutlined />}>
                重置
              </Button>
              <Button
                type="primary"
                onClick={showAddModal}
                icon={<PlusOutlined />}
              >
                添加图号
              </Button>
              <Button
                onClick={handleExport}
                icon={<ExportOutlined />}
                loading={exportLoading}
              >
                导出数据
              </Button>
            </Flex>
          </Form>
          <Table
            size="small"
            bordered
            columns={columns}
            dataSource={tb_data}
            rowKey="id"
            loading={tb_load}
            scroll={{ x: "max-content" }}
            pagination={{
              ...pagination,
              position: ["bottomCenter"],
              showTotal: (total) => `共 ${total} 条`,
              showQuickJumper: true,
              showSizeChanger: true,
              onChange: handlePageChange,
              onShowSizeChange: handleSizeChange,
            }}
          />
        </Flex>
      </div>

      <Modal
        title={editingDrawing ? "编辑坩埚图号" : "添加坩埚图号"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleFormSubmit}
        width={700}
        confirmLoading={submitLoading}
      >
        <Spin spinning={submitLoading} tip="提交中...">
          <Form
            form={editForm}
            initialValues={{
              图号: "",
              型号: "",
              英寸: "",
              "英寸(mm)": "",
              用途: "",
              产品备注: "",
              添加人员: "",
              添加时间: "",
              修改人员: "",
              修改时间: "",
            }}
            {...ComputeFormCol(6)}
          >
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Form.Item
                  label="图号"
                  name="图号"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="请输入图号" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="型号"
                  name="型号"
                  rules={[{ required: true }]}
                >
                  <Select options={selectList2Option(query_opt["型号"])} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="英寸"
                  name="英寸"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="请输入英寸" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="英寸(mm)" name="英寸(mm)">
                  <Input placeholder="请输入英寸(mm)" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="用途"
                  name="用途"
                  rules={[{ required: true }]}
                >
                  <Select options={selectList2Option(query_opt["用途"])} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="启用状态"
                  name="启用状态"
                  rules={[{ required: true }]}
                >
                  <Select
                    allowClear
                    options={selectList2Option(query_opt["启用状态"])}
                  />
                </Form.Item>
              </Col>

              {editingDrawing && (
                <>
                  <Col span={12}>
                    <Form.Item label="添加人员" name="添加人员">
                      <Input disabled />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="添加时间" name="添加时间">
                      <Input disabled />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="修改人员" name="修改人员">
                      <Input disabled />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="修改时间" name="修改时间">
                      <Input disabled />
                    </Form.Item>
                  </Col>
                </>
              )}
              <Col span={24}>
                <Form.Item
                  label="产品备注"
                  name="产品备注"
                  {...ComputeFormCol(3)}
                >
                  <Input.TextArea rows={3} placeholder="请输入产品备注" />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Spin>
      </Modal>
    </div>
  );
};

export default CrucibleFigureCodeManagement;

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
  Space,
  message,
  Row,
  Col,
  Spin,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ReloadOutlined,
  ExportOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { MyBreadcrumb } from "../../../../components/CommonCard";
import { Flex } from "antd";
import { dateFormat, selectList2Option } from "../../../../utils/string";
import { Popconfirm } from "antd";
import { ComputeFormCol, downloadFileBlob } from "../../../../utils/obj";
import {
  rmsAddMoldData,
  rmsDeleteMoldData,
  rmsFilterMoldData,
  rmsUpdateMoldData,
  rmsGetMoldOptional,
  rmsExportMoldCsv,
} from "../../../../apis/anls_api";

const { RangePicker } = DatePicker;
const { TextArea } = Input;

// 2. 在状态管理部分添加submitLoading状态
const CrucibleMoldManagement = () => {
  // 状态管理
  const [tb_data, setTbData] = useState([]);
  const [tb_load, setTbLoad] = useState(false);
  const [editingModel, setEditingModel] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [exportLoading, setExportLoading] = useState(false);
  // 添加分页状态
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  // 添加query_opt状态管理选项数据
  const [query_opt, setQueryOpt] = useState({
    规格: [],
    已到状态: ["已到", "未到"],
    是否出库: ["是", "否"],
  });
  // 添加提交加载状态
  const [submitLoading, setSubmitLoading] = useState(false);
  // 选项数据
  // 删除硬编码的选项数组
  const default_form_data = {
    规格: "",
    图号: "",
    模具编号: "",
    已到状态: "",
    是否出库: "",
    添加人员: "",
    添加日期范围: [],
    修改人员: "",
    修改日期范围: [],
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
      "规格",
      "图号",
      "外高",
      "内高",
      "内径上",
      "内径中",
      "内径下",
      "模具编号",
      "加工数",
      "网塞孔上",
      "网塞孔下",
      "添加人员",
      "添加时间",
      "修改人员",
      "修改时间",
      "备注",
      "已到状态",
      "是否出库",
    ].map((item) => ({
      title: item,
      dataIndex: item,
      key: item,
    })),
    {
      title: "操作",
      key: "action",
      width: 100,
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

  // 删除方法
  const del = (record) => {
    rmsDeleteMoldData(
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

  // 处理表单提交
  const handleOk = async () => {
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

    if (editingModel) {
      // 更新现有记录
      values["id"] = editingModel["id"];
      rmsUpdateMoldData(
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
      rmsAddMoldData(
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

  // 搜索方法 - 添加分页参数
  const query = async () => {
    const values = form.getFieldsValue();
    // 合并分页参数到查询条件中
    const params = {
      ...values,
      page: pagination.current,
      limit: pagination.pageSize,
    };
    setTbLoad(true);
    rmsFilterMoldData(
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

  // 分页变化处理函数
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

  const handleExport = () => {
    const values = form.getFieldsValue();
    setExportLoading(true);
    rmsExportMoldCsv(
      values,
      (res) => {
        setExportLoading(false);
        downloadFileBlob(res);
      },
      () => {
        setExportLoading(false);
        message.error("导出失败");
      }
    );
  };

  // 显示添加模态框
  const showAddModal = () => {
    setEditingModel(null);
    editForm.resetFields();
    setIsModalVisible(true);
  };

  // 处理编辑
  const handleEdit = (record) => {
    setEditingModel(record);
    editForm.setFieldsValue(record);
    setIsModalVisible(true);
  };

  // 添加初始化选项数据的函数
  const initOpt = () => {
    rmsGetMoldOptional((res) => {
      const { code, data, msg } = res.data;
      if (code === 0) {
        setQueryOpt(data);
      }
    });
  };

  // 组件挂载时初始化选项数据
  useEffect(() => {
    initOpt();
  }, []);

  // 初始加载和分页变化时重新查询
  useEffect(() => {
    query();
  }, [pagination.current, pagination.pageSize]);

  return (
    <div>
      <MyBreadcrumb items={[window.sys_name, "RMS", "坩埚模具管理模块"]} />
      <div className="content_root">
        <Flex vertical gap={16}>
          <Form form={form} layout="inline" initialValues={default_form_data}>
            <Flex gap={16} wrap="wrap">
              <Form.Item label="规格" name="规格">
                <Select
                  allowClear
                  options={selectList2Option(query_opt["规格"])}
                  style={{ width: 120 }}
                />
              </Form.Item>
              <Form.Item label="图号" name="图号">
                <Input placeholder="输入图号" style={{ width: 160 }} />
              </Form.Item>
              <Form.Item label="模具编号" name="模具编号">
                <Input placeholder="输入模具编号" style={{ width: 120 }} />
              </Form.Item>
              <Form.Item label="已到状态" name="已到状态">
                <Select
                  allowClear
                  options={selectList2Option(query_opt["已到状态"])}
                  style={{ width: 120 }}
                />
              </Form.Item>
              <Form.Item label="是否出库" name="是否出库">
                <Select
                  allowClear
                  options={selectList2Option(query_opt["是否出库"])}
                  style={{ width: 120 }}
                />
              </Form.Item>
              <Form.Item label="添加人员" name="添加人员">
                <Input placeholder="输入添加人员" style={{ width: 120 }} />
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
                <Input placeholder="输入修改人员" style={{ width: 120 }} />
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
              <Button
                onClick={() => {
                  form.resetFields();
                  setPagination((prev) => ({
                    ...prev,
                    current: 1,
                  }));
                }}
                icon={<ReloadOutlined />}
              >
                重置
              </Button>
              <Button
                type="primary"
                onClick={showAddModal}
                icon={<PlusOutlined />}
              >
                添加模具
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
        title={editingModel ? "编辑坩埚模具" : "添加坩埚模具"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleOk}
        width={800}
        destroyOnHidden
        confirmLoading={submitLoading}
      >
        <Spin spinning={submitLoading} tip="提交中...">
          <Form
            form={editForm}
            initialValues={{
              规格: "",
              已到状态: "",
              是否出库: "",
              备注: "",
              图号: "",
              外高: "",
              内高: "",
              模具编号: "",
              内径上: "",
              内径中: "",
              内径下: "",
              网塞孔上: "",
              网塞孔下: "",
              加工数: "",
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
                  label="规格"
                  name="规格"
                  rules={[{ required: true }]}
                >
                  <Select options={selectList2Option(query_opt["规格"])} />
                </Form.Item>
              </Col>
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
                  label="已到状态"
                  name="已到状态"
                  rules={[{ required: true }]}
                >
                  <Select options={selectList2Option(query_opt["已到状态"])} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="是否出库"
                  name="是否出库"
                  rules={[{ required: true }]}
                >
                  <Select options={selectList2Option(query_opt["是否出库"])} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="外高"
                  name="外高"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="请输入外高" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="内高"
                  name="内高"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="请输入内高" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="模具编号"
                  name="模具编号"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="请输入模具编号" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="内径上"
                  name="内径上"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="请输入内径上" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="内径中"
                  name="内径中"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="请输入内径中" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="内径下"
                  name="内径下"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="请输入内径下" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="网塞孔上"
                  name="网塞孔上"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="请输入网塞孔上" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="网塞孔下"
                  name="网塞孔下"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="请输入网塞孔下" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="加工数"
                  name="加工数"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="请输入加工数" />
                </Form.Item>
              </Col>
              {editingModel && (
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
                <Form.Item label="备注" name="备注" {...ComputeFormCol(3)}>
                  <TextArea rows={3} placeholder="请输入备注" />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Spin>
      </Modal>
    </div>
  );
};

export default CrucibleMoldManagement;

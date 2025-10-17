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
  rmsAddModelData,
  rmsDeleteModelData,
  rmsExportModelCsv,
  rmsFilterModelData,
  rmsGetModelOptional,
  rmsUpdateModelData,
} from "../../../../apis/anls_api";

const { RangePicker } = DatePicker;

// 1. 在组件顶部状态管理中添加分页相关状态
// 1. 在组件顶部状态管理中添加导出加载状态
const CrucibleModelManagement = () => {
  // 状态管理
  const [tb_data, setTbData] = useState([]);
  const [tb_load, setTbLoad] = useState(false);
  // 添加分页状态
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [editingModel, setEditingModel] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [query_opt, setQueryOpt] = useState({
    涂层: ["无涂层", "内涂层", "外涂层", "外涂层掺钡", "内外涂层喷钡"],
    洗净线: ["天然线", "合成线"],
    产品类别: ["石墨坩埚", "陶瓷坩埚", "石英坩埚", "金属坩埚"],
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  // 添加导出加载状态
  const [exportLoading, setExportLoading] = useState(false);
  const default_form_data = {
    型号: "",
    产品类别: "",
    涂层: "",
    洗净线: "",
    添加人员: "",
    添加日期范围: [],
    修改人员: "",
    修改日期范围: [],
  };
  const del = (record) => {
    rmsDeleteModelData(
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
      "型号",
      "产品类别",
      "涂层",
      "洗净线",
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
      values["id"] = editingModel["id"];
      rmsUpdateModelData(
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
      rmsAddModelData(
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

  // 2. 修改query函数，添加分页参数
  const query = async () => {
    const values = form.getFieldsValue();
    // 合并分页参数到查询条件中
    const params = {
      ...values,
      page: pagination.current,
      limit: pagination.pageSize,
    };
    setTbLoad(true);
    rmsFilterModelData(
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

  // 3. 添加分页变化处理函数
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
  // 2. 修改handleExport函数，添加加载状态管理
  const handleExport = () => {
    const values = form.getFieldsValue();
    setExportLoading(true);
    rmsExportModelCsv(
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
  const initOpt = () => {
    rmsGetModelOptional((res) => {
      const { code, data, msg } = res.data;
      if (code === 0) {
        setQueryOpt(data);
      }
    });
  };
  useEffect(() => {
    initOpt();
  }, []);
  useEffect(() => {
    query();
  }, [pagination.current, pagination.pageSize]);

  return (
    <div>
      <MyBreadcrumb items={[window.sys_name, "RMS", "坩埚型号管理模块"]} />
      <div className="content_root">
        <Flex vertical gap={16}>
          <Form form={form} layout="inline" initialValues={default_form_data}>
            <Flex gap={16} wrap="wrap">
              <Form.Item label="型号" name="型号">
                <Input placeholder="输入型号" style={{ width: 160 }} />
              </Form.Item>
              <Form.Item label="产品类别" name="产品类别">
                <Select
                  allowClear
                  options={selectList2Option(query_opt["产品类别"])}
                  style={{ width: 160 }}
                />
              </Form.Item>
              <Form.Item label="涂层" name="涂层">
                <Select
                  allowClear
                  options={selectList2Option(query_opt["涂层"])}
                  style={{ width: 160 }}
                />
              </Form.Item>
              <Form.Item label="洗净线" name="洗净线">
                <Select
                  allowClear
                  options={selectList2Option(query_opt["洗净线"])}
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
                添加型号
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
        title={editingModel ? "编辑坩埚型号" : "添加坩埚型号"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleOk}
        width={800}
        destroyOnHidden
      >
        <Spin spinning={submitLoading} tip="提交中...">
          <Form
            form={editForm}
            initialValues={{
              型号: "",
              涂层: "",
              产品类别: "",
              洗净线: "",
              型号说明: "",
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
                  label="型号"
                  name="型号"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="请输入型号" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="产品类别"
                  name="产品类别"
                  rules={[{ required: true }]}
                >
                  <Select options={selectList2Option(query_opt["产品类别"])} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="涂层"
                  name="涂层"
                  rules={[{ required: true }]}
                >
                  <Select options={selectList2Option(query_opt["涂层"])} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="洗净线"
                  name="洗净线"
                  rules={[{ required: true }]}
                >
                  <Select options={selectList2Option(query_opt["洗净线"])} />
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
                <Form.Item
                  label="型号说明"
                  name="型号说明"
                  rules={[{ required: true }]}
                  {...ComputeFormCol(3)}
                >
                  <Input.TextArea rows={3} placeholder="请输入型号说明" />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Spin>
      </Modal>
    </div>
  );
};

export default CrucibleModelManagement;

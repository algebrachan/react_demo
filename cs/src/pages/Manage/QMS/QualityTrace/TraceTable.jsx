import React, {useState, useEffect} from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  message,
  Card,
  Space,
  Tag
} from 'antd';
import {
  EditOutlined,
  EyeOutlined
} from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';
import InitiateTrace from '@/pages/Manage/QMS/QualityTrace/InitiateTrace.jsx'

const API_BASE_URL = 'http://10.37.15.10:9125/api/quality-traces-tpm/api';
// const API_BASE_URL = 'http://127.0.0.1:8000/api';
const {Option} = Select;
const {TextArea} = Input;
const TraceTable = () => {
  const [traces, setTraces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTrace, setSelectedTrace] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [initModalOpen, setInitModalOpen] = useState(false);
  const [form] = Form.useForm();
  // 获取所有质量跟踪记录
  const fetchTraces = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/quality-traces`);
      setTraces(response.data);
    } catch (error) {
      message.error('获取质量跟踪记录失败');
      console.error('获取质量跟踪记录失败:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchTraces();
  }, []);
  // 打开编辑模态框
  const handleEdit = (record) => {
    setSelectedTrace(record);
    form.setFieldsValue({
      temporary_measures: record.temporary_measures || '',
      final_quality: record.final_quality || '',
      is_direct_cause: record.is_direct_cause,
      cause_explanation: record.cause_explanation || '',
      quality_confirmer: record.quality_confirmer || ''
    });
    setIsModalVisible(true);
  };
  // 提交更新
  const handleUpdate = async (values) => {
    try {
      const updateData = {
        temporary_measures: values.temporary_measures,
        final_quality: values.final_quality,
        is_direct_cause: values.is_direct_cause,
        cause_explanation: values.cause_explanation,
        quality_confirmer: values.quality_confirmer
      };
      // 修复API路径，确保使用正确的端点
      await axios.put(`${API_BASE_URL}/quality-traces/${selectedTrace.id}`, updateData);
      message.success('质量跟踪更新成功');
      setIsModalVisible(false);
      setSelectedTrace(null);
      form.resetFields();
      fetchTraces(); // 刷新列表
    } catch (error) {
      message.error('更新质量跟踪失败');
      console.error('更新质量跟踪失败:', error.response?.data || error.message);
    }
  };
  const columns = [
    {
      title: '质量跟踪编号',
      dataIndex: 'trace_number',
      key: 'trace_number',
      width: 150,
    },
    {
      title: '产品编号',
      dataIndex: 'product_number',
      key: 'product_number',
      width: 120,
    },
    {
      title: '产品名称',
      dataIndex: 'product_name',
      key: 'product_name',
      width: 150,
    },
    {
      title: '投产日期',
      dataIndex: 'production_date',
      key: 'production_date',
      width: 120,
      render: (date) => dayjs(date).format('YYYY-MM-DD')
    },
    {
      title: '提出工序',
      dataIndex: 'process',
      key: 'process',
      width: 120,
    },
    {
      title: '提出人',
      dataIndex: 'proposer',
      key: 'proposer',
      width: 100,
    },
    {
      title: '状态',
      key: 'status',
      width: 100,
      render: (_, record) => (
        <Tag color={record.quality_confirmer ? 'green' : 'orange'}>
          {record.quality_confirmer ? '已完成' : '待处理'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleEdit(record)}
          >
            查看
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            disabled={!!record.quality_confirmer}
          >
            编辑
          </Button>
        </Space>
      ),
    },
  ];
  return (
    <div style={{padding: '24px'}}>
      <Card title="质量跟踪表" extra={(
        <>
          <Button style={{marginRight: 8}} onClick={() => setInitModalOpen(true)}>发起追溯</Button>
          <Button onClick={fetchTraces}>刷新</Button>
        </>
      )}>
        <Table
          columns={columns}
          dataSource={traces}
          rowKey="id"
          loading={loading}
          pagination={{pageSize: 10}}
          scroll={{x: 1000}}
        />
      </Card>
      <Modal
        title={'发起追溯'}
        open={initModalOpen}
        width={1200}
        footer={null}
        onCancel={() => setInitModalOpen(false)}
      >
        <InitiateTrace></InitiateTrace>
      </Modal>
      {/* 编辑模态框 */}
      <Modal
        title={`质量跟踪 - ${selectedTrace?.trace_number}`}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setSelectedTrace(null);
          form.resetFields();
        }}
        footer={null}
        width={800}
        maskClosable={false}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdate}
        >
          <Form.Item label="质量跟踪编号">
            <Input value={selectedTrace?.trace_number} disabled />
          </Form.Item>
          <Form.Item label="产品编号">
            <Input value={selectedTrace?.product_number} disabled />
          </Form.Item>
          <Form.Item label="产品名称">
            <Input value={selectedTrace?.product_name} disabled />
          </Form.Item>
          <Form.Item label="投产日期">
            <DatePicker
              value={selectedTrace?.production_date ? dayjs(selectedTrace.production_date) : null}
              disabled
              style={{width: '100%'}}
            />
          </Form.Item>
          <Form.Item label="提出工序">
            <Input value={selectedTrace?.process} disabled />
          </Form.Item>
          <Form.Item label="现象描述">
            <TextArea
              rows={3}
              value={selectedTrace?.phenomenon_description}
              disabled
            />
          </Form.Item>
          <Form.Item label="影响质量因素">
            <TextArea
              rows={3}
              value={selectedTrace?.quality_factors}
              disabled
            />
          </Form.Item>
          <Form.Item
            label="临时措施"
            name="temporary_measures"
            rules={[{required: true, message: '请输入临时措施'}]}
          >
            <TextArea rows={3} placeholder="请输入临时措施" />
          </Form.Item>
          <Form.Item
            label="最终产品质量"
            name="final_quality"
            rules={[{required: true, message: '请输入最终产品质量'}]}
          >
            <Input placeholder="请输入最终产品质量" />
          </Form.Item>
          <Form.Item
            label="是否直接原因"
            name="is_direct_cause"
            rules={[{required: true, message: '请选择是否直接原因'}]}
          >
            <Select placeholder="请选择是否直接原因">
              <Option value={true}>是</Option>
              <Option value={false}>否</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="直接原因说明"
            name="cause_explanation"
            rules={[
              {required: true, message: '请输入直接原因说明'},
              ({getFieldValue}) => ({
                validator(_, value) {
                  if (getFieldValue('is_direct_cause') === false && !value) {
                    return Promise.reject(new Error('当选择"否"时，必须填写直接原因说明'));
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <TextArea rows={3} placeholder="请输入直接原因说明" />
          </Form.Item>
          <Form.Item
            label="质量确认人"
            name="quality_confirmer"
            rules={[{required: true, message: '请输入质量确认人'}]}
          >
            <Input placeholder="请输入质量确认人" />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                提交
              </Button>
              <Button onClick={() => {
                setIsModalVisible(false);
                setSelectedTrace(null);
                form.resetFields();
              }}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
export default TraceTable;

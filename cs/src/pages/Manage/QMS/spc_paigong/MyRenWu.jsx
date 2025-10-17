import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Input, 
  Select, 
  DatePicker, 
  Space, 
  Card, 
  Tag, 
  Modal, 
  Form, 
  message,
  Row,
  Col,
  Progress,
  Upload,
  Divider,
  Tabs 
} from 'antd';
import { 
  UploadOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  SearchOutlined,
  ReloadOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { MyBreadcrumb } from "../../../../components/CommonCard";
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;
import {
  get_craft_task,
  my_craft_task,
  take_mission,
  submit_craft_task,
} from "../../../../apis/qms_router";
const SPCPaiGong = ({ onTakeTask ,filteredTasks}) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    status: '',
    priority: '',
    dateRange: null
  });
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [currentWaferData, setCurrentWaferData] = useState([]);
  const [processModalVisible, setProcessModalVisible] = useState(false);
  const [currentProcessRecord, setCurrentProcessRecord] = useState(null);
  const [waferColumns, setWaferColumns] = useState([]);
  const [processForm] = Form.useForm();

const props = {
  name: 'file',
  action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
  headers: {
    authorization: 'authorization-text',
  },
  onChange(info) {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};
  // 优先级标签渲染
  const renderPriority = (priority) => {
    const priorityMap = {
      'high': { color: 'red', text: '高' },
      'medium': { color: 'orange', text: '中' },
      'low': { color: 'green', text: '低' }
    };
    const config = priorityMap[priority] || { color: 'default', text: priority };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  // 状态标签渲染
  const renderStatus = (status) => {
    const statusMap = {
      'pending': { color: 'blue', text: '待开始' },
      'in_progress': { color: 'orange', text: '进行中' },
      'completed': { color: 'green', text: '已完成' },
      'paused': { color: 'default', text: '已暂停' }
    };
    const config = statusMap[status] || { color: 'default', text: status };
    return <Tag color={config.color}>{config.text}</Tag>;
  };





  const columns = [
    {
      title: '订单编号',
      dataIndex: 'order_number',
      key: 'order_number',
    },
    {
      title: '任务名称',
      dataIndex: 'task_name',
      key: 'task_name',
    },
    {
      title: '晶体编号',
      dataIndex: 'crystal',
      key: 'crystal',
    },
    {
      title: '创建时间',
      dataIndex: 'create_at',
      key: 'create_at',
    },
    {
      title: '检查类型',
      dataIndex: 'inspection_type',
      key: 'inspection_type',
    },
    // {
    //   title: '优先级',
    //   dataIndex: 'priority',
    //   key: 'priority',
    //   width: 80,
    //   render: renderPriority
    // },
    // {
    //   title: '状态',
    //   dataIndex: 'status',
    //   key: 'status',
    //   width: 100,
    //   render: renderStatus
    // },
    // {
    //   title: '进度',
    //   dataIndex: 'progress',
    //   key: 'progress',
    //   width: 120,
    //   render: (progress) => (
    //     <Progress 
    //       percent={progress} 
    //       size="small" 
    //       status={progress === 100 ? 'success' : 'active'}
    //     />
    //   )
    // },
    // {
    //   title: '计划完成时间',
    //   dataIndex: 'planEndTime',
    //   key: 'planEndTime',
    //   width: 140,
    // },
    {
      title: '操作',
      key: 'action',
      width: 50,
      render: (_, record) => (
        <Space size="small">
           <Button 
            type="link" 
            onClick={() => {
              setWaferColumns(record.wafer_columns||[])
              setCurrentWaferData(record.wafer_data || []);
              setDetailModalVisible(true);
            }}
          >
          详情
          </Button>|
          <Button 
            type="link" 
            onClick={() => {
              setCurrentProcessRecord(record);
              setProcessModalVisible(true);
              // 初始化表单数据
              processForm.setFieldsValue({
                order_number: record.order_number,
                crystal: record.crystal,
                start_time: record.create_at,
                completed_count: record.wafer_data?.length || 0,
                exception_count: 0,
                exception_type: '',
                exception_wafer: '',
                exception_reason: '',
                exception_suggestion: ''
              });
            }}
          >
            处理
          </Button>
          
        </Space>
      ),
    },
  ];



  return (
    <div style={{ padding: '0px' }}>
        <Table
          columns={columns}
          size='small'
          dataSource={filteredTasks}
          rowKey="id"
          loading={loading}
          pagination={{
            total: filteredTasks.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 个任务`
          }}
        />
        <Modal
          title="晶圆数据详情"
          open={detailModalVisible}
          onCancel={() => setDetailModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setDetailModalVisible(false)}>
              关闭
            </Button>
          ]}
          width={800}
        >
          <Table
            columns={waferColumns}
            dataSource={currentWaferData}
            rowKey="id"
            size="small"
            pagination={false}
          />
        </Modal>

        {/* 提交任务结果弹窗 */}
        <Modal
          title="提交任务结果"
          open={processModalVisible}
          onCancel={() => {
            setProcessModalVisible(false);
            processForm.resetFields();
          }}
          onOk={() => {
            processForm.validateFields().then(values => {
              console.log('弹窗内容:', values);
              submit_craft_task({ "order_number": values.order_number||'',
  "exception_type": values.exception_type||'',
  "specific_reason":values.specific_reason||'',
},res=>{
                if(res.data.code==0){
    message.success(res.data.msg);
              setProcessModalVisible(false);
              processForm.resetFields();
             onTakeTask()
                }else{
                    message.error(res.data.msg);
                }
       

              })
           
            }).catch(info => {
              console.log('验证失败:', info);
            });
          }}
          width={600}
          okText="提交"
          cancelText="取消"
        >
          <Form
            form={processForm}
            layout="vertical"
            style={{ marginTop: 16 }}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="订单编号"
                  name="order_number"
                >
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="晶体编号"
                  name="crystal"
                >
                  <Input disabled />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="片开始时间"
                  name="start_time"
                >
                  <Input disabled />
                </Form.Item>
              </Col>
            </Row>
            
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="完成数量"
                  name="completed_count"
                >
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="异常数量"
                  name="exception_count"
                >
                  <Input disabled />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="次要异常类型"
                  name="exception_type"
                  rules={[{ required: true, message: '请输入次要异常类型' }]}
                >
                  <Input placeholder="请输入次要异常类型" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="异常晶圆编号"
                  name="order_number"
                  rules={[{ required: true, message: '请输入异常晶圆编号' }]}
                >
                  <Input placeholder="请输入异常晶圆编号" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  label="具体异常原因"
                  name="specific_reason"
                  rules={[{ required: true, message: '请输入具体异常原因' }]}
                >
                  <Input.TextArea 
                    rows={3} 
                    placeholder="请输入具体异常原因" 
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  label="异常处理建议"
                  name="exception_suggestion"
                >
                  <Input.TextArea 
                    rows={3} 
                    disabled
                    placeholder="请输入异常处理建议" 
                  />
                </Form.Item>
              </Col>
            </Row>
             <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  label="异常处理建议"
                  name="exception_suggestion"
                >
                 <Upload {...props} disabled>
    <Button disabled icon={<UploadOutlined />}>上传检测报告</Button>
  </Upload>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
        </div>
  )
};

export default SPCPaiGong;

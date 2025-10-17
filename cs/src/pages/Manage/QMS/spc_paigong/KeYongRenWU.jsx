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
  Statistic,
  Divider,
  Tabs 
} from 'antd';
import { 
  PlusOutlined, 
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
  const [waferColumns, setWaferColumns] = useState([]);

  // 初始化数据

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
              if (onTakeTask) {
                onTakeTask(record);
              }
            }}
          >
            接取
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
        </div>
  )
};

export default SPCPaiGong;

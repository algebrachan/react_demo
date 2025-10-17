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
import MyRenWu from './MyRenWu.jsx'
import KeYongRenWU from './KeYongRenWU.jsx'
const { RangePicker } = DatePicker;
const { Option } = Select;
import {
  get_craft_task,
  my_craft_task,
  take_mission,
  submit_craft_task,
} from "../../../../apis/qms_router";
import { set } from 'lodash';
const SPCPaiGong = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [activeTabKey, setActiveTabKey] = useState('1');

  const [searchParams, setSearchParams] = useState({
    keyword: '',
    status: '',
    priority: '',
    dateRange: null
  });
  useEffect(() => {
getTable1()
  }, []);

  const getTable1=()=>{
    get_craft_task({},(res)=>{
      setFilteredTasks(res.data.data.statistics)
      setTableData(res.data.data.available_tasks_list)
    setActiveTabKey('1')
    })
  }
    const getTable2=()=>{
    my_craft_task({},(res)=>{
      setTableData(res.data.data)
      setActiveTabKey('2')
    })
  }

  const onChange = key => {
if(key==2){
getTable2()
}else{
getTable1()
}
  };

  // 处理接取任务
  const handleTakeTask = (taskData) => {
    take_mission({order_number:taskData.order_number},(res)=>{
      if(res.data.code==0){
      message.success(res.data.msg)
   getTable2()
      }else{
     message.error(res.data.msg)
      }
    })
  };
  // 处理任务
  const handleTask = (taskData) => {
    setActiveTabKey('2');
    console.log(taskData)
  };
  const items = [
    {
      key: '1',
      label: '可用任务',
      children: <KeYongRenWU onTakeTask={handleTakeTask} filteredTasks={tableData}/>,
    },
    {
      key: '2',
      label: '我的任务',
      children: <MyRenWu filteredTasks={tableData} onTakeTask={getTable2}/>,
    },
  ];



  return (
    <div style={{ padding: '0px' }}>
        <MyBreadcrumb items={[window.sys_name, "派工"]} />
        <div  className="content_root"
        style={{
          display: "flex",
          rowGap: 20,
          flexDirection: "column",
        }}>

        <Row gutter={16} style={{ marginBottom: '20px' }}>
          <Col span={4}>
            <Card size="small">
              <Statistic
                title="总任务数"
                value={filteredTasks.total_tasks}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
               <Col span={5}>
            <Card size="small">
              <Statistic
                title="可用任务"
                value={filteredTasks.available_tasks_count}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
            <Col span={5}>
            <Card size="small">
              <Statistic
                title="已接取任务"
                value={filteredTasks.accepted_tasks_count}
                valueStyle={{ color: '#e3f231' }}
              />
            </Card>
          </Col>
          <Col span={5}>
            <Card size="small">
              <Statistic
                title="已完成"
                value={filteredTasks.finished_tasks_count}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col span={5}>
            <Card size="small">
              <Statistic
                title="异常任务"
                value={filteredTasks.exception_tasks_count}
                valueStyle={{ color: '#ff7a45' }}
              />
            </Card>
          </Col>
         
        </Row>

        {/* <Card size="small" style={{ marginBottom: '20px' }}>
          <Row gutter={16}>
            <Col span={6}>
              <Input
                placeholder="搜索订单号/产品名称/执行人"
                value={searchParams.keyword}
                onChange={(e) => setSearchParams({...searchParams, keyword: e.target.value})}
                prefix={<SearchOutlined />}
              />
            </Col>
            <Col span={4}>
              <Select
                placeholder="状态"
                value={searchParams.status}
                onChange={(value) => setSearchParams({...searchParams, status: value})}
                style={{ width: '100%' }}
                allowClear
              >
                <Option value="pending">待开始</Option>
                <Option value="in_progress">进行中</Option>
                <Option value="completed">已完成</Option>
                <Option value="paused">已暂停</Option>
              </Select>
            </Col>
            <Col span={4}>
              <Select
                placeholder="优先级"
                value={searchParams.priority}
                onChange={(value) => setSearchParams({...searchParams, priority: value})}
                style={{ width: '100%' }}
                allowClear
              >
                <Option value="high">高</Option>
                <Option value="medium">中</Option>
                <Option value="low">低</Option>
              </Select>
            </Col>
            <Col span={6}>
              <RangePicker
                value={searchParams.dateRange}
                onChange={(dates) => setSearchParams({...searchParams, dateRange: dates})}
                style={{ width: '100%' }}
              />
            </Col>
            <Col span={4}>
              <Space>
                <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
                  搜索
                </Button>
                <Button icon={<ReloadOutlined />} onClick={handleReset}>
                  重置
                </Button>
              </Space>
            </Col>
          </Row>
        </Card> */}
        <Tabs activeKey={activeTabKey} items={items} onChange={onChange} />
       
    </div>
        </div>
  );
};

export default SPCPaiGong;

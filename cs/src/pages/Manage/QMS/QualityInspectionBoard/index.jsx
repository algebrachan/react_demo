import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Input, 
  InputNumber,
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
  Tabs,
  Spin,
  Alert
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
  CheckCircleOutlined,
  DashboardOutlined,
  BarChartOutlined,
  CheckSquareOutlined,
  TrophyOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { MyBreadcrumb } from "../../../../components/CommonCard";
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import {
  get_real_time_panel,
  get_inspection_DetailsTable,
  get_error_pareto,
  get_qualified_chart,
} from "../../../../apis/qms_router";
import PieChart from './PieChart';
import ParetoChart from './ParetoChart';
import StackedChart from './StackedChart';

const { RangePicker } = DatePicker;
const { Option } = Select;

const ShuJuKanBan = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [chartLoading, setChartLoading] = useState(false);
  const [realTimeData, setRealTimeData] = useState({});
  const [inspectionTableData, setInspectionTableData] = useState([]);
  const [timeRange, setTimeRange] = useState([dayjs().subtract(7, 'day'), dayjs()]);
  const [chartData, setChartData] = useState({});
  const [stackedData, setStackedData] = useState({});
  const [period, setPeriod] = useState('周');
  const [num, setNum] = useState(4);

  useEffect(() => {
    getMianBan();
    getMianBanTable();
    getBingTuHeZhuZhuangTu();
    getDuiDeiTu();
  }, []);

  const getMianBan = () => {
    setLoading(true);
    get_real_time_panel({}, res => {
      if (res.data.code == 0) {
        setRealTimeData(res.data.data.real_time_panel_data || {});
      } else {
        message.error('获取数据失败');
      }
      setLoading(false);
    });
  };
const getMianBanTable=()=>{
    get_inspection_DetailsTable({}, res => {
      if (res.data.code == 0) {
        setInspectionTableData(res.data.data.inspectionDetailsTable || []);
      } else {
        message.error('获取数据失败');
      }
      setLoading(false);
    })
}
const getBingTuHeZhuZhuangTu = () => {
  if (!timeRange || timeRange.length !== 2) {
    message.warning('请选择时间范围');
    return;
  }
  
  setChartLoading(true);
  const params = {
    time: [
      timeRange[0].format('YYYY-MM-DD HH:mm:ss'),
      timeRange[1].format('YYYY-MM-DD HH:mm:ss')
    ]
  };
  
  get_error_pareto(params, res => {
    if (res.data.code == 0) {
      setChartData(res.data.data.errorParetoTable || {});
    } else {
      message.error('获取图表数据失败');
    }
    setChartLoading(false);
  });
};

const getDuiDeiTu = () => {
  setChartLoading(true);
  const params = {
    period: period,
    num: num
  };
  
  get_qualified_chart(params, res => {
    if (res.data.code == 0) {
      setStackedData(res.data.data || {});
    } else {
      message.error('获取堆叠图表数据失败');
    }
    setChartLoading(false);
  });
};

  // 表格列配置
  const columns = [
    {
      title: '物料类别',
      dataIndex: '物料类别',
      key: '物料类别',
      align: 'center',
    },
    {
      title: '已检验批次',
      dataIndex: '已检验批次',
      key: '已检验批次',
      align: 'center',
      render: (value) => (
        <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#1890ff' }}>
          {value}
        </span>
      ),
    },
    {
      title: '合格批次',
      dataIndex: '合格批次',
      key: '合格批次',
      align: 'center',
      render: (value) => (
        <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#52c41a' }}>
          {value}
        </span>
      ),
    },
    {
      title: '不合格批次',
      dataIndex: '不合格批次',
      key: '不合格批次',
      align: 'center',
      render: (value) => (
        <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#ff4d4f' }}>
          {value}
        </span>
      ),
    },
    {
      title: '合格率',
      dataIndex: '合格率',
      key: '合格率',
      align: 'center',
      render: (rate) => {
        let color = '#52c41a';
        if (rate < 80) color = '#ff4d4f';
        else if (rate < 95) color = '#faad14';
        
        return (
          <div style={{ padding: '0 20px' }}>
            <Progress
              percent={rate}
              format={() => `${rate}%`}
              strokeColor={color}
              style={{ width: '100%' }}
            />
          </div>
        );
      },
    },
  ];



 

 return (
    <div style={{ padding: '0px' }}>
      <MyBreadcrumb items={[window.sys_name, "数据看板"]} />
      <div className="content_root" style={{
        display: "flex",
        rowGap: 20,
        flexDirection: "column",
      }}>
        
        <Row gutter={16} style={{ marginBottom: '20px' }}>
          <Col span={5}>
            <Card size="small" style={{ borderRadius: '8px' }}>
              <Statistic
                title="合格率"
                value={realTimeData['合格率'] || 0}
                precision={2}
                suffix="%"
                valueStyle={{ color: '#52c41a', fontSize: '28px' }}
                prefix={<TrophyOutlined style={{ color: '#52c41a' }} />}
              />
            </Card>
          </Col>
          
          <Col span={5}>
            <Card size="small" style={{ borderRadius: '8px' }}>
              <Statistic
                title="进料批次"
                value={realTimeData['进料批次'] || 0}
                valueStyle={{ color: '#1890ff', fontSize: '28px' }}
                prefix={<DashboardOutlined style={{ color: '#1890ff' }} />}
              />
            </Card>
          </Col>
          
          <Col span={5}>
            <Card size="small" style={{ borderRadius: '8px' }}>
              <Statistic
                title="已检批次"
                value={realTimeData['已检批次'] || 0}
                valueStyle={{ color: '#722ed1', fontSize: '28px' }}
                prefix={<BarChartOutlined style={{ color: '#722ed1' }} />}
              />
            </Card>
          </Col>
          
          <Col span={4}>
            <Card size="small" style={{ borderRadius: '8px' }}>
              <Statistic
                title="合格批次"
                value={realTimeData['合格批次'] || 0}
                valueStyle={{ color: '#13c2c2', fontSize: '28px' }}
                prefix={<CheckSquareOutlined style={{ color: '#13c2c2' }} />}
              />
            </Card>
          </Col>
          
          <Col span={5}>
            <Card size="small" style={{ borderRadius: '8px' }}>
              <Statistic
                title="检验达成率"
                value={realTimeData['检验达成率'] || 0}
                precision={2}
                suffix="%"
                valueStyle={{ color: '#fa8c16', fontSize: '28px' }}
                prefix={<CheckCircleOutlined style={{ color: '#fa8c16' }} />}
              />
            </Card>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Card 
            size="small"
            title={'检验详情'}
              extra={
                <Button 
                  type="primary" 
                  icon={<ReloadOutlined />} 
                  onClick={getMianBan}
                  loading={loading}
                >
                  刷新数据
                </Button>
              }
              style={{ borderRadius: '8px' }}
            >
              <Table
                columns={columns}
                size='small'
                dataSource={inspectionTableData}
                rowKey="物料类别"
                pagination={false}
                bordered
                style={{
                  background: 'white',
                }}
                rowClassName={(record, index) => 
                  index % 2 === 0 ? 'table-row-light' : 'table-row-dark'
                }
              />
            </Card>
          </Col>
        </Row>

        {/* 时间范围数据分析 */}
        <Row gutter={16}>
          <Col span={24}>
            <Card 
              title="时间范围数据分析"
              size='small'
              style={{ borderRadius: '8px' }}
            >
              <Row gutter={16} style={{ marginBottom: '20px' }}>
                <Col span={6}>
                  <RangePicker
                    value={timeRange}
                    onChange={setTimeRange}
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    placeholder={['开始日期', '结束日期']}
                    style={{ width: '100%' }}
                  />
                </Col>
                <Col span={2}>
                  <Button 
                    type="primary" 
                    onClick={getBingTuHeZhuZhuangTu}
                    loading={chartLoading}
                  >
                    查询
                  </Button>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={8}>
                  <PieChart data={chartData} loading={chartLoading} />
                </Col>
                <Col span={16}>
                  <ParetoChart data={chartData} loading={chartLoading} />
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
     {/* 时间范围数据分析 */}
        <Row gutter={16}>
          <Col span={24}>
            <Card 
              title="检验数量和合格趋势"
              size='small'
              style={{ borderRadius: '8px' }}
            >
              <Row gutter={16} style={{ marginBottom: '20px' }}>
                <Col span={3}>
                  <Select
                    value={period}
                    onChange={setPeriod}
                    placeholder="选择时间周期"
                    style={{ width: '100%' }}
                  >
                    <Option value="周">周</Option>
                    <Option value="月">月</Option>
                    <Option value="年">年</Option>
                  </Select>
                </Col>
                <Col span={2}>
                  <InputNumber
                    value={num}
                    onChange={setNum}
                    placeholder="输入数量"
                    min={1}
                    max={100}
                    style={{ width: '100%' }}
                  />
                </Col>
                <Col span={2}>
                  <Button 
                    type="primary" 
                    onClick={getDuiDeiTu}
                    loading={chartLoading}
                  >
                    查询
                  </Button>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={24}>
                {/* 堆叠柏拉图组件 */}
                <StackedChart data={stackedData} loading={chartLoading} />
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

      </div>
    </div>
  );

}

export default ShuJuKanBan;

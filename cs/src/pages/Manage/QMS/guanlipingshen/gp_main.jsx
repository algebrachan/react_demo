import React, { useState, useMemo, useEffect } from 'react';
import { 
  Input, 
  Button, 
  Table, 
  Form, 
  DatePicker, 
  Select, 
  Checkbox, 
  Row, 
  Col, 
  Tag, 
  Modal, 
  message 
} from 'antd';
import { 
  SearchOutlined,
  DownloadOutlined,
  PrinterOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  FileTextOutlined,
  CheckOutlined,
  ReloadOutlined,
  CloseOutlined
} from '@ant-design/icons';
import { MyBreadcrumb } from '@/components/CommonCard';
import dayjs from 'dayjs';
import './gp_main.less';
import {nick_name,review_plan,review_plan_put,review_plan_delete,get_review_plan,file_management} from '../../../../apis/qms_router'
import { use } from 'react';
import GpB01 from './gp_B01';
import GpB01Report from './gp_B01_report';
import GpE01 from './gp_E01';
const { TextArea } = Input;
const { Option } = Select;

export default function GpMain() {
  const [currentView, setCurrentView] = useState('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [cur, setCur] = useState(1);
  const [page_size, setPageSize] = useState(10);
  const [tb_total, setTbTotal] = useState(2);
  const [form] = Form.useForm();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedRowData, setSelectedRowData] = useState(null);
const [cardData, setCardData]=useState({length:0})
  const [plans, setPlans] = useState([
 
  
  ]);

  const [formData, setFormData] = useState({
    id: null,
    number: '',
    version: 'V2.0',
    review_date: '',
    location: '',
    presenter: '',
    reviewer: [],
    review_purpose: '',
    review_basis: [],
    review_content: [
      { department_person: '', key_points: '', process: '', remarks: '' }
    ]
  });
const [assessorOptions,setAssessorOptions]=useState([]);
  
  const criteriaOptions = [
    { value: 'customer', label: '顾客及相关方需求和期望' },
    { value: 'environment', label: '内、外部环境' },
    { value: 'iatf', label: 'IATF 16949' },
    { value: 'manual', label: '质量手册' },
    { value: 'procedures', label: '程序文件' },
    { value: 'regulations', label: '相关法律、法规及标准要求' },
    { value: 'business', label: '经营计划和目标' }
  ];

  const processOptions = [
    { value: 'C1', label: 'C1 产品和服务要求的确定过程' },
    { value: 'C2', label: 'C2 设计和开发过程' },
    { value: 'C3', label: 'C3 产品生产过程' },
    { value: 'C4', label: 'C4 交付过程' },
    { value: 'C5', label: 'C5 顾客服务和投诉处理过程' },
    { value: 'C6', label: 'C6 变更管理过程' },
    { value: 'M1', label: 'M1 经营计划管理' },
    { value: 'M2', label: 'M2 质量体系管理过程' },
    { value: 'M3', label: 'M3 管理评审过程' },
    { value: 'M4', label: 'M4 改进管理过程' },
    { value: 'S1', label: 'S1 人力资源管理过程' },
    { value: 'S2', label: 'S2 采购管理过程' },
    { value: 'S3', label: 'S3 基础设施和环境管理过程' },
    { value: 'S4', label: 'S4 监视和测量设备管理过程' },
    { value: 'S5', label: 'S5 检验和试验控制过程' },
    { value: 'S6', label: 'S6 不合格品控制过程' },
    { value: 'S7', label: 'S7 文件和记录控制过程' }
  ];

  const filteredPlans = useMemo(() => {
    if (!searchQuery) return plans;
    const query = searchQuery.toLowerCase();
    return plans.filter(plan =>
      plan.number.toLowerCase().includes(query) ||
      plan.presenter.toLowerCase().includes(query) ||
      plan.location.toLowerCase().includes(query)
    );
  }, [plans]);

  const formTitle = useMemo(() => {
    return formData.id ? '编辑管理评审计划' : '新增管理评审计划';
  }, [formData.id]);

  // 分页配置
  const pagination = () => {
    return {
      current: cur,
      pageSize: page_size,
      position: ["bottomCenter"],
      total: tb_total,
      showTotal: (total) => `共 ${total} 条`,
      showQuickJumper: true,
      showSizeChanger: true,
      pageSizeOptions: ['10', '20', '50', '100'],
      onChange: (page, pageSize) => {
        setCur(page);
        setPageSize(pageSize);
        loadReviewPlans(); // 分页时重新加载数据
      },
    };
  };
useEffect(() => {
  nick_name({},res=>{
    setAssessorOptions(res.data.data)
  })
  // 初始化时加载数据
  loadReviewPlans();
},[])

// 加载管理评审计划数据
const loadReviewPlans = () => {
  setLoading(true);
  const params = {
    // page: cur,
    // page_size: page_size,
    number: searchQuery
  };
  
  get_review_plan(params, res => {
    if (res.data && res.data.code == 200) {
      setPlans(res.data.data.data || []);
      setCardData(res.data.data)
      setTbTotal(res.data.length || 0);
    } else {
      message.error('加载数据失败');
    }
    setLoading(false);
  }, err => {
    message.error('网络请求失败');
    setLoading(false);
  });
};

// 查询按钮点击事件
const handleSearch = () => {
  setCur(1); // 重置到第一页
  loadReviewPlans();
};
  const showForm = () => {
    resetForm();
    setCurrentView('form');
  };

  const editPlan = (plan) => {
    const editData = {
      id: plan.id,
      number: plan.number,
      version: plan.version,
      review_date: plan.review_date,
      location: plan.location,
      presenter: plan.presenter,
      reviewer: plan.reviewer || [],
      review_purpose: plan.review_purpose,
      review_basis: plan.review_basis || [],
      review_content: plan.review_content || [
        { department_person: '', key_points: '', process: '', remarks: '' }
      ]
    };
    
    setFormData(editData);
    form.setFieldsValue({
      number: plan.number,
      version: plan.version,
      reviewTime: plan.review_date ? dayjs(plan.review_date) : null,
      location: plan.location,
      presenter: plan.presenter,
      reviewer: plan.reviewer || [],
      review_purpose: plan.review_purpose,
      review_basis: plan.review_basis || [],
    });
    setCurrentView('form');
  };

  const deletePlan = (plan) => {
    Modal.confirm({
      title: '提示',
      content: '确定要删除该管理评审计划吗?',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        review_plan_delete({ id: plan.id }, res => {
          if (res.data && res.data.code === 200) {
            message.success('删除成功');
            loadReviewPlans(); // 重新加载数据
          } else {
            message.error(res.data?.message || '删除失败');
          }
        }, err => {
          message.error('网络请求失败');
        });
      }
    });
  };

  const handlePlan = (plan) => {
    setSelectedPlan(plan);
    setCurrentView('fileManagement');
    // 调用file_management接口获取文件数据
    file_management({ id: plan.id }, res => {
      if (res.data && res.data.code === 200) {
        // 文件数据获取成功，可以在这里处理返回的数据
        console.log('文件管理数据:', res.data.data);
      } else {
        message.error('获取文件数据失败');
      }
    }, err => {
      message.error('网络请求失败');
    });
  };

  const handleReport = (record) => {
    setSelectedRowData(record);
    setCurrentView('report');
  };

  const handleTrack = (record) => {
    setSelectedRowData(record);
    setCurrentView('track');
  };

  const addReviewItem = () => {
    setFormData(prev => ({
      ...prev,
      review_content: [...prev.review_content, { department_person: '', key_points: '', process: '', remarks: '' }]
    }));
  };

  const removeReviewItem = (index) => {
    if (formData.review_content.length > 1) {
      setFormData(prev => ({
        ...prev,
        review_content: prev.review_content.filter((_, i) => i !== index)
      }));
    } else {
      message.warning('至少需要保留一个评审项');
    }
  };

  const updateContentItem = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      review_content: prev.review_content.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const submitForm = () => {
    form.validateFields().then(values => {
      const submitData = {
        number: values.number,
        version: values.version,
        review_date: values.reviewTime ? values.reviewTime.format('YYYY-MM-DD') : '',
        location: values.location,
        presenter: values.presenter,
        reviewer: values.reviewer || [],
        review_purpose: values.review_purpose,
        review_basis: values.review_basis || [],
        review_content: formData.review_content
      };

      // 如果是编辑模式，添加id参数
      if (formData.id) {
        submitData.id = formData.id;
        // 调用编辑接口
        review_plan_put(submitData, res => {
          if (res.data && res.data.code === 200) {
            message.success('编辑成功');
            setCurrentView('list');
            loadReviewPlans(); // 重新加载数据
          } else {
            message.error(res.data?.message || '编辑失败');
          }
        }, err => {
          message.error('网络请求失败');
        });
      } else {
        // 调用新增接口
        review_plan(submitData, res => {
          if (res.data && res.data.code === 200) {
            message.success('新增成功');
            setCurrentView('list');
            loadReviewPlans(); // 重新加载数据
          } else {
            message.error(res.data?.message || '新增失败');
          }
        }, err => {
          message.error('网络请求失败');
        });
      }
    }).catch(() => {
      message.error('请填写完整表单');
    });
  };

  const resetForm = () => {
    const initialData = {
      id: null,
      number: '',
      version: 'V2.0',
      review_date: '',
      location: '',
      presenter: '',
      reviewer: [],
      review_purpose: '',
      review_basis: [],
      review_content: [
        { department_person: '', key_points: '', process: '', remarks: '' }
      ]
    };
    setFormData(initialData);
    form.resetFields();
  };

  const refreshData = () => {
    loadReviewPlans();
    message.success('数据已刷新');
  };

  const columns = [
    {
      title: '编号',
      dataIndex: 'number',
      width: 180,
    },
    {
      title: '评审时间',
      dataIndex: 'review_date',
      width: 120,
    },
    {
      title: '评审地点',
      dataIndex: 'location',
      width: 120,
    },
    {
      title: '主持人',
      dataIndex: 'presenter',
      width: 120,
    },
    {
      title: '评审人员',
      dataIndex: 'reviewer',
      width: 200,
      render: (reviewer) => (
        <div className="gp-main-tag-group">
          {(reviewer || []).map((person, index) => (
            <Tag key={index} size="small" color="blue">
              {person}
            </Tag>
          ))}
        </div>
      )
    },
    {
      title: '评审依据',
      dataIndex: 'review_basis',
       
      render: (review_basis) => (
        <div className="gp-main-criteria-list">
          {(review_basis || []).map((item, index) => (
            <div key={index} className="gp-main-criteria-item">
              <CheckOutlined style={{ color: '#67c23a', marginRight: '8px' }} />
              {item}
            </div>
          ))}
        </div>
      )
    },
    {
      title: '评审项数',
      dataIndex: 'review_content',
      width: 90,
      align: 'center',
      render: (review_content) => (review_content || []).length
    },
    {
      title: '操作',
      width: 200,
      align: 'center',
      fixed: 'right',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <Button
            size="small"
            type="primary"
            icon={<FileTextOutlined />}
            onClick={() => handlePlan(record)}
          >
            支撑文件
          </Button>
           <Button
            size="small"
            type="primary"
            icon={<FileTextOutlined />}
            onClick={() => handleReport(record)}
          >
           管评报告
          </Button>
            <Button
            size="small"
            type="primary"
            icon={<FileTextOutlined />}
            onClick={() => handleTrack(record)}
          >
            改进跟踪
          </Button>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => editPlan(record)}
          >
            管理计划
          </Button>
          <Button
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => deletePlan(record)}
          />
        </div>
      )
    }
  ];

  const contentColumns = [
    {
      title: '序号',
      width: 60,
      align: 'center',
      render: (_, __, index) => index + 1
    },
    {
      title: '部门/负责人',
      dataIndex: 'department_person',
      render: (text, record, index) => (
        <Input
          value={text}
          onChange={(e) => updateContentItem(index, 'department_person', e.target.value)}
          placeholder="输入部门/负责人"
        />
      )
    },
    {
      title: '评审输入要点',
      dataIndex: 'key_points',
      render: (text, record, index) => (
        <TextArea
          value={text}
          onChange={(e) => updateContentItem(index, 'key_points', e.target.value)}
          rows={2}
          placeholder="输入评审要点"
        />
      )
    },
    {
      title: '过程',
      dataIndex: 'process',
      width: 200,
      render: (text, record, index) => (
        <Select
          value={text}
          onChange={(value) => updateContentItem(index, 'process', value)}
          placeholder="选择过程"
          style={{ width: '100%' }}
        >
          {processOptions.map(item => (
            <Option key={item.value} value={item.value}>{item.label}</Option>
          ))}
        </Select>
      )
    },
    {
      title: '备注',
      dataIndex: 'remarks',
      render: (text, record, index) => (
        <Input
          value={text}
          onChange={(e) => updateContentItem(index, 'remarks', e.target.value)}
          placeholder="输入备注"
        />
      )
    },
    {
      title: '操作',
      width: 80,
      align: 'center',
      render: (_, __, index) => (
        <Button
          type="primary"
          danger
          icon={<DeleteOutlined />}
          shape="circle"
          size="small"
          onClick={() => removeReviewItem(index)}
        />
      )
    }
  ];

  return (
    <div>
      <MyBreadcrumb items={[window.sys_name, "QMS", "管理评审"]} />
      <div className="content_root">
        <div id="gp-main-app">
          <div className="gp-main-app-container">
            {/* 列表视图 */}
            {currentView === 'list' && (
              <div>
                <div className="gp-main-search-container">
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="输入编号、主持人或地点进行搜索"
                    allowClear
                    style={{ width: 350, marginRight: 15 }}
                    suffix={<SearchOutlined />}
                   
                  />
                  <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
                    查询
                  </Button>
                  {/* <Button type="default" icon={<DownloadOutlined />}>
                    导出数据
                  </Button> */}
               
                  <Button type="primary" icon={<PlusOutlined />} onClick={showForm}>
                    新增计划
                  </Button>
                </div>

                <div className="gp-main-stat-card">
                  <div className="gp-main-stat-item">
                    <div className="gp-main-stat-label">总计划数</div>
                    <div className="gp-main-stat-value">{cardData.length||0}</div>
                  </div>
                  <div className="gp-main-stat-item">
                    <div className="gp-main-stat-label">本月新增</div>
                    <div className="gp-main-stat-value">{cardData.current_month_length||0}</div>
                  </div>
                  <div className="gp-main-stat-item">
                    <div className="gp-main-stat-label">待执行</div>
                    <div className="gp-main-stat-value">{cardData.run_length||0}</div>
                  </div>
                  <div className="gp-main-stat-item">
                    <div className="gp-main-stat-label">已完成</div>
                    <div className="gp-main-stat-value">{cardData.finish_length||0}</div>
                  </div>
                </div>

                <div className="gp-main-card">
                  <div className="gp-main-card-header">
                    <span>管理评审计划列表</span>
                    <div>
                      <Tag color="success">共 {filteredPlans.length} 条记录</Tag>
                    </div>
                  </div>
                  <div className="gp-main-card-body">
                    {filteredPlans.length === 0 ? (
                      <div className="gp-main-empty-table">
                        <FileTextOutlined style={{ fontSize: 60, color: '#c0c4cc', marginBottom: 15 }} />
                        <p>暂无管理评审计划数据</p>
                        <Button type="primary" onClick={showForm} style={{ marginTop: 15 }}>
                          创建新计划
                        </Button>
                      </div>
                    ) : (
                      <Table
                        dataSource={filteredPlans}
                        columns={columns}
                        rowKey="id"
                        bordered
                        loading={loading}
                        scroll={{ x: 'max-content' }}
                        pagination={pagination()}
                      />
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 表单视图 */}
            {currentView === 'form' && (
              <div>
                <div className="gp-main-header">
                  <h1>{formTitle}</h1>
                  <div className="gp-main-header-actions">
                    <Button onClick={() => setCurrentView('list')}>返回列表</Button>
                  </div>
                </div>

                <div className="gp-main-form-container">
                  <Form
                    form={form}
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 18 }}
                    onValuesChange={(changedValues, allValues) => {
                      setFormData(prev => ({ ...prev, ...changedValues }));
                    }}
                  >
                    <div className="gp-main-form-section">
                      <div className="gp-main-form-section-header">基本信息</div>
                      <div className="gp-main-form-section-body">
                        <Row gutter={20} style={{ marginBottom: '16px' }}>
                          <Col span={12}>
                            <Form.Item
                              label="编号"
                              name="number"
                              rules={[{ required: true, message: '请输入编号' }]}
                            >
                              <Input placeholder="例如：NXCS/ZY-QD-C/11-BD/01" />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              label="版本"
                              name="version"
                              rules={[{ required: true, message: '请输入版本' }]}
                            >
                              <Input placeholder="例如：V2.0" />
                            </Form.Item>
                          </Col>
                        </Row>

                        <Row gutter={20} style={{ marginBottom: '16px' }}>
                          <Col span={12}>
                            <Form.Item
                              label="评审时间"
                              name="reviewTime"
                              rules={[{ required: true, message: '请选择评审时间' }]}
                            >
                              <DatePicker style={{ width: '100%' }} placeholder="选择日期" />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              label="评审地点"
                              name="location"
                              rules={[{ required: true, message: '请输入评审地点' }]}
                            >
                              <Input placeholder="输入评审地点" />
                            </Form.Item>
                          </Col>
                        </Row>

                        <Row gutter={20} style={{ marginBottom: '16px' }}>
                          <Col span={12}>
                            <Form.Item
                              label="主持人"
                              name="presenter"
                              rules={[{ required: true, message: '请输入主持人' }]}
                            >
                              <Input placeholder="输入主持人姓名" />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              label="评审人员"
                              name="reviewer"
                              rules={[{ required: true, message: '请选择评审人员' }]}
                            >
                              <Select
                                mode="multiple"
                                placeholder="请选择或输入评审人员"
                                style={{ width: '100%' }}
                              >
                                {assessorOptions.map((person, index) => (
                                  <Option key={index} value={person}>{person}</Option>
                                ))}
                              </Select>
                            </Form.Item>
                          </Col>
                        </Row>
                         
                        <Row gutter={20}>
                          <Col span={24}>
                            <Form.Item
                              label="评审目的"
                              name="review_purpose"
                              rules={[{ required: true, message: '请输入评审目的' }]}
                            >
                              <TextArea rows={3} placeholder="输入评审目的" />
                            </Form.Item>
                          </Col>
                        </Row>
                      </div>
                    </div>

                    <div className="gp-main-form-section">
                      <div className="gp-main-form-section-header">评审依据</div>
                      <div className="gp-main-form-section-body">
                        <Form.Item
                          name="review_basis"
                          rules={[{ required: true, message: '请选择评审依据' }]}
                        >
                          <Checkbox.Group style={{ display: 'flex', flexWrap: 'wrap' }}>
                            {criteriaOptions.map(item => (
                              <Checkbox
                                key={item.value}
                                value={item.label}
                                style={{ width: '33%', marginBottom: 15 }}
                              >
                                {item.label}
                              </Checkbox>
                            ))}
                          </Checkbox.Group>
                        </Form.Item>
                      </div>
                    </div>

                    <div className="gp-main-form-section">
                      <div className="gp-main-form-section-header">
                        <span>管理评审内容</span>
                        <Button
                          type="primary"
                          size="small"
                          icon={<PlusOutlined />}
                          onClick={addReviewItem}
                        >
                          添加评审项
                        </Button>
                      </div>
                      <div className="gp-main-form-section-body">
                        <Table
                          dataSource={formData.review_content}
                          columns={contentColumns}
                          rowKey={(record, index) => index}
                          bordered
                          pagination={false}
                        />
                      </div>
                    </div>

                    <div className="gp-main-form-actions">
                      <Button type="primary" onClick={submitForm} icon={<CheckOutlined />} style={{marginRight:16}}>
                        提交
                      </Button>
                      <Button onClick={resetForm} icon={<ReloadOutlined />} style={{marginRight:16}}>
                        重置
                      </Button>
                      <Button onClick={() => setCurrentView('list')} icon={<CloseOutlined />}>
                        取消
                      </Button>
                    </div>
                  </Form>
                </div>
              </div>
            )}

            {/* 文件管理视图 */}
            {currentView === 'fileManagement' && selectedPlan && (
              <div>
                <div className="gp-main-header">
                  <h1>文件管理 - {selectedPlan.number}</h1>
                  <div className="gp-main-header-actions">
                    <Button onClick={() => setCurrentView('list')}>返回列表</Button>
                  </div>
                </div>
                <GpB01 planData={selectedPlan} />
              </div>
            )}

            {/* 报告视图 */}
            {currentView === 'report' && selectedRowData && (
              <div>
                <div className="gp-main-header">
                  <h1>管理评审报告 - {selectedRowData.number}</h1>
                  <div className="gp-main-header-actions">
                    <Button onClick={() => setCurrentView('list')}>返回列表</Button>
                  </div>
                </div>
                <GpB01Report planData={selectedRowData} />
              </div>
            )}

            {/* 跟踪视图 */}
            {currentView === 'track' && selectedRowData && (
              <div>
                <div className="gp-main-header">
                  <h1>管理评审跟踪 - {selectedRowData.number}</h1>
                  <div className="gp-main-header-actions">
                    <Button onClick={() => setCurrentView('list')}>返回列表</Button>
                  </div>
                </div>
                <GpE01 planData={selectedRowData} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
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
import {nick_name,audit_plan_add,audit_plan_put,audit_plan_delete,get_audit_plan_process_audit,file_management} from '../../../../apis/qms_router'
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
    audit_purpose: '',
    audit_scope: '',
    audit_basis: '',
    audit_members: [
      { key: `group_${Date.now()}`, group: '', audit_leader: '', audit_members: [] }
    ],
    audit_plan: [
      { audit_time: '', audit_content: '', audit_person: '' }
    ],
    notes: '',
    prepared: '',
    prepared_date: '',
    final_approved: '',
    final_approved_date: '',
    prepared_item: '',
    prepared_date_item: '',
    countersign_item: '',
    countersign_date_item: '',
    final_approved_item: '',
    final_approved_date_item: ''
  });
const [assessorOptions,setAssessorOptions]=useState([]);
  


  const filteredPlans = useMemo(() => {
    if (!searchQuery) return plans;
    const query = searchQuery.toLowerCase();
    return plans.filter(plan =>
      (plan.audit_purpose && plan.audit_purpose.toLowerCase().includes(query)) ||
      (plan.audit_scope && plan.audit_scope.toLowerCase().includes(query)) ||
      (plan.audit_leader && plan.audit_leader.toLowerCase().includes(query)) ||
      (plan.prepared && plan.prepared.toLowerCase().includes(query))
    );
  }, [plans, searchQuery]);

  const formTitle = useMemo(() => {
    return formData.id ? '编辑过程审核计划' : '新增过程审核计划';
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

// 加载过程审核计划数据
const loadReviewPlans = () => {
  setLoading(true);
  
  get_audit_plan_process_audit({},res => {
    if (res.data && res.data.code == 200) {
      // 标准化数据格式，确保 audit_members 始终是对象数组格式
      const normalizedData = (res.data.data || []).map(plan => ({
        ...plan,
        audit_members: Array.isArray(plan.audit_members) 
          ? plan.audit_members.map(member => {
              // 如果是字符串，转换为标准对象格式
              if (typeof member === 'string') {
                return {
                  key: `group_${Date.now()}_${Math.random()}`,
                  group: '默认组',
                  audit_leader: member,
                  audit_members: []
                };
              }
              // 如果是对象，确保有 key 值
              return {
                ...member,
                key: member.key || `group_${Date.now()}_${Math.random()}`
              };
            })
          : [{ key: `group_${Date.now()}`, group: '', audit_leader: '', audit_members: [] }]
      }));
      
      setPlans(normalizedData);
      setTbTotal(normalizedData.length || 0);
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
      audit_purpose: plan.audit_purpose || '',
      audit_scope: plan.audit_scope || '',
      audit_basis: plan.audit_basis || '',
      audit_members: Array.isArray(plan.audit_members) 
        ? plan.audit_members.map(member => {
            // 如果是字符串，转换为标准对象格式
            if (typeof member === 'string') {
              return {
                key: `group_${Date.now()}_${Math.random()}`,
                group: '默认组',
                audit_leader: member,
                audit_members: []
              };
            }
            // 如果是对象，确保有 key 值
            return {
              ...member,
              key: member.key || `group_${Date.now()}_${Math.random()}`
            };
          })
        : [{ key: `group_${Date.now()}`, group: '', audit_leader: '', audit_members: [] }],
      audit_plan: plan.audit_plan || [
        { audit_time: '', audit_content: '', audit_person: '' }
      ],
      notes: plan.notes || '',
      prepared: plan.prepared || '',
      prepared_date: plan.prepared_date || '',
      final_approved: plan.final_approved || '',
      final_approved_date: plan.final_approved_date || '',
      prepared_item: plan.prepared_item || '',
      prepared_date_item: plan.prepared_date_item || '',
      countersign_item: plan.countersign_item || '',
      countersign_date_item: plan.countersign_date_item || '',
      final_approved_item: plan.final_approved_item || '',
      final_approved_date_item: plan.final_approved_date_item || ''
    };
    
    setFormData(editData);
    form.setFieldsValue({
      audit_purpose: plan.audit_purpose,
      audit_scope: plan.audit_scope,
      audit_basis: plan.audit_basis,
      notes: plan.notes,
      prepared: plan.prepared,
      prepared_date: plan.prepared_date ? dayjs(plan.prepared_date) : null,
      final_approved: plan.final_approved,
      final_approved_date: plan.final_approved_date ? dayjs(plan.final_approved_date) : null,
      prepared_item: plan.prepared_item,
      prepared_date_item: plan.prepared_date_item ? dayjs(plan.prepared_date_item) : null,
      countersign_item: plan.countersign_item,
      countersign_date_item: plan.countersign_date_item ? dayjs(plan.countersign_date_item) : null,
      final_approved_item: plan.final_approved_item,
      final_approved_date_item: plan.final_approved_date_item ? dayjs(plan.final_approved_date_item) : null,
    });
    setCurrentView('form');
  };

  const deletePlan = (plan) => {
    Modal.confirm({
      title: '提示',
      content: '确定要删除该过程审核计划吗?',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        audit_plan_delete({ id: plan.id }, res => {
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

  // 审核组相关函数
  const addAuditGroup = () => {
    setFormData(prev => ({
      ...prev,
      audit_members: [...prev.audit_members, { key: `group_${Date.now()}`, group: '', audit_leader: '', audit_members: [] }]
    }));
  };

  const removeAuditGroup = (index) => {
    if (formData.audit_members.length > 1) {
      setFormData(prev => ({
        ...prev,
        audit_members: prev.audit_members.filter((_, i) => i !== index)
      }));
    } else {
      message.warning('至少需要保留一个审核组');
    }
  };

  const updateAuditGroup = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      audit_members: prev.audit_members.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addAuditPlanItem = () => {
    setFormData(prev => ({
      ...prev,
      audit_plan: [...prev.audit_plan, { audit_time: '', audit_content: '', audit_person: '' }]
    }));
  };

  const removeAuditPlanItem = (index) => {
    if (formData.audit_plan.length > 1) {
      setFormData(prev => ({
        ...prev,
        audit_plan: prev.audit_plan.filter((_, i) => i !== index)
      }));
    } else {
      message.warning('至少需要保留一个审核计划项');
    }
  };

  const updateAuditPlanItem = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      audit_plan: prev.audit_plan.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  // 保存审核组
  const saveAuditGroups = () => {
    // 验证审核组数据
    const hasEmptyGroup = formData.audit_members.some(group => !group.group.trim());
    if (hasEmptyGroup) {
      message.error('请填写所有审核组的组名');
      return;
    }
    message.success('审核组保存成功');
  };

  const submitForm = () => {
    form.validateFields().then(values => {
      const submitData = {
        audit_purpose: values.audit_purpose,
        audit_scope: values.audit_scope,
        audit_basis: values.audit_basis,
        audit_members: formData.audit_members,
        audit_plan: formData.audit_plan,
        notes: values.notes,
        prepared: values.prepared,
        prepared_date: values.prepared_date ? values.prepared_date.format('YYYY-MM-DD') : '',
        final_approved: values.final_approved,
        final_approved_date: values.final_approved_date ? values.final_approved_date.format('YYYY-MM-DD') : '',
        prepared_item: values.prepared_item || '',
        prepared_date_item: values.prepared_date_item ? values.prepared_date_item.format('YYYY-MM-DD') : '',
        countersign_item: values.countersign_item || '',
        countersign_date_item: values.countersign_date_item ? values.countersign_date_item.format('YYYY-MM-DD') : '',
        final_approved_item: values.final_approved_item || '',
        final_approved_date_item: values.final_approved_date_item ? values.final_approved_date_item.format('YYYY-MM-DD') : ''
      };

      // 如果是编辑模式，添加id参数
      if (formData.id) {
        submitData.id = formData.id;
        // 调用编辑接口
        audit_plan_put(submitData, res => {
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
        audit_plan_add(submitData, res => {
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
      audit_purpose: '',
      audit_scope: '',
      audit_basis: '',
      audit_members: [
        { key: `group_${Date.now()}`, group: '', audit_leader: '', audit_members: [] }
      ],
      audit_plan: [
        { audit_time: '', audit_content: '', audit_person: '' }
      ],
      notes: '',
      prepared: '',
      prepared_date: '',
      final_approved: '',
      final_approved_date: '',
      prepared_item: '',
      prepared_date_item: '',
      countersign_item: '',
      countersign_date_item: '',
      final_approved_item: '',
      final_approved_date_item: ''
    };
    setFormData(initialData);
    form.resetFields();
  };



  const columns = [
    {
      title: '审核目的',
      dataIndex: 'audit_purpose',
      width: 200,
      ellipsis: true,
    },
    {
      title: '审核范围',
      dataIndex: 'audit_scope',
      width: 180,
      ellipsis: true,
    },
    {
      title: '审核依据',
      dataIndex: 'audit_basis',
      width: 150,
      ellipsis: true,
    },
    {
      title: '审核组长',
      dataIndex: 'audit_leader',
      width: 120,
    },
    // {
    //   title: '审核人员',
    //   dataIndex: 'audit_members',
    //   width: 200,
    //   render: (audit_members) => (
    //     <div className="gp-main-tag-group">
    //       {(audit_members || []).map((person, index) => (
    //         <Tag key={index} size="small" color="blue">
    //           {person}
    //         </Tag>
    //       ))}
    //     </div>
    //   )
    // },
    {
      title: '审核计划项数',
      dataIndex: 'audit_plan',
      width: 120,
      align: 'center',
      render: (audit_plan) => (audit_plan || []).length
    },
    {
      title: '编制人',
      dataIndex: 'prepared',
      width: 100,
    },
    {
      title: '批准人',
      dataIndex: 'final_approved',
      width: 100,
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
            审核记录
          </Button>
           {/* <Button
            size="small"
            type="primary"
            icon={<FileTextOutlined />}
            onClick={() => handleReport(record)}
          >
            报告
          </Button> */}
            <Button
            size="small"
            type="primary"
            icon={<FileTextOutlined />}
            onClick={() => handleTrack(record)}
          >
            不符合项目
          </Button>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => editPlan(record)}
          >
            审核计划
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

  // 审核组表格列定义
  const auditGroupColumns = [
    {
      title: '序号',
      width: 60,
      align: 'center',
      render: (_, __, index) => index + 1
    },
    {
      title: '组名',
      dataIndex: 'group',
      width: 150,
      render: (text, record, index) => (
        <Input
          value={text}
          onChange={(e) => updateAuditGroup(index, 'group', e.target.value)}
          placeholder="请输入组名"
          style={{ borderColor: !text ? '#ff4d4f' : undefined }}
        />
      )
    },
    {
      title: '审核组长',
      dataIndex: 'audit_leader',
      width: 150,
      render: (text, record, index) => (
        <Select
          value={text}
          onChange={(value) => updateAuditGroup(index, 'audit_leader', value)}
          placeholder="请选择审核组长"
          style={{ width: '100%' }}
          showSearch
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {assessorOptions.map((person, idx) => (
            <Option key={idx} value={person}>{person}</Option>
          ))}
        </Select>
      )
    },
    {
      title: '审核人员',
      dataIndex: 'audit_members',
      render: (text, record, index) => (
        <Select
          mode="multiple"
          value={Array.isArray(text) ? text : []}
          onChange={(value) => updateAuditGroup(index, 'audit_members', value)}
          placeholder="请选择审核人员"
          style={{ width: '100%' }}
          showSearch
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {assessorOptions.map((person, idx) => (
            <Option key={idx} value={person}>{person}</Option>
          ))}
        </Select>
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
          onClick={() => removeAuditGroup(index)}
        />
      )
    }
  ];

  const auditPlanColumns = [
    {
      title: '序号',
      width: 60,
      align: 'center',
      render: (_, __, index) => index + 1
    },
    {
      title: '时间',
      dataIndex: 'audit_time',
      width: 200,
      render: (text, record, index) => (
        <DatePicker
          showTime
          value={text ? dayjs(text) : null}
          onChange={(date) => updateAuditPlanItem(index, 'audit_time', date ? date.format('YYYY-MM-DD HH:mm:ss') : '')}
          placeholder="选择审核时间"
          format="YYYY-MM-DD HH:mm:ss"
          style={{ width: '100%' }}
        />
      )
    },
    {
      title: '审核计划',
      dataIndex: 'audit_content',
      render: (text, record, index) => (
        <TextArea
          value={text}
          onChange={(e) => updateAuditPlanItem(index, 'audit_content', e.target.value)}
          rows={2}
          placeholder="输入审核计划内容"
        />
      )
    },
    {
      title: '审核组',
      dataIndex: 'audit_person',
      width: 150,
      render: (text, record, index) => (
        <Select
          value={text}
          onChange={(value) => updateAuditPlanItem(index, 'audit_person', value)}
          placeholder="请选择审核组"
          style={{ width: '100%' }}
        >
          {formData.audit_members.filter(group => group.group).map((group, idx) => (
            <Option key={idx} value={group.group}>{group.group}</Option>
          ))}
        </Select>
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
          onClick={() => removeAuditPlanItem(index)}
        />
      )
    }
  ];

  return (
    <div>
      <MyBreadcrumb items={[window.sys_name, "QMS", "过程审核"]} />
      <div className="content_root">
        <div id="gp-main-app">
          <div className="gp-main-app-container">
            {/* 列表视图 */}
            {currentView === 'list' && (
              <div>
                <div className="gp-main-search-container">
                  <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
                    查询
                  </Button>
               
                  <Button type="primary" icon={<PlusOutlined />} onClick={showForm}>
                    新增计划
                  </Button>
                </div>
                <div className="gp-main-card">
                  <div className="gp-main-card-header">
                    <span>过程审核列表</span>
                    <div>
                      <Tag color="success">共 {filteredPlans.length} 条记录</Tag>
                    </div>
                  </div>
                  <div className="gp-main-card-body">
                    {filteredPlans.length === 0 ? (
                      <div className="gp-main-empty-table">
                        <FileTextOutlined style={{ fontSize: 60, color: '#c0c4cc', marginBottom: 15 }} />
                        <p>暂无过程审核计划数据</p>
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
                          <Col span={24}>
                            <Form.Item
                              label="审核目的"
                              name="audit_purpose"
                              rules={[{ required: true, message: '请输入审核目的' }]}
                            >
                              <TextArea rows={3} placeholder="输入审核目的" />
                            </Form.Item>
                          </Col>
                        </Row>

                        <Row gutter={20} style={{ marginBottom: '16px' }}>
                          <Col span={24}>
                            <Form.Item
                              label="审核范围"
                              name="audit_scope"
                              rules={[{ required: true, message: '请输入审核范围' }]}
                            >
                              <TextArea rows={3} placeholder="输入审核范围" />
                            </Form.Item>
                          </Col>
                        </Row>

                        <Row gutter={20} style={{ marginBottom: '16px' }}>
                          <Col span={24}>
                            <Form.Item
                              label="审核依据"
                              name="audit_basis"
                              rules={[{ required: true, message: '请输入审核依据' }]}
                            >
                              <TextArea rows={3} placeholder="输入审核依据" />
                            </Form.Item>
                          </Col>
                        </Row>


                      </div>
                    </div>

                    <div className="gp-main-form-section">
                      <div className="gp-main-form-section-header">
                        <span>审核组</span>
                        <div>
                          <Button
                            type="primary"
                            size="small"
                            icon={<PlusOutlined />}
                            onClick={addAuditGroup}
                            style={{ marginRight: 8 }}
                          >
                            添加审核组
                          </Button>
                          <Button
                            type="primary"
                            size="small"
                            onClick={saveAuditGroups}
                          >
                            保存
                          </Button>
                        </div>
                      </div>
                      <div className="gp-main-form-section-body">
                        <Table
                          dataSource={formData.audit_members}
                          columns={auditGroupColumns}
                          rowKey={(record, index) => record.key || index}
                          bordered
                          pagination={false}
                        />
                      </div>
                    </div>

                    <div className="gp-main-form-section">
                      <div className="gp-main-form-section-header">
                        <span>审核计划</span>
                        <Button
                          type="primary"
                          size="small"
                          icon={<PlusOutlined />}
                          onClick={addAuditPlanItem}
                        >
                          添加审核计划项
                        </Button>
                      </div>
                      <div className="gp-main-form-section-body">
                        <Table
                          dataSource={formData.audit_plan}
                          columns={auditPlanColumns}
                          rowKey={(record, index) => index}
                          bordered
                          pagination={false}
                        />
                      </div>
                    </div>

                    <div className="gp-main-form-section">
                      <div className="gp-main-form-section-header">其他信息</div>
                      <div className="gp-main-form-section-body">
                        <Row gutter={20} style={{ marginBottom: '16px' }}>
                          <Col span={24}>
                            <Form.Item
                              label="备注"
                              name="notes"
                            >
                              <TextArea rows={3} placeholder="输入备注信息" />
                            </Form.Item>
                          </Col>
                        </Row>

                        <Row gutter={20} style={{ marginBottom: '16px' }}>
                          <Col span={12}>
                            <Form.Item
                              label="编制"
                              name="prepared"
                              rules={[{ required: true, message: '请输入编制人' }]}
                            >
                              <Input placeholder="输入编制人" />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              label="编制日期"
                              name="prepared_date"
                              rules={[{ required: true, message: '请选择编制日期' }]}
                            >
                              <DatePicker style={{ width: '100%' }} placeholder="选择编制日期" />
                            </Form.Item>
                          </Col>
                        </Row>

                        <Row gutter={20}>
                          <Col span={12}>
                            <Form.Item
                              label="批准"
                              name="final_approved"
                              rules={[{ required: true, message: '请输入批准人' }]}
                            >
                              <Input placeholder="输入批准人" />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              label="批准日期"
                              name="final_approved_date"
                              rules={[{ required: true, message: '请选择批准日期' }]}
                            >
                              <DatePicker style={{ width: '100%' }} placeholder="选择批准日期" />
                            </Form.Item>
                          </Col>
                        </Row>
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
                  <h1>文件管理 - {selectedPlan.audit_purpose}</h1>
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
                  <h1>过程审核报告 - {selectedRowData.audit_purpose}</h1>
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
                  <h1>过程审核跟踪 - {selectedRowData.audit_purpose}</h1>
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
import React, { useState,useEffect  } from 'react';
import { 
  Button, 
  Input, 
  DatePicker, 
  Select, 
  Checkbox, 
  message, 
  Modal ,Card 
} from 'antd';
import { 
  ArrowLeftOutlined, 
  SaveOutlined, 
  RedoOutlined, 
  CloseOutlined,
  PlusCircleOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import { MyBreadcrumb } from '@/components/CommonCard';
import dayjs from 'dayjs';
import './gp_B01_report.less';
import {nick_name,get_review_report,review_report} from '../../../../apis/qms_router'

const { TextArea } = Input;
const { Option } = Select;

export default function GpB01Report({ planData }) {
  const [report, setReport] = useState({
    number: 'NXCS/ZY-QD-C/11-BD/02',
    review_date: '',
    review_location: '',
    host: '',
    top_management: '',
    assessors: [],
    purpose: '',
    criteria: [],
    review_content: [
      { key: 0, review_item: '', current_situation: '', problems_suggestions: '', notes: '' }
    ],
    conclusion: '',
    prepared: '',
    prepared_date: '',
    approved: '',
    approved_date: '',
    final_approved: '',
    final_approved_date: ''
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

  const goBack = () => {
    message.info("返回管理评审计划列表");
  };

  const addReviewItem = () => {
    setReport(prev => ({
      ...prev,
      review_content: [...prev.review_content, {
        key: prev.review_content.length,
        review_item: '',
        current_situation: '',
        problems_suggestions: '',
        notes: ''
      }]
    }));
  };
useEffect(() => {
  nick_name({},res=>{
    setAssessorOptions(res.data.data)
  })
getData()
},[])
const getData=()=>{
  get_review_report({plan_id:planData.id},res=>{  
    if(res.data && res.data.data) {
      const data = res.data.data;
      setReport({
        number: data.number || 'NXCS/ZY-QD-C/11-BD/02',
        review_date: data.review_date || '',
        review_location: data.review_location || '',
        host: data.host || '',
        top_management: data.top_management || '',
        assessors: data.assessors || [],
        purpose: data.purpose || '',
        criteria: data.criteria || [],
        review_content: data.review_content && data.review_content.length > 0 
          ? data.review_content 
          : [{ key: 0, review_item: '', current_situation: '', problems_suggestions: '', notes: '' }],
        conclusion: data.conclusion || '',
        prepared: data.prepared || '',
        prepared_date: data.prepared_date || '',
        approved: data.approved || '',
        approved_date: data.approved_date || '',
        final_approved: data.final_approved || '',
        final_approved_date: data.final_approved_date || ''
      });
    }
  })
}
  const removeReviewItem = (index) => {
    if (report.review_content.length > 1) {
      setReport(prev => ({
        ...prev,
        review_content: prev.review_content.filter((_, i) => i !== index).map((item, i) => ({
          ...item,
          key: i
        }))
      }));
    } else {
      message.warning('至少需要保留一个评审项目');
    }
  };

  const updateReportField = (field, value) => {
    setReport(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateReviewItem = (index, field, value) => {
    setReport(prev => ({
      ...prev,
      review_content: prev.review_content.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const submitReport = () => {
    // 验证必填字段
    if (!report.number) {
      message.error('请填写报告编号');
      return;
    }
    if (!report.review_date) {
      message.error('请选择评审时间');
      return;
    }
    if (!report.review_location) {
      message.error('请填写评审地点');
      return;
    }
    if (!report.host) {
      message.error('请填写主持人');
      return;
    }
    if (!report.top_management) {
      message.error('请填写最高管理者');
      return;
    }
    if (report.assessors.length === 0) {
      message.error('请选择评审人员');
      return;
    }
    if (!report.purpose) {
      message.error('请填写评审目的');
      return;
    }
    if (report.criteria.length === 0) {
      message.error('请选择评审依据');
      return;
    }

    // 验证评审项目
    for (let i = 0; i < report.review_content.length; i++) {
      if (!report.review_content[i].review_item) {
        message.error(`第 ${i+1} 行的评审项目不能为空`);
        return;
      }
    }

    if (!report.conclusion) {
      message.error('请填写管理评审结论');
      return;
    }

    // 提交数据到接口
    const submitData = {
      plan_id: planData.id,
      ...report
    };
    
    review_report(submitData, res => {
        message.success(res.data.msg);
    
    });
  };

  const resetForm = () => {
    Modal.confirm({
      title: '提示',
      content: '确定要重置表单吗？所有输入内容将丢失',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        setReport({
          number: 'NXCS/ZY-QD-C/11-BD/02',
          review_date: '',
          review_location: '',
          host: '',
          top_management: '',
          assessors: [],
          purpose: '',
          criteria: [],
          review_content: [
            { key: 0, review_item: '', current_situation: '', problems_suggestions: '', notes: '' }
          ],
          conclusion: '',
          prepared: '',
          prepared_date: '',
          approved: '',
          approved_date: '',
          final_approved: '',
          final_approved_date: ''
        });
        message.success('表单已重置');
      }
    });
  };

  return (
    <div>
      <div className="content_root">
        <div id="gp-b01-app">
          <div className="gp-container">
            <div className="gp-report-card">
              <div className="gp-card-header">管理评审报告基本信息</div>
              <div className="gp-card-body">
                <div className="gp-info-grid">
                  <div className="gp-info-item">
                    <label className="gp-required">报告编号</label>
                    <Input 
                      value={report.number}
                      onChange={(e) => updateReportField('number', e.target.value)}
                      placeholder="例如: NXCS/ZY-QD-C/11-BD/02"
                    />
                  </div>
                  <div className="gp-info-item">
                    <label className="gp-required">评审时间</label>
                    <DatePicker
                      value={report.review_date ? dayjs(report.review_date) : null}
                      onChange={(date, dateString) => updateReportField('review_date', dateString)}
                      placeholder="选择评审日期"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div className="gp-info-item">
                    <label className="gp-required">评审地点</label>
                    <Input 
                      value={report.review_location}
                      onChange={(e) => updateReportField('review_location', e.target.value)}
                      placeholder="输入评审地点"
                    />
                  </div>
                  <div className="gp-info-item">
                    <label className="gp-required">主持人</label>
                    <Input 
                      value={report.host}
                      onChange={(e) => updateReportField('host', e.target.value)}
                      placeholder="输入主持人姓名"
                    />
                  </div>
                  <div className="gp-info-item">
                    <label className="gp-required">最高管理者</label>
                    <Input 
                      value={report.top_management}
                      onChange={(e) => updateReportField('top_management', e.target.value)}
                      placeholder="输入最高管理者姓名"
                    />
                  </div>
                </div>

                <div className="gp-reviewers">
                  <label className="gp-required">评审人员</label>
                  <Select
                    mode="multiple"
                    value={report.assessors}
                    onChange={(value) => updateReportField('assessors', value)}
                    placeholder="请选择或输入评审人员"
                    style={{ width: '100%' }}
                    allowClear
                  >
                    {assessorOptions.map((person, index) => (
                      <Option key={index} value={person}>{person}</Option>
                    ))}
                  </Select>
                </div>

                <div className="gp-info-item">
                  <label className="gp-required">评审目的</label>
                  <TextArea
                    value={report.purpose}
                    onChange={(e) => updateReportField('purpose', e.target.value)}
                    rows={3}
                    placeholder="输入评审目的"
                  />
                </div>

                <div className="gp-info-item">
                  <label className="gp-required">评审依据</label>
                  <Checkbox.Group 
                    value={report.criteria}
                    onChange={(value) => updateReportField('criteria', value)}
                    style={{ display: 'flex', flexWrap: 'wrap' }}
                  >
                    {criteriaOptions.map((item) => (
                      <Checkbox 
                        key={item.value} 
                        value={item.label}
                        style={{ 
                          width: '33%', 
                          marginBottom: '15px',
                          display: 'flex',
                          alignItems: 'center',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {item.label}
                      </Checkbox>
                    ))}
                  </Checkbox.Group>
                </div>
              </div>
            </div>

            <div className="gp-report-card">
              <div className="gp-card-header">管理评审项目</div>
              <div className="gp-card-body">
                <div className="gp-section-title">评审内容录入</div>
                <p style={{ color: '#606266', marginBottom: '15px' }}>
                  请逐项录入评审内容，带<span style={{ color: '#f56c6c' }}>*</span>为必填项
                </p>

                <table className="gp-review-table">
                  <thead>
                    <tr>
                      <th width="50">序号</th>
                      <th width="250">评审项目 <span style={{ color: '#f56c6c' }}>*</span></th>
                      <th>现状陈述</th>
                      <th>存在的问题及改进的建议</th>
                      <th>备注</th>
                      <th width="50">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.review_content.map((item, index) => (
                      <tr key={index}>
                        <td style={{ textAlign: 'center' }}>{index + 1}</td>
                        <td>
                          <Input 
                            value={item.review_item}
                            onChange={(e) => updateReviewItem(index, 'review_item', e.target.value)}
                            placeholder="输入评审项目"
                          />
                        </td>
                        <td>
                          <TextArea 
                            value={item.current_situation}
                            onChange={(e) => updateReviewItem(index, 'current_situation', e.target.value)}
                            placeholder="输入现状陈述"
                            autoSize={{ minRows: 2, maxRows: 4 }}
                          />
                        </td>
                        <td>
                          <TextArea 
                            value={item.problems_suggestions}
                            onChange={(e) => updateReviewItem(index, 'problems_suggestions', e.target.value)}
                            placeholder="输入问题及改进建议"
                            autoSize={{ minRows: 2, maxRows: 4 }}
                          />
                        </td>
                        <td>
                          <Input 
                            value={item.notes}
                            onChange={(e) => updateReviewItem(index, 'notes', e.target.value)}
                            placeholder="输入备注"
                          />
                        </td>
                        <td className="gp-delete-row" onClick={() => removeReviewItem(index)}>
                          <DeleteOutlined />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <Button 
                  className="gp-add-row-btn" 
                  onClick={addReviewItem}
                  icon={<PlusCircleOutlined />}
                >
                  添加评审项目
                </Button>
              </div>
            </div>

            <div className="gp-report-card">
              <div className="gp-card-header">管理评审结论与审批</div>
              <div className="gp-card-body">
                <div className="gp-conclusion-section">
                  <label className="gp-required">管理评审结论</label>
                  <TextArea 
                    value={report.conclusion}
                    onChange={(e) => updateReportField('conclusion', e.target.value)}
                    placeholder="请输入管理评审结论..."
                    rows={4}
                  />
                </div>

                <div className="gp-approval-section">
                  <div className="gp-approval-item">
                    <label>编制</label>
                    <Input 
                      value={report.prepared}
                      onChange={(e) => updateReportField('prepared', e.target.value)}
                      placeholder="编制人姓名"
                    />
                    <DatePicker
                      value={report.prepared_date ? dayjs(report.prepared_date) : null}
                      onChange={(date, dateString) => updateReportField('prepared_date', dateString)}
                      placeholder="选择日期"
                      style={{ width: '100%', marginTop: '10px' }}
                    />
                  </div>
                  <div className="gp-approval-item">
                    <label>审批</label>
                    <Input 
                      value={report.approved}
                      onChange={(e) => updateReportField('approved', e.target.value)}
                      placeholder="审批人姓名"
                    />
                    <DatePicker
                      value={report.approved_date ? dayjs(report.approved_date) : null}
                      onChange={(date, dateString) => updateReportField('approved_date', dateString)}
                      placeholder="选择日期"
                      style={{ width: '100%', marginTop: '10px' }}
                    />
                  </div>
                  <div className="gp-approval-item">
                    <label>批准</label>
                    <Input 
                      value={report.final_approved}
                      onChange={(e) => updateReportField('final_approved', e.target.value)}
                      placeholder="批准人姓名"
                    />
                    <DatePicker
                      value={report.final_approved_date ? dayjs(report.final_approved_date) : null}
                      onChange={(date, dateString) => updateReportField('final_approved_date', dateString)}
                      placeholder="选择日期"
                      style={{ width: '100%', marginTop: '10px' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="gp-form-actions">
              <Button 
                className="gp-form-btn gp-submit-btn" 
                onClick={submitReport}
                icon={<SaveOutlined />}
                type="primary"
                size="large"
              >
                提交报告
              </Button>
              <Button 
                className="gp-form-btn gp-reset-btn" 
                onClick={resetForm}
                icon={<RedoOutlined />}
                size="large"
              >
                重置表单
              </Button>
            </div>
            <div className="gp-footer">
              <p>© 2023 质量管理评审系统 | 基于 IATF 16949 质量管理体系标准</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
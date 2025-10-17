import React, { useState, useMemo, useEffect } from 'react';
import { Button, Progress, message, Modal, Upload, Card, List } from 'antd';
import { 
  CloudUploadOutlined,
  UploadOutlined,
  CloseOutlined,
  DownloadOutlined,
  DeleteOutlined,
  InboxOutlined
} from '@ant-design/icons';
import './gp_B01.less';
import {file_management,upload_file,download_file,delete_file} from '../../../../apis/qms_router'

export default function GpB01({ planData }) {

  const [departments, setDepartments] = useState([]);
  const [fileManagementData, setFileManagementData] = useState([]);

  const totalDepartments = useMemo(() => departments.length, [departments]);
  
  const totalFiles = useMemo(() => 
    departments.reduce((total, dept) => total + dept.files.length, 0), 
    [departments]
  );
  
  const totalSize = useMemo(() => 
    departments.reduce((total, dept) => {
      return total + dept.files.reduce((size, file) => size + file.size, 0);
    }, 0), 
    [departments]
  );

  // 获取文件管理数据
  const fetchFileManagementData = () => {
    if (planData && planData.id) {
      file_management({ id: planData.id }, res => {
        if (res.data && res.data.code === 200) {
          const managementData = res.data.data || [];
          setFileManagementData(managementData);
          
          // 根据返回的数据创建departments结构
          const departmentsData = managementData.map(item => {
            // 处理文件列表，将file_name和file_path组合
            const files = (item.file_name || []).map((fileName, index) => ({
              name: fileName,
              path: (item.file_path || [])[index] || '',
              size: 0, // 接口未返回文件大小
              date: new Date().toISOString().split('T')[0]
            }));
            
            return {
              id: item.id,
              plan_id: item.plan_id,
              department_person: item.department_person,
              files: files,
              uploading: false,
              uploadProgress: 0
            };
          });
          
          setDepartments(departmentsData);
        } else {
          message.error('获取文件数据失败');
        }
      }, err => {
        message.error('网络请求失败');
      });
    }
  };

  // 当planData变化时，调用file_management接口
  useEffect(() => {
    fetchFileManagementData();
  }, [planData]);



  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const goBack = () => {
    message.info("返回管理评审主页面");
  };

  // 处理文件上传
  const handleUpload = (info, deptIndex) => {
    const { file, fileList } = info;
    const department = departments[deptIndex];
    
    if (file.status === 'uploading') {
      setDepartments(prev => prev.map((dept, index) => 
        index === deptIndex ? { ...dept, uploading: true, uploadProgress: file.percent || 0 } : dept
      ));
    }
    
    if (file.status === 'done') {
      setDepartments(prev => prev.map((dept, index) => 
        index === deptIndex ? { 
          ...dept, 
          uploading: false, 
          uploadProgress: 0
        } : dept
      ));
      message.success(`${file.name} 文件上传成功`);
      // 上传成功后重新获取文件管理数据
      fetchFileManagementData();
    }
    
    if (file.status === 'error') {
      setDepartments(prev => prev.map((dept, index) => 
        index === deptIndex ? { ...dept, uploading: false, uploadProgress: 0 } : dept
      ));
      message.error(`${file.name} 文件上传失败`);
    }
  };

  // 自定义上传请求
  const customUpload = async (options, deptIndex) => {
    const { file, onSuccess, onError, onProgress } = options;
    const department = departments[deptIndex];
    
    try {
      const formData = new FormData();
      formData.append('files', file);
      // formData.append('id', department.id);
      
      // 调用upload_file接口
      upload_file({id:department.id},formData, 
        (res) => {
          if (res.data && res.data.code === 200) {
            onSuccess(res.data, file);
          } else {
            onError(new Error('上传失败'));
          }
        },
        (err) => {
          onError(err);
        },
        (progressEvent) => {
          if (progressEvent.lengthComputable) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress({ percent: percentCompleted });
          }
        }
      );
    } catch (error) {
      onError(error);
    }
  };

  const downloadFile1 = (deptIndex, fileIndex) => {
    const file = departments[deptIndex].files[fileIndex];
    if (!file.path) {
      message.error('文件路径不存在，无法下载');
      return;
    }
    
    download_file({ path: file.path }, res => {
      const { url } = res.data.data;
          window.open(url, "_blank");
    }, err => {
      message.error('下载请求失败');
    });
  };

  const deleteFile = (deptIndex, fileIndex) => {
    const file = departments[deptIndex].files[fileIndex];
    if (!file.path) {
      message.error('文件路径不存在，无法删除');
      return;
    }
    
    Modal.confirm({
      title: '提示',
      content: `确定要删除文件 "${file.name}" 吗?`,
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        delete_file({ path: file.path,id: departments[deptIndex].id}, res => {
          if (res.data && res.data.code === 200) {
            message.success('文件已删除');
            // 删除成功后重新获取文件管理数据
            fetchFileManagementData();
          } else {
            message.error('文件删除失败');
          }
        }, err => {
          message.error('删除请求失败');
        });
      }
    });
  };

  return (
    <div>
      <div className="content_root">
        <div id="gp-b01-app">
          <div className="gp-b01-container">
            <div className="gp-b01-stats">
              <div className="gp-b01-stat-card">
                <div className="gp-b01-stat-value">{totalDepartments}</div>
                <div className="gp-b01-stat-label">涉及部门</div>
              </div>
              <div className="gp-b01-stat-card">
                <div className="gp-b01-stat-value">{totalFiles}</div>
                <div className="gp-b01-stat-label">文件总数</div>
              </div>
              {/* <div className="gp-b01-stat-card">
                <div className="gp-b01-stat-value">{formatFileSize(totalSize)}</div>
                <div className="gp-b01-stat-label">总文件大小</div>
              </div> */}
            </div>

            <div className="gp-b01-department-grid">
              {departments.map((dept, index) => (
                <div key={dept.id || index} className="gp-b01-department-card">
                  <div className="gp-b01-card-header">
                    <h3>{dept.department_person}</h3>
                  </div>
                  <div className="gp-b01-card-body">
                    <div className="gp-b01-file-list">
                      {dept.files.length === 0 ? (
                        <div className="gp-b01-no-files">
                          <CloudUploadOutlined />
                          <p>暂无上传文件</p>
                        </div>
                      ) : (
                        dept.files.map((file, fileIndex) => (
                          <div key={fileIndex} className="gp-b01-file-item">
                            <div className="gp-b01-file-info">
                              <div className="gp-b01-file-name">{file.name}</div>
                            </div>
                            <div className="gp-b01-file-actions">
                              <Button 
                                type="text" 
                                size="small"
                                icon={<DownloadOutlined />}
                                onClick={() => downloadFile1(index, fileIndex)}
                              >
                                下载
                              </Button>
                              <Button 
                                type="text" 
                                size="small"
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => deleteFile(index, fileIndex)}
                              >
                                移除
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    <Upload.Dragger
                      name="files"
                      multiple
                      customRequest={(options) => customUpload(options, index)}
                      onChange={(info) => handleUpload(info, index)}
                      showUploadList={false}
                      className="gp-b01-upload-dragger"
                    >
                      <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                      </p>
                      <p className="ant-upload-text">点击或拖拽文件到此处上传</p>
                      <p className="ant-upload-hint">支持单个或批量上传</p>
                    </Upload.Dragger>

                    {dept.uploading && (
                      <div className="gp-b01-progress-section">
                        <Progress 
                          percent={dept.uploadProgress} 
                          strokeWidth={16} 
                          status="active"
                        />
                        <p style={{ textAlign: 'center', marginTop: '8px', color: '#5f6368' }}>
                          上传中... {dept.uploadProgress}%
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>


            <div className="gp-b01-footer">
              <p>© 2023 管理评审文件管理系统 | 基于 IATF 16949 质量管理体系</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
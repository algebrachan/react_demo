import {MyBreadcrumb} from '@/components/CommonCard/index.jsx'
import {Button, Card, Flex, message, Modal, Popconfirm} from 'antd'
import {Outlet} from 'react-router-dom'
import React, {useEffect, useRef, useState} from 'react'
import styles from './index.module.less'
import SystemAuditItem from '@/pages/Manage/QMS/AuditManagement/SchemeManagement/SystemAuditItem/index.jsx'
import ProcessAuditItem from '@/pages/Manage/QMS/AuditManagement/SchemeManagement/ProcessAuditItem/index.jsx'
import ProductAuditItem from '@/pages/Manage/QMS/AuditManagement/SchemeManagement/ProductAuditItem/index.jsx'
import SchemeForm from '@/pages/Manage/QMS/AuditManagement/SchemeManagement/SchemeForm/index.jsx'
import {PlusOutlined, SearchOutlined, DeleteOutlined} from '@ant-design/icons'
import {create_audit_plan, delete_audit_plan, read_audit_plan, update_audit_plan} from '../../../../../apis/qms_router.jsx'
import {cloneDeep} from 'lodash'

const SystemAudit = () => {
  const [open, setOpen] = React.useState(false);
  const [auditSchemeList, setAuditSchemeList] = useState([])
  const [auditSchemeData, setAuditSchemeData] = useState({})
  const [isEdit, setIsEdit] = useState(false)
  const [isDisabled, setIsDisabled] = useState(false)
  const schemeForm = useRef(null)
  const defaultSchemePlanData = {
    audit_plan_name: '',
    criteria_methods: [],
    system: {
      document: '',
      purpose: '',
      scope: '',
      first_time: {
        audit_time: '',
        duties: []
      },
      second_time: {
        audit_time: '',
        duties: []
      }
    },
    product: {
      document: '',
      purpose: '',
      scope: '',
      audit_time: '',
      customer_product: []
    },
    process: {
      document: '',
      purpose: '',
      scope: '',
      audit_time: '',
      process_product: []
    }
  }
  const handleOk = () => {
    const nowData = schemeForm.current.getFieldsValue()
    if (isEdit) {
      update_audit_plan(nowData, (res) => {
        getSchemeList()
        setOpen(false);
        message.success('修改成功')
      })
    } else {
      create_audit_plan(nowData, (res) => {
        getSchemeList()
        setOpen(false);
        message.success('新增成功')
      })
    }
  };
  const handleDel = (row) => {
    const {id} = row
    delete_audit_plan({id}, () => {
      getSchemeList()
      message.success('删除成功')
    })
  }
  const getSchemeList = () => {
    read_audit_plan(null, ({data: {data}}) => {
      setAuditSchemeList(data)
    })
  }
  useEffect(() => {
    getSchemeList()
  }, []);
  useEffect(() => {
    if (open) {
    }
  }, [open]);
  return (
    <div>
      <MyBreadcrumb items={[window.sys_name, "方案管理"]} />
      <div className="content_root">
        <div className={styles['scheme_container']}>
          {auditSchemeList.map((item) => (
            <Card
              key={item.id}
              size="small"
              className={styles['scheme_item']}
              extra={(
                <>
                  <Button
                    variant="text"
                    onClick={() => {
                      setOpen(true)
                      setIsEdit(true)
                      setAuditSchemeData(item)
                      setIsDisabled(item.is_check)
                    }}
                    color={'primary'}
                    icon={<SearchOutlined />}
                  >查看方案</Button>
                  <Popconfirm
                    title="警告"
                    description="确认删除该条计划吗?"
                    onConfirm={() => handleDel(item)}
                    okText="确认"
                    cancelText="取消"
                  >
                    <Button variant="text" color={'primary'} icon={<DeleteOutlined />}>删除方案</Button>
                  </Popconfirm>
                </>
              )}
              title={`${item.audit_plan_name}审核方案`}
            >
              <SystemAuditItem schemeData={item}></SystemAuditItem>
              <ProductAuditItem schemeData={item}></ProductAuditItem>
              <ProcessAuditItem></ProcessAuditItem>
            </Card>
          ))}
          <Card size="small" className={styles['scheme_item']}>
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <Button
                icon={<PlusOutlined />}
                size="large"
                onClick={() => {
                  setOpen(true)
                  setIsEdit(false)
                  setIsDisabled(false)
                  setAuditSchemeData(cloneDeep(defaultSchemePlanData))
                }}
              >新建审核方案</Button>
            </div>
          </Card>
        </div>
        <Modal
          keyboard={false}
          maskClosable={false}
          title="审核方案"
          open={open}
          onCancel={() => setOpen(false)}
          width={1000}
          okButtonProps={{disabled: isDisabled}}
          onOk={handleOk}>
          <SchemeForm ref={schemeForm} isDisabled={isDisabled} formData={auditSchemeData}></SchemeForm>
        </Modal>
      </div>
    </div>
  );
};
export default SystemAudit;

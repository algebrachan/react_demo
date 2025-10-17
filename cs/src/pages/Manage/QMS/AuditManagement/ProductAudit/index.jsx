import {Button, Card, Modal, Popconfirm, Tabs} from 'antd'
import {MyBreadcrumb} from '@/components/CommonCard/index.jsx'
import styles from './style/index.module.less'
import React, {useEffect, useState} from 'react'
import {read_review_plan} from '@/apis/qms_router.jsx'
import InspectionStandard from '@/pages/Manage/QMS/AuditManagement/ProductAudit/component/InspectionStandard/index.jsx'
import InspectionRecord from '@/pages/Manage/QMS/AuditManagement/ProductAudit/component/InspectionRecord/index.jsx'
import InspectionReport from '@/pages/Manage/QMS/AuditManagement/ProductAudit/component/InspectionReport/index.jsx'
import ProductNonConformanceReport from '@/pages/Manage/QMS/AuditManagement/ProductAudit/component/NonConformanceReport/index.jsx'

const ProductAudit = () => {
  const [planInfo, setPlanInfo] = useState({})
  const [year, setYear] = useState(String(new Date().getFullYear()))
  const getPlanInfo = () => {
    read_review_plan(
      {year, type: 'product'},
      ({data: {data}}) => {
        setPlanInfo(data?.[0] ?? {})
      },
      () => {
      }
    )
  }
  const items = [
    {
      key: '1',
      label: `检验标准`,
      children: (
        <InspectionStandard
          planInfo={planInfo}
          getPlanInfo={getPlanInfo}
          year={year}
          setYear={setYear}
        ></InspectionStandard>
      ),
    },
    {
      key: '2',
      label: `检验记录`,
      children: (
        <InspectionRecord
          planInfo={planInfo}
          getPlanInfo={getPlanInfo}
          year={year}
          setYear={setYear}
        ></InspectionRecord>
      ),
    },
    {
      key: '3',
      label: `审核报告`,
      children: (
        <InspectionReport
          planInfo={planInfo}
          getPlanInfo={getPlanInfo}
          year={year}
          setYear={setYear}
        ></InspectionReport>
      ),
    },
    {
      key: '4',
      label: `不符合项`,
      children: (
        <ProductNonConformanceReport
          planInfo={planInfo}
          getPlanInfo={getPlanInfo}
          year={year}
          setYear={setYear}
        ></ProductNonConformanceReport>
      ),
    }
  ]
  useEffect(() => {
    getPlanInfo()
  }, [year]);
  return (
    <>
      <MyBreadcrumb items={[window.sys_name, "产品审核"]} />
      <div className={`content_root ${styles['product-audit']}`}>
        <Tabs defaultActiveKey="1" items={items}></Tabs>
      </div>
    </>
  )
}
export default ProductAudit

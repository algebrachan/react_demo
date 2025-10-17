import {Button, Card, Modal, Popconfirm, Tabs} from 'antd'
import InternalAuditChecklist from './component/InternalAuditChecklist/index.jsx'
import NonConformanceReport from './component/NonConformanceReport/index.jsx'
import {MyBreadcrumb} from '@/components/CommonCard/index.jsx'
import styles from './style/index.module.less'
import React, {useEffect, useState} from 'react'
import {read_meeting_sheets, read_review_plan} from '../../../../../apis/qms_router.jsx'

const SystemAudit = () => {
  const [planInfo, setPlanInfo] = useState({})
  const [year, setYear] = useState(String(new Date().getFullYear()))
  const [meetingSignInData, setMeetingSignInData] = useState({})
  const getPlanInfo = () => {
    read_review_plan(
      {year, type: 'system'},
      ({data: {data}}) => {
        setPlanInfo(data?.[0] ?? {})
      },
      () => {
      }
    )
  }
  const getMeetingSignInData = () => {
    read_meeting_sheets(
      {year},
      ({data: {data}}) => {
        setMeetingSignInData(data ?? {})
      },
      () => {
      }
    )
  }
  const items = [
    {
      key: '1',
      label: `内审检查表`,
      children: (
        <InternalAuditChecklist
          planInfo={planInfo}
          getPlanInfo={getPlanInfo}
          meetingSignInData={meetingSignInData}
          getMeetingSignInData={getMeetingSignInData}
          year={year}
          setYear={setYear}
        />
      ),
    },
    {
      key: '2',
      label: `不符合项报告`,
      children: (
        <NonConformanceReport
          planInfo={planInfo}
          getPlanInfo={getPlanInfo}
          meetingSignInData={meetingSignInData}
          getMeetingSignInData={getMeetingSignInData}
          year={year}
          setYear={setYear}
        />
      ),
    },
  ]
  useEffect(() => {
    getPlanInfo()
    getMeetingSignInData()
  }, [year]);
  return (
    <>
      <MyBreadcrumb items={[window.sys_name, "体系审核"]} />
      <div className={`content_root ${styles['system-audit']}`}>
        <Tabs defaultActiveKey="1" items={items}></Tabs>
      </div>
    </>
  )
}
export default SystemAudit

import {MyBreadcrumb} from '../../../../components/CommonCard/index.jsx'
import React from 'react'
import {Badge, Tabs} from 'antd'
import ToolsLedger from './component/ToolsLedger/index.jsx'
import VerificationPlan from './component/VerificationPlan/index.jsx'
import MaintenancePlan from './component/MaintenancePlan/index.jsx'
import Apply4Use from './component/Apply4Use/index.jsx'
import styles from './style/index.module.less'
import MSAYearPlan from './component/MSAYearPlan/index.jsx'
import MSAPlan from './component/MSAPlan/index.jsx'
// import Test from './test.jsx'
const MeasureTools = () => {
  return (
    <div>
      <MyBreadcrumb items={[window.sys_name, "检测设备管理"]} />
      <div className={`${styles['measure-tools']} content_root`}>
        <Tabs
          defaultActiveKey="1"
          items={[
            {
              key: "1",
              label: "检测设备台账",
              children: <ToolsLedger />,
            },
            {
              key: "2",
              label: "检测设备校准计划",
              children: <VerificationPlan />,
            },
            {
              key: "3",
              label: "保养计划",
              children: <MaintenancePlan />,
            },
            {
              key: "4",
              label: "设备申领",
              children: <Apply4Use />,
            },
            {
              key: "5",
              label: "MSA年度计划",
              children: <MSAYearPlan />,
            },
            {
              key: "6",
              label: "MSA计划",
              children: <MSAPlan />,
            }
          ]}
        />
      </div>
    </div>
  )
}
export default MeasureTools

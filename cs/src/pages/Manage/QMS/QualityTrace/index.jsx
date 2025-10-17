import {MyBreadcrumb} from '@/components/CommonCard/index.jsx'
import React from 'react'
import {Tabs} from 'antd'
import TraceLedger from '@/pages/Manage/QMS/QualityTrace/TraceLedger.jsx'
import TraceTable from '@/pages/Manage/QMS/QualityTrace/TraceTable.jsx'

const QualityTrace = () => {
  return (
    <div>
      <MyBreadcrumb items={[window.sys_name, "质量追溯"]} />
      <div className={`content_root`}>
        <Tabs
          defaultActiveKey="1"
          items={[
            {
              key: "1",
              label: "质量追溯表",
              children: <TraceTable />,
            },
            {
              key: "2",
              label: "质量追溯台账",
              children: <TraceLedger />,
            }
          ]}
        />
      </div>
    </div>
  )
}
export default QualityTrace

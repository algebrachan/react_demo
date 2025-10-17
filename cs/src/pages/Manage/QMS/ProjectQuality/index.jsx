import {MyBreadcrumb} from '@/components/CommonCard/index.jsx'
import React from 'react'
import ProjectList from '@/pages/Manage/QMS/ProjectQuality/component/ProjectList.jsx'

const ProjectQuality = () => {
  return (
    <div>
      <MyBreadcrumb items={[window.sys_name, "项目质量管理"]} />
      <div className="content_root">
        <ProjectList></ProjectList>
      </div>
    </div>
  )
};
export default ProjectQuality;

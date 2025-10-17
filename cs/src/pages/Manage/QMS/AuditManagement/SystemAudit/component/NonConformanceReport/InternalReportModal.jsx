import {Button, Collapse, DatePicker, Form, Input, message, Modal, Radio, Select, Table} from 'antd'
import CustomForm from '../../../../../../../components/CustomSeries/CustomForm.jsx'
import {useEffect, useState} from 'react'
import {DownloadOutlined} from '@ant-design/icons'
import {read_internal_audit_report, read_non_conformance, update_internal_audit_report} from '../../../../../../../apis/qms_router.jsx'
import {EditTable} from '../../../../ChangeMng/ChangeTracking/component/EditTable.jsx'
import dayjs from 'dayjs'
import {readUsers} from '../../../../../../../apis/auth_api.jsx'

const InternalReportModal = ({open, setOpen, planInfo, isDisabled = false, year, columns, setIsInternalReportExist}) => {
  const [form] = Form.useForm();
  const criteriaTbData = planInfo.criteria_methods?.map((item, index) => ({...item, key: index})) ?? []
  const auditTeamTbData = planInfo.audit_team?.map((item, index) => ({...item, key: index})) ?? []
  const [tableData, setTableData] = useState([])
  const [userOptions, setUserOptions] = useState([])
  const [internalAuditReportInfo, setInternalAuditReportInfo] = useState(null)
  const handleUserSearch = (params) => {
    readUsers(
      params,
      ({data: {data: {user}}}) => {
        setUserOptions(user.map(({user_id: value, nick_name: label}) => ({label, value})))
      }
    )
  }
  const criteriaColumns = [{
    dataIndex: 'method',
    title: '依据方法',
    type: 'TextArea'
  }]
  const auditTeamColumns = [
    {
      dataIndex: 'team_name',
      title: '审核组名称',
      type: 'Input',
      width: 200
    },
    {
      dataIndex: 'group_leader',
      title: '审核组长',
      type: 'Select',
      width: 120,
      props: {
        options: userOptions
      }
    },
    {
      dataIndex: 'team_members',
      title: '审核组员',
      type: 'MultiSelect',
      props: {
        options: userOptions
      }
    }
  ]
  const getInternalReport = () => {
    read_internal_audit_report(
      {year},
      ({data: {data}}) => {
        data = data ?? {}
        const {implementation_status = {}} = data
        setInternalAuditReportInfo(data)
        form.setFieldsValue({implementation_status})
      }
    )
  }
  const formItems = [
    [{
      span: 24,
      label: '审核目的：',
      name: 'purpose',
      formItem: <Input.TextArea rows={4} disabled />
    }],
    [{
      span: 24,
      label: '审核范围：',
      name: 'scope',
      formItem: <Input.TextArea rows={4} disabled />
    }],
    [{
      span: 24,
      formItem: (
        <EditTable
          isDisabled
          isOperate={false}
          title={() => "审核依据文件："}
          columns_text={criteriaColumns}
          dataSource={criteriaTbData}>
        </EditTable>
      )
    }],
    [{
      span: 24,
      formItem: (
        <EditTable
          isDisabled
          isOperate={false}
          title={() => "审核人员："}
          columns_text={auditTeamColumns}
          dataSource={auditTeamTbData}>
        </EditTable>
      )
    }],
    [{
      span: 24,
      label: '审核日期：',
      name: 'review_time',
      getValueProps: value => ({value: value && value.map(i => i && dayjs(i))}),
      normalize: value => value.map(i => i && dayjs(i).format('YYYY-MM-DD')),
      formItem: <DatePicker.RangePicker disabled></DatePicker.RangePicker>
    }],
    [{
      span: 24,
      label: '审核实施情况和不符合项情况：',
      formItem: (
        <div style={{border: '1px solid #e0e0e0', borderRadius: 2, padding: '10px'}}>
          <Form.Item rules={[{required: true, message: ''}]} name={['implementation_status', 'audit_overview']} label={'1、审核概况：'}>
            <Input.TextArea rows={4}></Input.TextArea>
          </Form.Item>
          <Form.Item rules={[{required: true, message: ''}]} name={['implementation_status', 'distribution']} label={'2、从不符合项分布情况看，本公司质量管理体系运行:'}>
            <Radio.Group
              options={[{label: '存在系统失效/区域失效', value: '存在系统失效/区域失效'}, {label: '不存在系统失效/区域失效', value: '不存在系统失效/区域失效'}]}>
            </Radio.Group>
          </Form.Item>
          <Form.Item rules={[{required: true, message: ''}]} name={['implementation_status', 'management_system']} label={'3、本公司质量管理体系:'}>
            <Radio.Group
              options={[{label: '满足标准要求', value: '满足标准要求'}, {label: '不满足标准要求', value: '不满足标准要求'}]}>
            </Radio.Group>
          </Form.Item>
          <Form.Item rules={[{required: true, message: ''}]} name={['implementation_status', 'quality_management']} label={'4、公司质量管理体系运行:'}>
            <Radio.Group
              options={[{label: '有效', value: '有效'}, {label: '基本有效', value: '基本有效'}, {label: '失效', value: '失效'}]}>
            </Radio.Group>
          </Form.Item>
          <Form.Item rules={[{required: true, message: ''}]} name={['implementation_status', 'operation_problems']} label={'5、本公司发现和改进质量体系运行问题的机制:'}>
            <Radio.Group
              options={[{label: '已初步建立', value: '已初步建立'}, {label: '未建立', value: '未建立'}]}>
            </Radio.Group>
          </Form.Item>
          <Form.Item rules={[{required: true, message: ''}]} name={['implementation_status', 'corrective_actions']} label={'6、对纠正措施要求:'}>
            <Input.TextArea rows={4}></Input.TextArea>
          </Form.Item>
          <Form.Item rules={[{required: true, message: ''}]} name={['implementation_status', 'tracking_verification']} label={'7、跟踪和验证:'}>
            <Input.TextArea rows={4}></Input.TextArea>
          </Form.Item>
        </div>
      )
    }],
    [{
      span: 24,
      label: '不符合项报告：',
      formItem: (
        <Table
          size="small"
          columns={columns}
          dataSource={tableData}
          scroll={{x: "max-content", y: 400}}
          pagination={false}
          bordered
        ></Table>
      )
    }],
  ]
  const handleOk = () => {
    form.validateFields().then(values => {
      const {implementation_status} = values
      update_internal_audit_report(
        {id: internalAuditReportInfo.id, implementation_status},
        ({data: {data}}) => {
          message.success(`内部审核报告修改成功！`)
          setOpen(false)
          setIsInternalReportExist(true)
        }
      )
    })
  }
  const getNonConformanceList = () => {
    read_non_conformance(
      {year},
      ({data: {data}}) => {
        setTableData(data.map(i => ({...i, key: i.id})))
      },
      () => {
        setTableData([])
      }
    )
  }
  useEffect(() => {
    if (open) {
      const {purpose, scope, review_time, audit_team} = planInfo
      const userList = []
      audit_team.forEach((item) => {
        const {group_leader, team_members} = item
        typeof group_leader === 'number' && userList.push(group_leader)
        userList.push(...(team_members ?? []))
      })
      form.setFieldsValue({purpose, scope, review_time})
      handleUserSearch({user_id: Array.from(new Set(userList)).join()})
      getInternalReport()
      getNonConformanceList()
    }
  }, [open])
  return (
    <Modal
      width={1000}
      title={'内部审核报告'}
      open={open}
      onOk={handleOk}
      okButtonProps={{disabled: isDisabled}}
      onCancel={() => setOpen(false)}>
      <CustomForm
        layout={'vertical'}
        disabled={isDisabled}
        labelAlign="right"
        form={form}
        formItems={formItems}>
      </CustomForm>
    </Modal>
  );
};
export default InternalReportModal;

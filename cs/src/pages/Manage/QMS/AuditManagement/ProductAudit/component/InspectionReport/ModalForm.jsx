import {Button, Checkbox, DatePicker, Divider, Form, Input, InputNumber, message, Modal, Select, Table, Upload} from 'antd'
import {useEffect, useRef, useState} from 'react'
import {
  create_inspection_record, create_product_audit_report,
  update_inspection_record, update_product_audit_report,
} from '@/apis/qms_router.jsx'
import CustomForm from '@/components/CustomSeries/CustomForm.jsx'
import dayjs from 'dayjs'
import {readUsers} from '@/apis/auth_api.jsx'
import {IsWhether, ReviewDecision} from '@/pages/Manage/QMS/AuditManagement/ProductAudit/component/InspectionReport/index.jsx'

const ModalForm = ({isEdit, open, setOpen, refresh, row, planInfo}) => {
  const [form] = Form.useForm()
  const [userOptions, setUserOptions] = useState([])
  const handleUserSearch = (params) => {
    readUsers(
      params,
      ({data: {data: {user}}}) => {
        setUserOptions(user.map(({user_id: value, nick_name: label}) => ({label, value})))
      }
    )
  }
  const formItems = [
    [
      {
        span: 8,
        label: '产品名称',
        name: 'product_name',
        formItem: <Input disabled={true} />
      },
      {
        span: 8,
        label: '产品编号',
        name: 'product_number',
        formItem: <Input disabled={true} />
      },
      {
        span: 8,
        label: '取样时间',
        name: 'sample_time',
        getValueProps: value => ({value: value && dayjs(value)}),
        normalize: value => value && dayjs(value).format('YYYY-MM-DD'),
        // rules: [{required: true, message: '请输入取样时间'}],
        formItem: <DatePicker disabled={true} />
      },
    ],
    [
      {
        span: 8,
        label: '取样地点',
        name: 'sampling_location',
        formItem: <Input disabled={true} />
      },
      {
        span: 8,
        label: '生产日期',
        name: 'manufacture_date',
        getValueProps: value => ({value: value && dayjs(value)}),
        normalize: value => value && dayjs(value).format('YYYY-MM-DD'),
        formItem: <DatePicker disabled={true} />
      },
      {
        span: 8,
        label: '客户名称',
        name: 'customer_name',
        getValueProps: value => ({value: value && dayjs(value)}),
        normalize: value => value && dayjs(value).format('YYYY-MM-DD'),
        formItem: <DatePicker disabled={true} />
      },
    ],
    [
      {
        span: 8,
        name: 'team_leader',
        label: '审核组长',
        formItem: (
          <Select
            disabled={true}
            showSearch
            filterOption={false}
            onSearch={(value) => value && handleUserSearch({value})}
            options={userOptions}
          />
        )
      },
      {
        span: 8,
        name: 'auditor',
        label: '审核人员',
        formItem: (
          <Select
            disabled={true}
            showSearch
            filterOption={false}
            onSearch={(value) => value && handleUserSearch({value})}
            options={userOptions}
          />
        )
      },
    ],
    [
      {
        span: 24,
        formItem: <Divider style={{margin: 0}}></Divider>
      }
    ],
    [
      {
        span: 8,
        name: 'QKZ',
        label: 'QKZ',
        formItem: (
          <Input disabled={true} />
        )
      },
      {
        span: 8,
        name: 'review_decision',
        label: '审核决定',
        rules: [{required: true, message: '请选择审核决定'}],
        formItem: (
          <Select options={ReviewDecision} />
        )
      },
    ],
    [
      {
        span: 8,
        label: 'A类缺陷',
        name: 'A_class_defect',
        formItem: <Input disabled={true} />
      },
      {
        span: 8,
        label: 'B类缺陷',
        name: 'B_class_defect',
        formItem: <Input disabled={true} />
      },
      {
        span: 8,
        label: 'C类缺陷',
        name: 'C_class_defect',
        formItem: <Input disabled={true} />
      },
    ],
    [
      {
        span: 24,
        formItem: <Divider style={{margin: 0}}></Divider>
      }
    ],
    [
      {
        span: 24,
        label: '缺陷说明',
        formItem: (
          <Input.TextArea
            value={`本次审核共审核 ${row.total_sample} 件产品，其中发现A类缺陷 ${row.A_class_defect} 项，B类缺陷 ${row.B_class_defect} 项，C类缺陷 ${row.C_class_defect} 项`}
            disabled={true} />
        )
      },
    ],
    [
      {
        span: 24,
        label: '补充说明',
        name: 'description',
        formItem: (
          <Input.TextArea />
        )
      },
    ],
    [
      {
        span: 24,
        formItem: <Divider style={{margin: 0}}></Divider>
      }
    ],
    [
      {
        span: 8,
        label: '是否进一步措施',
        name: 'further_measure',
        rules: [{required: true, message: '请选择是否采取进一步措施'}],
        formItem: (
          <Select options={IsWhether} />
        )
      },
    ],
    [
      {
        span: 24,
        formItem: <Divider style={{margin: 0}}></Divider>
      }
    ],
    [
      {
        span: 8,
        label: '是否扣压所有库存',
        name: 'is_deduct',
        rules: [{required: true, message: '请选择是否扣压所有库存'}],
        formItem: (
          <Select options={IsWhether} />
        )
      },
      {
        span: 8,
        label: '负责部门',
        name: 'responsible_department',
        rules: [{required: true}],
        formItem: (
          <Input />
        )
      },
      {
        span: 8,
        label: '实施日期',
        name: 'implementation_time',
        getValueProps: value => ({value: value && dayjs(value)}),
        normalize: value => value && dayjs(value).format('YYYY-MM-DD'),
        rules: [{required: true, message: '请输入实施日期'}],
        formItem: <DatePicker />
      },
    ],
    [
      {
        span: 24,
        formItem: <Divider style={{margin: 0}}></Divider>
      }
    ],
    [
      {
        span: 24,
        label: '预防措施',
        name: 'preventive_measure',
        formItem: (
          <Input.TextArea />
        )
      },
    ],
    [
      {
        span: 24,
        formItem: <Divider style={{margin: 0}}></Divider>
      }
    ],
    [
      {
        span: 24,
        label: '报告分发',
        name: 'report_distribution',
        formItem: (
          <Checkbox.Group options={[
            {label: '质量管理部', value: '质量管理部'},
            {label: '制造部', value: '制造部'},
            {label: '研发技术部', value: '研发技术部'},
            {label: '计划部', value: '计划部'},
            {label: '财务部', value: '财务部'},
            {label: '坩埚车间', value: '坩埚车间'},
            {label: '长晶车间', value: '长晶车间'},
            {label: '合成车间', value: '合成车间'}
          ]} />
        )
      },
    ]
  ]
  const handleOk = () => {
    form.validateFields().then(values => {
      if (isEdit) {
        update_product_audit_report({
          id: row.id,
          ...values,
        }, res => {
          message.success(`编辑成功`)
          setOpen(false)
          refresh()
        })
      } else {
        create_product_audit_report({
          product_review_plan_id: planInfo.id,
          ...values,
        }, res => {
          message.success(`添加成功`)
          setOpen(false)
          refresh()
        })
      }
    })
  }
  useEffect(() => {
    if (isEdit && open) {
      const {team_leader, auditor, ...rest} = row
      const userList = []
      typeof team_leader === 'number' && userList.push(team_leader)
      typeof auditor === 'number' && userList.push(auditor)
      handleUserSearch({user_id: Array.from(new Set(userList)).join()})
      form.setFieldsValue({team_leader, auditor, ...rest})
    } else if (!isEdit && open) {
      form.resetFields()
    }
  }, [open])
  return (
    <Modal
      title={`${isEdit ? '编辑' : '新增'}`}
      open={open}
      onOk={() => handleOk()}
      onCancel={() => setOpen(false)}
      width={1200}>
      <CustomForm
        form={form}
        formItems={formItems}
      />
    </Modal>
  )
}
export default ModalForm;

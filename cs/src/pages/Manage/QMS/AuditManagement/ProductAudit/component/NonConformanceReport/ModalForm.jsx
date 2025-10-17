import {Button, Checkbox, DatePicker, Divider, Form, Input, InputNumber, message, Modal, Radio, Select, Table, Upload} from 'antd'
import {useEffect, useRef, useState} from 'react'
import {
  create_inspection_record, create_product_non_conformance,
  update_inspection_record, update_product_non_conformance,
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
        label: '审核日期',
        name: 'approved_date',
        getValueProps: value => ({value: value && dayjs(value)}),
        normalize: value => value && dayjs(value).format('YYYY-MM-DD'),
        formItem: <DatePicker />
      },
      {
        span: 8,
        label: '审核区域/工序',
        name: 'process',
        formItem: <Input />
      },
      {
        span: 8,
        label: '要素编号',
        name: 'element_number',
        formItem: <Input />
      }
    ],
    [
      {
        span: 8,
        label: '不符合项描述',
        name: 'description',
        formItem: <Input />
      },
      {
        span: 8,
        label: '原因分析',
        name: 'cause_analysis',
        formItem: <Input />
      },
      {
        span: 8,
        label: '整改措施',
        name: 'rectification_measure',
        formItem: <Input />
      }
    ],
    [
      {
        span: 8,
        label: '担当人',
        name: 'responsible_person',
        formItem: (
          <Select
            showSearch
            filterOption={false}
            onSearch={(value) => value && handleUserSearch({value})}
            options={userOptions}
          />
        )
      },
      {
        span: 8,
        label: '计划完成时间',
        name: 'planned_completion_time',
        getValueProps: value => ({value: value && dayjs(value)}),
        normalize: value => value && dayjs(value).format('YYYY-MM-DD'),
        formItem: <DatePicker />
      },
      {
        span: 8,
        label: '问题关闭时间',
        name: 'problem_closure_time',
        getValueProps: value => ({value: value && dayjs(value)}),
        normalize: value => value && dayjs(value).format('YYYY-MM-DD'),
        formItem: <DatePicker />
      }
    ],
    [
      {
        span: 8,
        label: '整改证据',
        name: 'rectification_evidence',
        formItem: <Input />
      },
      {
        span: 8,
        label: '文件验证',
        name: 'file_validation',
        formItem: <Radio.Group options={[{label: '关闭', value: '关闭'}, {label: '无效', value: '无效'}]}></Radio.Group>
      },
      {
        span: 8,
        label: '现场验证',
        name: 'on_site_verification',
        formItem: <Radio.Group options={[{label: '关闭', value: '关闭'}, {label: '无效', value: '无效'}]}></Radio.Group>
      }
    ],
    [
      {
        span: 8,
        label: '验证人',
        name: 'signature',
        formItem: (
          <Select
            showSearch
            filterOption={false}
            onSearch={(value) => value && handleUserSearch({value})}
            options={userOptions}
          />
        )
      },
      {
        span: 8,
        label: '验证时间',
        name: 'signature_date',
        getValueProps: value => ({value: value && dayjs(value)}),
        normalize: value => value && dayjs(value).format('YYYY-MM-DD'),
        formItem: <DatePicker />
      }
    ],
  ]
  const handleOk = () => {
    form.validateFields().then(values => {
      if (isEdit) {
        update_product_non_conformance({
          id: row.id,
          ...values,
        }, res => {
          message.success(`编辑成功`)
          setOpen(false)
          refresh()
        })
      } else {
        create_product_non_conformance({
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
      const {signature, responsible_person, ...rest} = row
      const userList = []
      typeof signature === 'number' && userList.push(signature)
      typeof responsible_person === 'number' && userList.push(responsible_person)
      handleUserSearch({user_id: Array.from(new Set(userList)).join()})
      form.setFieldsValue({signature, responsible_person, ...rest})
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
        labelCol={{span: 6}}
        formItems={formItems}
      />
    </Modal>
  )
}
export default ModalForm;

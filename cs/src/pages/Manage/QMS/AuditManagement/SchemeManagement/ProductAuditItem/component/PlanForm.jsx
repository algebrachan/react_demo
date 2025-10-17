import {forwardRef, useEffect, useImperativeHandle, useRef, useState} from 'react'
import CustomForm from '../../../../../../../components/CustomSeries/CustomForm.jsx'
import {DatePicker, Form, Input} from 'antd'
import {EditTable} from '../../../../ChangeMng/ChangeTracking/component/EditTable.jsx'
import {readUsers} from '@/apis/auth_api.jsx'
import dayjs from 'dayjs'
import {dutiesOptions, productOptions} from '../../SchemeForm/index.jsx'

const PlanForm = forwardRef((props, ref) => {
  const {isDisabled = false, formData = {}} = props
  const [form] = Form.useForm()
  const [userOptions, setUserOptions] = useState([])
  const [criteriaTbData, setCriteriaTbData] = useState([])
  const [planItemsTbData, setPlanItemsTbData] = useState([])
  const criteriaColumns = [{
    dataIndex: 'method',
    title: '依据方法',
    type: 'TextArea'
  }]
  const handleUserSearch = (params) => {
    readUsers(
      params,
      ({data: {data: {user}}}) => {
        setUserOptions(user.map(({user_id: value, nick_name: label}) => ({label, value})))
      }
    )
  }
  const planItemsColumns = [
    {
      dataIndex: 'customer_name',
      title: '客户',
      width: 200,
      type: 'Input'
    },
    {
      dataIndex: 'product_name',
      title: '产品',
      width: 200,
      type: 'MultiSelect',
      props: {options: productOptions}
    },
    {
      dataIndex: 'product_specification',
      title: '规格',
      width: 200,
      type: 'Input'
    },
    {
      dataIndex: 'plan_time',
      title: '计划时间',
      type: 'DatePicker',
      width: 200,
      props: {picker: 'month'}
    },
    {
      dataIndex: 'plan_person_in_charge',
      title: '计划负责人',
      type: 'Select',
      width: 200,
      props: (text) => ({
        showSearch: true,
        filterOption: false,
        onSearch: (value) => value && handleUserSearch({value}),
        options: userOptions
      })
    },
    {
      dataIndex: 'actual_time',
      title: '实际时间',
      width: 200,
      type: 'DatePicker',
      props: {picker: 'month'}
    },
    {
      dataIndex: 'actual_person_in_charge',
      title: '实际负责人',
      type: 'Select',
      width: 200,
      props: (text) => ({
        showSearch: true,
        filterOption: false,
        onSearch: (value) => value && handleUserSearch({value}),
        options: userOptions
      })
    },
    {
      dataIndex: 'note',
      title: '备注',
      type: 'Input'
    },
  ]
  const formItems = [
    [
      {
        span: 12,
        label: '审核目的',
        name: 'purpose',
        formItem: <Input.TextArea></Input.TextArea>
      },
      {
        span: 12,
        label: '审核范围',
        name: 'scope',
        formItem: <Input.TextArea></Input.TextArea>
      },
    ],
    [{
      span: 24,
      formItem: (
        <EditTable
          isDisabled={isDisabled}
          title={() => "审核准则依据方法："}
          columns_text={criteriaColumns}
          dataSource={criteriaTbData}
          setTbData={setCriteriaTbData}>
        </EditTable>
      )
    }],
    [{
      span: 24,
      formItem: (
        <EditTable
          isDisabled={isDisabled}
          title={() => "审核计划表："}
          columns_text={planItemsColumns}
          dataSource={planItemsTbData}
          setTbData={setPlanItemsTbData}>
        </EditTable>
      )
    }]
  ]
  // 暴露表单实例方法给父组件
  useImperativeHandle(ref, () => ({
    getFieldsValue: (...args) => {
      const nowFormData = form.getFieldsValue(...args)
      return {
        ...formData,
        ...nowFormData,
        criteria_methods: criteriaTbData.map(({key, ...rest}) => rest),
        plan_items: planItemsTbData.map(({key, ...rest}) => rest),
      }
    },
    resetFields: (...args) => {
      form.resetFields(...args)
      setCriteriaTbData([])
      setPlanItemsTbData([])
    },
  }));
  useEffect(() => {
    const {criteria_methods = [], plan_items = []} = formData
    const userList = []
    setCriteriaTbData(criteria_methods.map((item) => ({...item, key: item.method})))
    setPlanItemsTbData(plan_items.map((item, index) => {
      const {plan_person_in_charge, actual_person_in_charge} = item
      typeof plan_person_in_charge === 'number' && userList.push(plan_person_in_charge)
      typeof actual_person_in_charge === 'number' && userList.push(actual_person_in_charge)
      return {...item, key: index}
    }))
    handleUserSearch({user_id: Array.from(new Set(userList)).join()})
    form.setFieldsValue(formData)
  }, [formData]);
  return (
    <CustomForm
      disabled={isDisabled}
      form={form}
      formItems={formItems}
    ></CustomForm>
  );
})
export default PlanForm;

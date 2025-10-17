import CustomForm from '@/components/CustomSeries/CustomForm.jsx'
import {DatePicker, Divider, Form, Input, Select} from 'antd'
import {EditTable} from '@/pages/Manage/QMS/ChangeMng/ChangeTracking/component/EditTable.jsx'
import {forwardRef, useImperativeHandle, useEffect, useState} from 'react'
import dayjs from 'dayjs'
import MultiSelect from '@/components/CustomSeries/MultiSelect.jsx'

export const productOptions = [
  {
    label: '6英寸碳化硅',
    value: '6英寸碳化硅'
  },
  {
    label: '8英寸碳化硅',
    value: '8英寸碳化硅'
  },
  {
    label: 'S原料',
    value: 'S原料'
  }
]
export const dutiesOptions = [
  {
    label: 'C1:产品和服务要求的确定过程',
    value: 'C1'
  },
  {
    label: 'C2:设计和开发过程',
    value: 'C2'
  },
  {
    label: 'C3:产品生产过程',
    value: 'C3'
  },
  {
    label: 'C4:交付过程',
    value: 'C4'
  },
  {
    label: 'C5:顾客服务和投诉处理过程',
    value: 'C5'
  },
  {
    label: 'C6:变更管理过程',
    value: 'C6'
  },
  {
    label: 'M1:经营计划管理',
    value: 'M1'
  },
  {
    label: 'M2:质量体系管理过程',
    value: 'M2'
  },
  {
    label: 'M3:管理评审过程',
    value: 'M3'
  },
  {
    label: 'M4:改进管理过程',
    value: 'M4'
  },
  {
    label: 'S1:人力资源管理过程',
    value: 'S1'
  },
  {
    label: 'S2:采购管理过程',
    value: 'S2'
  },
  {
    label: 'S3:基础设施和环境管理过程',
    value: 'S3'
  },
  {
    label: 'S4:监视和测量设备管理过程',
    value: 'S4'
  },
  {
    label: 'S5:检验和试验控制过程',
    value: 'S5'
  },
  {
    label: 'S6:不合格品控制过程',
    value: 'S6'
  },
  {
    label: 'S7:文件和记录控制过程',
    value: 'S7'
  }
]
const processCodeOptions = [
  {
    label: 'P1:潜在分析',
    value: 'P1'
  },
  {
    label: 'P2:项目管理',
    value: 'P2'
  },
  {
    label: 'P3:产品和生产过程开发的策划',
    value: 'P3'
  },
  {
    label: 'P4:产品和生产过程开发的实现',
    value: 'P4'
  },
  {
    label: 'P5:供方管理',
    value: 'P5'
  },
  {
    label: 'P6:生产过程分析',
    value: 'P6'
  },
  {
    label: 'P7:顾客关怀、顾客满意、服务',
    value: 'P7'
  }
]
const SchemeForm = forwardRef((props, ref) => {
  const {isDisabled = false, formData = {}} = props
  const criteriaColumns = [{
    dataIndex: 'method',
    title: '依据方法',
    type: 'TextArea'
  }]
  const customerProductColumns = [
    {
      dataIndex: 'customer',
      title: '客户',
      width: 200,
      type: 'Input'
    },
    {
      dataIndex: 'product',
      title: '产品',
      type: 'MultiSelect',
      props: {options: productOptions}
    },
    {
      dataIndex: 'audit_time',
      title: '审核时间',
      type: 'DatePicker',
      props: {picker: 'month'}
    }
  ]
  const processProductColumns = [
    {
      dataIndex: 'product',
      title: '产品',
      width: 200,
      type: 'Select',
      props: {options: productOptions}
    },
    {
      dataIndex: 'process',
      title: '过程',
      type: 'MultiSelect',
      props: {options: processCodeOptions, optionLabelProp: 'value'}
    },
    {
      dataIndex: 'audit_time',
      title: '审核时间',
      type: 'DatePicker',
      props: {picker: 'month'}
    }
  ]
  const [criteriaTbData, setCriteriaTbData] = useState([])
  const [customerProductTbData, setCustomerProductTbData] = useState([])
  const [processProductTbData, setProcessProductTbData] = useState([])
  const [form] = Form.useForm()
  const formItems = [
    [{
      span: 24,
      name: 'audit_plan_name',
      label: '审核方案年份',
      getValueProps: value => ({value: value && dayjs(value)}),
      normalize: value => value && dayjs(value).format('YYYY'),
      formItem: <DatePicker picker="year" />
    }],
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
      formItem: <Divider style={{margin: 0}}></Divider>
    }],
    [{
      span: 24,
      label: '体系内审',
    }],
    [
      {
        span: 12,
        name: ['system', 'purpose'],
        label: '审核目的',
        formItem: <Input.TextArea />
      },
      {
        span: 12,
        name: ['system', 'scope'],
        label: '审核范围',
        formItem: <Input.TextArea />
      }
    ],
    [{
      span: 12,
      name: ['system', 'document'],
      label: '审核文件',
      formItem: <Input.TextArea />
    }],
    [
      {
        span: 12,
        label: '第一次审核时间',
        name: ['system', 'first_time', 'audit_time'],
        getValueProps: value => ({value: value && dayjs(value)}),
        normalize: value => value && dayjs(value).format('YYYY-MM'),
        formItem: (
          <DatePicker picker="month"></DatePicker>
        )
      },
      {
        span: 12,
        label: '第二次审核时间',
        name: ['system', 'second_time', 'audit_time'],
        getValueProps: value => ({value: value && dayjs(value)}),
        normalize: value => value && dayjs(value).format('YYYY-MM'),
        formItem: (
          <DatePicker picker="month"></DatePicker>
        )
      }],
    [
      {
        span: 12,
        name: ['system', 'first_time', 'duties'],
        label: '第一次审核职能',
        formItem: (
          <MultiSelect
            disabled={isDisabled}
            showCheckAll
            maxTagCount={'responsive'}
            options={dutiesOptions}
            optionLabelProp="value">
          </MultiSelect>
        )
      },
      {
        span: 12,
        name: ['system', 'second_time', 'duties'],
        label: '第二次审核职能',
        formItem: (
          <MultiSelect
            disabled={isDisabled}
            showCheckAll
            maxTagCount={'responsive'}
            options={dutiesOptions}
            optionLabelProp="value">
          </MultiSelect>
        )
      }],
    [{
      span: 24,
      formItem: <Divider style={{margin: 0}}></Divider>
    }],
    [{
      span: 24,
      label: '产品审核'
    }],
    [
      {
        span: 12,
        name: ['product', 'purpose'],
        label: '审核目的',
        formItem: <Input.TextArea />
      },
      {
        span: 12,
        name: ['product', 'scope'],
        label: '审核范围',
        formItem: <Input.TextArea />
      },
    ],
    [
      {
        span: 12,
        name: ['product', 'document'],
        label: '审核文件',
        formItem: <Input.TextArea />
      },
      /*{
        span: 12,
        label: '审核时间',
        name: ['product', 'audit_time'],
        getValueProps: value => ({value: value && dayjs(value)}),
        normalize: value => value && dayjs(value).format('YYYY-MM'),
        formItem: (
          <DatePicker picker="month"></DatePicker>
        )
      }*/
    ],
    [{
      span: 24,
      formItem: (
        <EditTable
          isDisabled={isDisabled}
          title={() => "审核包含客户及产品："}
          columns_text={customerProductColumns}
          dataSource={customerProductTbData}
          setTbData={setCustomerProductTbData}>
        </EditTable>
      )
    }],
    [{
      span: 24,
      formItem: <Divider style={{margin: 0}}></Divider>
    }],
    [{
      span: 24,
      label: '过程审核'
    }],
    [
      {
        span: 12,
        name: ['process', 'purpose'],
        label: '审核目的',
        formItem: <Input.TextArea />
      },
      {
        span: 12,
        name: ['process', 'scope'],
        label: '审核范围',
        formItem: <Input.TextArea />
      },
    ],
    [
      {
        span: 12,
        name: ['process', 'document'],
        label: '审核文件',
        formItem: <Input.TextArea />
      },
      /*{
        span: 12,
        label: '审核时间',
        name: ['process', 'audit_time'],
        getValueProps: value => ({value: value && dayjs(value)}),
        normalize: value => value && dayjs(value).format('YYYY-MM'),
        formItem: (
          <DatePicker picker="month"></DatePicker>
        )
      }*/
    ],
    [{
      span: 24,
      formItem: (
        <EditTable
          isDisabled={isDisabled}
          title={() => "过程产品审核："}
          columns_text={processProductColumns}
          dataSource={processProductTbData}
          setTbData={setProcessProductTbData}>
        </EditTable>
      )
    }],
  ]
  // 暴露表单实例方法给父组件
  useImperativeHandle(ref, () => ({
    getFieldsValue: (...args) => {
      const {process, system, product, audit_plan_name} = form.getFieldsValue(...args)
      return {
        ...formData,
        audit_plan_name,
        criteria_methods: criteriaTbData.map(({key, ...rest}) => rest),
        system,
        process: {
          ...process,
          process_product: processProductTbData.map(({key, ...rest}) => rest)
        },
        product: {
          ...product,
          customer_product: customerProductTbData.map(({key, ...rest}) => rest)
        },
      }
    },
    resetFields: (...args) => {
      form.resetFields(...args)
      setCriteriaTbData([])
      setCustomerProductTbData([])
      setProcessProductTbData([])
    },
  }));
  useEffect(() => {
    const {criteria_methods, process: {process_product}, product: {customer_product}} = formData
    setCriteriaTbData(criteria_methods.map((item) => ({...item, key: item.method})))
    setCustomerProductTbData(customer_product.map((item) => ({...item, key: item.customer})))
    setProcessProductTbData(process_product.map((item) => ({...item, key: item.process})))
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
export default SchemeForm;

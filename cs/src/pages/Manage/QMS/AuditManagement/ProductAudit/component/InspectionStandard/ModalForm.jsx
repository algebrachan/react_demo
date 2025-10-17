import {Button, DatePicker, Form, Input, InputNumber, message, Modal, Select, Upload} from 'antd'
import {useEffect, useState} from 'react'
import {
  addToolsLedger,
  create_audit_checklist,
  create_inspection_standard,
  editToolsLedger,
  update_audit_checklist,
  update_inspection_standard,
  uploadToolsLedger
} from '@/apis/qms_router.jsx'
import CustomForm from '@/components/CustomSeries/CustomForm.jsx'
import {EditTable} from '@/pages/Manage/QMS/ChangeMng/ChangeTracking/component/EditTable.jsx'

export const DefectCoefficient = [
  {label: 'A(10)', value: 'A'},
  {label: 'B(5)', value: 'B'},
  {label: 'C(1)', value: 'C'},
]
const ModalForm = ({isEdit, open, setOpen, refresh, row, planInfo}) => {
  const [form] = Form.useForm()
  const [standardItems, setStandardItems] = useState([])
  const columns = () => [
    {
      dataIndex: 'technical_specification',
      title: '检测项目/技术规范',
      width: 150,
      type: 'Input',
    },
    {
      dataIndex: 'evaluation_technique',
      title: '测量评价技术',
      width: 120,
      type: 'Input',
    },
    {
      dataIndex: 'sample_quantity',
      title: '抽样数量',
      width: 100,
      type: 'InputNumber',
      props: {
        min: 0
      }
    },
    {
      dataIndex: 'defect_coefficient',
      title: '缺陷分类',
      width: 230,
      type: 'Radio.Group',
      props: {
        options: DefectCoefficient
      }
    },
  ]
  const formItems = [
    [
      {
        span: 12,
        label: '产品名称',
        rules: [{required: true, message: '请输入产品名称'}],
        name: 'product_name',
        formItem: <Input />
      },
      {
        span: 12,
        label: '产品图号',
        name: 'product_drawing_number',
        rules: [{required: true, message: '请输入产品图号'}],
        formItem: <Input />
      },
    ],
    [
      {
        span: 12,
        label: '顾客名称',
        name: 'customer_name',
        rules: [{required: true, message: '请输入顾客名称'}],
        formItem: <Input />
      },
      {
        span: 12,
        label: '备注',
        name: 'remark',
        formItem: <Input />
      }
    ],
    [
      {
        span: 24,
        formItem: (
          <EditTable
            title={() => "检验标准："}
            columns_text={columns()}
            dataSource={standardItems}
            setTbData={setStandardItems}>
          </EditTable>
        )
      }
    ]
  ]
  const handleOk = () => {
    form.validateFields().then(values => {
      if (isEdit) {
        update_inspection_standard({id: row.id, ...values, standard_items: standardItems}, res => {
          message.success(`编辑成功`)
          setOpen(false)
          refresh()
        })
      } else {
        create_inspection_standard({product_review_plan_id: planInfo.id, ...values, standard_items: standardItems}, res => {
          message.success(`添加成功`)
          setOpen(false)
          refresh()
        })
      }
    })
  }
  useEffect(() => {
    if (isEdit && open) {
      const {standard_items, ...rest} = row
      setStandardItems(standard_items)
      form.setFieldsValue({...rest})
    } else if (!isEdit && open) {
      form.resetFields()
      setStandardItems([])
    }
  }, [open])
  return (
    <Modal
      title={`${isEdit ? '编辑' : '新增'}`}
      open={open}
      onOk={() => handleOk()}
      onCancel={() => setOpen(false)}
      width={800}>
      <CustomForm
        form={form}
        formItems={formItems}
        labelAlign="right"
        labelCol={{span: 8}}
      />
    </Modal>
  )
}
export default ModalForm;

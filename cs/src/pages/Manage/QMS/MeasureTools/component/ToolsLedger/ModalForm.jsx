import {DatePicker, Form, Input, InputNumber, Modal, Select, message, Upload, Button} from 'antd'
import CustomForm from '../../../../../../components/CustomSeries/CustomForm.jsx'
import {calibrationType, isTrue, measureTypes as typeOptions} from '../../dict.js'
import {addToolsLedger, editToolsLedger, uploadToolsLedger} from '../../../../../../apis/qms_router.jsx'
import dayjs from 'dayjs'
import {useEffect, useState} from 'react'

const ModalForm = ({isEdit, visible, setVisible, refresh, row}) => {
  const [form] = Form.useForm()
  const [fileList, setFileList] = useState([]);
  const formItems = [
    [
      {
        span: 6,
        label: '管理编号',
        name: 'management_number',
        rules: [{required: true, message: '请输入管理编号'}],
        formItem: <Input />
      },
      {
        span: 6,
        label: '量具名称',
        name: 'measuring_tool_name',
        rules: [{required: true, message: '请输入量具名称'}],
        formItem: <Input />
      },
      {
        span: 6,
        label: '物料号',
        name: 'material_number',
        formItem: <Input />
      },
      {
        span: 6,
        label: '量具种类',
        name: 'measuring_tools_types',
        rules: [{required: true, message: '请输入量具种类'}],
        formItem: <Input />
      },
    ],
    [
      {
        span: 6,
        label: '校准周期（月）',
        name: 'calibration_cycle',
        rules: [{required: true, message: '请输入校准周期'}],
        formItem: <InputNumber />
      },
      // {
      //   span: 6,
      //   label: '保养周期（月）',
      //   name: 'maintenance_cycle',
      //   // rules: [{required: true, message: '请输入校准周期'}],
      //   formItem: <InputNumber />
      // },
      {
        span: 6,
        label: '有效日期',
        name: 'effective_date',
        rules: [{required: true, message: '请输入有效日期'}],
        getValueProps: value => ({value: value && dayjs(value)}),
        normalize: value => value && `${dayjs(value).format('YYYY-MM-DD')}`,
        formItem: <DatePicker />
      },
      {
        span: 6,
        label: '量程',
        name: 'measurement_span',
        formItem: <Input />
      },
      {
        span: 6,
        label: '精度',
        name: 'accuracy',
        formItem: <Input />
      },
    ],
    [
      {
        span: 6,
        label: '领用部门',
        name: 'user_department',
        rules: [{required: true, message: '请输入领用部门'}],
        formItem: <Input />
      },
      {
        span: 6,
        label: '管理人/一级提醒人',
        name: 'reminder_level_one',
        rules: [{required: true, message: '请输入管理人'}],
        formItem: <Input />
      },
      {
        span: 6,
        label: '二级提醒人',
        name: 'reminder_level_tow',
        rules: [{required: true, message: '请输入二级提醒人'}],
        formItem: <Input />
      },
      {
        span: 6,
        label: '三级提醒人',
        name: 'reminder_level_three',
        formItem: <Input />
      },
    ],
    [
      {
        span: 6,
        label: '计量类别',
        name: 'measurement_category',
        rules: [{required: true, message: '请输入计量类别'}],
        formItem: <Input />
      },
      {
        span: 6,
        label: '执行项目',
        name: 'execute_project',
        formItem: <Input />
      },
      {
        span: 6,
        label: '校验类型',
        name: 'inspection_type',
        formItem: <Select options={calibrationType} />
      },
      {
        span: 6,
        label: '是否强制检验',
        name: 'mandatory_inspection',
        formItem: <Select options={isTrue} />
      },
      // {
      //   span: 6,
      //   label: '是否单一仪器',
      //   name: 'is_single_instrument',
      //   formItem: <Select options={isTrue} />
      // },
      // {
      //   span: 6,
      //   label: '保质期（月）',
      //   name: 'quality_guarantee_period',
      //   formItem: <InputNumber />
      // },
    ],
    [
      {
        span: 6,
        label: '型号',
        name: 'model',
        formItem: <Input />
      },
      {
        span: 6,
        label: '使用区域',
        name: 'user_zones',
        formItem: <Input />
      },
      {
        span: 6,
        label: '使用人',
        name: 'user',
        formItem: <Input />
      },
      {
        span: 6,
        label: '使用状态',
        name: 'use_status',
        formItem: <Select options={typeOptions} />
      },
    ],
    [
      {
        span: 6,
        label: '购入日期',
        name: 'purchase_date',
        getValueProps: value => ({value: value && dayjs(value)}),
        normalize: value => value && `${dayjs(value).format('YYYY-MM-DD')}`,
        formItem: <DatePicker />
      },
      {
        span: 6,
        label: '制造商',
        name: 'manufacturer',
        formItem: <Input />
      },
      {
        span: 6,
        label: '出厂编号',
        name: 'factory_number',
        formItem: <Input />
      },
      {
        span: 6,
        label: '计量管理员',
        name: 'metrology_administrator',
        formItem: <Input />
      },
    ],
    [
      {
        span: 6,
        label: '校准日期',
        name: 'calibration_date',
        getValueProps: value => ({value: value && dayjs(value)}),
        normalize: value => value && `${dayjs(value).format('YYYY-MM-DD')}`,
        formItem: <DatePicker />
      },
      // {
      //   span: 6,
      //   label: '保养日期',
      //   name: 'maintenance_date',
      //   getValueProps: value => ({value: value && dayjs(value)}),
      //   normalize: value => value && `${dayjs(value).format('YYYY-MM-DD')}`,
      //   formItem: <DatePicker />
      // },
      {
        span: 6,
        label: '校准机构',
        name: 'calibration_agency',
        formItem: <Input />
      },
      // {
      //   span: 6,
      //   label: '是否显示',
      //   name: 'is_displayed',
      //   formItem: <Select options={isTrue} />
      // },
      {
        span: 6,
        label: '校准报告',
        name: 'calibration_report',
        formItem: (
          <Upload
            maxCount={1}
            fileList={fileList}
            onRemove={() => {setFileList([])}}
            beforeUpload={file => {
              setFileList([file])
              return false
            }}
          >
            <Button>点击上传</Button>
          </Upload>
        )
      },
      {
        span: 6,
        label: '备注',
        name: 'notes',
        formItem: <Input />
      }
    ]
  ]
  const isFile = (file) => {
    return Object.prototype.toString.call(file) === '[object File]'
  }
  const uploadFile = (id) => {
    const todo = () => {
      message.success(`${isEdit ? '编辑' : '添加'}成功`)
      setVisible(false)
      form.resetFields()
      refresh()
    }
    const [file] = fileList
    if (isFile(file)) {
      const formData = new FormData()
      formData.append('file', file)
      uploadToolsLedger({id, typeof: 1}, formData, (res) => {
        todo()
      })
    } else if (isEdit && file === undefined) {
      uploadToolsLedger({id, typeof: 1}, undefined, (res) => {
        todo()
      })
    } else {
      todo()
    }
  }
  const handleOk = () => {
    form.validateFields().then(values => {
      const {calibration_report, ...rest} = values
      if (isEdit) {
        editToolsLedger({id: row.id, ...rest}, () => {
          uploadFile(row.id)
        })
      } else {
        addToolsLedger(rest, ({data}) => {
          uploadFile(data.data.id)
        })
      }
    })
  }
  useEffect(() => {
    if (isEdit && visible) {
      const {calibration_report} = row
      setFileList(calibration_report ? [{name: calibration_report}] : [])
      form.setFieldsValue(row)
    } else if (!isEdit && visible) {
      form.resetFields()
      setFileList([])
    }
  }, [visible])
  return (
    <Modal
      title={`${isEdit ? '编辑' : '新增'}`}
      open={visible}
      onOk={() => handleOk()}
      onCancel={() => setVisible(false)}
      width={1500}>
      <CustomForm
        form={form}
        formItems={formItems}
        labelAlign="right"
        labelCol={{span: 10}}
      />
    </Modal>
  )
}
export default ModalForm;

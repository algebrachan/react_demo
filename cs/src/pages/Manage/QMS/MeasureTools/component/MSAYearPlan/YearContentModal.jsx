import CustomForm from '../../../../../../components/CustomSeries/CustomForm.jsx'
import {DatePicker, Form, Input, InputNumber, message, Modal, Select} from 'antd'
import {useEffect, useState} from 'react'
import {
  createMSAYearPlanContent,
  getToolsLedger,
  updateMSAYearPlanContent
} from '../../../../../../apis/qms_router.jsx'
import dayjs from 'dayjs'
import {msaAnalysisItem} from '../../dict.js'

const YearContentModal = ({
  isEdit,
  visible,
  setVisible,
  refresh,
  row,
  yearPlan
}) => {
  const [form] = Form.useForm()
  const [deviceOptions, setDeviceOptions] = useState([])
  const formItems = [
    [
      {
        span: 8,
        label: '检测设备编号',
        name: 'detection_device_id',
        rules: [{required: true, message: '请输入检测设备编号'}],
        formItem: (
          <Select
            options={deviceOptions}
            showSearch={true}
            notFoundContent={null}
            filterOption={false}
            onChange={(val) => {
              const checkedItem = deviceOptions.find(i => i.value === val)
              form.setFieldsValue({
                detection_device_name: checkedItem.name ?? '',
                measurement_range: checkedItem.span ?? '',
                resolution: checkedItem.accuracy ?? ''
              })
            }}
            onSearch={(value) => {
              getToolsLedger({management_number: value}, ({data: {data}}) => {
                if (data?.length) {
                  setDeviceOptions(data.map((item) => ({
                    key: item.id,
                    label: item.management_number,
                    value: item.management_number,
                    name: item.measuring_tool_name,
                    span: item.measurement_span,
                    accuracy: item.accuracy
                  })))
                } else {
                  setDeviceOptions([])
                }
              })
            }}
          />
        )
      },
      {
        span: 8,
        label: '检测设备名称',
        name: 'detection_device_name',
        formItem: <Input disabled />
      },
      {
        span: 8,
        label: '测量范围',
        name: 'measurement_range',
        formItem: <Input disabled />
      }
    ],
    [
      {
        span: 8,
        label: '分辨率',
        name: 'resolution',
        formItem: <Input disabled />
      },
      {
        span: 8,
        label: '被测特性',
        name: 'measured_characteristic',
        formItem: <Input />
      },
      {
        span: 8,
        label: '工序名称',
        name: 'process_name',
        formItem: <Input />
      },
    ],
    [
      {
        span: 8,
        label: 'MSA分析项目',
        name: 'msa_analysis_item',
        formItem: <Select options={msaAnalysisItem} />
      },
      {
        span: 8,
        label: '分析人',
        name: 'analyst',
        formItem: <Input />
      },
      {
        span: 8,
        label: '测量人员',
        name: 'measurement_personnel',
        formItem: <Input />
      },
    ],
    [
      {
        span: 8,
        label: '计划完成日期',
        name: 'planned_completion_date',
        getValueProps: value => ({value: value && dayjs(value)}),
        normalize: value => value && `${dayjs(value).format('YYYY-MM-DD')}`,
        formItem: <DatePicker />
      },
      {
        span: 8,
        label: '备注',
        name: 'remarks',
        formItem: <Input />
      },
    ]
  ]
  const handleOk = () => {
    form.validateFields().then(values => {
      if (isEdit) {
        const {key, ...rest} = row
        updateMSAYearPlanContent({...rest, ...values}, () => {
          message.success(`编辑成功`)
          setVisible(false)
          refresh()
        })
      } else {
        createMSAYearPlanContent({apply_device_id: yearPlan.id, ...values}, () => {
          message.success(`添加成功`)
          setVisible(false)
          form.resetFields()
          refresh()
        })
      }
    })
  }
  useEffect(() => {
    if (isEdit && visible) {
      form.setFieldsValue(row)
    } else if (!isEdit && visible) {
      form.resetFields()
    }
  }, [visible])
  return (
    <Modal
      title={`${isEdit ? '编辑' : '新增'}`}
      open={visible}
      onOk={() => handleOk()}
      onCancel={() => setVisible(false)}
      width={1000}>
      <CustomForm
        labelAlign={'right'}
        labelCol={{span: 10}}
        form={form}
        formItems={formItems}
      />
    </Modal>
  )
};
export default YearContentModal;

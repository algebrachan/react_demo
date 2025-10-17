import CustomForm from '../../../../../../components/CustomSeries/CustomForm.jsx'
import {DatePicker, Form, Input, message, Modal, Select} from 'antd'
import {getToolsLedger, updateMSAPlanReport} from '../../../../../../apis/qms_router.jsx'
import dayjs from 'dayjs'
import {useEffect} from 'react'
import {RowDownload, RowUpload} from '../Apply4Use/DistributionModal.jsx'

const MSAReportModal = ({
  visible,
  setVisible,
  refresh,
  row
}) => {
  const [form] = Form.useForm()
  const formItems = [
    [
      {
        span: 12,
        label: '检测设备编号',
        name: 'detection_device_id',
        formItem: (<Input disabled />)
      },
      {
        span: 12,
        label: '检测设备名称',
        name: 'detection_device_name',
        formItem: <Input disabled />
      }
    ],
    [
      {
        span: 12,
        label: '测量范围',
        name: 'measurement_range',
        formItem: <Input disabled />
      },
      {
        span: 12,
        label: '分辨率',
        name: 'resolution',
        formItem: <Input disabled />
      }],
    [
      {
        span: 12,
        label: '被测特性',
        name: 'measured_characteristic',
        formItem: <Input disabled />
      },
      {
        span: 12,
        label: '工序名称',
        name: 'process_name',
        formItem: <Input disabled />
      },
    ],
    [
      {
        span: 12,
        label: 'MSA分析项目',
        name: 'msa_analysis_item',
        formItem: <Input disabled />
      },
      {
        span: 12,
        label: '分析人',
        name: 'analyst',
        formItem: <Input disabled />
      }
    ],
    [
      {
        span: 12,
        label: '测量人员',
        name: 'measurement_personnel',
        formItem: <Input disabled />
      },
      {
        span: 12,
        label: '计划完成日期',
        name: 'planned_completion_date',
        getValueProps: value => ({value: value && dayjs(value)}),
        normalize: value => value && `${dayjs(value).format('YYYY-MM-DD')}`,
        formItem: <DatePicker disabled />
      }
    ],
    [
      {
        span: 12,
        label: '备注',
        name: 'remarks',
        formItem: <Input disabled />
      },
      {
        span: 12,
        label: '分析结果',
        name: 'result',
        formItem: <Select options={[{value: 'OK'}, {value: 'NO'}]} />
      },
    ],
    [
      {
        span: 12,
        label: '附件',
        formItem: <RowDownload row={row} />
      },
      {
        span: 12,
        label: '上传附件',
        formItem: <RowUpload row={row} refresh={refresh} params={{typeof: 5, id: row.id}} />
      },
    ]
  ]
  const handleOk = () => {
    const {result} = form.getFieldsValue()
    updateMSAPlanReport({plan_content_id: row.id, result}, () => {
      message.success('操作成功')
      setVisible(false)
      refresh()
    })
  };
  useEffect(() => {
    if (visible) {
      form.setFieldsValue({...row, result: row.result})
    }
  }, [visible])
  return (
    <Modal
      title={`MSA报告`}
      open={visible}
      onOk={() => handleOk()}
      onCancel={() => setVisible(false)}
      width={800}>
      <CustomForm
        labelAlign={'right'}
        labelCol={{span: 10}}
        form={form}
        formItems={formItems}
      />
    </Modal>
  )
};
export default MSAReportModal;

import {Button, Input, message, Modal, Table, Upload} from 'antd'
import {useEffect, useState} from 'react'
import {isTrue} from '../../dict.js'
import {uploadToolsLedger, downloadLedgerReport, deviceApplyDistribution} from '../../../../../../apis/qms_router.jsx'
import {DownloadOutlined} from '@ant-design/icons'

export const RowDownload = ({row}) => {
  const {file_name: fileName, file_path: filePath} = row
  const handleDownload = () => {
    downloadLedgerReport({path: filePath}, ({data, headers}) => {
      const blob = new Blob([data]);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.style.display = 'none'
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(link);
    })
  }
  return (
    filePath ?
      <Button
        onClick={handleDownload}
        size="small"
        icon={<DownloadOutlined />}
      >{fileName}</Button> :
      ''
  )
}
export const RowUpload = ({row, refresh, params}) => {
  const [fileList, setFileList] = useState([])
  useEffect(() => {
    setFileList([])
  }, [row])
  return (
    <Upload
      maxCount={1}
      fileList={fileList}
      onRemove={() => {setFileList([])}}
      beforeUpload={file => {
        setFileList([file])
        setTimeout(() => {
          const formData = new FormData()
          formData.append('file', file)
          uploadToolsLedger(params, formData, (res) => {
            message.success('上传成功！')
            refresh()
          })
        })
        return false
      }}
    >
      <Button style={{marginRight: 10}} size="small">点击上传</Button>
    </Upload>
  )
}
export const DistributionModal = ({
  open,
  setOpen,
  refresh,
  row
}) => {
  const [tbData, setTbData] = useState([])
  const handleTableChange = (value, field, index) => {
    const newData = [...tbData];
    if (newData[index]) {
      newData[index][field] = value;
      setTbData(newData);
    }
  };
  const generateColumns = () => {
    return [
      {title: '序号', dataIndex: 'key'},
      {title: '设备名称', dataIndex: 'equipment_name'},
      {title: '物料号', dataIndex: 'material_number'},
      {title: '设备型号', dataIndex: 'equipment_model'},
      {title: '设备量程', dataIndex: 'equipment_range'},
      {title: '设备精度', dataIndex: 'equipment_accuracy'},
      {
        title: '是否旧设备',
        dataIndex: 'is_exist',
        render: (text, record, index) => {
          return isTrue.find(item => item.value === text)?.label
        }
      },
      {title: '设备编号', dataIndex: 'old_number'},
      {
        title: '原因',
        dataIndex: 'reason',
        width: 260,
        render: (text, record, index) => {
          return <Input value={text} disabled={record.is_exist} onChange={(e) => handleTableChange(e.target.value, 'reason', index)}
          />
        }
      },
      {
        title: '附件',
        render: (_, record, index) => {
          return <RowDownload row={record} index={index} />
        }
      },
      {
        title: '附件上传',
        render: (_, record, index) => {
          return <RowUpload row={record} refresh={refresh} params={{id: row.id, typeof: 4, index}} />
        }
      }
    ]
  }
  const handleOk = () => {
    const newData = tbData.map(({is_exist, old_number, reason}) => ({is_exist, old_number, reason}))
    deviceApplyDistribution({id: row.id, equipment_replacement: newData}, (res) => {
      message.success('发放成功！')
      setOpen(false)
      refresh()
    })
  }
  useEffect(() => {
    const {
      id,
      equipment_replacement = [],
      equipment_name,
      material_number,
      equipment_model,
      equipment_range,
      equipment_accuracy
    } = row
    setTbData(equipment_replacement.map(({is_exist, old_number, reason, file_path, file_name}, index) => ({
      key: index,
      id,
      equipment_name,
      material_number,
      equipment_model,
      equipment_range,
      equipment_accuracy,
      is_exist,
      old_number,
      reason,
      file_path,
      file_name
    })))
  }, [row]);
  return (
    <Modal
      title={`设备发放`}
      open={open}
      onOk={() => handleOk()}
      onCancel={() => setOpen(false)}
      width={1500}
    ><Table
      size="small"
      columns={generateColumns()}
      dataSource={tbData}
      bordered
      scroll={{x: "max-content",}}
    />
    </Modal>
  )
};
export default DistributionModal;

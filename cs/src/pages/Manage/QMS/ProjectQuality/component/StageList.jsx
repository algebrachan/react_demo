import CustomForm from '@/components/CustomSeries/CustomForm.jsx'
import {Button, DatePicker, Descriptions, Form, Input, message, Popconfirm, Select, Table, Upload} from 'antd'
import styles from '../style/index.module.less'
import {
  delete_matter_quality,
  delete_stage_quality,
  download_matter_file,
  online_review,
  read_matter_quality,
  read_stage_quality,
  real_review
} from '@/apis/qms_router.jsx'
import {useEffect, useState} from 'react'
import dayjs from 'dayjs'
import {ArrowLeftOutlined, DownloadOutlined, UploadOutlined} from '@ant-design/icons'
import StageListModal from '@/pages/Manage/QMS/ProjectQuality/component/StageListModal.jsx'
import MatterListModal from '@/pages/Manage/QMS/ProjectQuality/component/MatterListModal.jsx'
import FilePreview from '@/pages/Manage/QMS/ProjectQuality/component/FilePreview.jsx'

const stageList = ({open, setOpen, projectInfo, style}) => {
  const [form] = Form.useForm()
  const [stageModalOpen, setStageModalOpen] = useState(false)
  const [matterModalOpen, setMatterModalOpen] = useState(false)
  const [previewModalOpen, setPreviewModalOpen] = useState(false)
  const [previewHtmlContent, setPreviewHtmlContent] = useState('')
  const [isStageEdit, setIsStageEdit] = useState(false)
  const [isMatterEdit, setIsMatterEdit] = useState(false)
  const [fileBlob, setFileBlob] = useState(null)
  const [curRowData, setCurRowData] = useState({})
  const [stageTbData, setStageTbData] = useState([])
  const [matterTbData, setMatterTbData] = useState([])
  const [tb_data, setTbData] = useState([])
  const [tb_load, setTbLoad] = useState(false)
  const getStageList = () => {
    return new Promise((resolve, reject) => {
      read_stage_quality(
        {project_id: projectInfo.id},
        ({data: {data}}) => {
          setStageTbData(data)
          resolve()
        },
        (e) => reject(e)
      )
    })
  }
  const getMatterList = () => {
    return new Promise((resolve, reject) => {
      read_matter_quality(
        {project_id: projectInfo.id},
        ({data: {data}}) => {
          setMatterTbData(data)
          resolve()
        },
        (e) => reject(e)
      )
    })
  }
  const getTbData = (promises) => {
    setTbLoad(true)
    Promise.all(promises.map(fn => fn()))
    .finally(() => {
      setTbLoad(false)
    })
  }
  const handleAddStage = () => {
    setIsStageEdit(false)
    setStageModalOpen(true)
  }
  const handleDeleteStage = (row) => {
    delete_stage_quality(
      {id: row.stage_id},
      () => {
        message.success('删除成功')
        getTbData([getStageList])
      }
    )
  };
  const handleAddMatter = (row) => {
    setCurRowData(row)
    setIsMatterEdit(false)
    setMatterModalOpen(true)
  }
  const handleDeleteMatter = (row) => {
    delete_matter_quality(
      {id: row.matter_id},
      () => {
        message.success('删除成功')
        getTbData([getMatterList])
      }
    )
  };
  const handleDownload = () => {
    const url = URL.createObjectURL(fileBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileBlob.name;
    document.body.appendChild(link);
    link.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(link);
  }
  const getOnlinePath = async (file_path) => {
    let fullUrl = ''
    await download_matter_file(
      {path: file_path},
      ({data: {data}}) => {
        const {url} = data
        fullUrl = url
      }
    )
    return fullUrl
  }
  const handlePreview = ({url, file_name}) => {
    fetch(url)
    .then(response => response.blob())
    .then(blob => {
      const file = new File([blob], file_name, {type: blob.type});
      setFileBlob(file);
      const formData = new FormData();
      formData.append('file', file);
      real_review(formData,
        ({data}) => {
          setPreviewHtmlContent(data);
          setPreviewModalOpen(true);
        });
    })
  }
  const handleGetFile = async ({file_path, file_name}) => {
    const url = await getOnlinePath(file_path)
    handlePreview({file_name, url})
  }
  const generateColumns = () => ([
    {title: '阶段名称', dataIndex: 'stage_name', width: 120, fixed: 'left', onCell: ({rowSpan}) => ({rowSpan})},
    {title: '阶段编号', dataIndex: 'stage_code', width: 80, onCell: ({rowSpan}) => ({rowSpan})},
    {title: '阶段负责人', dataIndex: 'stage_charge_person', width: 120, onCell: ({rowSpan}) => ({rowSpan})},
    {title: '阶段计划开始时间', dataIndex: 'stage_plan_start', width: 160, onCell: ({rowSpan}) => ({rowSpan})},
    {title: '阶段计划结束时间', dataIndex: 'stage_plan_end', width: 160, onCell: ({rowSpan}) => ({rowSpan})},
    {
      title: '阶段操作',
      onCell: ({rowSpan}) => ({rowSpan}),
      width: 300,
      render: (_, record) => {
        return (
          <>
            <Button variant={'text'} color={'primary'}
                    onClick={() => handleAddMatter(record)}>新建事项</Button>
            <Button variant={'text'} color={'primary'} onClick={() => {
              setCurRowData(record)
              setIsStageEdit(true)
              setStageModalOpen(true)
            }}>编辑阶段</Button>
            <Popconfirm
              title="确定删除该条数据吗？"
              onConfirm={() => handleDeleteStage(record)}
              okText="确定"
              cancelText="取消"
            ><Button variant={'text'} color={'danger'}>删除阶段</Button>
            </Popconfirm>
          </>
        )
      }
    },
    {title: '事项名称', dataIndex: 'matter_name', width: 400},
    {
      title: '事项附件',
      dataIndex: 'file_name',
      width: 200,
      render: (text, record) => {
        return record.matter_id &&
          <Button
            variant={'text'}
            color={'primary'}
            onClick={() => handleGetFile(record)}
            size="small"
          >{text}</Button>
      }
    },
    {
      title: '事项操作',
      fixed: 'right',
      width: 200,
      render: (_, record) => {
        return (record.matter_id &&
          <div>
            <Button variant={'text'} color={'orange'} onClick={() => {
              setCurRowData(record)
              setIsMatterEdit(true)
              setMatterModalOpen(true)
            }}>编辑事项</Button>
            <Popconfirm
              title="确定删除该条数据吗？"
              onConfirm={() => handleDeleteMatter(record)}
              okText="确定"
              cancelText="取消"
            ><Button variant={'text'} color={'danger'}>删除事项</Button>
            </Popconfirm>
          </div>
        )
      }
    }
  ])
  const formItems = [
    [{
      span: 24,
      formItem: (
        <div style={{display: 'flex', justifyContent: 'flex-start', marginBottom: 16}}>
          <Button icon={<ArrowLeftOutlined />} onClick={() => setOpen(false)}>返回</Button>
        </div>
      )
    }],
    [{
      span: 24,
      formItem: (
        <Descriptions style={{marginBottom: 16}} size={'small'} title={'项目信息'} items={[
          {key: '1', label: '项目名称', children: projectInfo.project_name},
          {key: '2', label: '项目编号', children: projectInfo.project_code},
          {key: '3', label: '项目负责人', children: projectInfo.project_charge_person},
          {key: '4', label: '项目计划开始时间', children: projectInfo.project_plan_start},
          {key: '5', label: '项目计划结束时间', children: projectInfo.project_plan_end},
        ]}></Descriptions>
      )
    }],
    [{
      span: 24,
      formItem: (
        <div style={{display: 'flex', justifyContent: 'flex-start'}}>
          <Button variant={'solid'} color={'primary'} style={{marginRight: 8}}
                  onClick={handleAddStage}>新建阶段</Button>
        </div>
      )
    }]
  ]
  useEffect(() => {
    if (open) {
      getTbData([getStageList, getMatterList])
    }
  }, [open]);
  useEffect(() => {
    const newStageTbData = stageTbData.map(stageItem => ({
      ...stageItem,
      matter_list: matterTbData.filter(matterItem => matterItem.stage_id === stageItem.id)
    }))
    const newTbData = newStageTbData.reduce((acc, cur) => {
      const {matter_list, ...stageItem} = cur
      const {id: stage_id, ...restStageItem} = stageItem
      const matterListLength = matter_list.length
      if (matterListLength) {
        matter_list.forEach((matterItem, index) => {
          const {id: matter_id, ...restMatterItem} = matterItem
          acc.push({
            id: matter_id,
            stage_id,
            matter_id,
            rowSpan: index === 0 ? matterListLength : 0, ...restStageItem, ...restMatterItem
          })
        })
      } else {
        acc.push({id: stage_id, stage_id, rowSpan: 1, ...restStageItem})
      }
      return acc
    }, [])
    setTbData(newTbData)
  }, [matterTbData, stageTbData]);
  return (
    <div className={styles['stage']} style={{...style}}>
      <CustomForm form={form} formItems={formItems}></CustomForm>
      <Table
        rowKey={'id'}
        loading={tb_load}
        size="small"
        columns={generateColumns()}
        dataSource={tb_data}
        bordered
        scroll={{
          x: "max-content",
          y: `calc(100vh - 422px)`,
        }}
        pagination={false}
      ></Table>
      <StageListModal
        open={stageModalOpen}
        setOpen={setStageModalOpen}
        isEdit={isStageEdit}
        refresh={getStageList}
        row={curRowData}
        projectInfo={projectInfo}
      ></StageListModal>
      <MatterListModal
        open={matterModalOpen}
        setOpen={setMatterModalOpen}
        isEdit={isMatterEdit}
        refresh={getMatterList}
        row={curRowData}
      ></MatterListModal>
      <FilePreview
        htmlContent={previewHtmlContent}
        open={previewModalOpen}
        setOpen={setPreviewModalOpen}
        footer={[
          <Button
            key={'download'}
            type={'primary'}
            style={{marginRight: 8}}
            onClick={() => handleDownload()}
          >下载</Button>
        ]}
      ></FilePreview>
    </div>
  )
}
export default stageList;

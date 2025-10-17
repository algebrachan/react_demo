import {Button, Modal} from 'antd'

const FilePreview = ({htmlContent, title = '预览', footer = [], open, setOpen}) => {
  return (
    <Modal
      title={title}
      open={open}
      onCancel={() => setOpen(false)}
      footer={[
        <div key="footer">
          {...footer}
          <Button key="close" onClick={() => setOpen(false)}>
            关闭
          </Button>
        </div>
      ]}
      width={1400}
      style={{
        maxHeight: '80vh',
        overflow: 'auto'
      }}
    >
      <iframe
        srcDoc={htmlContent}
        style={{
          width: '100%',
          padding: 0,
          border: 'none',
          backgroundColor: '#fafafa',
          height: '60vh',
          overflow: 'auto'
        }}
      />
    </Modal>
  )
}
export default FilePreview;

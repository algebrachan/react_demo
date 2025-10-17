import {Table, Tabs} from 'antd'

const SOP = ({fileInfo = [], tableName = [], columns, data, scroll = {}}) => {
  const items = tableName.map((item, index) => {
    return {
      label: item[0],
      key: String(index + 1),
      children: (
        <Table
          rowKey={'0'}
          scroll={{x: 'max-content', y: 400, ...scroll}}
          size={'small'}
          pagination={false}
          columns={columns[index].map((column, columnIndex) => ({title: column, dataIndex: columnIndex + 1}))}
          dataSource={data[index].map((row, rowIndex) => [rowIndex, ...row])}
        />
      )
    }
  })
  return (
    <Tabs
      defaultActiveKey="1"
      items={items}
    >
    </Tabs>
  )
}
export default SOP

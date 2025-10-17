export const ParseCsvString = (csvString) => {
  const rows = csvString.split('\n').filter(i => i !== '').map(row => row.replace('\r', '').split('\t'))
  const fileInfo = []
  const tableName = []
  const columns = []
  const data = []
  let fileFlag = true, tableFlag = false
  for (let i = 0, l = rows.length, j = 0; i < l; i++) {
    if (rows[i].every(i => i === '')) {
      fileFlag = false
      tableFlag = true
      continue
    }
    if (fileFlag) fileInfo.push(rows[i])
    else if (tableFlag) {
      tableName.push(rows[i])
      columns.push(rows[i + 1])
      data.push([])
      i++
      j++
      tableFlag = false
    } else {
      data[j - 1].push(rows[i])
    }
  }
  return {fileInfo, tableName, columns, data}
}
export const EncodeCSVString = ({fileInfo, tableName, columns, data}) => {
  let csvRows = [];
  // 添加 fileInfo 部分
  fileInfo.forEach(row => {
    csvRows.push(row.join('\t'))
  });
  // 添加空行作为分隔符
  csvRows.push(''); // 空行分隔
  tableName.forEach((tableRow, tableIndex) => {
    // 添加表名行
    csvRows.push(tableRow.join('\t'));
    // 添加列名行
    if (columns[tableIndex]) {
      csvRows.push(columns[tableIndex].join('\t'));
    }
    if (data[tableIndex]) {
      data[tableIndex].forEach(dataRow => {
        csvRows.push(dataRow.join('\t'))
      })
    }
    csvRows.push('');
  });
  // 使用 \r\n 作为行结束符，确保兼容性
  return csvRows.join('\r\n');
}
export const EncodeUTF16LEWithBOM = (str) => {
  // UTF-16 LE BOM: 0xFF 0xFE
  const bom = new Uint8Array([0xFF, 0xFE]);
  // 每个字符转换为2个字节（UTF-16 LE）
  const buffer = new ArrayBuffer(str.length * 2);
  const view = new DataView(buffer);
  for (let i = 0; i < str.length; i++) {
    view.setUint16(i * 2, str.charCodeAt(i), true); // true表示Little Endian
  }
  // 合并BOM和编码数据
  const result = new Uint8Array(bom.length + buffer.byteLength);
  result.set(bom, 0);
  result.set(new Uint8Array(buffer), bom.length);
  return result;
}
export const ParseSop = (file) => {
  const filename = file.name
  const isFile = (file) => Object.prototype.toString.call(file) === '[object File]'
  if (!isFile(file) && (filename.endsWith('.csv') || filename.endsWith('.CSV'))) {
    return Promise.reject('该文件无法解析，请重新上传后重试！')
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const csvContent = e.target.result;
      const {fileInfo, tableName, columns, data} = ParseCsvString(csvContent)
      resolve({fileInfo, tableName, columns, data})
    };
    reader.onerror = (event) => {
      reject(event.target.error);
    };
    reader.readAsText(file);
  })
}
export default ParseSop

import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const BoxPlot = ({ data, title = '箱线图' }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!data || !data.x_axis || !data.ydata) return;

    // 初始化图表
    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    const option = {
      title: {
        text: title,
        left: 'center',
        textStyle: {
          fontSize: 14,
          fontWeight: 'normal'
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: function(param) {
          return [
            '工艺组' + param.name + ': ',
            '上边缘: ' + param.data[5],
            'Q3: ' + param.data[4],
            '中位数: ' + param.data[3],
            'Q1: ' + param.data[2],
            '下边缘: ' + param.data[1]
          ].join('<br/>');
        }
      },
      grid: {
        left: '20px',
        right: '20px',
        bottom: '15%',
        top: '15%'
      },
      xAxis: {
        type: 'category',
        data: data.x_axis.values || [],
        boundaryGap: true,
        nameGap: 30,
        splitArea: {
          show: false
        },
        axisLabel: {
          formatter: '工艺组{value}'
        },
        splitLine: {
          show: false
        }
      },
      yAxis: {
        type: 'value',
        name: '数值',
        splitArea: {
          show: true
        }
      },
      series: [{
        name: 'boxplot',
        type: 'boxplot',
        data: data.ydata.values || [],
        itemStyle: {
          color: '#1890ff'
        },
        boxWidth: [7, 50]
      }]
    };

    chartInstance.current.setOption(option);

    // 监听窗口大小变化
    const handleResize = () => {
      chartInstance.current?.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [data, title]);

  useEffect(() => {
    return () => {
      if (chartInstance.current) {
        chartInstance.current.dispose();
      }
    };
  }, []);

  return <div ref={chartRef} style={{ width: '100%', height: '400px' }} />;
};

export default BoxPlot;
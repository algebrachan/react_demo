import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { Spin } from 'antd';

const ParetoChart = ({ data, loading = false }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      // 初始化图表
      chartInstance.current = echarts.init(chartRef.current);
      
      // 监听窗口大小变化
      const handleResize = () => {
        chartInstance.current?.resize();
      };
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        chartInstance.current?.dispose();
      };
    }
  }, []);

  useEffect(() => {
    if (chartInstance.current && data) {
      renderChart();
    }
  }, [data]);

  const renderChart = () => {
    const paretoData = data?.['柏拉图数据'] || {};
    
    const option = {
      title: {
        text: '不合格物料柏拉图分析',
        left: 'center',
        textStyle: {
          fontSize: 14,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      legend: {
        data: ['不合格数量', '累计百分比'],
        bottom: '20px'
      },
      xAxis: [
        {
          type: 'category',
          data: paretoData.categories || [],
          axisPointer: {
            type: 'shadow'
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: '不合格数量',
          position: 'left',
          axisLabel: {
            formatter: '{value}'
          }
        },
        {
          type: 'value',
          name: '累计百分比',
          position: 'right',
          axisLabel: {
            formatter: '{value}%'
          }
        }
      ],
      series: [
        {
          name: '不合格数量',
          type: 'bar',
          data: paretoData.values || [],
          itemStyle: {
            color: '#1890ff'
          }
        },
        {
          name: '累计百分比',
          type: 'line',
          yAxisIndex: 1,
          data: paretoData.cumulative_percentages || [],
          itemStyle: {
            color: '#52c41a'
          },
          lineStyle: {
            width: 3
          },
          symbol: 'circle',
          symbolSize: 6
        }
      ]
    };
    
    chartInstance.current.setOption(option);
  };

  return (
    <Spin spinning={loading}>
      <div 
        ref={chartRef} 
        style={{ 
          width: '100%', 
          height: '350px',
          border: '1px solid #f0f0f0',
          borderRadius: '8px'
        }}
      />
    </Spin>
  );
};

export default ParetoChart;
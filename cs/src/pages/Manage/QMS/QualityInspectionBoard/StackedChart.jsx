import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { Spin } from 'antd';

const StackedChart = ({ data, loading = false }) => {
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
    const chartData = data?.qualified_chart || {};
    
    const option = {
      title: {
        text: '检验数量与合格率趋势',
        left: 'center',
        textStyle: {
          fontSize: 14,
          fontWeight: 'bold'
        }
      },
      grid: {
        top: '60px',
        left: '15px',
        right: '15px',
        bottom: '45px',
        containLabel: true
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      legend: {
        data: ['合格', '不合格', '合格率'],
        bottom: '20px'
      },
      xAxis: [
        {
          type: 'category',
          data: chartData.xdata || [],
          axisPointer: {
            type: 'shadow'
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: '数量',
          position: 'left',
          axisLabel: {
            formatter: '{value}'
          }
        },
        {
          type: 'value',
          name: '合格率',
          position: 'right',
          axisLabel: {
            formatter: '{value}%'
          }
        }
      ],
      series: [
        {
          name: '合格',
          type: 'bar',
          stack: '总量',
          data: chartData['合格'] || [],
          itemStyle: {
            color: '#52c41a',
          }
        },
        {
          name: '不合格',
          type: 'bar',
          stack: '总量',
          data: chartData['不合格'] || [],
          itemStyle: {
            color: '#ff4d4f'
          }
        },
        {
          name: '合格率',
          type: 'line',
          yAxisIndex: 1,
          data: chartData['合格率'] || [],
          itemStyle: {
            color: '#1890ff'
          },
          lineStyle: {
            width: 3,
            color: '#1890ff'
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

export default StackedChart;
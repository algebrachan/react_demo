import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { Spin } from 'antd';

const PieChart = ({ data, loading = false }) => {
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
    const option = {
      title: {
        text: '检验结果分布',
        left: 'center',
        textStyle: {
          fontSize: 14,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'horizontal',
        bottom: '20px',
        data: ['合格', '不合格']
      },
      series: [
        {
          name: '检验结果',
          type: 'pie',
          radius: ['40%', '60%'],
          center: ['50%', '45%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: true,
            position: 'outside',
            formatter: '{b}: {c}'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '16',
              fontWeight: 'bold'
            }
          },
          data: [
            { 
              value: data?.['合格'] || 0, 
              name: '合格',
              itemStyle: { color: '#52c41a' }
            },
            { 
              value: data?.['不合格'] || 0, 
              name: '不合格',
              itemStyle: { color: '#ff4d4f' }
            }
          ]
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

export default PieChart;
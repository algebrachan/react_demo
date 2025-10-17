import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const BarChart = ({ data, title = '柱状图' }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    console.log('BarChart接收到的数据:', data);
    if (!data || !data.x_axis || !data.ydata) {
      console.log('BarChart数据验证失败:', { data, x_axis: data?.x_axis, ydata: data?.ydata });
      return;
    }

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
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '0px',
        top: '30px',
        containLabel: true
      },
      xAxis: {
        type: 'value'
      },
      yAxis: {
        type: 'category',
        data: data.x_axis.values || [],
        axisLabel: {
          interval: 0
        }
      },
      series: [{
        type: 'bar',
        data: data.ydata.values || [],
        itemStyle: {
          color: '#1890ff'
        },
        barWidth: '15px'
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

export default BarChart;
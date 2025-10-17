import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const StackedChart = ({ data, title = '堆叠图',height }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    console.log('StackedChart接收到的数据:', data);
    if (!data || !data.x_axis || !data.ydata) {
      console.log('StackedChart数据验证失败:', { data, x_axis: data?.x_axis, ydata: data?.ydata });
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
        },
        formatter: function(params) {
          let result = params[0].axisValue + '<br/>';
          params.forEach(param => {
            result += `${param.seriesName}: ${param.value}%<br/>`;
          });
          return result;
        }
      },
      legend: {
        data: data.legend || [],
        top: 30
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '60px',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: data.x_axis.values || [],
        axisLabel: {
          rotate: 0
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value}%'
        }
      },
      series: (data.legend || []).map((name, index) => ({
        name: name,
        type: 'bar',
        stack: 'total', barWidth: '15px',
        data: data.ydata.values.map(item => item[index] || 0),
        itemStyle: {
          color: index === 0 ? '#1890ff' : '#52c41a'
        }
      }))
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

  return <div ref={chartRef} style={{ width: '100%', height: height || 400}} />;
};

export default StackedChart;
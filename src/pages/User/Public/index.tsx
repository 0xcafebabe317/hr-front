import {
  confirm,
  dispute,
  getPublicResult,
  getTempScore,
  getTotalScore,
  isConfirm,
  isDispute,
} from '@/services/backend/PerformanceContracts';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Button, message, Modal, Table, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';

const Score: React.FC = () => {
  const [data, setData] = useState<API.ContractsPage | null>(null);
  const [scores, setScores] = useState<Record<number, number>>({});
  const [isConfirmed, setIsConfirmed] = useState(false); // 确认状态
  const [isDisputed, setIsDisputed] = useState(false); // 争议状态
  const [totalScore, setTotalScore] = useState<number>(0); // 总分

  // 获取表格数据和临时分数
  const fetchData = async (current: number = 1, pageSize: number = 10) => {
    try {
      const response = await getPublicResult({ current, pageSize });
      if (response.data) {
        setData(response.data);
        const ids = response.data.records.map((record) => record.id);
        if (ids.length > 0) {
          const tempScoreResponse = await getTempScore({ ids: ids });
          setScores((prevScores) => ({
            ...prevScores,
            ...tempScoreResponse.data, // 合并当前页面的分数与之前的分数
          }));
        }
      } else {
        setData(null);
      }
    } catch (error) {
      message.error('获取数据失败');
    }
  };

  // 获取确认状态
  const fetchConfirmationStatus = async () => {
    try {
      const response = await isConfirm();
      setIsConfirmed(response.data);
    } catch (error) {
      message.error('获取确认状态失败');
    }
  };

  const fetchDisputeStatus = async () => {
    try {
      const response = await isDispute();
      setIsDisputed(response.data);
    } catch (error) {
      message.error('获取争议状态失败');
    }
  };

  useEffect(() => {
    fetchData(1, 10);
    fetchConfirmationStatus();
    fetchDisputeStatus(); // 获取争议状态

    // 获取总分
    const fetchTotalScore = async () => {
      try {
        const response = await getTotalScore();
        setTotalScore(response.data); // 设置总分
      } catch (error) {
        message.error('获取总分失败');
      }
    };

    fetchTotalScore(); // 调用获取总分的函数
  }, []);

  // 确认结果操作
  const handleConfirmResult = () => {
    Modal.confirm({
      title: '确定提示',
      content: '确定评分后将不可修改，请确定是否继续？',
      onOk: async () => {
        try {
          await confirm(); // 调用确认 API
          message.success('结果已确定');
          fetchConfirmationStatus(); // 更新确认状态
          fetchData(); // 刷新数据
        } catch (error) {
          message.error('确定失败');
        }
      },
    });
  };

  const handleDispute = () => {
    Modal.confirm({
      title: '有异议',
      content: '标记为有异议后可在【22日9:30-23日18:30日】向人力资源部申请修改，是否确定标记？',
      onOk: async () => {
        try {
          await dispute(); // 调用争议 API
          message.success('已发起争议');
          fetchDisputeStatus(); // 更新争议状态
          fetchData(); // 刷新数据
        } catch (error) {
          message.error('发起争议失败');
        }
      },
    });
  };

  const columns = [
    {
      title: '大类名称',
      dataIndex: 'categories',
      key: 'categories',
      align: 'center',
      ellipsis: true,
      width: '150px',
    },
    {
      title: '小类名称',
      dataIndex: 'sub_categories',
      key: 'sub_categories',
      align: 'center',
      ellipsis: true,
      width: '120px',
    },
    {
      title: '指标',
      dataIndex: 'indicators',
      key: 'indicators',
      align: 'center',
      ellipsis: true,
      width: '250px',
    },
    {
      title: '考核部门',
      dataIndex: 'assessment_dept',
      key: 'assessment_dept',
      align: 'center',
      ellipsis: true,
      width: '100px',
    },
    {
      title: '权重',
      dataIndex: 'weight',
      key: 'weight',
      align: 'center',
      ellipsis: true,
      width: '80px',
    },
    {
      title: '计分方法',
      dataIndex: 'scoring_method',
      key: 'scoring_method',
      align: 'center',
      ellipsis: true,
      width: '300px',
    },
    {
      title: '考核周期',
      dataIndex: 'assessment_cycle',
      key: 'assessment_cycle',
      align: 'center',
      ellipsis: true,
      width: '100px',
    },
    {
      title: '被考核单位',
      dataIndex: 'assessed_unit',
      key: 'assessed_unit',
      align: 'center',
      ellipsis: true,
      width: '150px',
    },
    {
      title: '被考核中心',
      dataIndex: 'assessed_center',
      key: 'assessed_center',
      align: 'center',
      ellipsis: true,
      width: '120px',
    },

    {
      title: '其他',
      dataIndex: 'other',
      key: 'other',
      align: 'center',
      ellipsis: true,
      width: '100px',
    },
    {
      title: '被考核人',
      dataIndex: 'assessed_people',
      key: 'assessed_people',
      align: 'center',
      ellipsis: true,
      width: '120px',
      fixed: 'right', // 固定这列
    },
    {
      title: '得分',
      width: '100px',
      key: 'score',
      fixed: 'right', // 固定这列
      render: (text: any, record: API.PerformanceContracts) => {
        const scoreValue = scores[record.id] !== undefined ? scores[record.id] : 0;
        return scoreValue;
      },
      align: 'center',
    },
  ];

  return (
    <div>
      <div
        style={{
          marginBottom: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* 仅当有数据时才显示按钮和总分 */}
        {data?.records && data.records.length > 0 && (
          <>
            {/* 按钮区域 */}
            <div>
              {isDisputed ? (
                <Button type="default" disabled>
                  已发起异议
                </Button>
              ) : isConfirmed ? (
                <Button type="primary" disabled>
                  已确定
                </Button>
              ) : (
                <>
                  <Button type="primary" onClick={handleConfirmResult} style={{ marginRight: 8 }}>
                    确定结果
                  </Button>
                  <Button type="default" onClick={handleDispute} style={{ marginRight: 8 }}>
                    有异议
                    <Tooltip title="最终结果得分将由人力部修改">
                      <QuestionCircleOutlined
                        style={{ marginLeft: 2, color: '#1890ff', cursor: 'pointer' }}
                      />
                    </Tooltip>
                  </Button>
                </>
              )}
            </div>

            {/* 总分显示区域 */}
            <span style={{ fontSize: '18px', fontWeight: 'bold', marginRight: '50px' }}>
              总分: {totalScore}
            </span>
          </>
        )}
      </div>

      <Table
        dataSource={data?.records}
        columns={columns}
        rowKey="id"
        scroll={{ y: 1000, x: 2000 }} // 设置固定高度，超出的部分显示滚动条
        pagination={{
          current: data?.current,
          pageSize: data?.size, // 确保这个值是实际的每页显示条数
          total: data?.total,
          showSizeChanger: true, // 显示页码选择器
          pageSizeOptions: ['10', '20', '30', '50'], // 可选的每页显示条数
          onChange: (current, pageSize) => fetchData(current, pageSize), // 改变页码时刷新数据
          onShowSizeChange: (current, pageSize) => fetchData(current, pageSize), // 改变每页显示的条数时刷新数据
        }}
      />
    </div>
  );
};

export default Score;

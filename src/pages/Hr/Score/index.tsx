import {
  ArgueScore,
  getDisputeList,
  getHrContractsScore,
  getTempScore,
} from '@/services/backend/PerformanceContracts';
import { Button, Input, message, Modal, Table } from 'antd';
import React, { useEffect, useState } from 'react';

const Score: React.FC = () => {
  const [data, setData] = useState<API.ContractsPage | null>(null);
  const [scores, setScores] = useState<Record<number, number>>({});
  const [argueScores, setArgueScores] = useState<Record<number, number>>({});
  const [searchText, setSearchText] = useState<string>(''); // 用于存储搜索框内容
  const [disputeList, setDisputeList] = useState<Map<string, string>>(new Map());
  const [visible, setVisible] = useState(false); // 控制模态框显示与否

  const fetchData = async (current: number = 1, pageSize: number = 10, searchText: string = '') => {
    try {
      const response = await getHrContractsScore({ current, pageSize, searchText });
      if (response.data) {
        setData(response.data);
        const ids = response.data.records.map((record) => record.id);
        if (ids.length > 0) {
          const tempScoreResponse = await getTempScore({ ids: ids });
          setScores((prevScores) => ({
            ...prevScores,
            ...tempScoreResponse.data,
          }));
        }
      } else {
        setData(null);
      }
    } catch (error) {
      message.error('获取数据失败');
    }
  };

  useEffect(() => {
    fetchData(1, 10); // 默认加载第一页，每页 10 条数据
  }, []);

  const handleScoreChange = (id: number, value: number) => {
    setArgueScores((prev) => ({ ...prev, [id]: value }));
  };

  const handleDisputeList = () => {
    DisputeList(); // 获取争议名单
  };

  const DisputeList = async () => {
    try {
      const response = await getDisputeList();
      if (response.data) {
        // 将 { [key: string]: string } 转换为 Map<string, string>
        setDisputeList(new Map(Object.entries(response.data)));
        setVisible(true); // 显示模态框
      }
    } catch (error) {
      message.error('获取争议名单失败');
    }
  };

  const handleSubmitArgueScores = async () => {
    const entries = Object.entries(argueScores);
    try {
      for (const [id, score] of entries) {
        const request: API.ArgueScoreRequest = {
          id: Number(id),
          score: score,
        };

        await ArgueScore(request);
      }
      message.success('争议评分已提交');
      fetchData(); // 提交成功后刷新数据
    } catch (error) {
      message.error('提交争议评分失败');
    }
  };

  const handleSearch = () => {
    fetchData(1, 10, searchText); // 执行搜索时，从第一页开始
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
      title: '周期',
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
      width: '100px',
      ellipsis: true,
      align: 'center',
    },
    {
      title: '被考核人',
      dataIndex: 'assessed_people',
      key: 'assessed_people',
      align: 'center',
      ellipsis: true,
      width: '120px',
      fixed: 'right',
    },
    {
      title: '得分',
      width: '100px',
      key: 'score',
      render: (text: any, record: API.PerformanceContracts) => {
        const scoreValue = scores[record.id] !== undefined ? scores[record.id] : 0;
        return scoreValue;
      },
      ellipsis: true,
      fixed: 'right',
      align: 'center',
    },
    {
      title: '争议评分',
      dataIndex: 'argue_score',
      key: 'argue_score',
      align: 'center',
      ellipsis: true,
      width: '100px',
      fixed: 'right',
      render: (text: any, record: API.PerformanceContracts) => {
        const scoreValue = argueScores[record.id] !== undefined ? argueScores[record.id] : 0;
        return (
          <Input
            type="number"
            value={scoreValue}
            onChange={(e) => handleScoreChange(record.id, Number(e.target.value))}
          />
        );
      },
    },
  ];

  return (
    <div>
      {/* 搜索框部分 */}

      {data?.records && data.records.length > 0 && (
        <div
          style={{
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Input
              placeholder="请根据被考核单位、中心、人进行搜索"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: '300px', marginRight: '8px', height: '32px' }}
            />
            <Button type="primary" onClick={handleSearch} style={{ height: '32px' }}>
              搜索
            </Button>
          </div>

          <div>
            <Button
              type="primary"
              onClick={handleDisputeList}
              style={{ height: '32px', marginRight: '8px' }}
            >
              查看争议名单
            </Button>
            <Button type="primary" onClick={handleSubmitArgueScores} style={{ height: '32px' }}>
              提交争议评分
            </Button>
          </div>
        </div>
      )}

      {/* 表格部分 */}
      <Table
        dataSource={data?.records}
        columns={columns}
        rowKey="id"
        scroll={{ y: 1000, x: 2000 }} // 设置固定高度，超出的部分显示滚动条
        pagination={{
          current: data?.current,
          pageSize: data?.size,
          total: data?.total,
          onChange: (current, pageSize) => fetchData(current, pageSize, searchText),
        }}
      />
      {/* 争议名单模态框 */}
      <Modal
        title="争议名单"
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        width={600}
      >
        <Table
          dataSource={Array.from(disputeList.entries()).map(([unit, name], index) => ({
            key: index,
            unit,
            name,
          }))}
          columns={[
            {
              title: '单位',
              dataIndex: 'unit',
              key: 'unit',
              align: 'center',
            },
            {
              title: '姓名',
              dataIndex: 'name',
              key: 'name',
              align: 'center',
            },
          ]}
          pagination={false} // 取消分页
          rowKey="key"
        />
      </Modal>
    </div>
  );
};

export default Score;

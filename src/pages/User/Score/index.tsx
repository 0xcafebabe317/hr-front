import {
  dldExcel,
  getContractsScore,
  getTempScore,
  saveResult,
  temporaryStorage,
  uploadScoreFile,
} from '@/services/backend/PerformanceContracts';
import { Button, Col, Input, message, Modal, Row, Spin, Table } from 'antd';
import React, { useEffect, useState } from 'react';

const Score: React.FC = () => {
  const [data, setData] = useState<API.ContractsPage | null>(null);
  const [scores, setScores] = useState<Record<number, number>>({});
  const [uploading, setUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Add isLoading state
  const [searchText, setSearchText] = useState<string>(''); // 新增
  // 添加缓存对象，用于存储已加载的页面得分
  const cacheScores: Record<number, Record<number, number>> = {}; // 结构：{ page: { id: score } }

  const fetchData = async (current: number = 1, pageSize: number = 10) => {
    setIsLoading(true);
    try {
      // 判断缓存中是否存在当前页的数据
      if (cacheScores[current]) {
        // 如果缓存中有，直接使用缓存数据
        setScores((prevScores) => ({
          ...prevScores,
          ...cacheScores[current], // 从缓存中读取当前页的得分
        }));
      } else {
        // 如果缓存中没有，发请求获取数据
        const response = await getContractsScore({ current, pageSize, searchText });
        if (response.data) {
          setData(response.data);

          // 获取当前页的记录 ID
          const ids = response.data.records.map((record) => record.id);
          if (ids.length > 0) {
            const tempScoreResponse = await getTempScore({ ids });
            cacheScores[current] = tempScoreResponse.data; // 将得分缓存起来
            setScores((prevScores) => ({
              ...prevScores,
              ...tempScoreResponse.data, // 更新得分状态
            }));
          }
        } else {
          setData(null);
        }
      }
    } catch (error) {
      message.error('获取数据失败');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(1, 10); // Default load first page with 10 items
  }, []);

  const handleScoreChange = (id: number, value: number) => {
    setScores((prev) => ({ ...prev, [id]: value }));
  };

  const handleSearch = async () => {
    fetchData(1, 10); // 重新加载第一页数据，传入当前搜索条件
  };

  const handleFileUpload = async () => {
    // Create file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.xlsx'; // Only allow .xlsx files

    // Handle file selection
    fileInput.onchange = async (event: any) => {
      const files = Array.from(event.target.files);

      // Check if exactly one file is selected
      if (files.length !== 1) {
        message.error('请只选择一个 Excel 文件');
        return;
      }

      const excelFile = files[0] as File; // Explicitly specify that the file is of type File

      // Check file type is Excel
      if (!excelFile.name.endsWith('.xlsx')) {
        message.error('请选择一个 Excel 文件');
        return;
      }

      setUploading(true);
      setIsLoading(true); // Disable page while uploading
      try {
        // Call upload function, ensuring FormData is passed
        const res = await uploadScoreFile(excelFile);
        if (res.data === true) {
          message.success('批量导入成功！');
          fetchData(); // Reload data after successful upload
        } else {
          message.error(res.message || '文件上传失败');
        }
      } catch (error) {
        message.error('文件上传失败');
      } finally {
        setUploading(false);
        setIsLoading(false); // Re-enable the page after upload is complete
      }
    };

    // Trigger file selection
    fileInput.click();
  };

  const handleSave = async () => {
    const scoreRequest: API.ScoreRequest = {
      result: scores,
    };
    setIsLoading(true); // Disable page while saving
    try {
      await temporaryStorage(scoreRequest);
      message.success('分数已保存');
    } catch (error) {
      message.error('保存失败');
    } finally {
      setIsLoading(false); // Re-enable the page after saving
    }
  };

  const handleSubmit = async () => {
    Modal.confirm({
      title: '确定提交',
      content: '您确定要提交评分结果？一旦提交不可再次修改！',
      onOk: async () => {
        setIsLoading(true); // 开始加载时显示 loading

        try {
          // 先加载所有页的数据
          let allScores: Record<number, number> = {};
          let currentPage = 1;
          let totalPages = Math.ceil((data?.total || 0) / (data?.size || 10));

          // 执行多页数据加载并缓存
          for (let page = 1; page <= totalPages; page++) {
            // 获取当前页数据并缓存
            await fetchData(page, data?.size || 10); // fetchData 会更新 scores

            // 等待 setScores 完成
            // 将当前页的得分添加到 `allScores`
            allScores = { ...allScores, ...cacheScores[page] }; // 使用缓存的得分数据
          }

          // 检查是否有未填写的分数，未修改的分数设置为0
          Object.keys(allScores).forEach((key) => {
            if (allScores[Number(key)] === undefined || allScores[Number(key)] === 0) {
              allScores[Number(key)] = 0;
            }
          });

          // 提交所有页面的分数
          const scoreRequest: API.ScoreRequest = {
            result: allScores,
          };
          await saveResult(scoreRequest); // 提交评分数据

          message.success('分数已提交');
          fetchData(); // 提交后重新加载数据

          // 刷新页面数据
          setData(null); // 清空当前数据
          fetchData(1, 10); // 强制刷新第一页数据
        } catch (error) {
          message.error('提交失败');
        } finally {
          setIsLoading(false); // 提交完成，关闭 loading
        }
      },
      onCancel: () => {
        console.log('提交取消');
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
    // {
    //   title: '考核部门',
    //   dataIndex: 'assessment_dept',
    //   key: 'assessment_dept',
    //   align: 'center',
    //   ellipsis: true,
    //   width: '100px',
    // },
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
      width: '120px',
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
      render: (text: any, record: API.PerformanceContracts) => {
        const scoreValue = scores[record.id] !== undefined ? scores[record.id] : 0;
        return (
          <Input
            type="number"
            value={scoreValue}
            onChange={(e) => handleScoreChange(record.id, Number(e.target.value))}
          />
        );
      },
      align: 'center',
      fixed: 'right', // 固定这列
    },
  ];

  return (
    <div>
      {/* Spin component to show loading indicator */}
      <Spin spinning={isLoading} tip="正在加载...">
        {/* 操作按钮部分 */}
        {data?.records && data.records.length > 0 && (
          <Row gutter={16} style={{ marginBottom: '16px' }}>
            <Col span={8} style={{ textAlign: 'left' }}>
              <Button
                type="primary"
                onClick={async () => {
                  try {
                    const response = await dldExcel(); // Call API to get Blob data
                    const blob = new Blob([response], {
                      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    });
                    const downloadUrl = window.URL.createObjectURL(blob);

                    const link = document.createElement('a'); // Create a virtual <a> tag
                    link.href = downloadUrl;
                    link.download = 'template.xlsx'; // Set the file name
                    link.click(); // Trigger download

                    // Release URL object
                    window.URL.revokeObjectURL(downloadUrl);
                  } catch (error) {
                    console.error('下载评分表失败', error);
                    message.error('下载评分表失败');
                  }
                }}
                style={{ marginRight: 8 }}
              >
                下载评分表
              </Button>

              <Button
                onClick={handleFileUpload}
                type="primary"
                loading={uploading}
                style={{ marginRight: 8 }}
              >
                上传评分表
              </Button>
            </Col>

            <Col span={8}>
              <Input.Search
                placeholder="输入关键字搜索"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)} // 实时更新输入值
                onSearch={handleSearch} // 点击回车或搜索按钮触发
                style={{ width: '100%' }}
              />
            </Col>

            <Col span={8} style={{ textAlign: 'right' }}>
              <Button type="primary" onClick={handleSave} style={{ marginRight: 8 }}>
                保存
              </Button>
              <Button type="primary" onClick={handleSubmit}>
                提交
              </Button>
            </Col>
          </Row>
        )}

        {/* 表格部分 */}
        <Table
          dataSource={data?.records}
          columns={columns}
          rowKey="id"
          scroll={{ y: 1000, x: 2000 }}
          pagination={{
            current: data?.current,
            pageSize: data?.size,
            total: data?.total,
            onChange: (current, pageSize) => {
              fetchData(current, pageSize); // 只加载当前页数据
            },
          }}
        />

        {/* Only show save and submit buttons if there is data */}
        {/* {data?.records && data.records.length > 0 && (
          <div style={{ marginTop: 16, textAlign: 'right' }}>
            <Button type="primary" onClick={handleSave} style={{ marginRight: 8 }}>
              保存
            </Button>
            <Button type="primary" onClick={handleSubmit}>
              提交
            </Button>
          </div>
        )} */}
      </Spin>
    </div>
  );
};

export default Score;

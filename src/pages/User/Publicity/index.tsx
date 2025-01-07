import { getAnnouncement } from '@/services/backend/PerformanceContracts';
import { Button, Card, message, Modal, Spin, Typography } from 'antd';
import React, { useEffect, useState } from 'react';

const { Paragraph } = Typography;

const Publicity: React.FC = () => {
  const [announcement, setAnnouncement] = useState<string | null>(null); // 存储公告内容
  const [publishTime, setPublishTime] = useState<string | null>(null); // 存储公告发布时间
  const [loading, setLoading] = useState<boolean>(false); // 控制加载状态
  const [timeRemaining, setTimeRemaining] = useState<string>(''); // 存储剩余时间信息
  const [modalVisible, setModalVisible] = useState<boolean>(false); // 控制问题反馈弹窗可见性

  // 获取公告内容
  useEffect(() => {
    const fetchAnnouncement = async () => {
      setLoading(true);
      try {
        const response = await getAnnouncement();
        if (response?.data) {
          setAnnouncement(response.data.content); // 设置公告内容
          const formattedPublishTime = response.data.createTime
            ? new Date(response.data.createTime).toLocaleString() // 转换为本地时间字符串
            : null;
          setPublishTime(formattedPublishTime); // 设置公告发布时间
        } else {
          message.error('无法获取公告内容');
        }
      } catch (error) {
        message.error('获取公告请求出错');
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncement();
  }, []);

  // 计算剩余时间
  useEffect(() => {
    const calculateRemainingTime = () => {
      const now = new Date();
      const currentDate = now.getDate();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      let startDate: Date | null = null;
      let endDate: Date | null = null;
      let processName = '';

      if (currentDate < 15) {
        startDate = new Date(currentYear, currentMonth, 15, 9, 30);
        endDate = new Date(currentYear, currentMonth, 18, 18, 30);
        processName = '评分流程';
      } else if (currentDate >= 15 && currentDate <= 18) {
        startDate = new Date(currentYear, currentMonth, 15, 9, 30);
        endDate = new Date(currentYear, currentMonth, 18, 18, 30);
        processName = '评分流程';
      } else if (currentDate >= 19 && currentDate <= 21) {
        startDate = new Date(currentYear, currentMonth, 19, 9, 30);
        endDate = new Date(currentYear, currentMonth, 21, 18, 30);
        processName = '公示流程';
      } else if (currentDate >= 22 && currentDate <= 23) {
        startDate = new Date(currentYear, currentMonth, 22, 9, 30);
        endDate = new Date(currentYear, currentMonth, 23, 18, 30);
        processName = '调整评分流程';
      } else {
        // 超出当前月23号，提示下月评分流程开始时间
        startDate = new Date(currentYear, currentMonth + 1, 15, 9, 30);
        endDate = new Date(currentYear, currentMonth + 1, 18, 18, 30);
        processName = '评分流程';
      }

      if (startDate && endDate) {
        const remainingTime = startDate.getTime() - now.getTime();

        if (remainingTime > 0) {
          const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
          const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
          setTimeRemaining(`${processName}：还有 ${days} 天 ${hours} 小时 ${minutes} 分钟【开始】`);
        } else {
          const remainingTimeEnd = endDate.getTime() - now.getTime();
          if (remainingTimeEnd > 0) {
            const days = Math.floor(remainingTimeEnd / (1000 * 60 * 60 * 24));
            const hours = Math.floor((remainingTimeEnd % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((remainingTimeEnd % (1000 * 60 * 60)) / (1000 * 60));
            setTimeRemaining(`${processName}：剩余 ${days} 天 ${hours} 小时 ${minutes} 分钟`);
          } else {
            setTimeRemaining(`${processName} 【已结束】`);
          }
        }
      }
    };

    calculateRemainingTime();
    const intervalId = setInterval(calculateRemainingTime, 60000); // 每分钟更新一次剩余时间

    return () => clearInterval(intervalId); // 清除定时器
  }, []);

  // 打开问题反馈弹窗
  const handleFeedbackClick = () => {
    setModalVisible(true);
  };

  // 关闭问题反馈弹窗
  const handleModalClose = () => {
    setModalVisible(false);
  };

  // 如果公告内容不存在，显示加载状态
  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '20%' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ marginTop: '50px' }}>
      {/* 红色大字剩余时间信息，顶部显示 */}
      <div
        style={{
          fontSize: '24px',
          color: '#FF0000',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '20px',
        }}
      >
        {timeRemaining}
      </div>

      {/* 公告卡片居中显示 */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Card
          title={
            <span
              style={{
                fontSize: '28px',
                color: '#FF0000',
                textAlign: 'center',
                display: 'block',
              }}
            >
              公告
            </span>
          }
          bordered={false}
          style={{ width: '80%' }} // 卡片宽度保持80%
        >
          {announcement ? (
            <Paragraph
              style={{ whiteSpace: 'pre-wrap', fontSize: '18px', color: '#333', textAlign: 'left' }}
            >
              {announcement}
            </Paragraph>
          ) : (
            <Paragraph style={{ fontSize: '18px', color: '#999', textAlign: 'left' }}>
              暂无公告内容
            </Paragraph>
          )}
          {/* 显示公告发布时间 */}
          {publishTime && (
            <div style={{ textAlign: 'right', fontSize: '14px', color: '#888', marginTop: '10px' }}>
              <div style={{ display: 'inline-block', textAlign: 'left' }}>
                <span>发布时间：{publishTime}</span>
                <br />
                <span>发布部门：人力资源部</span>
              </div>
            </div>
          )}
        </Card>
      </div>

      <Button
        type="primary"
        icon="问题反馈"
        shape="round"
        style={{
          position: 'fixed',
          top: 80, // 距离顶部100px
          right: 20, // 距离右侧20px
          zIndex: 1000, // 确保按钮在最上层
          width: 100, // 按钮的宽度
          height: 40, // 按钮的高度（如果需要调整按钮的大小）
          lineHeight: '50px', // 按钮的高度，也影响文本垂直居中
          textAlign: 'center', // 使图标水平居中
        }}
        onClick={handleFeedbackClick}
      />

      {/* 问题反馈弹窗 */}
      <Modal
        title="问题反馈"
        visible={modalVisible}
        onCancel={handleModalClose}
        footer={null}
        width={400}
      >
        <p>请联系电话: 唐玮志 13308941203</p>
        {/* 在这里可以添加反馈表单或者其他内容 */}
      </Modal>
    </div>
  );
};

export default Publicity;

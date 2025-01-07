import {
  exportExcel,
  freeze,
  getUnscoreDepts,
  publicRes,
  publish,
  publishAnnouncement,
  remind,
  unPublicRes,
} from '@/services/backend/PerformanceContracts';
import { Button, Card, Input, List, message, Modal, Select, Typography } from 'antd';
import React, { useState } from 'react';

const { Paragraph } = Typography;
const { Option } = Select;

const Terminal: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [deptList, setDeptList] = useState<string[]>([]);
  const [announcement, setAnnouncement] = useState(''); // 用来存储公告内容
  const [isModalVisible, setIsModalVisible] = useState(false); // 控制发布公告模态框
  const [isExportModalVisible, setIsExportModalVisible] = useState(false); // 控制导出评分结果模态框
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);

  const handlePublish = async () => {
    try {
      const response = await publish();
      if (response?.data) {
        message.success('发布成功！');
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error('发布请求出错！');
    }
  };

  const handleRemind = async () => {
    try {
      const response = await remind();
      if (response?.code === 50001) {
        message.error(response.message);
      } else if (response.code === 0) {
        message.success('提醒发送成功！');
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error('提醒请求出错！');
    }
  };

  const handleGetUnscoreDepts = async () => {
    try {
      const response = await getUnscoreDepts();
      if (response?.data) {
        setDeptList(response.data); // 设置返回的名单
        setVisible(true); // 打开模态框
      } else {
        message.warning(response.message);
      }
    } catch (error) {
      message.error('获取未打分名单出错！');
    }
  };

  const handlePublicRes = async () => {
    try {
      const response = await publicRes();
      if (response?.data === true) {
        message.success('公示流程启动成功！');
      } else {
        message.warning(response.message);
      }
    } catch (error) {
      message.error('公示结果出错！');
    }
  };

  const handleUnPublicRes = async () => {
    try {
      const response = await unPublicRes();
      if (response?.data === true) {
        message.success('公示流程结束成功！');
      } else {
        message.warning(response.message);
      }
    } catch (error) {
      message.error('公示结束出错！');
    }
  };

  const handleFreeze = async () => {
    try {
      const response = await freeze();
      if (response?.data === true) {
        message.success('流程已冻结，所有流程已结束！');
      } else {
        message.warning(response.message);
      }
    } catch (error) {
      message.error('冻结出错！');
    }
  };

  const confirmPublicRes = () => {
    Modal.confirm({
      title: '确认启动公示流程',
      content: '请确认所有部门的业绩合同是否都已评分？此操作不可撤销。',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        await handlePublicRes();
      },
    });
  };

  const confirmFreeze = () => {
    Modal.confirm({
      title: '确认冻结流程',
      content: '您确定要冻结流程吗，冻结后整个评分流程将结束？此操作不可撤销。',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        await handleFreeze();
      },
    });
  };

  const confirmUnPublicRes = () => {
    Modal.confirm({
      title: '确认结束公示流程',
      content: '您确定要结束公示流程吗？此操作不可撤销。',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        await handleUnPublicRes();
      },
    });
  };

  const handleExcel = async (year: number, month: number) => {
    try {
      const yearmonth = `${year}年${month}月`;
      const response = await exportExcel({ yearmonth });
      // 创建 Blob 对象并下载文件
      const blob = new Blob([response], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `contracts_${year}_${month}.xlsx`); // 指定下载的文件名
      document.body.appendChild(link);
      link.click(); // 触发下载
      link.remove(); // 移除链接
      window.URL.revokeObjectURL(url); // 释放 URL 对象
      message.success('Excel 导出成功！');
    } catch (error) {
      message.error('导出 Excel 请求出错！');
    }
  };

  // 打开发布公告模态框
  const showAnnouncementModal = () => {
    setIsModalVisible(true);
  };

  // 保存公告内容
  const handleAnnouncementSave = async () => {
    try {
      // 调用 publishAnnouncement，将公告内容传递给后端
      const body = {
        content: announcement,
      };
      const response = await publishAnnouncement(body);
      if (response?.data === true) {
        message.success('公告已发布！');
        setIsModalVisible(false); // 关闭模态框
      } else {
        message.error('发布公告失败！');
      }
    } catch (error) {
      message.error('发布公告请求出错！');
    }
  };

  // 打开导出评分结果模态框
  const showExportModal = () => {
    setIsExportModalVisible(true);
  };

  // 处理导出评分结果
  const handleExport = () => {
    setIsExportModalVisible(false);
    handleExcel(selectedYear, selectedMonth);
  };

  // 生成年份选项
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 2 }, (_, i) => currentYear - i).map((year) => (
      <Option key={year} value={year}>
        {year}年
      </Option>
    ));
  };

  // 生成月份选项
  const generateMonthOptions = () => {
    return Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
      <Option key={month} value={month}>
        {month}月
      </Option>
    ));
  };

  return (
    <div style={{ padding: '16px' }}>
      <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
        {/* 暂未评分名单、导出Excel按钮组 */}
        <Card title="数据操作" bordered={false} style={{ flex: 1, minWidth: '300px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Button
              type="primary"
              onClick={handleGetUnscoreDepts}
              block
              style={{ width: '120px', marginBottom: '8px' }}
            >
              暂未评分名单
            </Button>
            <Button type="primary" onClick={showExportModal} block style={{ width: '120px' }}>
              导出评分结果
            </Button>
          </div>
        </Card>

        {/* 发布公告按钮组 */}
        <Card title="公告操作" bordered={false} style={{ flex: 1, minWidth: '300px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Button
              type="primary"
              onClick={showAnnouncementModal}
              block
              style={{ width: '120px', marginBottom: '8px' }}
            >
              发布公告
            </Button>
          </div>
        </Card>
      </div>

      {/* 显示部门名单的模态框 */}
      <Modal
        title="未评分部门名单"
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={null} // 设置 footer 为 null，避免默认按钮
        width={600}
      >
        <div style={{ paddingBottom: '40px' }}>
          {' '}
          {/* 这里为 List 和按钮之间腾出空间 */}
          <List
            bordered
            dataSource={deptList}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
        </div>

        {/* 将按钮放到右下角 */}
        <div
          style={{
            position: 'absolute',
            bottom: '16px',
            right: '16px',
            display: 'flex',
            justifyContent: 'flex-end',
            width: '100%',
          }}
        >
          <Button key="remind" type="primary" onClick={handleRemind}>
            一键提醒
          </Button>
        </div>
      </Modal>

      {/* 发布公告模态框 */}
      <Modal
        title="发布公告"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleAnnouncementSave}
      >
        <Input.TextArea
          rows={4}
          value={announcement}
          onChange={(e) => setAnnouncement(e.target.value)}
          placeholder="请输入公告内容"
        />
      </Modal>

      {/* 导出评分结果模态框 */}
      <Modal
        title="选择年份和月份"
        visible={isExportModalVisible}
        onCancel={() => setIsExportModalVisible(false)}
        onOk={handleExport}
      >
        <div style={{ display: 'flex', gap: '16px' }}>
          <Select
            style={{ width: '120px' }}
            value={selectedYear}
            onChange={(value) => setSelectedYear(value)}
          >
            {generateYearOptions()}
          </Select>
          <Select
            style={{ width: '120px' }}
            value={selectedMonth}
            onChange={(value) => setSelectedMonth(value)}
          >
            {generateMonthOptions()}
          </Select>
        </div>
      </Modal>
    </div>
  );
};

export default Terminal;

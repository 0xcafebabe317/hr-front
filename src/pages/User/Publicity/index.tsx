import { chatWithBot } from '@/services/backend/AI'; // 引入聊天API
import { getAnnouncement } from '@/services/backend/PerformanceContracts';
import { RobotOutlined, UserOutlined } from '@ant-design/icons'; // 用于头像
import { Avatar, Button, Card, Input, message, Modal, Typography } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown'; // 引入 react-markdown
import remarkGfm from 'remark-gfm'; // 支持 GitHub 风格的 Markdown

const { Paragraph } = Typography;

const Publicity: React.FC = () => {
  const [announcement, setAnnouncement] = useState<string | null>(null);
  const [publishTime, setPublishTime] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [feedbackModalVisible, setFeedbackModalVisible] = useState<boolean>(false);
  const [chatModalVisible, setChatModalVisible] = useState<boolean>(false); // 控制聊天弹窗可见性
  const [chatInput, setChatInput] = useState<string>(''); // 聊天框输入内容
  const [chatHistory, setChatHistory] = useState<Array<{ role: string; content: string }>>([]); // 聊天记录
  const [isThinking, setIsThinking] = useState<boolean>(false); // 控制“正在思考...”提示的显示

  const chatContainerRef = useRef<HTMLDivElement | null>(null); // 使用 ref 来获取聊天容器

  useEffect(() => {
    const fetchAnnouncement = async () => {
      setLoading(true);
      try {
        // 假设 getAnnouncement 是一个后端接口调用
        const response = await getAnnouncement();
        if (response?.data) {
          setAnnouncement(response.data.content);
          const formattedPublishTime = response.data.createTime
            ? new Date(response.data.createTime).toLocaleString()
            : null;
          setPublishTime(formattedPublishTime);
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

  // 每次 chatHistory 更新时滚动到最底部
  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [chatHistory]);

  const handleFeedbackClick = () => {
    setFeedbackModalVisible(true);
  };

  const handleChatClick = () => {
    setChatModalVisible(true);
  };

  const handleSendChat = async () => {
    if (!chatInput.trim()) {
      message.warning('请输入聊天内容');
      return;
    }

    // 记录用户消息
    setChatHistory((prev) => [...prev, { role: 'user', content: chatInput }]);
    setChatInput('');
    setIsThinking(true);

    try {
      const response = await chatWithBot({ message: chatInput });
      const messageContent = response;
      if (messageContent) {
        setChatHistory((prev) => [...prev, { role: 'assistant', content: messageContent }]);
      } else {
        message.error('机器人未返回有效消息');
      }
    } catch (error) {
      setIsThinking(false);
      message.error('聊天请求失败');
    } finally {
      setIsThinking(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendChat();
    }
  };

  return (
    <div style={{ marginTop: '50px' }}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Card
          title={
            <span
              style={{ fontSize: '28px', color: '#FF0000', textAlign: 'center', display: 'block' }}
            >
              公告
            </span>
          }
          bordered={false}
          style={{ width: '80%' }}
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

      <div
        style={{
          position: 'fixed',
          top: 80,
          right: 20,
          display: 'flex',
          gap: '10px',
          zIndex: 1000,
        }}
      >
        <Button type="primary" shape="round" onClick={handleFeedbackClick}>
          问题反馈
        </Button>
        <Button type="primary" shape="round" onClick={handleChatClick}>
          聊天机器人
        </Button>
      </div>

      <Modal
        title="问题反馈"
        visible={feedbackModalVisible}
        onCancel={() => setFeedbackModalVisible(false)}
        footer={null}
        width={400}
      >
        <p>请联系电话: 唐玮志 13308941203</p>
      </Modal>

      <Modal
        title="聊天机器人"
        visible={chatModalVisible}
        onCancel={() => setChatModalVisible(false)}
        footer={null}
        width={1000}
        height={600} // 调整聊天框的高度
        bodyStyle={{ padding: 0 }} // 移除 Modal 默认的内边距
      >
        <div
          ref={chatContainerRef}
          style={{
            maxHeight: '450px', // 设置最大高度
            overflowY: 'auto', // 让聊天内容滚动
            marginBottom: '10px',
            padding: '10px', // 增加内边距让内容不贴边
          }}
        >
          {chatHistory.map((msg, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', // 用户消息右对齐，机器人消息左对齐
                marginBottom: '10px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                }}
              >
                <Avatar
                  icon={msg.role === 'user' ? <UserOutlined /> : <RobotOutlined />}
                  size="small"
                />
                <div
                  style={{
                    maxWidth: '80%',
                    backgroundColor: msg.role === 'user' ? '#DCF8C6' : '#E9E9E9',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    wordWrap: 'break-word',
                  }}
                >
                  {/* 使用 ReactMarkdown 渲染消息内容 */}
                  <ReactMarkdown children={msg.content} remarkPlugins={[remarkGfm]} />
                </div>
              </div>
            </div>
          ))}

          {isThinking && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                marginBottom: '10px',
                gap: '10px',
                alignItems: 'center',
              }}
            >
              <Avatar icon={<RobotOutlined />} size="small" />
              <div
                style={{
                  maxWidth: '80%',
                  backgroundColor: '#E9E9E9',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  wordWrap: 'break-word',
                  color: '#888',
                }}
              >
                正在思考...
              </div>
            </div>
          )}
        </div>
        <div style={{ position: 'relative' }}>
          <Input.TextArea
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={handleKeyPress}
            rows={4}
            placeholder="请输入聊天内容"
            style={{
              borderRadius: '20px',
              resize: 'none', // 禁止手动调整文本框大小
            }}
          />
          <Button
            type="primary"
            onClick={handleSendChat}
            style={{
              position: 'absolute',
              bottom: '10px',
              right: '10px',
              borderRadius: '20px',
            }}
          >
            发送
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Publicity;

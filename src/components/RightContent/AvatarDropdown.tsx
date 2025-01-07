import { outLogin, updatePwd } from '@/services/backend/userController';
import { LogoutOutlined } from '@ant-design/icons';
import { history, useModel } from '@umijs/max';
import { Button, Form, Input, message, Modal } from 'antd';
import { stringify } from 'querystring';
import type { MenuInfo } from 'rc-menu/lib/interface';
import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'umi';
import HeaderDropdown from '../HeaderDropdown';
import './AvatarDropDown.less';

export type GlobalHeaderRightProps = {
  menu?: boolean;
};

export const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({ menu }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const { initialState, setInitialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};

  const [isUserLoaded, setIsUserLoaded] = useState(false);

  // 用户角色与标签的映射
  const roleMapping: Record<string, string> = {
    score: '评分人员',
    user: '普通用户',
    hr: '系统管理员',
    // 可以根据需要继续添加角色和标签
  };

  // 确保用户数据加载完成后才渲染组件
  useEffect(() => {
    if (currentUser) {
      // 用户数据加载完成，更新渲染状态
      setIsUserLoaded(true);
    }
  }, [currentUser]);

  // 退出登录
  const loginOut = async () => {
    await outLogin();
    const { search, pathname } = window.location;
    const urlParams = new URL(window.location.href).searchParams;
    const redirect = urlParams.get('redirect');

    // 跳转到登录页面，并保存当前 URL
    if (window.location.pathname !== '/user/login' && !redirect) {
      history.replace({
        pathname: '/user/login',
        search: stringify({
          redirect: pathname + search,
        }),
      });
    }
  };

  // 修改密码逻辑
  const handleChangePassword = async () => {
    try {
      const values = await form.validateFields();
      if (values.newPassword !== values.confirmPassword) {
        message.error('两次密码输入不一致');
        return;
      }

      setLoading(true);
      const body = {
        newPwd: values.newPassword, // 新密码
        newCheckPwd: values.confirmPassword, // 确认密码
      };

      const response = await updatePwd(body);
      if (response.data === true) {
        message.success('密码修改成功，请重新登录');
        setIsModalVisible(false); // 关闭模态框
        // 修改密码后退出并跳转到登录页面
        loginOut();
      } else {
        message.error(response.message || '密码修改失败');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onMenuClick = useCallback(
    (event: MenuInfo) => {
      const { key } = event;
      if (key === 'logout') {
        loginOut();
      } else if (key === 'update') {
        setIsModalVisible(true); // 打开修改密码模态框
      } else {
        history.push(`/account/${key}`);
      }
    },
    [setInitialState],
  );

  // 如果用户未登录，则显示登录按钮
  if (!currentUser) {
    return (
      <Link to="/user/login">
        <Button type="primary" shape="round">
          登录
        </Button>
      </Link>
    );
  }

  const menuItems = [
    {
      key: 'update',
      icon: <LogoutOutlined />,
      label: '修改密码',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
    },
  ];

  // 等待用户信息加载完成
  if (!isUserLoaded) {
    return null; // 或者返回一个加载指示器
  }

  // 获取用户角色的标签
  const userRoleLabel = currentUser.userRole ? roleMapping[currentUser.userRole] : '未知角色';

  return (
    <div className="right-corner">
      <HeaderDropdown
        menu={{
          selectedKeys: [],
          onClick: onMenuClick,
          items: menuItems,
        }}
      >
        {/* 显示用户名和角色标签 */}
        <span className="avatar-dropdown">
          欢迎您，{currentUser.userName + '【' + currentUser.userDept + '】'}{' '}
          <span className="user-role">{userRoleLabel}</span>{' '}
        </span>
      </HeaderDropdown>

      {/* 修改密码弹窗 */}
      <Modal
        title="修改密码"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleChangePassword}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="newPassword"
            label="新密码"
            rules={[{ required: true, message: '请输入新密码' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="确认密码"
            rules={[{ required: true, message: '请确认新密码' }]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

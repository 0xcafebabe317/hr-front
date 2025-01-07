import Footer from '@/components/Footer';
import { getCurrentUser } from '@/services/backend/userController';
import { history, RunTimeLayoutConfig } from '@umijs/max';
import { RequestConfig } from 'umi';
import defaultSettings from '../config/defaultSettings';
import { AvatarDropdown } from './components/RightContent/AvatarDropdown';

const loginPath = '/user/login';

export const request: RequestConfig = {
  baseURL: '/api',
  timeout: 10000,
};
export async function getInitialState(): Promise<InitialState> {
  const initialState: InitialState = {
    currentUser: undefined,
    settings: defaultSettings,
  };
  // 获取当前路径
  const currentPath = history.location.pathname;
  if (currentPath !== loginPath) {
    try {
      const res = await getCurrentUser();
      if (res.data === null) {
        // 跳转至登录页
        window.location.href = `/user/login`;
      }
      initialState.currentUser = res.data;
    } catch (error) {
      // 处理未登录情况
    }
  }
  return initialState;
}

export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    avatarProps: {
      render: () => <AvatarDropdown />,
    },
    waterMarkProps: {
      content: initialState?.currentUser?.userName,
    },
    footerRender: () => <Footer />,
    menuHeaderRender: undefined,
    // 其他配置...
    ...initialState?.settings,
  };
};

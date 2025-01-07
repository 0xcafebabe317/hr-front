import { Settings as LayoutSettings } from '@ant-design/pro-components';

const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
} = {
  navTheme: 'light',
  // 拂晓蓝
  colorPrimary: '#1890ff',
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  title: '林芝电信业绩考评平台',
  logo: 'https://www.yishuzi.cn/yuanchuangsheji/content/uploadfile/201607/20f5374f4ba6e7dad142f6817740b95f20160730121719.jpg',
  pwa: false,
  iconfontUrl: '',
};

export default Settings;

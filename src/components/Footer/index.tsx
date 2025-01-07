import { DefaultFooter } from '@ant-design/pro-components';
import '@umijs/max';
import React from 'react';

const Footer: React.FC = () => {
  const defaultMessage = '林芝电信开发团队出品';
  const currentYear = new Date().getFullYear();
  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      copyright={`${currentYear} ${defaultMessage}`}
      links={[
        {
          key: 'telecom',
          title: '西藏电信林芝分公司',
          href: '',
          blankTarget: true,
        },
      ]}
    />
  );
};
export default Footer;

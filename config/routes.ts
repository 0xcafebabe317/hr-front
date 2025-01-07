export default [
  {
    path: '/user',
    layout: false,
    routes: [{ path: '/user/login', component: './User/Login' }],
  },
  { path: '/', redirect: '/user/publicity' },
  { path: '*', layout: false, component: './404' },
  {
    path: '/user/publicity',
    icon: 'smile',
    component: './User/Publicity',
    name: '公告栏',
  },
  {
    path: '/user/public',
    icon: 'eye', // 修改为 eye 图标
    component: './User/Public',
    name: '评分公示',
  },
  {
    path: '/hr/configured',
    icon: 'setting',
    component: './Hr/Configured',
    name: '新增业绩合同',
    hideInMenu: true, // 这里添加这个属性
  },

  {
    path: '/user/score',
    icon: 'save',
    component: './User/Score',
    name: '业绩合同评分',
    access: 'canScore',
  },
  {
    path: '/hr/score',
    icon: 'save',
    component: './Hr/Score',
    name: '评分管理',
    access: 'canHr',
  },

  {
    path: '/hr/contracts',
    icon: 'dashboard',
    component: './Hr/Contracts',
    name: '业绩合同管理',
    access: 'canHr',
  },
  {
    path: '/hr/terminal',
    icon: 'tool',
    component: './Hr/Terminal',
    name: '管理终端',
    access: 'canHr',
  },
];

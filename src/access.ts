/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: { currentUser?: API.LoginUserVO } | undefined) {
  const { currentUser } = initialState ?? {};
  return {
    canUser: currentUser,
    canScore: currentUser && currentUser.userRole === 'score',
    canHr: currentUser && currentUser.userRole === 'hr',
  };
}

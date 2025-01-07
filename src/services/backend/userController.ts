// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** 退出登录接口 POST /api/login/outLogin */
export async function outLogin(options?: { [key: string]: any }) {
  return request<API.BaseResponse<string>>('/user/logout', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 登录接口 POST /api/login/account */
export async function login(body: API.UserLoginRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponse<API.LoginUserVO>>('/user/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取当前的用户 GET /api/currentUser */
export async function getCurrentUser(options?: { [key: string]: any }) {
  return request<API.BaseResponse<API.LoginUserVO>>('/user/get/login', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 修改密码 POST /api/login/account */
export async function updatePwd(body: API.PwdUpdateRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponse<boolean>>('/user/update/pwd', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

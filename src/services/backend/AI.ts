// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

export async function chatWithBot(body: API.ChatRequest, options?: { [key: string]: any }) {
  return request<string>('/ai/chat', {
    method: 'Post',
    data: body,
    timeout: 600000, // 10s
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}

// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/**
 * 获取被考核部门
 * @param options
 * @returns
 */
export async function getAssessedUnit(options?: { [key: string]: any }) {
  return request<API.BaseResponse<string[]>>('/performance_contracts/get/assessed_unit', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}

/**
 * 被考核人
 * @param options
 * @returns
 */
export async function getAssessedPeople(options?: { [key: string]: any }) {
  return request<API.BaseResponse<string[]>>('/performance_contracts/get/assessed_unit', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}

/**
 *被考核中心
 * @param options
 * @returns
 */
export async function getAssessedCenters(options?: { [key: string]: any }) {
  return request<API.BaseResponse<string[]>>('/performance_contracts/get/assessed_center', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}

/**
 * 被考核部门
 * @param options
 * @returns
 */
export async function getAssessmentDepts(options?: { [key: string]: any }) {
  return request<API.BaseResponse<string[]>>('/performance_contracts/get/assessed_unit', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}
/**
 * 新增业绩合同条目
 * @param body
 * @param options
 * @returns
 */
export async function addAssessment(body: API.Assessment, options?: { [key: string]: any }) {
  return request<API.BaseResponse<string[]>>('/performance_contracts/add/assessed/detail', {
    method: 'POST',
    data: body,
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}

/**
 * 获取县局政企中心下的客户经理
 * @param options
 * @returns
 */
export async function getCustomerManager(
  body: API.CustomerRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponse<string[]>>('/performance_contracts/get/customer_manager', {
    method: 'Post',
    data: body,
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}

/**
 * 获取bu负责人或客户经理
 * @param options
 * @returns
 */
export async function getBuManager(body: API.BuRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponse<string[]>>('/performance_contracts/get/bu/manager', {
    method: 'Post',
    data: body,
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}

/**
 * 获取合同列表
 * @param options
 * @returns
 */
export async function searchAssessment(
  body: API.ContractsRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponse<API.Assessment[]>>(
    '/performance_contracts/get/contracts/detail',
    {
      method: 'Post',
      data: body,
      headers: {
        'Content-Type': 'application/json',
      },
      ...(options || {}),
    },
  );
}

/**
 *
 * @param body 获取打分列表
 * @param options
 * @returns
 */
export async function getContractsScore(
  body: API.UserScoreRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponse<API.ContractsPage>>(
    '/performance_contracts/get/contracts/score',
    {
      method: 'Post',
      data: body,
      headers: {
        'Content-Type': 'application/json',
      },
      ...(options || {}),
    },
  );
}

/**
 *
 * @param body 获取打分列表
 * @param options
 * @returns
 */
export async function getPublicResult(body: API.PageRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponse<API.ContractsPage>>('/performance_contracts/get/public/result', {
    method: 'Post',
    data: body,
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}

/**
 *
 * @param body 获取打分列表
 * @param options
 * @returns
 */
export async function getHrContractsScore(
  body: API.ScorePageRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponse<API.ContractsPage>>('/hr/get/contracts/score', {
    method: 'Post',
    data: body,
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}

/**
 *
 * @param body 修改争议评分
 * @param options
 * @returns
 */
export async function ArgueScore(body: API.ArgueScoreRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponse<boolean>>('/hr/argue/score', {
    method: 'Post',
    data: body,
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}

/**
 *
 * @param body 暂存（保存）
 * @param options
 * @returns
 */
export async function temporaryStorage(body: API.ScoreRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponse<boolean>>('/performance_contracts/temporary/storage', {
    method: 'Post',
    data: body,
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}

/**
 *
 * @param body 提交（不可更改）
 * @param options
 * @returns
 */
export async function saveResult(body: API.ScoreRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponse<boolean>>('/performance_contracts/save/result', {
    method: 'Post',
    data: body,
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}

/**
 * 获取暂存分数
 * @param body
 * @param options
 * @returns
 */
export async function getTempScore(body: API.TempScoreRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponse<API.ScoreRequest>>('/performance_contracts/get/temp/score', {
    method: 'POST',
    data: body,
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}

/**
 * 发布当月打分表
 * @param body
 * @param options
 * @returns
 */
export async function publish(options?: { [key: string]: any }) {
  return request<API.BaseResponse<boolean>>('/hr/publish', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}

/**
 * 锁定当月打分表
 * @param body
 * @param options
 * @returns
 */
export async function lock(options?: { [key: string]: any }) {
  return request<API.BaseResponse<boolean>>('/hr/lock', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}

/**
 * 修改业绩合同细则
 * @param body
 * @param options
 * @returns
 */
export async function updateContract(body: API.UpdateRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponse<boolean>>('/performance_contracts/update/contract', {
    method: 'POST',
    data: body,
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}

/**
 * 删除业绩合同细则
 * @param body
 * @param options
 * @returns
 */
export async function deleteContract(body: API.IdRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponse<boolean>>('/performance_contracts/delete/contract', {
    method: 'POST',
    data: body,
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}

/**
 * 发送邮件提示未打分部门
 * @param options
 * @returns
 */
export async function remind(options?: { [key: string]: any }) {
  return request<API.BaseResponse<boolean>>('/hr/remind/and/output', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}

/**
 * 获取所有未打分部门的名单
 * @param options
 * @returns
 */
export async function getUnscoreDepts(options?: { [key: string]: any }) {
  return request<API.BaseResponse<string[]>>('/hr/unscore/dept', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}

/**
 * 发布公示
 * @param options
 * @returns
 */
export async function publicRes(options?: { [key: string]: any }) {
  return request<API.BaseResponse<boolean>>('/hr/public', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}

/**
 * 结束公示
 * @param options
 * @returns
 */
export async function unPublicRes(options?: { [key: string]: any }) {
  return request<API.BaseResponse<boolean>>('/hr/unPublic', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}

/**
 * 冻结
 * @param options
 * @returns
 */
export async function freeze(options?: { [key: string]: any }) {
  return request<API.BaseResponse<boolean>>('/hr/freeze', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}

/**
 * 确认公示结果
 * @param options
 * @returns
 */
export async function confirm(options?: { [key: string]: any }) {
  return request<API.BaseResponse<boolean>>('/performance_contracts/confirm', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}

/**
 * 有争议
 * @param options
 * @returns
 */
export async function dispute(options?: { [key: string]: any }) {
  return request<API.BaseResponse<boolean>>('/performance_contracts/dispute', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}

/**
 * 下载评分模板
 * @param options
 * @returns
 */
export async function dldExcel(options?: { [key: string]: any }) {
  return request<Blob>('/performance_contracts/dld/excel', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    responseType: 'blob',
    ...(options || {}),
  });
}

/**
 * 上传评分文件
 * @param file 上传的文件
 * @param options 可选参数
 * @returns
 */
export async function uploadScoreFile(file: File, options?: { [key: string]: any }) {
  const formData = new FormData();
  formData.append('file', file);
  return request('/performance_contracts/saveBatch', {
    method: 'POST',
    data: formData,
    headers: {
      // 不设置 Content-Type，request 库通常会自动处理
    },
    timeout: 60000, // 设置超时时间为30秒（30000ms）
    ...(options || {}),
  });
}

/**
 * 获取公示确认结果
 * @param options
 * @returns
 */
export async function isConfirm(options?: { [key: string]: any }) {
  return request<API.BaseResponse<boolean>>('/performance_contracts/is/confirm', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}

/**
 * 获取公示确认结果
 * @param options
 * @returns
 */
export async function isDispute(options?: { [key: string]: any }) {
  return request<API.BaseResponse<boolean>>('/performance_contracts/is/dispute', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}
/**
 *导出excel
 * @param options
 * @returns
 */
export async function exportExcel(body: API.YearMonth, options?: { [key: string]: any }) {
  return request<Blob>('/hr/export/excel', {
    method: 'POST',
    data: body,
    headers: {
      'Content-Type': 'application/json',
    },
    responseType: 'blob', // 添加这一行
    ...(options || {}),
  });
}

/**
 *发布公告
 * @param options
 * @returns
 */
export async function publishAnnouncement(
  body: API.AnnouncementRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponse<boolean>>('/hr/publish/announcement', {
    method: 'POST',
    data: body,
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}

/**
 *获取公告
 * @param options
 * @returns
 */
export async function getAnnouncement(options?: { [key: string]: any }) {
  return request<API.BaseResponse<API.Announcement>>('/hr/get/announcement', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}

/**
 *
 * @param options 获取争议名单
 * @returns
 */
export async function getDisputeList(options?: { [key: string]: any }) {
  return request<API.BaseResponse<API.DisputeList>>('/hr/get/dispute/list', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}

export async function getTotalScore(options?: { [key: string]: any }) {
  return request<API.BaseResponse<number>>('/performance_contracts/get/total/score', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}

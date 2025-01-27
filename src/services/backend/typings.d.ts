// @ts-ignore
/* eslint-disable */

declare namespace API {
  type BaseResponse<T> = {
    code: number;
    data: T;
    message: string;
  };
  type LoginUserVO = {
    createTime?: string;
    id?: string;
    updateTime?: string;
    userName?: string;
    userRole?: string;
    userDept?: string;
  };

  type Announcement = {
    content: string;
    createTime: Date;
    updateTime: Date;
  };

  type PwdUpdateRequest = {
    newPwd: string;
    newCheckPwd: string;
  };

  type User = {
    createTime?: string;
    id?: string;
    isDelete?: number;
    updateTime?: string;
    userAccount?: string;
    userName?: string;
    userPassword?: string;
    userRole?: string;
  };

  type UserAddRequest = {
    userAccount?: string;
    userAvatar?: string;
    userName?: string;
    userRole?: string;
  };

  type UserLoginRequest = {
    userAccount?: string;
    userPassword?: string;
  };

  type UserRegisterRequest = {
    checkPassword?: string;
    userAccount?: string;
    userPassword?: string;
  };

  type ArgueScoreRequest = {
    id: number;
    score: number;
  };

  type UserVO = {
    createTime?: string;
    id?: string;
    userName?: string;
    userRole?: string;
    userDept?: string;
  };

  type Assessment = {
    categories?: string; // 大类名称
    subCategories?: string; // 小类名称
    indicators?: string; // 指标
    assessmentDept?: string; // 考核部门
    weight?: number; // 权重
    scoringMethod?: string; // 记分方法
    assessmentCycle?: string; // 考核周期
    assessedUnit?: string; // 被考核单位
    assessedCenter?: string; // 被考核中心
    assessedPeople?: string; // 被考核人
    other?: string; // 其他
  };

  type CustomerRequest = {
    unit?: string;
    center: string;
  };

  type BuRequest = {
    bu: string;
    role: string;
  };

  type ContractsRequest = {
    assessedUnit: string;
    assessedCenter: string;
    assessedPeople: string;
  };

  type PerformanceContracts = {
    id: number; // Long in Java is usually represented as number in TypeScript
    categories: string;
    sub_categories: string;
    indicators: string;
    assessment_dept: string;
    weight: number; // Integer in Java is represented as number in TypeScript
    scoring_method: string;
    assessment_cycle: string;
    assessed_unit: string;
    assessed_center: string;
    assessed_people: string;
    other?: string; // 其他字段可以选择性定义为可选
  };

  type AnnouncementRequest = {
    content: string;
  };

  type ContractsPage = {
    current: number;
    pageSize: number;
    total: number;
    records: PerformanceContracts[];
    size: number;
  };

  type PageRequest = {
    current: number;
    pageSize: number;
  };

  type YearMonth = {
    yearmonth: string;
  };

  type ChatRequest = {
    message: string;
  };

  type UserScoreRequest = {
    current: number;
    pageSize: number;
    searchText: string;
  };

  type ScorePageRequest = {
    current: number;
    pageSize: number;
    searchText: string;
  };

  type DisputeList = { [key: string]: string };

  type ScoreRequest = {
    result: {
      [key: number]: number; // Long in Java is represented as number in TypeScript
    };
  };

  type TempScoreRequest = {
    ids: number[];
  };

  type UpdateRequest = {
    id: number;
    categories: string;
    sub_categories: string;
    indicators: string;
    assessment_dept: string;
    weight: number;
    scoring_method: string;
    assessment_cycle: string;
    assessed_unit: string;
    assessed_center: string;
    assessed_people: string;
    other: string;
  };

  type IdRequest = {
    id: number;
  };
}

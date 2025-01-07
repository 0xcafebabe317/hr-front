import {
  addAssessment,
  getAssessedCenters,
  getAssessedUnit,
  getAssessmentDepts,
  getBuManager,
  getCustomerManager,
} from '@/services/backend/PerformanceContracts';
import { Button, Col, Form, Input, message, Row, Select } from 'antd';
import React, { useEffect, useState } from 'react';

const { Option } = Select;

const Configured: React.FC = () => {
  const [assessmentDepts, setAssessmentDepts] = useState<string[]>([]);
  const [assessedUnits, setAssessedUnits] = useState<string[]>([]);
  const [assessedCenters, setAssessedCenters] = useState<string[]>([]);
  const [assessedPeople, setAssessedPeople] = useState<string[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<string | undefined>(undefined);
  const [selectedCenter, setSelectedCenter] = useState<string | undefined>(undefined);
  const [selectedPeople, setSelectedPeople] = useState<string | undefined>(undefined);
  const [form] = Form.useForm();
  const [loadingPeople, setLoadingPeople] = useState<boolean>(false); // 加载标识

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [deptRes, unitRes] = await Promise.all([getAssessmentDepts(), getAssessedUnit()]);
        setAssessmentDepts(deptRes.data);
        setAssessedUnits(unitRes.data);
      } catch (error) {
        console.error('Error fetching options:', error);
      }
    };

    fetchOptions();
  }, []);

  const handleCenterChange = async (value: string) => {
    setSelectedCenter(value); // 更新被考核中心的状态
    setSelectedPeople(undefined); // 清空被考核人的选择
    setAssessedPeople([]); // 清空被考核人的列表
    setLoadingPeople(true); // 开始加载被考核人数据

    if (selectedUnit) {
      try {
        // 确保每次选择完中心都会发请求
        const body = { unit: selectedUnit, center: value };

        // 条件判断：如果是特定中心，需要判断单位类型
        if (
          ['负责人', 'CEO', '公众中心', '客户经理', '综维中心', '政企中心'].includes(value) &&
          selectedUnit
        ) {
          if (
            ['巴宜区', '帮宗', '米林', '波密', '墨脱', '工布江达', '察隅', '朗县'].includes(
              selectedUnit,
            )
          ) {
            const peopleRes = await getCustomerManager(body); // 获取客户经理
            setAssessedPeople(peopleRes.data);
          } else if (
            ['应急BU', '企事业BU', '教育医疗BU', '军民融合BU', '数字政府BU'].includes(selectedUnit)
          ) {
            const buRequest = { bu: selectedUnit, role: value };
            const peopleRes = await getBuManager(buRequest); // 获取BU经理
            setAssessedPeople(peopleRes.data);
          } else {
            setAssessedPeople(['无']);
            setSelectedPeople(undefined); // 清空被考核人
          }
        } else {
          const peopleRes = await getCustomerManager(body); // 获取客户经理
          setAssessedPeople(peopleRes.data);
        }
      } catch (error) {
        console.error('Error fetching customer managers:', error);
      } finally {
        setLoadingPeople(false); // 数据加载完成
      }
    }
  };

  const handleUnitChange = async (value: string) => {
    setSelectedUnit(value); // 更新被考核单位的状态
    setSelectedCenter(undefined); // 清空被考核中心的选择
    setSelectedPeople(undefined); // 清空被考核人的选择
    setAssessedPeople([]); // 清空被考核人的列表

    try {
      // 判断被考核单位类型
      if (['应急BU', '企事业BU', '教育医疗BU', '军民融合BU', '数字政府BU'].includes(value)) {
        setAssessedCenters(['负责人', '客户经理']);
      } else if (
        ['巴宜区', '帮宗', '米林', '波密', '墨脱', '工布江达', '察隅', '朗县'].includes(value)
      ) {
        const centerRes = await getAssessedCenters(); // 获取被考核中心
        setAssessedCenters(centerRes.data);
      } else {
        setAssessedCenters(['无']);
      }
    } catch (error) {
      console.error('Error fetching assessed centers:', error);
    }
  };

  const onFinish = async (values: any) => {
    try {
      const res = await addAssessment(values);
      if (res.code === 0) {
        message.success('添加成功！');
        form.resetFields();
      } else {
        message.error(res.message);
      }
    } catch (error) {
      message.error('请求出错，请重试！');
      console.error('Error occurred:', error);
    }
    console.log('Received values:', values);
  };

  return (
    <div>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="大类名称"
              name="categories"
              rules={[{ required: true, message: '请输入大类名称' }]}
            >
              <Select placeholder="请选择大类名称" style={{ width: '100%' }}>
                <Option value="K1：高质量发展">K1：高质量发展</Option>
                <Option value="K2：保障指标">K2：保障指标</Option>
                <Option value="负面清单">负面清单</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="小类名称"
              name="sub_categories"
              rules={[{ required: true, message: '请输入小类名称' }]}
            >
              <Select placeholder="请选择小类名称" style={{ width: '100%' }}>
                <Option value="量的合理增长">量的合理增长</Option>
                <Option value="质的有效提升">质的有效提升</Option>
                <Option value="重点专项">重点专项</Option>
                <Option value="阶段性专项">阶段性专项</Option>
                <Option value="区公司级">区公司级</Option>
                <Option value="分公司级">分公司级</Option>
                <Option value="党建专项">党建专项</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="指标"
              name="indicators"
              rules={[{ required: true, message: '请输入指标' }]}
            >
              <Input placeholder="请输入指标" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="考核部门"
              name="assessment_dept"
              rules={[{ required: true, message: '请选择考核部门' }]}
            >
              <Select placeholder="请选择考核部门" style={{ width: '100%' }}>
                {assessmentDepts.map((dept) => (
                  <Option key={dept} value={dept}>
                    {dept}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="权重"
              name="weight"
              rules={[{ required: false, message: '请输入权重' }]}
            >
              <Input type="number" placeholder="请输入权重" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="计分方法"
              name="scoring_method"
              rules={[{ required: true, message: '请输入计分方法' }]}
            >
              <Input placeholder="请输入记分方法" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="考核周期"
              name="assessment_cycle"
              rules={[{ required: true, message: '请选择考核周期' }]}
            >
              <Select placeholder="请选择考核周期" style={{ width: '100%' }}>
                <Option value="月度">月度</Option>
                <Option value="季度">季度</Option>
                <Option value="年度">年度</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="被考核单位" // 加上必填标记
              name="assessed_unit"
              rules={[{ required: true, message: '请选择被考核单位' }]}
            >
              <Select
                placeholder="请选择被考核单位"
                onChange={handleUnitChange}
                value={selectedUnit}
                allowClear
              >
                {assessedUnits.map((unit) => (
                  <Option key={unit} value={unit}>
                    {unit}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="被考核中心" // 加上必填标记
              name="assessed_center"
              rules={[{ required: true, message: '请选择被考核中心' }]}
            >
              <Select
                placeholder="请选择被考核中心"
                onChange={handleCenterChange}
                value={selectedCenter}
                allowClear
                disabled={!selectedUnit}
              >
                {assessedCenters.map((center) => (
                  <Option key={center} value={center}>
                    {center}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="被考核人" // 加上必填标记
              name="assessed_people"
              rules={[{ required: true, message: '请选择被考核人' }]}
            >
              <Select
                placeholder="请选择被考核人"
                value={selectedPeople}
                onChange={setSelectedPeople}
                allowClear
                disabled={!selectedCenter || loadingPeople} // 加载数据时禁用选择框
              >
                {assessedPeople.map((person) => (
                  <Option key={person} value={person}>
                    {person}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="其他" name="other">
              <Input.TextArea placeholder="请输入其他信息" style={{ height: '1px' }} />
            </Form.Item>
          </Col>
          <Col span={12}></Col>
        </Row>
        <Form.Item style={{ textAlign: 'center' }}>
          <Button type="primary" htmlType="submit" style={{ width: '20%' }}>
            提交
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Configured;

import {
  deleteContract,
  getAssessedCenters,
  getAssessedUnit,
  getAssessmentDepts,
  getBuManager,
  getCustomerManager,
  searchAssessment,
  updateContract,
} from '@/services/backend/PerformanceContracts';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, message, Modal, Row, Select, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 引入 useNavigate

const { Option } = Select;

const Contracts: React.FC = () => {
  const navigate = useNavigate();

  const [assessmentDepts, setAssessmentDepts] = useState<string[]>([]);
  const [assessedUnits, setAssessedUnits] = useState<string[]>([]);
  const [assessedCenters, setAssessedCenters] = useState<string[]>([]);
  const [assessedPeople, setAssessedPeople] = useState<string[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<string | undefined>(undefined);
  const [selectedCenter, setSelectedCenter] = useState<string | undefined>(undefined);
  const [selectedPeople, setSelectedPeople] = useState<string | undefined>(undefined);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [updateData, setUpdateData] = useState<any>(null);
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

  const onSearch = async () => {
    const params = {
      assessedUnit: selectedUnit,
      assessedCenter: selectedCenter,
      assessedPeople: selectedPeople,
    };

    try {
      const res = await searchAssessment(params);
      if (res.code === 0) {
        setSearchResults(res.data);
      } else {
        message.error('搜索失败！');
      }
    } catch (error) {
      message.error('请求出错，请重试！');
      console.error('Error occurred:', error);
    }
  };

  const handleUpdate = (record: any) => {
    setUpdateData(record);
    setUpdateModalVisible(true);
    form.setFieldsValue(record); // 初始化表单数据
  };

  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除该合同吗？',
      onOk: async () => {
        try {
          const res = await deleteContract({ id: id });
          if (res.code === 0) {
            message.success('删除成功');
            onSearch(); // 刷新数据
          } else {
            message.error(res.message);
          }
        } catch (error) {
          message.error('请求出错，请重试！');
        }
      },
    });
  };

  const handleUpdateSubmit = async () => {
    try {
      const values = await form.validateFields();
      const res = await updateContract({ ...updateData, ...values });
      if (res.code === 0) {
        message.success('更新成功');
      } else {
        message.error(res.message);
      }
      setUpdateModalVisible(false);
      onSearch(); // 刷新数据
    } catch (error) {
      message.error('更新失败，请重试！');
      console.error('Error updating contract:', error);
    }
  };

  const columns = [
    {
      title: '大类名称',
      dataIndex: 'categories',
      key: 'categories',
      align: 'center',
      ellipsis: true,
      width: '150px',
    },
    {
      title: '小类名称',
      dataIndex: 'sub_categories',
      key: 'sub_categories',
      align: 'center',
      ellipsis: true,
      width: '120px',
    },
    {
      title: '指标',
      dataIndex: 'indicators',
      key: 'indicators',
      align: 'center',
      ellipsis: true,
      width: '250px',
    },
    {
      title: '考核部门',
      dataIndex: 'assessment_dept',
      key: 'assessment_dept',
      align: 'center',
      ellipsis: true,
      width: '100px',
    },
    {
      title: '权重',
      dataIndex: 'weight',
      key: 'weight',
      align: 'center',
      ellipsis: true,
      width: '80px',
    },
    {
      title: '计分方法',
      dataIndex: 'scoring_method',
      key: 'scoring_method',
      align: 'center',
      ellipsis: true,
      width: '300px',
    },
    {
      title: '考核周期',
      dataIndex: 'assessment_cycle',
      key: 'assessment_cycle',
      align: 'center',
      ellipsis: true,
      width: '100px',
    },
    {
      title: '被考核单位',
      dataIndex: 'assessed_unit',
      key: 'assessed_unit',
      align: 'center',
      ellipsis: true,
      width: '150px',
    },
    {
      title: '被考核中心',
      dataIndex: 'assessed_center',
      key: 'assessed_center',
      align: 'center',
      ellipsis: true,
      width: '120px',
    },

    {
      title: '其他',
      dataIndex: 'other',
      key: 'other',
      align: 'center',
      ellipsis: true,
      width: '100px',
    },
    {
      title: '被考核人',
      dataIndex: 'assessed_people',
      key: 'assessed_people',
      align: 'center',
      ellipsis: true,
      width: '120px',
      fixed: 'right',
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      render: (_: any, record: any) => (
        <>
          <Button type="link" onClick={() => handleUpdate(record)}>
            更新
          </Button>
          <Button type="link" onClick={() => handleDelete(record.id)}>
            删除
          </Button>
        </>
      ),
      align: 'center',
      ellipsis: true,
      width: '150px',
    },
  ];

  return (
    <div>
      <Form layout="vertical">
        <Row gutter={8}>
          <Col span={3}>
            <Form.Item>
              <Button
                type="primary"
                onClick={() => navigate('/hr/configured')}
                style={{ width: '100%', marginTop: '30px' }}
              >
                新增
              </Button>
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item label="被考核单位">
              <Select
                placeholder="请选择"
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
          <Col span={5}>
            <Form.Item label="被考核中心">
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
          <Col span={5}>
            <Form.Item label="被考核人">
              <Select
                placeholder="请选择"
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
          <Col span={3}>
            <Form.Item>
              <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={onSearch}
                style={{ width: '100%', marginTop: '30px' }}
              >
                查询
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Table
        dataSource={searchResults}
        columns={columns}
        rowKey="id"
        scroll={{ y: 1000, x: 2000 }}
        pagination={{
          pageSizeOptions: ['10', '20', '50', '100'], // 可选择的条数
          showSizeChanger: true, // 显示条数选择器
          onChange: (page, pageSize) => {
            console.log('Current Page:', page, 'Page Size:', pageSize);
            // 在这里可以处理分页变化时的逻辑，例如发送新的请求来获取数据
          },
        }}
      />

      <Modal
        title="更新合同信息"
        visible={updateModalVisible}
        onOk={handleUpdateSubmit}
        onCancel={() => setUpdateModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="大类名称"
                name="categories"
                rules={[{ required: true, message: '请输入大类名称' }]}
              >
                <Input placeholder="请输入大类名称" />
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
                  <Option value="区公司级">阶段性专项</Option>
                  <Option value="分公司级">阶段性专项</Option>
                  <Option value="党建专项">阶段性专项</Option>
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
                <Select placeholder="请选择考核部门">
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
                <Select placeholder="请选择考核周期">
                  <Option value="月度">月度</Option>
                  <Option value="季度">季度</Option>
                  <Option value="年度">年度</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="被考核单位"
                name="assessed_unit"
                rules={[{ required: true, message: '请选择被考核单位' }]}
              >
                <Select placeholder="请选择被考核单位" onChange={handleUnitChange}>
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
                label="被考核中心"
                name="assessed_center"
                rules={[{ required: true, message: '请选择被考核中心' }]}
              >
                <Select placeholder="请选择被考核中心" onChange={handleCenterChange}>
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
                label="被考核人"
                name="assessed_people"
                rules={[{ required: true, message: '请选择被考核人' }]}
              >
                <Select placeholder="请选择被考核人">
                  {assessedPeople.map((people) => (
                    <Option key={people} value={people}>
                      {people}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label="其他" name="other">
                <Input placeholder="请输入其他信息" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
      <Modal>
        <Form form={form} layout="vertical">
          {/* 这里根据你的表单字段动态生成 */}
        </Form>
      </Modal>
    </div>
  );
};

export default Contracts;

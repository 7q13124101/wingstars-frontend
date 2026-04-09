import { useState } from 'react';
import { Table, Button, Input, Space, Switch, Modal, Form, Select, Checkbox, Tag, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Search, Plus, ShieldAlert, SlidersHorizontal } from 'lucide-react';

interface AdminRecord {
  id: number;
  username: string;
  email: string;
  mainRole: string;
  otherRoles: string[];
  isLocked: boolean;
}

interface AdminFormValues {
  username: string;
  email: string;
  mainRole: string;
  otherRoles?: string[];
  skipEmail: boolean;
}

export default function AdminsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminRecord | null>(null);
  const [form] = Form.useForm<AdminFormValues>();

  const [adminsList, setAdminsList] = useState<AdminRecord[]>([
    { id: 1, username: 'admin_wingstar', email: 'admin@wingstars.com.tw', mainRole: 'Admin', otherRoles: ['Editor'], isLocked: false },
    { id: 2, username: 'content_manager', email: 'content@wingstars.com.tw', mainRole: 'Editor', otherRoles: [], isLocked: true },
    { id: 3, username: 'shop_staff', email: 'shop@wingstars.com.tw', mainRole: 'Shop Manager', otherRoles: ['Contributor'], isLocked: false },
  ]);

  const filteredData = adminsList.filter(admin => 
    admin.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns: ColumnsType<AdminRecord> = [
    { 
      title: '管理員帳號 (Username)', 
      dataIndex: 'username', 
      key: 'username', 
      render: (text) => <span className="font-medium text-gray-800">{text}</span> 
    },
    { 
      title: '電子郵件 (Email)', 
      dataIndex: 'email', 
      key: 'email', 
      render: (text) => <span className="text-gray-500">{text}</span> 
    },
    { 
      title: '主要角色 (Role)', 
      dataIndex: 'mainRole', 
      key: 'mainRole', 
      render: (role) => (
        <Tag color={role === 'Admin' ? 'red' : role === 'Editor' ? 'green' : 'blue'} className="font-medium">
          {role}
        </Tag>
      ) 
    },
    { 
      title: '其他角色 (Other Roles)', 
      dataIndex: 'otherRoles', 
      key: 'otherRoles', 
      render: (roles: string[]) => (
        <Space size={[0, 4]} wrap>
          {roles && roles.length > 0 ? (
            roles.map(r => <Tag key={r} className="m-0 text-gray-500 border-gray-200">{r}</Tag>)
          ) : (
            <span className="text-gray-300">-</span>
          )}
        </Space>
      )
    },
    { 
      title: '帳號狀態 (Status)', 
      dataIndex: 'isLocked', 
      key: 'isLocked',
      align: 'center',
      render: (isLocked: boolean, record) => (
        <Switch 
          checked={!isLocked}
          checkedChildren="正常" 
          unCheckedChildren="已鎖定"
          onChange={(checked) => {
            setAdminsList(prev => prev.map(item => item.id === record.id ? { ...item, isLocked: !checked } : item));
            message.success(checked ? `已解鎖帳號: ${record.username}` : `已鎖定帳號: ${record.username}`);
          }}
        />
      )
    },
    {
      title: '操作 (Actions)',
      key: 'action',
      width: 150,
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <button 
            onClick={() => {
              setEditingAdmin(record);
              form.setFieldsValue({
                username: record.username,
                email: record.email,
                mainRole: record.mainRole,
                otherRoles: record.otherRoles,
                skipEmail: false
              });
              setIsModalOpen(true);
            }}
            className="bg-button-edit hover:bg-wingstars-primary text-white text-[12px] px-4 py-1.5 rounded-full transition-colors whitespace-nowrap"
          >
            編輯
          </button>
        </Space>
      ),
    },
  ];

  const handleSaveAdmin = (values: AdminFormValues) => {
    if (editingAdmin) {
      // 更新（Edit）邏輯
      setAdminsList(prev => prev.map(item => item.id === editingAdmin.id ? {
        ...item,
        username: values.username,
        email: values.email,
        mainRole: values.mainRole,
        otherRoles: values.otherRoles || []
      } : item));
      message.success('管理員資料更新成功！');
    } else {
      // 新增 (Create) 邏輯
      setAdminsList(prev => [{
        id: Date.now(),
        username: values.username,
        email: values.email,
        mainRole: values.mainRole,
        otherRoles: values.otherRoles || [],
        isLocked: false // 默认创建新用户时不被锁定
      }, ...prev]);
      message.success(values.skipEmail ? '已新增管理員！(未發送通知信)' : '已新增管理員！並已發送通知信。');
    }
    
    setIsModalOpen(false);
    form.resetFields();
    setEditingAdmin(null);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] overflow-y-auto px-4 pb-10 gap-4 custom-scrollbar">
      
      {/* Toolbar block (Search & Buttons) */}
      <div className="flex justify-between items-center pt-6">
        <Input 
          prefix={<Search size={18} className="text-gray-400" />}
          placeholder="搜尋管理員..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-[300px] py-2.5 rounded-xl border-gray-100 hover:border-pink-300 focus:border-pink-400 shadow-sm"
        />

        <div className="flex items-center gap-3">
          <Button 
            type="primary" 
            icon={<Plus size={16} />} 
            onClick={() => {
              setEditingAdmin(null);
              form.resetFields();
              setIsModalOpen(true);
            }}
            className="bg-white text-blue-500 border-gray-100 shadow-sm h-11 rounded-xl px-4 flex items-center gap-2 hover:!bg-gray-50 hover:!text-blue-600"
          >
            <span className="font-medium text-gray-700">新增管理員</span>
          </Button>
          
          <Button className="border-gray-100 shadow-sm h-11 rounded-xl px-4 flex items-center gap-2">
            <ShieldAlert className="text-emerald-500" size={18} />
            <span className="font-medium text-gray-700">權限說明</span>
          </Button>

          <Button className="border-gray-100 shadow-sm h-11 w-11 rounded-xl flex items-center justify-center">
            <SlidersHorizontal className="text-gray-500" size={18} />
          </Button>
        </div>
      </div>

      {/* Data Table Block */}
      <div className="bg-white rounded-[20px] shadow-sm border border-gray-50 overflow-hidden">
        <Table 
          columns={columns} 
          dataSource={filteredData} 
          rowKey="id" 
          pagination={{ 
            pageSize: 5, 
            showTotal: (total, range) => `顯示 ${range[0]}-${range[1]} / 共 ${total} 位管理員`,
            position: ['bottomLeft'],
            className: "px-6 py-4 m-0 border-t border-gray-100 bg-gray-50/30" 
          }}
          className="custom-antd-table"
        />
      </div>

      {/* Modal Form Block */}
      <Modal 
        title={<span className="text-lg font-bold text-gray-800">{editingAdmin ? "編輯管理員" : "新增管理員"}</span>}
        open={isModalOpen} 
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
          setEditingAdmin(null);
        }} 
        onOk={() => form.submit()}
        okText={editingAdmin ? "儲存變更" : "建立帳號"}
        cancelText="取消"
        okButtonProps={{ className: 'bg-button-edit hover:!bg-wingstars-primary border-none h-10 rounded-lg' }}
        cancelButtonProps={{ className: 'h-10 rounded-lg' }}
        width={500}
        destroyOnClose
      >
        <Form 
          form={form} 
          layout="vertical" 
          onFinish={handleSaveAdmin} 
          className="mt-6" 
          initialValues={{ skipEmail: false }}
        >
          <Form.Item 
            name="username" 
            label="管理員帳號 (Username)" 
            rules={[{ required: true, message: '請輸入帳號！' }]}
          >
            <Input placeholder="輸入登入帳號..." className="rounded-lg py-2" disabled={!!editingAdmin} />
          </Form.Item>

          <Form.Item 
            name="email" 
            label="電子郵件 (Email)" 
            rules={[{ required: true, type: 'email', message: '請輸入正確的信箱格式！' }]}
          >
            <Input placeholder="example@wingstars.com.tw" className="rounded-lg py-2" />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item 
              name="mainRole" 
              label="主要角色 (Main Role)" 
              rules={[{ required: true, message: '請選擇主要角色！' }]}
            >
              <Select placeholder="選擇角色" className="h-10">
                <Select.Option value="Admin">Admin (最高權限)</Select.Option>
                <Select.Option value="Editor">Editor (編輯者)</Select.Option>
                <Select.Option value="Shop Manager">Shop Manager</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name="otherRoles" label="其他角色 (Other Roles)">
              <Select mode="multiple" allowClear placeholder="可複選" className="w-full">
                <Select.Option value="Author">Author</Select.Option>
                <Select.Option value="Contributor">Contributor</Select.Option>
              </Select>
            </Form.Item>
          </div>

          {/* 只在創建新用戶時顯示 Skip Email Checkbox */}
          {!editingAdmin && (
            <Form.Item name="skipEmail" valuePropName="checked" className="mb-0">
              <Checkbox className="text-gray-600">
                Skip Confirmation Email (不發送確認信件)
              </Checkbox>
            </Form.Item>
          )}
        </Form>
      </Modal>

    </div>
  );
}
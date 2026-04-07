import { useEffect } from 'react';
import { Modal, Form, Input, Select } from 'antd';

export interface UserFormData {
  username: string;
  phone: string;
  displayName: string;
  email: string;
  role: string[];
}

interface AddUserModalProps {
  onClose: () => void;
  onSave: (data: UserFormData) => void;
  initialData?: UserFormData | null;
}

export default function AddUserModal({ onClose, onSave, initialData }: AddUserModalProps) {
  // 初始化表單的 instance，以便可以操作（重置、設定資料）
  const [form] = Form.useForm();

  // 每次打開 Modal 時，如果有舊資料就填入表單，否則清空表單
  useEffect(() => {
    if (initialData) {
      form.setFieldsValue(initialData);
    } else {
      form.resetFields();
    }
  }, [initialData, form]);

  const handleOk = () => {
      // validateFields() 會檢查以下所有規則
      // 如果通過，會回傳資料；如果有錯誤，會自動顯示紅色提示並停止操作
    form.validateFields()
      .then((values) => {
        onSave(values);
        onClose();
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    <Modal
      title={<span className="text-lg font-bold text-gray-800">{initialData ? "編輯使用者" : "新增使用者"}</span>}
      open={true}
      onOk={handleOk}
      onCancel={onClose}
      okText="儲存變更"
      cancelText="取消"
      okButtonProps={{ className: 'bg-button-edit hover:!bg-wingstars-primary border-none h-10 rounded-lg' }}
      cancelButtonProps={{ className: 'h-10 rounded-lg' }}
      width={500}
      centered
    >
      <Form
        form={form}
        layout="vertical"
        name="user_form"
        initialValues={{ role: '客戶' }}
        className="mt-6"
      >
        <Form.Item
          name="username"
          label="使用者名稱"
          rules={[{ required: true, message: '請輸入帳號！' }]}
        >
          <Input placeholder="請輸入帳號..." className="rounded-lg py-2" />
        </Form.Item>

        <Form.Item
          name="displayName"
          label="顯示名稱"
          rules={[{ required: true, message: '請輸入顯示名稱！' }]}
        >
          <Input placeholder="請輸入顯示名稱..." className="rounded-lg py-2" />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="phone"
            label="手機"
            rules={[
              { required: true, message: '請輸入手機號碼！' },
              { pattern: /^[0-9]{10}$/, message: '手機號碼必須是10個數字！' }
            ]}
          >
            <Input placeholder="09xxxxxxxx" className="rounded-lg py-2" />
          </Form.Item>

          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true }]}
          >
            <Select mode="multiple" placeholder="請選擇角色">
              <Select.Option value="客戶">客戶</Select.Option>
              <Select.Option value="管理員">管理員</Select.Option>
              <Select.Option value="網站管理員">網站管理員</Select.Option>
            </Select>
          </Form.Item>
        </div>

        <Form.Item
          name="email"
          label="電子郵件地址"
          rules={[
            { required: true, message: '請輸入電子郵件地址！' },
            { type: 'email', message: '電子郵件地址格式不正確！' }
          ]}
        >
          <Input placeholder="example@gmail.com" className="rounded-lg py-2" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
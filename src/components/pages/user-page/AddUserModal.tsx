import { useEffect } from 'react';
import { Modal, Form, Input } from 'antd';

export interface UserFormData {
  username: string;
  phone: string;
  displayName: string;
  email: string;
}

interface AddUserModalProps {
  onClose: () => void;
  onSave: (data: UserFormData) => void;
  initialData?: UserFormData | null;
}

export default function AddUserModal({ onClose, onSave, initialData }: AddUserModalProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialData) {
      form.setFieldsValue(initialData);
    } else {
      form.resetFields();
    }
  }, [initialData, form]);

  const handleOk = () => {

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
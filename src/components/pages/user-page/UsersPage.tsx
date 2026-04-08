import { useState } from 'react';
import { Table, Button, Input, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Search, Plus, CloudDownload, SlidersHorizontal, ChevronDown, Tag} from 'lucide-react';
import { useUsers, type UserType } from '../../../context/UserContext';
import AddUserModal from './AddUserModal';

export default function UsersPage() {
  const { usersList, setUsersList } = useUsers();
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);

  const filteredData = usersList.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.displayName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns: ColumnsType<UserType> = [
    { title: '使用者名稱', dataIndex: 'username', key: 'username' },
    { title: '手機', dataIndex: 'phone', key: 'phone', render: (text) => <span className="text-gray-500">{text}</span> },
    { title: '顯示名稱', dataIndex: 'displayName', key: 'displayName' },
    { title: '電子郵件地址', dataIndex: 'email', key: 'email', render: (text) => <span className="text-gray-500">{text}</span> },
    { title: '文章', dataIndex: 'articles', key: 'articles', align: 'center', render: (text) => <span className="font-medium">{text}</span> },
    { title: 'Points', dataIndex: 'points', key: 'points', align: 'center', render: (text) => <span className="font-medium text-pink-500">{text}</span> },
    { 
      title: '會員等級', 
      dataIndex: 'tier', 
      render: (tier) => <Tag color="orange">{tier || '一般會員'}</Tag>
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <button 
            onClick={() => { setEditingUser(record); setIsModalOpen(true); }}
            className="bg-button-edit hover:bg-button-edit text-white text-[12px] px-3 py-1.5 rounded-full transition-colors"
          >
            編輯
          </button>
          <button 
            onClick={() => {
              if (window.confirm("您確定要刪除嗎？")) {
                setUsersList(prev => prev.filter(u => u.id !== record.id));
              }
            }}
            className="bg-white border border-button-edit text-button-edit hover:bg-pink-50 text-[12px] px-3 py-1.5 rounded-full transition-colors"
          >
            刪除
          </button>
        </Space>
      ),
    },
  ];

  return (
    <div className="flex flex-col h-full gap-6">
      
      <div className="flex justify-between items-center">
        <Input 
          prefix={<Search size={18} className="text-gray-400" />}
          placeholder="Search here..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-[300px] py-2.5 rounded-xl border-gray-100 hover:border-pink-300 focus:border-pink-400"
        />

        <div className="flex items-center gap-3">
          <Button 
            type="primary" 
            icon={<Plus size={16} />} 
            onClick={() => { setEditingUser(null); setIsModalOpen(true); }}
            className="bg-white text-blue-500 border-gray-100 shadow-sm h-11 rounded-xl px-4 flex items-center gap-2 hover:!bg-gray-50 hover:!text-blue-600"
          >
            <span className="font-medium text-gray-700">新增</span>
          </Button>
          
          <Button className="border-gray-100 shadow-sm h-11 rounded-xl px-4 flex items-center gap-2">
            <CloudDownload className="text-emerald-500" size={18} />
            <span className="font-medium text-gray-700">Download PDF</span>
          </Button>

          <Button className="border-gray-100 shadow-sm h-11 w-11 rounded-xl flex items-center justify-center">
            <SlidersHorizontal className="text-gray-500" size={18} />
          </Button>

          <Button className="border-gray-100 shadow-sm h-11 rounded-xl px-4 flex items-center gap-2">
            <span className="font-medium text-gray-700">Newest</span>
            <ChevronDown className="text-gray-500" size={16} />
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-[20px] shadow-sm border border-gray-50 overflow-hidden">
        <Table 
          columns={columns} 
          dataSource={filteredData} 
          rowKey="id" 
          pagination={{ 
            pageSize: 5, 
            showTotal: (total, range) => `Showing ${range[0]}-${range[1]} of ${total} data`,
            position: ['bottomLeft']
          }}
          className="custom-antd-table"
        />
      </div>

      {isModalOpen && (
        <AddUserModal 
          onClose={() => setIsModalOpen(false)} 
          onSave={(formData) => {
            if (editingUser) {
              setUsersList(prev => prev.map(u => u.id === editingUser.id ? { ...u, ...formData } : u));
            } else {
              setUsersList(prev => [{ ...formData, id: Date.now(), articles: 0, points: 0 }, ...prev]);
            }
          }}
          initialData={editingUser} 
        />
      )}
    </div>
  );
}
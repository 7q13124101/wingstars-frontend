import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Switch, DatePicker, Upload, message, Alert, Tag, Space, Image } from 'antd';
import { Search, Plus, CloudDownload, SlidersHorizontal, ChevronDown, MoreHorizontal } from 'lucide-react';
import { UploadOutlined, PictureOutlined, LinkOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';

const { RangePicker } = DatePicker;

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

interface BannerRecord {
  id: number;
  imgUrl: string;
  active: boolean;
  weight: number;
  url: string;
  timeRange: string[];
}

interface BannerFormValues {
  imgUrl: string;
  active: boolean;
  weight: number;
  schedule: [Dayjs, Dayjs]; 
  url?: string;
}

interface BannerApiResponse {
  id: number;
  image_url?: string;
  imageUrl?: string;
  status?: number;
  isActive?: boolean;
  display_order?: number;
  displayOrder?: number;
  link_url?: string;
  linkUrl?: string;
}

export default function BannersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [banners, setBanners] = useState<BannerRecord[]>([]);
  const [form] = Form.useForm<BannerFormValues>();

  const activeCount = banners.filter(b => b.active).length;
  const filteredData = banners.filter(banner => 
    banner.url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fetchBanners = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/banners`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('wingstars_token')}` }
      });
      const result = await res.json();
      
      if (res.ok && result.data) {
        const mappedData = result.data.map((item: BannerApiResponse) => ({
          id: item.id,
          imgUrl: (item.image_url || item.imageUrl || '').startsWith('http') 
                  ? (item.image_url || item.imageUrl) 
                  : API_BASE + (item.image_url || item.imageUrl),
          active: item.status === 1 || item.isActive === true,
          weight: item.display_order || item.displayOrder,
          url: item.link_url || item.linkUrl || '',
          timeRange: ['2026-04-01 00:00', '2026-04-30 23:59'] 
        }));
        setBanners(mappedData);
      }
    } catch (error) {
      console.error('Lỗi tải danh sách:', error);
      message.error('無法載入 Banner 列表！(Không thể tải danh sách)');
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleToggleStatus = async (record: BannerRecord, checked: boolean) => {
    if (checked && activeCount >= 5) {
      message.error('最多只能上架 5 張 Banner！');
      return;
    }
    
    setBanners(prev => prev.map(item => item.id === record.id ? { ...item, active: checked } : item));
    
    try {
      const res = await fetch(`${API_BASE}/api/admin/banners/${record.id}/status`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('wingstars_token')}` 
        },
        body: JSON.stringify({ status: checked ? 1 : 0 })
      });
      if (!res.ok) throw new Error();
      message.success(checked ? '已上架!' : '已下架!');
    } catch {
      message.error('狀態更新失敗 (Cập nhật trạng thái thất bại)');
      fetchBanners();
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("您確定要刪除嗎？(Bạn có chắc muốn xóa?)")) {
      try {
        const res = await fetch(`${API_BASE}/api/admin/banners/${id}/soft`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('wingstars_token')}` }
        });
        if (!res.ok) throw new Error();
        message.success('已刪除 Banner！');
        fetchBanners();
      } catch {
        message.error('刪除失敗 (Xóa thất bại)');
      }
    }
  };

  const columns: ColumnsType<BannerRecord> = [
    { 
      title: '圖片', 
      dataIndex: 'imgUrl', 
      width: 120,
      align: 'center',
      render: (imgUrl: string) => imgUrl ? (
        <Image src={imgUrl} alt="Banner" className="object-cover rounded border border-gray-100" width={80} height={45} />
      ) : (
        <div className="w-20 h-11 mx-auto bg-gray-50 border border-dashed border-gray-200 flex items-center justify-center rounded">
          <PictureOutlined className="text-gray-300 text-lg" />
        </div>
      )
    },
    { 
      title: '上下架', 
      dataIndex: 'active', 
      width: 120,
      align: 'center',
      render: (isActive: boolean, record: BannerRecord) => (
        <Switch 
          checked={isActive} 
          onChange={(checked) => handleToggleStatus(record, checked)}
          checkedChildren="On" 
          unCheckedChildren="Off" 
        /> 
      ) 
    },
    { 
      title: '排序', 
      dataIndex: 'weight', 
      width: 100,
      align: 'center',
      render: (w: number) => <Tag color="blue" className="m-0">{w}</Tag>
    },
    { 
      title: '定時上下架', 
      width: 200,
      render: (_, record) => (
        <div className="text-[11px] font-medium bg-gray-50 p-1.5 rounded border border-gray-100 inline-block">
          <div className="text-emerald-600 mb-0.5">開始: {record.timeRange[0]}</div>
          <div className="text-rose-500">結束: {record.timeRange[1]}</div>
        </div>
      ) 
    },
    { 
      title: '跳轉連結', 
      dataIndex: 'url', 
      ellipsis: true,
      render: (url: string) => url ? (
        <a href={url} target="_blank" rel="noreferrer" className="text-blue-500 hover:text-blue-700 flex items-center gap-1">
          <LinkOutlined /> <span className="truncate">{url}</span>
        </a>
      ) : <span className="text-gray-300">無連結</span>
    },
    { 
      title: '操作', 
      width: 220,
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <button 
            onClick={() => {
              setEditingId(record.id);
              form.setFieldsValue({
                active: record.active,
                weight: record.weight,
                url: record.url,
                schedule: [dayjs(record.timeRange[0]), dayjs(record.timeRange[1])],
                imgUrl: record.imgUrl
              });
              setIsModalOpen(true);
            }}
            className="bg-button-edit hover:bg-wingstars-primary text-white text-[12px] px-3 py-1.5 rounded-full transition-colors whitespace-nowrap"
          >
            編輯
          </button>
          <button 
            onClick={() => handleDelete(record.id)}
            className="bg-white border border-button-edit text-button-edit hover:bg-pink-50 text-[12px] px-3 py-1.5 rounded-full transition-colors whitespace-nowrap"
          >
            刪除
          </button>
          <Button type="text" icon={<MoreHorizontal size={18} className="text-gray-400" />} />
        </Space>
      ) 
    }
  ];

  const handleFinish = async (values: BannerFormValues) => {
    if (!editingId && values.active && activeCount >= 5) {
      message.error('最多只能上架 5 張 Banner！');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        title: "WingStars Banner",
        image_url: values.imgUrl.replace(API_BASE, ''), // Trả lại path tương đối cho BE nếu cần, hoặc để nguyên tùy BE
        link_url: values.url || "",
        position: "HOME_TOP",
        display_order: values.weight || 0,
        status: values.active ? 1 : 0
      };

      const method = editingId ? 'PUT' : 'POST';
      const endpoint = editingId ? `${API_BASE}/api/admin/banners/${editingId}` : `${API_BASE}/api/admin/banners`;

      const res = await fetch(endpoint, {
        method: method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('wingstars_token')}` 
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error();

      message.success(editingId ? 'Banner 更新成功！(Đã cập nhật)' : '已儲存新的 Banner！(Đã thêm mới)');
      setIsModalOpen(false);
      form.resetFields(); 
      setEditingId(null);
      
      fetchBanners();

    } catch {
      message.error('儲存失敗，請再試一次！(Lưu thất bại)');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-[calc(100vh-80px)] overflow-y-auto px-4 space-y-4 custom-scrollbar pb-10">
      
      <Alert 
        message={<span className="font-bold text-wingstars-primary">App 顯示規則</span>} 
        description={<span className="text-gray-600 ">僅顯示最多 5 個處於啟用（On）且在有效時間範圍內的 Banner。權重越高，顯示順序越靠前。</span>} 
        type="warning" 
        showIcon 
        className="bg-pink-50 border-pink-200 shadow-sm" 
      />

      <div className="flex justify-between items-center pt-6">
        <Input 
          prefix={<Search size={18} className="text-gray-400" />}
          placeholder="尋找橫幅..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-[400px] py-2.5 rounded-xl border-gray-100 hover:border-pink-300 focus:border-pink-400 shadow-sm"
        />

        <div className="flex items-center gap-3">
          <Button 
            type="primary" 
            icon={<Plus size={16} />} 
            onClick={() => {
              setEditingId(null); 
              form.resetFields(); 
              setIsModalOpen(true);
            }}
            className="bg-white text-blue-500 border-gray-100 shadow-sm h-11 rounded-xl px-4 flex items-center gap-2 hover:!bg-gray-50 hover:!text-blue-600"
          >
            <span className="font-medium text-gray-700">新增橫幅</span>
          </Button>
          
          <Button className="border-gray-100 shadow-sm h-11 rounded-xl px-4 flex items-center gap-2">
            <CloudDownload className="text-emerald-500" size={18} />
            <span className="font-medium text-gray-700">Export</span>
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
          scroll={{ x: 'max-content' }}
          pagination={{ 
            pageSize: 5, 
            showTotal: (total, range) => `Showing ${range[0]}-${range[1]} of ${total} banners`,
            position: ['bottomLeft'],
            className: "px-6 py-4 m-0 border-t border-gray-100 bg-gray-50/30" 
          }}
          className="custom-antd-table"
        />
      </div>

      <Modal 
        title={editingId ? "更新 Banner (編輯)" : "新增 Banner (新增)"} 
        open={isModalOpen} 
        onCancel={() => {
          if (isSubmitting) return;
          setIsModalOpen(false);
          setEditingId(null);
          form.resetFields();
        }} 
        onOk={() => form.submit()}
        okText={editingId ? "更新" : "儲存"}
        cancelText="取消"
        confirmLoading={isSubmitting}
        cancelButtonProps={{ disabled: isSubmitting }}
        width={600}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleFinish} className="mt-4">
          <Form.Item label="1. 圖片 URL（從媒體庫取得或直接上傳 - 需為 16:9）" required>
            <div className="flex gap-2">
              <Form.Item name="imgUrl" noStyle rules={[{ required: true, message: '請貼上圖片 URL 或上傳圖片！' }]}>
                <Input 
                  placeholder="請貼上 Media Library 中的圖片 URL..." 
                  disabled={isSubmitting} 
                  className="flex-1"
                />
              </Form.Item>
              
              <Upload 
                showUploadList={false}
                beforeUpload={async (file) => {
                  setIsSubmitting(true);
                  try {
                    const formData = new FormData();
                    formData.append('file', file);
                    
                    const uploadRes = await fetch(`${API_BASE}/api/files/upload?module_source=BANNER_HOME`, {
                      method: 'POST',
                      headers: { 'Authorization': `Bearer ${localStorage.getItem('wingstars_token')}` },
                      body: formData
                    });
                    
                    if (!uploadRes.ok) throw new Error();
                    const data = await uploadRes.json();
                    
                    const fileUrl = data.data?.fileUrl || data.data?.file_url || data.fileUrl;
                    const fullUrl = fileUrl.startsWith('http') ? fileUrl : API_BASE + fileUrl;
                    
                    form.setFieldValue('imgUrl', fullUrl);
                    message.success('上傳成功！');
                  } catch {
                    message.error('上傳失敗 (Tải lên thất bại)');
                  } finally {
                    setIsSubmitting(false);
                  }
                  return Upload.LIST_IGNORE;
                }}
              >
                <Button icon={<UploadOutlined />} disabled={isSubmitting}>快速上傳</Button>
              </Upload>
            </div>
            {editingId && <div className="text-xs text-gray-400 mt-1">若不想更換圖片，請保留原 URL</div>}
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item label="2. 狀態 (上下架)" name="active" valuePropName="checked" initialValue={false}>
              <Switch checkedChildren="上架中" unCheckedChildren="已下架" disabled={isSubmitting} />
            </Form.Item>

            <Form.Item label="3. 重量 (排序)" name="weight" initialValue={0}>
              <InputNumber className="w-full" min={0} disabled={isSubmitting} />
            </Form.Item>
          </div>

          <Form.Item label="4. 預約顯示時間 (定時上下架)" name="schedule" rules={[{ required: true, message: '請選擇時間區間！' }]}>
            <RangePicker showTime format="YYYY-MM-DD HH:mm" className="w-full" placeholder={['開始時間', '結束時間']} disabled={isSubmitting} />
          </Form.Item>

          <Form.Item label="5. 跳轉連結 (跳轉外部網頁 - WebView)" name="url">
            <Input placeholder="輸入 URL（例如: https://wingstars.com.tw/event)" disabled={isSubmitting} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
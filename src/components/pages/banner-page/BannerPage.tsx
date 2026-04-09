import { useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Switch, DatePicker, Upload, message, Alert, Tag, Space, Image } from 'antd';
import { Search, Plus, CloudDownload, SlidersHorizontal, ChevronDown, MoreHorizontal } from 'lucide-react';
import { UploadOutlined, PictureOutlined, LinkOutlined } from '@ant-design/icons';
import type { UploadProps, UploadFile } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';

const { RangePicker } = DatePicker;

interface BannerRecord {
  id: number;
  imgUrl: string;
  active: boolean;
  weight: number;
  url: string;
  timeRange: string[];
}

interface BannerFormValues {
  image?: { fileList: UploadFile[] };
  active: boolean;
  weight: number;
  schedule: [Dayjs, Dayjs]; 
  url?: string;
}

export default function BannersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form] = Form.useForm<BannerFormValues>();

  const [banners, setBanners] = useState<BannerRecord[]>([
    { 
      id: 1, 
      imgUrl: 'https://placehold.co/600x337/FF6B93/white?text=Wingstars+Event', 
      active: true, 
      weight: 99, 
      url: 'https://wingstars.com.tw/event-summer-2026', 
      timeRange: ['2026-04-01 00:00', '2026-04-30 23:59'] 
    },
    { 
      id: 2, 
      imgUrl: '', 
      active: false, 
      weight: 10, 
      url: 'https://wingstars.com.tw/news', 
      timeRange: ['2026-05-01 08:00', '2026-05-15 22:00'] 
    },
  ]);

  const activeCount = banners.filter(b => b.active).length;

  const filteredData = banners.filter(banner => 
    banner.url.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          onChange={(checked) => {
            if (checked && activeCount >= 5) {
              message.error('最多只能上架 5 張 Banner！');
              return;
            }
            setBanners(prev => prev.map(item => item.id === record.id ? { ...item, active: checked } : item));
            message.success(checked ? '已上架!' : '已下架!');
          }}
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
                schedule: [dayjs(record.timeRange[0]), dayjs(record.timeRange[1])]
              });
              setIsModalOpen(true);
            }}
            className="bg-button-edit hover:bg-wingstars-primary text-white text-[12px] px-3 py-1.5 rounded-full transition-colors whitespace-nowrap"
          >
            編輯
          </button>
          <button 
            onClick={() => {
              if (window.confirm("您確定要刪除嗎？")) {
                setBanners(prev => prev.filter(item => item.id !== record.id));
                message.success('已刪除 Banner！');
              }
            }}
            className="bg-white border border-button-edit text-button-edit hover:bg-pink-50 text-[12px] px-3 py-1.5 rounded-full transition-colors whitespace-nowrap"
          >
            刪除
          </button>
          <Button type="text" icon={<MoreHorizontal size={18} className="text-gray-400" />} />
        </Space>
      ) 
    }
  ];

  const uploadProps: UploadProps = {
    onRemove: () => setFileList([]),
    beforeUpload: (file) => {
      if (!file.type.startsWith('image/')) {
        message.error('僅允許上傳圖片文件！');
        return Upload.LIST_IGNORE;
      }
      setFileList([file]); 
      return false;
    },
    fileList, 
    maxCount: 1,
  };

  const handleFinish = async (values: BannerFormValues) => {
    if (!editingId && values.active && activeCount >= 5) {
      message.error('最多只能上架 5 張 Banner！');
      return;
    }

    setIsSubmitting(true);
    let finalImageUrl = '';

    try {
      // 如果使用者有選擇新圖片，則呼叫 File Service API
      if (fileList.length > 0) {
        const originFile = fileList[0] as unknown as File;
        const formData = new FormData();
        formData.append('file', originFile);

        const uploadUrl = 'https://chaim-leasable-outfly.ngrok-free.dev/swagger-ui/index.html#/api/files/upload?module_source=BANNER_HOME';
        const uploadRes = await fetch(uploadUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('wingstars_token')}`
          },
          body: formData
        });

        if (!uploadRes.ok) throw new Error('Upload failed');
        
        const uploadData = await uploadRes.json();
        finalImageUrl = uploadData.data?.file_url || uploadData.file_url; 
      }

      // 儲存橫幅（使用剛剛取得的實際圖像的 URL）
      if (editingId) {
        const oldBanner = banners.find(b => b.id === editingId);
        const urlToSave = finalImageUrl || oldBanner?.imgUrl || '';

        setBanners(prev => prev.map(item => item.id === editingId ? {
          ...item,
          imgUrl: urlToSave, 
          active: values.active,
          weight: values.weight || 0,
          url: values.url || '',
          timeRange: [
            values.schedule[0].format('YYYY-MM-DD HH:mm'),
            values.schedule[1].format('YYYY-MM-DD HH:mm')
          ]
        } : item));
        message.success('Banner 更新成功！');
      } else {
        const newBanner: BannerRecord = {
          id: Date.now(), 
          imgUrl: finalImageUrl, 
          active: values.active,
          weight: values.weight || 0,
          url: values.url || '',
          timeRange: [
            values.schedule[0].format('YYYY-MM-DD HH:mm'),
            values.schedule[1].format('YYYY-MM-DD HH:mm')
          ]
        };
        setBanners(prev => [newBanner, ...prev]);
        message.success('已儲存新的 Banner！');
      }

      setIsModalOpen(false);
      form.resetFields(); 
      setFileList([]); 
      setEditingId(null);

    } catch (error) {
      console.error('Error Upload:', error);
      message.error('上傳圖片失敗，請再試一次！');
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
          className="w-[300px] py-2.5 rounded-xl border-gray-100 hover:border-pink-300 focus:border-pink-400 shadow-sm"
        />

        <div className="flex items-center gap-3">
          <Button 
            type="primary" 
            icon={<Plus size={16} />} 
            onClick={() => {
              setEditingId(null); 
              form.resetFields(); 
              setFileList([]); 
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
          setFileList([]);
        }} 
        onOk={() => form.submit()}
        okText={editingId ? "更新" : "儲存"}
        cancelText="取消"
        // 在呼叫 API 期間鎖定按鈕
        confirmLoading={isSubmitting}
        cancelButtonProps={{ disabled: isSubmitting }}
        width={600}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleFinish} className="mt-4">
          <Form.Item label="1. 圖片（上傳圖片－需為16:9）" name="image" rules={[{ required: !editingId, message: '請選擇圖片！' }]}>
            <Upload {...uploadProps} listType="picture">
              <Button icon={<UploadOutlined />} disabled={isSubmitting}>上傳圖片（建議尺寸：1920x1080）</Button>
            </Upload>
            {editingId && <div className="text-xs text-gray-400 mt-1">若不想更換圖片，請留空</div>}
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item label="2. 狀態 (上下架)" name="active" valuePropName="checked" initialValue={true}>
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
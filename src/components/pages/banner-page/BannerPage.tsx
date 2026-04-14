import { useState, useEffect, useCallback } from 'react';
import { Table, Button, Modal, Form, Input, Switch, DatePicker, Upload, message, Tag, Space, Image, Card, Divider, Row, Col } from 'antd';
import { LinkOutlined, PictureOutlined, UploadOutlined } from '@ant-design/icons';
import { Search, Plus, Trash2 } from 'lucide-react';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import axios from 'axios';
import api from '../../../utils/api';

const { RangePicker } = DatePicker;
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://10.67.68.103:8080';

// --- Interfaces ---
interface BannerImage {
  id?: number;
  imageUrl: string;
  displayOrder: number;
  status: number;
  startTime: string | null;
  endTime: string | null;
}

interface BannerRecord {
  id: number;
  title: string;
  positionCode: string;
  linkUrl: string;
  status: number;
  images: BannerImage[];
}

interface FormImageItem {
  imageUrl: string;
  active: boolean;
  schedule?: [Dayjs, Dayjs];
  linkUrl?: string;
}

interface BannerFormValues {
  title: string;
  status: boolean;
  linkUrl?: string;
  images?: FormImageItem[];
}

export default function BannersPage() {
  const [form] = Form.useForm<BannerFormValues>();
  const [banners, setBanners] = useState<BannerRecord[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchBanners = useCallback(async () => {
    try {
      const res = await api.get('/api/admin/banners', { params: { page: 0, size: 50 } });
      const data = res.data?.data?.items || res.data?.items || [];
      setBanners(data);
    } catch (error) {
      console.error("Lỗi tải danh sách:", error);
    }
  }, []);

  useEffect(() => { fetchBanners(); }, [fetchBanners]);

  const handleFinish = async (values: BannerFormValues) => {
    setIsSubmitting(true);
    try {
      const formattedImages = (values.images || []).map((img, index) => ({
        imageUrl: img.imageUrl.replace(API_BASE, ''),
        displayOrder: index,
        status: img.active ? 1 : 0,
        startTime: img.schedule?.[0] ? img.schedule[0].toISOString() : null,
        endTime: img.schedule?.[1] ? img.schedule[1].toISOString() : null,
        linkUrl: img.linkUrl || "",
      }));

      const payload = {
        title: values.title,
        linkUrl: values.linkUrl || "",
        positionCode: "HOME_TOP",
        status: values.status ? 1 : 0,
        images: formattedImages
      };

      if (editingId) {
        await api.put(`/api/admin/banners/${editingId}`, payload);
      } else {
        await api.post('/api/admin/banners', payload);
      }

      message.success('儲存成功！');
      setIsModalOpen(false);
      fetchBanners();
    } catch (error) {
      if (axios.isAxiosError(error)) message.error(error.response?.data?.message || '儲存失敗');
    } finally { setIsSubmitting(false); }
  };

  const columns: ColumnsType<BannerRecord> = [
    {
      title: 'Banner 名稱',
      dataIndex: 'title',
      width: '30%',
      ellipsis: true,
      render: (text: string) => <span className="font-bold text-gray-700">{text}</span>
    },
    {
      title: '內容 (Nội dung)',
      width: 220,
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <div className="flex -space-x-2 overflow-hidden">
            {record.images.slice(0, 3).map((img, i) => (
              <Image 
                key={i} 
                src={img.imageUrl.startsWith('http') ? img.imageUrl : `${API_BASE}${img.imageUrl}`} 
                width={40} 
                height={40}
                className="rounded-full border-2 border-white object-cover shadow-sm"
                preview={false}
              />
            ))}
            {record.images.length > 3 && (
              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-gray-100 text-[10px] font-bold text-gray-500">
                +{record.images.length - 3}
              </div>
            )}
          </div>
          <span className="text-[11px] text-gray-400">共 {record.images.length} 張圖片</span>
        </Space>
      )
    },
    {
      title: '狀態',
      dataIndex: 'status',
      width: 120,
      render: (status: number) => <Tag color={status === 1 ? 'green' : 'default'}>{status === 1 ? '啟用中' : '已關閉'}</Tag>
    },
    {
      title: '操作',
      align: 'center',
      render: (_, record) => (
        <Space>
          <Button 
            shape="round" 
            size="middle"
            className="!bg-button-edit hover:!bg-button-edit !text-white hover:!text-white !border-none shadow-sm transition-colors"
            onClick={() => {
              setEditingId(record.id);
              form.setFieldsValue({
                title: record.title,
                status: record.status === 1,
                linkUrl: record.linkUrl,
                images: record.images.map(img => ({
                  imageUrl: img.imageUrl.startsWith('http') ? img.imageUrl : `${API_BASE}${img.imageUrl}`,
                  active: img.status === 1,
                  schedule: img.startTime && img.endTime ? [dayjs(img.startTime), dayjs(img.endTime)] : undefined,
                  linkUrl: (img as any).linkUrl || ""
                }))
              });
              setIsModalOpen(true);
            }}
          >編輯</Button>
          <Button 
            shape="round"
            size="middle"
            className="!bg-white !text-button-delete !border-button-delete hover:!bg-button-delete hover:!text-white hover:!border-button-delete transition-colors"
            onClick={async () => {
            if(window.confirm('確定刪除？')) {
              await api.delete(`/api/admin/banners/${record.id}/soft`);
              fetchBanners();
            }
          }}>刪除</Button>
        </Space>
      )
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <Space size="large">
          <Input 
            prefix={<Search size={16} className="text-gray-400" />}
            placeholder="搜尋..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="!w-72 rounded-xl"
          />
        </Space>
        <Button type="primary" icon={<Plus size={18} />} size="medium" className="rounded-xl shadow-md"
          onClick={() => { setEditingId(null); form.resetFields(); setIsModalOpen(true); }}>
          新增組合
        </Button>
      </div>

      <Table columns={columns} dataSource={banners.filter(b => b.title.includes(searchTerm))} rowKey="id" className="shadow-sm rounded-xl overflow-hidden" />

      <Modal title={editingId ? "編輯 Banner 組合" : "新增 Banner 組合"} open={isModalOpen} onOk={() => form.submit()} onCancel={() => setIsModalOpen(false)} width={900} confirmLoading={isSubmitting} destroyOnClose>
        <Form form={form} layout="vertical" onFinish={handleFinish} className="mt-4">
          <Row gutter={16}>
            <Col span={16}><Form.Item label="Banner 名稱" name="title" rules={[{ required: true }]}><Input placeholder="例如：首頁頂部輪播" /></Form.Item></Col>
            <Col span={8}><Form.Item label="整體狀態" name="status" valuePropName="checked"><Switch checkedChildren="開啟" unCheckedChildren="關閉" /></Form.Item></Col>
          </Row>

          <Divider><span className="text-gray-400 text-xs">圖片清單</span></Divider>

          <Form.List name="images">
            {(fields, { add, remove, move }) => (
              <div className="space-y-4">
                {fields.map(({ key, name, ...restField }, index) => (
                  <Card key={key} size="small" className="bg-gray-50 border-gray-200 relative pt-2">

                    <div className="absolute top-2 right-2 z-10 flex items-center gap-1 bg-white p-1 rounded-md shadow-sm border border-gray-100">
                      <Button 
                        type="text" 
                        size="small" 
                        disabled={index === 0} 
                        onClick={() => move(index, index - 1)}
                        className="text-gray-500 hover:text-blue-500 flex items-center justify-center p-1"
                      >
                        <span className="text-xs">▲</span>
                      </Button>
                      
                      <Button 
                        type="text" 
                        size="small" 
                        disabled={index === fields.length - 1} 
                        onClick={() => move(index, index + 1)}
                        className="text-gray-500 hover:text-blue-500 flex items-center justify-center p-1"
                      >
                        <span className="text-xs">▼</span>
                      </Button>
                      
                      <div className="w-[1px] h-4 bg-gray-200 mx-1"></div>

                      <Button 
                        type="text" 
                        danger 
                        size="small"
                        icon={<Trash2 size={14} />} 
                        onClick={() => remove(name)} 
                      />
                    </div>
                    <Row gutter={20} align="top">
                      <Col span={6}>
                        <Form.Item shouldUpdate={(prev, curr) => prev.images?.[name]?.imageUrl !== curr.images?.[name]?.imageUrl} noStyle>
                          {() => {
                            const url = form.getFieldValue(['images', name, 'imageUrl']);
                            return (
                              <div className="w-full h-24 bg-white border rounded-lg overflow-hidden flex items-center justify-center border-dashed border-gray-300">
                                {url ? <Image src={url} className="object-contain w-full h-full" fallback="https://placehold.co/400x200?text=No+Image" /> : <PictureOutlined className="text-3xl text-gray-200" />}
                              </div>
                            );
                          }}
                        </Form.Item>
                      </Col>

                      <Col span={18}>
                        <div className="flex gap-2 mb-3 pr-[110px]">
                          <Form.Item {...restField} name={[name, 'imageUrl']} className="flex-1 mb-0" rules={[{ required: true, message: '請輸入連結或 Upload' }]}>
                            <Input prefix={<LinkOutlined className="text-gray-400" />} placeholder="貼上 Media Library 的 link..." />
                          </Form.Item>
                          <Upload showUploadList={false} beforeUpload={async (file) => {
                              const fd = new FormData(); fd.append('file', file);
                              const res = await api.post('/api/files/upload?module_source=BANNER_HOME', fd);
                              const newUrl = `${API_BASE}${res.data.data.fileUrl}`;
                              const currentImages = form.getFieldValue('images');
                              currentImages[name].imageUrl = newUrl;
                              form.setFieldsValue({ images: [...currentImages] });
                              return false;
                            }}>
                            <Button icon={<UploadOutlined />}>Upload</Button>
                          </Upload>
                        </div>

                        <Form.Item {...restField} name={[name, 'linkUrl']} className="mb-3">
                          <Input prefix={<LinkOutlined className="text-blue-400" />} placeholder="Webview Link..." />
                        </Form.Item>

                        <Row gutter={16}>
                          <Col span={4}><Form.Item {...restField} name={[name, 'active']} valuePropName="checked" label="顯示" className="mb-0"><Switch size="small" /></Form.Item></Col>
                          <Col span={20}><Form.Item {...restField} name={[name, 'schedule']} label="預約時間" className="mb-0"><RangePicker size="small" showTime className="w-full" /></Form.Item></Col>
                        </Row>
                      </Col>
                    </Row>
                  </Card>
                ))}
                <Button type="dashed" onClick={() => add({ active: true })} block icon={<Plus size={16} />} className="h-12 border-blue-200 text-blue-500">添加圖片</Button>
              </div>
            )}
          </Form.List>
        </Form>
      </Modal>
    </div>
  );
}
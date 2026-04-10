import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, message, Tag, Space, Image } from 'antd';
import { Search, Plus, CloudDownload, SlidersHorizontal, ChevronDown, MoreHorizontal } from 'lucide-react';
import { PictureOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import img18 from '../../../assets/member/18黃澄澄.png';
import img2 from '../../../assets/member/2安芝儇.png';

interface MemberImage {
    id: number;
    number: number;
    imgUrl: React.ReactNode;
    name: string;
    birthday: string;
    star: string;
    active: boolean;
    weight: number;
    url: string;
    timeRange: string[];
}

interface BannerFormValues {
    image?: { fileList: UploadFile[] };
    // nember: number;
    active: boolean;
    weight: number;
    schedule: [Dayjs, Dayjs];
    url?: string;
}

export default function MemberPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);

    const [form] = Form.useForm<BannerFormValues>();

    const [banners, setBanners] = useState<MemberImage[]>([
        {
            id: 1,
            number: 18,
            imgUrl: img18,
            name: '安芝儇',
            birthday: '1998-09-08',
            star: '處女座',
            active: true,
            weight: 99,
            url: 'https://wingstars.com.tw/event-summer-2026',
            timeRange: ['2026-04-01 00:00', '2026-04-30 23:59'],
        },
        {
            id: 2,
            number: 2,
            imgUrl: img2,
            name: '黃澄澄',
            birthday: '2003-02-11',
            star: '水瓶座',
            active: false,
            weight: 10,
            url: 'https://wingstars.com.tw/news',
            timeRange: ['2026-05-01 08:00', '2026-05-15 22:00'],
        },
    ]);

    const filteredData = banners.filter((banner) => banner.url.toLowerCase().includes(searchTerm.toLowerCase()));

    const columns: ColumnsType<MemberImage> = [
        {
            title: '背好',
            dataIndex: 'number',
            width: 120,
            align: 'center',
            render: (w: number) => (
                <Tag color="blue" className="m-0">
                    {w}
                </Tag>
            ),
        },
        {
            title: '圖片',
            dataIndex: 'imgUrl',
            width: 120,
            align: 'center',
            render: (imgUrl: string) =>
                imgUrl ? (
                    <Image src={imgUrl} alt="Member" className="object-cover" width={80} height={95} />
                ) : (
                    <div className="w-20 h-11 mx-auto bg-gray-50 border border-dashed border-gray-200 flex items-center justify-center rounded">
                        <PictureOutlined className="text-gray-300 text-lg" />
                    </div>
                ),
        },
        {
            title: '姓名',
            dataIndex: 'name',
            width: 120,
            align: 'center',
            render: (w: string) => (
                <Tag color="blue" className="m-0">
                    {w}
                </Tag>
            ),
        },
        {
            title: '生日',
            dataIndex: 'birthday',
            width: 100,
            align: 'center',
            render: (w: number) => (
                <Tag color="blue" className="m-0">
                    {w}
                </Tag>
            ),
        },
        {
            title: '坐星',
            dataIndex: 'star',
            width: 100,
            align: 'center',
            render: (w: number) => (
                <Tag color="blue" className="m-0">
                    {w}
                </Tag>
            ),
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
                            });
                            setIsModalOpen(true);
                        }}
                        className="bg-button-edit hover:bg-wingstars-primary text-white text-[12px] px-3 py-1.5 rounded-full transition-colors whitespace-nowrap"
                    >
                        編輯
                    </button>
                    <button
                        onClick={() => {
                            if (window.confirm('您確定要刪除嗎？')) {
                                setBanners((prev) => prev.filter((item) => item.id !== record.id));
                                message.success('已刪除 Banner！');
                            }
                        }}
                        className="bg-white border border-button-edit text-button-edit hover:bg-pink-50 text-[12px] px-3 py-1.5 rounded-full transition-colors whitespace-nowrap"
                    >
                        刪除
                    </button>
                    <Button type="text" icon={<MoreHorizontal size={18} className="text-gray-400" />} />
                </Space>
            ),
        },
    ];

    return (
        <div className="h-[calc(100vh-80px)] overflow-y-auto px-4 space-y-4 custom-scrollbar pb-10">
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
                        className: 'px-6 py-4 m-0 border-t border-gray-100 bg-gray-50/30',
                    }}
                    className="custom-antd-table"
                />
            </div>

            <Modal
                title={editingId ? '更新 Banner (編輯)' : '新增 Banner (新增)'}
                open={isModalOpen}
                onCancel={() => {
                    setIsModalOpen(false);
                    setEditingId(null);
                    form.resetFields();
                }}
                onOk={() => form.submit()}
                okText={editingId ? '更新' : '儲存'}
                cancelText="取消"
                // 在呼叫 API 期間鎖定按鈕
                width={600}
                destroyOnClose
            ></Modal>
        </div>
    );
}

import { useState, useEffect, useCallback } from 'react';
import { Input, Button, Select, Modal, message, Upload, Tooltip, Pagination } from 'antd';
import { Search, UploadCloud, Copy, Eye, Trash2, Folder, Image as ImageIcon } from 'lucide-react';
import dayjs from 'dayjs';
import api from '../../../utils/api';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

interface MediaAsset {
  id: number;
  file_name: string;
  file_url: string;
  module_source: string;
  file_size: string;
  created_at: string;
}

interface CustomUploadOptions {
  file: File | Blob | string;
  onSuccess?: (body: string) => void;
  onError?: (err: Error) => void;
}

interface MediaApiResponse {
  id?: number;
  mediaId?: number;
  title?: string;
  fileName?: string;
  storedName?: string;
  fileUrl?: string;
  file_url?: string;
  moduleSource?: string;
  module_source?: string;
  fileSize?: number;
  file_size?: number;
  createdAt?: string;
  created_at?: string;
}

const formatBytes = (bytes: number) => {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default function MediaLibraryPage() {

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModule, setSelectedModule] = useState('ALL');
  
  const [currentPage, setCurrentPage] = useState(1); 
  const [pageSize, setPageSize] = useState(10);      
  const [totalElements, setTotalElements] = useState(0);

  const [mediaList, setMediaList] = useState<MediaAsset[]>([]); 
  const [selectedImage, setSelectedImage] = useState<MediaAsset | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMediaList = useCallback(async () => {
    setIsLoading(true);
    try {
      const bePage = currentPage - 1; 
      
      const params: Record<string, string | number> = {
        page: bePage,
        size: pageSize,
        sort: 'id,desc' 
      };

      if (selectedModule !== 'ALL') {
        params.moduleSource = selectedModule;
      }

      const res = await api.get('/api/admin/files', { params }); 
      const result = res.data; 

      if (result) {
        let content: MediaApiResponse[] = [];
        let total = 0;

        if (Array.isArray(result.data)) {
          content = result.data;
          total = result.totalElements || content.length;
        } else if (result.data && Array.isArray(result.data.content)) {
          content = result.data.content;
          total = result.data.totalElements || content.length;
        } else if (result.data && Array.isArray(result.data.items)) {
          content = result.data.items;
          total = result.data.total || content.length;
        } else if (Array.isArray(result.content)) {
          content = result.content;
          total = result.totalElements || content.length;
        }

        const mappedData: MediaAsset[] = content.map((item: MediaApiResponse) => {

          const rawUrl = item.fileUrl || item.file_url || '';
          const finalUrl = rawUrl.startsWith('http') ? rawUrl : API_BASE + rawUrl;
          const rawDate = item.createdAt || item.created_at;

          return {
            id: item.id || item.mediaId || 0,
            file_name: item.fileName || item.title || 'Unknown File', 
            file_url: finalUrl,
            module_source: item.moduleSource || item.module_source || 'SYSTEM',
            file_size: formatBytes(item.fileSize || item.file_size || 0),
            created_at: rawDate ? dayjs(rawDate).format('YYYY-MM-DD HH:mm') : '--'
          };
        });

        setMediaList(mappedData);
        setTotalElements(total);
      }
    } catch (error) {
      console.error(error);
      message.error('無法載入媒體庫 (Không thể tải thư viện media)');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, selectedModule]);

  useEffect(() => {
    fetchMediaList();
  }, [fetchMediaList]);

  const handleModuleChange = (value: string) => {
    setSelectedModule(value);
    setCurrentPage(1); 
  };

  const filteredMedia = mediaList.filter(media => 
    media.file_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    message.success('已複製連結!');
  };

  const handleUpload = async (options: CustomUploadOptions) => {
    const { file, onSuccess, onError } = options;
    setIsUploading(true);

    try {
      const formData = new FormData();
      
      const actualFile = (file as { originFileObj?: File }).originFileObj || file;
      formData.append('file', actualFile as File);

      const targetModule = selectedModule === 'ALL' ? 'SYSTEM' : selectedModule;
      
      await api.post(`/api/admin/files/upload?module_source=${targetModule}`, formData);

      if (onSuccess) onSuccess("ok");
      
      const fileName = (actualFile as File).name || '檔案';
      message.success(`已成功上傳 ${fileName}!`);
      
      fetchMediaList();

    } catch (error) {
      console.error("Chi tiết lỗi Upload:", error);
      if (onError) onError(error as Error);
      message.error('上傳失敗!');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("確定要刪除這個檔案嗎？")) return;

    try {
      await api.delete(`/api/admin/files/${id}`);
      message.success('已刪除檔案');
      setSelectedImage(null); 
      fetchMediaList();       
    } catch {
      message.error('刪除失敗');
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] overflow-y-auto px-6 pb-10 gap-6 custom-scrollbar">

      <div className="flex justify-between items-center pt-6">
        <div className="flex items-center gap-4">
          <Input 
            prefix={<Search size={18} className="text-gray-400" />}
            placeholder="搜尋目前頁面檔案..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-72 py-2.5 rounded-xl border-gray-100 hover:border-pink-300 focus:border-pink-400 shadow-sm"
          />
          
          <Select 
            value={selectedModule} 
            className="w-[200px] h-[44px] custom-select-rounded" 
            onChange={handleModuleChange}
            options={[
              { value: 'ALL', label: <div className="flex items-center gap-2"><Folder size={14}/> <span>所有檔案</span></div> },
              { value: 'CHEERLEADER_AVATAR', label: '啦啦隊頭像' },
              { value: 'CHEERLEADER_AUDIO', label: '啦啦隊語音' },
              { value: 'CHEERLEADER_GALLERY', label: '啦啦隊相簿' },
              { value: 'BANNER_HOME', label: '首頁橫幅' },
              { value: 'BANNER_PROMO', label: '促銷橫幅' },
              { value: 'USER_AVATAR', label: '用戶頭像' },
              { value: 'SYSTEM_ASSET', label: '系統資源' },
              { value: 'UNKNOWN', label: '未分類' },
            ]}
          />
        </div>

        <div className="flex items-center gap-3">
          <Upload 
            showUploadList={false} 
            customRequest={handleUpload}
            accept="image/*,video/*"
          >
            <Button 
              type="primary" 
              loading={isUploading}
              icon={<UploadCloud size={18} />} 
              className="bg-button-edit hover:!bg-wingstars-primary border-none shadow-sm h-11 rounded-xl px-5 flex items-center gap-2"
            >
              <span className="font-bold text-white">
                {isUploading ? '上傳中...' : '上傳檔案'}
              </span>
            </Button>
          </Upload>
        </div>
      </div>

      <div className="bg-white rounded-[20px] shadow-sm border border-gray-50 p-6 min-h-[500px] flex flex-col relative gap-8 shrink-0 h-fit">
        {isLoading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-[20px]">
            <span className="text-pink-500 font-bold animate-pulse">載入中...</span>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filteredMedia.map((media) => (
            <div key={media.id} className="group relative rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 bg-gray-50/50 flex flex-col">
              <div className="aspect-square bg-gray-100 relative overflow-hidden flex items-center justify-center">
                <img src={media.file_url} loading="lazy" alt={media.file_name} className="object-contain w-full h-full p-2" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3 backdrop-blur-sm">
                  <Tooltip title="預覽">
                    <button onClick={() => setSelectedImage(media)} className="w-10 h-10 rounded-full bg-white text-gray-700 flex items-center justify-center hover:bg-pink-50 hover:text-pink-500 transition-colors">
                      <Eye size={18} />
                    </button>
                  </Tooltip>
                  <Tooltip title="複製連結">
                    <button onClick={() => handleCopyLink(media.file_url)} className="w-10 h-10 rounded-full bg-white text-gray-700 flex items-center justify-center hover:bg-blue-50 hover:text-blue-500 transition-colors">
                      <Copy size={18} />
                    </button>
                  </Tooltip>
                </div>
                <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur-md">
                  {media.module_source}
                </div>
              </div>
              <div className="p-3 bg-white">
                <p className="text-[13px] font-bold text-gray-800 truncate" title={media.file_name}>
                  {media.file_name}
                </p>
                <div className="flex justify-between items-center mt-1.5">
                  <span className="text-[11px] font-medium text-gray-400">{media.file_size}</span>
                  <span className="text-[11px] font-medium text-gray-400">{media.created_at}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {!isLoading && filteredMedia.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 py-10">
            <ImageIcon size={48} className="opacity-20 mb-3"/>
            <p>找不到任何檔案</p>
          </div>
        )}

        <div className="mt-auto flex justify-between items-center border-t border-gray-50 pt-4">
          <span className="text-sm text-gray-500">共 {totalElements} 項目</span>
          <Pagination 
            current={currentPage} 
            pageSize={pageSize}
            total={totalElements} 
            onChange={(page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            }}
            showSizeChanger
            className="custom-pagination" 
          />
        </div>
      </div>

      <Modal
        title={<span className="text-lg font-bold flex items-center gap-2"><ImageIcon size={20} className="text-pink-500"/> 檔案詳情 (Chi tiết file)</span>}
        open={!!selectedImage}
        onCancel={() => setSelectedImage(null)}
        footer={null}
        width={700}
        centered
        destroyOnClose
      >
        {selectedImage && (
          <div className="flex gap-6 mt-4">
            <div className="w-1/2 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center overflow-hidden h-[300px]">
              <img src={selectedImage.file_url} alt="Preview" className="max-w-full max-h-full object-contain" />
            </div>
            <div className="w-1/2 space-y-4">
              <div>
                <p className="text-xs text-gray-400 mb-1">檔案名稱</p>
                <p className="text-sm font-bold text-gray-800 break-all">{selectedImage.file_name}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-400 mb-1">大小</p>
                  <p className="text-sm font-medium text-gray-700">{selectedImage.file_size}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">上傳日期</p>
                  <p className="text-sm font-medium text-gray-700">{selectedImage.created_at}</p>
                </div>
              </div>
              <div className="pt-2 border-t border-gray-100">
                <p className="text-xs text-gray-400 mb-2">檔案連結</p>
                <div className="flex gap-2">
                  <Input value={selectedImage.file_url} readOnly className="bg-gray-50 text-xs" />
                  <Button icon={<Copy size={14} />} onClick={() => handleCopyLink(selectedImage.file_url)} />
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <Button danger icon={<Trash2 size={16} />} className="rounded-lg" onClick={() => handleDelete(selectedImage.id)}>
                  刪除
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
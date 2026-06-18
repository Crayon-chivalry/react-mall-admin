import { useState, useEffect } from "react";
import { Upload, Image } from "antd";
import type { GetProp, UploadFile, UploadProps } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import useUserStore from '@/store/userStore';

// 上传的地址
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'
const action = baseURL + '/uploads/images'

// Upload beforeUpload 参数类型，用于读取本地文件进行预览。
type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

// #sym:getBase64
// 将本地文件读取为 Base64 字符串，便于图片预览。
const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

interface UploadImagesProps {
  maxCount?: number;
  onUploadSuccess?: (urls: string[]) => void;
  initialUrls?: string[];
}

const UploadImages = ({ maxCount = 1, onUploadSuccess, initialUrls = [] }: UploadImagesProps) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  // 请求头
  const { token } = useUserStore();
  const headers = {authorization: `Bearer ${token}`}

  // 把已经上传的图片转成 Upload 组件可识别的 fileList
  useEffect(() => {
    if (!initialUrls?.length) {
      setFileList([]);
      return;
    }

    setFileList(
      initialUrls.map((url, index) => ({
        uid: `init-${index}`,
        name: `image-${index}`,
        status: 'done',
        url,
        thumbUrl: url,
      })) as UploadFile[],
    );
  }, [initialUrls]);

  // 点击文件链接或预览图标时的回调
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  // 上传文件改变时的回调，父组件可通过 onUploadSuccess 获取已上传的图片 URL
  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);

    const uploadedUrls = newFileList
      .filter((item) => item.status === 'done' || item.url)
      .map((item) => {
        const response = item.response as any;
        return response?.data?.url || item.url || '';
      })
      .filter(Boolean) as string[];

    onUploadSuccess?.(uploadedUrls);
  };
  
  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  return (
    <>
      <Upload
        action={action}
        headers={headers}
        listType="picture-card"
        maxCount={maxCount}
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
      >
        {fileList.length >= 8 ? null : uploadButton}
      </Upload>
      {previewImage && (
        <Image
          wrapperStyle={{ display: 'none' }}
          preview={{
            open: previewOpen,
            onOpenChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(""),
          }}
          src={previewImage}
        />
      )}
    </>
  );
};

export default UploadImages;

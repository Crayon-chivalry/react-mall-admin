import { useState, useEffect } from "react";
import { Editor, Toolbar } from "@wangeditor/editor-for-react";
import type { IDomEditor, IEditorConfig, IToolbarConfig } from "@wangeditor/editor";
import "@wangeditor/editor/dist/css/style.css";

import useUserStore from "@/store/userStore";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/admin";

interface RichEditorProps {
  value?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  style?: React.CSSProperties;
}

const RichEditor = ({
  value = "",
  onChange,
  placeholder = "请输入内容...",
  style,
}: RichEditorProps) => {
  const [editor, setEditor] = useState<IDomEditor | null>(null);
  const [html, setHtml] = useState(value);
  const { token } = useUserStore();

  // 外部 value 变化时同步
  useEffect(() => {
    if (value !== html) {
      setHtml(value);
    }
  }, [value]);

  // 组件卸载时销毁编辑器
  useEffect(() => {
    return () => {
      if (editor) {
        editor.destroy();
        setEditor(null);
      }
    };
  }, [editor]);

  const toolbarConfig: Partial<IToolbarConfig> = {};
  const editorConfig: Partial<IEditorConfig> = {
    placeholder,
    MENU_CONF: {
      uploadImage: {
        server: `${baseURL}/uploads/images`,
        headers: { authorization: `Bearer ${token}` },
        fieldName: "file",
        customInsert(res: any, insertFn: (url: string, alt?: string, href?: string) => void) {
          const url = res?.data?.url;
          if (url) insertFn(url, "", "");
        },
      },
    },
  };

  const handleChange = (editor: IDomEditor) => {
    const newHtml = editor.getHtml();
    setHtml(newHtml);
    onChange?.(newHtml);
  };

  return (
    <div style={{ border: "1px solid #d9d9d9", borderRadius: 4, ...style }}>
      <Toolbar
        editor={editor}
        defaultConfig={toolbarConfig}
        style={{ borderBottom: "1px solid #d9d9d9" }}
      />
      <Editor
        defaultConfig={editorConfig}
        value={html}
        onCreated={setEditor}
        onChange={handleChange}
        style={{ minHeight: 300, overflowY: "hidden" }}
      />
    </div>
  );
};

export default RichEditor;

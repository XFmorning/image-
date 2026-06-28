import { useEffect, useState } from "react";
import {
  Card,
  Button,
  Image,
  Tag,
  Space,
  Popconfirm,
  Empty,
  message,
  Tooltip,
  Spin,
} from "antd";
import {
  DeleteOutlined,
  DownloadOutlined,
  FolderOpenOutlined,
  ClearOutlined,
  PictureOutlined,
  CopyOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

export default function History() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadHistory = async () => {
    const history = await window.electronAPI.getHistory();
    history.sort((a: HistoryItem, b: HistoryItem) => b.timestamp - a.timestamp);
    for (const item of history) {
      if (item.imagePath && item.status === "completed") {
        try {
          (item as any)._dataUrl = await window.electronAPI.readImage(item.imagePath);
        } catch {
          (item as any)._dataUrl = "";
        }
      }
    }
    setItems(history);
    setLoading(false);
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleDelete = async (id: string) => {
    const updated = items.filter((item) => item.id !== id);
    setItems(updated);
    await window.electronAPI.setHistory(updated);
    message.success("已删除");
  };

  const handleClearAll = async () => {
    await window.electronAPI.clearAllImages();
    setItems([]);
    message.success("已清空全部记录和图片");
  };

  const handleOpenFolder = async () => {
    await window.electronAPI.openStorageFolder();
  };

  const handleDownload = (dataUrl: string, id: string) => {
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `generated_${id}.png`;
    link.click();
  };

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleString("zh-CN", {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
        }}
      >
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h2>历史记录</h2>
        </div>
        <Space>
          <Tag color="blue">共 {items.length} 张</Tag>
          <Tooltip title="打开存储文件夹">
            <Button icon={<FolderOpenOutlined />} onClick={handleOpenFolder} />
          </Tooltip>
          {items.length > 0 && (
            <Popconfirm
              title="确定清空所有记录和图片？"
              onConfirm={handleClearAll}
              okText="确定"
              cancelText="取消"
            >
              <Button danger icon={<ClearOutlined />}>
                清空全部
              </Button>
            </Popconfirm>
          )}
        </Space>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 80 }}>
          <Spin size="large" />
        </div>
      ) : items.length === 0 ? (
        <Empty
          image={<PictureOutlined style={{ fontSize: 64, color: "#ccc" }} />}
          description="还没有生成过图片"
          style={{ paddingTop: 80 }}
        >
          <Button type="primary" onClick={() => navigate("/")}>
            去生成
          </Button>
        </Empty>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 16,
          }}
        >
          {items.map((item) => (
            <Card
              key={item.id}
              hoverable
              size="small"
              styles={{ body: { padding: 12 } }}
              actions={[
                <Tooltip title="复制提示词" key="copy">
                  <CopyOutlined
                    onClick={() => {
                      navigator.clipboard.writeText(item.prompt);
                      message.success("提示词已复制");
                    }}
                  />
                </Tooltip>,
                <Tooltip title="下载" key="download">
                  <DownloadOutlined
                    onClick={() =>
                      handleDownload((item as any)._dataUrl, item.id)
                    }
                  />
                </Tooltip>,
                <Popconfirm
                  title="确定删除此记录？"
                  onConfirm={() => handleDelete(item.id)}
                  okText="确定"
                  cancelText="取消"
                  key="delete"
                >
                  <DeleteOutlined style={{ color: "#ff4d4f" }} />
                </Popconfirm>,
              ]}
            >
              <div
                style={{
                  width: "100%",
                  height: 200,
                  overflow: "hidden",
                  borderRadius: 6,
                  marginBottom: 8,
                  background: "#f0f0f0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {item.status === "completed" && (item as any)._dataUrl ? (
                  <Image
                    src={(item as any)._dataUrl}
                    alt={item.prompt}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    preview={{ mask: "预览" }}
                  />
                ) : (
                  <PictureOutlined style={{ fontSize: 32, color: "#ccc" }} />
                )}
              </div>

              <div
                style={{
                  fontSize: 13,
                  color: "#333",
                  lineHeight: 1.4,
                  maxHeight: 36,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  marginBottom: 8,
                }}
                title={item.prompt}
              >
                {item.prompt}
              </div>
              <Space size={4} wrap>
                <Tag color="purple" style={{ fontSize: 11 }}>
                  {item.providerName}
                </Tag>
                <Tag style={{ fontSize: 11 }}>{item.model}</Tag>
                <Tag style={{ fontSize: 11 }}>{item.size}</Tag>
                {item.mode === "i2i" && (
                  <Tag color="orange" style={{ fontSize: 11 }}>
                    图生图
                  </Tag>
                )}
              </Space>
              <div style={{ fontSize: 11, color: "#999", marginTop: 8 }}>
                {formatTime(item.timestamp)}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

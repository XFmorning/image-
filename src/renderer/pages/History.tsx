import { useEffect, useState, useRef, useCallback } from "react";
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

type HistoryEntry = HistoryItem & { _dataUrl?: string; _loading?: boolean };

// 模块级缓存
let _cachedItems: HistoryEntry[] | null = null;
const _loadedImages = new Map<string, string>(); // imagePath → dataUrl

export default function History() {
  const [items, setItems] = useState<HistoryEntry[]>(_cachedItems || []);
  const [ready, setReady] = useState(!!_cachedItems);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const navigate = useNavigate();

  const refreshMeta = useCallback(async () => {
    const history = await window.electronAPI.getHistory();
    history.sort((a: HistoryItem, b: HistoryItem) => b.timestamp - a.timestamp);
    const entries: HistoryEntry[] = history.map((item) => ({
      ...item,
      _dataUrl: _loadedImages.get(item.imagePath || ""),
    }));
    _cachedItems = entries;
    setItems(entries);
  }, []);

  // 每次进入页面刷新元数据（复用已缓存的图片 dataUrl）
  useEffect(() => {
    refreshMeta().then(() => setReady(true));
  }, [refreshMeta]);

  // 窗口获焦时也刷新
  useEffect(() => {
    const handleFocus = () => refreshMeta();
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [refreshMeta]);

  // 懒加载单张图片
  const loadImage = useCallback(async (item: HistoryEntry) => {
    if (!item.imagePath || item._dataUrl || item._loading) return;
    const cached = _loadedImages.get(item.imagePath);
    if (cached) {
      setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, _dataUrl: cached } : i)));
      return;
    }
    // 标记加载中
    setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, _loading: true } : i)));
    try {
      const du = await window.electronAPI.readImage(item.imagePath);
      _loadedImages.set(item.imagePath!, du);
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, _dataUrl: du, _loading: false } : i))
      );
      // 更新全局缓存
      if (_cachedItems) {
        const idx = _cachedItems.findIndex((c) => c.id === item.id);
        if (idx >= 0) _cachedItems[idx]._dataUrl = du;
      }
    } catch {
      setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, _dataUrl: "", _loading: false } : i)));
    }
  }, []);

  // IntersectionObserver：卡片进入视口时加载图片
  const cardRef = useCallback(
    (node: HTMLDivElement | null, item: HistoryEntry) => {
      if (!node || item._dataUrl !== undefined) return;
      if (!observerRef.current) {
        observerRef.current = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                const el = entry.target as HTMLDivElement;
                const id = el.dataset.historyId;
                const found = items.find((i) => i.id === id);
                if (found) loadImage(found);
                observerRef.current?.unobserve(el);
              }
            });
          },
          { rootMargin: "200px" }
        );
      }
      node.dataset.historyId = item.id;
      observerRef.current.observe(node);
    },
    [items, loadImage]
  );

  const handleDelete = async (id: string) => {
    const updated = items.filter((item) => item.id !== id);
    setItems(updated);
    _cachedItems = updated;
    await window.electronAPI.setHistory(updated);
    message.success("已删除");
  };

  const handleClearAll = async () => {
    await window.electronAPI.clearAllImages();
    setItems([]);
    _cachedItems = [];
    _loadedImages.clear();
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

  if (!ready) return null;

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

      {items.length === 0 ? (
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
            <div
              key={item.id}
              ref={(node) => cardRef(node, item)}
            >
              <Card
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
                        item._dataUrl && handleDownload(item._dataUrl, item.id)
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
                  {item._dataUrl ? (
                    <Image
                      src={item._dataUrl}
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

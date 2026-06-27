import { useState, useRef, useEffect } from "react";
import {
  Tabs,
  Button,
  Input,
  Upload,
  Tag,
  Image,
  Spin,
  message,
  Drawer,
  Card,
  Tooltip,
  Space,
  Segmented,
} from "antd";
import {
  UploadOutlined,
  DeleteOutlined,
  ThunderboltOutlined,
  BulbOutlined,
  BookOutlined,
  DownloadOutlined,
  CopyOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import type { UploadFile } from "antd";
import { generateImage, generateImageWithRef } from "../api";
import {
  TEMPLATE_CATEGORIES,
  TEMPLATES,
  randomTemplate,
  type TemplateItem,
} from "../prompt-templates";

const SIZE_PRESETS = [
  { label: "1:1", width: 1024, height: 1024 },
  { label: "4:3", width: 1200, height: 900 },
  { label: "16:9", width: 1536, height: 864 },
  { label: "9:16", width: 864, height: 1536 },
  { label: "3:4", width: 900, height: 1200 },
  { label: "21:9", width: 1792, height: 768 },
];

type GenerationStatus = "idle" | "generating" | "completed" | "failed";

export default function Generate() {
  const [mode, setMode] = useState<"t2i" | "i2i">("t2i");
  const [prompt, setPrompt] = useState("");
  const [sizeIdx, setSizeIdx] = useState(0);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [status, setStatus] = useState<GenerationStatus>("idle");
  const [resultImage, setResultImage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [errorCode, setErrorCode] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("portrait");
  const [elapsedTime, setElapsedTime] = useState(0);

  const promptRef = useRef<HTMLTextAreaElement>(null);

  // ========== 计时器 ==========

  useEffect(() => {
    if (status !== "generating") {
      setElapsedTime(0);
      return;
    }
    const start = Date.now();
    const timer = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - start) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [status]);

  // ========== 模板库 ==========

  const handleSelectTemplate = (item: TemplateItem) => {
    setPrompt(item.prompt);
    setDrawerOpen(false);
    message.success(`已填入模板：${item.label}`);
  };

  // ========== 随机灵感 ==========

  const handleRandom = () => {
    const item = randomTemplate();
    setPrompt(item.prompt);
    message.info(`随机灵感：${item.label}`);
  };

  // ========== 参考图 ==========

  const handleUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      setFileList((prev) => [
        ...prev,
        {
          uid: `${Date.now()}-${Math.random()}`,
          name: file.name,
          thumbUrl: url,
          originFileObj: file as any,
        } as UploadFile,
      ]);
    };
    reader.readAsDataURL(file);
    return false;
  };

  const handleRemoveFile = (uid: string) => {
    setFileList((prev) => prev.filter((f) => f.uid !== uid));
  };

  // ========== 生成 ==========

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      message.warning("请输入提示词");
      return;
    }

    const config = await window.electronAPI.getConfig();
    const provider = config.providers.find(
      (p) => p.id === config.activeProviderId
    );
    if (!provider) {
      message.error("请先在「模型管理」中配置 API 服务商");
      return;
    }

    const size = SIZE_PRESETS[sizeIdx];
    const sizeStr = `${size.width}x${size.height}`;

    setStatus("generating");
    setErrorMsg("");
    setErrorCode("");

    try {
      let result;
      if (mode === "i2i" && fileList.length > 0) {
        const files = fileList
          .map((f) => f.originFileObj)
          .filter(Boolean) as File[];
        result = await generateImageWithRef({
          prompt,
          size: sizeStr,
          provider,
          refImages: files,
        });
      } else {
        result = await generateImage({ prompt, size: sizeStr, provider });
      }

      if (result.success && result.images.length > 0) {
        const timestamp = Date.now();
        const ext = "png";
        const filename = `img_${timestamp}.${ext}`;
        await window.electronAPI.saveImageBuffer(filename, result.images[0]);

        const history = await window.electronAPI.getHistory();
        history.unshift({
          id: `${timestamp}`,
          prompt,
          imagePath: filename,
          providerName: provider.name,
          model: provider.model,
          size: sizeStr,
          mode,
          timestamp,
          status: "completed",
        });
        await window.electronAPI.setHistory(history);

        const dataUrl = await window.electronAPI.readImage(filename);
        setResultImage(dataUrl);
        setStatus("completed");
        message.success("生成成功！");
      } else {
        setErrorMsg(result.error || "生成失败");
        setErrorCode(result.errorCode || "");
        setStatus("failed");
      }
    } catch (e: any) {
      setErrorMsg(e.message || "请求异常");
      setErrorCode("network");
      setStatus("failed");
    }
  };

  // ========== 下载 ==========

  const handleDownload = () => {
    if (!resultImage) return;
    const link = document.createElement("a");
    link.href = resultImage;
    link.download = `generated_${Date.now()}.png`;
    link.click();
  };

  // ========== 复制 prompt ==========

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(prompt);
    message.success("提示词已复制");
  };

  return (
    <div>
      <div className="page-header">
        <h2>图像生成</h2>
      </div>

      {/* 模式切换 */}
      <Tabs
        activeKey={mode}
        onChange={(key) => setMode(key as "t2i" | "i2i")}
        items={[
          { key: "t2i", label: "文生图" },
          { key: "i2i", label: "图生图" },
        ]}
        style={{ marginBottom: 16 }}
      />

      {/* 参考图区域（仅图生图） */}
      {mode === "i2i" && (
        <Card
          size="small"
          title="参考图片"
          style={{ marginBottom: 16 }}
          extra={
            <Upload
              beforeUpload={handleUpload}
              showUploadList={false}
              accept="image/*"
            >
              <Button size="small" icon={<UploadOutlined />}>
                上传
              </Button>
            </Upload>
          }
        >
          {fileList.length === 0 ? (
            <div
              style={{
                color: "#999",
                textAlign: "center",
                padding: "20px 0",
                fontSize: 14,
              }}
            >
              点击「上传」按钮添加参考图片
            </div>
          ) : (
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {fileList.map((file) => (
                <div
                  key={file.uid}
                  style={{
                    position: "relative",
                    width: 88,
                    height: 88,
                    borderRadius: 8,
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={file.thumbUrl}
                    alt={file.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <Button
                    type="text"
                    danger
                    size="small"
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemoveFile(file.uid)}
                    style={{
                      position: "absolute",
                      top: 2,
                      right: 2,
                      background: "rgba(0,0,0,0.5)",
                      color: "#fff",
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* 提示词输入 */}
      <Card size="small" title="提示词" style={{ marginBottom: 16 }}>
        <Input.TextArea
          ref={promptRef as any}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="用英文描述你想要生成的图像，或点击下方「模板库」选择..."
          rows={4}
          style={{ fontSize: 14, marginBottom: 12 }}
        />
        <Space>
          <Button icon={<BookOutlined />} onClick={() => setDrawerOpen(true)}>
            模板库
          </Button>
          <Button icon={<BulbOutlined />} onClick={handleRandom}>
            随机灵感
          </Button>
        </Space>
      </Card>

      {/* 参数配置 */}
      <Card size="small" style={{ marginBottom: 16 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <Space align="center">
            <span style={{ color: "#666", fontSize: 14 }}>尺寸:</span>
            <Segmented
              value={sizeIdx}
              onChange={(val) => setSizeIdx(val as number)}
              options={SIZE_PRESETS.map((s, i) => ({
                label: s.label,
                value: i,
              }))}
            />
            <Tag color="blue" style={{ marginLeft: 8 }}>
              {SIZE_PRESETS[sizeIdx].width}×{SIZE_PRESETS[sizeIdx].height}
            </Tag>
          </Space>
          <Button
            type="primary"
            size="large"
            icon={<ThunderboltOutlined />}
            onClick={handleGenerate}
            loading={status === "generating"}
            style={{
              background: "var(--gradient-start)",
              borderColor: "var(--gradient-start)",
            }}
          >
            生成
          </Button>
        </div>
      </Card>

      {/* 结果展示 */}
      <Card
        size="small"
        title="生成结果"
        style={{ minHeight: 300 }}
        styles={{ body: { display: "flex", justifyContent: "center" } }}
      >
        {status === "idle" && (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              color: "#999",
            }}
          >
            <ThunderboltOutlined
              style={{ fontSize: 48, marginBottom: 16, color: "#ccc" }}
            />
            <h3 style={{ color: "#333", marginBottom: 8 }}>开始创作</h3>
            <p style={{ marginBottom: 16 }}>
              输入提示词，选择尺寸，点击生成按钮
            </p>
            <Space wrap>
              {TEMPLATES.slice(0, 6).map((t, i) => (
                <Button
                  key={i}
                  size="small"
                  onClick={() => setPrompt(t.prompt)}
                >
                  {t.label}
                </Button>
              ))}
            </Space>
          </div>
        )}

        {status === "generating" && (
          <div style={{ textAlign: "center", padding: "48px 20px" }}>
            <div style={{
              width: 80,
              height: 80,
              margin: "0 auto 24px",
              borderRadius: "50%",
              background: "conic-gradient(var(--gradient-start) 0deg, #f0f0f0 0deg)",
              animation: "spin 1.5s linear infinite",
            }}>
              <div style={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                background: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
              }}>
                🎨
              </div>
            </div>
            <h3 style={{ color: "#333", marginBottom: 8 }}>AI 正在创作...</h3>
            <p style={{ color: "#888", marginBottom: 4 }}>
              已用时 <span style={{ color: "var(--gradient-start)", fontWeight: 700, fontSize: 18 }}>{elapsedTime}s</span>
            </p>
            <p style={{ color: "#aaa", fontSize: 12 }}>
              预计需要 60 - 120 秒，请耐心等待
            </p>
          </div>
        )}

        {status === "completed" && (
          <div style={{ textAlign: "center", padding: "16px 0" }}>
            <Tag
              icon={<CheckCircleOutlined />}
              color="success"
              style={{ marginBottom: 12, padding: "4px 12px", fontSize: 14 }}
            >
              生成成功
            </Tag>
            <div style={{ marginTop: 8 }}>
              <Image
                src={resultImage}
                alt="生成结果"
                style={{ maxWidth: "100%", maxHeight: 500, borderRadius: 8 }}
                preview={{ mask: "点击预览" }}
              />
            </div>
            <Space style={{ marginTop: 12 }}>
              <Button icon={<DownloadOutlined />} onClick={handleDownload}>
                下载
              </Button>
              <Button icon={<CopyOutlined />} onClick={handleCopyPrompt}>
                复制提示词
              </Button>
            </Space>
          </div>
        )}

        {status === "failed" && (
          <div style={{ textAlign: "center", padding: "40px 20px", maxWidth: 480, margin: "0 auto" }}>
            <CloseCircleOutlined
              style={{ fontSize: 48, color: "#ff4d4f", marginBottom: 16 }}
            />
            <h3 style={{ color: "#ff4d4f", marginBottom: 8 }}>
              {errorCode === "content_policy" ? "内容审核未通过" :
               errorCode === "auth" ? "API 认证失败" :
               errorCode === "network" ? "网络连接失败" :
               errorCode === "rate_limit" ? "请求过于频繁" :
               errorCode === "server" ? "服务商异常" : "生成失败"}
            </h3>
            <div style={{
              color: "#666",
              marginBottom: 16,
              whiteSpace: "pre-line",
              lineHeight: 1.6,
              fontSize: 14,
              background: "#fff",
              padding: 12,
              borderRadius: 8,
              border: "1px solid #f0f0f0",
              textAlign: "left",
            }}>
              {errorMsg}
            </div>
            <Space>
              {errorCode === "content_policy" && (
                <Button icon={<BulbOutlined />} onClick={handleRandom}>
                  换一条随机灵感
                </Button>
              )}
              {errorCode === "auth" && (
                <Button onClick={() => window.location.hash = "#/models"}>
                  前往模型管理
                </Button>
              )}
              <Button onClick={handleGenerate}>重试</Button>
            </Space>
          </div>
        )}
      </Card>

      {/* 模板库抽屉 */}
      <Drawer
        title="提示词模板库"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        size="large"
      >
        <Tabs
          activeKey={selectedCategory}
          onChange={setSelectedCategory}
          items={TEMPLATE_CATEGORIES.map((cat) => ({
            key: cat.key,
            label: cat.name,
            children: (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {TEMPLATES.filter((t) => t.category === cat.key).map(
                  (item, idx) => (
                    <Card
                      key={idx}
                      size="small"
                      hoverable
                      onClick={() => handleSelectTemplate(item)}
                    >
                      <div style={{ fontWeight: 600, marginBottom: 4 }}>
                        {item.label}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: "#888",
                          lineHeight: 1.4,
                          maxHeight: 32,
                          overflow: "hidden",
                        }}
                      >
                        {item.prompt}
                      </div>
                    </Card>
                  )
                )}
              </div>
            ),
          }))}
        />
      </Drawer>
    </div>
  );
}

import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  Select,
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
import { useGenTask } from "../GenerationContext";

const ASPECT_RATIOS = [
  { label: "1:1",  hint: "头像·社交",  w: 1,  h: 1 },
  { label: "4:3",  hint: "平板·照片",  w: 4,  h: 3 },
  { label: "16:9", hint: "电脑·视频",  w: 16, h: 9 },
  { label: "9:16", hint: "手机·短视频", w: 9,  h: 16 },
  { label: "3:4",  hint: "竖版照片",   w: 3,  h: 4 },
  { label: "21:9", hint: "超宽·电影",  w: 21, h: 9 },
];

const QUALITY_TIERS = [
  { label: "1K", value: 1024 },
  { label: "2K", value: 2048 },
  { label: "4K", value: 4096 },
];

function calcSize(ratioIdx: number, qualityIdx: number) {
  const ratio = ASPECT_RATIOS[ratioIdx];
  const maxDim = QUALITY_TIERS[qualityIdx].value;
  let width: number, height: number;
  if (ratio.w >= ratio.h) {
    width = maxDim;
    height = Math.round((maxDim * ratio.h) / ratio.w);
  } else {
    height = maxDim;
    width = Math.round((maxDim * ratio.w) / ratio.h);
  }
  return { width, height };
}

const STYLE_PRESETS = [
  { key: "none",       label: "无",       suffix: "" },
  { key: "realistic",  label: "写实",     suffix: ", photorealistic, hyperrealistic, 8K, highly detailed, professional photography, sharp focus, anatomically correct human proportions if depicting people, natural body proportions with head-to-body ratio 1:7, legs proportional NOT short, realistic anatomy" },
  { key: "anime",      label: "动漫",     suffix: ", anime style, manga art, vibrant colors, clean linework, cel shaded, Japanese animation" },
  { key: "ink",        label: "水墨",     suffix: ", traditional Chinese ink wash painting, sumi-e style, black ink on rice paper, elegant brushstrokes, minimalist composition, artistic" },
  { key: "oil",        label: "油画",     suffix: ", oil painting on canvas, classical art style, rich textures, visible brushstrokes, masterpiece, gallery quality" },
  { key: "cyberpunk",  label: "赛博朋克", suffix: ", cyberpunk aesthetic, neon lights, rain-soaked streets, futuristic city, synthwave colors, Blade Runner style, high contrast" },
  { key: "fantasy",    label: "奇幻",     suffix: ", fantasy concept art, magical atmosphere, ethereal lighting, mythical, intricate details, dramatic composition" },
  { key: "sketch",     label: "素描",     suffix: ", pencil sketch, hand-drawn, detailed graphite linework, grayscale, artistic drawing, fine art" },
  { key: "3d",         label: "3D渲染",   suffix: ", 3D render, octane render, CGI, cinema 4D, unreal engine 5, ray tracing, photorealistic 3D" },
  { key: "watercolor", label: "水彩",     suffix: ", watercolor painting, soft washes, flowing colors, artistic, delicate textures, dreamy atmosphere" },
];

export default function Generate() {
  const navigate = useNavigate();
  const { task, input, saveInput, startTask, finishTask, failTask, resetTask, setResultDataUrl } = useGenTask();
  const { prompt, ratioIdx, qualityIdx, selectedStyle, mode } = input;

  const [providerId, setProviderId] = useState("");
  const [providers, setProviders] = useState<ProviderConfig[]>([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("portrait");
  const [elapsedTime, setElapsedTime] = useState(0);

  const promptRef = useRef<HTMLTextAreaElement>(null);

  // ========== 加载服务商列表 ==========

  useEffect(() => {
    window.electronAPI.getConfig().then((c) => {
      setProviders(c.providers);
      if (c.activeProviderId) setProviderId(c.activeProviderId);
      else if (c.providers.length > 0) setProviderId(c.providers[0].id);
    });
  }, []);

  // ========== 计时器 ==========

  useEffect(() => {
    if (task.status !== "generating") {
      setElapsedTime(0);
      return;
    }
    const timer = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - task.startTime) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [task.status, task.startTime]);

  // ========== 模板库 ==========

  const handleSelectTemplate = (item: TemplateItem) => {
    saveInput({ prompt: item.prompt });
    setDrawerOpen(false);
    message.success(`已填入模板：${item.label}`);
  };

  // ========== 随机灵感 ==========

  const handleRandom = () => {
    const item = randomTemplate();
    saveInput({ prompt: item.prompt });
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

    const provider = providers.find((p) => p.id === providerId);
    if (!provider) {
      message.error("请先在下拉菜单中选一个服务商，或前往「模型管理」添加");
      return;
    }

    const size = calcSize(ratioIdx, qualityIdx);
    const sizeStr = `${size.width}x${size.height}`;

    // 拼接风格后缀
    const style = STYLE_PRESETS.find((s) => s.key === selectedStyle);
    const fullPrompt = selectedStyle && style ? prompt + style.suffix : prompt;

    startTask({
      prompt: fullPrompt,
      size: sizeStr,
      mode,
      providerName: provider.name,
      providerModel: provider.model,
    });

    try {
      let result;
      if (mode === "i2i" && fileList.length > 0) {
        const files = fileList
          .map((f) => f.originFileObj)
          .filter(Boolean) as File[];
        result = await generateImageWithRef({
          prompt: fullPrompt,
          size: sizeStr,
          provider,
          refImages: files,
        });
      } else {
        result = await generateImage({ prompt: fullPrompt, size: sizeStr, provider });
      }

      if (result.success && result.images.length > 0) {
        const timestamp = Date.now();
        const filename = `img_${timestamp}.png`;
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
        setResultDataUrl(dataUrl);
        finishTask(filename);
        message.success("生成成功！");
      } else {
        failTask(result.error || "生成失败", result.errorCode || "");
      }
    } catch (e: any) {
      failTask(e.message || "请求异常", "network");
    }
  };

  // ========== 重新生成（先重置再触发生成） ==========

  const handleRetry = () => {
    resetTask();
    handleGenerate();
  };

  // ========== 下载 ==========

  const handleDownload = () => {
    if (!task.resultDataUrl) return;
    const link = document.createElement("a");
    link.href = task.resultDataUrl;
    link.download = `generated_${Date.now()}.png`;
    link.click();
  };

  // ========== 复制 prompt ==========

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(task.prompt);
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
        onChange={(key) => saveInput({ mode: key as "t2i" | "i2i" })}
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
          onChange={(e) => saveInput({ prompt: e.target.value })}
          placeholder="用英文描述你想要生成的图像，或点击下方「模板库」选择..."
          rows={4}
          style={{ fontSize: 14, marginBottom: 12 }}
          disabled={task.status === "generating"}
        />
        <Space>
          <Button icon={<BookOutlined />} onClick={() => setDrawerOpen(true)}
            disabled={task.status === "generating"}>
            模板库
          </Button>
          <Button icon={<BulbOutlined />} onClick={handleRandom}
            disabled={task.status === "generating"}>
            随机灵感
          </Button>
        </Space>
      </Card>

      {/* 风格选择 */}
      <Card size="small" title="画面风格" style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {STYLE_PRESETS.map((s) => {
            const isActive = selectedStyle === s.key || (s.key === "none" && !selectedStyle);
            return (
              <div
                key={s.key}
                onClick={() => {
                  if (task.status === "generating") return;
                  saveInput({ selectedStyle: s.key === "none" ? "" : s.key });
                }}
                style={{
                  padding: "8px 16px",
                  borderRadius: 20,
                  cursor: task.status === "generating" ? "not-allowed" : "pointer",
                  background: isActive
                    ? "linear-gradient(135deg, var(--gradient-start), var(--gradient-end))"
                    : "#f5f5f5",
                  color: isActive ? "#fff" : "#555",
                  fontWeight: isActive ? 600 : 400,
                  fontSize: 14,
                  transition: "all 0.2s",
                  border: isActive ? "none" : "1px solid #e8e8e8",
                  userSelect: "none",
                  opacity: task.status === "generating" ? 0.5 : 1,
                }}
              >
                {s.label}
              </div>
            );
          })}
        </div>
      </Card>

      {/* 参数配置 */}
      <Card size="small" style={{ marginBottom: 16 }}>
        <Space direction="vertical" size={12} style={{ width: "100%" }}>
          {/* 模型选择 */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "#666", fontSize: 14, minWidth: 40 }}>模型:</span>
            {providers.length === 0 ? (
              <Button size="small" type="link" onClick={() => navigate("/models")}
                style={{ padding: 0 }}>
                暂无服务商，点击添加
              </Button>
            ) : (
              <Select
                value={providerId}
                onChange={(val) => {
                  setProviderId(val);
                  window.electronAPI.setConfig({
                    providers,
                    activeProviderId: val,
                  });
                }}
                style={{ minWidth: 200 }}
                options={providers.map((p) => ({
                  value: p.id,
                  label: `${p.name} (${p.model})`,
                }))}
                disabled={task.status === "generating"}
              />
            )}
            <Button size="small" type="link" onClick={() => navigate("/models")}
              style={{ fontSize: 12 }}>
              管理
            </Button>
          </div>

          <Space direction="vertical" size={8} style={{ width: "100%" }}>
            <Space align="center">
              <span style={{ color: "#666", fontSize: 14, minWidth: 40 }}>比例:</span>
              <Segmented
                value={ratioIdx}
                onChange={(val) => saveInput({ ratioIdx: val as number })}
                options={ASPECT_RATIOS.map((r, i) => ({
                  label: (
                    <div style={{ textAlign: "center", lineHeight: 1.3 }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{r.label}</div>
                      <div style={{ fontSize: 10, color: "#999", whiteSpace: "nowrap" }}>{r.hint}</div>
                    </div>
                  ),
                  value: i,
                }))}
                disabled={task.status === "generating"}
              />
            </Space>
            <Space align="center">
              <span style={{ color: "#666", fontSize: 14, minWidth: 40 }}>画质:</span>
              <Segmented
                value={qualityIdx}
                onChange={(val) => saveInput({ qualityIdx: val as number })}
                options={QUALITY_TIERS.map((q, i) => ({
                  label: q.label,
                  value: i,
                }))}
                disabled={task.status === "generating"}
              />
              <Tag color="blue" style={{ marginLeft: 8 }}>
                {calcSize(ratioIdx, qualityIdx).width}×{calcSize(ratioIdx, qualityIdx).height}
              </Tag>
            </Space>
          </Space>

          <Button
            type="primary"
            size="large"
            icon={<ThunderboltOutlined />}
            onClick={handleGenerate}
            loading={task.status === "generating"}
            style={{
              background: "var(--gradient-start)",
              borderColor: "var(--gradient-start)",
              alignSelf: "flex-end",
            }}
          >
            {task.status === "generating" ? "生成中" : "生成"}
          </Button>
        </Space>
      </Card>

      {/* 结果展示 */}
      <Card
        size="small"
        title="生成结果"
        style={{ minHeight: 300 }}
        styles={{ body: { display: "flex", justifyContent: "center" } }}
      >
        {/* 空闲状态 */}
        {task.status === "idle" && (
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
                  onClick={() => saveInput({ prompt: t.prompt })}
                >
                  {t.label}
                </Button>
              ))}
            </Space>
          </div>
        )}

        {/* 生成中 */}
        {task.status === "generating" && (
          <div style={{ textAlign: "center", padding: "48px 20px" }}>
            <div style={{
              width: 80,
              height: 80,
              margin: "0 auto 24px",
              borderRadius: "50%",
              background: "conic-gradient(var(--gradient-start), var(--gradient-end), #e8e8ff, var(--gradient-start))",
              animation: "spin-ring 1.5s linear infinite",
              mask: "radial-gradient(transparent 28px, black 30px)",
              WebkitMask: "radial-gradient(transparent 28px, black 30px)",
            }} />
            <h3 style={{ color: "#333", marginBottom: 8 }}>AI 正在创作...</h3>
            <p style={{ color: "#888", marginBottom: 4 }}>
              已用时 <span style={{ color: "var(--gradient-start)", fontWeight: 700, fontSize: 18 }}>{elapsedTime}s</span>
            </p>
            <p style={{ color: "#aaa", fontSize: 12 }}>
              预计需要 60 - 120 秒，请耐心等待
            </p>
          </div>
        )}

        {/* 完成 */}
        {task.status === "completed" && (
          <div style={{ textAlign: "center", padding: "16px 0" }}>
            <Tag
              icon={<CheckCircleOutlined />}
              color="success"
              style={{ marginBottom: 12, padding: "4px 12px", fontSize: 14 }}
            >
              生成成功
            </Tag>
            <div style={{ marginTop: 8 }}>
              {task.resultDataUrl ? (
                <Image
                  src={task.resultDataUrl}
                  alt="生成结果"
                  style={{ maxWidth: "100%", maxHeight: 500, borderRadius: 8 }}
                  preview={{ mask: "点击预览" }}
                />
              ) : (
                <Spin size="large" style={{ padding: 40 }} />
              )}
            </div>
            <Space style={{ marginTop: 12 }}>
              <Button icon={<DownloadOutlined />} onClick={handleDownload}>
                下载
              </Button>
              <Button icon={<CopyOutlined />} onClick={handleCopyPrompt}>
                复制提示词
              </Button>
              <Button onClick={() => { resetTask(); saveInput({ prompt: "" }); }}>
                再来一张
              </Button>
            </Space>
          </div>
        )}

        {/* 失败 */}
        {task.status === "failed" && (
          <div style={{ textAlign: "center", padding: "40px 20px", maxWidth: 480, margin: "0 auto" }}>
            <CloseCircleOutlined
              style={{ fontSize: 48, color: "#ff4d4f", marginBottom: 16 }}
            />
            <h3 style={{ color: "#ff4d4f", marginBottom: 8 }}>
              {task.errorCode === "content_policy" ? "内容审核未通过" :
               task.errorCode === "auth" ? "API 认证失败" :
               task.errorCode === "network" ? "网络连接失败" :
               task.errorCode === "rate_limit" ? "请求过于频繁" :
               task.errorCode === "server" ? "服务商异常" : "生成失败"}
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
              {task.errorMsg}
            </div>
            <Space>
              {task.errorCode === "content_policy" && (
                <Button icon={<BulbOutlined />} onClick={handleRandom}>
                  换一条随机灵感
                </Button>
              )}
              {task.errorCode === "auth" && (
                <Button onClick={() => navigate("/models")}>
                  前往模型管理
                </Button>
              )}
              <Button onClick={handleRetry}>重试</Button>
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

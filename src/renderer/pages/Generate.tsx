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
  Badge,
  List,
  Empty,
  Divider,
  Modal,
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
  SyncOutlined,
  OrderedListOutlined,
  PictureOutlined,
} from "@ant-design/icons";
import type { UploadFile } from "antd";
import { generateImage, generateImageWithRef } from "../api";
import {
  TEMPLATE_CATEGORIES,
  TEMPLATES,
  randomTemplate,
  templatesByMode,
  type TemplateItem,
} from "../prompt-templates";
import { useGenTask, type GenTask, type GenStatus } from "../GenerationContext";

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

const SUBJECT_PRESETS = [
  { key: "none",       label: "不限" },
  { key: "portrait",   label: "人物",   prefix: "a person as the main subject, " },
  { key: "animal",     label: "动物",   prefix: "an animal as the main subject, " },
  { key: "landscape",  label: "风景",   prefix: "a landscape scene as the main subject, " },
  { key: "product",    label: "静物",   prefix: "a product or still life object as the main subject, centered composition, " },
  { key: "food",       label: "食物",   prefix: "delicious food as the main subject, appetizing food photography, " },
  { key: "building",   label: "建筑",   prefix: "architecture and buildings as the main subject, " },
  { key: "vehicle",    label: "交通工具", prefix: "a vehicle as the main subject, " },
  { key: "plant",      label: "植物花卉", prefix: "plants or flowers as the main subject, botanical, " },
];

export default function Generate() {
  const navigate = useNavigate();
  const { tasks, addTask, updateTask, removeTask, clearTasks, task, input, saveInput, setInputMode } = useGenTask();
  const cur = input[input.mode];
  const { prompt, ratioIdx, qualityIdx, selectedStyle, selectedSubject } = cur;
  const { mode } = input;

  const [providerId, setProviderId] = useState("");
  const [providers, setProviders] = useState<ProviderConfig[]>([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [taskListOpen, setTaskListOpen] = useState(false);
  const [historyPickOpen, setHistoryPickOpen] = useState(false);
  const [historyImages, setHistoryImages] = useState<{ id: string; dataUrl: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("portrait");
  const [elapsedTime, setElapsedTime] = useState(0);
  const [elapsedTimes, setElapsedTimes] = useState<Record<string, number>>({});

  const promptRef = useRef<HTMLTextAreaElement>(null);

  // ========== 加载服务商列表 ==========

  useEffect(() => {
    window.electronAPI.getConfig().then((c) => {
      setProviders(c.providers);
      if (c.activeProviderId) setProviderId(c.activeProviderId);
      else if (c.providers.length > 0) setProviderId(c.providers[0].id);
    });
  }, []);

  // ========== 计时器（所有正在生成的任务） ==========

  useEffect(() => {
    const gens = tasks.filter(t => t.status === "generating");
    if (gens.length === 0) {
      setElapsedTime(0);
      return;
    }
    const timer = setInterval(() => {
      const now = Date.now();
      const times: Record<string, number> = {};
      gens.forEach(t => { times[t.id] = Math.floor((now - t.startTime) / 1000); });
      setElapsedTimes(times);
      // 兼容旧 UI：显示最近一个正在生成的任务用时
      setElapsedTime(Math.floor((now - gens[gens.length - 1].startTime) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [tasks]);

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

  // ========== 从历史选择参考图 ==========

  const openHistoryPicker = async () => {
    setHistoryPickOpen(true);
    const history = await window.electronAPI.getHistory();
    const completed = history.filter((h: any) => h.status === "completed");
    const loaded: { id: string; dataUrl: string }[] = [];
    for (const h of completed.slice(0, 30)) {
      try {
        const du = await window.electronAPI.readImage(h.imagePath);
        loaded.push({ id: h.id, dataUrl: du });
      } catch { /* skip */ }
    }
    setHistoryImages(loaded);
  };

  const handlePickHistory = (dataUrl: string) => {
    fetch(dataUrl)
      .then(r => r.blob())
      .then(blob => {
        const file = new File([blob], `ref_${Date.now()}.png`, { type: "image/png" });
        handleUpload(file);
      });
    setHistoryPickOpen(false);
  };

  // ========== 单次生成（5 分钟超时） ==========

  const execOneGenerate = async (taskId: string, fullPrompt: string, sizeStr: string, provider: ProviderConfig, basePrompt: string) => {
    const TIMEOUT_MS = 5 * 60 * 1000; // 5 分钟

    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("生成超时（超过 5 分钟未返回结果）")), TIMEOUT_MS)
    );

    try {
      let result;
      if (mode === "i2i" && fileList.length > 0) {
        const files = fileList.map((f) => f.originFileObj).filter(Boolean) as File[];
        result = await Promise.race([
          generateImageWithRef({ prompt: fullPrompt, size: sizeStr, provider, refImages: files }),
          timeout,
        ]);
      } else {
        result = await Promise.race([
          generateImage({ prompt: fullPrompt, size: sizeStr, provider }),
          timeout,
        ]);
      }

      if (result.success && result.images.length > 0) {
        const timestamp = Date.now();
        const filename = `img_${timestamp}_${taskId.slice(-6)}.png`;
        await window.electronAPI.saveImageBuffer(filename, result.images[0]);

        const history = await window.electronAPI.getHistory();
        history.unshift({
          id: `${timestamp}_${taskId}`,
          prompt: basePrompt,
          imagePath: filename,
          providerName: provider.name,
          model: provider.model,
          size: sizeStr,
          mode,
          timestamp,
          status: "completed" as const,
        });
        await window.electronAPI.setHistory(history);

        const dataUrl = await window.electronAPI.readImage(filename);
        updateTask(taskId, { status: "completed", resultFilename: filename, resultDataUrl: dataUrl, endTime: Date.now() });
        message.success("生成成功！");
      } else {
        updateTask(taskId, { status: "failed", errorMsg: result.error || "生成失败", errorCode: result.errorCode || "", endTime: Date.now() });
      }
    } catch (e: any) {
      updateTask(taskId, { status: "failed", errorMsg: e.message || "请求异常", errorCode: e.message?.includes("超时") ? "timeout" : "network", endTime: Date.now() });
    }
  };

  // ========== 生成入口 ==========

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

    // 拼接主体前缀 + 风格后缀
    const subject = SUBJECT_PRESETS.find((s) => s.key === selectedSubject);
    const style = STYLE_PRESETS.find((s) => s.key === selectedStyle);
    let fullPrompt = prompt;
    if (selectedSubject && subject) fullPrompt = subject.prefix + fullPrompt;
    if (selectedStyle && style) fullPrompt = fullPrompt + style.suffix;

    // 使用新 API：addTask 返回稳定的 taskId
    const taskId = addTask({
      prompt: fullPrompt,
      size: sizeStr,
      mode,
      providerName: provider.name,
      providerModel: provider.model,
      status: "generating",
    });

    // 异步执行，不 await，让界面不锁死
    execOneGenerate(taskId, fullPrompt, sizeStr, provider, prompt);
  };

  // ========== 重新生成 ==========

  const handleRetry = () => {
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
        onChange={(key) => setInputMode(key as "t2i" | "i2i")}
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
            <Space size={8}>
              <Button size="small" icon={<PictureOutlined />} onClick={openHistoryPicker}>
                从历史选
              </Button>
              <Upload
                beforeUpload={handleUpload}
                showUploadList={false}
                accept="image/*"
              >
                <Button size="small" icon={<UploadOutlined />}>
                  上传
                </Button>
              </Upload>
            </Space>
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
                  saveInput({ selectedStyle: s.key === "none" ? "" : s.key });
                }}
                style={{
                  padding: "8px 16px",
                  borderRadius: 20,
                  cursor: "pointer",
                  background: isActive
                    ? "linear-gradient(135deg, var(--gradient-start), var(--gradient-end))"
                    : "#f5f5f5",
                  color: isActive ? "#fff" : "#555",
                  fontWeight: isActive ? 600 : 400,
                  fontSize: 14,
                  transition: "all 0.2s",
                  border: isActive ? "none" : "1px solid #e8e8e8",
                  userSelect: "none",
                  opacity: 1,
                }}
              >
                {s.label}
              </div>
            );
          })}
        </div>
      </Card>

      {/* 画面主体 */}
      <Card size="small" title="画面主体" style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {SUBJECT_PRESETS.map((s) => {
            const isActive = selectedSubject === s.key || (s.key === "none" && !selectedSubject);
            return (
              <div
                key={s.key}
                onClick={() => {
                  saveInput({ selectedSubject: s.key === "none" ? "" : s.key });
                }}
                style={{
                  padding: "6px 14px",
                  borderRadius: 20,
                  cursor: "pointer",
                  background: isActive
                    ? "linear-gradient(135deg, var(--gradient-start), var(--gradient-end))"
                    : "#f5f5f5",
                  color: isActive ? "#fff" : "#555",
                  fontWeight: isActive ? 600 : 400,
                  fontSize: 13,
                  transition: "all 0.2s",
                  border: isActive ? "none" : "1px solid #e8e8e8",
                  userSelect: "none",
                  opacity: 1,
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
                    />
              <Tag color="blue" style={{ marginLeft: 8 }}>
                {calcSize(ratioIdx, qualityIdx).width}×{calcSize(ratioIdx, qualityIdx).height}
              </Tag>
            </Space>
          </Space>

          <div style={{ display: "flex", gap: 8, alignSelf: "flex-end" }}>
            <Badge count={tasks.filter(t => t.status === "generating" || t.status === "pending").length} size="small" offset={[-4, 4]}>
              <Button
                size="large"
                icon={<OrderedListOutlined />}
                onClick={() => setTaskListOpen(true)}
              >
                任务
              </Button>
            </Badge>
            <Button
              type="primary"
              size="large"
              icon={<ThunderboltOutlined />}
              onClick={handleGenerate}
              style={{
                background: "var(--gradient-start)",
                borderColor: "var(--gradient-start)",
              }}
            >
              生成
            </Button>
          </div>
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
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            {/* 装饰插图 */}
            <div className="idle-illustration">
              <div className="orb orb-1" />
              <div className="orb orb-2" />
              <div className="orb orb-3" />
              <div className="icon-center">
                <ThunderboltOutlined style={{ fontSize: 32, color: "var(--gradient-start)" }} />
              </div>
            </div>
            <h3 style={{ color: "#1a1a2e", marginBottom: 6, fontSize: 20, fontWeight: 700 }}>
              开始你的创作之旅
            </h3>
            <p style={{ color: "#888", marginBottom: 20, fontSize: 14, lineHeight: 1.6 }}>
              用文字描绘你心中的画面<br />AI 将为你呈现独一无二的视觉作品
            </p>
            <div style={{
              background: "linear-gradient(135deg, rgba(102,126,234,0.04), rgba(118,75,162,0.04))",
              borderRadius: 12,
              padding: "12px 16px",
              marginBottom: 16,
            }}>
              <div style={{ color: "#999", fontSize: 12, marginBottom: 8 }}>💡 快速试试这些</div>
              <Space wrap size={[8, 8]}>
                {TEMPLATES.slice(0, 4).map((t, i) => (
                  <Button
                    key={i}
                    size="small"
                    onClick={() => saveInput({ prompt: t.prompt })}
                    style={{
                      borderRadius: 16,
                      border: "1px solid #e8e8ff",
                      background: "#fff",
                    }}
                  >
                    {t.label}
                  </Button>
                ))}
              </Space>
            </div>
          </div>
        )}

        {/* 生成中 */}
        {task.status === "generating" && (
          <div className="fade-in" style={{ textAlign: "center", padding: "48px 20px" }}>
            <div style={{
              width: 96,
              height: 96,
              margin: "0 auto 24px",
              position: "relative",
            }}>
              {/* 外圈旋转环 */}
              <div style={{
                position: "absolute", inset: 0,
                borderRadius: "50%",
                background: "conic-gradient(var(--gradient-start), var(--gradient-end), #e8e8ff, var(--gradient-start))",
                animation: "spin-ring 1.5s linear infinite",
                mask: "radial-gradient(transparent 36px, black 38px)",
                WebkitMask: "radial-gradient(transparent 36px, black 38px)",
              }} />
              {/* 内圈逆旋转 */}
              <div style={{
                position: "absolute", inset: 8,
                borderRadius: "50%",
                background: "conic-gradient(var(--gradient-end), #e8e8ff, var(--gradient-start), var(--gradient-end))",
                animation: "spin-ring 2s linear infinite reverse",
                mask: "radial-gradient(transparent 28px, black 30px)",
                WebkitMask: "radial-gradient(transparent 28px, black 30px)",
              }} />
              {/* 中心图标 */}
              <div style={{
                position: "absolute",
                top: "50%", left: "50%",
                transform: "translate(-50%, -50%)",
                fontSize: 28,
              }}>
                ✨
              </div>
            </div>
            <h3 style={{ color: "#333", marginBottom: 6, fontWeight: 700 }}>
              正在生成你的图像
            </h3>
            <p style={{ color: "#888", marginBottom: 16, fontSize: 14 }}>
              已用时 <span style={{ color: "var(--gradient-start)", fontWeight: 700, fontSize: 18 }}>{elapsedTime}</span> 秒
            </p>
            <div className="loading-dots">
              <span /><span /><span />
            </div>
            <p style={{ color: "#bbb", fontSize: 12, marginTop: 16 }}>
              AI 正在精心绘制每一个像素，预计 60-120 秒
            </p>
          </div>
        )}

        {/* 完成 */}
        {task.status === "completed" && (
          <div className="scale-in" style={{ textAlign: "center", padding: "16px 0" }}>
            <Tag
              icon={<CheckCircleOutlined />}
              color="success"
              style={{
                marginBottom: 16,
                padding: "6px 16px",
                fontSize: 14,
                borderRadius: 20,
                fontWeight: 600,
              }}
            >
              生成成功
            </Tag>
            <div style={{
              background: "linear-gradient(135deg, #f8f9ff, #faf5ff)",
              borderRadius: 16,
              padding: 20,
              marginBottom: 12,
            }}>
              {task.resultDataUrl ? (
                <Image
                  src={task.resultDataUrl}
                  alt="生成结果"
                  style={{ maxWidth: "100%", maxHeight: 480, borderRadius: 12 }}
                  preview={{
                    mask: (
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 20, marginBottom: 4 }}>🔍</div>
                        <div>点击查看大图</div>
                      </div>
                    ),
                  }}
                />
              ) : (
                <Spin size="large" style={{ padding: 40 }} />
              )}
            </div>
            {/* 快捷信息 */}
            <div style={{
              display: "flex",
              justifyContent: "center",
              gap: 16,
              flexWrap: "wrap",
              marginBottom: 16,
            }}>
              <Tag color="purple" style={{ borderRadius: 12, padding: "2px 12px" }}>
                {task.size}
              </Tag>
              <Tag color="blue" style={{ borderRadius: 12, padding: "2px 12px" }}>
                {task.providerModel}
              </Tag>
              <Tag color="cyan" style={{ borderRadius: 12, padding: "2px 12px" }}>
                {task.mode === "t2i" ? "文生图" : "图生图"}
              </Tag>
            </div>
            <Space size={12}>
              <Button icon={<DownloadOutlined />} onClick={handleDownload}
                style={{ borderRadius: 20 }}>
                下载原图
              </Button>
              <Button icon={<CopyOutlined />} onClick={handleCopyPrompt}
                style={{ borderRadius: 20 }}>
                复制提示词
              </Button>
              <Button type="primary" onClick={() => { resetTask(); saveInput({ prompt: "" }); }}
                style={{ borderRadius: 20 }}>
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

      {/* 历史参考图选择 */}
      <Modal
        title="从历史记录选择参考图"
        open={historyPickOpen}
        onCancel={() => setHistoryPickOpen(false)}
        footer={null}
        width={640}
      >
        {historyImages.length === 0 ? (
          <Empty description="没有已生成的图片" style={{ padding: 40 }} />
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 12, maxHeight: 400, overflow: "auto" }}>
            {historyImages.map((img) => (
              <div
                key={img.id}
                onClick={() => handlePickHistory(img.dataUrl)}
                style={{
                  cursor: "pointer",
                  borderRadius: 8,
                  overflow: "hidden",
                  border: "2px solid transparent",
                  transition: "border-color 0.2s",
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--gradient-start)")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "transparent")}
              >
                <img src={img.dataUrl} alt="" style={{ width: "100%", aspectRatio: "1", objectFit: "cover", display: "block" }} />
              </div>
            ))}
          </div>
        )}
      </Modal>

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
          items={TEMPLATE_CATEGORIES
          .filter((cat) => !cat.mode || cat.mode === mode || cat.mode === "both")
          .map((cat) => ({
            key: cat.key,
            label: cat.name,
            children: (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {TEMPLATES.filter((t) => t.category === cat.key && (!t.mode || t.mode === mode || t.mode === "both" || cat.mode === "both")).map(
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

      {/* 任务列表抽屉 */}
      <Drawer
        title={`任务列表${tasks.length > 0 ? ` (${tasks.length})` : ""}`}
        open={taskListOpen}
        onClose={() => setTaskListOpen(false)}
        placement="right"
        size="large"
        styles={{ body: { padding: 0 } }}
      >
        {tasks.length === 0 ? (
          <Empty description="还没有任务" style={{ paddingTop: 60 }}>
            <Button onClick={() => setTaskListOpen(false)}>去生成</Button>
          </Empty>
        ) : (
          <div>
            <List
              style={{ maxHeight: "calc(100vh - 220px)", overflow: "auto" }}
              dataSource={[...tasks].reverse()}
              renderItem={(t) => {
                const tElapsed = t.endTime
                  ? Math.floor((t.endTime - t.startTime) / 1000)
                  : elapsedTimes[t.id] || 0;
                return (
                  <List.Item
                    style={{
                      padding: "12px 16px",
                      borderBottom: "1px solid #f0f0f0",
                    }}
                  >
                    <div style={{ display: "flex", gap: 10, width: "100%", alignItems: "center" }}>
                      {/* 缩略图/状态 */}
                      <div
                        style={{
                          width: 52,
                          height: 52,
                          borderRadius: 8,
                          overflow: "hidden",
                          flexShrink: 0,
                          background: "#f5f5f5",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          border: "1px solid #eee",
                        }}
                      >
                        {t.resultDataUrl ? (
                          <img src={t.resultDataUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : t.status === "generating" ? (
                          <Spin size="small" />
                        ) : t.status === "failed" ? (
                          <CloseCircleOutlined style={{ color: "#ff4d4f", fontSize: 22 }} />
                        ) : t.status === "pending" ? (
                          <span style={{ color: "#bbb", fontSize: 11 }}>等待</span>
                        ) : (
                          <span style={{ color: "#bbb", fontSize: 11 }}>就绪</span>
                        )}
                      </div>

                      {/* 信息 */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <Tooltip title={t.prompt} placement="topLeft">
                          <div
                            onClick={() => { navigator.clipboard.writeText(t.prompt); message.success("提示词已复制"); }}
                            style={{ fontSize: 13, fontWeight: 500, marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", cursor: "pointer", color: "#333" }}
                          >
                            {t.prompt.slice(0, 60)}{t.prompt.length > 60 ? "…" : ""}
                          </div>
                        </Tooltip>
                        <Space size={4} wrap style={{ fontSize: 11 }}>
                          <Tag color={t.mode === "t2i" ? "blue" : "cyan"} style={{ fontSize: 10 }}>{t.size}</Tag>
                          <Tag color="purple" style={{ fontSize: 10 }}>{t.providerName}·{t.providerModel}</Tag>
                          <Tag
                            color={t.status === "generating" ? "gold" : t.status === "completed" ? "success" : t.status === "failed" ? "error" : "default"}
                            style={{ fontSize: 10 }}
                          >
                            {t.status === "generating" ? "生成中" :
                             t.status === "completed" ? "完成" :
                             t.status === "failed" ? "失败" :
                             t.status === "pending" ? "排队" : "就绪"}
                          </Tag>
                          {t.errorMsg && (
                            <Tooltip title={t.errorMsg}>
                              <Tag color="error" style={{ fontSize: 10, maxWidth: 100, overflow: "hidden", textOverflow: "ellipsis" }}>
                                {t.errorCode || "错误"}
                              </Tag>
                            </Tooltip>
                          )}
                        </Space>
                      </div>

                      {/* 时间 */}
                      <div style={{ fontSize: 11, color: "#bbb", whiteSpace: "nowrap", textAlign: "right" }}>
                        <Tooltip title={new Date(t.startTime).toLocaleString("zh-CN")}>
                          <div>{new Date(t.startTime).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</div>
                        </Tooltip>
                        <div>{tElapsed}s</div>
                      </div>

                      {/* 操作 */}
                      <div style={{ display: "flex", gap: 2, flexShrink: 0 }}>
                        {t.status === "completed" && (
                          <Button
                            size="small"
                            type="text"
                            icon={<DownloadOutlined />}
                            onClick={() => {
                              if (!t.resultDataUrl) return;
                              const link = document.createElement("a");
                              link.href = t.resultDataUrl;
                              link.download = `generated_${t.id.slice(-6)}.png`;
                              link.click();
                            }}
                          />
                        )}
                        {t.status === "failed" && (
                          <Button
                            size="small"
                            type="text"
                            icon={<SyncOutlined />}
                            onClick={() => {
                              const prov = providers.find(p => p.name === t.providerName);
                              if (!prov) return;
                              updateTask(t.id, { status: "generating" as GenStatus, startTime: Date.now(), errorMsg: "", errorCode: "" });
                              execOneGenerate(t.id, t.prompt, t.size, prov, t.prompt);
                            }}
                          />
                        )}
                        <Button
                          size="small"
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => removeTask(t.id)}
                        />
                      </div>
                    </div>
                  </List.Item>
                );
              }}
            />
            {tasks.length > 0 && (
              <div style={{ padding: "12px 16px", borderTop: "1px solid #f0f0f0", display: "flex", justifyContent: "flex-end", gap: 8 }}>
                <Button size="small" onClick={() => {
                  tasks.filter(t => t.status === "completed").forEach(t => removeTask(t.id));
                }}>
                  清空已完成
                </Button>
                <Button size="small" onClick={clearTasks}>全部清空</Button>
              </div>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
}

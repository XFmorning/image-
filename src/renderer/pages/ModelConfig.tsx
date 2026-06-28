import { useEffect, useState } from "react";
import {
  Card,
  Button,
  Input,
  Form,
  Select,
  Tag,
  message,
  Popconfirm,
  Empty,
  Modal,
  Space,
  Alert,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  CheckCircleOutlined,
  KeyOutlined,
} from "@ant-design/icons";

export default function ModelConfig() {
  const [config, setConfig] = useState<Config>({
    providers: [],
    activeProviderId: "",
  });
  const [selectedId, setSelectedId] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState<ProviderConfig | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    const c = await window.electronAPI.getConfig();
    setConfig(c);
    if (c.providers.length > 0 && !selectedId) {
      setSelectedId(c.providers[0].id);
    }
  };

  const selectedProvider = config.providers.find(
    (p) => p.id === selectedId
  );

  const handleOpenAdd = () => {
    setEditingProvider(null);
    form.resetFields();
    setModalOpen(true);
  };

  const handleOpenEdit = (provider: ProviderConfig) => {
    setEditingProvider(provider);
    form.setFieldsValue({
      name: provider.name,
      baseUrl: provider.baseUrl,
      model: provider.model,
      apiKey: provider.apiKey,
      apiProtocol: provider.apiProtocol || "openai",
      t2iEndpoint: provider.t2iEndpoint || "",
      i2iEndpoint: provider.i2iEndpoint || "",
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    const values = await form.validateFields();
    const providers = [...config.providers];

    const protocol = values.apiProtocol || "openai";

    if (editingProvider) {
      const idx = providers.findIndex((p) => p.id === editingProvider.id);
      if (idx >= 0) {
        providers[idx] = {
          ...providers[idx],
          name: values.name,
          baseUrl: values.baseUrl,
          model: values.model,
          apiKey: values.apiKey,
          apiProtocol: protocol,
          t2iEndpoint: values.t2iEndpoint || "",
          i2iEndpoint: values.i2iEndpoint || "",
        };
      }
    } else {
      const newProvider: ProviderConfig = {
        id: `provider_${Date.now()}`,
        name: values.name,
        apiKey: values.apiKey,
        baseUrl: values.baseUrl,
        model: values.model,
        apiProtocol: protocol,
        t2iEndpoint: values.t2iEndpoint || "",
        i2iEndpoint: values.i2iEndpoint || "",
        createdAt: Date.now(),
      };
      providers.push(newProvider);
      setSelectedId(newProvider.id);
    }

    const newConfig = {
      ...config,
      providers,
      activeProviderId: config.activeProviderId || providers[0]?.id || "",
    };

    await window.electronAPI.setConfig(newConfig);
    setConfig(newConfig);
    setModalOpen(false);
    message.success(editingProvider ? "已更新" : "已添加");
  };

  const handleDelete = async (id: string) => {
    const providers = config.providers.filter((p) => p.id !== id);
    const newConfig: Config = {
      ...config,
      providers,
      activeProviderId:
        config.activeProviderId === id
          ? providers[0]?.id || ""
          : config.activeProviderId,
    };
    await window.electronAPI.setConfig(newConfig);
    setConfig(newConfig);
    if (selectedId === id) {
      setSelectedId(providers[0]?.id || "");
    }
    message.success("已删除");
  };

  const handleSetActive = async (id: string) => {
    const newConfig = { ...config, activeProviderId: id };
    await window.electronAPI.setConfig(newConfig);
    setConfig(newConfig);
    message.success("已切换当前服务商");
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
          <h2>模型管理</h2>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenAdd}>
          添加服务商
        </Button>
      </div>

      {config.providers.length === 0 ? (
        <Empty
          image={<KeyOutlined style={{ fontSize: 64, color: "#ccc" }} />}
          description="还没有配置 API 服务商"
          style={{ paddingTop: 80 }}
        >
          <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenAdd}>
            添加第一个服务商
          </Button>
        </Empty>
      ) : (
        <div style={{ display: "flex", gap: 24 }}>
          <div style={{ width: 220, minWidth: 220 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {config.providers.map((item) => (
                <Card
                  key={item.id}
                  size="small"
                  hoverable
                  onClick={() => setSelectedId(item.id)}
                  style={{
                    cursor: "pointer",
                    borderColor:
                      item.id === selectedId
                        ? "var(--gradient-start)"
                        : undefined,
                    background:
                      item.id === config.activeProviderId
                        ? "rgba(102, 126, 234, 0.05)"
                        : undefined,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>
                        {item.name}
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: "#888",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          maxWidth: 160,
                        }}
                      >
                        {item.model}
                      </div>
                    </div>
                    {item.id === config.activeProviderId && (
                      <CheckCircleOutlined
                        style={{ color: "#52c41a", fontSize: 16 }}
                      />
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div style={{ flex: 1 }}>
            {selectedProvider ? (
              <Card
                title={
                  <Space>
                    <span>{selectedProvider.name}</span>
                    {selectedProvider.id === config.activeProviderId && (
                      <Tag color="success">当前使用</Tag>
                    )}
                  </Space>
                }
                extra={
                  <Space>
                    {selectedProvider.id !== config.activeProviderId && (
                      <Button
                        size="small"
                        onClick={() => handleSetActive(selectedProvider.id)}
                      >
                        设为默认
                      </Button>
                    )}
                    <Button
                      size="small"
                      icon={<EditOutlined />}
                      onClick={() => handleOpenEdit(selectedProvider)}
                    >
                      编辑
                    </Button>
                    <Popconfirm
                      title="确定删除此服务商？"
                      onConfirm={() => handleDelete(selectedProvider.id)}
                      okText="确定"
                      cancelText="取消"
                    >
                      <Button size="small" danger icon={<DeleteOutlined />}>
                        删除
                      </Button>
                    </Popconfirm>
                  </Space>
                }
              >
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div>
                    <div style={{ color: "#888", fontSize: 13, marginBottom: 4 }}>名称</div>
                    <div>{selectedProvider.name}</div>
                  </div>
                  <div>
                    <div style={{ color: "#888", fontSize: 13, marginBottom: 4 }}>协议</div>
                    <Tag color={
                      selectedProvider.apiProtocol === "openai" ? "blue" :
                      selectedProvider.apiProtocol === "stability" ? "purple" :
                      selectedProvider.apiProtocol === "pollinations" ? "green" : "default"
                    }>
                      {selectedProvider.apiProtocol === "openai" ? "OpenAI 兼容" :
                       selectedProvider.apiProtocol === "stability" ? "Stability AI" :
                       selectedProvider.apiProtocol === "pollinations" ? "Pollinations.ai（免费）" : "自定义"}
                    </Tag>
                  </div>
                  <div>
                    <div style={{ color: "#888", fontSize: 13, marginBottom: 4 }}>API 地址</div>
                    <div style={{ fontFamily: "monospace", fontSize: 13 }}>
                      {selectedProvider.baseUrl}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: "#888", fontSize: 13, marginBottom: 4 }}>模型</div>
                    <Tag>{selectedProvider.model}</Tag>
                  </div>
                  <div>
                    <div style={{ color: "#888", fontSize: 13, marginBottom: 4 }}>文生图接口</div>
                    <div style={{ fontFamily: "monospace", fontSize: 12, color: "#666" }}>
                      {selectedProvider.t2iEndpoint || "（默认）"}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: "#888", fontSize: 13, marginBottom: 4 }}>图生图接口</div>
                    <div style={{ fontFamily: "monospace", fontSize: 12, color: "#666" }}>
                      {selectedProvider.i2iEndpoint || "（默认）"}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: "#888", fontSize: 13, marginBottom: 4 }}>API Key</div>
                    <div style={{ color: "#52c41a" }}>
                      <CheckCircleOutlined /> 已加密存储
                    </div>
                  </div>
                  <div>
                    <div style={{ color: "#888", fontSize: 13, marginBottom: 4 }}>添加时间</div>
                    <div>
                      {new Date(selectedProvider.createdAt).toLocaleDateString(
                        "zh-CN"
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ) : (
              <Empty description="从左侧选择一个服务商" style={{ paddingTop: 40 }} />
            )}
          </div>
        </div>
      )}

      <Modal
        title={editingProvider ? "编辑服务商" : "添加服务商"}
        open={modalOpen}
        onOk={handleSave}
        onCancel={() => setModalOpen(false)}
        okText="保存"
        cancelText="取消"
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}
          initialValues={{ apiProtocol: "openai" }}
        >
          <Form.Item
            name="name"
            label="服务商名称"
            rules={[{ required: true, message: "请输入名称" }]}
          >
            <Input placeholder="例如：GPT Image 2" />
          </Form.Item>
          <Form.Item
            name="apiProtocol"
            label="API 协议类型"
            rules={[{ required: true, message: "请选择协议类型" }]}
          >
            <Select
              options={[
                { value: "openai", label: "OpenAI 兼容（推荐）" },
                { value: "stability", label: "Stability AI" },
                { value: "pollinations", label: "Pollinations.ai（免费无 Key）" },
                { value: "custom", label: "自定义" },
              ]}
            />
          </Form.Item>
          <Form.Item
            name="apiKey"
            label="API Key"
            rules={[
              {
                required: false,
                validator: (_, value) => {
                  const protocol = form.getFieldValue("apiProtocol");
                  if (protocol !== "pollinations" && !value) {
                    return Promise.reject(new Error("请输入 API Key"));
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input.Password placeholder="sk-... (Pollinations 无需填写)" />
          </Form.Item>
          <Form.Item
            name="baseUrl"
            label="请求地址 (Base URL)"
            rules={[{ required: true, message: "请输入请求地址" }]}
          >
            <Input placeholder="https://api.openai.com" />
          </Form.Item>
          <Form.Item
            name="model"
            label="模型名称"
            rules={[{ required: true, message: "请输入模型名称" }]}
          >
            <Input placeholder="gpt-image-2" />
          </Form.Item>
          <Alert
            message="接口路径（默认值适用于所选协议，一般无需修改）"
            type="info"
            showIcon
            style={{ marginBottom: 12, fontSize: 12 }}
          />
          <Form.Item name="t2iEndpoint" label="文生图接口路径">
            <Input placeholder="例如：/v1/images/generations" />
          </Form.Item>
          <Form.Item name="i2iEndpoint" label="图生图接口路径">
            <Input placeholder="例如：/v1/images/edits" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

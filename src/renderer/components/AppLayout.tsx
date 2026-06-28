import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  PictureOutlined,
  HistoryOutlined,
  SettingOutlined,
} from "@ant-design/icons";

interface AppLayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  { path: "/", label: "图像生成", icon: <PictureOutlined /> },
  { path: "/history", label: "历史记录", icon: <HistoryOutlined /> },
  { path: "/models", label: "模型管理", icon: <SettingOutlined /> },
];

export default function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed] = useState(false);

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <div className="app-layout">
      {/* 侧边栏 */}
      <aside
        className="app-sider"
        style={{
          width: collapsed ? 0 : "var(--sider-width)",
          minWidth: collapsed ? 0 : "var(--sider-width)",
        }}
      >
        <div className="app-sider-logo">
          <h1>Morning AI</h1>
        </div>

        <nav className="app-sider-menu">
          {menuItems.map((item) => (
            <div
              key={item.path}
              className={`menu-item${isActive(item.path) ? " active" : ""}`}
              onClick={() => navigate(item.path)}
            >
              {item.icon}
              <span>{item.label}</span>
            </div>
          ))}
        </nav>

        <div className="app-sider-footer" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div className="user-avatar" style={{ marginBottom: 0, flexShrink: 0 }}>🎨</div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>AI 创作者</div>
            <div style={{ fontSize: 11, opacity: 0.6 }}>无限创意 · 即刻生成</div>
          </div>
        </div>
      </aside>

      <main className={`main-layout${collapsed ? " collapsed" : ""}`}>
        <div className="main-content">{children}</div>
      </main>
    </div>
  );
}

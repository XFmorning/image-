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

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <div className="app-layout">
      {/* 侧边栏 */}
      <aside className="app-sider">
        {/* Logo */}
        <div className="app-sider-logo">
          <div className="logo-row">
            <h1>Morning AI</h1>
          </div>
          <div className="logo-sub">让创意在清晨发芽🌱</div>
        </div>

        {/* 菜单 */}
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

        {/* 底部 PRO 卡片 */}
        <div className="app-sider-footer">
          <div className="footer-left">
            <span className="pro-badge">PRO</span>
            <div className="pro-title">AI 创作者</div>
            <div className="pro-sub">无限创意 · 即刻生成</div>
          </div>
          <div className="footer-right">
            <div className="user-avatar">🎨</div>
          </div>
        </div>
      </aside>

      {/* 主内容 */}
      <main className="main-layout">
        <div className="main-content">{children}</div>
      </main>
    </div>
  );
}

import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, LogOut, Upload, Plus } from "lucide-react";
import { getLoginUrl } from "@/const";
import { useState, useRef } from "react";
import { trpc } from "@/lib/trpc";

export default function Home() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateMutation = trpc.generation.generate.useMutation();
  const userQuery = trpc.user.getProfile.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!selectedImage) {
      alert("请先上传图片");
      return;
    }

    setIsGenerating(true);
    try {
      await generateMutation.mutateAsync({
        originalImage: selectedImage,
        title,
        subtitle,
      });
    } catch (error: any) {
      alert(error.message || "生成失败，请重试");
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#fff" }}>
        <Loader2 style={{ width: "32px", height: "32px", animation: "spin 1s linear infinite", color: "#dc2626" }} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "#fff", padding: "16px" }}>
        <div style={{ textAlign: "center", maxWidth: "448px" }}>
          <h1 style={{ fontSize: "48px", fontWeight: "bold", marginBottom: "16px", color: "#dc2626" }}>
            📕 小红书封面生成器
          </h1>
          <p style={{ color: "#666", marginBottom: "32px", fontSize: "18px" }}>
            一键生成优雅的小红书封面，让您的内容更加吸引人
          </p>
          <a href={getLoginUrl()}>
            <Button size="lg" style={{ width: "100%", backgroundColor: "#dc2626", color: "#fff", padding: "12px", fontSize: "16px" }}>
              👤 登录 / 注册
            </Button>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#fff", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <header style={{ borderBottom: "1px solid #e5e7eb", backgroundColor: "#fff", padding: "24px 32px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: "bold", color: "#dc2626" }}>📕 小红书创作助手</h1>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <span style={{ fontSize: "14px", color: "#666" }}>💎 {userQuery.data?.credits || 0}</span>
            <span style={{ fontSize: "14px", color: "#666" }}>{user?.email}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => logout()}
              style={{ color: "#666" }}
            >
              <LogOut style={{ width: "16px", height: "16px" }} />
            </Button>
          </div>
        </div>

        {/* Info Text */}
        <div style={{ textAlign: "center", fontSize: "12px", color: "#666", marginBottom: "24px", lineHeight: "1.6" }}>
          <p>目前支持 IP 口播型视频，适配性较好</p>
          <p>对于空镜或无人体出现的照片，可能适配性不强</p>
          <p>生成的图片暂时无法修改，如需修改可下载后使用美图秀秀等工具二次修订</p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", justifyContent: "center", gap: "16px" }}>
          <button style={{ padding: "8px 32px", backgroundColor: "#dc2626", color: "#fff", borderRadius: "24px", fontWeight: "600", fontSize: "14px", border: "none", cursor: "pointer" }}>
            💬 生成封面
          </button>
          <button style={{ padding: "8px 32px", border: "2px solid #d1d5db", color: "#374151", borderRadius: "24px", fontWeight: "600", fontSize: "14px", backgroundColor: "#fff", cursor: "pointer" }}>
            📝 爆款文案
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Left Scrollable Content */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          <div style={{ maxWidth: "1024px", margin: "0 auto", padding: "32px" }}>
            {/* Step 1: Upload Materials */}
            <div style={{ marginBottom: "48px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
                <div style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "#dc2626", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "14px" }}>
                  1
                </div>
                <h2 style={{ fontSize: "18px", fontWeight: "bold", color: "#111" }}>上传素材</h2>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                {/* Primary Image Upload */}
                <div style={{ border: "1px solid #d1d5db", borderRadius: "8px", padding: "24px", backgroundColor: "#fff" }}>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#111", marginBottom: "16px" }}>
                    👤 人像/主体 (必填)
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: "none" }}
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    style={{ width: "100%", padding: "48px", border: "2px dashed #d1d5db", borderRadius: "8px", backgroundColor: "#fff", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px" }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#f87171"; e.currentTarget.style.backgroundColor = "#fef2f2"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#d1d5db"; e.currentTarget.style.backgroundColor = "#fff"; }}
                  >
                    <Upload style={{ width: "32px", height: "32px", color: "#9ca3af" }} />
                    <span style={{ fontSize: "14px", color: "#666" }}>点击上传</span>
                  </button>
                </div>

                {/* Secondary Image Upload */}
                <div style={{ border: "1px solid #d1d5db", borderRadius: "8px", padding: "24px", backgroundColor: "#fff" }}>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#111", marginBottom: "16px" }}>
                    🌄 空镜/背景 (0)
                  </label>
                  <button style={{ width: "100%", padding: "48px", border: "2px dashed #d1d5db", borderRadius: "8px", backgroundColor: "#fff", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px", color: "#666" }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#f87171"; e.currentTarget.style.backgroundColor = "#fef2f2"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#d1d5db"; e.currentTarget.style.backgroundColor = "#fff"; }}
                  >
                    <Upload style={{ width: "32px", height: "32px" }} />
                    <span style={{ fontSize: "14px" }}>支持多张上传</span>
                  </button>
                </div>
              </div>

              <p style={{ fontSize: "12px", color: "#999", marginTop: "16px", textAlign: "center" }}>
                提示：AI 将优先保留主体人物，并从上传的多张背景中智能选择或拼接。
              </p>
            </div>

            {/* Step 2 & 3 Container */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px", marginBottom: "48px" }}>
              {/* Step 2: Select Style */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
                  <div style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "#dc2626", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "14px" }}>
                    2
                  </div>
                  <h2 style={{ fontSize: "18px", fontWeight: "bold", color: "#111" }}>选择封面风格</h2>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button style={{ flex: 1, padding: "8px 16px", backgroundColor: "#1f2937", color: "#fff", borderRadius: "6px", fontSize: "12px", fontWeight: "600", border: "none", cursor: "pointer" }}>
                      预设风格
                    </button>
                    <button style={{ flex: 1, padding: "8px 16px", border: "1px solid #d1d5db", color: "#374151", borderRadius: "6px", fontSize: "12px", fontWeight: "600", backgroundColor: "#fff", cursor: "pointer" }}>
                      我的风格库
                    </button>
                  </div>

                  {/* Style Grid */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
                    {[
                      "手绘边框",
                      "户外手写",
                      "霓虹撞色",
                      "多层排版",
                      "书房知性",
                      "职场女性",
                      "贴纸活力",
                      "虚线装饰",
                      "背景大字",
                    ].map((style, idx) => (
                      <div
                        key={idx}
                        style={{ padding: "12px", border: "1px solid #d1d5db", borderRadius: "6px", backgroundColor: "#fff", cursor: "pointer", textAlign: "center", fontSize: "12px", fontWeight: "500", color: "#374151" }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#f87171"; e.currentTarget.style.backgroundColor = "#fef2f2"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#d1d5db"; e.currentTarget.style.backgroundColor = "#fff"; }}
                      >
                        {style}
                      </div>
                    ))}
                  </div>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "12px", border: "1px solid #d1d5db", borderRadius: "6px", cursor: "pointer", backgroundColor: "#fff" }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#f9fafb"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#fff"; }}
                  >
                    <Plus style={{ width: "16px", height: "16px", color: "#666" }} />
                    <span style={{ fontSize: "12px", color: "#374151" }}>自定义</span>
                  </div>

                  <p style={{ fontSize: "12px", color: "#999" }}>
                    💡 提示：支持多选风格；每生成 1 张图片消耗 1 积分
                  </p>
                </div>
              </div>

              {/* Step 3: Detailed Configuration */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
                  <div style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "#dc2626", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "14px" }}>
                    3
                  </div>
                  <h2 style={{ fontSize: "18px", fontWeight: "bold", color: "#111" }}>详细配置</h2>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {/* Title */}
                  <div>
                    <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#111", marginBottom: "8px" }}>
                      封面主标题 (大字)
                    </label>
                    <Input
                      placeholder="例如：双11必买清单"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      style={{ borderColor: "#d1d5db", fontSize: "14px", width: "100%", padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: "6px" }}
                    />
                  </div>

                  {/* Subtitle */}
                  <div>
                    <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#111", marginBottom: "8px" }}>
                      副标题 (小字)
                    </label>
                    <Input
                      placeholder="例如：省钱攻略 | 凑单作业"
                      value={subtitle}
                      onChange={(e) => setSubtitle(e.target.value)}
                      style={{ borderColor: "#d1d5db", fontSize: "14px", width: "100%", padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: "6px" }}
                    />
                  </div>

                  {/* Font Style */}
                  <div>
                    <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#111", marginBottom: "8px" }}>
                      字体风格 (点击预览)
                    </label>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
                      {[
                        "默认风格",
                        "大粗黑体",
                        "综艺体",
                        "稳重宋体",
                        "圆体",
                        "手写体",
                        "书法体",
                      ].map((font, idx) => (
                        <button
                          key={idx}
                          style={{ padding: "12px", border: "1px solid #d1d5db", borderRadius: "6px", backgroundColor: "#fff", cursor: "pointer", fontSize: "12px", fontWeight: "500", color: "#374151" }}
                          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#f87171"; e.currentTarget.style.backgroundColor = "#fef2f2"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#d1d5db"; e.currentTarget.style.backgroundColor = "#fff"; }}
                        >
                          <div style={{ fontWeight: "bold" }}>ABC</div>
                          <div style={{ fontSize: "10px" }}>{font}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Aspect Ratio */}
                  <div>
                    <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#111", marginBottom: "8px" }}>
                      图片比例
                    </label>
                    <select style={{ width: "100%", padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "14px" }}>
                      <option>3:4 (小红书标准)</option>
                      <option>4:3 (横屏视频)</option>
                      <option>2.35:1 (公众号封面)</option>
                      <option>1:1 (正方形)</option>
                    </select>
                  </div>

                  {/* Decoration */}
                  <div>
                    <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#111", marginBottom: "8px" }}>
                      添加装饰/贴纸 (可选)
                    </label>
                    <Input
                      placeholder="例如：加一个New标签，或者星星特效"
                      style={{ borderColor: "#d1d5db", fontSize: "14px", width: "100%", padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: "6px" }}
                    />
                  </div>

                  {/* Other Requirements */}
                  <div>
                    <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#111", marginBottom: "8px" }}>
                      其他要求 (给AI的备注)
                    </label>
                    <textarea
                      placeholder="例如：背景虚化一点，人物放在左边，整体色调要偏暖..."
                      style={{ width: "100%", padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "14px", resize: "none", fontFamily: "inherit" }}
                      rows={3}
                    />
                  </div>

                  {/* Batch Mode */}
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", padding: "12px", backgroundColor: "#fffbeb", borderRadius: "6px", border: "1px solid #fcd34d" }}>
                    <input type="checkbox" id="batch" style={{ width: "16px", height: "16px", marginTop: "4px" }} />
                    <div>
                      <label htmlFor="batch" style={{ fontSize: "14px", fontWeight: "600", color: "#111" }}>
                        批量模式：为同一风格生成 6 张变体
                      </label>
                      <p style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
                        开启后为当前风格生成 6 张不同变体，生成时间较长，请耐心等待
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !selectedImage}
              style={{ width: "100%", backgroundColor: isGenerating || !selectedImage ? "#9ca3af" : "#dc2626", color: "#fff", padding: "12px", fontSize: "18px", fontWeight: "600", borderRadius: "24px", border: "none", cursor: isGenerating || !selectedImage ? "not-allowed" : "pointer", marginBottom: "16px" }}
            >
              {isGenerating && (
                <Loader2 style={{ width: "20px", height: "20px", animation: "spin 1s linear infinite", display: "inline", marginRight: "8px" }} />
              )}
              {isGenerating ? "生成中..." : "✨ 生成封面"}
            </button>

            <p style={{ fontSize: "12px", color: "#666", textAlign: "center", marginBottom: "32px" }}>
              1张图片=1积分，本次预计消耗 1 积分
            </p>

            {/* Footer */}
            <div style={{ paddingTop: "32px", borderTop: "1px solid #e5e7eb", textAlign: "center", fontSize: "12px", color: "#666" }}>
              <p>Made with ❤️ by Vivi</p>
              <p style={{ marginTop: "8px" }}>
                联系作者：
                <a href="mailto:mengjie.xiao@outlook.com" style={{ color: "#dc2626", textDecoration: "none" }}>
                  mengjie.xiao@outlook.com
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Right Fixed Sidebar */}
        <div style={{ width: "64px", backgroundColor: "#fff", borderLeft: "1px solid #e5e7eb", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "24px", padding: "32px 0" }}>
          {/* Feedback Button */}
          <button 
            style={{ width: "48px", height: "96px", backgroundColor: "#dc2626", color: "#fff", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", border: "none", cursor: "pointer", writingMode: "vertical-rl", textOrientation: "mixed" }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#b91c1c"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#dc2626"; }}
          >
            意见反馈
          </button>

          {/* Generate Button */}
          <button 
            style={{ width: "48px", height: "96px", backgroundColor: "#dc2626", color: "#fff", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", border: "none", cursor: "pointer", writingMode: "vertical-rl", textOrientation: "mixed" }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#b91c1c"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#dc2626"; }}
          >
            生成封面
          </button>
        </div>
      </div>
    </div>
  );
}

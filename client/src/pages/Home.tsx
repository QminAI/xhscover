import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, LogOut, Zap, Upload, MessageCircle } from "lucide-react";
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
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-red-600" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
        <div className="text-center max-w-md">
          <h1 className="text-5xl font-bold mb-4 text-red-600">
            📕 小红书封面生成器
          </h1>
          <p className="text-gray-600 mb-8 text-lg">
            一键生成优雅的小红书封面，让您的内容更加吸引人
          </p>
          <a href={getLoginUrl()}>
            <Button size="lg" className="w-full bg-red-600 hover:bg-red-700 text-white">
              👤 登录 / 注册
            </Button>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-full px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-red-600">
              📕 小红书创作助手
            </h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1 bg-red-50 rounded-full border border-red-200">
                <Zap className="w-4 h-4 text-red-600" />
                <span className="font-semibold text-red-600 text-sm">
                  💎 {userQuery.data?.credits || 0}
                </span>
              </div>
              <span className="text-sm text-gray-600">{user?.email}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => logout()}
                className="text-gray-600 hover:text-red-600"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Info Section */}
          <div className="text-center text-xs text-gray-600 space-y-1 mb-4">
            <p>目前支持 IP 口播型视频，适配性较好</p>
            <p>对于空镜或无人体出现的照片，可能适配性不强</p>
            <p>生成的图片暂时无法修改，如需修改可下载后使用美图秀秀等工具二次修订</p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <Button className="bg-red-600 hover:bg-red-700 text-white rounded-full px-6 gap-2">
              💬 生成封面
            </Button>
            <Button variant="outline" className="border-gray-300 text-gray-700 rounded-full px-6 gap-2">
              📝 爆款文案
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto px-8 py-8 space-y-8">
            {/* Step 1: Upload Materials */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-xs">
                  1
                </div>
                <h2 className="text-lg font-bold text-gray-900">上传素材</h2>
              </div>

              <div className="space-y-4">
                {/* Primary Image Upload */}
                <div className="border border-gray-300 rounded-lg p-6">
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    👤 人像/主体 (必填)
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full p-12 border-2 border-dashed border-gray-300 rounded-lg hover:border-red-400 hover:bg-red-50 transition flex flex-col items-center justify-center gap-2 cursor-pointer"
                  >
                    <Upload className="w-8 h-8 text-gray-400" />
                    <span className="text-sm text-gray-600">点击上传</span>
                  </button>
                </div>

                {/* Secondary Image Upload */}
                <div className="border border-gray-300 rounded-lg p-6">
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    🌄 空镜/背景 (0)
                  </label>
                  <button className="w-full p-12 border-2 border-dashed border-gray-300 rounded-lg hover:border-red-400 hover:bg-red-50 transition flex flex-col items-center justify-center gap-2 cursor-pointer text-gray-600">
                    <Upload className="w-8 h-8" />
                    <span className="text-sm">支持多张上传</span>
                  </button>
                  <p className="text-xs text-gray-500 mt-3">
                    提示：AI 将优先保留主体人物，并从上传的多张背景中智能选择或拼接。
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2: Select Style */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <h2 className="text-lg font-bold text-gray-900">选择封面风格</h2>
              </div>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50">
                    预设风格
                  </Button>
                  <Button variant="outline" className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50">
                    我的风格库
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    "手绘边框",
                    "户外手写",
                    "霓虹撞色",
                    "多层排版",
                    "书房知性",
                    "职场女性",
                  ].map((style, idx) => (
                    <div
                      key={idx}
                      className="p-4 border border-gray-300 rounded-lg hover:border-red-400 hover:bg-red-50 transition cursor-pointer text-center"
                    >
                      <div className="text-xs font-medium text-gray-700">{style}</div>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-gray-500">
                  💡 提示：支持多选风格；每生成 1 张图片消耗 1 积分
                </p>
              </div>
            </div>

            {/* Step 3: Detailed Configuration */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-xs">
                  3
                </div>
                <h2 className="text-lg font-bold text-gray-900">详细配置</h2>
              </div>

              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    封面主标题 (大字)
                  </label>
                  <Input
                    placeholder="例如：双11必买清单"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="border-gray-300"
                  />
                </div>

                {/* Subtitle */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    副标题 (小字)
                  </label>
                  <Input
                    placeholder="例如：省钱攻略 | 凑单作业"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    className="border-gray-300"
                  />
                </div>

                {/* Font Style */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    字体风格 (点击预览)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
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
                        className="p-3 border border-gray-300 rounded-lg hover:border-red-400 hover:bg-red-50 transition text-xs font-medium text-gray-700"
                      >
                        ABC<br />{font}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Aspect Ratio */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    图片比例
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                    <option>3:4 (小红书标准)</option>
                    <option>4:3 (横屏视频)</option>
                    <option>2.35:1 (公众号封面)</option>
                    <option>1:1 (正方形)</option>
                  </select>
                </div>

                {/* Decoration */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    添加装饰/贴纸 (可选)
                  </label>
                  <Input
                    placeholder="例如：加一个New标签，或者星星特效"
                    className="border-gray-300"
                  />
                </div>

                {/* Other Requirements */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    其他要求 (给AI的备注)
                  </label>
                  <textarea
                    placeholder="例如：背景虚化一点，人物放在左边，整体色调要偏暖..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none"
                    rows={4}
                  />
                </div>

                {/* Batch Mode */}
                <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <input type="checkbox" id="batch" className="w-4 h-4" />
                  <label htmlFor="batch" className="text-sm text-gray-700">
                    <span className="font-semibold">批量模式：为同一风格生成 6 张变体</span>
                    <p className="text-xs text-gray-600 mt-1">开启后为当前风格生成 6 张不同变体，生成时间较长，请耐心等待</p>
                  </label>
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !selectedImage}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 text-lg font-semibold gap-2 rounded-full"
            >
              {isGenerating && (
                <Loader2 className="w-5 h-5 animate-spin" />
              )}
              {isGenerating ? "生成中..." : "✨ 生成封面"}
            </Button>

            <p className="text-xs text-gray-600 text-center">
              1张图片=1积分，本次预计消耗 1 积分
            </p>

            {/* Footer */}
            <div className="pt-8 border-t border-gray-200 text-center text-xs text-gray-600">
              <p>Made with ❤️ by Vivi</p>
              <p className="mt-2">
                联系作者：
                <a href="mailto:mengjie.xiao@outlook.com" className="text-red-600 hover:underline">
                  mengjie.xiao@outlook.com
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Right Fixed Sidebar */}
        <div className="w-16 bg-white border-l border-gray-200 flex flex-col items-center justify-center gap-6 py-8">
          {/* Feedback Button */}
          <button className="w-12 h-24 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center justify-center text-xs font-bold transition" style={{writingMode: 'vertical-rl'}}>
            意见反馈
          </button>

          {/* Generate Button */}
          <button className="w-12 h-24 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center justify-center text-xs font-bold transition" style={{writingMode: 'vertical-rl'}}>
            生成封面
          </button>
        </div>
      </div>
    </div>
  );
}

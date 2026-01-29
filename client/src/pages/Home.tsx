import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, LogOut, Zap, Upload, Palette, Settings } from "lucide-react";
import { getLoginUrl } from "@/const";
import { useState, useRef } from "react";
import { trpc } from "@/lib/trpc";
import CanvasEditor from "@/components/CanvasEditor";

export default function Home() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<any>(null);

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
      const result = await generateMutation.mutateAsync({
        originalImage: selectedImage,
        title,
        subtitle,
      });
      setGeneratedImage(result.resultImage);
    } catch (error: any) {
      alert(error.message || "生成失败，请重试");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (canvasRef.current) {
      canvasRef.current.downloadImage();
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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 sticky top-0 z-10 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-red-600">
            📕 小红书创作助手
          </h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-red-50 rounded-lg border border-red-200">
              <Zap className="w-4 h-4 text-red-600" />
              <span className="font-semibold text-red-600">
                💎 {userQuery.data?.credits || 0}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              {user?.email}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => logout()}
              className="gap-2 text-gray-600 hover:text-red-600"
            >
              <LogOut className="w-4 h-4" />
              退出
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Info Section */}
        <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600 mb-2">
            ℹ️ 目前支持 IP 口播型视频，适配性较好
          </p>
          <p className="text-sm text-gray-600 mb-2">
            ⚠️ 对于空镜或无人体出现的照片，可能适配性不强
          </p>
          <p className="text-sm text-gray-600">
            💡 生成的图片暂时无法修改，如需修改可下载后使用美图秀秀等工具二次修订
          </p>
        </div>

        {/* Three Step Process */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Step 1: Upload Materials */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h2 className="text-xl font-bold text-gray-900">上传素材</h2>
            </div>

            <Card className="p-6 border-2 border-dashed border-red-300">
              <div className="space-y-4">
                {/* Primary Image Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
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
                    className="w-full p-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-red-400 hover:bg-red-50 transition flex flex-col items-center justify-center gap-2 cursor-pointer"
                  >
                    <Upload className="w-6 h-6 text-gray-400" />
                    <span className="text-sm text-gray-600">点击上传</span>
                  </button>
                  {selectedImage && (
                    <div className="mt-3 text-sm text-green-600 font-medium">
                      ✓ 已选择图片
                    </div>
                  )}
                </div>

                {/* Secondary Image Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    🌄 空镜/背景 (0)
                  </label>
                  <button className="w-full p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-red-400 hover:bg-red-50 transition flex flex-col items-center justify-center gap-2 cursor-pointer text-gray-600">
                    <Upload className="w-5 h-5" />
                    <span className="text-sm">支持多张上传</span>
                  </button>
                  <p className="text-xs text-gray-500 mt-2">
                    提示：AI 将优先保留主体人物，并从上传的多张背景中智能选择或拼接。
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Step 2: Select Style */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h2 className="text-xl font-bold text-gray-900">选择风格</h2>
            </div>

            <Card className="p-6 border-2 border-dashed border-red-300">
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 border-red-300 text-red-600 hover:bg-red-50">
                    预设风格
                  </Button>
                  <Button variant="outline" className="flex-1 border-red-300 text-red-600 hover:bg-red-50">
                    我的风格库
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-3">
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
                      className="p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-red-400 hover:bg-red-50 transition cursor-pointer text-center"
                    >
                      <div className="text-xs font-medium text-gray-700">{style}</div>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-gray-500">
                  💡 提示：支持多选风格；每生成 1 张图片消耗 1 积分
                </p>
              </div>
            </Card>
          </div>

          {/* Step 3: Detailed Configuration */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm">
                3
              </div>
              <h2 className="text-xl font-bold text-gray-900">详细配置</h2>
            </div>

            <Card className="p-6 border-2 border-dashed border-red-300">
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
                    字体风格
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                    <option>默认风格</option>
                    <option>大粗黑体</option>
                    <option>综艺体</option>
                    <option>稳重宋体</option>
                    <option>圆体</option>
                    <option>手写体</option>
                    <option>书法体</option>
                  </select>
                </div>

                {/* Aspect Ratio */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    图片比例
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm resize-none"
                    rows={3}
                  />
                </div>

                {/* Batch Mode */}
                <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <input type="checkbox" id="batch" className="w-4 h-4" />
                  <label htmlFor="batch" className="text-sm text-gray-700">
                    批量模式：生成 6 张变体
                  </label>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Canvas Preview and Generate Button */}
        <div className="mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Canvas Preview */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">预览</h3>
              <Card className="p-6 bg-gray-50 border-2 border-dashed border-red-300">
                <div className="flex items-center justify-center bg-white rounded-lg overflow-hidden">
                  {generatedImage ? (
                    <CanvasEditor
                      ref={canvasRef}
                      backgroundImage={generatedImage}
                      title={title}
                      subtitle={subtitle}
                    />
                  ) : (
                    <div className="w-full aspect-[3/4] flex items-center justify-center text-gray-400">
                      <div className="text-center">
                        <p className="text-sm">上传图片并点击生成开始</p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col justify-center gap-4">
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !selectedImage}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-6 text-lg font-semibold gap-2 rounded-lg"
              >
                {isGenerating && (
                  <Loader2 className="w-5 h-5 animate-spin" />
                )}
                {isGenerating ? "生成中..." : "✨ 生成封面"}
              </Button>

              <p className="text-sm text-gray-600 text-center">
                1张图片=1积分，本次预计消耗 1 积分
              </p>

              <Button
                variant="outline"
                onClick={handleDownload}
                disabled={!generatedImage}
                className="w-full border-red-300 text-red-600 hover:bg-red-50 py-6 text-lg font-semibold rounded-lg"
              >
                📥 下载图片
              </Button>

              <Button
                variant="outline"
                className="w-full border-red-300 text-red-600 hover:bg-red-50 py-6 text-lg font-semibold rounded-lg"
              >
                💬 爆款文案
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
          <p>Made with ❤️ by XHS Cover Generator</p>
          <p className="mt-2">
            <a href="#" className="text-red-600 hover:underline">
              意见反馈
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, LogOut, Zap } from "lucide-react";
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
        <div className="text-center max-w-md">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            XHS Cover Generator
          </h1>
          <p className="text-gray-600 mb-8">
            创建优雅的小红书封面，让您的内容更加吸引人
          </p>
          <a href={getLoginUrl()}>
            <Button size="lg" className="w-full">
              登录/注册
            </Button>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            XHS Cover
          </h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg">
              <Zap className="w-4 h-4 text-blue-600" />
              <span className="font-semibold text-blue-900">
                {userQuery.data?.credits || 0} 积分
              </span>
            </div>
            <div className="text-sm text-gray-600">
              {user?.email}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => logout()}
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              退出
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h2 className="text-lg font-semibold mb-6">编辑面板</h2>

              {/* Image Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  上传图片
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => fileInputRef.current?.click()}
                >
                  选择图片
                </Button>
                {selectedImage && (
                  <div className="mt-3 text-sm text-green-600">
                    ✓ 已选择图片
                  </div>
                )}
              </div>

              {/* Title Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  标题
                </label>
                <Input
                  placeholder="输入标题"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-sm"
                />
              </div>

              {/* Subtitle Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  副标题
                </label>
                <Input
                  placeholder="输入副标题"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="text-sm"
                />
              </div>

              {/* Generate Button */}
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !selectedImage}
                className="w-full mb-4 gap-2"
              >
                {isGenerating && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                {isGenerating ? "生成中..." : "生成封面"}
              </Button>

              {/* Download Button */}
              <Button
                variant="outline"
                onClick={handleDownload}
                disabled={!generatedImage}
                className="w-full"
              >
                下载图片
              </Button>
            </Card>
          </div>

          {/* Right Canvas Area */}
          <div className="lg:col-span-2">
            <Card className="p-6 bg-white">
              <div className="flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg overflow-hidden">
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
                      <p className="text-lg">上传图片并点击生成开始</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

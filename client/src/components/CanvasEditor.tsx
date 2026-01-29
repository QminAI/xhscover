import { forwardRef, useEffect, useRef, useState } from "react";
import { Canvas, Image as FabricImage, Text, Shadow } from "fabric";

interface CanvasEditorProps {
  backgroundImage: string;
  title: string;
  subtitle: string;
}

const CanvasEditor = forwardRef<any, CanvasEditorProps>(
  ({ backgroundImage, title, subtitle }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fabricCanvasRef = useRef<Canvas | null>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
      if (!canvasRef.current) return;

      const canvas = new Canvas(canvasRef.current, {
        width: 540,
        height: 720,
        backgroundColor: "#f0f0f0",
      });

      fabricCanvasRef.current = canvas;

      FabricImage.fromURL(backgroundImage).then((img) => {
        img.scaleToWidth(540);
        canvas.backgroundImage = img;
        canvas.renderAll();
        setIsReady(true);
      });

      return () => {
        canvas.dispose();
      };
    }, [backgroundImage]);

    useEffect(() => {
      if (!fabricCanvasRef.current || !isReady) return;

      const canvas = fabricCanvasRef.current;

      canvas.getObjects("text").forEach((obj: any) => canvas.remove(obj));

      if (title) {
        const titleText = new Text(title, {
          left: 270,
          top: 100,
          fontSize: 32,
          fontWeight: "bold",
          fill: "#ffffff",
          textAlign: "center",
          originX: "center",
          shadow: new Shadow({
            color: "rgba(0,0,0,0.5)",
            blur: 10,
            offsetX: 2,
            offsetY: 2,
          }),
        });
        canvas.add(titleText);
      }

      if (subtitle) {
        const subtitleText = new Text(subtitle, {
          left: 270,
          top: 150,
          fontSize: 18,
          fill: "#f0f0f0",
          textAlign: "center",
          originX: "center",
          shadow: new Shadow({
            color: "rgba(0,0,0,0.5)",
            blur: 8,
            offsetX: 1,
            offsetY: 1,
          }),
        });
        canvas.add(subtitleText);
      }

      canvas.renderAll();
    }, [title, subtitle, isReady]);

    const downloadImage = () => {
      if (fabricCanvasRef.current) {
        const dataUrl = fabricCanvasRef.current.toDataURL({
          multiplier: 2,
          format: "png",
          quality: 1,
        });
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = `xhs-cover-${Date.now()}.png`;
        link.click();
      }
    };

    Object.assign(ref || {}, { downloadImage });

    return (
      <div className="w-full flex items-center justify-center">
        <canvas
          ref={canvasRef}
          className="border border-gray-300 rounded-lg shadow-lg"
        />
      </div>
    );
  }
);

CanvasEditor.displayName = "CanvasEditor";

export default CanvasEditor;

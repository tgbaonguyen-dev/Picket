import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  X,
  Zap,
  ZapOff,
  Image as ImageIcon,
  ScanLine,
  RotateCcw,
  Check,
  Sparkles,
  FileText,
  Loader2,
  Lightbulb,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  Pencil,
  ChevronDown,
  WifiOff,
  Plus,
  Minus
} from "lucide-react";
import { toast } from "sonner";
import { formatVND, getCategories } from "@/data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/capture-receipt")({
  component: CaptureReceiptPage,
});

type Stage = "camera" | "preview" | "processing" | "review" | "error_blurry" | "error_network" | "duplicate_warning" | "success";

type Field = { key: string; label: string; value: string; confidence: number; box?: [number, number, number, number] };
type LineItem = { id: string; name: string; price: number; category: string; confidence: number; box?: [number, number, number, number] };

function CaptureReceiptPage() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [stage, setStage] = useState<Stage>("camera");
  const [flash, setFlash] = useState(false);
  const [torch, setTorch] = useState(false);
  const [shot, setShot] = useState<string | null>(null);
  const [camError, setCamError] = useState<string | null>(null);
  const [facing, setFacing] = useState<"environment" | "user">("environment");
  
  // OCR Data
  const [fields, setFields] = useState<Field[]>([]);
  const [items, setItems] = useState<LineItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function start() {
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          setCamError("Trình duyệt không hỗ trợ camera");
          return;
        }
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: facing },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
        setCamError(null);
      } catch (e) {
        setCamError("Không thể truy cập camera. Vui lòng cấp quyền hoặc chọn ảnh có sẵn.");
      }
    }

    if (stage === "camera") start();
    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, [stage, facing]);

  function capture() {
    const video = videoRef.current;
    if (!video || !video.videoWidth) {
      toast.error("Chưa sẵn sàng");
      return;
    }
    setFlash(true);
    setTimeout(() => setFlash(false), 180);

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    const data = canvas.toDataURL("image/jpeg", 0.9);
    setShot(data);
    setStage("preview");
  }

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setShot(reader.result as string);
      setStage("preview");
    };
    reader.readAsDataURL(file);
  }

  function startProcessing() {
    setStage("review");
    setIsProcessing(true);
    
    // Simulate OCR steps and edge cases
    setTimeout(() => {
      setIsProcessing(false);
      const r = Math.random();
      if (r < 0.1) {
        setStage("error_network");
        return;
      } else if (r < 0.2) {
        setStage("error_blurry");
        return;
      }
      
      setFields([
        { key: "merchant", label: "Cửa hàng", value: "Lotte Mart", confidence: 0.96, box: [10, 5, 80, 10] },
        { key: "date", label: "Ngày", value: "04/07/2026 · 14:32", confidence: 0.93, box: [10, 18, 50, 6] },
        { key: "total", label: "Tổng tiền", value: "160000", confidence: 0.99, box: [10, 80, 80, 10] },
      ]);
      setItems([
        { id: "1", name: "Cà chua sấy", price: 45000, category: "food", confidence: 0.95, box: [10, 30, 80, 8] },
        { id: "2", name: "Nước rửa chén", price: 110000, category: "shopping", confidence: 0.82, box: [10, 42, 80, 8] },
        { id: "3", name: "Vé gửi xe", price: 5000, category: "transport", confidence: 0.75, box: [10, 54, 80, 8] },
      ]);
      
      if (r > 0.8 && r < 0.9) {
        setStage("duplicate_warning");
      }
    }, 2500);
  }

  function retake() {
    setShot(null);
    setFields([]);
    setItems([]);
    setStage("camera");
  }

  function save() {
    toast.success("Đã lưu hoá đơn");
    setStage("success");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F5E8DA] sm:p-4">
      <div className="relative mx-auto flex h-[100dvh] w-full sm:max-w-[390px] flex-col overflow-hidden sm:rounded-[44px] bg-black sm:h-[844px] sm:max-h-[calc(100vh-32px)] sm:shadow-2xl sm:ring-[6px] sm:ring-white">
        
        {stage === "camera" && (
          <CameraStage
            videoRef={videoRef}
            camError={camError}
            flash={flash}
            torch={torch}
            onToggleTorch={() => setTorch((v) => !v)}
            onFlip={() => setFacing((f) => (f === "environment" ? "user" : "environment"))}
            onClose={() => navigate({ to: "/" })}
            onCapture={capture}
            onPickFile={() => fileRef.current?.click()}
          />
        )}

        {stage === "preview" && shot && (
          <PreviewStage shot={shot} onRetake={retake} onUse={startProcessing} />
        )}

        {stage === "error_network" && (
          <ErrorState 
            shot={shot} 
            title="Lỗi kết nối mạng" 
            desc="Không thể kết nối đến máy chủ AI. Vui lòng kiểm tra lại 4G/Wifi." 
            icon={<WifiOff className="h-6 w-6 text-white" />}
            onRetry={startProcessing}
            onRetake={retake}
          />
        )}

        {stage === "error_blurry" && (
          <ErrorState 
            shot={shot} 
            title="Không đọc rõ hoá đơn" 
            desc="Ảnh bị mờ hoặc không đủ ánh sáng. Vui lòng chụp lại hoặc nhập bằng tay." 
            icon={<AlertTriangle className="h-6 w-6 text-white" />}
            onRetry={() => navigate({ to: "/transactions/new" })}
            retryLabel="Nhập bằng tay"
            onRetake={retake}
          />
        )}

        {stage === "duplicate_warning" && shot && (
          <DuplicateWarningStage
            shot={shot}
            onDiscard={retake}
            onKeep={() => setStage("review")}
          />
        )}

        {stage === "review" && shot && (
          <ReviewStage
            shot={shot}
            fields={fields}
            items={items}
            isProcessing={isProcessing}
            onRetake={retake}
            onSave={save}
            onEditField={(key, value) =>
              setFields((prev) => prev.map((f) => (f.key === key ? { ...f, value, confidence: 1 } : f)))
            }
            onUpdateItem={(id, updates) => 
              setItems((prev) => prev.map((i) => i.id === id ? { ...i, ...updates } : i))
            }
            onDeleteItem={(id) => setItems((prev) => prev.filter((i) => i.id !== id))}
          />
        )}

        {stage === "success" && (
          <SuccessStage onHome={() => navigate({ to: "/" })} onNext={() => navigate({ to: "/transactions" })} onCaptureAgain={retake} />
        )}

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onPick}
        />
      </div>
    </main>
  );
}

function CameraStage({
  videoRef,
  camError,
  flash,
  torch,
  onToggleTorch,
  onFlip,
  onClose,
  onCapture,
  onPickFile,
}: {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  camError: string | null;
  flash: boolean;
  torch: boolean;
  onToggleTorch: () => void;
  onFlip: () => void;
  onClose: () => void;
  onCapture: () => void;
  onPickFile: () => void;
}) {
  const [isDark, setIsDark] = useState(false);
  const [isBlurry, setIsBlurry] = useState(false);

  useEffect(() => {
    let frameId: number;
    const checkBrightness = () => {
      if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
        const canvas = document.createElement("canvas");
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          let sum = 0;
          let diffSum = 0;
          for (let i = 0; i < data.length - 4; i += 4) {
            const luma1 = (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114);
            const luma2 = (data[i+4] * 0.299 + data[i + 5] * 0.587 + data[i + 6] * 0.114);
            sum += luma1;
            diffSum += Math.abs(luma1 - luma2);
          }
          const avg = sum / (data.length / 4);
          setIsDark(avg < 60); // 60 is threshold for "dark"
          
          const sharpness = diffSum / (data.length / 4);
          setIsBlurry(sharpness > 0 && sharpness < 8); // 8 is empirical threshold for blurriness
        }
      }
      frameId = requestAnimationFrame(checkBrightness);
    };
    frameId = requestAnimationFrame(checkBrightness);
    return () => cancelAnimationFrame(frameId);
  }, [videoRef]);

  return (
    <div className="relative flex h-full w-full flex-col">
      {/* Video */}
      <video
        ref={videoRef}
        playsInline
        muted
        className="absolute inset-0 h-full w-full object-cover"
      />
      
      {camError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-[#1f3446] to-[#0b1a26] p-8 text-center z-20">
          <div>
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-white">
              <ScanLine className="h-7 w-7" />
            </div>
            <p className="font-display text-[16px] font-semibold text-white">Camera chưa sẵn sàng</p>
            <p className="mt-1.5 font-sans text-[13px] leading-snug text-white/70">{camError}</p>
            <button
              type="button"
              onClick={onPickFile}
              className="mt-5 rounded-full bg-white px-5 py-2.5 font-sans text-[13px] font-semibold text-foreground shadow-md active:scale-95 transition"
            >
              Chọn ảnh từ thư viện
            </button>
          </div>
        </div>
      )}

      {/* Flash overlay */}
      <div
        className={`pointer-events-none absolute inset-0 bg-white transition-opacity duration-150 z-20 ${
          flash ? "opacity-90" : "opacity-0"
        }`}
      />

      {/* Guide frame & Dimmer */}
      <div className="absolute inset-0 pointer-events-none z-10 flex flex-col">
        {/* Top bar */}
        <div className="flex shrink-0 items-center justify-between px-5 pt-[max(env(safe-area-inset-top),24px)] sm:pt-6 pb-4 bg-black/40">
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 pointer-events-auto items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md active:scale-95"
          >
            <X className="h-5 w-5" strokeWidth={2.4} />
          </button>
          
          <button
            type="button"
            onClick={onFlip}
            className="flex h-10 w-10 pointer-events-auto items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md active:scale-95"
          >
            <RotateCcw className="h-4 w-4" strokeWidth={2.4} />
          </button>
        </div>

        {/* Middle area with transparent cutout */}
        <div className="flex-1 flex overflow-hidden">
          <div className="w-8 bg-black/40 shrink-0" />
          <div className="flex-1 relative flex flex-col justify-center">
            {/* The transparent cutout area */}
            <div className="w-full h-[65%] border-[1.5px] border-white/20 rounded-xl relative">
              <FrameCorner className="left-0 top-0" />
              <FrameCorner className="right-0 top-0 rotate-90" />
              <FrameCorner className="right-0 bottom-0 rotate-180" />
              <FrameCorner className="left-0 bottom-0 -rotate-90" />
              
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center">
                <span className="font-sans text-[13px] font-semibold text-white/60 tracking-wide uppercase drop-shadow-md">
                  Đưa toàn bộ hóa đơn vào khung
                </span>
              </div>
            </div>
            
            {/* Top/Bottom masks for the middle column */}
            <div className="absolute top-0 inset-x-0 h-[17.5%] bg-black/40" />
            <div className="absolute bottom-0 inset-x-0 h-[17.5%] bg-black/40" />
          </div>
          <div className="w-8 bg-black/40 shrink-0" />
        </div>

        {/* Badges floating above mask */}
        <div className="absolute top-[20%] inset-x-0 flex flex-col items-center gap-2 pointer-events-none transition-opacity duration-300">
          {isBlurry ? (
            <div className="flex items-center gap-1.5 rounded-full bg-red-500/90 px-3 py-1.5 shadow-lg backdrop-blur text-white animate-in slide-in-from-top-2">
              <AlertTriangle className="h-3.5 w-3.5" strokeWidth={2.5} />
              <span className="font-sans text-[11px] font-bold">Ảnh bị mờ — Giữ chặt tay</span>
            </div>
          ) : isDark && !torch ? (
            <div className="flex items-center gap-1.5 rounded-full bg-amber-400/90 px-3 py-1.5 shadow-lg backdrop-blur text-amber-950 animate-in slide-in-from-top-2">
              <Lightbulb className="h-3.5 w-3.5" strokeWidth={2.5} />
              <span className="font-sans text-[11px] font-bold">Thiếu sáng — Bật đèn</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 shadow-lg backdrop-blur text-white/90">
              <Smartphone className="h-3.5 w-3.5" strokeWidth={2.5} />
              <span className="font-sans text-[11px] font-bold">Giữ máy thẳng</span>
            </div>
          )}
        </div>

      </div>

      {/* Bottom controls */}
      <div className="relative z-20 shrink-0 bg-black px-8 pb-[max(env(safe-area-inset-bottom),32px)] sm:pb-8 pt-2">
        {/* Mode carousel */}
        <div className="mb-4 flex justify-center">
          <div className="flex gap-4">
            <button className="rounded-full bg-white px-4 py-1.5 font-sans text-[13px] font-bold text-black transition">Hoá đơn</button>
            <button className="rounded-full px-4 py-1.5 font-sans text-[13px] font-bold text-white/50 transition active:bg-white/10">Món đồ</button>
            <button className="rounded-full px-4 py-1.5 font-sans text-[13px] font-bold text-white/50 transition active:bg-white/10">Chuyến đi</button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onPickFile}
            className="flex h-12 w-12 flex-col items-center justify-center text-white/80 active:scale-95 transition"
          >
            <ImageIcon className="h-6 w-6 mb-1" strokeWidth={2} />
            <span className="text-[10px] font-medium uppercase">Thư viện</span>
          </button>

          <button
            type="button"
            onClick={onCapture}
            className="flex h-[76px] w-[76px] items-center justify-center rounded-full bg-white/20 backdrop-blur-md ring-4 ring-white/30 active:scale-95 transition-transform"
          >
            <span className="flex h-[60px] w-[60px] items-center justify-center rounded-full bg-white shadow-lg" />
          </button>

          <button
            type="button"
            onClick={onToggleTorch}
            className="flex h-12 w-12 flex-col items-center justify-center text-white/80 active:scale-95 transition"
          >
            {torch ? <Zap className="h-6 w-6 mb-1 text-amber-400" strokeWidth={2} /> : <ZapOff className="h-6 w-6 mb-1" strokeWidth={2} />}
            <span className={`text-[10px] font-medium uppercase ${torch ? "text-amber-400" : ""}`}>Đèn flash</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function FrameCorner({ className = "" }: { className?: string }) {
  return (
    <span
      className={`absolute h-8 w-8 border-t-[4px] border-l-[4px] border-white shadow-sm ${className}`}
      style={{ borderTopLeftRadius: 12 }}
    />
  );
}

function ProcessingStage({ shot }: { shot: string | null }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 800);
    const t2 = setTimeout(() => setStep(2), 1600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center bg-black">
      {shot && (
        <img
          src={shot}
          alt="Đang xử lý"
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black/90" />
      
      <div className="relative z-10 flex w-full max-w-[280px] flex-col items-start px-4">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20">
          <Sparkles className="h-6 w-6 text-[#FFB4A2]" />
        </div>
        
        <p className="font-display text-[22px] font-bold text-white mb-6">AI đang xử lý...</p>
        
        <div className="space-y-4 w-full">
          <StepRow label="Đọc chữ trên hóa đơn" done={step >= 1} active={step === 0} />
          <StepRow label="Nhận diện cửa hàng & số tiền" done={step >= 2} active={step === 1} />
          <StepRow label="Phân loại chi tiêu tự động" done={false} active={step === 2} />
        </div>
      </div>
    </div>
  );
}

function StepRow({ label, done, active }: { label: string; done: boolean; active: boolean }) {
  return (
    <div className={`flex items-center gap-3 transition-opacity duration-300 ${done || active ? "opacity-100" : "opacity-40"}`}>
      <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
        done ? "bg-[#16a34a] border-[#16a34a] text-white" : 
        active ? "border-white border-t-[#FFB4A2] animate-spin" : 
        "border-white/30 text-transparent"
      }`}>
        {done && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
      </div>
      <span className={`font-sans text-[13px] font-semibold ${done ? "text-white" : "text-white/80"}`}>
        {label}
      </span>
    </div>
  );
}

function ErrorState({ 
  shot, title, desc, icon, onRetry, onRetake, retryLabel = "Thử lại" 
}: { 
  shot: string | null; title: string; desc: string; icon: React.ReactNode; 
  onRetry: () => void; onRetake: () => void; retryLabel?: string;
}) {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center bg-black px-6">
      {shot && <img src={shot} className="absolute inset-0 h-full w-full object-cover opacity-30 blur-sm" />}
      <div className="absolute inset-0 bg-black/60" />
      
      <div className="relative z-10 w-full max-w-[300px] rounded-[32px] bg-white p-6 text-center shadow-2xl">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100">
          <div className="text-rose-600">{icon}</div>
        </div>
        <h3 className="font-display text-[20px] font-bold text-foreground">{title}</h3>
        <p className="mt-2 font-sans text-[13px] text-foreground/60 leading-relaxed">{desc}</p>
        
        <div className="mt-6 flex flex-col gap-2">
          <button
            onClick={onRetry}
            className="w-full rounded-2xl bg-foreground py-3.5 font-sans text-[14px] font-bold text-background active:scale-[0.98] transition"
          >
            {retryLabel}
          </button>
          <button
            onClick={onRetake}
            className="w-full rounded-2xl bg-foreground/5 py-3.5 font-sans text-[14px] font-bold text-foreground active:scale-[0.98] transition"
          >
            Chụp lại ảnh khác
          </button>
        </div>
      </div>
    </div>
  );
}

function DuplicateWarningStage({ shot, onDiscard, onKeep }: { shot: string; onDiscard: () => void; onKeep: () => void }) {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center bg-black px-6">
      <img src={shot} className="absolute inset-0 h-full w-full object-cover opacity-30 blur-sm" />
      <div className="absolute inset-0 bg-black/60" />
      
      <div className="relative z-10 w-full max-w-[340px] rounded-[32px] bg-white p-6 shadow-2xl">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100">
          <AlertTriangle className="h-6 w-6 text-amber-600" />
        </div>
        <h3 className="font-display text-[20px] font-bold text-foreground text-center">Hoá đơn trùng lặp?</h3>
        <p className="mt-2 font-sans text-[13px] text-foreground/60 leading-relaxed text-center">
          Hệ thống phát hiện một giao dịch tương tự đã được lưu trước đó.
        </p>

        {/* Comparison Cards */}
        <div className="mt-5 mb-6 flex gap-2">
          <div className="flex-1 rounded-2xl bg-foreground/5 p-3 text-center border border-transparent">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-foreground/50">Giao dịch cũ</p>
            <p className="font-display text-[14px] font-bold line-clamp-1">Lotte Mart</p>
            <p className="font-display text-[15px] font-bold text-expense">160.000₫</p>
            <p className="mt-1 text-[10px] text-foreground/50">Hôm qua</p>
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-sm border border-foreground/5">
              <RotateCcw className="h-3 w-3 text-foreground/40" />
            </div>
          </div>
          <div className="flex-1 rounded-2xl bg-amber-50 p-3 text-center border border-amber-200">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-amber-700/60">Hoá đơn mới</p>
            <p className="font-display text-[14px] font-bold text-amber-950 line-clamp-1">Lotte Mart</p>
            <p className="font-display text-[15px] font-bold text-amber-950">160.000₫</p>
            <p className="mt-1 text-[10px] text-amber-700/50">Vừa xong</p>
          </div>
        </div>
        
        <div className="flex flex-col gap-2">
          <button
            onClick={onKeep}
            className="w-full rounded-2xl bg-amber-500 py-3.5 font-sans text-[14px] font-bold text-white active:scale-[0.98] transition shadow-md shadow-amber-500/20"
          >
            Vẫn tiếp tục lưu
          </button>
          <button
            onClick={onDiscard}
            className="w-full rounded-2xl bg-foreground/5 py-3.5 font-sans text-[14px] font-bold text-foreground active:scale-[0.98] transition"
          >
            Bỏ qua hoá đơn này
          </button>
        </div>
      </div>
    </div>
  );
}

function ReviewStage({
  shot,
  fields,
  items,
  isProcessing,
  onRetake,
  onSave,
  onEditField,
  onUpdateItem,
  onDeleteItem
}: {
  shot: string;
  fields: Field[];
  items: LineItem[];
  isProcessing?: boolean;
  onRetake: () => void;
  onSave: () => void;
  onEditField: (key: string, value: string) => void;
  onUpdateItem: (id: string, updates: Partial<LineItem>) => void;
  onDeleteItem: (id: string) => void;
}) {
  const [activeBox, setActiveBox] = useState<[number, number, number, number] | null>(null);

  const itemsTotal = items.reduce((s, i) => s + i.price, 0);
  const totalField = fields.find(f => f.key === "total");
  const parsedTotal = totalField ? Number(totalField.value) : 0;
  const isTotalMismatch = totalField && Math.abs(itemsTotal - parsedTotal) > 0;

  return (
    <div className="h-full w-full overflow-y-auto bg-page relative pb-28" style={{ scrollbarWidth: 'none' }}>
      {/* Header Image */}
      <div className="sticky top-0 z-20 h-[30vh] shrink-0 overflow-hidden bg-black rounded-b-[32px] shadow-md">
        <img src={shot} alt="Hoá đơn" className="h-full w-full object-cover opacity-80" />
        
        {activeBox && (
          <div 
            className="absolute border-[3px] border-yellow-400 bg-yellow-400/20 shadow-[0_0_15px_rgba(250,204,21,0.5)] transition-all duration-300"
            style={{
              left: `${activeBox[0]}%`,
              top: `${activeBox[1]}%`,
              width: `${activeBox[2]}%`,
              height: `${activeBox[3]}%`
            }}
          />
        )}

        {/* Navigation actions on top of image */}
        <div className="absolute inset-x-0 top-0 flex items-center justify-between px-5 pt-[max(env(safe-area-inset-top),16px)] sm:pt-6">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onRetake}
              className="flex h-9 items-center gap-1.5 rounded-full bg-black/60 px-3.5 font-sans text-[12px] font-semibold text-white backdrop-blur-md active:scale-95 border border-white/20 shadow-sm"
            >
              <RotateCcw className="h-3.5 w-3.5" strokeWidth={2.4} />
              Chụp lại
            </button>
            <button
              type="button"
              className="flex h-9 items-center gap-1.5 rounded-full bg-black/60 px-3.5 font-sans text-[12px] font-semibold text-white backdrop-blur-md active:scale-95 border border-white/20 shadow-sm"
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={2.4} />
              Trang tiếp
            </button>
          </div>
          
          {isProcessing ? (
             <span className="flex items-center gap-1.5 rounded-full bg-black/60 px-3 h-9 backdrop-blur-md shadow-sm border border-white/20">
               <Loader2 className="h-3.5 w-3.5 text-[#FFB4A2] animate-spin" />
               <span className="font-sans text-[10px] font-bold uppercase tracking-wider text-white">
                 Đang xử lý AI...
               </span>
             </span>
          ) : (
            <span className="flex items-center gap-1.5 rounded-full bg-[#16a34a] px-3 h-9 backdrop-blur-md shadow-sm">
              <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
              <span className="font-sans text-[10px] font-bold uppercase tracking-wider text-white">
                Đã nhận diện
              </span>
            </span>
          )}
        </div>
      </div>

      <div className="px-5 py-5">
        {/* Summary Info */}
        <div className="mb-6 space-y-3">
          {fields.map((f) => (
            <FieldRow 
              key={f.key} 
              field={f} 
              onChange={(v) => onEditField(f.key, v)} 
              onFocus={() => f.box && setActiveBox(f.box)}
              onBlur={() => setActiveBox(null)}
            />
          ))}
        </div>

        {/* Line Items */}
        <div className="mb-2 flex items-baseline justify-between">
          <h3 className="font-display text-[16px] font-bold text-foreground">Chi tiết món hàng</h3>
          <span className="font-sans text-[11px] font-semibold text-foreground/50">{items.length} món</span>
        </div>
        
        <div className="overflow-hidden rounded-[24px] border border-white/70 bg-white/80 shadow-sm backdrop-blur">
          {items.map((item, idx) => (
            <LineItemRow 
              key={item.id} 
              item={item} 
              isLast={idx === items.length - 1} 
              onChange={(updates) => onUpdateItem(item.id, updates)}
              onDelete={() => onDeleteItem(item.id)}
              onFocus={() => item.box && setActiveBox(item.box)}
              onBlur={() => setActiveBox(null)}
            />
          ))}
          
          {/* Total row */}
          <div className="bg-foreground/5 px-4 py-3 flex items-center justify-between">
            <span className="font-sans text-[13px] font-bold text-foreground">Tổng cộng (items)</span>
            <span className="font-display text-[18px] font-bold tabular-nums text-foreground">
              {formatVND(itemsTotal)}
            </span>
          </div>
        </div>
        
        {isTotalMismatch && (
          <div className="mt-2 flex items-start gap-1.5 rounded-xl bg-amber-50 p-3 text-amber-700 shadow-sm">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
            <p className="font-sans text-[12px] font-medium leading-snug">
              Tổng các món hàng không khớp với tổng tiền trên hoá đơn. Vui lòng kiểm tra lại.
            </p>
          </div>
        )}
        
        <button className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed border-foreground/15 py-3 text-[12px] font-semibold text-foreground/60 active:bg-white/50">
          <Plus className="h-4 w-4" />
          Thêm dòng thủ công
        </button>
      </div>

      {/* Bottom Sticky Action */}
      <div className="fixed bottom-0 inset-x-0 z-30 border-t border-white/60 bg-white/80 px-5 py-4 backdrop-blur-xl shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)] pb-[max(env(safe-area-inset-bottom),16px)] sm:pb-6">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onRetake}
            className="flex-1 rounded-2xl border-2 border-foreground/10 bg-transparent py-3.5 font-sans text-[13px] font-bold text-foreground/70 active:bg-foreground/5 transition px-1"
          >
            Chụp lại
          </button>
          <button
            type="button"
            onClick={() => toast.success("Đã lưu nháp")}
            className="flex-1 rounded-2xl border-2 border-foreground/10 bg-transparent py-3.5 font-sans text-[13px] font-bold text-foreground/70 active:bg-foreground/5 transition px-1"
          >
            Lưu nháp
          </button>
          <button
            type="button"
            onClick={onSave}
            className="flex-[1.5] rounded-2xl bg-[#dc2626] py-3.5 font-sans text-[14px] font-bold text-white shadow-lg shadow-rose-600/20 active:scale-[0.98] transition px-1"
          >
            Lưu chi tiêu
          </button>
        </div>
      </div>
    </div>
  );
}

function FieldRow({ field, onChange, onFocus, onBlur }: { field: Field; onChange: (v: string) => void; onFocus?: () => void; onBlur?: () => void; }) {
  const low = field.confidence < 0.85;
  return (
    <label className="block rounded-[20px] border border-white/80 bg-white/60 px-4 py-2.5 shadow-sm backdrop-blur relative group transition focus-within:bg-white focus-within:border-foreground/20">
      <div className="mb-0.5 flex items-center justify-between">
        <span className="font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-foreground/50">
          {field.label}
        </span>
        {low && (
          <span className="rounded-full bg-amber-100 px-1.5 py-0.5 font-sans text-[9px] font-bold uppercase tracking-wider text-amber-800">
            Check
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <input
          value={field.value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          className="w-full bg-transparent font-display text-[16px] font-semibold text-foreground outline-none"
        />
        <Pencil className="h-3.5 w-3.5 text-foreground/30 opacity-50 transition group-focus-within:opacity-100 group-hover:opacity-100" />
      </div>
    </label>
  );
}

function LineItemRow({ item, isLast, onChange, onDelete, onFocus, onBlur }: { item: LineItem; isLast: boolean; onChange: (u: Partial<LineItem>) => void; onDelete?: () => void; onFocus?: () => void; onBlur?: () => void; }) {
  const low = item.confidence < 0.85;
  const cat = getCategories().find((c) => c.id === item.category) || getCategories()[0];

  return (
    <div className={`p-4 relative group ${!isLast ? "border-b border-foreground/5" : ""}`}>
      {low && <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-400" />}
      
      <div className="flex items-start gap-3">
        {/* Category selector */}
        <div className="relative shrink-0">
          <Select 
            value={item.category}
            onValueChange={(val) => onChange({ category: val })}
          >
            <SelectTrigger className="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm border border-foreground/5 text-[16px] p-0 ring-0 focus:ring-0 [&>span:last-child]:hidden [&>span:first-child]:w-full [&>span:first-child]:text-center">
              <SelectValue>{cat.emoji}</SelectValue>
            </SelectTrigger>
            <SelectContent className="rounded-xl border border-white/40 bg-white/95 backdrop-blur-md shadow-lg min-w-[120px]">
              {getCategories().map(c => (
                <SelectItem key={c.id} value={c.id} className="rounded-lg">{c.emoji} {c.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Inputs */}
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex items-center gap-2">
            <input 
              value={item.name} 
              onChange={(e) => onChange({ name: e.target.value })}
              onFocus={onFocus}
              onBlur={onBlur}
              className="flex-1 bg-transparent font-sans text-[13px] font-semibold text-foreground outline-none truncate placeholder:text-foreground/30"
              placeholder="Tên món hàng..."
            />
            <Pencil className="h-3 w-3 text-foreground/30 opacity-0 group-hover:opacity-100 transition shrink-0" />
          </div>
          
          <div className="flex items-center gap-2">
            <input 
              value={item.price} 
              onChange={(e) => onChange({ price: Number(e.target.value) || 0 })}
              onFocus={onFocus}
              onBlur={onBlur}
              type="number"
              className="w-24 bg-transparent font-display text-[14px] font-bold tabular-nums text-foreground outline-none"
            />
            <span className="font-sans text-[11px] font-medium text-foreground/50">₫</span>
          </div>
        </div>
        {onDelete && (
          <button onClick={onDelete} className="ml-2 flex h-8 w-8 shrink-0 items-center justify-center text-foreground/30 hover:text-red-500 hover:bg-red-50 rounded-full transition self-center">
            <Minus className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

function PreviewStage({ shot, onRetake, onUse }: { shot: string; onRetake: () => void; onUse: () => void }) {
  return (
    <div className="relative flex h-full w-full flex-col bg-black">
      <img src={shot} alt="Preview" className="flex-1 object-contain" />
      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-6 pb-[max(env(safe-area-inset-bottom),32px)]">
        <div className="flex gap-4">
          <button
            onClick={onRetake}
            className="flex-1 rounded-2xl bg-white/20 py-4 font-sans text-[15px] font-bold text-white backdrop-blur-md active:scale-[0.98] transition"
          >
            Chụp lại
          </button>
          <button
            onClick={onUse}
            className="flex-1 rounded-2xl bg-white py-4 font-sans text-[15px] font-bold text-black active:scale-[0.98] transition shadow-lg"
          >
            Sử dụng ảnh
          </button>
        </div>
      </div>
    </div>
  );
}

function SuccessStage({ onHome, onNext, onCaptureAgain }: { onHome: () => void; onNext: () => void; onCaptureAgain: () => void }) {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center bg-black px-6">
      <div className="absolute inset-0 bg-[#F5E8DA]" />
      
      <div className="relative z-10 w-full max-w-[340px] rounded-[32px] bg-white p-6 text-center shadow-2xl animate-in zoom-in-95 duration-500">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#16a34a] shadow-lg shadow-[#16a34a]/30">
          <Check className="h-8 w-8 text-white" strokeWidth={3} />
        </div>
        <h3 className="font-display text-[22px] font-bold text-foreground">Hoàn tất!</h3>
        <p className="mt-2 font-sans text-[14px] text-foreground/60 leading-relaxed">
          Giao dịch đã được lưu vào sổ tay của bạn.
        </p>

        {/* Transaction Summary Card */}
        <div className="mt-5 mb-6 rounded-2xl border border-white/60 bg-foreground/5 p-4 text-left shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm border border-foreground/5 text-2xl">
              🍜
            </div>
            <div className="flex-1">
              <p className="font-display text-[15px] font-bold text-foreground">Haidilao</p>
              <p className="font-sans text-[12px] font-semibold text-foreground/50">Ăn uống · Vừa xong</p>
            </div>
            <p className="font-display text-[16px] font-bold text-expense">-1.240.000₫</p>
          </div>
        </div>
        
        <div className="flex flex-col gap-2">
          <button
            onClick={onNext}
            className="w-full rounded-2xl bg-foreground py-3.5 font-sans text-[14px] font-bold text-background active:scale-[0.98] transition shadow-md shadow-black/20"
          >
            Xem giao dịch
          </button>
          <button
            onClick={onCaptureAgain}
            className="w-full rounded-2xl bg-foreground/5 py-3.5 font-sans text-[14px] font-bold text-foreground active:scale-[0.98] transition border border-foreground/5"
          >
            Quét thêm hoá đơn
          </button>
          <button
            onClick={onHome}
            className="w-full rounded-2xl bg-transparent py-3.5 font-sans text-[14px] font-bold text-foreground/60 active:scale-[0.98] transition"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
}

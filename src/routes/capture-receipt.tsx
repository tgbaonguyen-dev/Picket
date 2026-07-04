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
} from "lucide-react";
import { toast } from "sonner";
import { BottomNav } from "@/components/phone-frame";

export const Route = createFileRoute("/capture-receipt")({
  component: CaptureReceiptPage,
});

type Stage = "camera" | "processing" | "review";

type Field = { key: string; label: string; value: string; confidence: number };

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
  const [fields, setFields] = useState<Field[]>([]);

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
    startProcessing();
  }

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setShot(reader.result as string);
      startProcessing();
    };
    reader.readAsDataURL(file);
  }

  function startProcessing() {
    setStage("processing");
    setTimeout(() => {
      setFields([
        { key: "merchant", label: "Cửa hàng", value: "Highlands Coffee", confidence: 0.96 },
        { key: "date", label: "Ngày", value: "04/07/2026 · 14:32", confidence: 0.93 },
        { key: "total", label: "Tổng cộng", value: "185.000 ₫", confidence: 0.98 },
        { key: "category", label: "Danh mục", value: "Ăn uống", confidence: 0.72 },
        { key: "payment", label: "Thanh toán", value: "Thẻ · ****4821", confidence: 0.81 },
      ]);
      setStage("review");
    }, 1600);
  }

  function retake() {
    setShot(null);
    setFields([]);
    setStage("camera");
  }

  function save() {
    toast.success("Đã lưu hoá đơn");
    navigate({ to: "/expenses" });
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

        {stage === "processing" && <ProcessingStage shot={shot} />}

        {stage === "review" && shot && (
          <ReviewStage
            shot={shot}
            fields={fields}
            onRetake={retake}
            onSave={save}
            onEdit={(key, value) =>
              setFields((prev) => prev.map((f) => (f.key === key ? { ...f, value, confidence: 1 } : f)))
            }
          />
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
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-[#1f3446] to-[#0b1a26] p-8 text-center">
          <div>
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-white">
              <ScanLine className="h-7 w-7" />
            </div>
            <p className="font-display text-[16px] font-semibold text-white">Camera chưa sẵn sàng</p>
            <p className="mt-1.5 font-sans text-[13px] leading-snug text-white/70">{camError}</p>
            <button
              type="button"
              onClick={onPickFile}
              className="mt-5 rounded-full bg-white px-5 py-2.5 font-sans text-[13px] font-semibold text-foreground shadow-md"
            >
              Chọn ảnh từ thư viện
            </button>
          </div>
        </div>
      )}

      {/* Flash overlay */}
      <div
        className={`pointer-events-none absolute inset-0 bg-white transition-opacity duration-150 ${
          flash ? "opacity-90" : "opacity-0"
        }`}
      />

      {/* Top bar */}
      <div className="relative z-10 flex shrink-0 items-center justify-between px-5 pt-6 pb-3">
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md active:scale-95"
        >
          <X className="h-5 w-5" strokeWidth={2.4} />
        </button>
        <div className="flex items-center gap-2 rounded-full bg-black/40 px-3 py-1.5 backdrop-blur-md">
          <span className="flex h-2 w-2 rounded-full bg-[#FFB4A2]" />
          <span className="font-sans text-[11px] font-semibold uppercase tracking-wider text-white">
            Hoá đơn
          </span>
        </div>
        <button
          type="button"
          onClick={onToggleTorch}
          aria-label="Đèn flash"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md active:scale-95"
        >
          {torch ? <Zap className="h-5 w-5 text-amber-300" strokeWidth={2.4} /> : <ZapOff className="h-5 w-5" strokeWidth={2.4} />}
        </button>
      </div>

      {/* Guide frame */}
      <div className="relative z-10 flex flex-1 items-center justify-center px-8">
        <div className="relative aspect-[3/4] w-full max-w-[280px]">
          <FrameCorner className="left-0 top-0" />
          <FrameCorner className="right-0 top-0 rotate-90" />
          <FrameCorner className="right-0 bottom-0 rotate-180" />
          <FrameCorner className="left-0 bottom-0 -rotate-90" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/50 px-3 py-1.5 backdrop-blur-md">
            <p className="font-sans text-[11px] font-medium text-white/90">Đưa hoá đơn vào khung</p>
          </div>
        </div>
      </div>

      {/* Bottom controls */}
      <div className="relative z-10 shrink-0 bg-gradient-to-t from-black/70 to-transparent px-6 pb-8 pt-6">
        <div className="mb-4 flex items-center justify-center gap-1.5">
          <span className="rounded-full bg-white px-3 py-1 font-sans text-[11px] font-bold text-foreground">
            Hoá đơn
          </span>
          <span className="rounded-full bg-white/15 px-3 py-1 font-sans text-[11px] font-medium text-white/80">
            Món đồ
          </span>
          <span className="rounded-full bg-white/15 px-3 py-1 font-sans text-[11px] font-medium text-white/80">
            Tài liệu
          </span>
        </div>
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onPickFile}
            aria-label="Thư viện"
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur-md active:scale-95"
          >
            <ImageIcon className="h-5 w-5" strokeWidth={2.2} />
          </button>

          <button
            type="button"
            onClick={onCapture}
            aria-label="Chụp"
            className="flex h-[74px] w-[74px] items-center justify-center rounded-full bg-white/25 backdrop-blur-md ring-4 ring-white/40 active:scale-95"
          >
            <span className="flex h-[58px] w-[58px] items-center justify-center rounded-full bg-white shadow-lg">
              <ScanLine className="h-6 w-6 text-foreground" strokeWidth={2.4} />
            </span>
          </button>

          <button
            type="button"
            onClick={onFlip}
            aria-label="Đổi camera"
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur-md active:scale-95"
          >
            <RotateCcw className="h-5 w-5" strokeWidth={2.2} />
          </button>
        </div>
        <p className="mt-4 text-center font-sans text-[11px] text-white/60">
          OCR tự động đọc số tiền, cửa hàng và ngày
        </p>
      </div>
    </div>
  );
}

function FrameCorner({ className = "" }: { className?: string }) {
  return (
    <span
      className={`absolute h-8 w-8 border-t-[3px] border-l-[3px] border-white/90 ${className}`}
      style={{ borderTopLeftRadius: 10 }}
    />
  );
}

function ProcessingStage({ shot }: { shot: string | null }) {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center bg-black">
      {shot && (
        <img
          src={shot}
          alt="Đang xử lý"
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/85" />
      <div className="relative z-10 flex flex-col items-center px-10 text-center">
        <div className="relative">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10 backdrop-blur-xl">
            <Sparkles className="h-7 w-7 text-white" />
          </div>
          <Loader2 className="absolute -right-2 -top-2 h-5 w-5 animate-spin text-white" />
        </div>
        <p className="mt-5 font-display text-[18px] font-bold text-white">Đang đọc hoá đơn…</p>
        <p className="mt-1.5 font-sans text-[13px] leading-snug text-white/70">
          AI đang trích xuất cửa hàng, ngày và tổng tiền
        </p>
        <div className="mt-6 h-1 w-40 overflow-hidden rounded-full bg-white/15">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-white" />
        </div>
      </div>
    </div>
  );
}

function ReviewStage({
  shot,
  fields,
  onRetake,
  onSave,
  onEdit,
}: {
  shot: string;
  fields: Field[];
  onRetake: () => void;
  onSave: () => void;
  onEdit: (key: string, value: string) => void;
}) {
  return (
    <div className="flex h-full w-full flex-col bg-[#FFF8F0]">
      <div className="relative h-[38%] shrink-0 overflow-hidden bg-black">
        <img src={shot} alt="Hoá đơn" className="h-full w-full object-cover" />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between px-5 pt-6">
          <button
            type="button"
            onClick={onRetake}
            className="flex h-10 items-center gap-1.5 rounded-full bg-black/50 px-3.5 font-sans text-[12px] font-semibold text-white backdrop-blur-md active:scale-95"
          >
            <RotateCcw className="h-3.5 w-3.5" strokeWidth={2.6} />
            Chụp lại
          </button>
          <span className="flex items-center gap-1.5 rounded-full bg-[#FFB4A2]/90 px-3 py-1.5 backdrop-blur-md">
            <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
            <span className="font-sans text-[11px] font-bold uppercase tracking-wider text-white">
              Đã nhận diện
            </span>
          </span>
        </div>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-5 pb-4 pt-8">
          <p className="font-sans text-[11px] font-bold uppercase tracking-[0.16em] text-white/70">
            Xem trước
          </p>
          <p className="font-display text-[18px] font-bold text-white">Xác nhận thông tin</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pt-5">
        <div className="mb-3 flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50/80 px-3 py-2.5">
          <FileText className="h-4 w-4 shrink-0 text-amber-700" strokeWidth={2.4} />
          <p className="font-sans text-[11.5px] leading-snug text-amber-900">
            Kiểm tra các trường có độ tin cậy thấp trước khi lưu.
          </p>
        </div>
        <div className="space-y-2">
          {fields.map((f) => (
            <FieldRow key={f.key} field={f} onChange={(v) => onEdit(f.key, v)} />
          ))}
        </div>
      </div>

      <div className="shrink-0 border-t border-white/60 bg-white/70 px-5 py-4 backdrop-blur-md">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onRetake}
            className="flex-1 rounded-2xl border border-foreground/10 bg-white py-3 font-sans text-[13px] font-semibold text-foreground/75 active:scale-[0.99]"
          >
            Huỷ
          </button>
          <button
            type="button"
            onClick={onSave}
            className="flex-[1.6] rounded-2xl bg-gradient-to-br from-[#B5828C] to-[#1e4a63] py-3 font-sans text-[13px] font-bold text-white shadow-lg active:scale-[0.99]"
          >
            Lưu hoá đơn
          </button>
        </div>
      </div>
    </div>
  );
}

function FieldRow({ field, onChange }: { field: Field; onChange: (v: string) => void }) {
  const low = field.confidence < 0.85;
  return (
    <label className="block rounded-2xl border border-white bg-white p-3 shadow-[0_4px_14px_-8px_rgba(46,107,138,0.25)]">
      <div className="mb-1 flex items-center justify-between">
        <span className="font-sans text-[10.5px] font-bold uppercase tracking-[0.14em] text-foreground/55">
          {field.label}
        </span>
        <span
          className={`rounded-full px-1.5 py-0.5 font-sans text-[9.5px] font-bold uppercase tracking-wider ${
            low ? "bg-amber-100 text-amber-800" : "bg-[#FFE4D2] text-[#8F5F68]"
          }`}
        >
          {Math.round(field.confidence * 100)}%
        </span>
      </div>
      <input
        value={field.value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent font-display text-[15px] font-semibold text-foreground outline-none"
      />
    </label>
  );
}

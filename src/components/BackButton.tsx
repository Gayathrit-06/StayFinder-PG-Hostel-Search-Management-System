import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export function BackButton() {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(-1)}
      className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
    >
      <ArrowLeft className="w-4 h-4" />
      <span className="text-sm font-medium">Back</span>
    </button>
  );
}

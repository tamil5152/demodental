import {
  Activity, Baby, Heart, ShieldCheck, Smile, Sparkles, Wrench, Zap, type LucideIcon,
} from "lucide-react";
import type { Service } from "@/lib/clinic";

const map: Record<Service["icon"], LucideIcon> = {
  sparkles: Sparkles,
  shield: ShieldCheck,
  smile: Smile,
  wrench: Wrench,
  baby: Baby,
  zap: Zap,
  activity: Activity,
  heart: Heart,
};

export function ServiceIcon({ name, className }: { name: Service["icon"]; className?: string }) {
  const Icon = map[name];
  return <Icon aria-hidden className={className} />;
}

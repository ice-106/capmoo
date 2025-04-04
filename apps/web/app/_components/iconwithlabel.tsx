import { LucideIcon } from "lucide-react";

interface IconWithLabelProps {
  icon: LucideIcon;
  label: string;
  size?: number;
}
const IconWithLabel = ({
  icon: Icon,
  label,
  size = 24,
}: IconWithLabelProps) => {
  return (
    <div className="flex items-center gap-2">
      <Icon size={size} />
      {}
      <span className="text-sm font-thin">{label}</span>
    </div>
  );
};
export default IconWithLabel;

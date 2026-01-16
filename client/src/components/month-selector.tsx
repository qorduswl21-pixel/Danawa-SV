import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "lucide-react";

interface MonthSelectorProps {
  value: string;
  onChange: (value: string) => void;
  availableMonths: string[];
  isLoading?: boolean;
}

export function MonthSelector({ value, onChange, availableMonths, isLoading }: MonthSelectorProps) {
  const formatMonth = (month: string) => {
    const [year, monthNum] = month.split("-");
    return `${year}년 ${parseInt(monthNum)}월`;
  };

  return (
    <div className="flex items-center gap-2">
      <Calendar className="h-4 w-4 text-muted-foreground" />
      <Select value={value} onValueChange={onChange} disabled={isLoading}>
        <SelectTrigger className="w-[160px]" data-testid="select-month">
          <SelectValue placeholder={isLoading ? "로딩 중..." : "월 선택"} />
        </SelectTrigger>
        <SelectContent>
          {availableMonths.map((month) => (
            <SelectItem key={month} value={month} data-testid={`option-month-${month}`}>
              {formatMonth(month)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

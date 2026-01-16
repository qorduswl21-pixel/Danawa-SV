import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Filter, SlidersHorizontal } from "lucide-react";

interface FilterControlsProps {
  minSales: number;
  onMinSalesChange: (value: number) => void;
  excludeNewEntries: boolean;
  onExcludeNewEntriesChange: (value: boolean) => void;
}

export function FilterControls({
  minSales,
  onMinSalesChange,
  excludeNewEntries,
  onExcludeNewEntriesChange,
}: FilterControlsProps) {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("ko-KR").format(num);
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">필터</span>
        </div>

        <div className="space-y-5">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="min-sales" className="text-sm text-muted-foreground">
                최소 판매량
              </Label>
              <span className="text-sm font-medium tabular-nums">
                {formatNumber(minSales)}대 이상
              </span>
            </div>
            <Slider
              id="min-sales"
              value={[minSales]}
              onValueChange={([value]) => onMinSalesChange(value)}
              min={0}
              max={2000}
              step={50}
              data-testid="slider-min-sales"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="exclude-new"
              checked={excludeNewEntries}
              onCheckedChange={(checked) => onExcludeNewEntriesChange(checked === true)}
              data-testid="checkbox-exclude-new"
            />
            <Label
              htmlFor="exclude-new"
              className="text-sm text-muted-foreground cursor-pointer"
            >
              신규 진입 모델 제외
            </Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

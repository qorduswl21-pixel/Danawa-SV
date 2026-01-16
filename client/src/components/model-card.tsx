import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, TrendingUp, TrendingDown, Minus, ArrowUp, ArrowDown, Sparkles } from "lucide-react";
import type { CarModel } from "@shared/schema";

interface ModelCardProps {
  model: CarModel;
  displayRank: number;
}

export function ModelCard({ model, displayRank }: ModelCardProps) {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("ko-KR").format(num);
  };

  const formatPercent = (num: number) => {
    const sign = num > 0 ? "+" : "";
    return `${sign}${(num * 100).toFixed(1)}%`;
  };

  const getRankIcon = () => {
    if (model.rankChange > 0) {
      return <ArrowUp className="h-3.5 w-3.5 text-green-500" />;
    } else if (model.rankChange < 0) {
      return <ArrowDown className="h-3.5 w-3.5 text-red-500" />;
    }
    return <Minus className="h-3.5 w-3.5 text-muted-foreground" />;
  };

  const getTrendIcon = () => {
    if (model.momAbs > 0) {
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    } else if (model.momAbs < 0) {
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    }
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <Card className="hover-elevate transition-all duration-200" data-testid={`card-model-${model.id}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="flex flex-col items-center justify-center min-w-[48px]">
            <div className="text-2xl font-bold text-primary">{displayRank}</div>
            <div className="flex items-center gap-0.5 text-xs text-muted-foreground">
              {getRankIcon()}
              <span className={model.rankChange > 0 ? "text-green-500" : model.rankChange < 0 ? "text-red-500" : ""}>
                {model.rankChange !== 0 && Math.abs(model.rankChange)}
              </span>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-xs font-medium text-muted-foreground">{model.brand}</span>
              {model.isNewEntry && (
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                  <Sparkles className="h-2.5 w-2.5 mr-0.5" />
                  신규
                </Badge>
              )}
            </div>
            <h3 className="font-semibold text-base truncate" title={model.name}>
              {model.name}
            </h3>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <div className="flex items-center gap-1.5">
                {getTrendIcon()}
                <span className="text-sm font-medium">{formatNumber(model.sales)}대</span>
              </div>
              <div className="flex gap-2 text-xs">
                <span className={model.momAbs > 0 ? "text-green-600 dark:text-green-400 font-medium" : model.momAbs < 0 ? "text-red-600 dark:text-red-400" : "text-muted-foreground"}>
                  {model.momAbs > 0 && "+"}{formatNumber(model.momAbs)}대
                </span>
                <span className={model.momPct > 0 ? "text-green-600 dark:text-green-400" : model.momPct < 0 ? "text-red-600 dark:text-red-400" : "text-muted-foreground"}>
                  ({formatPercent(model.momPct)})
                </span>
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            asChild
            className="shrink-0"
            data-testid={`button-danawa-${model.id}`}
          >
            <a href={model.danawaUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
              원문
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

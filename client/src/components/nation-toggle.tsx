import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Car, Globe } from "lucide-react";
import type { Nation } from "@shared/schema";

interface NationToggleProps {
  value: Nation;
  onChange: (value: Nation) => void;
}

export function NationToggle({ value, onChange }: NationToggleProps) {
  return (
    <Tabs value={value} onValueChange={(v) => onChange(v as Nation)}>
      <TabsList>
        <TabsTrigger value="domestic" data-testid="tab-domestic" className="gap-1.5">
          <Car className="h-4 w-4" />
          <span>국산</span>
        </TabsTrigger>
        <TabsTrigger value="export" data-testid="tab-export" className="gap-1.5">
          <Globe className="h-4 w-4" />
          <span>수입</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}

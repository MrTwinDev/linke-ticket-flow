
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: number;
  titleClassName?: string;
}

export function StatCard({ title, value, titleClassName }: StatCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-center">
          <p className={`text-sm font-medium ${titleClassName || "text-gray-500"}`}>{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

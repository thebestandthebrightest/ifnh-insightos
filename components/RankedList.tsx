interface RankedListItem {
  label: string;
  value: number; // 0–1
  count?: number;
  color?: string;
}

interface RankedListProps {
  items: RankedListItem[];
  formatValue?: (v: number) => string;
  showRank?: boolean;
}

const DEFAULT_COLORS = ["#7A8F7A", "#C8A96E", "#7B9BB5", "#C5705A", "#8B9E8B", "#9BACC8"];

export function RankedList({ items, formatValue, showRank = true }: RankedListProps) {
  const fmt = formatValue ?? ((v) => `${(v * 100).toFixed(0)}%`);

  return (
    <div className="space-y-0">
      {items.map((item, i) => {
        const color = item.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length];
        const barWidth = Math.round(item.value * 100);

        return (
          <div
            key={item.label}
            className="flex items-center gap-3 py-2.5 border-b"
            style={{ borderColor: "var(--divider)" }}
          >
            {showRank && (
              <div
                className="font-serif text-base leading-none shrink-0 w-5 text-right"
                style={{ color }}
              >
                {i + 1}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div
                className="text-[0.87rem] font-medium mb-1.5 truncate"
                style={{ color: "var(--text)" }}
              >
                {item.label}
              </div>
              <div
                className="h-[2px] rounded"
                style={{ background: "var(--divider)" }}
              >
                <div
                  className="h-[2px] rounded transition-all"
                  style={{ width: `${barWidth}%`, background: color, opacity: 0.8 }}
                />
              </div>
            </div>
            <div
              className="text-[0.78rem] shrink-0 text-right min-w-[64px]"
              style={{ color: "var(--text-muted)" }}
            >
              {fmt(item.value)}
              {item.count !== undefined && (
                <span style={{ color: "var(--text-light)" }}>&nbsp;(n={item.count})</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

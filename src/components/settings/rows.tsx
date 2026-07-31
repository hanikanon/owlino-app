import React from "react";
import { motion } from "framer-motion";
import type { ComponentType, ReactNode } from "react";
import { Check } from "lucide-react";

import { SettingItem } from "./SettingItem";
import { Toggle } from "./Toggle";

type IconType = ComponentType<{
  className?: string;
  size?: number;
  strokeWidth?: number;
}>;

export const RowToggle = React.memo(
  function RowToggle({
    icon: Icon,
    label,
    description,
    checked,
    onChange,
    last,
    trailing,
  }: {
    icon: IconType;
    label: string;
    description?: string;
    checked: boolean;
    onChange: (v: boolean) => void;
    last?: boolean;
    trailing?: ReactNode;
  }) {
    return (
      <SettingItem
        icon={Icon}
        label={label}
        description={description}
        showArrow={false}
        last={last}
        onClick={() => onChange(!checked)}
        trailing={
          <div className="flex items-center gap-1.5">
            {trailing}
            <Toggle checked={checked} onChange={onChange} label={label} />
          </div>
        }
      />
    );
  },
  (prev, next) =>
    prev.checked === next.checked &&
    prev.label === next.label &&
    prev.description === next.description &&
    prev.last === next.last &&
    prev.icon === next.icon,
);

export const RowChoice = React.memo(
  function RowChoice<T extends string>({
    icon: Icon,
    label,
    description,
    value,
    options,
    onChange,
    last,
  }: {
    icon: IconType;
    label: string;
    description?: string;
    value: T;
    options: { value: T; label: string }[];
    onChange: (v: T) => void;
    last?: boolean;
  }) {
    const current = options.find((o) => o.value === value)?.label ?? String(value);

    return (
      <SettingItem
        icon={Icon}
        label={label}
        description={description}
        last={last}
        trailing={current}
        showArrow
        onClick={() => {
          const i = options.findIndex((o) => o.value === value);
          const nextOption = options[(i + 1) % options.length];
          if (nextOption) onChange(nextOption.value);
        }}
      />
    );
  },
  (prev, next) =>
    prev.value === next.value &&
    prev.label === next.label &&
    prev.description === next.description &&
    prev.last === next.last &&
    prev.icon === next.icon &&
    prev.options === next.options,
);

export const RadioList = React.memo(
  function RadioList<T extends string>({
    value,
    options,
    onChange,
  }: {
    value: T;
    options: { value: T; label: string; description?: string }[];
    onChange: (v: T) => void;
  }) {
    return (
      <>
        {options.map((o, i) => (
          <div
            key={o.value}
            role="button"
            tabIndex={0}
            
            onClick={() => onChange(o.value)}
            className={[
              "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors cursor-pointer",
              "hover:bg-[color-mix(in_oklab,var(--foreground)_4%,transparent)]",
              "press",
              i !== options.length - 1 ? "border-b border-border/40" : "",
            ].join(" ")}
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-[15px] font-medium leading-tight text-foreground">
                {o.label}
              </p>
              {o.description && (
                <p className="mt-0.5 truncate text-[12.5px] text-muted-foreground">
                  {o.description}
                </p>
              )}
            </div>

            {value === o.value ? (
              <span
                className="flex h-5 w-5 items-center justify-center rounded-full"
                style={{
                  background: "var(--primary)",
                  color: "var(--primary-foreground)",
                }}
              >
                <Check size={13} strokeWidth={3} />
              </span>
            ) : (
              <span
                className="h-5 w-5 rounded-full border"
                style={{
                  borderColor: "color-mix(in oklab, var(--foreground) 20%, transparent)",
                }}
              />
            )}
          </div>
        ))}
      </>
    );
  },
  (prev, next) => prev.value === next.value && prev.options === next.options,
);

export const InfoRow = React.memo(function InfoRow({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between border-b border-border px-4 py-3 last:border-b-0">
      <span className="text-[13px] text-muted-foreground">{label}</span>
      <span className="text-[14px] font-medium text-foreground">{value}</span>
    </div>
  );
});

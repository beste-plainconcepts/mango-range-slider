'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { useRange } from '@/components/range/hooks/useRange';
import { RANGE_VARIANTS } from '@/types/range';
import { sortedUniqueValues, valueToPercent } from '@/utils/range';

import { RangeLabel } from './components/RangeLabel';
import { RangeThumb } from './components/RangeThumb';
import { RangeTrack } from './components/RangeTrack';

type ContinuousRangeProps = {
  variant?: typeof RANGE_VARIANTS.CONTINUOUS;
  min: number;
  max: number;
};

type FixedRangeProps = {
  variant: typeof RANGE_VARIANTS.FIXED;
  values: number[];
};

type RangeProps = ContinuousRangeProps | FixedRangeProps;

const currencyFormatter = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
});

const labelTitleClassName = 'text-[10px] font-medium uppercase tracking-[0.28em] text-[#8c8579]';
const minLabelControlClassName =
  'w-24 rounded-none border-0 border-b border-[#111111] bg-transparent px-0 py-1 text-left text-lg font-light text-[#111111]';
const maxLabelControlClassName =
  'w-24 rounded-none border-0 border-b border-[#111111] bg-transparent px-0 py-1 text-right text-lg font-light text-[#111111]';

export function Range(props: RangeProps) {
  const isFixed = props.variant === RANGE_VARIANTS.FIXED;
  const rawValues = isFixed ? props.values : undefined;
  const fixedValues = useMemo(() => (rawValues ? sortedUniqueValues(rawValues) : undefined), [rawValues]);
  const absoluteMin = isFixed ? (fixedValues![0] ?? 0) : props.min;
  const absoluteMax = isFixed ? (fixedValues![fixedValues!.length - 1] ?? 0) : props.max;
  const formatValue = (value: number) => currencyFormatter.format(value);
  const [currentMinLimit, setCurrentMinLimit] = useState(absoluteMin);
  const [currentMaxLimit, setCurrentMaxLimit] = useState(absoluteMax);
  const previousLimitsRef = useRef({ min: currentMinLimit, max: currentMaxLimit });

  const effectiveMin = isFixed ? absoluteMin : currentMinLimit;
  const effectiveMax = isFixed ? absoluteMax : currentMaxLimit;

  const {
    trackRef,
    minValue,
    maxValue,
    minPercent,
    maxPercent,
    isDraggingMin,
    isDraggingMax,
    setRangeValues,
    onTrackPointerDown,
    onThumbPointerDown,
    onThumbKeyDown,
  } = useRange({
    minLimit: effectiveMin,
    maxLimit: effectiveMax,
    initialMin: effectiveMin,
    initialMax: effectiveMax,
    fixedValues,
  });

  const handleMinCommitAction = (nextMin: number) => {
    if (isFixed) return;
    const boundedMin = Math.min(Math.max(nextMin, absoluteMin), absoluteMax);
    setCurrentMinLimit(boundedMin);
    if (currentMaxLimit < boundedMin) {
      setCurrentMaxLimit(boundedMin);
    }
  };

  const handleMaxCommitAction = (nextMax: number) => {
    if (isFixed) return;
    const boundedMax = Math.max(Math.min(nextMax, absoluteMax), absoluteMin);
    setCurrentMaxLimit(boundedMax);
    if (currentMinLimit > boundedMax) {
      setCurrentMinLimit(boundedMax);
    }
  };

  useEffect(() => {
    if (isFixed) return;
    if (previousLimitsRef.current.min === currentMinLimit && previousLimitsRef.current.max === currentMaxLimit) {
      return;
    }

    previousLimitsRef.current = { min: currentMinLimit, max: currentMaxLimit };
    setRangeValues(currentMinLimit, currentMaxLimit);
  }, [isFixed, currentMinLimit, currentMaxLimit, setRangeValues]);

  return (
    <div className="w-full">
      <RangeTrack
        trackRef={trackRef}
        minPercent={minPercent}
        maxPercent={maxPercent}
        onPointerDown={onTrackPointerDown}
      >
        {isFixed &&
          fixedValues!.map((value) => (
            <div
              key={value}
              className="absolute top-1/2 -translate-y-1/2"
              style={{ left: `${valueToPercent(value, absoluteMin, absoluteMax)}%` }}
            >
              <span
                className="absolute left-1/2 top-0 h-2 w-px -translate-x-1/2 -translate-y-1/2 bg-[#8c8579]"
                aria-hidden="true"
              />
              <span className="absolute left-1/2 top-4 -translate-x-1/2 whitespace-nowrap text-[10px] font-medium uppercase tracking-[0.14em] text-[#8c8579]">
                {currencyFormatter.format(value)}
              </span>
            </div>
          ))}

        <RangeThumb
          label="minimum"
          value={minValue}
          percent={minPercent}
          min={effectiveMin}
          max={effectiveMax}
          dragging={isDraggingMin}
          tooltip={formatValue(minValue)}
          onPointerDown={onThumbPointerDown('min')}
          onKeyDown={onThumbKeyDown('min')}
        />
        <RangeThumb
          label="maximum"
          value={maxValue}
          percent={maxPercent}
          min={effectiveMin}
          max={effectiveMax}
          dragging={isDraggingMax}
          tooltip={formatValue(maxValue)}
          onPointerDown={onThumbPointerDown('max')}
          onKeyDown={onThumbKeyDown('max')}
        />
      </RangeTrack>

      <div className="mt-8 flex items-end justify-between gap-4">
        <RangeLabel
          title="Min"
          value={minValue}
          editable={!isFixed}
          titleClassName={labelTitleClassName}
          min={absoluteMin}
          max={absoluteMax}
          onCommitAction={handleMinCommitAction}
          formatterAction={formatValue}
          controlClassName={minLabelControlClassName}
        />
        <div className="mb-3 h-px flex-1 bg-[#e6e0d6]" />
        <RangeLabel
          title="Max"
          value={maxValue}
          editable={!isFixed}
          titleClassName={`text-right ${labelTitleClassName}`}
          min={absoluteMin}
          max={absoluteMax}
          onCommitAction={handleMaxCommitAction}
          formatterAction={formatValue}
          controlClassName={maxLabelControlClassName}
        />
      </div>
    </div>
  );
}

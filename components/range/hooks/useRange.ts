'use client';

import type { KeyboardEvent, PointerEvent as ReactPointerEvent } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { clamp, getClosestFixedValue, getNextFixedValue, sortedUniqueValues, valueToPercent } from '@/utils/range';

type Thumb = 'min' | 'max';

type UseRangeOptions = {
  minLimit: number;
  maxLimit: number;
  initialMin: number;
  initialMax: number;
  fixedValues?: number[];
};

type RangeUpdateHandler = (value: number) => void;
type RangeValuesUpdateHandler = (minValue: number, maxValue: number) => void;

export function useRange({ minLimit, maxLimit, initialMin, initialMax, fixedValues }: UseRangeOptions) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [activeThumb, setActiveThumb] = useState<Thumb | null>(null);

  const isFixedMode = Boolean(fixedValues?.length);

  const sortedFixedValues = useMemo(() => {
    if (!fixedValues?.length) {
      return [];
    }

    return sortedUniqueValues(fixedValues);
  }, [fixedValues]);

  const normalizeValue = useCallback(
    (value: number): number => {
      const clampedValue = clamp(value, minLimit, maxLimit);
      if (!isFixedMode) {
        return Math.round(clampedValue);
      }

      return getClosestFixedValue(clampedValue, sortedFixedValues);
    },
    [isFixedMode, maxLimit, minLimit, sortedFixedValues],
  );

  const [minValue, setMinValueState] = useState<number>(normalizeValue(initialMin));
  const [maxValue, setMaxValueState] = useState<number>(normalizeValue(initialMax));

  const toValueFromPointer = useCallback(
    (clientX: number): number | null => {
      if (!trackRef.current) {
        return null;
      }

      const rect = trackRef.current.getBoundingClientRect();
      if (rect.width <= 0) {
        return null;
      }

      const percent = clamp(((clientX - rect.left) / rect.width) * 100, 0, 100);
      const interpolated = minLimit + ((maxLimit - minLimit) * percent) / 100;
      return normalizeValue(interpolated);
    },
    [maxLimit, minLimit, normalizeValue],
  );

  const setMinValue = useCallback<RangeUpdateHandler>(
    (value) => {
      const constrainedValue = normalizeValue(value);
      setMinValueState(Math.min(constrainedValue, maxValue));
    },
    [maxValue, normalizeValue],
  );

  const setMaxValue = useCallback<RangeUpdateHandler>(
    (value) => {
      const constrainedValue = normalizeValue(value);
      setMaxValueState(Math.max(constrainedValue, minValue));
    },
    [minValue, normalizeValue],
  );

  const setRangeValues = useCallback<RangeValuesUpdateHandler>(
    (nextMinValue, nextMaxValue) => {
      const normalizedMin = normalizeValue(nextMinValue);
      const normalizedMax = normalizeValue(nextMaxValue);
      const finalMin = Math.min(normalizedMin, normalizedMax);
      const finalMax = Math.max(normalizedMin, normalizedMax);
      setMinValueState(finalMin);
      setMaxValueState(finalMax);
    },
    [normalizeValue],
  );

  useEffect(() => {
    if (!activeThumb) {
      return;
    }

    const onPointerMove = (event: PointerEvent) => {
      const value = toValueFromPointer(event.clientX);
      if (value === null) {
        return;
      }

      if (activeThumb === 'min') {
        setMinValue(value);
      } else {
        setMaxValue(value);
      }
    };

    const onPointerUp = () => {
      setActiveThumb(null);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, [activeThumb, setMaxValue, setMinValue, toValueFromPointer]);

  const startDrag = (thumb: Thumb, clientX: number) => {
    setActiveThumb(thumb);
    const value = toValueFromPointer(clientX);
    if (value === null) {
      return;
    }

    if (thumb === 'min') {
      setMinValue(value);
    } else {
      setMaxValue(value);
    }
  };

  const onTrackPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    const value = toValueFromPointer(event.clientX);
    if (value === null) {
      return;
    }

    const nearestThumb = Math.abs(value - minValue) <= Math.abs(value - maxValue) ? 'min' : 'max';
    startDrag(nearestThumb, event.clientX);
  };

  const onThumbPointerDown = (thumb: Thumb) => (event: ReactPointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (typeof event.currentTarget.setPointerCapture === 'function') {
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    startDrag(thumb, event.clientX);
  };

  const onThumbKeyDown = (thumb: Thumb) => (event: KeyboardEvent<HTMLButtonElement>) => {
    const isMin = thumb === 'min';
    const currentValue = isMin ? minValue : maxValue;
    const update = isMin ? setMinValue : setMaxValue;

    if (event.key === 'Home') {
      event.preventDefault();
      update(minLimit);
      return;
    }

    if (event.key === 'End') {
      event.preventDefault();
      update(maxLimit);
      return;
    }

    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
      return;
    }

    event.preventDefault();

    if (isFixedMode) {
      const direction = event.key === 'ArrowRight' ? 1 : -1;
      update(getNextFixedValue(currentValue, sortedFixedValues, direction));
      return;
    }

    const step = event.key === 'ArrowRight' ? 1 : -1;
    update(currentValue + step);
  };

  const minPercent = valueToPercent(minValue, minLimit, maxLimit);
  const maxPercent = valueToPercent(maxValue, minLimit, maxLimit);

  return {
    trackRef,
    minValue,
    maxValue,
    minPercent,
    maxPercent,
    isDraggingMin: activeThumb === 'min',
    isDraggingMax: activeThumb === 'max',
    setMinValue,
    setMaxValue,
    setRangeValues,
    onTrackPointerDown,
    onThumbPointerDown,
    onThumbKeyDown,
  };
}

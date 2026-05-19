'use client';

import { useState } from 'react';

type RangeLabelProps = {
  value: number;
  title: string;
  editable?: boolean;
  showTitle?: boolean;
  titleClassName?: string;
  min?: number;
  max?: number;
  onCommitAction?: (value: number) => void;
  formatterAction?: (value: number) => string;
  controlClassName?: string;
};

export function RangeLabel({
  value,
  title,
  editable = false,
  titleClassName,
  min,
  max,
  onCommitAction,
  formatterAction = (nextValue) => `${nextValue}`,
  controlClassName,
}: RangeLabelProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(`${value}`);

  const commit = () => {
    if (!editable || !onCommitAction || min === undefined || max === undefined) {
      setEditing(false);
      setDraft(`${value}`);
      return;
    }

    const parsed = Number(draft);
    if (Number.isNaN(parsed)) {
      setDraft(`${value}`);
      setEditing(false);
      return;
    }

    const bounded = Math.min(Math.max(parsed, min), max);
    const normalized = Math.round(bounded);
    onCommitAction(normalized);
    setDraft(`${normalized}`);
    setEditing(false);
  };

  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={`${title.toLowerCase()}-input`}
        className={`text-sm font-medium text-amber-900 ${titleClassName ?? ''}`}
      >
        {title}
      </label>
      {editable && editing ? (
        <input
          id={`${title.toLowerCase()}-input`}
          data-testid={`${title.toLowerCase()}-input`}
          className={`w-28 rounded-md border border-amber-300 bg-white px-3 py-2 text-sm text-amber-950 outline-none transition-colors focus:border-amber-500 ${
            controlClassName ?? ''
          }`}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={commit}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              commit();
            }
            if (event.key === 'Escape') {
              setEditing(false);
              setDraft(`${value}`);
            }
          }}
          autoFocus
        />
      ) : (
        <button
          data-testid={`${title.toLowerCase()}-label`}
          type="button"
          className={`w-28 rounded-md border border-amber-300 bg-white px-3 py-2 text-left text-sm text-amber-950 ${
            controlClassName ?? ''
          }`}
          onClick={() => {
            if (editable) {
              setEditing(true);
              setDraft(`${value}`);
            }
          }}
        >
          {formatterAction(value)}
        </button>
      )}
    </div>
  );
}

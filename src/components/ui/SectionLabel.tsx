/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ReactNode } from 'react';

interface SectionLabelProps {
  children: ReactNode;
}

export default function SectionLabel({ children }: SectionLabelProps) {
  return (
    <div className="mb-6 flex items-center gap-4">
      <span className="h-[1px] w-8 bg-accent" />
      <span className="font-ui text-[11px] uppercase tracking-[0.2em] text-accent">
        {children}
      </span>
    </div>
  );
}

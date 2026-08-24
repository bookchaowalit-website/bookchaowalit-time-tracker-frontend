# Design system

## Overview

Time Tracker is a punch-card room: a quiet paper register wrapped around one live instrument. The timer is the focal object; history reads like a ledger rather than a dashboard.

## Colors

- Paper: `#EEE7D9`
- Ink: `#20231F`
- Rule: `#B8AD9D`
- Rust action: `#C7653D`
- Sage live state: `#849878`

## Typography

- Display: `Iowan Old Style`, `Palatino Linotype`, Georgia.
- Controls and durations: system monospace for measurement and machine labels.
- Body: neutral Helvetica system sans.

## Layout

- Wide editorial hero followed by a three-part dark clock sheet.
- Session history is a ruled ledger with numbered rows.
- Mobile stacks the instrument, controls, total, and ledger without horizontal scrolling.

## Elevation & Depth

Depth comes from the dark instrument sheet, concentric clock rings, and paper contrast. No floating card stack.

## Shapes

Mostly square paper and ruled rows. The circular punch stamp and clock rings are the only round forms.

## Components

- Station bar
- Punch stamp
- Clock face
- Start/stop control line
- Punch card ledger
- Empty register state

## Do's and Don'ts

- Do make elapsed time and the active session unmistakable.
- Do keep browser-only persistence visible and honest.
- Don't turn the page into a generic KPI dashboard.
- Don't imply payroll, sync, or team reporting.

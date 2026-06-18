// ============================================================
//  eventStateUtils.js
//  Derives the current event mode from event.config.js.
//  Import getEventMode() anywhere — no arguments needed.
// ============================================================

import { EVENT_STATE, BOOKING_CONFIG } from "../config/event";

export const EVENT_MODE = {
  LIVE: "LIVE",       // booking open, countdown visible, "Book Now" shown
  PAUSED: "PAUSED",   // booking temporarily closed, no "Book Now"
  SOLD_OUT: "SOLD_OUT", // redirect /booking → /sold-out
  ENDED: "ENDED",     // event over: no countdown, no booking, no download ticket
  INFO_ONLY: "INFO_ONLY",   // no ticketing — confirmed free entry, just event info
  FORMAT_TBD: "FORMAT_TBD", // ← new: format genuinely undecided (free vs ticketed)
};

/**
 * Returns the current event mode derived from EVENT_STATE in event.config.js.
 * Call with no arguments — the config is the single source of truth.
 *
 * Priority order:
 *   ENDED > SOLD_OUT > PAUSED > LIVE
 *   (when BOOKING_CONFIG.enabled is false: FORMAT_TBD or INFO_ONLY instead)
 */
export function getEventMode() {
  if (!BOOKING_CONFIG.enabled) {
    return BOOKING_CONFIG.freeEntryConfirmed
      ? EVENT_MODE.INFO_ONLY
      : EVENT_MODE.FORMAT_TBD;
  }
  const { isLive, isSoldOut, isEventEnded } = EVENT_STATE;

  if (isEventEnded) return EVENT_MODE.ENDED;
  if (isSoldOut)    return EVENT_MODE.SOLD_OUT;
  if (!isLive)      return EVENT_MODE.PAUSED;
  return EVENT_MODE.LIVE;
}

/**
 * Convenience booleans — import whichever you need.
 *
 * import { isBookingOpen, isEventOver } from "./eventStateUtils";
 */
export const eventMode     = getEventMode();
export const isBookingOpen = eventMode === EVENT_MODE.LIVE;
export const isSoldOut     = eventMode === EVENT_MODE.SOLD_OUT;
export const isEventOver   = eventMode === EVENT_MODE.ENDED;
export const isPaused      = eventMode === EVENT_MODE.PAUSED;
export const isFormatTBD   = eventMode === EVENT_MODE.FORMAT_TBD;
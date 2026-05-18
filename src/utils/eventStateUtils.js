// ============================================================
//  eventStateUtils.js
//  Derives the current event mode from event.config.js.
//  Import getEventMode() anywhere — no arguments needed.
// ============================================================

import { EVENT_STATE } from "../config/event";

export const EVENT_MODE = {
  LIVE: "LIVE",       // booking open, countdown visible, "Book Now" shown
  PAUSED: "PAUSED",   // booking temporarily closed, no "Book Now"
  SOLD_OUT: "SOLD_OUT", // redirect /booking → /sold-out
  ENDED: "ENDED",     // event over: no countdown, no booking, no download ticket
};

/**
 * Returns the current event mode derived from EVENT_STATE in event.config.js.
 * Call with no arguments — the config is the single source of truth.
 *
 * Priority order:
 *   ENDED > SOLD_OUT > PAUSED > LIVE
 */
export function getEventMode() {
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

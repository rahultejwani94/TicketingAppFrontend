export function getTicketPrice(ticketCount, pricingConfig) {
  const now = new Date();

  const earlyBird = pricingConfig.earlyBird;

  // EARLY BIRD
  if (
    earlyBird.enabled &&
    now <= new Date(earlyBird.validTill)
  ) {
    const pricePerTicket = earlyBird.price;

    return {
      pricePerTicket,
      total: pricePerTicket * ticketCount,
      pricingLabel: "Early Bird",
      isEarlyBird: true,
      isBulkDiscount: false,
    };
  }

  // BULK DISCOUNT
  if (
    ticketCount >= pricingConfig.regular.bulkMinTickets
  ) {
    const pricePerTicket =
      pricingConfig.regular.bulkTicketPrice;

    return {
      pricePerTicket,
      total: pricePerTicket * ticketCount,
      pricingLabel: "Group Discount",
      isEarlyBird: false,
      isBulkDiscount: true,
    };
  }

  // REGULAR PRICE
  const pricePerTicket =
    pricingConfig.regular.singleTicketPrice;

  return {
    pricePerTicket,
    total: pricePerTicket * ticketCount,
    pricingLabel: "Regular",
    isEarlyBird: false,
    isBulkDiscount: false,
  };
}
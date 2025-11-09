/**
 * Marketplace ID enum
 */
export type MarketplaceIdEnum = string;

/**
 * Payments program type enum
 * Currently the only supported payments program is EBAY_PAYMENTS
 */
export type PaymentsProgramType = "EBAY_PAYMENTS" | string;

/**
 * Payments program status enum
 */
export type PaymentsProgramStatus =
  | "OPTED_IN"
  | "OPTED_OUT"
  | "NOT_ELIGIBLE"
  | string;

/**
 * Response object containing the seller's status with regards to the specified payment program
 */
export type PaymentsProgramResponse = {
  /**
   * The ID of the eBay marketplace to which the payment program applies.
   * Occurrence: Conditional
   */
  marketplaceId?: MarketplaceIdEnum;

  /**
   * This parameter specifies the payment program whose status is returned by the call.
   * Currently the only supported payments program is EBAY_PAYMENTS.
   * Occurrence: Conditional
   */
  paymentsProgramType?: PaymentsProgramType;

  /**
   * The enumeration value returned in this field indicates whether or not the seller's account is enabled for the payments program.
   * Occurrence: Conditional
   */
  status?: PaymentsProgramStatus;

  /**
   * If returned as true, the seller was at one point opted-in to the associated payment program,
   * but they later opted out of the program. A value of false indicates the seller never opted-in
   * to the program or if they did opt-in to the program, they never opted-out of it.
   * It's important to note that the setting of this field does not indicate the seller's current status
   * regarding the payment program. It is possible for this field to return true while the status field returns OPTED_IN.
   * Occurrence: Conditional
   */
  wasPreviouslyOptedIn?: boolean;
};

/**
 * Path parameters for getting payments program
 */
export type GetPaymentsProgramPathParams = {
  /**
   * The eBay marketplace ID
   * Occurrence: Required
   */
  marketplace_id: string;

  /**
   * The payment program type (currently only EBAY_PAYMENTS is supported)
   * Occurrence: Required
   */
  payments_program_type: string;
};

/**
 * @summary Get Payments Program
 * @description Retrieves a seller's status for a specific payment program for a specific marketplace
 * @method GET
 * @path /sell/account/v1/payments_program/{marketplace_id}/{payments_program_type}
 * @authentication OAuth access token with scope: https://api.ebay.com/oauth/api_scope/sell.account or https://api.ebay.com/oauth/api_scope/sell.account.readonly
 * @pathParams marketplace_id - The eBay marketplace ID
 * @pathParams payments_program_type - The payment program type
 * @response 200 PaymentsProgramResponse
 * @status 200 Success
 * @status 400 Bad Request
 * @status 500 Internal Server Error
 * @error 20500 API_ACCOUNT APPLICATION System error.
 */
export type GetPaymentsProgramAPI = {
  method: "GET";
  path: "/sell/account/v1/payments_program/{marketplace_id}/{payments_program_type}";
  pathParams: GetPaymentsProgramPathParams;
  response: PaymentsProgramResponse;
};

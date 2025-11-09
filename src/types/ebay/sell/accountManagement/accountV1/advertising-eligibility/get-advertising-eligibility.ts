/**
 * Advertising program enum
 * The eBay advertising program for which a seller may be eligible
 */
export type AdvertisingProgramEnum =
  | "PROMOTED_LISTINGS_STANDARD"
  | "PROMOTED_LISTINGS_ADVANCED"
  | string;

/**
 * Seller ineligible reason enum
 * The reason why a seller is ineligible for the specified eBay advertising program
 */
export type SellerIneligibleReasonEnum =
  | "NOT_ELIGIBLE_FOR_MANAGED_PAYMENTS"
  | "ACCOUNT_NOT_IN_GOOD_STANDING"
  | "SELLER_DOES_NOT_MEET_REQUIREMENTS"
  | string;

/**
 * Seller eligibility enum
 * The seller eligibility status for the specified eBay advertising program
 */
export type SellerEligibilityEnum = "ELIGIBLE" | "NOT_ELIGIBLE" | string;

/**
 * Seller eligibility response for a specific advertising program
 */
export type SellerEligibilityResponse = {
  /**
   * The eBay advertising program for which a seller may be eligible.
   * Occurrence: Conditional
   */
  programType?: AdvertisingProgramEnum;

  /**
   * The reason why a seller is ineligible for the specified eBay advertising program.
   * This field is only returned if the seller is ineligible for the eBay advertising program.
   * Occurrence: Conditional
   */
  reason?: SellerIneligibleReasonEnum;

  /**
   * The seller eligibility status for the specified eBay advertising program.
   * Occurrence: Conditional
   */
  status?: SellerEligibilityEnum;
};

/**
 * Response for advertising eligibility
 */
export type SellerEligibilityMultiProgramResponse = {
  /**
   * An array of response fields that define the seller eligibility for eBay advertising programs.
   * Occurrence: Always
   */
  advertisingEligibility?: SellerEligibilityResponse[];
};

/**
 * Query parameters for getting advertising eligibility
 */
export type GetAdvertisingEligibilityParams = {
  /**
   * A comma-separated list of advertising program types.
   * The supported advertising programs are PROMOTED_LISTINGS_STANDARD and PROMOTED_LISTINGS_ADVANCED.
   * Occurrence: Required
   */
  program_types: string;
};

/**
 * @summary Get Advertising Eligibility
 * @description Retrieves the seller's eligibility status for eBay advertising programs
 * @method GET
 * @path /sell/account/v1/advertising_eligibility
 * @authentication OAuth access token with scope: https://api.ebay.com/oauth/api_scope/sell.account or https://api.ebay.com/oauth/api_scope/sell.account.readonly
 * @query program_types - Required. Comma-separated list of advertising program types
 * @response 200 SellerEligibilityMultiProgramResponse
 * @status 200 Success
 * @status 400 Bad Request
 * @status 500 Internal Server Error
 * @error 20500 API_ACCOUNT APPLICATION System error.
 */
export type GetAdvertisingEligibilityAPI = {
  method: "GET";
  path: "/sell/account/v1/advertising_eligibility";
  queryParams: GetAdvertisingEligibilityParams;
  response: SellerEligibilityMultiProgramResponse;
};

/**
 * Payments program onboarding status enum
 */
export type PaymentsProgramOnboardingStatus =
  | "ELIGIBLE"
  | "NOT_ELIGIBLE"
  | "IN_PROGRESS"
  | "COMPLETED"
  | string;

/**
 * Payments program onboarding step status enum
 */
export type PaymentsProgramOnboardingStepStatus =
  | "NOT_STARTED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | string;

/**
 * The payments program onboarding steps, status, and link
 */
export type PaymentsProgramOnboardingSteps = {
  /**
   * The name of the step in the steps array.
   * Over time, these names are subject to change as processes change.
   * Occurrence: Conditional
   */
  name?: string;

  /**
   * This enumeration value indicates the status of the associated step.
   * Note: Only one step can be IN_PROGRESS at a time.
   * Occurrence: Conditional
   */
  status?: PaymentsProgramOnboardingStepStatus;

  /**
   * This URL provides access to the IN_PROGRESS step.
   * Occurrence: Conditional
   */
  webUrl?: string;
};

/**
 * Type used by the payments program onboarding response
 */
export type PaymentsProgramOnboardingResponse = {
  /**
   * This enumeration value indicates the eligibility of payment onboarding for the registered site.
   * Occurrence: Conditional
   */
  onboardingStatus?: PaymentsProgramOnboardingStatus;

  /**
   * An array of the active process steps for payment onboarding and the status of each step.
   * This array includes the step name, step status, and a webUrl to the IN_PROGRESS step.
   * The step names are returned in sequential order.
   * Occurrence: Conditional
   */
  steps?: PaymentsProgramOnboardingSteps[];
};

/**
 * Path parameters for getting payments program onboarding
 */
export type GetPaymentsProgramOnboardingPathParams = {
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
 * @summary Get Payments Program Onboarding
 * @description Retrieves a seller's onboarding status for a payments program for a specific marketplace
 * @method GET
 * @path /sell/account/v1/payments_program/{marketplace_id}/{payments_program_type}/onboarding
 * @authentication OAuth access token with scope: https://api.ebay.com/oauth/api_scope/sell.account or https://api.ebay.com/oauth/api_scope/sell.account.readonly
 * @pathParams marketplace_id - The eBay marketplace ID
 * @pathParams payments_program_type - The payment program type
 * @response 200 PaymentsProgramOnboardingResponse
 * @status 200 Success
 * @status 400 Bad Request
 * @status 500 Internal Server Error
 * @error 20500 API_ACCOUNT APPLICATION System error.
 */
export type GetPaymentsProgramOnboardingAPI = {
  method: "GET";
  path: "/sell/account/v1/payments_program/{marketplace_id}/{payments_program_type}/onboarding";
  pathParams: GetPaymentsProgramOnboardingPathParams;
  response: PaymentsProgramOnboardingResponse;
};

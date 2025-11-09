import type { CustomPolicyTypeEnum } from "./get-custom-policies.js";

/**
 * Full custom policy details
 */
export type CustomPolicy = {
  /**
   * The unique custom policy identifier for a policy.
   * Occurrence: Conditional
   */
  customPolicyId?: string;

  /**
   * Contains the seller's policy and policy terms.
   * Buyers access this information from the View Item page for items to which the policy has been applied.
   * Max length: 15,000
   * Occurrence: Conditional
   */
  description?: string;

  /**
   * Customer-facing label shown on View Item pages for items to which the policy applies.
   * This seller-defined string is displayed as a system-generated hyperlink pointing to the seller's policy information.
   * Max length: 65
   * Occurrence: Conditional
   */
  label?: string;

  /**
   * The seller-defined name for the custom policy.
   * Names must be unique for policies assigned to the same seller and policy type.
   * Note: This field is visible only to the seller.
   * Max length: 65
   * Occurrence: Conditional
   */
  name?: string;

  /**
   * Specifies the type of Custom Policy being returned.
   * Occurrence: Conditional
   */
  policyType?: CustomPolicyTypeEnum;
};

/**
 * Path parameters for getting a specific custom policy
 */
export type GetCustomPolicyPathParams = {
  /**
   * The unique custom policy identifier
   * Occurrence: Required
   */
  custom_policy_id: string;
};

/**
 * @summary Get Custom Policy
 * @description Retrieves a specific custom policy by ID
 * @method GET
 * @path /sell/account/v1/custom_policy/{custom_policy_id}
 * @authentication OAuth access token with scope: https://api.ebay.com/oauth/api_scope/sell.account or https://api.ebay.com/oauth/api_scope/sell.account.readonly
 * @pathParams custom_policy_id - The unique custom policy identifier
 * @response 200 CustomPolicy
 * @status 200 Success
 * @status 400 Bad Request
 * @status 404 Not Found
 * @status 500 Internal Server Error
 * @error 20500 API_ACCOUNT APPLICATION System error.
 */
export type GetCustomPolicyAPI = {
  method: "GET";
  path: "/sell/account/v1/custom_policy/{custom_policy_id}";
  pathParams: GetCustomPolicyPathParams;
  response: CustomPolicy;
};

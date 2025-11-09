import type { CustomPolicyTypeEnum } from "./get-custom-policies.js";

/**
 * Request payload to update an existing custom policy
 */
export type CustomPolicyRequest = {
  /**
   * Contains the seller's policy and policy terms.
   * Max length: 15,000
   * Occurrence: Required
   */
  description: string;

  /**
   * Customer-facing label shown on View Item pages for items to which the policy applies.
   * This seller-defined string is displayed as a system-generated hyperlink pointing to the seller's policy information.
   * Max length: 65
   * Occurrence: Required
   */
  label: string;

  /**
   * The seller-defined name for the custom policy.
   * Names must be unique for policies assigned to the same seller and policy type.
   * Note: This field is visible only to the seller.
   * Max length: 65
   * Occurrence: Required
   */
  name: string;

  /**
   * Specifies the type of custom policy being updated.
   * Occurrence: Optional (cannot be changed from original)
   */
  policyType?: CustomPolicyTypeEnum;
};

/**
 * Path parameters for updating a custom policy
 */
export type UpdateCustomPolicyPathParams = {
  /**
   * The unique custom policy identifier
   * Occurrence: Required
   */
  custom_policy_id: string;
};

/**
 * @summary Update Custom Policy
 * @description Updates an existing custom policy identified by custom_policy_id
 * @method PUT
 * @path /sell/account/v1/custom_policy/{custom_policy_id}
 * @authentication OAuth access token with scope: https://api.ebay.com/oauth/api_scope/sell.account
 * @headers Content-Type: application/json (Required)
 * @pathParams custom_policy_id - The unique custom policy identifier
 * @body CustomPolicyRequest
 * @response 200 void - Success with no content
 * @status 200 Success
 * @status 400 Bad Request
 * @status 404 Not Found
 * @status 500 Internal Server Error
 * @error 20412 API_ACCOUNT REQUEST Invalid/Missing label
 * @error 20413 API_ACCOUNT REQUEST Invalid/Missing name
 * @error 20414 API_ACCOUNT REQUEST Invalid/Missing description
 * @error 20418 API_ACCOUNT REQUEST This policy name is already used
 * @error 20500 API_ACCOUNT APPLICATION System error.
 */
export type UpdateCustomPolicyAPI = {
  method: "PUT";
  path: "/sell/account/v1/custom_policy/{custom_policy_id}";
  pathParams: UpdateCustomPolicyPathParams;
  payload: CustomPolicyRequest;
  response: void;
};

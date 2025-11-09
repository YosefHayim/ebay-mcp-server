import type { CustomPolicyTypeEnum } from "./get-custom-policies.js";

/**
 * Request payload to create a new custom policy
 */
export type CustomPolicyCreateRequest = {
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
   * Specifies the type of custom policy being created.
   * Two Custom Policy types are supported:
   * - Product Compliance (PRODUCT_COMPLIANCE)
   * - Takeback (TAKE_BACK)
   * Occurrence: Required
   */
  policyType: CustomPolicyTypeEnum;
};

/**
 * @summary Create Custom Policy
 * @description Creates a new custom policy that specifies the seller's terms for complying with local governmental regulations.
 * Each Custom Policy targets a policyType. Multiple policies may be created as using the following custom policy types:
 * - PRODUCT_COMPLIANCE: Product Compliance policies disclose product information as required for regulatory compliance. Note: A maximum of 60 Product Compliance policies per seller may be created.
 * - TAKE_BACK: Takeback policies describe the seller's legal obligation to take back a previously purchased item when the buyer purchases a new one. Note: A maximum of 18 Takeback policies per seller may be created.
 * A successful create policy call returns an HTTP status code of 201 Created with the system-generated policy ID included in the Location response header.
 * @method POST
 * @path /sell/account/v1/custom_policy
 * @authentication OAuth access token with scope: https://api.ebay.com/oauth/api_scope/sell.account
 * @headers Content-Type: application/json (Required)
 * @body CustomPolicyCreateRequest
 * @response 201 { Location: string } - Location header contains the URL to the newly created custom policy
 * @status 201 Created
 * @status 400 Bad Request
 * @status 409 Policy Name already used / Maximum no of policies per site reached
 * @status 500 Internal Server Error
 * @error 20411 API_ACCOUNT REQUEST Invalid/Missing policyType {policyType}
 * @error 20412 API_ACCOUNT REQUEST Invalid/Missing label
 * @error 20413 API_ACCOUNT REQUEST Invalid/Missing name
 * @error 20414 API_ACCOUNT REQUEST Invalid/Missing description
 * @error 20415 API_ACCOUNT REQUEST Invalid/Missing marketplaceId
 * @error 20417 API_ACCOUNT REQUEST Maximum custom policy per site is reached
 * @error 20418 API_ACCOUNT REQUEST This policy name is already used
 * @error 20500 API_ACCOUNT APPLICATION System error.
 */
export type CreateCustomPolicyAPI = {
  method: "POST";
  path: "/sell/account/v1/custom_policy";
  payload: CustomPolicyCreateRequest;
  response: {
    headers: {
      Location: string;
    };
  };
};

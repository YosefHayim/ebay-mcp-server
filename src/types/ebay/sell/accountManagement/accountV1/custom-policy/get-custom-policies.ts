/**
 * Custom Policy Types enum
 * Specifies the type of custom policy
 */
export type CustomPolicyTypeEnum = "PRODUCT_COMPLIANCE" | "TAKE_BACK";

/**
 * Compact custom policy response for list views
 */
export type CompactCustomPolicyResponse = {
  /**
   * The unique custom policy identifier for the policy being returned.
   * Note: This value is automatically assigned by the system when the policy is created.
   * Occurrence: Conditional
   */
  customPolicyId?: string;

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
 * Response payload for custom policies list
 */
export type CustomPolicyResponse = {
  /**
   * This array contains the custom policies that match the input criteria.
   * Occurrence: Optional
   */
  customPolicies?: CompactCustomPolicyResponse[];

  /**
   * This field is for future use.
   * Occurrence: Optional
   */
  href?: string;

  /**
   * This field is for future use.
   * Occurrence: Optional
   */
  limit?: number;

  /**
   * This field is for future use.
   * Occurrence: Optional
   */
  next?: string;

  /**
   * This field is for future use.
   * Occurrence: Optional
   */
  offset?: number;

  /**
   * This field is for future use.
   * Occurrence: Optional
   */
  prev?: string;

  /**
   * This field is for future use.
   * Occurrence: Optional
   */
  total?: number;
};

/**
 * Query parameters for getting custom policies
 */
export type GetCustomPoliciesParams = {
  /**
   * This query parameter specifies the type of custom policies to be returned.
   * Multiple policy types may be requested in a single call by providing a comma-delimited set of all policy types to be returned.
   * Note: Omitting this query parameter from a request will also return policies of all policy types.
   * Occurrence: Optional
   */
  policy_types?: string;
};

/**
 * @summary Get Custom Policies
 * @description Retrieves the list of custom policies defined for a seller's account. To limit the returned custom policies, specify the policy_types query parameter.
 * @method GET
 * @path /sell/account/v1/custom_policy
 * @authentication OAuth access token with scope: https://api.ebay.com/oauth/api_scope/sell.account or https://api.ebay.com/oauth/api_scope/sell.account.readonly
 * @query policy_types - Optional. Comma-delimited list of policy types to return
 * @response 200 CustomPolicyResponse
 * @status 200 Success
 * @status 400 Bad Request
 * @status 500 Internal Server Error
 * @error 20411 API_ACCOUNT REQUEST Invalid/Missing policyTypes {policyType}
 * @error 20415 API_ACCOUNT REQUEST Invalid/Missing marketplaceId
 * @error 20500 API_ACCOUNT APPLICATION System error.
 */
export type GetCustomPoliciesAPI = {
  method: "GET";
  path: "/sell/account/v1/custom_policy";
  queryParams?: GetCustomPoliciesParams;
  response: CustomPolicyResponse;
};

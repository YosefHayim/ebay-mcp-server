/**
 * Marketplace ID enum
 */
export type MarketplaceIdEnum = string;

/**
 * Subscription type enum
 * The kind of entity with which the subscription is associated, such as an eBay store
 */
export type SubscriptionTypeEnum = "EBAY_STORE" | string;

/**
 * Generic time duration container
 */
export type TimeDuration = {
  /**
   * Time unit (e.g., "MONTH").
   * Occurrence: Conditional
   */
  unit?: string;

  /**
   * Numeric value for the unit.
   * Occurrence: Conditional
   */
  value?: number;
};

/**
 * Subscription details
 */
export type Subscription = {
  /**
   * The marketplace with which the subscription is associated.
   * Occurrence: Conditional
   */
  marketplaceId?: MarketplaceIdEnum;

  /**
   * The subscription ID.
   * Occurrence: Conditional
   */
  subscriptionId?: string;

  /**
   * The subscription level. For example, subscription levels for an eBay store include Starter, Basic, Featured, Anchor, and Enterprise levels.
   * Occurrence: Conditional
   */
  subscriptionLevel?: string;

  /**
   * The kind of entity with which the subscription is associated, such as an eBay store.
   * Occurrence: Conditional
   */
  subscriptionType?: SubscriptionTypeEnum;

  /**
   * The term of the subscription plan (typically in months).
   * Occurrence: Conditional
   */
  term?: TimeDuration;
};

/**
 * Response for getting subscription
 */
export type SubscriptionResponse = {
  /**
   * This field is for future use.
   * Occurrence: Conditional
   */
  href?: string;

  /**
   * This field is for future use.
   * Occurrence: Conditional
   */
  limit?: number;

  /**
   * This field is for future use.
   * Occurrence: Conditional
   */
  next?: string;

  /**
   * An array of subscriptions associated with the seller account.
   * Occurrence: Conditional
   */
  subscriptions?: Subscription[];

  /**
   * The total number of subscriptions displayed on the current page of results.
   * Occurrence: Conditional
   */
  total?: number;
};

/**
 * Query parameters for getting subscription
 */
export type GetSubscriptionParams = {
  /**
   * This optional query parameter limits the returned subscriptions to a specific subscription level.
   * Occurrence: Optional
   */
  limit?: string;
};

/**
 * @summary Get Subscription
 * @description Retrieves the subscription level of the user for a given subscription type
 * @method GET
 * @path /sell/account/v1/subscription
 * @authentication OAuth access token with scope: https://api.ebay.com/oauth/api_scope/sell.account or https://api.ebay.com/oauth/api_scope/sell.account.readonly
 * @query limit - Optional. Limits returned subscriptions
 * @response 200 SubscriptionResponse
 * @status 200 Success
 * @status 500 Internal Server Error
 * @error 20500 API_ACCOUNT APPLICATION System error.
 * @note Pagination has not yet been enabled for getSubscription, so all of the pagination-related fields are for future use.
 */
export type GetSubscriptionAPI = {
  method: "GET";
  path: "/sell/account/v1/subscription";
  queryParams?: GetSubscriptionParams;
  response: SubscriptionResponse;
};

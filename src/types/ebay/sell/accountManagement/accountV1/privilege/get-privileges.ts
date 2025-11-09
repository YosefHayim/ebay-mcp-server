/**
 * Monetary amount.
 */
export type Amount = {
  /**
   * ISO 4217 currency code (e.g., "USD").
   * Occurrence: Conditional
   */
  currency?: string;

  /**
   * Amount as string.
   * Occurrence: Conditional
   */
  value?: string;
};

/**
 * Type used by the sellingLimit container, a container that lists the monthly cap
 * for the quantity of items sold and total sales amount allowed for the seller's account.
 */
export type SellingLimit = {
  /**
   * This container shows the monthly cap for total sales amount allowed for the seller's account.
   * This container may not be returned if a seller does not have a monthly cap for total sales amount.
   * Occurrence: Conditional
   */
  amount?: Amount;

  /**
   * This field shows the monthly cap for total quantity sold allowed for the seller's account.
   * This field may not be returned if a seller does not have a monthly cap for total quantity sold.
   * Occurrence: Conditional
   */
  quantity?: number;
};

/**
 * Response payload for seller privileges
 */
export type SellingPrivileges = {
  /**
   * If this field is returned as true, the seller's registration is completed.
   * If this field is returned as false, the registration process is not complete.
   * Occurrence: Conditional
   */
  sellerRegistrationCompleted?: boolean;

  /**
   * This container lists the monthly cap for the quantity of items sold and total sales amount allowed for the seller's account.
   * This container may not be returned if a seller does not have a monthly cap for total quantity sold and total sales amount.
   * Note: The selling limit value returned in getPrivileges may vary slightly from the value displayed in Seller Hub.
   * The value in Seller Hub is an abbreviated figure, where rounding is applied.
   * Occurrence: Conditional
   */
  sellingLimit?: SellingLimit;
};

/**
 * @summary Get Privileges
 * @description Retrieves the seller's current set of privileges, including whether or not the seller's registration is completed and information about the seller's account limits
 * @method GET
 * @path /sell/account/v1/privilege
 * @authentication OAuth access token with scope: https://api.ebay.com/oauth/api_scope/sell.account or https://api.ebay.com/oauth/api_scope/sell.account.readonly
 * @response 200 SellingPrivileges
 * @status 200 Success
 * @status 500 Internal Server Error
 * @error 20500 API_ACCOUNT APPLICATION System error.
 */
export type GetPrivilegesAPI = {
  method: "GET";
  path: "/sell/account/v1/privilege";
  response: SellingPrivileges;
};

/**
 * Country code enum
 */
export type CountryCodeEnum = string;

/**
 * Shipping option type enum
 */
export type ShippingOptionTypeEnum = "DOMESTIC" | "INTERNATIONAL" | string;

/**
 * This type is used to provide details about each shipping rate table
 */
export type RateTable = {
  /**
   * A two-letter ISO 3166 country code representing the eBay marketplace where the shipping rate table is defined.
   * Occurrence: Conditional
   */
  countryCode?: CountryCodeEnum;

  /**
   * This enumeration value returned here indicates whether the shipping rate table is a domestic or international shipping rate table.
   * Occurrence: Conditional
   */
  locality?: ShippingOptionTypeEnum;

  /**
   * The seller-defined name for the shipping rate table.
   * Occurrence: Conditional
   */
  name?: string;

  /**
   * A unique eBay-assigned ID for a seller's shipping rate table.
   * These rateTableId values are used to associate shipping rate tables to fulfillment business policies
   * or directly to listings through an add/revise/relist call in the Trading API.
   * Occurrence: Conditional
   */
  rateTableId?: string;
};

/**
 * Response for getting rate tables
 */
export type RateTableResponse = {
  /**
   * An array of all shipping rate tables defined for a marketplace (or all marketplaces if no country_code query parameter is used).
   * This array will be returned as empty if the seller has no defined shipping rate tables for the specified marketplace.
   * Occurrence: Always
   */
  rateTables?: RateTable[];
};

/**
 * Query parameters for getting rate tables
 */
export type GetRateTablesParams = {
  /**
   * This query parameter specifies the eBay marketplace for which rate tables should be returned.
   * If not specified, rate tables for all marketplaces are returned.
   * Occurrence: Optional
   */
  country_code?: string;
};

/**
 * @summary Get Rate Tables
 * @description Retrieves a list of shipping rate tables defined for a marketplace
 * @method GET
 * @path /sell/account/v1/rate_table
 * @authentication OAuth access token with scope: https://api.ebay.com/oauth/api_scope/sell.account or https://api.ebay.com/oauth/api_scope/sell.account.readonly
 * @query country_code - Optional. eBay marketplace country code
 * @response 200 RateTableResponse
 * @status 200 Success
 * @status 500 Internal Server Error
 * @error 20500 API_ACCOUNT APPLICATION System error.
 */
export type GetRateTablesAPI = {
  method: "GET";
  path: "/sell/account/v1/rate_table";
  queryParams?: GetRateTablesParams;
  response: RateTableResponse;
};

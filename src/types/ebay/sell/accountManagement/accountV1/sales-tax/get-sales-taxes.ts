/**
 * Country code enum
 */
export type CountryCodeEnum = "US" | "CA" | string;

/**
 * This type is used to provide sales tax settings for a specific tax jurisdiction
 */
export type SalesTax = {
  /**
   * The country code enumeration value identifies the country to which this sales tax rate applies.
   * Note: Sales-tax tables are available only for the US and Canada marketplaces.
   * Therefore, the only supported values are: US, CA
   * Occurrence: Conditional
   */
  countryCode?: CountryCodeEnum;

  /**
   * A unique ID that identifies the sales tax jurisdiction to which the sales tax rate applies.
   * Note: When the returned countryCode is US, the only supported return values for salesTaxJurisdictionId are:
   * AS (American Samoa), GU (Guam), MP (Northern Mariana Islands), PW (Palau), VI (US Virgin Islands)
   * Occurrence: Conditional
   */
  salesTaxJurisdictionId?: string;

  /**
   * The sales tax rate that will be applied to sales price.
   * The shippingAndHandlingTaxed value will indicate whether or not sales tax is also applied to shipping and handling charges.
   * Although it is a string, a percentage value is returned here, such as "7.75"
   * Occurrence: Conditional
   */
  salesTaxPercentage?: string;

  /**
   * If returned as true, sales tax is also applied to shipping and handling charges, and not just the total sales price of the order.
   * Occurrence: Conditional
   */
  shippingAndHandlingTaxed?: boolean;
};

/**
 * Response for getting sales taxes
 */
export type SalesTaxes = {
  /**
   * An array of one or more sales-tax rate entries for a specified country.
   * If no sales-tax rate entries are set up, no response payload is returned, but an HTTP status code of 204 No Content is returned.
   * Occurrence: Conditional
   */
  salesTaxes?: SalesTax[];
};

/**
 * Query parameters for getting sales taxes
 */
export type GetSalesTaxesParams = {
  /**
   * This parameter specifies the two-letter ISO 3166 code for the country whose sales tax table you want to retrieve.
   * Sales-tax tables are available only for the US and Canada marketplaces.
   * Occurrence: Optional
   */
  country_code?: string;
};

/**
 * @summary Get Sales Taxes
 * @description Retrieves a list of sales tax table entries
 * @method GET
 * @path /sell/account/v1/sales_tax
 * @authentication OAuth access token with scope: https://api.ebay.com/oauth/api_scope/sell.account or https://api.ebay.com/oauth/api_scope/sell.account.readonly
 * @query country_code - Optional. Two-letter ISO 3166 country code
 * @response 200 SalesTaxes
 * @response 204 No Content (no sales tax entries set up)
 * @status 200 Success
 * @status 204 No Content
 * @status 500 Internal Server Error
 * @error 20500 API_ACCOUNT APPLICATION System error.
 */
export type GetSalesTaxesAPI = {
  method: "GET";
  path: "/sell/account/v1/sales_tax";
  queryParams?: GetSalesTaxesParams;
  response: SalesTaxes;
};

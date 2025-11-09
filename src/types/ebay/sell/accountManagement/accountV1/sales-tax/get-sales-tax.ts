import type { SalesTax } from "./get-sales-taxes.js";

/**
 * Path parameters for getting a specific sales tax
 */
export type GetSalesTaxPathParams = {
  /**
   * Two-letter ISO 3166 country code
   * Occurrence: Required
   */
  countryCode: string;

  /**
   * Tax jurisdiction ID
   * Occurrence: Required
   */
  jurisdictionId: string;
};

/**
 * @summary Get Sales Tax
 * @description Retrieves a sales tax table entry for a specific tax jurisdiction
 * @method GET
 * @path /sell/account/v1/sales_tax/{countryCode}/{jurisdictionId}
 * @authentication OAuth access token with scope: https://api.ebay.com/oauth/api_scope/sell.account or https://api.ebay.com/oauth/api_scope/sell.account.readonly
 * @pathParams countryCode - Two-letter ISO 3166 country code
 * @pathParams jurisdictionId - Tax jurisdiction ID
 * @response 200 SalesTax
 * @status 200 Success
 * @status 204 No Content (no entry for specified jurisdiction)
 * @status 404 Not Found
 * @status 500 Internal Server Error
 * @error 20500 API_ACCOUNT APPLICATION System error.
 */
export type GetSalesTaxAPI = {
  method: "GET";
  path: "/sell/account/v1/sales_tax/{countryCode}/{jurisdictionId}";
  pathParams: GetSalesTaxPathParams;
  response: SalesTax;
};

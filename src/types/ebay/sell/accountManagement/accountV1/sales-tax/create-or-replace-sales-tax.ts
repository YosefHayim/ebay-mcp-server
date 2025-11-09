import type { CountryCodeEnum } from "./get-sales-taxes.js";

/**
 * Base type for sales tax request
 */
export type SalesTaxBase = {
  /**
   * This field is used to set the sales tax rate for the tax jurisdiction set in the call URI.
   * When applicable to an order, this sales tax rate will be applied to sales price.
   * The shippingAndHandlingTaxed value will indicate whether or not sales tax is also applied to shipping and handling charges.
   * Although it is a string, a percentage value is set here, such as "7.75".
   * Occurrence: Required
   */
  salesTaxPercentage: string;

  /**
   * This field is set to true if the seller wishes to apply sales tax to shipping and handling charges,
   * and not just the total sales price of the order. Otherwise, this field's value should be set to false.
   * Occurrence: Optional
   */
  shippingAndHandlingTaxed?: boolean;
};

/**
 * Path parameters for creating or replacing sales tax
 */
export type CreateOrReplaceSalesTaxPathParams = {
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
 * @summary Create Or Replace Sales Tax
 * @description Creates or replaces a sales tax table entry for a specific tax jurisdiction
 * @method PUT
 * @path /sell/account/v1/sales_tax/{countryCode}/{jurisdictionId}
 * @authentication OAuth access token with scope: https://api.ebay.com/oauth/api_scope/sell.account
 * @headers Content-Type: application/json (Required)
 * @pathParams countryCode - Two-letter ISO 3166 country code
 * @pathParams jurisdictionId - Tax jurisdiction ID
 * @body SalesTaxBase
 * @response 200 void - Success with no content (entry created or updated)
 * @status 200 Success
 * @status 204 No Content
 * @status 400 Bad Request
 * @status 500 Internal Server Error
 * @error 20500 API_ACCOUNT APPLICATION System error.
 */
export type CreateOrReplaceSalesTaxAPI = {
  method: "PUT";
  path: "/sell/account/v1/sales_tax/{countryCode}/{jurisdictionId}";
  pathParams: CreateOrReplaceSalesTaxPathParams;
  payload: SalesTaxBase;
  response: void;
};

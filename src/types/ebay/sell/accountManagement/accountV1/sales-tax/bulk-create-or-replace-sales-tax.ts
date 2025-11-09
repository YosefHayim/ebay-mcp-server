import type { CountryCodeEnum } from "./get-sales-taxes.js";

/**
 * Sales tax input for a single jurisdiction
 */
export type SalesTaxInput = {
  /**
   * This parameter specifies the two-letter ISO 3166 code of the country for which a sales-tax table entry is to be created or updated.
   * Note: Sales-tax tables are available only for the US and Canada marketplaces. Therefore, the only supported values are: US, CA
   * Occurrence: Required
   */
  countryCode: CountryCodeEnum;

  /**
   * This parameter specifies the ID of the tax jurisdiction for which a sales-tax table entry is to be created or updated.
   * Valid jurisdiction IDs can be retrieved using the getSalesTaxJurisdiction method of the Metadata API.
   * Note: When countryCode is set to US, the only supported values for jurisdictionId are:
   * AS (American Samoa), GU (Guam), MP (Northern Mariana Islands), PW (Palau), VI (US Virgin Islands)
   * Occurrence: Required
   */
  salesTaxJurisdictionId: string;

  /**
   * This parameter specifies the sales tax rate for the specified salesTaxJurisdictionId.
   * When applicable to an order, this sales tax rate will be applied to the sales price.
   * The shippingAndHandlingTaxed value indicates whether or not sales tax is also applied to shipping and handling charges.
   * Although it is a string, a percentage value is set here, such as "7.75".
   * Occurrence: Required
   */
  salesTaxPercentage: string;

  /**
   * This parameter is set to true if the seller wishes to apply sales tax to shipping and handling charges
   * and not just the total sales price of an order. Otherwise, this parameter's value should be set to false.
   * Occurrence: Optional
   */
  shippingAndHandlingTaxed?: boolean;
};

/**
 * Bulk sales tax input request
 */
export type BulkSalesTaxInput = {
  /**
   * The array of sales-tax table entries to be created or updated.
   * Occurrence: Required
   */
  salesTaxInputList: SalesTaxInput[];
};

/**
 * Updated sales tax entry result
 */
export type UpdatedSalesTaxEntry = {
  /**
   * The two-letter ISO 3166 code of the country associated with the sales-tax table entry.
   * Occurrence: Conditional
   */
  countryCode?: string;

  /**
   * The ID of the tax jurisdiction associated with the sales-tax table entry.
   * Occurrence: Conditional
   */
  jurisdictionId?: string;

  /**
   * The HTTP status code for the call.
   * Note: The system returns one HTTP status code regardless of the number of sales-tax table entries provided.
   * Therefore, the same HTTP statusCode will be listed for all sales-tax table entries returned in the payload.
   * Occurrence: Conditional
   */
  statusCode?: number;
};

/**
 * Response for bulk create or replace sales tax
 */
export type UpdatedSalesTaxResponse = {
  /**
   * The array of new and updated sales-tax table entries.
   * Occurrence: Conditional
   */
  updatedSalesTaxEntries?: UpdatedSalesTaxEntry[];
};

/**
 * @summary Bulk Create Or Replace Sales Tax
 * @description Creates or replaces sales tax table entries in bulk
 * @method POST
 * @path /sell/account/v1/bulk_create_or_replace_sales_tax
 * @authentication OAuth access token with scope: https://api.ebay.com/oauth/api_scope/sell.account
 * @headers Content-Type: application/json (Required)
 * @body BulkSalesTaxInput
 * @response 200 UpdatedSalesTaxResponse
 * @status 200 Success
 * @status 400 Bad Request
 * @status 500 Internal Server Error
 * @error 20500 API_ACCOUNT APPLICATION System error.
 */
export type BulkCreateOrReplaceSalesTaxAPI = {
  method: "POST";
  path: "/sell/account/v1/bulk_create_or_replace_sales_tax";
  payload: BulkSalesTaxInput;
  response: UpdatedSalesTaxResponse;
};

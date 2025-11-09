/**
 * Path parameters for deleting sales tax
 */
export type DeleteSalesTaxPathParams = {
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
 * @summary Delete Sales Tax
 * @description Deletes a sales tax table entry for a specific tax jurisdiction
 * @method DELETE
 * @path /sell/account/v1/sales_tax/{countryCode}/{jurisdictionId}
 * @authentication OAuth access token with scope: https://api.ebay.com/oauth/api_scope/sell.account
 * @pathParams countryCode - Two-letter ISO 3166 country code
 * @pathParams jurisdictionId - Tax jurisdiction ID
 * @response 204 void - Success with no content (entry deleted)
 * @status 204 No Content
 * @status 400 Bad Request
 * @status 404 Not Found
 * @status 500 Internal Server Error
 * @error 20500 API_ACCOUNT APPLICATION System error.
 */
export type DeleteSalesTaxAPI = {
  method: "DELETE";
  path: "/sell/account/v1/sales_tax/{countryCode}/{jurisdictionId}";
  pathParams: DeleteSalesTaxPathParams;
  response: void;
};

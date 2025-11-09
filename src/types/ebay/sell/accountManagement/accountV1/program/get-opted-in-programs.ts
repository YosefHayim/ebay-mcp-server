/**
 * Program type enum
 * Represents the types of seller programs available
 */
export type ProgramTypeEnum =
  | "SELLING_POLICY_MANAGEMENT"
  | "SELLER_PROMISE"
  | "OUT_OF_STOCK_CONTROL"
  | string;

/**
 * Seller program information
 */
export type Program = {
  /**
   * The seller program to opt in to when part of an optInToProgram request, or out of when part of an optOutOfProgram request.
   * When returned in an getOptedInPrograms response, a separate programType field is returned for each seller program that the seller is opted in to.
   * Occurrence: Conditional
   */
  programType?: ProgramTypeEnum;
};

/**
 * Response payload for opted-in programs
 */
export type Programs = {
  /**
   * An array of seller programs that the seller's account is opted in to.
   * An empty array is returned if the seller is not opted in to any of the seller programs.
   * Occurrence: Always
   */
  programs?: Program[];
};

/**
 * @summary Get Opted In Programs
 * @description Retrieves a list of the seller programs that the seller has opted in to
 * @method GET
 * @path /sell/account/v1/program/get_opted_in_programs
 * @authentication OAuth access token with scope: https://api.ebay.com/oauth/api_scope/sell.account or https://api.ebay.com/oauth/api_scope/sell.account.readonly
 * @response 200 Programs
 * @status 200 Success
 * @status 500 Internal Server Error
 * @error 20500 API_ACCOUNT APPLICATION System error.
 */
export type GetOptedInProgramsAPI = {
  method: "GET";
  path: "/sell/account/v1/program/get_opted_in_programs";
  response: Programs;
};

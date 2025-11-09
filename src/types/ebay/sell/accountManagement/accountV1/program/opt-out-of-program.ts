import type { ProgramTypeEnum } from "./get-opted-in-programs.js";

/**
 * Request payload to opt out of a program
 */
export type OptOutOfProgramRequest = {
  /**
   * The seller program to opt out of.
   * Occurrence: Required
   */
  programType: ProgramTypeEnum;
};

/**
 * @summary Opt Out Of Program
 * @description Opts the seller out of a seller program
 * @method POST
 * @path /sell/account/v1/program/opt_out
 * @authentication OAuth access token with scope: https://api.ebay.com/oauth/api_scope/sell.account
 * @headers Content-Type: application/json (Required)
 * @body OptOutOfProgramRequest
 * @response 200 void - Success with no content
 * @status 200 Success
 * @status 400 Bad Request
 * @status 409 Conflict - Not opted in
 * @status 500 Internal Server Error
 * @error 20500 API_ACCOUNT APPLICATION System error.
 */
export type OptOutOfProgramAPI = {
  method: "POST";
  path: "/sell/account/v1/program/opt_out";
  payload: OptOutOfProgramRequest;
  response: void;
};

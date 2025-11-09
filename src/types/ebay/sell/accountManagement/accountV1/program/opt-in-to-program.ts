import type { ProgramTypeEnum } from "./get-opted-in-programs.js";

/**
 * Request payload to opt in to a program
 */
export type OptInToProgramRequest = {
  /**
   * The seller program to opt in to.
   * Occurrence: Required
   */
  programType: ProgramTypeEnum;
};

/**
 * @summary Opt In To Program
 * @description Opts the seller in to a seller program
 * @method POST
 * @path /sell/account/v1/program/opt_in
 * @authentication OAuth access token with scope: https://api.ebay.com/oauth/api_scope/sell.account
 * @headers Content-Type: application/json (Required)
 * @body OptInToProgramRequest
 * @response 200 void - Success with no content
 * @status 200 Success
 * @status 400 Bad Request
 * @status 409 Conflict - Already opted in
 * @status 500 Internal Server Error
 * @error 20500 API_ACCOUNT APPLICATION System error.
 */
export type OptInToProgramAPI = {
  method: "POST";
  path: "/sell/account/v1/program/opt_in";
  payload: OptInToProgramRequest;
  response: void;
};

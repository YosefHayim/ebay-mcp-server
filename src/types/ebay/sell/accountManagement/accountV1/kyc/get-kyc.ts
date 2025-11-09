/**
 * Details type enum
 * Categorizes the type of details needed for the KYC check
 */
export type DetailsType =
  | "BANK_ACCOUNT_NUMBER"
  | "BANK_ROUTING_NUMBER"
  | "COMPANY_REGISTRATION_DOCUMENT"
  | "GOVERNMENT_ID"
  | "PHOTO_ID"
  | "PROOF_OF_ADDRESS"
  | string;

/**
 * KYC check details
 */
export type KycCheck = {
  /**
   * The enumeration value returned in this field categorizes the type of details needed for the KYC check.
   * More information about the check is shown in the detailMessage and other applicable, corresponding fields.
   * Occurrence: Conditional
   */
  dataRequired?: DetailsType;

  /**
   * The timestamp in this field indicates the date by which the seller should resolve the KYC requirement.
   * The timestamp in this field uses the UTC date and time format described in the ISO 8601 Standard.
   * Format: MM-DD-YYYY HH:MM:SS
   * Example: 06-05-2020 10:34:18
   * Occurrence: Conditional
   */
  dueDate?: string;

  /**
   * If applicable and available, a URL will be returned in this field,
   * and the link will take the seller to an eBay page where they can provide the requested information.
   * Occurrence: Conditional
   */
  remedyUrl?: string;

  /**
   * This field gives a short summary of what is required from the seller.
   * An example might be, 'Upload bank document now.'.
   * The detailMessage field will often provide more details on what is required of the seller.
   * Occurrence: Conditional
   */
  alert?: string;

  /**
   * This field gives a detailed message about what is required from the seller.
   * An example might be, 'Please upload a bank document by 2020-08-01 to get your account back in good standing.'.
   * Occurrence: Conditional
   */
  detailMessage?: string;
};

/**
 * Response for getting KYC checks
 */
export type KycResponse = {
  /**
   * This array contains one or more KYC checks required from a managed payments seller.
   * The seller may need to provide more documentation and/or information about themselves,
   * their company, or the bank account they are using for seller payouts.
   * If no KYC checks are currently required from the seller, this array is not returned,
   * and the seller only receives a 204 No Content HTTP status code.
   * Occurrence: Conditional
   */
  kycChecks?: KycCheck[];
};

/**
 * @summary Get KYC
 * @description Retrieves any KYC check that is applicable to the managed payments seller
 * @method GET
 * @path /sell/account/v1/kyc
 * @authentication OAuth access token with scope: https://api.ebay.com/oauth/api_scope/sell.account or https://api.ebay.com/oauth/api_scope/sell.account.readonly
 * @response 200 KycResponse
 * @response 204 No Content (no KYC checks required)
 * @status 200 Success
 * @status 204 No Content
 * @status 500 Internal Server Error
 * @error 20500 API_ACCOUNT APPLICATION System error.
 */
export type GetKycAPI = {
  method: "GET";
  path: "/sell/account/v1/kyc";
  response: KycResponse;
};

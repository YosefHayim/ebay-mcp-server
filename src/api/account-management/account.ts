import type { CustomPolicyResponse } from "../../types/ebay/sell/accountManagement/accountV1/custom-policy/get-custom-policies.js";
import type { CustomPolicy } from "../../types/ebay/sell/accountManagement/accountV1/custom-policy/get-custom-policy.js";
import type { CustomPolicyCreateRequest } from "../../types/ebay/sell/accountManagement/accountV1/custom-policy/create-custom-policy.js";
import type { FulfillmentPolicyResponse } from "../../types/ebay/sell/accountManagement/accountV1/fulfillment-policy/get-fulfillment-policies.js";
import type { FulfillmentPolicy } from "../../types/ebay/sell/accountManagement/accountV1/fulfillment-policy/get-fulfuillment-policy.js";
import type { FulfillmentPolicyRequest, SetFulfillmentPolicyResponse } from "../../types/ebay/sell/accountManagement/accountV1/fulfillment-policy/create-fulfuillment-policy.js";
import type { GetPaymentPoliciesResponse } from "../../types/ebay/sell/accountManagement/accountV1/payment-policy/get-payment-policies.js";
import type { PaymentPolicy } from "../../types/ebay/sell/accountManagement/accountV1/payment-policy/get-payment-policy.js";
import type { PaymentPolicyRequest, SetPaymentPolicyResponse } from "../../types/ebay/sell/accountManagement/accountV1/payment-policy/create-payment-policy.js";
import type { SellingPrivileges } from "../../types/ebay/sell/accountManagement/accountV1/privilege/get-privileges.js";
import type { ReturnPolicyResponse } from "../../types/ebay/sell/accountManagement/accountV1/return-policy/get-return-policies.js";
import type { ReturnPolicy } from "../../types/ebay/sell/accountManagement/accountV1/return-policy/get-return-policy.js";
import type { ReturnPolicyRequest, SetReturnPolicyResponse } from "../../types/ebay/sell/accountManagement/accountV1/return-policy/create-return-policy.js";
import type { KycResponse } from "../../types/ebay/sell/accountManagement/accountV1/kyc/get-kyc.js";
import type { PaymentsProgramResponse } from "../../types/ebay/sell/accountManagement/accountV1/payments-program/get-payments-program.js";
import type { RateTableResponse } from "../../types/ebay/sell/accountManagement/accountV1/rate-table/get-rate-tables.js";
import type { SalesTaxes, SalesTax } from "../../types/ebay/sell/accountManagement/accountV1/sales-tax/get-sales-taxes.js";
import type { SubscriptionResponse } from "../../types/ebay/sell/accountManagement/accountV1/subscription/get-subscription.js";
import type { Programs } from "../../types/ebay/sell/accountManagement/accountV1/program/get-opted-in-programs.js";
import type { OptInToProgramRequest } from "../../types/ebay/sell/accountManagement/accountV1/program/opt-in-to-program.js";
import type { SalesTaxBase } from "../../types/ebay/sell/accountManagement/accountV1/sales-tax/create-or-replace-sales-tax.js";
import type { EbayApiClient } from "../client.js";

/**
 * Account API - Seller account configuration, policies, programs
 * Based on: docs/sell-apps/account-management/sell_account_v1_oas3.json
 */
export class AccountApi {
  private readonly basePath = "/sell/account/v1";

  constructor(private client: EbayApiClient) { }

  /**
   * Get custom policies for the seller
   */
  async getCustomPolicies(policyTypes?: string): Promise<CustomPolicyResponse> {
    const params = policyTypes ? { policy_types: policyTypes } : undefined;
    return this.client.get<CustomPolicyResponse>(
      `${this.basePath}/custom_policy`,
      params,
    );
  }

  /**
   * Get a specific custom policy
   */
  async getCustomPolicy(customPolicyId: string): Promise<CustomPolicy> {
    return this.client.get<CustomPolicy>(`${this.basePath}/custom_policy/${customPolicyId}`);
  }

  /**
   * Get fulfillment policies
   */
  async getFulfillmentPolicies(
    marketplaceId?: string,
  ): Promise<FulfillmentPolicyResponse> {
    const params = marketplaceId
      ? { marketplace_id: marketplaceId }
      : undefined;
    return this.client.get<FulfillmentPolicyResponse>(
      `${this.basePath}/fulfillment_policy`,
      params,
    );
  }

  /**
   * Get payment policies
   */
  async getPaymentPolicies(
    marketplaceId?: string,
  ): Promise<GetPaymentPoliciesResponse> {
    const params = marketplaceId
      ? { marketplace_id: marketplaceId }
      : undefined;
    return this.client.get<GetPaymentPoliciesResponse>(
      `${this.basePath}/payment_policy`,
      params,
    );
  }

  /**
   * Get return policies
   */
  async getReturnPolicies(
    marketplaceId?: string,
  ): Promise<ReturnPolicyResponse> {
    const params = marketplaceId
      ? { marketplace_id: marketplaceId }
      : undefined;
    return this.client.get<ReturnPolicyResponse>(
      `${this.basePath}/return_policy`,
      params,
    );
  }

  /**
   * Get seller account privileges
   */
  async getPrivileges(): Promise<SellingPrivileges> {
    return this.client.get<SellingPrivileges>(`${this.basePath}/privilege`);
  }

  // ============================================================
  // Fulfillment Policy Methods
  // ============================================================

  /**
   * Create a new fulfillment policy
   */
  async createFulfillmentPolicy(
    policy: FulfillmentPolicyRequest,
  ): Promise<SetFulfillmentPolicyResponse> {
    return this.client.post<SetFulfillmentPolicyResponse>(
      `${this.basePath}/fulfillment_policy`,
      policy,
    );
  }

  /**
   * Get a specific fulfillment policy by ID
   */
  async getFulfillmentPolicy(
    fulfillmentPolicyId: string,
  ): Promise<FulfillmentPolicy> {
    return this.client.get<FulfillmentPolicy>(
      `${this.basePath}/fulfillment_policy/${fulfillmentPolicyId}`,
    );
  }

  /**
   * Get a fulfillment policy by name
   */
  async getFulfillmentPolicyByName(
    marketplaceId: string,
    name: string,
  ): Promise<FulfillmentPolicy> {
    return this.client.get<FulfillmentPolicy>(
      `${this.basePath}/fulfillment_policy_by_name`,
      { marketplace_id: marketplaceId, name },
    );
  }

  /**
   * Update a fulfillment policy
   */
  async updateFulfillmentPolicy(
    fulfillmentPolicyId: string,
    policy: FulfillmentPolicyRequest,
  ): Promise<SetFulfillmentPolicyResponse> {
    return this.client.put<SetFulfillmentPolicyResponse>(
      `${this.basePath}/fulfillment_policy/${fulfillmentPolicyId}`,
      policy,
    );
  }

  /**
   * Delete a fulfillment policy
   */
  async deleteFulfillmentPolicy(fulfillmentPolicyId: string): Promise<void> {
    return this.client.delete(`${this.basePath}/fulfillment_policy/${fulfillmentPolicyId}`);
  }

  // ============================================================
  // Payment Policy Methods
  // ============================================================

  /**
   * Create a new payment policy
   */
  async createPaymentPolicy(
    policy: PaymentPolicyRequest,
  ): Promise<SetPaymentPolicyResponse> {
    return this.client.post<SetPaymentPolicyResponse>(
      `${this.basePath}/payment_policy`,
      policy,
    );
  }

  /**
   * Get a specific payment policy by ID
   */
  async getPaymentPolicy(paymentPolicyId: string): Promise<PaymentPolicy> {
    return this.client.get<PaymentPolicy>(
      `${this.basePath}/payment_policy/${paymentPolicyId}`,
    );
  }

  /**
   * Get a payment policy by name
   */
  async getPaymentPolicyByName(
    marketplaceId: string,
    name: string,
  ): Promise<PaymentPolicy> {
    return this.client.get<PaymentPolicy>(
      `${this.basePath}/payment_policy_by_name`,
      { marketplace_id: marketplaceId, name },
    );
  }

  /**
   * Update a payment policy
   */
  async updatePaymentPolicy(
    paymentPolicyId: string,
    policy: PaymentPolicyRequest,
  ): Promise<SetPaymentPolicyResponse> {
    return this.client.put<SetPaymentPolicyResponse>(
      `${this.basePath}/payment_policy/${paymentPolicyId}`,
      policy,
    );
  }

  /**
   * Delete a payment policy
   */
  async deletePaymentPolicy(paymentPolicyId: string): Promise<void> {
    return this.client.delete(`${this.basePath}/payment_policy/${paymentPolicyId}`);
  }

  // ============================================================
  // Return Policy Methods
  // ============================================================

  /**
   * Create a new return policy
   */
  async createReturnPolicy(
    policy: ReturnPolicyRequest,
  ): Promise<SetReturnPolicyResponse> {
    return this.client.post<SetReturnPolicyResponse>(
      `${this.basePath}/return_policy`,
      policy,
    );
  }

  /**
   * Get a specific return policy by ID
   */
  async getReturnPolicy(returnPolicyId: string): Promise<ReturnPolicy> {
    return this.client.get<ReturnPolicy>(
      `${this.basePath}/return_policy/${returnPolicyId}`,
    );
  }

  /**
   * Get a return policy by name
   */
  async getReturnPolicyByName(
    marketplaceId: string,
    name: string,
  ): Promise<ReturnPolicy> {
    return this.client.get<ReturnPolicy>(
      `${this.basePath}/return_policy_by_name`,
      { marketplace_id: marketplaceId, name },
    );
  }

  /**
   * Update a return policy
   */
  async updateReturnPolicy(
    returnPolicyId: string,
    policy: ReturnPolicyRequest,
  ): Promise<SetReturnPolicyResponse> {
    return this.client.put<SetReturnPolicyResponse>(
      `${this.basePath}/return_policy/${returnPolicyId}`,
      policy,
    );
  }

  /**
   * Delete a return policy
   */
  async deleteReturnPolicy(returnPolicyId: string): Promise<void> {
    return this.client.delete(`${this.basePath}/return_policy/${returnPolicyId}`);
  }

  // ============================================================
  // Custom Policy Methods
  // ============================================================

  /**
   * Create a new custom policy
   */
  async createCustomPolicy(
    policy: CustomPolicyCreateRequest,
  ): Promise<CustomPolicy> {
    return this.client.post<CustomPolicy>(
      `${this.basePath}/custom_policy`,
      policy,
    );
  }

  /**
   * Update a custom policy
   */
  async updateCustomPolicy(
    customPolicyId: string,
    policy: CustomPolicyCreateRequest,
  ): Promise<void> {
    return this.client.put(
      `${this.basePath}/custom_policy/${customPolicyId}`,
      policy,
    );
  }

  /**
   * Delete a custom policy
   */
  async deleteCustomPolicy(customPolicyId: string): Promise<void> {
    return this.client.delete(`${this.basePath}/custom_policy/${customPolicyId}`);
  }

  // ============================================================
  // KYC, Payments Program, Rate Tables, Sales Tax, Subscription, Programs
  // ============================================================

  /**
   * Get KYC status
   */
  async getKyc(): Promise<KycResponse> {
    return this.client.get<KycResponse>(`${this.basePath}/kyc`);
  }

  /**
   * Opt-in to a payments program
   */
  async optInToPaymentsProgram(
    marketplaceId: string,
    paymentsProgramType: string,
  ): Promise<PaymentsProgramResponse> {
    return this.client.post<PaymentsProgramResponse>(
      `${this.basePath}/payments_program/${marketplaceId}/${paymentsProgramType}`,
      {},
    );
  }

  /**
   * Get payments program status
   */
  async getPaymentsProgramStatus(
    marketplaceId: string,
    paymentsProgramType: string,
  ): Promise<PaymentsProgramResponse> {
    return this.client.get<PaymentsProgramResponse>(
      `${this.basePath}/payments_program/${marketplaceId}/${paymentsProgramType}`,
    );
  }

  /**
   * Get rate tables
   */
  async getRateTables(): Promise<RateTableResponse> {
    return this.client.get<RateTableResponse>(`${this.basePath}/rate_table`);
  }

  /**
   * Create or replace sales tax table
   */
  async createOrReplaceSalesTax(
    countryCode: string,
    jurisdictionId: string,
    salesTaxBase: SalesTaxBase,
  ): Promise<void> {
    return this.client.put(
      `${this.basePath}/sales_tax/${countryCode}/${jurisdictionId}`,
      salesTaxBase,
    );
  }

  /**
   * Bulk create or replace sales tax tables
   */
  async bulkCreateOrReplaceSalesTax(requests: Array<{
    countryCode: string;
    jurisdictionId: string;
    salesTaxBase: SalesTaxBase;
  }>): Promise<void> {
    return this.client.post(
      `${this.basePath}/sales_tax/bulk_create_or_replace`,
      { requests },
    );
  }

  /**
   * Delete sales tax table
   */
  async deleteSalesTax(countryCode: string, jurisdictionId: string): Promise<void> {
    return this.client.delete(
      `${this.basePath}/sales_tax/${countryCode}/${jurisdictionId}`,
    );
  }

  /**
   * Get sales tax table
   */
  async getSalesTax(countryCode: string, jurisdictionId: string): Promise<SalesTax> {
    return this.client.get<SalesTax>(
      `${this.basePath}/sales_tax/${countryCode}/${jurisdictionId}`,
    );
  }

  /**
   * Get all sales tax tables
   */
  async getSalesTaxes(countryCode?: string): Promise<SalesTaxes> {
    const params = countryCode ? { country_code: countryCode } : undefined;
    return this.client.get<SalesTaxes>(`${this.basePath}/sales_tax`, params);
  }

  /**
   * Get subscription information
   */
  async getSubscription(limitType?: string): Promise<SubscriptionResponse> {
    const params = limitType ? { limit: limitType } : undefined;
    return this.client.get<SubscriptionResponse>(`${this.basePath}/subscription`, params);
  }

  /**
   * Opt-in to a program
   */
  async optInToProgram(request: OptInToProgramRequest): Promise<void> {
    return this.client.post(
      `${this.basePath}/program/opt_in`,
      request,
    );
  }

  /**
   * Opt-out of a program
   */
  async optOutOfProgram(request: OptInToProgramRequest): Promise<void> {
    return this.client.post(
      `${this.basePath}/program/opt_out`,
      request,
    );
  }

  /**
   * Get opted-in programs
   */
  async getOptedInPrograms(): Promise<Programs> {
    return this.client.get<Programs>(`${this.basePath}/program`);
  }
}

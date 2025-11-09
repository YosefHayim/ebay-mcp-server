import { EbayApiClient } from '../client.js';

/**
 * Analytics API - Sales and traffic analytics
 * Based on: docs/sell-apps/analytics-and-report/sell_analytics_v1_oas3.json
 */
export class AnalyticsApi {
  private readonly basePath = '/sell/analytics/v1';

  constructor(private client: EbayApiClient) {}

  /**
   * Get traffic report for listings
   * @throws Error if required parameters are missing or invalid
   */
  async getTrafficReport(
    dimension: string,
    filter: string,
    metric: string,
    sort?: string
  ) {
    // Input validation
    if (!dimension || typeof dimension !== 'string') {
      throw new Error('dimension is required and must be a string');
    }
    if (!filter || typeof filter !== 'string') {
      throw new Error('filter is required and must be a string');
    }
    if (!metric || typeof metric !== 'string') {
      throw new Error('metric is required and must be a string');
    }
    if (sort !== undefined && typeof sort !== 'string') {
      throw new Error('sort must be a string when provided');
    }

    const params: Record<string, string> = {
      dimension,
      filter,
      metric
    };
    if (sort) params.sort = sort;

    try {
      return await this.client.get(`${this.basePath}/traffic_report`, params);
    } catch (error) {
      throw new Error(
        `Failed to get traffic report: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Find all seller standards profiles
   * Endpoint: GET /seller_standards_profile
   * @throws Error if the request fails
   */
  async findSellerStandardsProfiles() {
    try {
      return await this.client.get(`${this.basePath}/seller_standards_profile`);
    } catch (error) {
      throw new Error(
        `Failed to find seller standards profiles: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Get a specific seller standards profile
   * Endpoint: GET /seller_standards_profile/{program}/{cycle}
   * @throws Error if required parameters are missing or invalid
   */
  async getSellerStandardsProfile(program: string, cycle: string) {
    // Input validation
    if (!program || typeof program !== 'string') {
      throw new Error('program is required and must be a string');
    }
    if (!cycle || typeof cycle !== 'string') {
      throw new Error('cycle is required and must be a string');
    }

    try {
      return await this.client.get(
        `${this.basePath}/seller_standards_profile/${program}/${cycle}`
      );
    } catch (error) {
      throw new Error(
        `Failed to get seller standards profile: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Get customer service metrics
   * Endpoint: GET /customer_service_metric/{customer_service_metric_type}/{evaluation_type}
   * @throws Error if required parameters are missing or invalid
   */
  async getCustomerServiceMetric(
    customerServiceMetricType: string,
    evaluationType: string,
    evaluationMarketplaceId: string
  ) {
    // Input validation
    if (!customerServiceMetricType || typeof customerServiceMetricType !== 'string') {
      throw new Error('customerServiceMetricType is required and must be a string');
    }
    if (!evaluationType || typeof evaluationType !== 'string') {
      throw new Error('evaluationType is required and must be a string');
    }
    if (!evaluationMarketplaceId || typeof evaluationMarketplaceId !== 'string') {
      throw new Error('evaluationMarketplaceId is required and must be a string');
    }

    const params = {
      evaluation_marketplace_id: evaluationMarketplaceId
    };

    try {
      return await this.client.get(
        `${this.basePath}/customer_service_metric/${customerServiceMetricType}/${evaluationType}`,
        params
      );
    } catch (error) {
      throw new Error(
        `Failed to get customer service metric: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}

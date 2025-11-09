import type {
  AdGroupRequest,
  BulkCreateAdRequest,
  BulkCreateAdsByInventoryReferenceRequest,
  BulkCreateKeywordsRequest,
  BulkDeleteAdRequest,
  BulkDeleteAdsByInventoryReferenceRequest,
  BulkDeleteKeywordsRequest,
  BulkUpdateAdStatusByListingIdRequest,
  BulkUpdateAdStatusRequest,
  BulkUpdateKeywordBidsRequest,
  CloneAdGroupRequest,
  CloneAdRequest,
  CloneCampaignRequest,
  CreateAdRequest,
  CreateAdsByInventoryReferenceRequest,
  CreateCampaignRequest,
  CreateKeywordRequest,
  ItemPromotion,
  SuggestKeywordsRequest,
  UpdateAdGroupBidsRequest,
  UpdateAdGroupKeywordsRequest,
  UpdateBidPercentageRequest,
  UpdateCampaignIdentificationRequest,
} from "../../types/ebay/sell/marketing-and-promotions/marketing-api-types.js";
import type {
  Ad,
  AdGroup,
  AdGroupPagedCollection,
  AdPagedCollectionResponse,
  AdReferences,
  Ads,
  BaseResponse,
  BulkAdResponse,
  BulkAdUpdateResponse,
  BulkAdUpdateStatusByListingIdResponse,
  BulkAdUpdateStatusResponse,
  BulkCreateAdsByInventoryReferenceResponse,
  BulkCreateKeywordsResponse,
  BulkDeleteAdResponse,
  BulkDeleteAdsByInventoryReferenceResponse,
  BulkDeleteKeywordsResponse,
  BulkUpdateAdsByInventoryReferenceResponse,
  BulkUpdateKeywordBidsResponse,
  Campaign,
  CampaignPagedCollectionResponse,
  CreateKeywordResponse,
  ItemPromotionsPagedCollection,
  Keyword,
  KeywordPagedCollection,
  SuggestedBids,
  SuggestedKeywords,
} from "../../types/ebay/sell/marketing-and-promotions/marketing-response-types.js";
import type { EbayApiClient } from "../client.js";

/**
 * Marketing API - Marketing campaigns and promotions
 * Based on: docs/sell-apps/marketing-and-promotions/sell_marketing_v1_oas3.json
 */
export class MarketingApi {
  private readonly basePath = "/sell/marketing/v1";

  constructor(private client: EbayApiClient) { }

  /**
   * Get campaigns
   */
  async getCampaigns(
    campaignStatus?: string,
    marketplaceId?: string,
    limit?: number,
  ): Promise<CampaignPagedCollectionResponse> {
    const params: Record<string, string | number> = {};
    if (campaignStatus) params.campaign_status = campaignStatus;
    if (marketplaceId) params.marketplace_id = marketplaceId;
    if (limit) params.limit = limit;
    return this.client.get<CampaignPagedCollectionResponse>(
      `${this.basePath}/ad_campaign`,
      params,
    );
  }

  /**
   * Get a specific campaign
   */
  async getCampaign(campaignId: string): Promise<Campaign> {
    return this.client.get<Campaign>(
      `${this.basePath}/ad_campaign/${campaignId}`,
    );
  }

  /**
   * Create a campaign
   */
  async createCampaign(campaign: CreateCampaignRequest): Promise<BaseResponse> {
    return this.client.post<BaseResponse>(
      `${this.basePath}/ad_campaign`,
      campaign,
    );
  }

  /**
   * Get promotions
   */
  async getPromotions(
    marketplaceId?: string,
    limit?: number,
  ): Promise<ItemPromotionsPagedCollection> {
    const params: Record<string, string | number> = {};
    if (marketplaceId) params.marketplace_id = marketplaceId;
    if (limit) params.limit = limit;
    return this.client.get<ItemPromotionsPagedCollection>(
      `${this.basePath}/promotion`,
      params,
    );
  }

  /**
   * Create a promotion (item promotion)
   */
  async createPromotion(promotion: ItemPromotion): Promise<BaseResponse> {
    return this.client.post<BaseResponse>(
      `${this.basePath}/item_promotion`,
      promotion,
    );
  }

  /**
   * Get ads for a campaign
   */
  async getAds(
    campaignId: string,
    adGroupIds?: string,
    adStatus?: string,
    limit?: number,
    listingIds?: string,
    offset?: number,
  ): Promise<AdPagedCollectionResponse> {
    const params: Record<string, string | number> = {};
    if (adGroupIds) params.ad_group_ids = adGroupIds;
    if (adStatus) params.ad_status = adStatus;
    if (limit) params.limit = limit;
    if (listingIds) params.listing_ids = listingIds;
    if (offset) params.offset = offset;
    return this.client.get<AdPagedCollectionResponse>(
      `${this.basePath}/ad_campaign/${campaignId}/ad`,
      params,
    );
  }

  /**
   * Create an ad for a campaign
   */
  async createAd(
    campaignId: string,
    ad: CreateAdRequest,
  ): Promise<BaseResponse> {
    return this.client.post<BaseResponse>(
      `${this.basePath}/ad_campaign/${campaignId}/ad`,
      ad,
    );
  }

  /**
   * Create ads by inventory reference for a campaign
   */
  async createAdsByInventoryReference(
    campaignId: string,
    ads: CreateAdsByInventoryReferenceRequest,
  ): Promise<AdReferences> {
    return this.client.post<AdReferences>(
      `${this.basePath}/ad_campaign/${campaignId}/create_ads_by_inventory_reference`,
      ads,
    );
  }

  /**
   * Get a specific ad for a campaign
   */
  async getAd(campaignId: string, adId: string): Promise<Ad> {
    return this.client.get<Ad>(
      `${this.basePath}/ad_campaign/${campaignId}/ad/${adId}`,
    );
  }

  /**
   * Delete a specific ad from a campaign
   */
  async deleteAd(campaignId: string, adId: string): Promise<void> {
    return this.client.delete<void>(
      `${this.basePath}/ad_campaign/${campaignId}/ad/${adId}`,
    );
  }

  /**
   * Clone an ad for a campaign
   */
  async cloneAd(
    campaignId: string,
    adId: string,
    ad: CloneAdRequest,
  ): Promise<BaseResponse> {
    return this.client.post<BaseResponse>(
      `${this.basePath}/ad_campaign/${campaignId}/ad/${adId}/clone`,
      ad,
    );
  }

  /**
   * Get ads by inventory reference for a campaign
   */
  async getAdsByInventoryReference(
    campaignId: string,
    inventoryReferenceId: string,
    inventoryReferenceType: string,
  ): Promise<Ads> {
    const params: Record<string, string> = {
      inventory_reference_id: inventoryReferenceId,
      inventory_reference_type: inventoryReferenceType,
    };
    return this.client.get<Ads>(
      `${this.basePath}/ad_campaign/${campaignId}/get_ads_by_inventory_reference`,
      params,
    );
  }

  /**
   * Get ads by listing ID for a campaign
   */
  async getAdsByListingId(campaignId: string, listingId: string): Promise<Ads> {
    const params: Record<string, string> = {
      listing_id: listingId,
    };
    return this.client.get<Ads>(
      `${this.basePath}/ad_campaign/${campaignId}/get_ads_by_listing_id`,
      params,
    );
  }

  /**
   * Update the bid for an ad in a campaign
   */
  async updateBid(
    campaignId: string,
    adId: string,
    bid: UpdateBidPercentageRequest,
  ): Promise<void> {
    return this.client.post<void>(
      `${this.basePath}/ad_campaign/${campaignId}/ad/${adId}/update_bid`,
      bid,
    );
  }

  /**
   * Clone a campaign
   */
  async cloneCampaign(
    campaignId: string,
    campaign: CloneCampaignRequest,
  ): Promise<BaseResponse> {
    return this.client.post<BaseResponse>(
      `${this.basePath}/ad_campaign/${campaignId}/clone`,
      campaign,
    );
  }

  /**
   * End a campaign
   */
  async endCampaign(campaignId: string): Promise<void> {
    return this.client.post<void>(
      `${this.basePath}/ad_campaign/${campaignId}/end`,
      {},
    );
  }

  /**
   * Get campaign by name
   */
  async getCampaignByName(campaignName: string): Promise<Campaign> {
    const params: Record<string, string> = {
      campaign_name: campaignName,
    };
    return this.client.get<Campaign>(
      `${this.basePath}/ad_campaign/get_campaign_by_name`,
      params,
    );
  }

  /**
   * Bulk create ads by inventory reference
   */
  async bulkCreateAdsByInventoryReference(
    campaignId: string,
    body: BulkCreateAdsByInventoryReferenceRequest,
  ): Promise<BulkCreateAdsByInventoryReferenceResponse> {
    return this.client.post<BulkCreateAdsByInventoryReferenceResponse>(
      `${this.basePath}/ad_campaign/${campaignId}/bulk_create_ads_by_inventory_reference`,
      body,
    );
  }

  /**
   * Bulk create ads by listing id
   */
  async bulkCreateAdsByListingId(
    campaignId: string,
    body: BulkCreateAdRequest,
  ): Promise<BulkAdResponse> {
    return this.client.post<BulkAdResponse>(
      `${this.basePath}/ad_campaign/${campaignId}/bulk_create_ads_by_listing_id`,
      body,
    );
  }

  /**
   * Bulk delete ads by inventory reference
   */
  async bulkDeleteAdsByInventoryReference(
    campaignId: string,
    body: BulkDeleteAdsByInventoryReferenceRequest,
  ): Promise<BulkDeleteAdsByInventoryReferenceResponse> {
    return this.client.post<BulkDeleteAdsByInventoryReferenceResponse>(
      `${this.basePath}/ad_campaign/${campaignId}/bulk_delete_ads_by_inventory_reference`,
      body,
    );
  }

  /**
   * Bulk delete ads by listing id
   */
  async bulkDeleteAdsByListingId(
    campaignId: string,
    body: BulkDeleteAdRequest,
  ): Promise<BulkDeleteAdResponse> {
    return this.client.post<BulkDeleteAdResponse>(
      `${this.basePath}/ad_campaign/${campaignId}/bulk_delete_ads_by_listing_id`,
      body,
    );
  }

  /**
   * Bulk update ads bid by inventory reference
   */
  async bulkUpdateAdsBidByInventoryReference(
    campaignId: string,
    body: BulkCreateAdsByInventoryReferenceRequest,
  ): Promise<BulkUpdateAdsByInventoryReferenceResponse> {
    return this.client.post<BulkUpdateAdsByInventoryReferenceResponse>(
      `${this.basePath}/ad_campaign/${campaignId}/bulk_update_ads_bid_by_inventory_reference`,
      body,
    );
  }

  /**
   * Bulk update ads bid by listing id
   */
  async bulkUpdateAdsBidByListingId(
    campaignId: string,
    body: BulkCreateAdRequest,
  ): Promise<BulkAdUpdateResponse> {
    return this.client.post<BulkAdUpdateResponse>(
      `${this.basePath}/ad_campaign/${campaignId}/bulk_update_ads_bid_by_listing_id`,
      body,
    );
  }

  /**
   * Bulk update ads status
   */
  async bulkUpdateAdsStatus(
    campaignId: string,
    body: BulkUpdateAdStatusRequest,
  ): Promise<BulkAdUpdateStatusResponse> {
    return this.client.post<BulkAdUpdateStatusResponse>(
      `${this.basePath}/ad_campaign/${campaignId}/bulk_update_ads_status`,
      body,
    );
  }

  /**
   * Bulk update ads status by listing id
   */
  async bulkUpdateAdsStatusByListingId(
    campaignId: string,
    body: BulkUpdateAdStatusByListingIdRequest,
  ): Promise<BulkAdUpdateStatusByListingIdResponse> {
    return this.client.post<BulkAdUpdateStatusByListingIdResponse>(
      `${this.basePath}/ad_campaign/${campaignId}/bulk_update_ads_status_by_listing_id`,
      body,
    );
  }

  /**
   * Pause a campaign
   */
  async pauseCampaign(campaignId: string): Promise<void> {
    return this.client.post<void>(
      `${this.basePath}/ad_campaign/${campaignId}/pause`,
      {},
    );
  }

  /**
   * Resume a campaign
   */
  async resumeCampaign(campaignId: string): Promise<void> {
    return this.client.post<void>(
      `${this.basePath}/ad_campaign/${campaignId}/resume`,
      {},
    );
  }

  /**
   * Update campaign identification
   */
  async updateCampaignIdentification(
    campaignId: string,
    body: UpdateCampaignIdentificationRequest,
  ): Promise<void> {
    return this.client.put<void>(
      `${this.basePath}/ad_campaign/${campaignId}/update_campaign_identification`,
      body,
    );
  }

  /**
   * Create an ad group
   */
  async createAdGroup(
    campaignId: string,
    body: AdGroupRequest,
  ): Promise<BaseResponse> {
    return this.client.post<BaseResponse>(
      `${this.basePath}/ad_campaign/${campaignId}/ad_group`,
      body,
    );
  }

  /**
   * Clone an ad group
   */
  async cloneAdGroup(
    campaignId: string,
    adGroupId: string,
    body: CloneAdGroupRequest,
  ): Promise<BaseResponse> {
    return this.client.post<BaseResponse>(
      `${this.basePath}/ad_campaign/${campaignId}/ad_group/${adGroupId}/clone`,
      body,
    );
  }

  /**
   * Get ad groups
   */
  async getAdGroups(
    campaignId: string,
    adGroupStatus?: string,
    limit?: number,
    offset?: number,
  ): Promise<AdGroupPagedCollection> {
    const params: Record<string, string | number> = {};
    if (adGroupStatus) params.ad_group_status = adGroupStatus;
    if (limit) params.limit = limit;
    if (offset) params.offset = offset;
    return this.client.get<AdGroupPagedCollection>(
      `${this.basePath}/ad_campaign/${campaignId}/ad_group`,
      params,
    );
  }

  /**
   * Get an ad group
   */
  async getAdGroup(campaignId: string, adGroupId: string): Promise<AdGroup> {
    return this.client.get<AdGroup>(
      `${this.basePath}/ad_campaign/${campaignId}/ad_group/${adGroupId}`,
    );
  }

  /**
   * Suggest bids for an ad group
   */
  async suggestBids(
    campaignId: string,
    adGroupId: string,
  ): Promise<SuggestedBids> {
    return this.client.post<SuggestedBids>(
      `${this.basePath}/ad_campaign/${campaignId}/ad_group/${adGroupId}/suggest_bids`,
      {},
    );
  }

  /**
   * Update ad group bids
   */
  async updateAdGroupBids(
    campaignId: string,
    adGroupId: string,
    body: UpdateAdGroupBidsRequest,
  ): Promise<void> {
    return this.client.post<void>(
      `${this.basePath}/ad_campaign/${campaignId}/ad_group/${adGroupId}/update_ad_group_bids`,
      body,
    );
  }

  /**
   * Update ad group keywords
   */
  async updateAdGroupKeywords(
    campaignId: string,
    adGroupId: string,
    body: UpdateAdGroupKeywordsRequest,
  ): Promise<void> {
    return this.client.post<void>(
      `${this.basePath}/ad_campaign/${campaignId}/ad_group/${adGroupId}/update_ad_group_keywords`,
      body,
    );
  }

  /**
   * Suggest keywords
   */
  async suggestKeywords(
    campaignId: string,
    adGroupId: string,
    body: SuggestKeywordsRequest,
  ): Promise<SuggestedKeywords> {
    return this.client.post<SuggestedKeywords>(
      `${this.basePath}/ad_campaign/${campaignId}/ad_group/${adGroupId}/suggest_keywords`,
      body,
    );
  }

  /**
   * Get keywords
   */
  async getKeywords(
    campaignId: string,
    adGroupId: string,
    keywordStatus?: string,
    limit?: number,
    offset?: number,
  ): Promise<KeywordPagedCollection> {
    const params: Record<string, string | number> = {};
    if (keywordStatus) params.keyword_status = keywordStatus;
    if (limit) params.limit = limit;
    if (offset) params.offset = offset;
    return this.client.get<KeywordPagedCollection>(
      `${this.basePath}/ad_campaign/${campaignId}/ad_group/${adGroupId}/keyword`,
      params,
    );
  }

  /**
   * Bulk create keywords
   */
  async bulkCreateKeywords(
    campaignId: string,
    adGroupId: string,
    body: BulkCreateKeywordsRequest,
  ): Promise<BulkCreateKeywordsResponse> {
    return this.client.post<BulkCreateKeywordsResponse>(
      `${this.basePath}/ad_campaign/${campaignId}/ad_group/${adGroupId}/bulk_create_keywords`,
      body,
    );
  }

  /**
   * Bulk delete keywords
   */
  async bulkDeleteKeywords(
    campaignId: string,
    adGroupId: string,
    body: BulkDeleteKeywordsRequest,
  ): Promise<BulkDeleteKeywordsResponse> {
    return this.client.post<BulkDeleteKeywordsResponse>(
      `${this.basePath}/ad_campaign/${campaignId}/ad_group/${adGroupId}/bulk_delete_keywords`,
      body,
    );
  }

  /**
   * Bulk update keyword bids
   */
  async bulkUpdateKeywordBids(
    campaignId: string,
    adGroupId: string,
    body: BulkUpdateKeywordBidsRequest,
  ): Promise<BulkUpdateKeywordBidsResponse> {
    return this.client.post<BulkUpdateKeywordBidsResponse>(
      `${this.basePath}/ad_campaign/${campaignId}/ad_group/${adGroupId}/bulk_update_keyword_bids`,
      body,
    );
  }

  /**
   * Create a keyword
   */
  async createKeyword(
    campaignId: string,
    adGroupId: string,
    body: CreateKeywordRequest,
  ): Promise<CreateKeywordResponse> {
    return this.client.post<CreateKeywordResponse>(
      `${this.basePath}/ad_campaign/${campaignId}/ad_group/${adGroupId}/create_keyword`,
      body,
    );
  }

  /**
   * Get a keyword
   */
  async getKeyword(
    campaignId: string,
    adGroupId: string,
    keywordId: string,
  ): Promise<Keyword> {
    return this.client.get<Keyword>(
      `${this.basePath}/ad_campaign/${campaignId}/ad_group/${adGroupId}/keyword/${keywordId}`,
    );
  }

  /**
   * Delete a keyword
   */
  async deleteKeyword(
    campaignId: string,
    adGroupId: string,
    keywordId: string,
  ): Promise<void> {
    return this.client.delete<void>(
      `${this.basePath}/ad_campaign/${campaignId}/ad_group/${adGroupId}/keyword/${keywordId}`,
    );
  }

  /**
   * Update a keyword's bid
   */
  async updateKeywordBid(
    campaignId: string,
    adGroupId: string,
    keywordId: string,
    body: UpdateBidRequest,
  ): Promise<void> {
    return this.client.post<void>(
      `${this.basePath}/ad_campaign/${campaignId}/ad_group/${adGroupId}/keyword/${keywordId}/update_bid`,
      body,
    );
  }

  /**
   * Get ad report
   */
  async getAdReport(
    dimension: string,
    metric: string,
    startDate: string,
    endDate: string,
    sort?: string,
    listingIds?: string,
    marketplaceId?: string,
  ): Promise<Report> {
    const params: Record<string, string> = {
      dimension,
      metric,
      start_date: startDate,
      end_date: endDate,
    };
    if (sort) params.sort = sort;
    if (listingIds) params.listing_ids = listingIds;
    if (marketplaceId) params.marketplace_id = marketplaceId;
    return this.client.get<Report>(`${this.basePath}/ad_report`, params);
  }

  /**
   * Get ad report metadata
   */
  async getAdReportMetadata(): Promise<ReportMetadatas> {
    return this.client.get<ReportMetadatas>(
      `${this.basePath}/ad_report_metadata`,
    );
  }

  /**
   * Get ad report metadata for a report type
   */
  async getAdReportMetadataForReportType(
    reportType: string,
  ): Promise<ReportMetadata> {
    return this.client.get<ReportMetadata>(
      `${this.basePath}/ad_report_metadata/${reportType}`,
    );
  }
}

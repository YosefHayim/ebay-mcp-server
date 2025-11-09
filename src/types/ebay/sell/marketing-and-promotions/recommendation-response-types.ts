/**
 * Recommendation API Response Types
 * Based on: docs/sell-apps/markeitng-and-promotions/sell_recommendation_v1_oas3.json
 */

/**
 * Marketing recommendation details
 */
export interface MarketingRecommendation {
  /**
   * Ad recommendation details
   */
  ad?: AdRecommendation;
}

/**
 * Ad recommendation
 */
export interface AdRecommendation {
  /**
   * The recommended bid percentage for Promoted Listings
   */
  bidPercentage?: string;
  /**
   * Indicates whether eBay recommends promoting this listing (RECOMMENDED or UNDETERMINED)
   */
  promoteWithAd?: string;
}

/**
 * Listing recommendation
 */
export interface ListingRecommendation {
  /**
   * The listing ID for which recommendations are provided
   */
  listingId?: string;
  /**
   * Marketing recommendations for the listing
   */
  marketing?: MarketingRecommendation;
}

/**
 * Paged collection of listing recommendations
 */
export interface PagedListingRecommendationCollection {
  /**
   * URI of the current page
   */
  href?: string;
  /**
   * Maximum number of recommendations per page
   */
  limit?: number;
  /**
   * Array of listing recommendations
   */
  listingRecommendations?: ListingRecommendation[];
  /**
   * URI to the next page
   */
  next?: string;
  /**
   * Number of results skipped
   */
  offset?: number;
  /**
   * URI to the previous page
   */
  prev?: string;
  /**
   * Total number of recommendations
   */
  total?: number;
}

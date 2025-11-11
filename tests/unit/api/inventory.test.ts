import { describe, it, expect, vi, beforeEach } from 'vitest';
import { InventoryApi } from '../../../src/api/listing-management/inventory.js';
import type { EbayApiClient } from '../../../src/api/client.js';

describe('InventoryApi', () => {
  let client: EbayApiClient;
  let api: InventoryApi;

  beforeEach(() => {
    client = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn()
    } as unknown as EbayApiClient;
    api = new InventoryApi(client);
  });

  describe('getInventoryItems', () => {
    it('should get all inventory items without parameters', async () => {
      const mockResponse = { inventoryItems: [] };
      vi.mocked(client.get).mockResolvedValue(mockResponse);

      await api.getInventoryItems();

      expect(client.get).toHaveBeenCalledWith('/sell/inventory/v1/inventory_item', {});
    });

    it('should get inventory items with limit and offset', async () => {
      const mockResponse = { inventoryItems: [] };
      vi.mocked(client.get).mockResolvedValue(mockResponse);

      await api.getInventoryItems(10, 5);

      expect(client.get).toHaveBeenCalledWith('/sell/inventory/v1/inventory_item', {
        limit: 10,
        offset: 5
      });
    });

    it('should throw error for invalid limit', async () => {
      await expect(api.getInventoryItems(0)).rejects.toThrow(
        'limit must be a positive number'
      );
    });

    it('should throw error for negative offset', async () => {
      await expect(api.getInventoryItems(10, -1)).rejects.toThrow(
        'offset must be a non-negative number'
      );
    });
  });

  describe('getInventoryItem', () => {
    it('should get inventory item by SKU', async () => {
      const mockResponse = { sku: 'TEST-SKU' };
      vi.mocked(client.get).mockResolvedValue(mockResponse);

      await api.getInventoryItem('TEST-SKU');

      expect(client.get).toHaveBeenCalledWith('/sell/inventory/v1/inventory_item/TEST-SKU');
    });

    it('should throw error when SKU is missing', async () => {
      await expect(api.getInventoryItem('')).rejects.toThrow('sku is required');
    });

    it('should handle errors when getting item', async () => {
      vi.mocked(client.get).mockRejectedValue(new Error('Not Found'));

      await expect(api.getInventoryItem('TEST-SKU')).rejects.toThrow(
        'Failed to get inventory item: Not Found'
      );
    });
  });

  describe('createOrReplaceInventoryItem', () => {
    it('should create or replace inventory item', async () => {
      const inventoryItem = {
        product: { title: 'Test Product' },
        condition: 'NEW' as const
      };
      vi.mocked(client.put).mockResolvedValue(undefined);

      await api.createOrReplaceInventoryItem('TEST-SKU', inventoryItem);

      expect(client.put).toHaveBeenCalledWith(
        '/sell/inventory/v1/inventory_item/TEST-SKU',
        inventoryItem
      );
    });

    it('should throw error when SKU is missing', async () => {
      await expect(api.createOrReplaceInventoryItem('', {} as any)).rejects.toThrow(
        'sku is required'
      );
    });

    it('should throw error when inventory item is missing', async () => {
      await expect(
        api.createOrReplaceInventoryItem('TEST-SKU', undefined as any)
      ).rejects.toThrow('inventoryItem is required');
    });
  });

  describe('deleteInventoryItem', () => {
    it('should delete inventory item', async () => {
      vi.mocked(client.delete).mockResolvedValue(undefined);

      await api.deleteInventoryItem('TEST-SKU');

      expect(client.delete).toHaveBeenCalledWith('/sell/inventory/v1/inventory_item/TEST-SKU');
    });

    it('should throw error when SKU is missing', async () => {
      await expect(api.deleteInventoryItem('')).rejects.toThrow('sku is required');
    });
  });

  describe('getOffers', () => {
    it('should get all offers without parameters', async () => {
      const mockResponse = { offers: [] };
      vi.mocked(client.get).mockResolvedValue(mockResponse);

      await api.getOffers();

      expect(client.get).toHaveBeenCalledWith('/sell/inventory/v1/offer', {});
    });

    it('should get offers with parameters', async () => {
      const mockResponse = { offers: [] };
      vi.mocked(client.get).mockResolvedValue(mockResponse);

      await api.getOffers('TEST-SKU', 'EBAY_US', 10);

      expect(client.get).toHaveBeenCalledWith('/sell/inventory/v1/offer', {
        sku: 'TEST-SKU',
        marketplace_id: 'EBAY_US',
        limit: 10
      });
    });
  });

  describe('createOffer', () => {
    it('should create offer', async () => {
      const mockResponse = { offerId: 'OFFER123' };
      const offer = {
        sku: 'TEST-SKU',
        marketplaceId: 'EBAY_US',
        format: 'FIXED_PRICE' as const,
        categoryId: '123',
        listingPolicies: {
          fulfillmentPolicyId: 'FP123',
          paymentPolicyId: 'PP123',
          returnPolicyId: 'RP123'
        },
        pricingSummary: {
          price: { value: '10.00', currency: 'USD' }
        }
      };
      vi.mocked(client.post).mockResolvedValue(mockResponse);

      await api.createOffer(offer);

      expect(client.post).toHaveBeenCalledWith('/sell/inventory/v1/offer', offer);
    });

    it('should throw error when offer data is missing', async () => {
      await expect(api.createOffer(undefined as any)).rejects.toThrow('offer is required');
    });
  });

  describe('publishOffer', () => {
    it('should publish offer', async () => {
      const mockResponse = { listingId: 'LISTING123' };
      vi.mocked(client.post).mockResolvedValue(mockResponse);

      await api.publishOffer('OFFER123');

      expect(client.post).toHaveBeenCalledWith(
        '/sell/inventory/v1/offer/OFFER123/publish'
      );
    });

    it('should throw error when offerId is missing', async () => {
      await expect(api.publishOffer('')).rejects.toThrow('offerId is required');
    });
  });

  describe('withdrawOffer', () => {
    it('should withdraw offer', async () => {
      const mockResponse = { listingId: 'LISTING123' };
      vi.mocked(client.post).mockResolvedValue(mockResponse);

      await api.withdrawOffer('OFFER123');

      expect(client.post).toHaveBeenCalledWith(
        '/sell/inventory/v1/offer/OFFER123/withdraw',
        {}
      );
    });

    it('should throw error when offerId is missing', async () => {
      await expect(api.withdrawOffer('')).rejects.toThrow('offerId is required');
    });
  });

  describe('deleteOffer', () => {
    it('should delete offer', async () => {
      vi.mocked(client.delete).mockResolvedValue(undefined);

      await api.deleteOffer('OFFER123');

      expect(client.delete).toHaveBeenCalledWith('/sell/inventory/v1/offer/OFFER123');
    });

    it('should throw error when offerId is missing', async () => {
      await expect(api.deleteOffer('')).rejects.toThrow('offerId is required');
    });
  });

  describe('getInventoryLocations', () => {
    it('should get all inventory locations', async () => {
      const mockResponse = { locations: [] };
      vi.mocked(client.get).mockResolvedValue(mockResponse);

      await api.getInventoryLocations();

      expect(client.get).toHaveBeenCalledWith('/sell/inventory/v1/location', {});
    });

    it('should get inventory locations with limit and offset', async () => {
      const mockResponse = { locations: [] };
      vi.mocked(client.get).mockResolvedValue(mockResponse);

      await api.getInventoryLocations(10, 5);

      expect(client.get).toHaveBeenCalledWith('/sell/inventory/v1/location', {
        limit: 10,
        offset: 5
      });
    });
  });

  describe('createOrReplaceInventoryLocation', () => {
    it('should create or replace inventory location', async () => {
      const location = {
        locationTypes: ['WAREHOUSE'],
        name: 'Main Warehouse',
        location: {
          address: {
            addressLine1: '123 Main St',
            city: 'San Jose',
            stateOrProvince: 'CA',
            postalCode: '95113',
            country: 'US'
          }
        }
      };
      vi.mocked(client.post).mockResolvedValue(undefined);

      await api.createOrReplaceInventoryLocation('WAREHOUSE_1', location);

      expect(client.post).toHaveBeenCalledWith(
        '/sell/inventory/v1/location/WAREHOUSE_1',
        location
      );
    });

    it('should throw error when location key is missing', async () => {
      await expect(api.createOrReplaceInventoryLocation('', {} as any)).rejects.toThrow(
        'merchantLocationKey is required'
      );
    });

    it('should throw error when location data is missing', async () => {
      await expect(
        api.createOrReplaceInventoryLocation('WAREHOUSE_1', undefined as any)
      ).rejects.toThrow('location is required');
    });
  });

  describe('deleteInventoryLocation', () => {
    it('should delete inventory location', async () => {
      vi.mocked(client.delete).mockResolvedValue(undefined);

      await api.deleteInventoryLocation('WAREHOUSE_1');

      expect(client.delete).toHaveBeenCalledWith('/sell/inventory/v1/location/WAREHOUSE_1');
    });

    it('should throw error when location key is missing', async () => {
      await expect(api.deleteInventoryLocation('')).rejects.toThrow(
        'merchantLocationKey is required'
      );
    });
  });

  describe('bulkCreateOrReplaceInventoryItem', () => {
    it('should bulk create or replace inventory items', async () => {
      const mockResponse = { responses: [] };
      const requests = {
        requests: [
          {
            sku: 'SKU1',
            product: { title: 'Product 1' },
            condition: 'NEW' as const
          },
          {
            sku: 'SKU2',
            product: { title: 'Product 2' },
            condition: 'NEW' as const
          }
        ]
      };
      vi.mocked(client.post).mockResolvedValue(mockResponse);

      await api.bulkCreateOrReplaceInventoryItem(requests);

      expect(client.post).toHaveBeenCalledWith(
        '/sell/inventory/v1/bulk_create_or_replace_inventory_item',
        requests
      );
    });

    it('should throw error when requests are missing', async () => {
      await expect(
        api.bulkCreateOrReplaceInventoryItem(undefined as any)
      ).rejects.toThrow('requests is required and must be an object');
    });
  });

  describe('bulkUpdatePriceQuantity', () => {
    it('should bulk update price and quantity', async () => {
      const mockResponse = { responses: [] };
      const requests = {
        requests: [
          {
            offerId: 'OFFER1',
            availableQuantity: 10,
            pricingSummary: {
              price: { value: '15.00', currency: 'USD' }
            }
          }
        ]
      };
      vi.mocked(client.post).mockResolvedValue(mockResponse);

      await api.bulkUpdatePriceQuantity(requests);

      expect(client.post).toHaveBeenCalledWith(
        '/sell/inventory/v1/bulk_update_price_quantity',
        requests
      );
    });

    it('should throw error when requests are missing', async () => {
      await expect(
        api.bulkUpdatePriceQuantity(undefined as any)
      ).rejects.toThrow('requests is required and must be an object');
    });
  });
});

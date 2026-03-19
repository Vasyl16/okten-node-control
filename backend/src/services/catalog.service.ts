import * as brandRequestRepo from '../db/repos/brand-request.repo';
import * as brandRepo from '../db/repos/brand.repo';
import * as modelRequestRepo from '../db/repos/model-request.repo';
import * as modelRepo from '../db/repos/model.repo';
import * as regionRepo from '../db/repos/region.repo';

export class CatalogService {
  getBrands() {
    return brandRepo.getAllBrands();
  }

  getModelsByBrandId(brandId: number) {
    return modelRepo.getModelsByBrandId(brandId);
  }

  getRegions() {
    return regionRepo.getAllRegions();
  }

  createBrand(name: string) {
    return brandRepo.createBrand(name);
  }

  createModel(brandId: number, name: string) {
    return modelRepo.createModel(name, brandId);
  }

  createBrandRequest(userId: string, requestedName: string, comment?: string) {
    return brandRequestRepo.createBrandRequest({
      userId,
      requestedName,
      comment,
    });
  }

  createModelRequest(
    userId: string,
    brandId: number,
    requestedName: string,
    comment?: string,
  ) {
    return modelRequestRepo.createModelRequest({
      userId,
      brandId,
      requestedName,
      comment,
    });
  }

  getBrandRequests() {
    return brandRequestRepo.getBrandRequests();
  }

  getModelRequests() {
    return modelRequestRepo.getModelRequests();
  }
}

export const catalogService = new CatalogService();

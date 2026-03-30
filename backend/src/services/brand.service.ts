import * as brandRepo from '../db/repos/brand.repo';
import * as brandRequestRepo from '../db/repos/brand-request.repo';

class BrandService {
  getBrands() {
    return brandRepo.getAllBrands();
  }

  createBrand(name: string) {
    return brandRepo.createBrand(name);
  }

  createBrandRequest(userId: string, requestedName: string, comment?: string) {
    return brandRequestRepo.createBrandRequest({
      userId,
      requestedName,
      comment,
    });
  }

  getBrandRequests() {
    return brandRequestRepo.getBrandRequests();
  }
}

export const brandService = new BrandService();


import * as regionRepo from '../db/repos/region.repo';

export class CatalogService {
  getRegions() {
    return regionRepo.getAllRegions();
  }
}

export const catalogService = new CatalogService();

import * as modelRequestRepo from '../db/repos/model-request.repo';
import * as modelRepo from '../db/repos/model.repo';

class ModelService {
  getModelsByBrandId(brandId: number) {
    return modelRepo.getModelsByBrandId(brandId);
  }

  createModel(brandId: number, name: string) {
    return modelRepo.createModel(name, brandId);
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

  getModelRequests() {
    return modelRequestRepo.getModelRequests();
  }
}

export const modelService = new ModelService();


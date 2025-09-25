export interface PhotoDefinition {
  id: string;
  name: string;
  description: string | null;
  isRequired: boolean;
  allowGallery: boolean;
  order: number;
  photoGroupId: string;
  createdAt: string;
  updatedAt: string;
}

export interface PhotoGroup {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  isDefault: boolean;
  companyId: string;
  createdAt: string;
  updatedAt: string;
  photoDefinitions?: PhotoDefinition[];
}

export interface CreatePhotoGroupRequest {
  name: string;
  description?: string;
  isDefault?: boolean;
}

export interface UpdatePhotoGroupRequest {
  name?: string;
  description?: string;
  isActive?: boolean;
}

export interface CreatePhotoDefinitionRequest {
  name: string;
  description?: string;
  isRequired: boolean;
  allowGallery: boolean;
  order: number;
}

export interface UpdatePhotoDefinitionRequest {
  name?: string;
  description?: string;
  isRequired?: boolean;
  allowGallery?: boolean;
  order?: number;
}

export interface PhotoDefinitionsResponse {
  photoDefinitions: PhotoDefinition[];
}

export interface PhotoDefinitionResponse {
  photoDefinition: PhotoDefinition;
}

export interface PhotoGroupsResponse {
  photoGroups: PhotoGroup[];
}

export interface PhotoGroupResponse {
  photoGroup: PhotoGroup;
}

export interface ServicePhoto {
  id: string;
  serviceId: string;
  photoDefinitionId: string;
  url: string;
  notes: string | null;
  createdAt: string;
  photoDefinition: PhotoDefinition;
}

// CRUD interfaces for batch operations
export interface CrudPhotoGroupRequest {
  name?: string;
  description?: string;
  isActive?: boolean;
  photoDefinitionsUpdates?: BatchPhotoDefinitionUpdate[];
  photoDefinitionsCreates?: BatchPhotoDefinitionCreate[];
  photoDefinitionsDeletes?: string[];
}

export interface BatchPhotoDefinitionUpdate {
  photoDefinitionId: string;
  name?: string;
  description?: string;
  isRequired?: boolean;
  allowGallery?: boolean;
  order?: number;
}

export interface BatchPhotoDefinitionCreate {
  name: string;
  description?: string;
  isRequired: boolean;
  allowGallery: boolean;
  order?: number;
}

export interface CrudPhotoGroupResponse {
  photoGroup?: PhotoGroup;
  updatedPhotoDefinitions?: PhotoDefinition[];
  createdPhotoDefinitions?: PhotoDefinition[];
  deletedPhotoDefinitionIds?: string[];
}

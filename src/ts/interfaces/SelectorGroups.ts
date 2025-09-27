export interface SelectorGroup {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  isDefault: boolean;
  companyId: string;
  createdAt: string;
  updatedAt: string;
  selectorDefinitions?: SelectorDefinition[];
}

export interface SelectorDefinition {
  id: string;
  question: string;
  description: string | null;
  isRequired: boolean;
  order: number;
  selectorGroupId: string;
  createdAt: string;
  updatedAt: string;
  options?: SelectorOption[];
}

export interface SelectorOption {
  id: string;
  text: string;
  value: string;
  order: number;
  selectorDefinitionId: string;
  createdAt: string;
}

export interface ServiceSelector {
  id: string;
  serviceId: string;
  selectorDefinitionId: string;
  selectedOptionId: string;
  notes: string | null;
  createdAt: string;
  selectorDefinition: SelectorDefinition;
  selectedOption: SelectorOption;
}

// Request/Response interfaces
export interface CreateSelectorGroupRequest {
  name: string;
  description?: string;
  isDefault?: boolean;
  order?: number;
  selectorDefinitions?: CreateSelectorGroupDefinitionRequest[];
}

export interface CreateSelectorGroupDefinitionRequest {
  question: string;
  description?: string;
  isRequired?: boolean;
  order: number;
  options?: CreateSelectorGroupOptionRequest[];
}

export interface CreateSelectorGroupOptionRequest {
  text: string;
  value?: string; // Optional - will be auto-generated if not provided
  order: number;
}

export interface UpdateSelectorGroupRequest {
  name?: string;
  description?: string;
  isActive?: boolean;
}

export interface SelectorGroupsResponse {
  selectorGroups: SelectorGroup[];
}

export interface SelectorGroupResponse {
  selectorGroup: SelectorGroup;
}

// Service Type linking interfaces
export interface LinkSelectorGroupRequest {
  selectorGroupId: string;
  order: number;
}

export interface ServiceTypeSelectorGroupResponse {
  serviceTypeSelectorGroup: {
    id: string;
    serviceTypeId: string;
    selectorGroupId: string;
    order: number;
    createdAt: string;
  };
}

// Selector Definitions interfaces
export interface CreateSelectorDefinitionRequest {
  question: string;
  description?: string;
  isRequired: boolean;
  order?: number;
}

export interface UpdateSelectorDefinitionRequest {
  question?: string;
  description?: string;
  isRequired?: boolean;
  order?: number;
}

export interface SelectorDefinitionsResponse {
  selectorDefinitions: SelectorDefinition[];
}

export interface SelectorDefinitionResponse {
  selectorDefinition: SelectorDefinition;
}

// Selector Options interfaces
export interface CreateSelectorOptionRequest {
  text: string;
  value: string;
  order: number;
}

export interface UpdateSelectorOptionRequest {
  text?: string;
  value?: string;
  order?: number;
}

export interface SelectorOptionsResponse {
  selectorOptions: SelectorOption[];
}

export interface SelectorOptionResponse {
  selectorOption: SelectorOption;
}

// CRUD Interfaces for Batch Operations
export interface CrudSelectorGroupRequest {
  name?: string;
  description?: string;
  isActive?: boolean;
  deleteGroup?: boolean;
  selectorDefinitionsUpdates?: BatchSelectorDefinitionUpdate[];
  selectorDefinitionsCreates?: BatchSelectorDefinitionCreate[];
  selectorDefinitionsDeletes?: string[];
  selectorOptionsUpdates?: BatchSelectorOptionUpdate[];
  selectorOptionsCreates?: BatchSelectorOptionCreate[];
  selectorOptionsDeletes?: string[];
}

export interface BatchSelectorDefinitionUpdate {
  selectorDefinitionId: string;
  question?: string;
  description?: string | null;
  isRequired?: boolean;
  order?: number;
}

export interface BatchSelectorDefinitionCreate {
  question: string;
  description?: string;
  isRequired: boolean;
  order?: number;
  tempId?: string;
}

export interface BatchSelectorOptionUpdate {
  selectorOptionId: string;
  text?: string;
  value?: string;
  order?: number;
}

export interface BatchSelectorOptionCreate {
  selectorDefinitionId: string;
  text: string;
  value: string;
  order?: number;
}

export interface CrudSelectorGroupResponse {
  selectorGroup?: SelectorGroup;
  updatedSelectorDefinitions?: SelectorDefinition[];
  createdSelectorDefinitions?: SelectorDefinition[];
  deletedSelectorDefinitionIds?: string[];
  updatedSelectorOptions?: SelectorOption[];
  createdSelectorOptions?: SelectorOption[];
  deletedSelectorOptionIds?: string[];
}

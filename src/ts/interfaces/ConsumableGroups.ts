export interface ConsumableGroup {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  isDefault: boolean;
  companyId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConsumableDefinition {
  id: string;
  name: string;
  unit: string;
  minValue?: number;
  maxValue?: number;
  step?: number;
  isRequired: boolean;
  description?: string;
  pricePerUnit?: number;
  order: number;
  consumableGroupId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateConsumableGroupRequest {
  name: string;
  description?: string;
  isDefault?: boolean;
}

export interface UpdateConsumableGroupRequest {
  name?: string;
  description?: string;
  isActive?: boolean;
}

export interface CreateConsumableDefinitionRequest {
  name: string;
  unit: string;
  minValue?: number;
  maxValue?: number;
  step?: number;
  isRequired?: boolean;
  description?: string;
  pricePerUnit?: number;
}

export interface UpdateConsumableDefinitionRequest {
  name?: string;
  unit?: string;
  minValue?: number;
  maxValue?: number;
  step?: number;
  isRequired?: boolean;
  description?: string;
  pricePerUnit?: number;
  order?: number;
}

export interface ConsumableGroupsResponse {
  consumableGroups: ConsumableGroup[];
}

export interface ConsumableDefinitionsResponse {
  consumableDefinitions: ConsumableDefinition[];
}

export interface ConsumableGroupResponse {
  consumableGroup: ConsumableGroup;
}

export interface ConsumableDefinitionResponse {
  consumableDefinition: ConsumableDefinition;
}

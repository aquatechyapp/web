export interface ReadingGroup {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  isDefault: boolean;
  companyId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReadingDefinition {
  id: string;
  name: string;
  unit: string;
  minValue?: number;
  maxValue?: number;
  goalValue?: number;
  step?: number;
  isRequired: boolean;
  description?: string;
  order: number;
  readingGroupId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReadingGroupRequest {
  name: string;
  description?: string;
  isDefault?: boolean;
}

export interface UpdateReadingGroupRequest {
  name?: string;
  description?: string;
  isActive?: boolean;
}

export interface CreateReadingDefinitionRequest {
  name: string;
  unit: string;
  minValue?: number;
  maxValue?: number;
  goalValue?: number;
  step?: number;
  isRequired?: boolean;
  description?: string;
}

export interface UpdateReadingDefinitionRequest {
  name?: string;
  unit?: string;
  minValue?: number;
  maxValue?: number;
  goalValue?: number;
  step?: number;
  isRequired?: boolean;
  description?: string;
  order?: number;
}

export interface ReadingGroupsResponse {
  readingGroups: ReadingGroup[];
}

export interface ReadingDefinitionsResponse {
  readingDefinitions: ReadingDefinition[];
}

export interface ReadingGroupResponse {
  readingGroup: ReadingGroup;
}

export interface ReadingDefinitionResponse {
  readingDefinition: ReadingDefinition;
}

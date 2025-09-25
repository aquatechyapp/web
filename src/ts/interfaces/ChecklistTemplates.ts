export interface ChecklistTemplate {
  id: string;
  name: string;
  description?: string | null;
  companyId: string;
  poolId?: string | null;
  isActive: boolean;
  isDefault: boolean;
  createdAt: string;
  items: ChecklistTemplateItem[];
}

export interface ChecklistTemplateItem {
  id: string;
  label: string;
  order: number;
  createdAt: Date;
}

export interface CreateChecklistTemplateRequest {
  companyId: string;
  name: string;
  description?: string;
  items: {
    label: string;
    order: number;
  }[];
  isDefault?: boolean;
}

export interface CreateChecklistTemplateByPoolRequest {
  companyId: string;
  poolId: string;
  name: string;
  description?: string;
  items: {
    label: string;
    order: number;
  }[];
}

export interface UpdateChecklistTemplateRequest {
  name?: string;
  description?: string;
  isActive?: boolean;
  items?: {
    label: string;
    order: number;
  }[];
}

export interface ChecklistTemplatesResponse {
  templates: ChecklistTemplate[];
}

export interface ChecklistTemplateResponse {
  template: ChecklistTemplate;
}

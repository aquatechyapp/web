export interface ServiceTypeEmailPreferences {
  sendAutomaticEmails: boolean;
  header?: string;
  body?: string;
  footer?: string;
  technicianNotes: boolean;
  sendReadingsGroups: boolean;
  sendConsumablesGroups: boolean;
  sendPhotoGroups: boolean;
  sendSelectorsGroups: boolean;
  sendChecklist: boolean;
}

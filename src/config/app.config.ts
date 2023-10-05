interface AppConfigInterface {
  ownerRoles: string[];
  customerRoles: string[];
  tenantRoles: string[];
  tenantName: string;
  applicationName: string;
  addOns: string[];
  ownerAbilities: string[];
  customerAbilities: string[];
  getQuoteUrl: string;
}
export const appConfig: AppConfigInterface = {
  ownerRoles: ['Owner'],
  customerRoles: ['Customer'],
  tenantRoles: ['Owner', 'Web Developer'],
  tenantName: 'Pharmacy',
  applicationName: 'Préparatoire GPF',
  addOns: ['file upload', 'chat', 'notifications', 'file'],
  customerAbilities: ['Read order details', 'Create orders', 'Read form details', 'Update personal information'],
  ownerAbilities: ['Manage orders', 'Manage forms', 'Manage client profiles', 'Manage pharmacies'],
  getQuoteUrl: 'https://app.roq.ai/proposal/a57fb6e4-0a3f-48b4-9075-81ff9bf1d6a7',
};

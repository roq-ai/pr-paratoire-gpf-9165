const mapping: Record<string, string> = {
  'client-profiles': 'client_profile',
  'form-as': 'form_a',
  'form-bs': 'form_b',
  'form-cs': 'form_c',
  'order-currents': 'order_current',
  'order-history-clients': 'order_history_client',
  'order-history-pharmacies': 'order_history_pharmacie',
  'pdf-files': 'pdf_file',
  pharmacies: 'pharmacy',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}

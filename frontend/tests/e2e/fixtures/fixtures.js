import { test as base } from '@playwright/test';
import { apiUtils } from '../../../playwright/api.utils';

export const test = base.extend({
  
  /**
   * Esta fixture proporciona datos para un sponsor de prueba único
   * (nombre y email) y garantiza que será BORRADO de la BBDD
   * al final del test (pase o falle).
   */
  testingSponsor: [async ({ request }, use) => {
    // SETUP  ---
    const sponsorData = {
      name: `Sponsor E2E ${Date.now()}`,
      email: `sponsor-${Date.now()}@example.com`,
      editedName: `Updated Sponsor ${Date.now()}`,
    };

    // EJECUTAR EL TEST ---
    await use(sponsorData);
    
    // TEARDOWN ---
    await apiUtils.deleteSponsorByEmail(request, sponsorData.email);
    
  }, { scope: 'test' }]
});

export { expect } from '@playwright/test';
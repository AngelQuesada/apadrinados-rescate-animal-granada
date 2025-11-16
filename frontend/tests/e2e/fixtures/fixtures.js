import { test as base } from '@playwright/test';
import { apiUtils } from '../../../playwright/api.utils';

export const test = base.extend({
  
  /**
   * Esta fixture proporciona datos para un sponsor de prueba único
   * (nombre y email) y garantiza que será BORRADO de la BBDD
   * al final del test (pase o falle).
   */
  testingSponsors: [async ({ request }, use) => {
    // SETUP  ---
    const dateNow = Date.now();
    const sponsorsData = [{
      name: `Sponsor E2E ${dateNow}`,
      email: `sponsor-${dateNow}@example.com`,
      editedName: `Updated Sponsor ${dateNow}`,
    }, {
      name: `Sponsor E2E ${dateNow+1}`,
      email: `sponsor-${dateNow+1}@example.com`,
      editedName: `Updated Sponsor ${dateNow+1}`,
    }];

    // EJECUTAR EL TEST ---
    await use(sponsorsData);
    
    // TEARDOWN ---
    await apiUtils.deleteSponsorByEmail(request, sponsorsData[0].email);
    await apiUtils.deleteSponsorByEmail(request, sponsorsData[1].email);
    
  }, { scope: 'test' }]
});

export { expect } from '@playwright/test';
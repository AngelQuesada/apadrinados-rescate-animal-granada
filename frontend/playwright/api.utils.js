export const apiUtils = {
  
  /**
   * Llama al endpoint del backend para encontrar el ID de un sponsor por su email.
   */
  getSponsorIdByEmail: async (request, email) => {
    const response = await request.get('/api/wordpress/get-all-sponsors');
    if (!response.ok()) {
      console.error('Error al intentar obtener sponsors');
      return null;
    }
    const body = await response.json();
    // El controlador devuelve un array 'sponsors'
    const sponsor = body.sponsors.find(s => s.email === email);
    return sponsor ? sponsor.id : null;
  },

  /**
   * Llama a tu endpoint de limpieza que borra un sponsor y todas sus
   * relaciones asociadas, usando el email.
   */
  deleteSponsorByEmail: async (request, email) => {
    if (!email) return;
    
    try {
      const response = await request.delete(`/api/wordpress/delete-sponsor-by-email/${email}`);
      if (!response.ok()) {
        console.log(`[Fixture Cleanup] No se encontró sponsor ${email} (ya estaba limpio).`);
      }
    } catch (error) {
      console.error(`[Fixture Cleanup] Error en deleteSponsorByEmail:`, error.message);
    }
  }
};
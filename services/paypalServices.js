const config = require("../config");
const {
  createSubscribersDataStructure,
} = require("../services/helpers/paypalServiceHelpers");

class PayPalService {
  #baseUrl;
  #accessToken;
  #live_mode;

  constructor() {
    this.#baseUrl = this.#getBaseUrl();
    this.#live_mode = config.paypal.live_mode;
  }

  async initialize() {
    this.#accessToken = await this.#getPayPalAccessToken();
  }

  #getBaseUrl() {
    let url = "https://api-m.paypal.com/v1";
    if (!config.paypal.live_mode) {
      url = "https://api-m.sandbox.paypal.com/v1";
    }
    return url;
  }

  async #getPayPalAccessToken() {
    const PAYPAL_CLIENT_ID = this.#live_mode
      ? config.paypal.client_id
      : config.paypal.sandbox_client_id;
    const PAYPAL_CLIENT_SECRET = this.#live_mode
      ? config.paypal.client_secret
      : config.paypal.sandbox_client_secret;

    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      throw new Error(
        "Las credenciales de PayPal no están configuradas correctamente en las variables de entorno"
      );
    }

    const authString = Buffer.from(
      `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`
    ).toString("base64");

    const tokenUrl = `${this.#baseUrl}/oauth2/token`;

    try {
      const response = await fetch(tokenUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${authString}`,
        },
        body: "grant_type=client_credentials",
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error en la respuesta de PayPal:", {
          status: response.status,
          statusText: response.statusText,
          error: errorData,
        });
        throw new Error(
          `Error de autenticación con PayPal: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error("Error al obtener el token de PayPal:", error);
      throw new Error(
        "No se pudo obtener el token de acceso. Verifica las credenciales de PayPal."
      );
    }
  }

  async fetchSubscriptions() {
    try {
      const url = `${this.#baseUrl}/billing/plans/`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.#accessToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error en la respuesta de PayPal:", errorData);
        throw new Error(
          `Error al obtener el plan de suscripción: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error al consultar la app de suscripciones:", error);
      throw new Error(
        "Error en la capa de servicio al consultar un plan de suscripciones."
      );
    }
  }

  async fetchSubscriptionsDetails() {
    try {
      const response = await fetch(this.#baseUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.#accessToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error en la respuesta de PayPal:", errorData);
        throw new Error(
          `Error al obtener el plan de suscripción: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error al consultar la app de suscripciones:", error);
      throw new Error(
        "Error en la capa de servicio al consultar un plan de suscripciones."
      );
    }
  }

  async fetchSubscriptionDetails(subscriptionId) {
    try {
      const url = `${this.#baseUrl}/billing/subscriptions/${subscriptionId}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.#accessToken}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error en la respuesta de PayPal:", errorData);
        throw new Error(
          `Error al obtener el plan de suscripción: ${response.status} ${response.statusText}`
        );
      }
      const result = await response.json();
      return result;
    } catch (error) {
      console.error(
        "Error al consultar los detalles de la suscripción:",
        error
      );
      throw new Error(
        "Error en la capa de servicio al obtener los detalles de la suscripción."
      );
    }
  }

  async fetchSubscribersFromSubscriptionsPlans(plansIds) {
    try {
      let url = `${
        this.#baseUrl
      }/billing/subscriptions?plan_ids=${plansIds.join(",")}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.#accessToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error en la respuesta de PayPal:", errorData);
        throw new Error(
          `Error al obtener suscriptores: ${response.status} ${response.statusText}`
        );
      }

      const { subscriptions } = await response.json();
      const subscriptionsDetails = [];

      for (const subscription of subscriptions) {
        try {
          const subscriptionDetails = await this.fetchSubscriptionDetails(
            subscription.id
          );

          subscriptionsDetails.push(subscriptionDetails);
        } catch (error) {
          console.error("Error al obtener detalles de la suscripción:", error);
          continue;
        }
      }

      const subscribersData =
        createSubscribersDataStructure(subscriptionsDetails);

      return subscribersData;
    } catch (error) {
      console.error("Error al consultar los suscriptores de PayPal:", error);
      // Lanzamos el error para que el controlador pueda capturarlo.
      throw new Error(
        "Error en la capa de servicio al obtener los suscriptores del plan."
      );
    }
  }
}

let instance = null;

async function getPaypalInstance() {
  if (!instance) {
    instance = new PayPalService();
    await instance.initialize();
  }
  return instance;
}

module.exports = getPaypalInstance;

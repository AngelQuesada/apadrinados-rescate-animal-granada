import config from "../config/index.js";
import { createSubscribersDataStructure } from "./helpers/paypalServiceHelpers.js";
import AppError from "../utils/AppError.js";

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
      throw new AppError(
        "Las credenciales de PayPal no están configuradas correctamente en las variables de entorno",
        500
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
        throw new AppError(
          `Error de autenticación con PayPal: ${response.status} ${response.statusText}`,
          response.status
        );
      }

      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error("Error al obtener el token de PayPal:", error);
      throw new AppError(
        "No se pudo obtener el token de acceso. Verifica las credenciales de PayPal.",
        500
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
        throw new AppError(
          `Error al obtener el plan de suscripción: ${response.status} ${response.statusText}`,
          response.status
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error al consultar la app de suscripciones:", error);
      throw new AppError(
        "Error en la capa de servicio al consultar un plan de suscripciones.",
        500
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
        throw new AppError(
          `Error al obtener el plan de suscripción: ${response.status} ${response.statusText}`,
          response.status
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error al consultar la app de suscripciones:", error);
      throw new AppError(
        "Error en la capa de servicio al consultar un plan de suscripciones.",
        500
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
        throw new AppError(
          `Error al obtener el plan de suscripción: ${response.status} ${response.statusText}`,
          response.status
        );
      }
      const result = await response.json();
      return result;
    } catch (error) {
      console.error(
        "Error al consultar los detalles de la suscripción:",
        error
      );
      throw new AppError(
        "Error en la capa de servicio al obtener los detalles de la suscripción.",
        500
      );
    }
  }

  async fetchSubscribersFromSubscriptionsPlans(plansIds) {
    try {
      let url = `${this.#baseUrl}/billing/subscriptions?plan_id=${plansIds.join(
        "&plan_id="
      )}`;

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
        throw new AppError(
          `Error al obtener suscriptores: ${response.status} ${response.statusText}`,
          response.status
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
      throw new AppError(
        "Error en la capa de servicio al obtener los suscriptores del plan.",
        500
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

export default getPaypalInstance;

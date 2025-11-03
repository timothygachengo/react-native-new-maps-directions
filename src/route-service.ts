/* eslint-disable no-bitwise */
import {
  RoutingPreference,
  TravelMode,
  type RawRequest,
  type RouteRequest,
  type RouteResponseArr,
} from './types';

export class RouteService {
  private buildRequestBody = (request: RawRequest): RouteRequest => {
    return {
      origin: {
        location: {
          latLng: {
            latitude: request.origin.latitude,
            longitude: request.origin.longitude,
          },
        },
      },
      destination: {
        location: {
          latLng: {
            latitude: request.destination.latitude,
            longitude: request.destination.longitude,
          },
        },
      },
      routingPreference:
        request.routingPreference ||
        RoutingPreference.ROUTING_PREFERENCE_UNSPECIFIED,
      travelMode: request.travelMode || TravelMode.TRAVEL_MODE_UNSPECIFIED,
      units: request.units || 'METRIC',
      languageCode: request.languageCode || 'en-US',
      computeAlternativeRoutes: request.computeAlternativeRoutes || false,
    };
  };

  async getRoute(
    apiKey: string,
    request: RawRequest
  ): Promise<RouteResponseArr> {
    const routesApiUrl =
      'https://routes.googleapis.com/directions/v2:computeRoutes';
    const buildRequestHeaders = {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': '*',
    };

    const requestBody = this.buildRequestBody(request);

    const resp = await fetch(routesApiUrl, {
      method: 'POST',
      headers: buildRequestHeaders,
      body: JSON.stringify(requestBody),
    })
      .then((response) => response.json())
      .catch((error) => {
        return Promise.reject(`Error on GMAPS route request: ${error}`);
      });
    return resp;
  }

  public decodePolyline(str: string, precision: number = 5) {
    let index = 0,
      lat = 0,
      lng = 0,
      coordinates = [],
      shift = 0,
      result = 0,
      byte = null,
      latitude_change,
      longitude_change,
      factor = Math.pow(10, Number.isInteger(precision) ? precision : 5);

    // Coordinates have variable length when encoded, so just keep
    // track of whether we've hit the end of the string. In each
    // loop iteration, a single coordinate is decoded.
    while (index < str.length) {
      // Reset shift, result, and byte
      byte = null;
      shift = 1;
      result = 0;

      do {
        byte = str.charCodeAt(index++) - 63;
        result += (byte & 0x1f) * shift;
        shift *= 32;
      } while (byte >= 0x20);

      latitude_change = result & 1 ? (-result - 1) / 2 : result / 2;

      shift = 1;
      result = 0;

      do {
        byte = str.charCodeAt(index++) - 63;
        result += (byte & 0x1f) * shift;
        shift *= 32;
      } while (byte >= 0x20);

      longitude_change = result & 1 ? (-result - 1) / 2 : result / 2;

      lat += latitude_change;
      lng += longitude_change;

      coordinates.push([lat / factor, lng / factor]);
    }

    return coordinates;
  }
}

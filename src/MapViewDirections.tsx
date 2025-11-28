import React, { useState, useEffect } from 'react';
import { type MapPolylineProps, MapPolyline } from 'react-native-maps';
import { RouteService } from './route-service';
import type {
  LatLng,
  TravelMode,
  MapDirectionsLeg,
  RouteResponse,
} from './types';

export type MapViewDirectionsPrecision = 'high' | 'low';

export type MapViewDirectionsTimePrecision = 'now' | 'none';

export type MapDirectionsLegs = MapDirectionsLeg[];

export type MapDirectionsResponse = RouteResponse;

export interface MapViewDirectionsProps
  extends Omit<MapPolylineProps, 'coordinates'> {
  origin?: LatLng;
  destination?: LatLng;
  apikey: string;
  onStart?: (args: any) => any;
  onReady?: (result: MapDirectionsResponse) => any;
  onError?: (error: any) => any;
  travelMode?: TravelMode;
  languageCode?: string;
  resetOnChange?: boolean;
  coordinates?: { latitude: number; longitude: number }[];
}

export const MapViewDirections: React.FC<MapViewDirectionsProps> = (props) => {
  const [coordinates, setCoordinates] = useState<
    { latitude: number; longitude: number }[] | null
  >(null);
  const [, setDistance] = useState<number | null>(null);
  const [, setDuration] = useState<number | null>(null);
  const directionService = new RouteService();

  const resetState = () => {
    setCoordinates(null);
    setDistance(null);
    setDuration(null);
  };

  const fetchRoute = async (
    origin: LatLng,
    destination: LatLng,
    apikey: string,
    travelMode?: TravelMode,
    languageCode: string = 'en-US',
    units: string = 'METRIC'
  ) => {
    return await directionService
      .getRoute(apikey, {
        origin,
        destination,
        units: units as 'IMPERIAL' | 'METRIC',
        travelMode,
        languageCode,
      })
      .then((response) => {
        return response.routes[0];
      })
      .catch((err) => Promise.reject(`Error on GMAPS route request: ${err}`));
  };

  const fetchAndRenderRoute = async (fetchProps: MapViewDirectionsProps) => {
    const {
      origin: initialOrigin,
      destination: initialDestination,
      apikey,
      onStart,
      onReady,
      onError,
      travelMode: mode,
    } = fetchProps;

    if (!apikey) {
      console.warn('MapViewDirections Error: Missing API Key');
      return;
    }

    if (!initialOrigin || !initialDestination) {
      return;
    }

    await fetchRoute(
      initialOrigin,
      initialDestination,
      apikey,
      mode,
      fetchProps.languageCode
    )
      .then((response) => {
        if (!response) return;
        const { distanceMeters, polyline } = response;
        if (polyline.encodedPolyline) {
          // convert polyline to coordinates
          const decodedPolyline = directionService.decodePolyline(
            polyline.encodedPolyline
          );

          const dataCoordinates = decodedPolyline.map((point) => ({
            latitude: point[0] || 0,
            longitude: point[1] || 0,
          }));
          setCoordinates(dataCoordinates);
        }
        setDistance(distanceMeters);
        // setDuration(durationTime);
        if (onReady) {
          onReady(response as MapDirectionsResponse);
        }

        if (onStart) {
          onStart(response);
        }
      })
      .catch((err) => {
        if (onError) {
          onError(err);
        }
      });
  };

  useEffect(() => {
    if (props.resetOnChange) {
      resetState();
    }
    fetchAndRenderRoute(props);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.origin, props.destination, props.travelMode, props.apikey]);

  if (!coordinates) {
    return null;
  }

  return <MapPolyline {...props} coordinates={coordinates} />;
};

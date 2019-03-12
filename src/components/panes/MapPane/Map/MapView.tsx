import { GeoJsonObject } from "geojson";
import "leaflet/dist/leaflet.css";
import React from "react";
import { GeoJSON, Map, ScaleControl, TileLayer } from "react-leaflet";
import { connect } from "react-redux";
import { Site } from "../../../../api/types";
import { focusSiteId } from "../../../../state/actions";
import {
  getAllSites,
  getFocusedSiteId,
  getHabitatData,
  getStreamData
} from "../../../../state/selectors";
import { State } from "../../../../state/types";
import useBounds from "../../../../utils/useBounds";
import { styleForest, styleStreams } from "./featureStyles";
import styles from "./MapView.module.css";
import { MiniMap } from "./MiniMap";
import SiteMarkerView from "./SiteMarker";

interface MapViewProps {
  height?: number;
  width?: number;
  habitatData: GeoJsonObject | null;
  streamData: GeoJsonObject | null;
  sites: Site[];
  focusedSiteId: string | null;
  focusSite: (siteId: string) => void;
}

function MapView(props: MapViewProps) {
  const [forestRef, annotatedForestBounds] = useBounds();
  const { habitatData, streamData, sites } = props;

  return (
    <div className={styles.MapPane}>
      {habitatData && (
        <>
          <Map
            bounds={annotatedForestBounds}
            maxBounds={annotatedForestBounds}
            maxZoom={12}
            zoomControl={false}
            style={{ height: props.height, width: props.width, position: "relative" }}
          >
            <TileLayer
              url="https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg"
              attribution='Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              ext="png"
            />
            <ScaleControl position="bottomright" />
            <GeoJSON ref={forestRef} data={habitatData} style={styleForest} />
            {streamData && <GeoJSON data={streamData} style={styleStreams} />}

            {sites.map(s => (
              <SiteMarkerView key={s.id} site={s} />
            ))}
          </Map>

          <MiniMap focusedBounds={annotatedForestBounds} />
        </>
      )}
    </div>
  );
}

const mapStateToProps = (state: State) => {
  return {
    habitatData: getHabitatData(state),
    streamData: getStreamData(state),
    sites: getAllSites(state),
    focusedSiteId: getFocusedSiteId(state)
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    focusSite: (siteId: string) => {
      dispatch(focusSiteId(siteId));
    }
  };
};

const BoundMapView = connect(
  mapStateToProps,
  mapDispatchToProps
)(MapView);

export default BoundMapView;
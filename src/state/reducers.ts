import { Map, Set } from "immutable";
import { AnyAction } from "redux";
import {
  ADD_SITE_AUDIO_INFO,
  DID_FINISH_LOADING,
  DID_START_LOADING,
  FOCUS_SITE_ID,
  FOCUS_TAXON_ID,
  FOCUS_TIME_SEGMENT,
  SET_CURRENT_SITE_AUDIO_ID,
  SET_PRELOADED_DATA,
  SET_TAXA_BY_ID,
  SET_TAXA_BY_SITE,
  SET_TAXA_BY_SITE_BY_TIME
} from "./actions";
import { State } from "./types";

const initialState: State = {
  loading: 0,
  sunrise: "06:00",
  sunset: "18:00",
  habitatData: null,
  streamData: null,
  sitesById: Map(),
  siteAudioByAudioId: Map(),
  taxaById: Map(),
  taxaIdBySiteId: Map(),
  taxaIdBySiteIdByTime: Map(),
  taxaAudioById: {},
  taxaImageById: {},
  focusedSiteId: null,
  focusedTimeSegment: "09:00",
  focusedTaxonId: null,
  currentSiteAudioId: null,
  siteAudio: {
    progress: 0,
    timestamp: 0,
    duration: 0,
    isLoaded: false,
    isPlaying: false,
    isFinished: false
  },
  taxonAudio: {
    progress: 0,
    timestamp: 0,
    duration: 0,
    isLoaded: false,
    isPlaying: false,
    isFinished: false
  }
};

export default function mainReducer(state: State = initialState, action: AnyAction) {
  switch (action.type) {
    case SET_PRELOADED_DATA:
    case FOCUS_SITE_ID:
    case FOCUS_TIME_SEGMENT:
    case FOCUS_TAXON_ID:
    case SET_CURRENT_SITE_AUDIO_ID:
      return Object.assign({}, state, action.item);

    case ADD_SITE_AUDIO_INFO: {
      return Object.assign({}, state, {
        siteAudioByAudioId: state.siteAudioByAudioId.set(action.id, action.info)
      });
    }

    case DID_START_LOADING: {
      return Object.assign({}, state, {
        loading: state.loading + 1
      });
    }

    case DID_FINISH_LOADING: {
      return Object.assign({}, state, {
        loading: Math.max(0, state.loading - 1)
      });
    }

    case SET_TAXA_BY_ID: {
      const taxaById = state.taxaById.merge(action.item);
      return Object.assign({}, state, { taxaById });
    }

    case SET_TAXA_BY_SITE: {
      const { siteId } = action;
      let taxaIds = Set<string>(action.taxaIds);
      let taxaIdBySiteId = state.taxaIdBySiteId;
      if (taxaIdBySiteId.has(siteId)) {
        taxaIds = taxaIdBySiteId.get(siteId)!.merge(taxaIds);
      }
      taxaIdBySiteId = taxaIdBySiteId.set(siteId, taxaIds);
      return Object.assign({}, state, { taxaIdBySiteId });
    }

    case SET_TAXA_BY_SITE_BY_TIME: {
      const { siteId, time } = action;
      let taxaIds = Set<string>(action.taxaIds);
      let taxaIdBySiteIdByTime = state.taxaIdBySiteIdByTime;
      if (!taxaIdBySiteIdByTime.has(siteId)) {
        taxaIdBySiteIdByTime = taxaIdBySiteIdByTime.set(siteId, Map());
      }
      if (!taxaIdBySiteIdByTime.get(siteId)!.has(time)) {
        const byTime = taxaIdBySiteIdByTime.get(siteId)!.set(time, Set());
        taxaIdBySiteIdByTime = taxaIdBySiteIdByTime.set(siteId, byTime);
      }
      taxaIds = taxaIdBySiteIdByTime
        .get(siteId)!
        .get(time)!
        .merge(taxaIds);
      const byTime = taxaIdBySiteIdByTime.get(siteId)!.set(time, taxaIds);
      taxaIdBySiteIdByTime = taxaIdBySiteIdByTime.set(siteId, byTime);
      return Object.assign({}, state, { taxaIdBySiteIdByTime });
    }

    default:
      return state;
  }
}

import { Map } from "immutable";
import { applyMiddleware, compose, createStore } from "redux";
import thunk from "redux-thunk";
import initialState from "./state/initialState";
import reducer from "./state/reducers";

const w = window as any;
const composeEnhancers = w.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const state = Object.assign({}, initialState, {
  sitesById: Map(initialState.sitesById),
  siteAudioByAudioId: Map(initialState.siteAudioByAudioId),
  taxaById: Map(initialState.taxaById),
  taxaIdBySiteId: Map(),
  taxaIdBySiteIdByTime: Map(),
  taxaAudioById: Map(initialState.taxaAudioById),
  taxaImageById: Map(initialState.taxaImageById)
});

const store = createStore(reducer, state, composeEnhancers(applyMiddleware(thunk)));

export default store;

import {SET} from "../types/settingsTypes"

const initialState = {
  sidebarShow: 'responsive',
}

export default function settingsReducer(state = initialState, action){
  switch (action.type) {
    case SET:
      return {...state, sidebarShow: action.payload }
    default:
      return state
  }
}
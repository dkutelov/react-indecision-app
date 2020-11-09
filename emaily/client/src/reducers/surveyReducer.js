import { FETCH_SURVEY } from '../actions/types'

export default (state = [], action) => {
	//console.log(action)
	switch (action.type) {
		case FETCH_SURVEY:
			return action.payload
		default:
			return state
	}
}

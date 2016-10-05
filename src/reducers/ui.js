export const SWITCH_IMPORTING = 'SWITCH_IMPORTING';

const DEFAULT_STATE = {
  importing: false
};

export default function reducer (state=DEFAULT_STATE, action) {
	switch (action.type) {
		case SWITCH_IMPORTING:
			return {
				importing: !state.importing,
				...state
			};
		default:
			return state;
	}
}
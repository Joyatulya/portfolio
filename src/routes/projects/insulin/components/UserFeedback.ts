import { App_Status, Current_User_Status, Temporal_User_Status, type TRecommendation } from "../insulinAnalysis";

function text_curr_user_status(status: TRecommendation['current_user_status']) {
	let text = '';
	switch (status) {
		case Current_User_Status.HYPO:
			text = 'low sugar levels';
			break;
		case Current_User_Status.IN_RANGE:
			text = 'normal sugar levels';
			break;
		case Current_User_Status.HYPER:
			text = 'high sugar levels';
			break;
	}
	return text;
}

function text_temporal_user_status(status) {
	let text = '';
	switch (status) {
		case Temporal_User_Status.MAINTAINING:
			text = `remained the same.`;
			break;
		case Temporal_User_Status.IMPROVING:
			text = 'improved over the last 3 days.';
			break;
		case Temporal_User_Status.WORSENING:
			text = 'worsened over the last 3 days.';
			break;
	}
	return text;
}

export enum UserState {
	//Best
	STABLE = 'Stable',
	EUGLYCEMIC_MAINTAINING = 'Euglycemic Maintaining',
	HYPER_IMPROVING = 'Hyper Improving',
	HYPO_IMPROVING = 'Hypo Improving',
	//Okay
	EUGLYCEMIC_WORSENING = 'Euglycemic Worsening',
	EUGLYCEMIC_IMPROVING = 'Euglycemic Improving',
	//DANGER!!!!
	HYPER_WORSENING = 'Hyper Worsening',
	HYPO_WORSENING = 'Hypo Worsening',
}

export function determineUserState(
	glycemicState: Current_User_Status,
	temporalStatus: Temporal_User_Status
): UserState {

	switch (glycemicState) {
		case Current_User_Status.IN_RANGE:
			switch (temporalStatus) {
				case Temporal_User_Status.MAINTAINING:
					return UserState.EUGLYCEMIC_MAINTAINING;
				case Temporal_User_Status.IMPROVING:
					return UserState.EUGLYCEMIC_IMPROVING;
				case Temporal_User_Status.WORSENING:
					return UserState.EUGLYCEMIC_WORSENING;
			}
			break;

		case Current_User_Status.HYPER:
			switch (temporalStatus) {
				case Temporal_User_Status.IMPROVING:
					return UserState.HYPER_IMPROVING;
				case Temporal_User_Status.WORSENING:
					return UserState.HYPER_WORSENING;
				default:
					// Handle cases where hyperglycemia is not improving or worsening
					// You might need to define specific rules for these cases
					return UserState.HYPER_WORSENING; // Or another appropriate default
			}
			break;

		case Current_User_Status.HYPO:
			switch (temporalStatus) {
				case Temporal_User_Status.IMPROVING:
					return UserState.HYPO_IMPROVING;
				case Temporal_User_Status.WORSENING:
					return UserState.HYPO_WORSENING;
				default:
					// Handle cases where hypoglycemia is not improving or worsening
					// You might need to define specific rules for these cases
					return UserState.HYPO_WORSENING; // Or another appropriate default
			}
			break;
	}

	// Default case (should not be reached if all cases are handled)
	return UserState.STABLE; // Or another appropriate default
}

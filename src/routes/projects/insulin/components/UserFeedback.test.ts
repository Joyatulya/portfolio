import { describe, expect, it } from 'vitest';
import { determineUserState, UserState } from './UserFeedback';

// describe('determineUserState', () => {
//   it('should return EUGLYCEMIC_MAINTAINING when IN_RANGE and MAINTAINING', () => {
//     expect(determineUserState(Current_User_Status.IN_RANGE, Temporal_User_Status.MAINTAINING)).toBe(UserState.EUGLYCEMIC_MAINTAINING);
//   });
//
//   it('should return EUGLYCEMIC_IMPROVING when IN_RANGE and IMPROVING', () => {
//     expect(determineUserState(Current_User_Status.IN_RANGE, Temporal_User_Status.IMPROVING)).toBe(UserState.EUGLYCEMIC_IMPROVING);
//   });
//
//   it('should return EUGLYCEMIC_WORSENING when IN_RANGE and WORSENING', () => {
//   });
//
//   it('should return HYPER_IMPROVING when HYPER and IMPROVING', () => {
//     expect(determineUserState(Current_User_Status.HYPER, Temporal_User_Status.IMPROVING)).toBe(UserState.HYPER_IMPROVING);
//   });
//
//   it('should return HYPER_WORSENING when HYPER and WORSENING', () => {
//     expect(determineUserState(Current_User_Status.HYPER, Temporal_User_Status.WORSENING)).toBe(UserState.HYPER_WORSENING);
//   });
//
//   it('should return HYPER_WORSENING when HYPER and neither IMPROVING nor WORSENING (default case)', () => {
//     // Assuming you have a "NEUTRAL" or similar enum value in Temporal_User_Status
//     // If not, you can mock the behavior.
//     expect(determineUserState(Current_User_Status.HYPER, Temporal_User_Status.MAINTAINING)).toBe(UserState.HYPER_WORSENING);
//   });
//
//   it('should return HYPO_IMPROVING when HYPO and IMPROVING', () => {
//     expect(determineUserState(Current_User_Status.HYPO, Temporal_User_Status.IMPROVING)).toBe(UserState.HYPO_IMPROVING);
//   });
//
//   it('should return HYPO_WORSENING when HYPO and WORSENING', () => {
//     expect(determineUserState(Current_User_Status.HYPO, Temporal_User_Status.WORSENING)).toBe(UserState.HYPO_WORSENING);
//   });
//
//     it('should return HYPO_WORSENING when HYPO and neither IMPROVING nor WORSENING (default case)', () => {
//         expect(determineUserState(Current_User_Status.HYPO, Temporal_User_Status.MAINTAINING)).toBe(UserState.HYPO_WORSENING);
//     });
//
//   it('should return STABLE as a default if no other case is met (though unlikely with current logic)', () => {
//       //To test this we need to make the switch not exhaustive
//       const oldDetermineUserState = determineUserState;
//       const brokenDetermineUserState = (
//           glycemicState: Current_User_Status,
//           temporalStatus: Temporal_User_Status
//       ): UserState => {
//
//           switch (glycemicState) {
//               case Current_User_Status.IN_RANGE:
//                   switch (temporalStatus) {
//                       case Temporal_User_Status.MAINTAINING:
//                           return UserState.EUGLYCEMIC_MAINTAINING;
//                       case Temporal_User_Status.IMPROVING:
//                           return UserState.EUGLYCEMIC_IMPROVING;
//                       case Temporal_User_Status.WORSENING:
//                           return UserState.EUGLYCEMIC_WORSENING;
//                   }
//                   break;
//           }
//           return UserState.STABLE;
//       };
//       expect(brokenDetermineUserState(Current_User_Status.HYPO, Temporal_User_Status.MAINTAINING)).toBe(UserState.STABLE);
//   });
// });

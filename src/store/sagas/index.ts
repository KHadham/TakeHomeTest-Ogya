import { all } from "redux-saga/effects";
import repoSaga from "./repoSaga";
// Import other sagas here (like userSaga) when you create them

export default function* rootSaga() {
  yield all([
    repoSaga(),
    // userSaga(),
  ]);
}

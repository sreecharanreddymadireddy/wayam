import { createStore, combineReducers } from 'redux';
import formDataReducer from './formDataReducer'; // Check the import path

const rootReducer = combineReducers({
    formData: formDataReducer,
    // ... other reducers if you have them
});

const store = createStore(rootReducer);

export default store;

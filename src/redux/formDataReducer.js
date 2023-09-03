const initialState = {
    awdId: '',
    awdRegion: '',
    planType: '',
    services: [],
};

const formDataReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_FORM_DATA':
            return {
                ...state,
                ...action.payload,
            };
        default:
            return state;
    }
};

export default formDataReducer;

//slice contain logic to maintain every feature state of the 
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    // there is no user becaure user did not signup
    currentUser: null,
    loading: false,
    error:null,
};

const userSlice = createSlice({
    name:"user",
    initialState,
    reducers:{
        signInStart:(state)=>{
            // this is just like as we we write setloadign(true) in login page
            state.loading = true;
        },
        signInSuccess:(state,action /*payload or data which we get from backend*/)=>{
            state.currentUser = action.payload;// payload is data which we get from backend
            state.loading=false;
            state.error = null; 
        },
        signInFailure:(state,action)=>{
            state.loading = false;
            state.error = action.payload;// if this is the error which we receive from the backend            
        }
    }

})
//  need to export funtion/ action and reducer
export const {signInStart, signInSuccess, signInFailure} = userSlice.actions;
export default userSlice.reducer;
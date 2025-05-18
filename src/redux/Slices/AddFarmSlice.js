import {  createSlice } from "@reduxjs/toolkit";



 const AddFarmSlice = createSlice({
    name : "createFarm",
    initialState : {
        loading : '',
    },
    reducers :{
        notification : (state , action)=>{
            state.loading = action.payload
           
        }

    }
    
})


export const { notification  } = AddFarmSlice.actions;
export default AddFarmSlice.reducer;

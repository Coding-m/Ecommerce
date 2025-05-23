 const initialState = {
  user: JSON.parse(localStorage.getItem("auth")) || null,
  address: [],
};



export const authReducer=(state=initialState,action)=>{

 switch(action.type){
    case 'LOGIN_USER':
        return {...state,user:action.payload};

     default:
        return state   ;
 }


    
}
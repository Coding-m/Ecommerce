 const initialState = {
  user: JSON.parse(localStorage.getItem("auth")) || null,
  address: [],
  selectedUserCheckoutAddress:null,
};



export const authReducer=(state=initialState,action)=>{

 switch(action.type){
    case 'LOGIN_USER':
        return {...state,user:action.payload};
   

    case 'USER_ADDRESS':
      return {...state,address:action.payload};


      case 'SELECT_CHECKOUT_ADDRESS':
        return {...state,selectedUserCheckoutAddress:action.payload};

        case 'LOGOUT_USER':
         return {...state,user:null,address:null};

         case 'REMOVE_CHECKOUT_ADDRESS':
         return {...state,selectedUserCheckoutAddress:null};

     default:
        return state   ;
 }


    
}
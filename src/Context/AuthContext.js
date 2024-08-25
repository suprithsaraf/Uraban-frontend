// import { createContext, useContext  , useReducer } from 'react' 

// const AuthContext = createContext() 

// export const useAuth = () => {
//     return useContext(AuthContext)
// }

// const reducer = (state, action) => {
//     switch(action.type) {
//         case 'LOGIN' : {
//             return {...state, isLoggedIn: true, account: action.payload.account }
//         }
//         case 'Logout' : {
//             return {...state, isLoggedIn: false, account: null} 
//         }
//         default: {
//             return {...state} 
//         }
//     }
// }

// export const AuthProvider = ({ children }) => {
//     const [user, dispatch] = useReducer(reducer, {
//         isLoggedIn: false, 
//         account:null
//     })
   
    
//     return (
//         <AuthContext.Provider value={{ user, dispatch}}>
//             { children }
//         </AuthContext.Provider>
//     )
// }
import { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN': {
      return { ...state, isLoggedIn: true, account: action.payload.account };
    }
    case 'LOGOUT': {
      return { ...state, isLoggedIn: false, account: null };
    }
    default: {
      return { ...state };
    }
  }
};

export const AuthProvider = ({ children }) => {
  const [user, dispatch] = useReducer(reducer, {
    isLoggedIn: !!localStorage.getItem('token'),
    account: null,
  });

  useEffect(() => {
    const fetchUser = async () => {
      if (localStorage.getItem('token')) {
        try {
          const response = await axios.get('http://localhost:3017/users/account', {
            headers: {
              Authorization: localStorage.getItem('token'),
            },
          });
          dispatch({ type: 'LOGIN', payload: { account: response.data } });
        } catch (error) {
          console.error('Error fetching user data', error);
        }
      }
    };
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

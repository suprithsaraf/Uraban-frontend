import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {BrowserRouter} from "react-router-dom"
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AuthProvider } from './Context/AuthContext'; 
// import { Provider } from 'react-redux';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <AuthProvider>
    <BrowserRouter>
    <ToastContainer autoClose={3000} pauseOnHover={false}  />
<App />
     </BrowserRouter>
    </AuthProvider>

);

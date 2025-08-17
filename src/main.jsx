
import { createRoot } from 'react-dom/client'
import './index.css'
// 

import {BrowserRouter} from "react-router-dom"

import App from './App'
import AuthWrapper from './Components/AuthContext'



createRoot(document.getElementById('root')).render(
   
   <AuthWrapper>
   <BrowserRouter>
    <App></App>
    {/* <Routing_App></Routing_App>
    <User></User> */}
    </BrowserRouter>
    </AuthWrapper>
    
)

import { useState } from "react"
import { Route, Routes } from "react-router-dom"
import Login from "./Components/Login"
import PageNotFound from "./Components/PageNotFound"
import Home from "./Components/Home"
import ProtectedRoute from "./Components/ProtectedRoute"
import { useEffect } from "react"
import './App.css';
import { ThemeProvider } from "./Components/ThemeContext"

// export const ThemeWrapper1 = React.createContext();

function App() {
  
  // const [isDark, updateTheme] = useState(false)
  // const handleToggleTheme =()=>{
  //     updateTheme(!isDark)
  // }
   


  return (
    <>
      {/* <h1>WhatsApp Clone</h1> */}
      <ThemeProvider>
      <Routes>
      <Route path="/" element={<ProtectedRoute>
      <Home></Home>
     </ProtectedRoute>}></Route>
     <Route path="/:chatId" element={
      <ProtectedRoute>
        <Home></Home>
      </ProtectedRoute>
     }></Route>
     <Route path="/login" element={<Login></Login>}></Route>
      <Route path="*" element={<PageNotFound></PageNotFound>}></Route>
      </Routes>
</ThemeProvider>
    </>
  )
}
// export {handleToggleTheme}
export default App

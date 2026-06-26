import {ProduitIndex} from "./pages/produit/ProduitIndex.jsx";
import {ProduitDetail} from "./pages/produit/ProduitDetail.jsx";
import {ProduitCreate} from "./pages/produit/ProduitCreate.jsx";
import {EnchereIndex} from "./pages/enchere/EnchereIndex.jsx";
import {Login} from "./pages/auth/Login.jsx";
import {Register} from "./pages/auth/Register.jsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import {Navbar} from "./includes/Navbar.jsx";
import { AuthProvider } from "./contexts/authContext.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {

  return (
    <>
        <BrowserRouter>
            <AuthProvider>
                <Navbar/>
                  <Routes>
                      <Route path="/" element={<ProduitIndex />} />
                      <Route path={"/produits"} element={<ProduitIndex />} />
                      <Route path={"/produits/nouveau"} element={<ProduitCreate />} />
                      <Route path={"/produits/:id"} element={<ProduitDetail />} />
                      <Route path={"/encheres"} element={<EnchereIndex />} />
                      <Route path={"/login"} element={<Login />} />
                      <Route path={"/register"} element={<Register />} />
                  </Routes>
                <ToastContainer position="top-right" autoClose={4000} />
            </AuthProvider>
        </BrowserRouter>
    </>
  )
}

export default App

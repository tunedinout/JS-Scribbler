
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css'
import HomePage from './pages/HomePage'
import { AuthProvider } from './auth/AuthProvider'


function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <HomePage
                            />
                        }
                    />
                </Routes>
            </Router>
        </AuthProvider>
    )
}
export default App

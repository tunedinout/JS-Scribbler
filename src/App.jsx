
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import './App.css'
import HomePage from './pages/HomePage'
import { AuthProvider } from './auth/AuthProvider'


function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route
                        path="/JS-Scribbler"
                        element={
                            <HomePage
                            />
                        }
                    />
                    <Route path='*' element={<Navigate to="/JS-Scribbler" replace />}/>
                </Routes>
            </Router>
        </AuthProvider>
    )
}
export default App

import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/index.js';
import { AuthProvider } from  './contexts/AuthContext.js'
import './index.css'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

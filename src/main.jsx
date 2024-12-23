import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';

import Login from './components/Login.jsx';
import Home from './components/Home.jsx';
import Register from './components/Register.jsx';
import NotFoundPage from './components/NotFoundPage.jsx';
import Root from './components/Root.jsx';
import Authprovider from './components/AuthProvider.jsx';
import RoomsPage from './components/RoomsPage.jsx';
import RoomDetailsPage from './components/RoomDetailsPage.jsx';
import PrivateRoutes from './components/PrivateRoutes.jsx';
import MyBookingsPage from './components/MyBookingsPage.jsx';




const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement:<NotFoundPage></NotFoundPage>,
    children: [
      {
        path: '/',
        element: <Home></Home>,
        
      },
      {
        path: '/rooms',
        element: <RoomsPage></RoomsPage>,
        
      },
      {
         path: '/rooms/:roomId',
       element:<RoomDetailsPage></RoomDetailsPage>
      },
      {
        path: '/my-booking',
      element:<PrivateRoutes><MyBookingsPage></MyBookingsPage></PrivateRoutes>
     },

      
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/register',
        element: <Register />,
      },
      
    ],
  },
  
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Authprovider>
      <RouterProvider router={router} />
    </Authprovider>
  </StrictMode>
);
import express from 'express'

import { SignupSchema } from '../ValidationSchema/SignupSchema.js';
import SignupController from '../controllers/Signup.controller.js';
import { LoginSchema } from '../ValidationSchema/LoginSchema.js';
import LoginController from '../controllers/Login.controller.js';
import LogoutController from '../controllers/Logout.controller.js';
import GetUsersController from '../controllers/GetUsers.controller.js';
import AddUserController from '../controllers/AddUser.controller.js';
import DeleteUserController from '../controllers/DeleteUser.controller.js';
import UpdatePasswordController from '../controllers/UpdatePassword.controller.js';
import getArtists from '../controllers/GetArtists.controller.js';
import { ArtistSchema } from '../ValidationSchema/ArtistSchema.js';
import addArtist from '../controllers/AddArtist.controller.js';
import GetArtistControllerById from '../controllers/GetArtistById.controller.js';
const apiRoute=express.Router();

// apiRoute.post('/login',(req,res)=> res.send('login'))
apiRoute.post('/signup',SignupSchema, SignupController)
apiRoute.post('/login',LoginSchema,LoginController)
apiRoute.post('/logout', LogoutController)
apiRoute.get('/users', GetUsersController);
apiRoute.post('/users/add-user', AddUserController);
apiRoute.delete('/users/:user_id', DeleteUserController);
apiRoute.put('/users/update-password',UpdatePasswordController)

apiRoute.get('/artists',ArtistSchema, getArtists);
apiRoute.post('/artists/add-artist',addArtist)
apiRoute.get('/artists/:artist_id', GetArtistControllerById );
export default apiRoute;
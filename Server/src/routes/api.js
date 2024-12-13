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
import updateArtist from '../controllers/UpdateArtist.controller.js';
import deleteArtist from '../controllers/DeleteArtist.controller.js';
import addAlbum from '../controllers/AddAlbum.controller.js';
import getAlbums from '../controllers/GetAlbums.controller.js';
import deleteAlbum from '../controllers/DeleteAlbum.controller.js';
import GetAlbumControllerById from '../controllers/GetAlbumById.controller.js';
import updateAlbum from '../controllers/UpdateAlbum.controller.js';
import addTrack from '../controllers/AddTrack.controller.js';
import updateTrack from '../controllers/UpdateTrack.controller.js';
import deleteTrack from '../controllers/DeleteTrack.controller.js';
import GetTrackControllerById from '../controllers/GetTrackById.controller.js';
import getAllTracks from '../controllers/getTracks.controller.js';
import addFavorite from '../controllers/AddFavourites.controller.js';
import getFavoritesByCategory from '../controllers/GetFavouritesByCategory.controller.js';
import removeFavorite from '../controllers/removeFavourite.controller.js';
const apiRoute=express.Router();

apiRoute.post('/signup',SignupSchema, SignupController)
apiRoute.post('/login',LoginSchema,LoginController)
apiRoute.post('/logout', LogoutController)
apiRoute.get('/users', GetUsersController);
apiRoute.post('/users/add-user', SignupSchema,AddUserController);
apiRoute.delete('/users/:user_id', DeleteUserController);
apiRoute.put('/users/update-password',UpdatePasswordController)

apiRoute.get('/artists',ArtistSchema, getArtists);
apiRoute.post('/artists/add-artist',addArtist)
apiRoute.get('/artists/:artist_id', GetArtistControllerById );
apiRoute.put('/artists/:artist_id', updateArtist);
apiRoute.delete('/artists/:artist_id',deleteArtist);

apiRoute.post('/albums/add-album', addAlbum);
apiRoute.get('/albums', getAlbums);
apiRoute.delete('/albums/:album_id', deleteAlbum);
apiRoute.get('/albums/:album_id', GetAlbumControllerById);
apiRoute.put('/albums/:album_id', updateAlbum);

apiRoute.post('/tracks/add-track', addTrack);
apiRoute.get('/tracks', getAllTracks);
apiRoute.put('/tracks/:track_id', updateTrack);
apiRoute.delete('/tracks/:track_id', deleteTrack);
apiRoute.get('/tracks/:track_id', GetTrackControllerById);

apiRoute.post('/favorites/add-favorite',addFavorite)
apiRoute.get('/favorites/:category',getFavoritesByCategory)
apiRoute.delete('/favorites/remove-favourite/:id', removeFavorite)
export default apiRoute;
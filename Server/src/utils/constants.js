
export const DB_CONNECT = 'mongodb://mahamadalipatwegar:ali123@cluster1-shard-00-00.6b3y3.mongodb.net:27017,cluster1-shard-00-01.6b3y3.mongodb.net:27017,cluster1-shard-00-02.6b3y3.mongodb.net:27017/music_library_management?ssl=true&replicaSet=atlas-mmi46y-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster1'

export const JWT_TOKEN_SECRET="wgrhhyhrhjgbgvbe";

export const Statuscode={
    success:201,
    bad_request:400,
    unprocessable:409,
    logout_success:200,
    unauthorized:401,
    forbidden:403,
    not_found:404,
    password_sucess:204
}
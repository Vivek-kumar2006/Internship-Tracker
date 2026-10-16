import  {Redis} from 'ioredis'

const redisClient = new Redis
(
    process.env.REDIS_URL || 'redis://localhost:6379'
)

redisClient.on('error', 
    (err)=> console.error('Redis Error',err))

 //await redisClient.connect();
 
 
 export const blackListToken = async (jti:String ,exp:number):Promise<void>=>
    {
        const currentTime=Math.floor(Date.now()/1000)
        const remainingTime= exp-currentTime

        if (remainingTime <=0 ) {
            return
        }
      await redisClient.set(`bl:${jti}`, 'revoked', 'EX', remainingTime)
    }

    export const isTokenBlacklisted = async (jti: string): Promise<boolean> => {
  const result = await redisClient.exists(`bl:${jti}`);
  return result === 1;
};

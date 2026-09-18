import { z} from 'zod'

export const RegisterUserSchema=z.object
(
    {
        name:z.string(),
        email:z.string().email("Invalid Email"),
        password:z.string().min(6,"Password is too short"),
        phone:z.string()
    }
)
/*
 name               String
  email              String          @unique
  phone              String          @unique
  password           String
  role     
* */
export const LoginUserSchema=z.object
(
    {
       // name:z.string(),
        email:z.string().email("Invalid Email"),
        password:z.string().min(6,"Password is too short"),
        //phone:z.number()

    }
)

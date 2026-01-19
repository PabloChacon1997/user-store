import { bcrytpAdapter, JwtAdapter } from "../../config";
import { UserModel } from "../../data";
import { CustomError, LoginUserDto, RegisterUserDto, UserEntity } from "../../domain";



export class AuthService {
  // DI
  constructor() {}

  public async registerUser(registerUserDto: RegisterUserDto) {
    const existUser = await UserModel.findOne({ email: registerUserDto.email });
    if (existUser) throw CustomError.badRequest('Email already exist');

    try {
      const user = new UserModel(registerUserDto);
      // Encriptar la contraseña
      user.password = bcrytpAdapter.hash(registerUserDto.password);
      await user.save();
      // JWT para mantener la autenticación
      // Email de confirmación

      const {password, ...userEntity} = UserEntity.fromObject(user);
      return {
        user: userEntity,
        token: 'ABC'
      };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  public async loginUser(loginUserDto: LoginUserDto) {

    const user = await UserModel.findOne({ email: loginUserDto.email });
    if (!user) throw CustomError.badRequest('Email not exist');

    const isMatching = bcrytpAdapter.compare(loginUserDto.password, user.password);
    if (!isMatching) throw CustomError.badRequest('Password is not valid');
    const {password, ...userEntity} = UserEntity.fromObject(user);

    const token = await JwtAdapter.generateToken({ id: user.id });
    if (!token) throw CustomError.internalServer('Error while creatin jwt');
    return {
      user: userEntity,
      token,
    }
  }
}
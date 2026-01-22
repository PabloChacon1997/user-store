import { bcrytpAdapter, envs, JwtAdapter } from "../../config";
import { UserModel } from "../../data";
import { CustomError, LoginUserDto, RegisterUserDto, UserEntity } from "../../domain";
import { EmailService } from "./email.service";



export class AuthService {
  // DI
  constructor(
    private readonly emailService: EmailService,
  ) {}

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
      const token = await this.sendEmailValidation(user.email);

      const {password, ...userEntity} = UserEntity.fromObject(user);
      return {
        user: userEntity,
        token,
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
    if (!token) throw CustomError.internalServer('Error while creating jwt');
    return {
      user: userEntity,
      token,
    }
  }

  private sendEmailValidation = async (email: string) => {
    const token = await JwtAdapter.generateToken({email});
    if(!token) throw CustomError.internalServer('Error getin token');

    const link = `${envs.WEBSERVICE_URL}/auth/validate-email/${token}`;
    const html = `
    <h1>Validate your email</h1>
    <p>Clieck on the following to validate your email</p>
    <a href="${link}">Validate your email: ${email}</a>
    `;

    const options = {
      to: email,
      subject: 'Validate your email',
      htmlBody: html,
    }

    const isSet =  await this.emailService.sendEmail(options);
    if(!isSet) throw CustomError.internalServer('Error sending email');
    return token;
  }

  public validateEmail = async (token: string) => {
    const payload = await JwtAdapter.valdidateToken(token);
    if (!payload) throw CustomError.unauthorized('Invalid token');
    const { email } = payload as {email: string};
    if(!email) throw CustomError.internalServer('Email not in token');
    const user = await UserModel.findOne({email});
    if(!user) throw CustomError.internalServer('Email not exists');
    user.emailValidated = true;
    await user.save();
    return true;
  }
}
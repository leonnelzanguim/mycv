import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Query,
  Delete,
  Patch,
  NotFoundException,
  HttpCode,
  Session,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UserService } from '../services/user.service';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { Serialize } from '../../interceptors/serialize.interceptor';
import { UserDto } from '../dtos/user.dto';
import { AuthService } from '../services/auth.service';
import { CurrentUser } from '../decorators/current-user.decorator';
import { User } from '../entities/user.entity';
import { AuthGuard } from '../../guards/auth.guard';

@Controller('auth')
@Serialize(UserDto)
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  //   @Get('/whoami')
  //   whoAmI(@Session() session: any) {
  //     console.log(session.userId);
  //     return this.userService.findOne(session.userId);
  //   }

  @Get('/whoami')
  @UseGuards(AuthGuard)
  whoAmI(@CurrentUser() user: User) {
    return user;
  }

  @Post('/signout')
  signOut(@Session() session: any) {
    session.userId = null;
  }

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signup(body.email, body.password);
    session.userId = user.id;
    console.log('session ', session.userId);
    return user;
  }

  @Post('/signin')
  @HttpCode(200)
  async signin(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signin(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Get('/users')
  getAllUsers() {
    return this.userService.findAll();
  }

  //   @UseInterceptors(new SerializeInterceptor(UserDto))
  @Get(':id')
  findUser(@Param('id') id: string) {
    const user = this.userService.findOne(parseInt(id));
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }

  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.userService.find(email);
  }

  @Delete(':id')
  removeUser(@Param('id') id: string) {
    return this.userService.remove(parseInt(id));
  }

  @Patch(':id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.userService.update(parseInt(id), body);
  }
}

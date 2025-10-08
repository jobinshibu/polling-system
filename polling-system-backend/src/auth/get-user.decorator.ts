import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  if (!request.user) throw new Error('User not found in request');
  return data ? request.user[data] : request.user;
});
import { Injectable } from '@angular/core';
import { UsersService } from '../../user/services/users.service';
import { OperationKey } from '../models/operationKey';

@Injectable({
  providedIn: 'root'
})
export class DecoratorFactoryService {

  constructor(Users:UsersService) { }
  offline(){
    return function  offline(operation:OperationKey):any{
      console.log('decorating')
      return (target: Object, 
         propertyKey: string, 
         descriptor: TypedPropertyDescriptor<any>)=>{
         console.log('decorated target ',target)
         console.log('property key',propertyKey)
         console.log('descriptor',descriptor)
         console.log('descriptor value',descriptor.value)
         const childFunction = descriptor.value;
         descriptor.value =async (...args: any[])=> {
            console.log('args',args)
            childFunction.apply(target.constructor, args);
            return descriptor
         }
      }
   }
  }
}

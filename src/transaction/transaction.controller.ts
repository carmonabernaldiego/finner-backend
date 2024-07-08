import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { Transaction } from './transaction.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll(): Promise<Transaction[]> {
    return this.transactionService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Transaction> {
    return this.transactionService.findOneById(+id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() transaction: Transaction): Promise<Transaction> {
    return this.transactionService.create(transaction);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() transaction: Transaction,
  ): Promise<Transaction> {
    return this.transactionService.update(+id, transaction);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.transactionService.remove(+id);
  }
}
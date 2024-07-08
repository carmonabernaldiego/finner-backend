import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  findAll(): Promise<Transaction[]> {
    return this.transactionRepository.find();
  }

  findOneById(id: number): Promise<Transaction> {
    return this.transactionRepository.findOne({
      where: { id },
    });
  }

  async create(transaction: Transaction): Promise<Transaction> {
    try {
      return await this.transactionRepository.save(transaction);
    } catch (error) {
      if (error.code === 'ER_NO_DEFAULT_FOR_FIELD') {
        throw new ConflictException('Missing required field');
      }
      throw error;
    }
  }

  async update(id: number, transaction: Transaction): Promise<Transaction> {
    try {
      await this.transactionRepository.update(id, transaction);
      return this.findOneById(id);
    } catch (error) {
      if (error.code === 'ER_NO_DEFAULT_FOR_FIELD') {
        throw new ConflictException('Missing required field');
      }
      throw error;
    }
  }

  async remove(id: number): Promise<{ message: string }> {
    const result = await this.transactionRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
    return { message: `Transaction with ID ${id} deleted successfully` };
  }
}

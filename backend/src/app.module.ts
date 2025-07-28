import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotesModule } from './notes/notes.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    MongooseModule.forRoot(
       'mongodb+srv://vijaylooprai:OsRmHV5sIjLkxraY@cluster0.tkeqxww.mongodb.net/notes-app'
    ),
    NotesModule,
    UsersModule,
  ],
})
export class AppModule {}
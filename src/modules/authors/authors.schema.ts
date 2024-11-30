import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'

@Schema()
export class Author {

    @ApiProperty()
    @Prop({ required: true })
    name: string

    @ApiProperty()
    @Prop({ required: true })
    age: number

    @ApiProperty()
    @Prop({ required: true })
    nationality: string

    @ApiProperty()
    @Prop({ required: true })
    description: string
}


export const AuthorSchema = SchemaFactory.createForClass(Author)
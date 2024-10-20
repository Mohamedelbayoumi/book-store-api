import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

@Schema()
export class User {

    @Prop({ required: true })
    first_name: string

    @Prop({ required: true })
    last_name: string

    @Prop({ unique: true, required: true })
    email: string

    @Prop({ unique: true, required: true })
    phone_number: string

    @Prop({
        type: {
            country: { type: String },
            state: { type: String },
            city: { type: String },
            street: { type: String },
            building_description: { type: String },
            floor_number: { type: Number }
        },
        required: true,
        _id: false
    })
    address: Record<string, any>

    @Prop({ required: true })
    password: string

    @Prop()
    isAdmin: boolean
}

export const UserSchema = SchemaFactory.createForClass(User)
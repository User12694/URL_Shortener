import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Link {
    //Định danh theo ID
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({unique: true})
    name: string;

    @Column()
    url: string;

}

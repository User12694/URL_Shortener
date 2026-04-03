import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Link } from "./entities/links.entity";

@Injectable()
export class LinksRepository extends Repository<Link> {
    constructor(private dataSource: DataSource) {
        super(Link, dataSource.createEntityManager());
    }

    async findDuplicate(name: string, url: string): Promise<Link | null> {
        return this.findOne({
            where: [{ name }, { url }],
        });
    }
}
import { Entity, EntityRepository, Repository } from "typeorm";
import {Link } from "./entities/links.entity";

@EntityRepository(Link)
export class LinkRepository extends Repository<Link> {
    
}
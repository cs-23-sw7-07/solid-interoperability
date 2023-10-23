class AccessMode {
    read: boolean;
    write: boolean;
    update: boolean;
    create: boolean;
    remove: boolean;
    append: boolean;
    constructor(
        read: boolean,
        write: boolean,
        update: boolean,
        create: boolean,
        remove: boolean,
        append: boolean
    ) {
        this.read = read;
        this.write = write;
        this.update = update;
        this.create = create;
        this.remove = remove;
        this.append = append;
    }

    generateAclString(): string {
        const aclProperties: string[] = [];

        if (this.read) {
            aclProperties.push('acl:Read');
        }
        if (this.write) {
            aclProperties.push('acl:Write');
        }
        if (this.update) {
            aclProperties.push('acl:Update');
        }
        if (this.create) {
            aclProperties.push('acl:Create');
        }
        if (this.remove) {
            aclProperties.push('acl:Delete');
        }
        if (this.append) {
            aclProperties.push('acl:Append');
        }

        return aclProperties.join(', ');
    }
}

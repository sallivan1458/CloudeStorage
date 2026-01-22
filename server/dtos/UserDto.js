class UserDto {
    constructor(model) {
        this.id = model._id;
        this.email = model.email;
        // this.password = model.password;
        this.diskSpace = model.diskSpace;
        this.usedSpace = model.usedSpace;
        this.avatar = model.avatar;
    }
}

export default UserDto;